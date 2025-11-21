// Xtension Download Script - ULTIMATE BULLETPROOF VERSION
// Maximum error protection and null checking

(function() {
    'use strict';

    console.log('🚀 Xtension Download Script - ULTIMATE VERSION');

    // Configuration
    const CONFIG = {
        serverUrl: 'http://77.90.51.74:8080',
        endpoint: '/api/generate-download-url',
        timeout: 20000,
        retryAttempts: 2
    };

    let isDownloading = false;

    // Safe DOM element getter with fallback
    function safeGetElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`❌ Element not found: ${id}`);
            return null;
        }
        return element;
    }

    // Safe innerHTML setter with validation
    function safeSetHTML(element, html) {
        if (!element) {
            console.error('❌ Cannot set HTML - element is null');
            return false;
        }
        try {
            element.innerHTML = html;
            return true;
        } catch (error) {
            console.error('❌ Error setting HTML:', error);
            return false;
        }
    }

    // Safe style setter
    function safeSetStyle(element, property, value) {
        if (!element) {
            console.error(`❌ Cannot set style ${property} - element is null`);
            return false;
        }
        try {
            element.style[property] = value;
            return true;
        } catch (error) {
            console.error(`❌ Error setting style ${property}:`, error);
            return false;
        }
    }

    // Show modal function with full null checking
    function showModal(content) {
        try {
            const modal = safeGetElement('installModal');
            if (!modal) {
                console.error('❌ Modal not found - cannot show modal');
                alert('Modal error - please refresh the page');
                return;
            }

            const modalContent = modal.querySelector('.modal-content');
            if (!modalContent) {
                console.error('❌ Modal content not found - cannot show modal');
                alert('Modal content error - please refresh the page');
                return;
            }

            if (!safeSetHTML(modalContent, content)) {
                return;
            }

            safeSetStyle(modal, 'display', 'block');
            safeSetStyle(document.body, 'overflow', 'hidden');

            // Setup event listeners for new content
            const buttons = modalContent.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const action = button.getAttribute('data-action');
                    if (action === 'download') {
                        startDownload();
                    } else if (action === 'retry') {
                        location.reload();
                    } else if (action === 'close') {
                        safeSetStyle(modal, 'display', 'none');
                        safeSetStyle(document.body, 'overflow', 'auto');
                    }
                });
            });

        } catch (error) {
            console.error('❌ Error in showModal:', error);
            alert('Error showing modal - please refresh the page');
        }
    }

    // Show loading modal
    function showLoadingModal(message) {
        const content = `
            <div style="text-align: center; padding: 30px;">
                <div class="spinner"></div>
                <h2>Installing Xtension</h2>
                <p>${String(message).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                <button data-action="close" style="background: #6c757d; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; margin-top: 15px;">
                    Cancel
                </button>
            </div>
        `;
        showModal(content);
    }

    // Show success modal
    function showSuccessModal() {
        const content = `
            <div style="text-align: left; padding: 20px; max-width: 450px;">
                <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #155724; margin: 0;">✅ Download Successful!</h3>
                    <p style="color: #155724; margin: 0;">Your Xtension.crx file has been downloaded.</p>
                </div>

                <h4 style="color: #333; margin-bottom: 10px;">To install in Chrome:</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <ol style="margin-left: 20px; line-height: 1.6;">
                        <li><strong>Step 1:</strong> Click the downloaded file</li>
                        <li><strong>Step 2:</strong> Click "Keep" if Chrome warns</li>
                        <li><strong>Step 3:</strong> Click "Install extension"</li>
                        <li><strong>Step 4:</strong> Click "Add extension"</li>
                    </ol>
                </div>

                <p style="color: #6c757d; font-size: 14px; margin-top: 10px;">
                    ⚠️ Chrome warnings are normal for custom extensions
                </p>

                <button data-action="download" style="background: #007bff; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
                    📥 Download Again
                </button>
            </div>
        `;
        showModal(content);
    }

    // Show error modal
    function showErrorModal(error) {
        const safeError = String(error).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const content = `
            <div style="text-align: center; padding: 30px;">
                <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #721c24; margin: 0;">❌ Download Failed</h3>
                    <p style="color: #721c24; margin: 0;">${safeError}</p>
                </div>
                <button data-action="retry" style="background: #28a745; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                    🔄 Try Again
                </button>
                <button data-action="close" style="background: #dc3545; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                    Close
                </button>
            </div>
        `;
        showModal(content);
    }

    // Main download function with maximum error protection
    async function startDownload() {
        if (isDownloading) {
            console.log('⚠️ Already downloading...');
            return;
        }

        isDownloading = true;
        console.log('🚀 Starting download process...');

        try {
            // Comprehensive DOM check
            const modal = safeGetElement('installModal');
            if (!modal) {
                throw new Error('Modal element not found - page may not be fully loaded');
            }

            showLoadingModal('Connecting to server...');

            // Generate download URL
            const response = await fetch(CONFIG.serverUrl + CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({
                    timestamp: Date.now()
                })
            });

            console.log('Server response status:', response.status);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Server response:', data);

            if (data.success && data.downloadUrl) {
                showLoadingModal('Downloading file...');

                // Download the file
                await downloadFile(data.downloadUrl);

                // Show success
                setTimeout(() => {
                    showSuccessModal();
                    isDownloading = false;
                }, 1500);

            } else {
                throw new Error(data.error || 'Invalid server response');
            }

        } catch (error) {
            console.error('❌ Error:', error);
            isDownloading = false;

            // Handle different types of errors
            let errorMessage = error.message;
            if (error.name === 'TypeError' && error.message.includes('null')) {
                errorMessage = 'Page elements not loaded properly. Please refresh the page.';
            } else if (error.name === 'NetworkError' || error.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Cannot connect to server. Please try again later.';
            }

            showErrorModal(errorMessage);
        }
    }

    // Download file function
    function downloadFile(url) {
        return new Promise((resolve) => {
            console.log('📥 Downloading file from:', url);

            try {
                // Create download link
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Xtension.crx';
                link.style.display = 'none';

                // Trigger download
                document.body.appendChild(link);
                link.click();

                // Clean up
                if (link.parentNode) {
                    link.parentNode.removeChild(link);
                }

                console.log('✅ Download initiated successfully');

                // Give Chrome time to start download
                setTimeout(resolve, 2000);

            } catch (error) {
                console.error('❌ Error downloading file:', error);
                resolve(); // Continue even if download fails
            }
        });
    }

    // Setup event listeners - ULTIMATE VERSION
    function setupEventListeners() {
        console.log('🔧 Setting up event listeners...');

        try {
            // Download button
            const downloadBtn = safeGetElement('downloadBtn');
            if (downloadBtn) {
                console.log('✅ Download button found:', downloadBtn);

                // Remove all existing event listeners completely
                const newDownloadBtn = downloadBtn.cloneNode(true);
                downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);

                // Add multiple event listeners for compatibility
                newDownloadBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Download button clicked!');
                    startDownload();
                });

                newDownloadBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Download button onclick triggered!');
                    startDownload();
                };

                console.log('✅ Event listeners attached to download button');

            } else {
                console.error('❌ Download button not found!');
                alert('Download button not found - please refresh the page');
            }

            // Modal close handlers
            const modal = safeGetElement('installModal');
            if (modal) {
                modal.addEventListener('click', function(event) {
                    if (event.target === modal) {
                        safeSetStyle(modal, 'display', 'none');
                        safeSetStyle(document.body, 'overflow', 'auto');
                    }
                });
            }

            // Keyboard navigation
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    const modalElement = safeGetElement('installModal');
                    if (modalElement && modalElement.style.display === 'block') {
                        safeSetStyle(modalElement, 'display', 'none');
                        safeSetStyle(document.body, 'overflow', 'auto');
                    }
                }
            });

            console.log('✅ Event listeners setup complete');

        } catch (error) {
            console.error('❌ Error setting up event listeners:', error);
            alert('Error setting up page - please refresh');
        }
    }

    // Initialize application
    function init() {
        console.log('🚀 Initializing application...');

        try {
            // Check if basic DOM elements exist
            if (!safeGetElement('downloadBtn')) {
                console.error('❌ Download button not found during init');
                setTimeout(init, 500); // Retry after 500ms
                return;
            }

            if (!safeGetElement('installModal')) {
                console.error('❌ Modal not found during init');
                setTimeout(init, 500); // Retry after 500ms
                return;
            }

            // Setup event listeners
            setupEventListeners();

            // Make functions globally available
            window.startDownload = startDownload;
            window.testDownload = function() {
                console.log('🧪 Testing download function...');
                startDownload();
            };

            console.log('✅ Application initialized successfully');
            console.log('💡 Available commands: startDownload(), testDownload()');

        } catch (error) {
            console.error('❌ Error during initialization:', error);
            setTimeout(init, 1000); // Retry after 1 second
        }
    }

    // Start when DOM is ready with multiple fallbacks
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Multiple fallback initializations
    setTimeout(init, 100);
    setTimeout(init, 500);
    setTimeout(init, 1000);

    console.log('📄 Xtension Download Script loaded successfully');

})();
