import os
import shutil
from flask import Flask, request, render_template, jsonify, send_file, flash, url_for, session
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from openai import AzureOpenAI
import io
import uuid

# Import all necessary functions and constants from utils.py
from utils import (
    read_docx, read_pdf, read_pptx, process_rubric_excel,
    unzip_file,
    collect_project_content,
    generate_grading_with_openai,
    generate_styled_excel_report,
    # DOCUMENT_PROJECT_EXTENSIONS is still used from utils for requirements file validation
    DOCUMENT_PROJECT_EXTENSIONS 
)

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)

app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 1000 * 1024 * 1024 # 1 GB total limit
app.config['DOWNLOAD_FOLDER'] = os.path.join(app.config['UPLOAD_FOLDER'], 'downloads')

# Constants for file size limits
MAX_RUBRIC_SIZE_BYTES = 25 * 1024 * 1024 # 25 MB
MAX_REQUIREMENT_SIZE_BYTES = 25 * 1024 * 1024 # 25 MB

# Define ALLOWED_RUBRIC_EXTENSIONS directly in app.py as it's primarily used here for validation
ALLOWED_RUBRIC_EXTENSIONS = {'.xlsx', '.xls', '.csv'}

# Ensure the upload folder and its subdirectories exist on startup
def ensure_upload_dirs():
    """Creates necessary directories for file uploads and downloads if they don't exist."""
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['DOWNLOAD_FOLDER'], exist_ok=True)
    os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'rubrics'), exist_ok=True)
    os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'projects'), exist_ok=True)
    os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'requirements'), exist_ok=True)


# Azure OpenAI configuration
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_NAME")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")

# Initialize Azure OpenAI clients
chat_client = None

if all([AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_CHAT_DEPLOYMENT_NAME, AZURE_OPENAI_API_VERSION]):
    try:
        chat_client = AzureOpenAI(
            azure_endpoint=AZURE_OPENAI_ENDPOINT,
            api_key=AZURE_OPENAI_API_KEY,
            api_version=AZURE_OPENAI_API_VERSION
        )
        print("Azure OpenAI chat client initialized successfully.")
    except Exception as e:
        print(f"Error initializing Azure OpenAI chat client: {e}")
        chat_client = None
else:
    print("Azure OpenAI chat credentials are not fully set in .env file. AI chat features will be disabled.")

session_download_files = {}

