# Project---C: Software Project Evaluator

## Overview

**Project---C** is an automated web application for evaluating software projects using AI. It enables instructors, educators, and reviewers to upload a ZIP archive of a student's code, an evaluation rubric (Excel), and project requirements (Word/PDF). The platform leverages Azure OpenAI to automatically grade projects based on the rubric, requirements, and project content, generating a detailed grading report in Excel and HTML.

---

## Features

- **Automated Grading:** Upload project files, requirements, and rubrics for instant, AI-powered evaluation.
- **Flexible Input:** Supports ZIP project archives, Excel rubrics (`.xlsx`, `.xls`), and requirements in DOCX/PDF.
- **Rich Content Support:** Analyzes code, documentation, screenshots (images), and videos within submissions.
- **Detailed Reports:** Generates downloadable Excel grading reports and in-app HTML feedback.
- **Visual Feedback:** Optionally processes up to five UI screenshots and related videos for visual assessment.
- **Secure Processing:** Each upload is processed in a unique, temporary directory for isolation.
- **Modern UI:** Clean, Bootstrap-styled web interface with drag-and-drop file upload, progress indications, and flash messages.

---

## How It Works

1. **Upload Files**: The user uploads three files:
    - Evaluation rubric (Excel)
    - Project ZIP file (code, assets, etc.)
    - Requirement document (Word or PDF)

2. **Validation/Extraction**: The backend validates file types and sizes, extracts the project archive, and reads rubric and requirements.

3. **AI Analysis**: 
    - Invokes Azure OpenAI with a prompt containing the rubric details, requirements, project code/content, and images.
    - AI returns a JSON with per-criterion grades and overall feedback.

4. **Report Generation**: 
    - Generates an Excel report (styled and structured).
    - Displays HTML feedback in the browser.
    - Allows downloading the grading report.

---

## Directory Structure

```
.
├── app.py                  # Main Flask application
├── utils.py                # File handling, AI grading logic, helpers
├── static/
│   ├── css/
│   └── js/
├── templates/
│   └── index.html          # Main web interface
├── uploads/                # Temporary upload directories and extracted projects
├── requirements.txt        # Python dependencies
└── README.md               # This file
```
*Note: The project also handles nested code archives, screenshots, and videos inside uploads.*

---

## Key Technologies

- **Backend:** Python (Flask), Azure OpenAI integration
- **Frontend:** HTML5, CSS3, Bootstrap, JavaScript, TypeScript
- **AI/ML:** Azure OpenAI GPT (for grading logic)
- **File Handling:** Supports .zip, .docx, .pdf, image/video assets
- **Reporting:** Pandas/Excel for reports, dynamic HTML tables

---

## Usage

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Centhurvelan/Project---C.git
   cd Project---C
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Azure OpenAI:**
   - Add your Azure OpenAI credentials to a `.env` file (see `app.py` for required variables).

4. **Run the Application:**
   ```bash
   python app.py
   ```
   The app will be available at `http://localhost:5000/`.

5. **Upload & Analyze:**
   - Open the application in your browser.
   - Upload the rubric, project ZIP, and requirement document.
   - Click **Analyze Project** to receive instant feedback and grading.

---

## Example: Upload Workflow

- **Step 1:** Select a rubric file (`.xlsx` or `.xls`)
- **Step 2:** Select a project ZIP containing code, images, and/or videos
- **Step 3:** Select a requirements file (`.docx`/`.pdf`)
- **Step 4:** Click "Analyze Project"
- **Step 5:** Download the Excel report or view HTML results

---

## Screenshots

> *Add screenshots of the UI and sample reports here for illustration.*

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- Azure OpenAI for AI grading
- Bootstrap for UI
- Community contributors

---

## Contact

For questions or support, open an issue on GitHub or contact the repository owner.
