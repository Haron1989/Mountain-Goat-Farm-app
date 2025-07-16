// ===============================================
// QR SCANNER SYSTEM JAVASCRIPT
// ===============================================

class QRScannerManager {
    constructor() {
        this.goats = JSON.parse(localStorage.getItem('farmGoats') || '[]');
        this.locations = ['Pen A', 'Pen B', 'Pen C', 'Grazing Field 1', 'Grazing Field 2', 'Quarantine Area'];
        this.feedTypes = ['Lucerne Hay', 'Maize Silage', 'Dairy Meal', 'Mineral Lick', 'Fresh Grass'];
        this.staff = JSON.parse(localStorage.getItem('farmStaff') || '[]');
        
        this.scanner = null;
        this.videoElement = null;
        this.isScanning = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateSampleStaff();
        this.loadInitialTab();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Camera controls
        document.getElementById('start-camera')?.addEventListener('click', () => {
            this.startCamera();
        });

        document.getElementById('stop-camera')?.addEventListener('click', () => {
            this.stopCamera();
        });

        document.getElementById('toggle-flash')?.addEventListener('click', () => {
            this.toggleFlash();
        });

        document.getElementById('upload-image')?.addEventListener('click', () => {
            document.getElementById('file-input').click();
        });

        document.getElementById('file-input')?.addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });

        // QR Generation
        document.getElementById('qr-type')?.addEventListener('change', () => {
            this.updateQRContentPlaceholder();
        });
    }

    generateSampleStaff() {
        if (this.staff.length === 0) {
            this.staff = [
                { id: 'STF001', name: 'John Kamau', role: 'Farm Manager', phone: '+254701234567' },
                { id: 'STF002', name: 'Mary Wanjiku', role: 'Veterinarian', phone: '+254702345678' },
                { id: 'STF003', name: 'Peter Mwangi', role: 'Farm Hand', phone: '+254703456789' },
                { id: 'STF004', name: 'Grace Njeri', role: 'Feed Manager', phone: '+254704567890' }
            ];
            localStorage.setItem('farmStaff', JSON.stringify(this.staff));
        }
    }

    loadInitialTab() {
        this.switchTab('scanner');
    }

    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');

        // Stop camera when switching away from scanner
        if (tabName !== 'scanner' && this.isScanning) {
            this.stopCamera();
        }
    }

    // ===============================================
    // CAMERA AND SCANNING FUNCTIONS
    // ===============================================

    async startCamera() {
        try {
            this.videoElement = document.getElementById('camera-feed');
            
            const constraints = {
                video: {
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoElement.srcObject = stream;
            
            this.videoElement.onloadedmetadata = () => {
                this.videoElement.play();
                this.initializeScanner();
            };

            this.isScanning = true;
            this.updateScannerButtons();
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showError('Unable to access camera. Please ensure camera permissions are granted.');
        }
    }

    initializeScanner() {
        // Initialize ZXing scanner
        this.scanner = new ZXing.BrowserMultiFormatReader();
        
        this.scanner.decodeFromVideoDevice(null, this.videoElement, (result, error) => {
            if (result) {
                this.handleScanResult(result.text);
            }
            if (error && error.name !== 'NotFoundException') {
                console.error('Scanning error:', error);
            }
        });
    }

    stopCamera() {
        if (this.videoElement && this.videoElement.srcObject) {
            const tracks = this.videoElement.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            this.videoElement.srcObject = null;
        }
        
        if (this.scanner) {
            this.scanner.reset();
        }
        
        this.isScanning = false;
        this.updateScannerButtons();
    }

    toggleFlash() {
        if (this.videoElement && this.videoElement.srcObject) {
            const track = this.videoElement.srcObject.getVideoTracks()[0];
            const capabilities = track.getCapabilities();
            
            if (capabilities.torch) {
                const settings = track.getSettings();
                track.applyConstraints({
                    advanced: [{ torch: !settings.torch }]
                });
            } else {
                this.showError('Flash not supported on this device');
            }
        }
    }

    updateScannerButtons() {
        const startBtn = document.getElementById('start-camera');
        const stopBtn = document.getElementById('stop-camera');
        
        if (this.isScanning) {
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-flex';
        } else {
            startBtn.style.display = 'inline-flex';
            stopBtn.style.display = 'none';
        }
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const image = new Image();
            image.onload = () => {
                this.scanImageForQR(image);
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    scanImageForQR(image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Use ZXing to decode QR from image data
        const scanner = new ZXing.BrowserMultiFormatReader();
        scanner.decodeFromImageElement(image)
            .then(result => {
                this.handleScanResult(result.text);
            })
            .catch(error => {
                this.showError('No QR code found in the uploaded image');
            });
    }

    handleScanResult(qrData) {
        try {
            // Parse QR data (assuming JSON format)
            const data = JSON.parse(qrData);
            this.displayScanResult(data);
            this.logScanActivity(data);
        } catch (error) {
            // Handle non-JSON QR codes (simple text or URLs)
            this.displayScanResult({ type: 'text', content: qrData });
        }
    }

    displayScanResult(data) {
        const resultContainer = document.getElementById('scan-result');
        
        switch(data.type) {
            case 'goat':
                this.displayGoatResult(data, resultContainer);
                break;
            case 'location':
                this.displayLocationResult(data, resultContainer);
                break;
            case 'feed':
                this.displayFeedResult(data, resultContainer);
                break;
            case 'staff':
                this.displayStaffResult(data, resultContainer);
                break;
            default:
                this.displayGenericResult(data, resultContainer);
        }

        // Show quick actions
        this.showQuickActions(data);
    }

    displayGoatResult(data, container) {
        const goat = this.goats.find(g => g.id === data.id);
        if (!goat) {
            container.innerHTML = `
                <div class="scan-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>Goat Not Found</h4>
                    <p>No goat found with ID: ${data.id}</p>
                </div>
            `;
            return;
        }

        const age = this.calculateAge(goat.dob);
        container.innerHTML = `
            <div class="scan-success">
                <div class="scanned-goat">
                    <div class="goat-avatar">
                        <i class="fas fa-sheep"></i>
                    </div>
                    <div class="goat-info">
                        <h4>${goat.name}</h4>
                        <div class="goat-details">
                            <div><strong>ID:</strong> ${goat.id}</div>
                            <div><strong>Breed:</strong> ${goat.breed}</div>
                            <div><strong>Age:</strong> ${age}</div>
                            <div><strong>Gender:</strong> ${goat.gender}</div>
                            <div><strong>Location:</strong> ${goat.location || 'Not set'}</div>
                            <div><strong>Status:</strong> ${goat.status || 'Active'}</div>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="qrManager.openGoatDetails('${goat.id}')">
                        <i class="fas fa-eye"></i> View Full Record
                    </button>
                </div>
            </div>
        `;
    }

    displayLocationResult(data, container) {
        container.innerHTML = `
            <div class="scan-success">
                <div class="location-info">
                    <div class="location-avatar">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <h4>${data.name}</h4>
                    <div class="location-details">
                        <div><strong>Type:</strong> ${data.locationType || 'Pen'}</div>
                        <div><strong>Capacity:</strong> ${data.capacity || 'Unknown'}</div>
                        <div><strong>Current Occupants:</strong> ${this.getLocationOccupants(data.name)}</div>
                    </div>
                    <button class="btn-primary" onclick="qrManager.manageLocation('${data.name}')">
                        <i class="fas fa-cog"></i> Manage Location
                    </button>
                </div>
            </div>
        `;
    }

    displayFeedResult(data, container) {
        container.innerHTML = `
            <div class="scan-success">
                <div class="feed-info">
                    <div class="feed-avatar">
                        <i class="fas fa-seedling"></i>
                    </div>
                    <h4>${data.name}</h4>
                    <div class="feed-details">
                        <div><strong>Type:</strong> ${data.feedType || 'Unknown'}</div>
                        <div><strong>Stock Level:</strong> ${data.stockLevel || 'Unknown'}</div>
                        <div><strong>Last Refill:</strong> ${data.lastRefill || 'Unknown'}</div>
                    </div>
                    <button class="btn-primary" onclick="qrManager.manageFeed('${data.name}')">
                        <i class="fas fa-plus"></i> Update Stock
                    </button>
                </div>
            </div>
        `;
    }

    displayStaffResult(data, container) {
        const staff = this.staff.find(s => s.id === data.id);
        if (!staff) {
            container.innerHTML = `
                <div class="scan-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>Staff Not Found</h4>
                    <p>No staff member found with ID: ${data.id}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="scan-success">
                <div class="staff-info">
                    <div class="staff-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <h4>${staff.name}</h4>
                    <div class="staff-details">
                        <div><strong>ID:</strong> ${staff.id}</div>
                        <div><strong>Role:</strong> ${staff.role}</div>
                        <div><strong>Phone:</strong> ${staff.phone}</div>
                        <div><strong>Status:</strong> On Duty</div>
                    </div>
                    <button class="btn-primary" onclick="qrManager.logStaffActivity('${staff.id}')">
                        <i class="fas fa-clock"></i> Log Activity
                    </button>
                </div>
            </div>
        `;
    }

    displayGenericResult(data, container) {
        container.innerHTML = `
            <div class="scan-success">
                <div class="generic-result">
                    <div class="result-avatar">
                        <i class="fas fa-qrcode"></i>
                    </div>
                    <h4>QR Code Scanned</h4>
                    <div class="result-content">
                        <pre>${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}</pre>
                    </div>
                </div>
            </div>
        `;
    }

    showQuickActions(data) {
        if (data.type === 'goat') {
            document.getElementById('quick-action-modal').style.display = 'block';
        }
    }

    // ===============================================
    // QR CODE GENERATION FUNCTIONS
    // ===============================================

    generateGoatQRs() {
        this.showLoadingMessage('Generating QR codes for all goats...');
        
        setTimeout(() => {
            const qrCodes = this.goats.map(goat => ({
                type: 'goat',
                id: goat.id,
                name: goat.name,
                qrData: JSON.stringify({
                    type: 'goat',
                    id: goat.id,
                    farmId: 'MTN_GOAT_FARM',
                    timestamp: new Date().toISOString()
                })
            }));
            
            this.displayBatchQRResults(qrCodes, 'All Goat QR Codes');
        }, 1000);
    }

    generatePenQRs() {
        this.showLoadingMessage('Generating QR codes for pen locations...');
        
        setTimeout(() => {
            const qrCodes = this.locations.map(location => ({
                type: 'location',
                name: location,
                qrData: JSON.stringify({
                    type: 'location',
                    name: location,
                    farmId: 'MTN_GOAT_FARM',
                    timestamp: new Date().toISOString()
                })
            }));
            
            this.displayBatchQRResults(qrCodes, 'Pen Location QR Codes');
        }, 1000);
    }

    generateFeedQRs() {
        this.showLoadingMessage('Generating QR codes for feed inventory...');
        
        setTimeout(() => {
            const qrCodes = this.feedTypes.map(feed => ({
                type: 'feed',
                name: feed,
                qrData: JSON.stringify({
                    type: 'feed',
                    name: feed,
                    farmId: 'MTN_GOAT_FARM',
                    timestamp: new Date().toISOString()
                })
            }));
            
            this.displayBatchQRResults(qrCodes, 'Feed Inventory QR Codes');
        }, 1000);
    }

    generateStaffQRs() {
        this.showLoadingMessage('Generating QR codes for staff members...');
        
        setTimeout(() => {
            const qrCodes = this.staff.map(staff => ({
                type: 'staff',
                name: staff.name,
                qrData: JSON.stringify({
                    type: 'staff',
                    id: staff.id,
                    farmId: 'MTN_GOAT_FARM',
                    timestamp: new Date().toISOString()
                })
            }));
            
            this.displayBatchQRResults(qrCodes, 'Staff ID QR Codes');
        }, 1000);
    }

    generateCustomQR() {
        const type = document.getElementById('qr-type').value;
        const content = document.getElementById('qr-content').value;
        const label = document.getElementById('qr-label').value;

        if (!content) {
            this.showError('Please enter content for the QR code');
            return;
        }

        let qrData;
        if (type === 'custom') {
            qrData = content;
        } else {
            qrData = JSON.stringify({
                type: type,
                [type === 'goat' ? 'id' : 'name']: content,
                farmId: 'MTN_GOAT_FARM',
                timestamp: new Date().toISOString()
            });
        }

        this.generateSingleQR(qrData, label || content, type);
    }

    generateSingleQR(data, label, type) {
        const resultContainer = document.getElementById('custom-qr-result');
        resultContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Generating QR code...</div>';

        // Generate QR code using QRCode.js
        QRCode.toDataURL(data, {
            width: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, (error, url) => {
            if (error) {
                resultContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error generating QR code</p>
                    </div>
                `;
                return;
            }

            resultContainer.innerHTML = `
                <div class="generated-qr">
                    <div class="qr-code-container">
                        <img src="${url}" alt="QR Code for ${label}">
                    </div>
                    <div class="qr-label">${label}</div>
                    <div class="qr-actions">
                        <button class="btn-primary" onclick="qrManager.downloadQR('${url}', '${label}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="btn-secondary" onclick="qrManager.printQR('${url}', '${label}')">
                            <i class="fas fa-print"></i> Print
                        </button>
                        <button class="btn-secondary" onclick="qrManager.copyQRData('${data}')">
                            <i class="fas fa-copy"></i> Copy Data
                        </button>
                    </div>
                </div>
            `;
        });
    }

    displayBatchQRResults(qrCodes, title) {
        // This would typically open a new window or modal with all QR codes
        alert(`Generated ${qrCodes.length} QR codes for ${title}. Batch generation feature would be implemented here.`);
    }

    // ===============================================
    // BATCH PRINT FUNCTIONS
    // ===============================================

    loadPrintItems() {
        const category = document.getElementById('print-category').value;
        const container = document.getElementById('print-items-list');
        
        let items = [];
        
        switch(category) {
            case 'all-goats':
                items = this.goats.map(goat => ({
                    id: goat.id,
                    name: goat.name,
                    type: 'goat',
                    details: `${goat.breed} • ${goat.gender}`
                }));
                break;
            case 'active-goats':
                items = this.goats.filter(g => g.status !== 'sold').map(goat => ({
                    id: goat.id,
                    name: goat.name,
                    type: 'goat',
                    details: `${goat.breed} • ${goat.gender}`
                }));
                break;
            case 'locations':
                items = this.locations.map(location => ({
                    id: location,
                    name: location,
                    type: 'location',
                    details: 'Pen/Grazing Area'
                }));
                break;
            case 'feed-bins':
                items = this.feedTypes.map(feed => ({
                    id: feed,
                    name: feed,
                    type: 'feed',
                    details: 'Feed Storage'
                }));
                break;
            case 'staff':
                items = this.staff.map(staff => ({
                    id: staff.id,
                    name: staff.name,
                    type: 'staff',
                    details: staff.role
                }));
                break;
        }

        container.innerHTML = items.map(item => `
            <div class="print-item">
                <input type="checkbox" id="item-${item.id}" value="${item.id}" data-type="${item.type}">
                <div class="print-item-info">
                    <div class="print-item-name">${item.name}</div>
                    <div class="print-item-details">${item.details}</div>
                </div>
            </div>
        `).join('');
    }

    generatePrintSheet() {
        const selectedItems = this.getSelectedPrintItems();
        if (selectedItems.length === 0) {
            this.showError('Please select items to print');
            return;
        }

        // Generate PDF with QR codes
        alert(`Generating PDF with ${selectedItems.length} QR codes. PDF generation would be implemented here.`);
    }

    printQRCodes() {
        const selectedItems = this.getSelectedPrintItems();
        if (selectedItems.length === 0) {
            this.showError('Please select items to print');
            return;
        }

        // Send to printer
        alert(`Printing ${selectedItems.length} QR codes. Print functionality would be implemented here.`);
    }

    getSelectedPrintItems() {
        const checkboxes = document.querySelectorAll('#print-items-list input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => ({
            id: cb.value,
            type: cb.dataset.type
        }));
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================

    updateQRContentPlaceholder() {
        const type = document.getElementById('qr-type').value;
        const contentInput = document.getElementById('qr-content');
        
        const placeholders = {
            'goat': 'Enter goat ID (e.g., G001)',
            'location': 'Enter location name (e.g., Pen A)',
            'feed': 'Enter feed type (e.g., Lucerne Hay)',
            'task': 'Enter task description',
            'staff': 'Enter staff ID (e.g., STF001)',
            'custom': 'Enter custom URL or text'
        };
        
        contentInput.placeholder = placeholders[type] || 'Enter content';
    }

    getLocationOccupants(locationName) {
        return this.goats.filter(goat => goat.location === locationName).length;
    }

    calculateAge(dob) {
        if (!dob) return 'Unknown';
        
        const today = new Date();
        const birthDate = new Date(dob);
        const diffTime = today - birthDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 30) {
            return `${diffDays} days`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} months`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} years`;
        }
    }

    logScanActivity(data) {
        const activity = {
            timestamp: new Date().toISOString(),
            type: 'qr_scan',
            data: data,
            user: 'current_user' // Would get from auth system
        };
        
        const activities = JSON.parse(localStorage.getItem('scanActivities') || '[]');
        activities.unshift(activity);
        activities.splice(100); // Keep only last 100 activities
        localStorage.setItem('scanActivities', JSON.stringify(activities));
    }

    downloadQR(dataUrl, filename) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${filename}_QR.png`;
        link.click();
    }

    printQR(dataUrl, label) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head><title>Print QR Code - ${label}</title></head>
                <body style="text-align: center; padding: 20px;">
                    <h3>${label}</h3>
                    <img src="${dataUrl}" style="max-width: 300px;">
                    <script>window.onload = () => { window.print(); window.close(); }</script>
                </body>
            </html>
        `);
    }

    copyQRData(data) {
        navigator.clipboard.writeText(data).then(() => {
            this.showSuccess('QR data copied to clipboard');
        }).catch(() => {
            this.showError('Failed to copy to clipboard');
        });
    }

    showLoadingMessage(message) {
        // Implementation for showing loading messages
        console.log(message);
    }

    showError(message) {
        alert(`Error: ${message}`);
    }

    showSuccess(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 3000);
    }

    // Modal functions
    openGoatDetails(goatId) {
        // Would open detailed goat information
        alert(`Opening details for goat ${goatId}`);
    }

    manageLocation(locationName) {
        alert(`Managing location: ${locationName}`);
    }

    manageFeed(feedName) {
        alert(`Managing feed: ${feedName}`);
    }

    logStaffActivity(staffId) {
        alert(`Logging activity for staff ${staffId}`);
    }
}

// Global Functions
function generateGoatQRs() {
    qrManager.generateGoatQRs();
}

function generatePenQRs() {
    qrManager.generatePenQRs();
}

function generateFeedQRs() {
    qrManager.generateFeedQRs();
}

function generateStaffQRs() {
    qrManager.generateStaffQRs();
}

function generateCustomQR() {
    qrManager.generateCustomQR();
}

function loadPrintItems() {
    qrManager.loadPrintItems();
}

function generatePrintSheet() {
    qrManager.generatePrintSheet();
}

function printQRCodes() {
    qrManager.printQRCodes();
}

function quickAction(action) {
    alert(`Quick action: ${action}`);
    closeQuickActionModal();
}

function closeQRDetailModal() {
    document.getElementById('qr-detail-modal').style.display = 'none';
}

function closeQuickActionModal() {
    document.getElementById('quick-action-modal').style.display = 'none';
}

function updateRecord() {
    alert('Record update functionality would be implemented here');
}

function printSingleQR() {
    alert('Single QR print functionality would be implemented here');
}

function logout() {
    localStorage.removeItem('farmRecordsAuth');
    window.location.href = 'index.html';
}

// Initialize when DOM is loaded
let qrManager;
document.addEventListener('DOMContentLoaded', function() {
    qrManager = new QRScannerManager();
});
