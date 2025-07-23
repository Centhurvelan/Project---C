document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingOverlay = document.getElementById('loadingOverlay'); // Changed: Targeting the full-screen overlay
    const messagesDiv = document.getElementById('messages');
    const resultsContainer = document.getElementById('resultsContainer');
    const dataframeOutput = document.getElementById('dataframeOutput');
    const downloadReportBtn = document.getElementById('downloadReportBtn');
 
    // Function to update custom file input labels
    function updateFileNameLabel(inputElement, labelElement) {
        if (inputElement.files.length > 0) {
            labelElement.textContent = inputElement.files[0].name;
        } else {
            const defaultText = labelElement.getAttribute('data-default-text');
            labelElement.textContent = defaultText || 'Choose file...';
        }
    }
 
    // Store default text for labels
    document.querySelectorAll('.custom-file-label').forEach(label => {
        label.setAttribute('data-default-text', label.textContent);
    });
 
    // Attach event listeners for file input changes
    document.getElementById('rubricFile').addEventListener('change', function() {
        updateFileNameLabel(this, document.getElementById('rubricFile_label'));
    });
    document.getElementById('projectZip').addEventListener('change', function() {
        updateFileNameLabel(this, document.getElementById('projectZip_label'));
    });
    document.getElementById('requirementsFile').addEventListener('change', function() {
        updateFileNameLabel(this, document.getElementById('requirementsFile_label'));
    });
 
    uploadForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
 
        // Clear previous messages and hide results/download button
        messagesDiv.innerHTML = '';
        resultsContainer.classList.add('d-none'); // Hide results container
        dataframeOutput.innerHTML = ''; // Clear previous table content
        downloadReportBtn.classList.add('d-none'); // Hide download button
 
        // Show loading overlay and disable button
        analyzeBtn.disabled = true; // Disable the button to prevent multiple submissions
        // Changed: Removed the spinner from the button's innerHTML.
        // Instead, just change its text to indicate activity.
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...'; // Optional: Use Font Awesome spin for button if desired, but overlay is primary.
                                                                                // For the intended single-spinner UX, '<i class="fas fa-play-circle"></i> Analyzing...' is better
        loadingOverlay.classList.remove('d-none'); // Show the full-screen overlay
        document.body.classList.add('loading-active'); // Add class to body to prevent scrolling and indicate busy state
 
        const formData = new FormData(uploadForm);
 
        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });
 
            const data = await response.json();
 
            if (data.success) {
                // Display HTML table
                dataframeOutput.innerHTML = data.table_html;
                resultsContainer.classList.remove('d-none'); // Show results container
               
                // Set download link for the Excel file
                downloadReportBtn.href = data.download_url;
                downloadReportBtn.classList.remove('d-none'); // Show download button
 
                showFlashMessage(data.message, "info"); // Show success message from backend
            } else {
                // Display error message from backend
                showFlashMessage(data.error, "error");
            }
 
        } catch (error) {
            console.error('Error during analysis:', error);
            showFlashMessage('An unexpected error occurred during analysis. Check console for details.', 'error');
        } finally {
            // Hide loading overlay and enable button
            loadingOverlay.classList.add('d-none'); // Hide the full-screen overlay
            document.body.classList.remove('loading-active'); // Remove class from body to allow scrolling again
            analyzeBtn.disabled = false; // Re-enable the button
            analyzeBtn.innerHTML = '<i class="fas fa-play-circle"></i> Analyze Project'; // Reset button text and icon
        }
    });
 
    function showFlashMessage(message, type) {
        const alertDiv = document.createElement('div');
        // Use Bootstrap alert classes for styling
        alertDiv.className = `alert alert-${type === 'error' ? 'danger' : 'info'} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        `;
        messagesDiv.appendChild(alertDiv);
 
        // Auto-close info messages after 8 seconds, keep error messages visible until dismissed
        if (type !== 'error') {
            setTimeout(() => {
                // Check if the alert still exists before trying to close it
                if ($(alertDiv).length) {
                    $(alertDiv).alert('close');
                }
            }, 8000);
        }
    }
 
});
 