def _validate_uploaded_file(file_obj, allowed_extensions, max_size_bytes, file_type_name):
    """
    Validates an uploaded file based on extension and size.
    Returns (error_message, status_code) on failure, None on success.
    """
    if not file_obj:
        return f"No {file_type_name} file provided.", 400
    file_ext = os.path.splitext(file_obj.filename)[1].lower()
    if file_ext not in allowed_extensions:
        return f"Unsupported {file_type_name} file type: {file_ext}. Allowed: {', '.join(allowed_extensions)}.", 400
    if hasattr(file_obj, 'content_length') and file_obj.content_length and file_obj.content_length > max_size_bytes:
        return f"{file_type_name} file exceeds the {max_size_bytes / (1024*1024):.0f} MB limit.", 413
    return None, None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_project():
    ensure_upload_dirs()
    rubric_file = request.files.get('rubricFile')
    project_zip_file_upload = request.files.get('projectZip')
    requirements_file = request.files.get('requirementsFile')
    error_msg, status_code = _validate_uploaded_file(rubric_file, ALLOWED_RUBRIC_EXTENSIONS, MAX_RUBRIC_SIZE_BYTES, "rubric")
    if error_msg:
        flash(error_msg, 'error')
        return jsonify({"error": error_msg}), status_code
    error_msg, status_code = _validate_uploaded_file(project_zip_file_upload, {'.zip'}, app.config['MAX_CONTENT_LENGTH'], "project zip")
    if error_msg:
        flash(error_msg, 'error')
        return jsonify({"error": error_msg}), status_code
    error_msg, status_code = _validate_uploaded_file(requirements_file, DOCUMENT_PROJECT_EXTENSIONS, MAX_REQUIREMENT_SIZE_BYTES, "requirements")
    if error_msg:
        flash(error_msg, 'error')
        return jsonify({"error": error_msg}), status_code

    request_id = str(uuid.uuid4())
    temp_upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], f"request_{request_id}")
    os.makedirs(temp_upload_dir, exist_ok=True)
    rubric_path = os.path.join(temp_upload_dir, secure_filename(rubric_file.filename))
    project_zip_path = os.path.join(temp_upload_dir, secure_filename(project_zip_file_upload.filename))
    requirements_path = os.path.join(temp_upload_dir, secure_filename(requirements_file.filename))
    try:
        rubric_file.save(rubric_path)
        project_zip_file_upload.save(project_zip_path)
        requirements_file.save(requirements_path)
        if not unzip_file(project_zip_path, temp_upload_dir): 
            flash("Failed to unzip project archive.", 'error')
            return jsonify({"error": "Failed to unzip project archive."}), 400
        rubric_data_markdown_for_ai, original_rubric_dataframe = process_rubric_excel(rubric_path)
        if rubric_data_markdown_for_ai is None or original_rubric_dataframe is None:
            flash("Failed to process rubric.", 'error')
            return jsonify({"error": "Failed to process evaluation rubric."}), 400
        project_text_files_content, image_messages_for_ai, video_files_detected = collect_project_content(temp_upload_dir)
        if requirements_file.filename.lower().endswith('.docx'):
            requirements_text = read_docx(requirements_path)
        elif requirements_file.filename.lower().endswith('.pdf'):
            requirements_text = read_pdf(requirements_path)
        elif requirements_file.filename.lower().endswith('.pptx'):
            requirements_text = read_pptx(requirements_path)
        if requirements_text is None:
            flash("Failed to read requirements file.", 'error')
            return jsonify({"error": "Failed to read requirements file."}), 500
        error_message, grading_breakdown_list, overall_parsed_result = generate_grading_with_openai(
            chat_client, original_rubric_dataframe, rubric_data_markdown_for_ai,
            requirements_text, project_text_files_content, image_messages_for_ai, bool(video_files_detected)
        )
        if error_message:
            flash(error_message, 'error')
            return jsonify({"error": error_message}), 500
        original_project_file_name = os.path.splitext(project_zip_file_upload.filename)[0]
        excel_filename = f"{original_project_file_name}_Grading_Report.xlsx" 
        excel_bytes, report_df_for_html = generate_styled_excel_report(
            original_rubric_dataframe, grading_breakdown_list, overall_parsed_result
        )
        df_html = report_df_for_html.to_html(classes='table table-striped table-bordered table-hover responsive-table', index=False)
        download_file_id = str(uuid.uuid4())
        temp_excel_filepath = os.path.join(app.config['DOWNLOAD_FOLDER'], f"report_{download_file_id}.xlsx")
        with open(temp_excel_filepath, 'wb') as f:
            f.write(excel_bytes)
        
        # --- FIX for 403 Forbidden error ---
        # Store the absolute path to the file for the security check.
        session_download_files[download_file_id] = {
            'filepath': os.path.abspath(temp_excel_filepath), 
            'original_name': original_project_file_name
        }
        return jsonify({
            'success': True, 'message': "Analysis complete!", 'table_html': df_html,
            'download_url': url_for('download_evaluated_report', file_id=download_file_id, _external=True)
        })
    except Exception as e:
        print(f"An unexpected error occurred during analysis: {e}")
        flash(f"An unexpected error occurred: {e}", 'error')
        import traceback
        traceback.print_exc() 
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500
    finally:
        if os.path.exists(temp_upload_dir):
            try:
                shutil.rmtree(temp_upload_dir)
            except OSError as e:
                print(f"Error removing temporary directory {temp_upload_dir}: {e}")

@app.route('/download_evaluated_report/<file_id>')
def download_evaluated_report(file_id):
    file_info = session_download_files.pop(file_id, None) 
    if file_info and os.path.exists(file_info['filepath']):
        filepath = file_info['filepath']
        # --- FIX for 403 Forbidden error ---
        # This check will now work correctly with absolute paths.
        if not filepath.startswith(os.path.abspath(app.config['DOWNLOAD_FOLDER'])):
            print(f"Security Warning: Attempted download outside allowed folder: {filepath}")
            return "Invalid file path.", 403
        try:
            download_name = f"{file_info.get('original_name', 'report')}_Grading_Report.xlsx"
            return send_file(filepath, as_attachment=True, download_name=download_name)
        except Exception as e:
            print(f"Error sending file {filepath}: {e}")
            return "Error downloading file.", 500
        finally:
            if os.path.exists(filepath):
                try: os.remove(filepath)
                except OSError as e: print(f"Error removing temp file {filepath}: {e}")
    else:
        return "File not found or expired.", 404

if __name__ == '__main__':
    ensure_upload_dirs()
    app.run(debug=True, port=6158)
