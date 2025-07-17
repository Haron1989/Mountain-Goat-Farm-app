// Farm Records Management System
class FarmRecordsManager {
    // End-to-End Encryption (AES using CryptoJS)
    encryptData(data) {
        if (typeof CryptoJS === 'undefined') {
            alert('Encryption library missing. Data not encrypted.');
            return JSON.stringify(data);
        }
        const key = localStorage.getItem('encryptionKey') || 'FarmRecordsSecretKey2025';
        return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    }
    decryptData(data) {
        if (typeof CryptoJS === 'undefined') {
            alert('Encryption library missing. Data not decrypted.');
            return null;
        }
        const key = localStorage.getItem('encryptionKey') || 'FarmRecordsSecretKey2025';
        try {
            const bytes = CryptoJS.AES.decrypt(data, key);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch {
            return null;
        }
    }

    // Role-Based Access Control (RBAC)
    getRolePermissions(role) {
        const roles = {
            administrator: ['all'],
            vet: ['view_health', 'add_health', 'view_animals', 'edit_health', 'edit_animals'],
            inspector: ['view_animals', 'view_reports'],
            consultant: ['view_animals', 'view_reports', 'add_notes', 'edit_animals'],
            external: ['view_animals', 'view_reports']
        };
        return roles[role] || [];
    }

    // Permission checking methods
    checkPermission(action) {
        if (!this.currentUser) {
            this.logAudit('permission_denied', `No user logged in for action: ${action}`);
            return false;
        }

        const userPermissions = this.getRolePermissions(this.currentUser.role);
        
        // Administrators have all permissions
        if (userPermissions.includes('all')) {
            return true;
        }

        // Check specific permission
        const hasPermission = userPermissions.includes(action);
        if (!hasPermission) {
            this.logAudit('permission_denied', `User ${this.currentUser.username} denied access to: ${action}`);
        }
        return hasPermission;
    }

    // Centralized permission enforcement with user feedback
    enforcePermission(action, errorMessage = null) {
        if (!this.checkPermission(action)) {
            const message = errorMessage || `Access denied: You don't have permission to ${action.replace('_', ' ')}`;
            if (typeof alert !== 'undefined') {
                alert(message);
            }
            console.warn(`Permission denied for action: ${action}`);
            return false;
        }
        return true;
    }

    // Enhanced Automated Threat Detection
    detectThreats() {
        try {
            const auditLog = JSON.parse(localStorage.getItem('externalAccessAuditLog') || '[]');
            const currentTime = Date.now();
            const oneHourAgo = currentTime - (60 * 60 * 1000);
            const recentEvents = auditLog.filter(e => new Date(e.timestamp).getTime() > oneHourAgo);
            
            const threats = [];

            // 1. Failed login attempts
            const failedLogins = recentEvents.filter(e => e.action === 'login_failed');
            if (failedLogins.length > 5) {
                threats.push({
                    type: 'brute_force',
                    severity: 'high',
                    message: `${failedLogins.length} failed login attempts in the last hour`,
                    count: failedLogins.length
                });
            }

            // 2. Rapid API calls (potential DoS)
            const apiCalls = recentEvents.filter(e => e.action === 'api_call');
            if (apiCalls.length > 100) {
                threats.push({
                    type: 'dos_attempt',
                    severity: 'medium',
                    message: `Unusually high API call volume: ${apiCalls.length} calls in last hour`,
                    count: apiCalls.length
                });
            }

            // 3. Permission violations
            const permissionDenials = recentEvents.filter(e => e.action === 'permission_denied');
            if (permissionDenials.length > 10) {
                threats.push({
                    type: 'privilege_escalation',
                    severity: 'medium',
                    message: `Multiple permission violations: ${permissionDenials.length} attempts`,
                    count: permissionDenials.length
                });
            }

            // 4. Suspicious user activity patterns
            const userActions = recentEvents.reduce((acc, event) => {
                const user = event.user || 'unknown';
                acc[user] = (acc[user] || 0) + 1;
                return acc;
            }, {});

            Object.entries(userActions).forEach(([user, count]) => {
                if (count > 50 && user !== 'admin') {
                    threats.push({
                        type: 'suspicious_activity',
                        severity: 'medium',
                        message: `User ${user} performed ${count} actions in last hour`,
                        user: user,
                        count: count
                    });
                }
            });

            // 5. Check for error patterns
            const errors = recentEvents.filter(e => e.action.includes('_error'));
            if (errors.length > 20) {
                threats.push({
                    type: 'system_errors',
                    severity: 'low',
                    message: `High error rate: ${errors.length} errors in last hour`,
                    count: errors.length
                });
            }

            // Log and notify about threats
            if (threats.length > 0) {
                threats.forEach(threat => {
                    this.logAudit('threat_detected', JSON.stringify(threat));
                    
                    if (threat.severity === 'high') {
                        this.showAdminNotification(`🚨 HIGH THREAT: ${threat.message}`);
                        
                        // Auto-trigger emergency lockdown for severe threats
                        if (threat.type === 'brute_force' && threat.count > 10) {
                            this.emergencyLockdown();
                        }
                    } else if (threat.severity === 'medium') {
                        this.showAdminNotification(`⚠️ THREAT: ${threat.message}`);
                    }
                });

                console.warn('🛡️ Threat Detection Results:', threats);
                return threats;
            }

            this.logAudit('threat_scan', 'No threats detected');
            return [];
        } catch (error) {
            this.logAudit('threat_detection_error', `Threat detection failed: ${error.message}`);
            console.error('Threat detection error:', error);
            return [];
        }
    }

    // Run threat detection periodically
    startThreatMonitoring() {
        // Run threat detection every 5 minutes
        setInterval(() => {
            this.detectThreats();
        }, 5 * 60 * 1000);
        
        this.logAudit('threat_monitoring', 'Threat monitoring started');
    }

    // Data Retention & Deletion Policies (with backup protection)
    enforceDataRetention(days = 365) {
        try {
            const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
            const dataToArchive = this.goats.filter(g => new Date(g.dateAdded).getTime() <= cutoff);
            
            if (dataToArchive.length === 0) {
                this.logAudit('data_retention', 'No old records found for archival');
                return;
            }
            
            // Create backup archive before deletion
            const archiveKey = `farmGoats_archive_${new Date().toISOString().split('T')[0]}`;
            const existingArchive = JSON.parse(localStorage.getItem(archiveKey) || '[]');
            const updatedArchive = [...existingArchive, ...dataToArchive];
            localStorage.setItem(archiveKey, JSON.stringify(updatedArchive));
            
            // Only remove after successful backup
            this.goats = this.goats.filter(g => new Date(g.dateAdded).getTime() > cutoff);
            localStorage.setItem('farmGoats', JSON.stringify(this.goats));
            
            this.logAudit('data_retention', `${dataToArchive.length} old goat records archived (older than ${days} days) to ${archiveKey}`);
            
            // Notify user about archived data
            if (typeof alert !== 'undefined') {
                alert(`Data retention: ${dataToArchive.length} old records archived safely. Archive key: ${archiveKey}`);
            }
        } catch (error) {
            this.logAudit('data_retention_error', `Failed to enforce data retention: ${error.message}`);
            console.error('Data retention failed:', error);
        }
    }

    // Restore archived data function
    restoreArchivedData(archiveKey) {
        try {
            const archivedData = JSON.parse(localStorage.getItem(archiveKey) || '[]');
            if (archivedData.length === 0) {
                alert('No archived data found for this key');
                return false;
            }
            
            // Add back to main dataset with confirmation
            if (confirm(`Restore ${archivedData.length} archived records? This will add them back to your active goat records.`)) {
                this.goats = [...this.goats, ...archivedData];
                localStorage.setItem('farmGoats', JSON.stringify(this.goats));
                this.logAudit('data_restore', `Restored ${archivedData.length} records from ${archiveKey}`);
                this.loadGoats(); // Refresh UI
                alert(`Successfully restored ${archivedData.length} records`);
                return true;
            }
        } catch (error) {
            this.logAudit('data_restore_error', `Failed to restore data: ${error.message}`);
            alert('Failed to restore archived data. Check console for details.');
        }
        return false;
    }

    // Privacy Mode for Demonstrations
    enablePrivacyMode() {
        document.body.classList.add('privacy-mode');
        // Mask all personal/sensitive data in UI
        // Example: mask goat names
        document.querySelectorAll('.goat-name').forEach(el => { el.textContent = 'Anonymous'; });
        this.logAudit('privacy_mode', 'Privacy mode enabled');
    }
    disablePrivacyMode() {
        document.body.classList.remove('privacy-mode');
        this.logAudit('privacy_mode', 'Privacy mode disabled');
    }

    // Secure API Gateway (Enhanced Security)
    callAPI(endpoint, payload) {
        try {
            // Validate user and permissions
            if (!this.currentUser) {
                throw new Error('User not authenticated');
            }

            // Rate limiting check
            if (!this.checkRateLimit(this.currentUser)) {
                throw new Error('Rate limit exceeded');
            }

            // Input validation
            const sanitizedEndpoint = this.sanitizeInput(endpoint);
            if (!sanitizedEndpoint || sanitizedEndpoint.length === 0) {
                throw new Error('Invalid endpoint');
            }

            // Enhanced security checks
            if (!this.validateAPIRequest(sanitizedEndpoint, payload)) {
                throw new Error('Invalid API request');
            }

            // Simulate secure API call with comprehensive logging
            const apiCall = {
                endpoint: sanitizedEndpoint,
                payload: this.sanitizeAPIPayload(payload),
                timestamp: new Date().toISOString(),
                user: this.currentUser.username,
                userAgent: navigator.userAgent || 'Unknown',
                ip: this.getClientIP()
            };

            this.logAudit('api_call', `Secure API call: ${JSON.stringify(apiCall)}`);
            
            // Simulate response with security headers
            const response = {
                status: 'success',
                data: 'API response data',
                headers: {
                    'Content-Security-Policy': "default-src 'self'",
                    'X-Frame-Options': 'DENY',
                    'X-Content-Type-Options': 'nosniff'
                }
            };

            this.logAudit('api_response', `API call successful: ${sanitizedEndpoint}`);
            return response;
        } catch (error) {
            this.logAudit('api_error', `API call failed: ${error.message}`);
            console.error('API Gateway Error:', error);
            throw error;
        }
    }

    // Validate API requests
    validateAPIRequest(endpoint, payload) {
        // Check endpoint whitelist
        const allowedEndpoints = [
            '/api/goats', '/api/health', '/api/breeding', '/api/reports',
            '/api/feed', '/api/products', '/api/contacts'
        ];
        
        if (!allowedEndpoints.some(allowed => endpoint.startsWith(allowed))) {
            return false;
        }

        // Validate payload size (max 1MB)
        const payloadSize = JSON.stringify(payload || {}).length;
        if (payloadSize > 1024 * 1024) {
            return false;
        }

        return true;
    }

    // Sanitize API payload
    sanitizeAPIPayload(payload) {
        if (!payload || typeof payload !== 'object') {
            return {};
        }

        const sanitized = {};
        Object.keys(payload).forEach(key => {
            const sanitizedKey = this.sanitizeInput(key);
            const value = payload[key];
            
            if (typeof value === 'string') {
                sanitized[sanitizedKey] = this.sanitizeInput(value);
            } else if (typeof value === 'number' || typeof value === 'boolean') {
                sanitized[sanitizedKey] = value;
            } else if (Array.isArray(value)) {
                sanitized[sanitizedKey] = value.map(item => 
                    typeof item === 'string' ? this.sanitizeInput(item) : item
                );
            }
        });

        return sanitized;
    }

    // Get client IP (simplified for demo)
    getClientIP() {
        // In a real app, this would be determined server-side
        return '127.0.0.1';
    }

    // Input sanitization function for security
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return input;
        }
        
        // Remove potentially dangerous characters and scripts
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<[^>]*>?/gm, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .trim();
    }

    // Output sanitization function
    sanitizeOutput(output) {
        if (typeof output !== 'string') {
            return output;
        }
        
        return output
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    // Comprehensive form validation
    validateFormData(formData) {
        const errors = [];
        
        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.push('Invalid email format');
        }
        
        // Phone validation
        if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
            errors.push('Invalid phone number format');
        }
        
        // Date validation
        if (formData.date && isNaN(Date.parse(formData.date))) {
            errors.push('Invalid date format');
        }
        
        // Number validation
        if (formData.number !== undefined && (isNaN(formData.number) || formData.number < 0)) {
            errors.push('Invalid number value');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Multi-Language & Localization (Demo)
    setLanguage(lang) {
        localStorage.setItem('farmAppLang', lang);
        this.logAudit('language_change', `Language set to ${lang}`);
        // ...reload UI strings...
    }

    // Customizable Dashboard Widgets (Demo)
    setDashboardWidgets(widgets) {
        localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
        this.logAudit('dashboard_customization', `Dashboard widgets set: ${widgets.join(', ')}`);
        // ...update dashboard UI...
    }

    // Scheduled Data Backups (Demo)
    scheduleBackup(intervalHours = 24) {
        setInterval(() => {
            const backup = {
                goats: this.encryptData(this.goats),
                breeding: this.encryptData(this.breedingRecords),
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('farmBackup', JSON.stringify(backup));
            this.logAudit('backup', 'Scheduled backup completed');
        }, intervalHours * 60 * 60 * 1000);
    }

    // Integration with External Services (Demo)
    integrateWithService(serviceName, config) {
        this.logAudit('integration', `Integrated with ${serviceName}: ${JSON.stringify(config)}`);
        // ...integration logic...
    }

    // Advanced Reporting & Analytics (Demo)
    generateAnalyticsReport(type) {
        this.logAudit('analytics', `Generated report: ${type}`);
        // ...report logic...
    }

    // Mobile-Friendly & Offline Mode (Demo)
    enableOfflineMode() {
        localStorage.setItem('offlineMode', 'true');
        this.logAudit('offline_mode', 'Offline mode enabled');
        // ...offline logic...
    }
    disableOfflineMode() {
        localStorage.setItem('offlineMode', 'false');
        this.logAudit('offline_mode', 'Offline mode disabled');
    }

    // Emergency Lockdown Feature
    emergencyLockdown() {
        localStorage.setItem('lockdown', 'true');
        this.logAudit('lockdown', 'Emergency lockdown activated');
        alert('System is in lockdown. All external access revoked.');
        // ...revoke all tokens...
    }
    releaseLockdown() {
        localStorage.setItem('lockdown', 'false');
        this.logAudit('lockdown', 'Lockdown released');
        alert('System lockdown released.');
    }

    // Consent & Audit Trail for Data Sharing
    recordConsent(user, dataType) {
        this.logAudit('consent', `User ${user} consented to share ${dataType}`);
    }

    // User Training & Help Center (Demo)
    showHelpCenter() {
        alert('Help Center: Search tutorials, FAQs, and guides.');
        this.logAudit('help_center', 'Help center accessed');
    }

    // === EMBEDDED MICRO-TUTORIALS SYSTEM ===
    
    // Tutorial database with context-specific help content
    getTutorialDatabase() {
        return {
            'add-goat': {
                title: '🐐 How to Add a New Goat',
                type: 'interactive',
                steps: [
                    {
                        text: 'Click the "Add New Goat" button to open the goat registration form.',
                        highlight: '#add-goat-btn',
                        position: 'bottom'
                    },
                    {
                        text: 'Enter the goat\'s unique tag number. This should be visible on the ear tag.',
                        highlight: '#goat-tag',
                        position: 'right'
                    },
                    {
                        text: 'Select the breed from the dropdown. If your breed isn\'t listed, you can type a custom one.',
                        highlight: '#goat-breed',
                        position: 'bottom'
                    },
                    {
                        text: 'Enter the date of birth or purchase date to track the goat\'s age.',
                        highlight: '#goat-dob',
                        position: 'left'
                    },
                    {
                        text: 'Click Save to add the goat to your records. You can always edit this information later.',
                        highlight: '#goat-form button[type="submit"]',
                        position: 'top'
                    }
                ],
                tips: [
                    '💡 Use clear, consistent naming for easy identification',
                    '📸 Consider taking a photo for visual identification',
                    '🏷️ Keep ear tags clean and legible'
                ]
            },
            'withdrawal-period': {
                title: '⏰ Understanding Withdrawal Periods',
                type: 'video',
                videoUrl: 'https://example.com/withdrawal-periods-tutorial.mp4',
                content: `
                    <div class="tutorial-content">
                        <h3>What is a Withdrawal Period?</h3>
                        <p>A withdrawal period is the time you must wait after giving medication to an animal before their milk or meat can be consumed or sold.</p>
                        
                        <div class="tutorial-section">
                            <h4>📋 Why It Matters:</h4>
                            <ul>
                                <li>Ensures food safety for consumers</li>
                                <li>Required by law in most countries</li>
                                <li>Protects your farm's reputation</li>
                                <li>Prevents antibiotic resistance</li>
                            </ul>
                        </div>
                        
                        <div class="tutorial-section">
                            <h4>🕐 Common Withdrawal Periods:</h4>
                            <div class="withdrawal-examples">
                                <div class="withdrawal-item">
                                    <strong>Penicillin:</strong> 4 days (milk), 28 days (meat)
                                </div>
                                <div class="withdrawal-item">
                                    <strong>Oxytetracycline:</strong> 5 days (milk), 22 days (meat)
                                </div>
                                <div class="withdrawal-item">
                                    <strong>Ivermectin:</strong> 28 days (milk), 35 days (meat)
                                </div>
                            </div>
                        </div>
                        
                        <div class="tutorial-warning">
                            ⚠️ Always check the medication label for specific withdrawal times!
                        </div>
                    </div>
                `,
                quiz: [
                    {
                        question: 'What happens if you don\'t observe withdrawal periods?',
                        options: ['Nothing happens', 'Food safety risk', 'Animals get sick', 'Lower milk production'],
                        correct: 1,
                        explanation: 'Not observing withdrawal periods creates food safety risks and may be illegal.'
                    }
                ]
            },
            'breeding-records': {
                title: '💕 Managing Breeding Records',
                type: 'interactive',
                steps: [
                    {
                        text: 'Click "Add Breeding Record" to track mating activities.',
                        highlight: '#add-breeding-record-btn',
                        position: 'bottom'
                    },
                    {
                        text: 'Select the doe (female goat) from your registered animals.',
                        highlight: '#breeding-doe',
                        position: 'right'
                    },
                    {
                        text: 'Choose the buck (male goat) or enter "AI" for artificial insemination.',
                        highlight: '#breeding-buck',
                        position: 'left'
                    },
                    {
                        text: 'Record the breeding date accurately for pregnancy tracking.',
                        highlight: '#breeding-date',
                        position: 'top'
                    }
                ],
                tips: [
                    '📅 Goat gestation period is approximately 150 days',
                    '🔄 Track heat cycles every 18-21 days',
                    '📝 Note any breeding complications'
                ]
            },
            'milk-recording': {
                title: '🥛 Recording Milk Production',
                type: 'video',
                content: `
                    <div class="tutorial-content">
                        <h3>Accurate Milk Recording</h3>
                        <p>Proper milk recording helps track production, health, and profitability.</p>
                        
                        <div class="tutorial-section">
                            <h4>📊 What to Record:</h4>
                            <ul>
                                <li>Date and time of milking</li>
                                <li>Individual goat identification</li>
                                <li>Milk quantity (liters/kg)</li>
                                <li>Milk quality observations</li>
                                <li>Any abnormalities</li>
                            </ul>
                        </div>
                        
                        <div class="tutorial-section">
                            <h4>🎯 Best Practices:</h4>
                            <ul>
                                <li>Milk at consistent times daily</li>
                                <li>Use clean, calibrated measuring equipment</li>
                                <li>Record immediately after milking</li>
                                <li>Note environmental factors (weather, stress)</li>
                            </ul>
                        </div>
                    </div>
                `
            },
            'health-monitoring': {
                title: '🏥 Health Monitoring Basics',
                type: 'interactive',
                steps: [
                    {
                        text: 'Regular health checks help prevent disease and maintain productivity.',
                        highlight: '#health-records',
                        position: 'top'
                    },
                    {
                        text: 'Record vaccinations with dates and withdrawal periods.',
                        highlight: '#health-vaccination',
                        position: 'right'
                    },
                    {
                        text: 'Monitor temperature, appetite, and behavior daily.',
                        highlight: '#health-symptoms',
                        position: 'bottom'
                    },
                    {
                        text: 'Always consult a veterinarian for serious health issues.',
                        highlight: '#health-vet-contact',
                        position: 'left'
                    }
                ],
                tips: [
                    '🌡️ Normal goat temperature: 101.5-103.5°F (38.6-39.7°C)',
                    '👁️ Check eyes, nose, and udder daily',
                    '🦶 Examine hooves regularly for hoof rot'
                ]
            },
            'feed-management': {
                title: '🌾 Feed Management Guide',
                type: 'video',
                content: `
                    <div class="tutorial-content">
                        <h3>Proper Feed Management</h3>
                        <p>Good nutrition is essential for health, reproduction, and milk production.</p>
                        
                        <div class="tutorial-section">
                            <h4>🥬 Feed Types:</h4>
                            <div class="feed-types">
                                <div class="feed-item">
                                    <strong>Roughage:</strong> Hay, grass, browse (60-70% of diet)
                                </div>
                                <div class="feed-item">
                                    <strong>Concentrates:</strong> Grains, pellets (20-30% of diet)
                                </div>
                                <div class="feed-item">
                                    <strong>Supplements:</strong> Minerals, vitamins (as needed)
                                </div>
                            </div>
                        </div>
                        
                        <div class="tutorial-section">
                            <h4>📏 Feeding Guidelines:</h4>
                            <ul>
                                <li>Adult goat: 2-4% of body weight daily</li>
                                <li>Lactating does: Increase by 1-2 lbs concentrate</li>
                                <li>Fresh water: 1-3 gallons per day</li>
                                <li>Feed at consistent times</li>
                            </ul>
                        </div>
                    </div>
                `
            }
        };
    }

    // Show contextual tutorial based on current context
    showContextualTutorial(tutorialId, triggerElement = null) {
        const tutorials = this.getTutorialDatabase();
        const tutorial = tutorials[tutorialId];
        
        if (!tutorial) {
            console.warn(`Tutorial ${tutorialId} not found`);
            return;
        }

        this.logAudit('tutorial_accessed', `User accessed tutorial: ${tutorialId}`);
        
        if (tutorial.type === 'interactive') {
            this.showInteractiveTutorial(tutorial, triggerElement);
        } else if (tutorial.type === 'video') {
            this.showVideoTutorial(tutorial);
        }
    }

    // Interactive step-by-step tutorial with highlights
    showInteractiveTutorial(tutorial, triggerElement) {
        let currentStep = 0;
        let tutorialOverlay;

        const createTutorialOverlay = () => {
            // Remove existing overlay
            const existing = document.getElementById('tutorial-overlay');
            if (existing) existing.remove();

            tutorialOverlay = document.createElement('div');
            tutorialOverlay.id = 'tutorial-overlay';
            tutorialOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.7);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Montserrat', sans-serif;
            `;
            document.body.appendChild(tutorialOverlay);
        };

        const showStep = (stepIndex) => {
            const step = tutorial.steps[stepIndex];
            if (!step) return;

            // Create tutorial popup
            const popup = document.createElement('div');
            popup.style.cssText = `
                background: white;
                border-radius: 15px;
                padding: 25px;
                max-width: 400px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                position: relative;
                animation: tutorialSlideIn 0.3s ease-out;
            `;

            popup.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <div style="background: linear-gradient(135deg, #3498db, #2ecc71); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                        ${stepIndex + 1}
                    </div>
                    <h3 style="margin: 0; color: #2c3e50;">${tutorial.title}</h3>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <p style="color: #34495e; line-height: 1.6; margin: 0;">${step.text}</p>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="color: #7f8c8d; font-size: 0.9rem;">
                        Step ${stepIndex + 1} of ${tutorial.steps.length}
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button id="tutorial-prev" style="padding: 8px 15px; border: 1px solid #bdc3c7; background: white; border-radius: 5px; cursor: pointer;" ${stepIndex === 0 ? 'disabled' : ''}>
                            Previous
                        </button>
                        <button id="tutorial-next" style="padding: 8px 15px; background: linear-gradient(135deg, #3498db, #2ecc71); color: white; border: none; border-radius: 5px; cursor: pointer;">
                            ${stepIndex === tutorial.steps.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
                
                <button id="tutorial-close" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 20px; cursor: pointer; color: #95a5a6;">×</button>
            `;

            tutorialOverlay.innerHTML = '';
            tutorialOverlay.appendChild(popup);

            // Highlight target element if specified
            if (step.highlight) {
                this.highlightElement(step.highlight, step.position);
            }

            // Add event listeners
            const nextBtn = popup.querySelector('#tutorial-next');
            const prevBtn = popup.querySelector('#tutorial-prev');
            const closeBtn = popup.querySelector('#tutorial-close');

            nextBtn.addEventListener('click', () => {
                if (stepIndex === tutorial.steps.length - 1) {
                    this.finishTutorial(tutorial);
                } else {
                    showStep(stepIndex + 1);
                }
            });

            prevBtn.addEventListener('click', () => {
                if (stepIndex > 0) {
                    showStep(stepIndex - 1);
                }
            });

            closeBtn.addEventListener('click', () => {
                this.closeTutorial();
            });
        };

        createTutorialOverlay();
        showStep(currentStep);

        // Add CSS animations
        if (!document.getElementById('tutorial-styles')) {
            const styles = document.createElement('style');
            styles.id = 'tutorial-styles';
            styles.textContent = `
                @keyframes tutorialSlideIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .tutorial-highlight {
                    box-shadow: 0 0 20px rgba(52, 152, 219, 0.8) !important;
                    border: 3px solid #3498db !important;
                    border-radius: 5px !important;
                    position: relative !important;
                    z-index: 10001 !important;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Video-based tutorial with rich content
    showVideoTutorial(tutorial) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 15px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            position: relative;
        `;

        content.innerHTML = `
            <div style="padding: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                    <h2 style="margin: 0; color: #2c3e50;">${tutorial.title}</h2>
                    <button id="video-tutorial-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #95a5a6;">×</button>
                </div>
                
                ${tutorial.videoUrl ? `
                    <div style="margin-bottom: 25px;">
                        <video controls style="width: 100%; border-radius: 10px;">
                            <source src="${tutorial.videoUrl}" type="video/mp4">
                            Your browser does not support video playback.
                        </video>
                    </div>
                ` : ''}
                
                ${tutorial.content}
                
                ${tutorial.quiz ? `
                    <div style="margin-top: 25px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                        <h4 style="margin-top: 0; color: #2c3e50;">🧠 Quick Knowledge Check</h4>
                        <div id="tutorial-quiz"></div>
                    </div>
                ` : ''}
                
                <div style="margin-top: 25px; text-align: center;">
                    <button id="tutorial-complete" style="padding: 12px 30px; background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
                        Mark as Complete
                    </button>
                </div>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Add quiz functionality
        if (tutorial.quiz) {
            this.renderTutorialQuiz(tutorial.quiz, content.querySelector('#tutorial-quiz'));
        }

        // Event listeners
        content.querySelector('#video-tutorial-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        content.querySelector('#tutorial-complete').addEventListener('click', () => {
            this.completeTutorial(tutorial);
            document.body.removeChild(modal);
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Render interactive quiz
    renderTutorialQuiz(quiz, container) {
        quiz.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.style.marginBottom = '20px';
            
            questionDiv.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 10px; color: #2c3e50;">
                    ${question.question}
                </div>
                <div id="quiz-options-${index}">
                    ${question.options.map((option, optIndex) => `
                        <label style="display: block; margin-bottom: 8px; cursor: pointer;">
                            <input type="radio" name="quiz-${index}" value="${optIndex}" style="margin-right: 8px;">
                            ${option}
                        </label>
                    `).join('')}
                </div>
                <div id="quiz-feedback-${index}" style="margin-top: 10px; padding: 10px; border-radius: 5px; display: none;"></div>
            `;
            
            container.appendChild(questionDiv);
            
            // Add answer checking
            const options = questionDiv.querySelectorAll(`input[name="quiz-${index}"]`);
            options.forEach(option => {
                option.addEventListener('change', () => {
                    const feedback = questionDiv.querySelector(`#quiz-feedback-${index}`);
                    const isCorrect = parseInt(option.value) === question.correct;
                    
                    feedback.style.display = 'block';
                    if (isCorrect) {
                        feedback.style.background = '#d4edda';
                        feedback.style.color = '#155724';
                        feedback.innerHTML = `✅ Correct! ${question.explanation}`;
                    } else {
                        feedback.style.background = '#f8d7da';
                        feedback.style.color = '#721c24';
                        feedback.innerHTML = `❌ Not quite. ${question.explanation}`;
                    }
                });
            });
        });
    }

    // Highlight target element during tutorial
    highlightElement(selector, position = 'top') {
        // Remove existing highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });

        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('tutorial-highlight');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Complete tutorial and track progress
    completeTutorial(tutorial) {
        const completedTutorials = JSON.parse(localStorage.getItem('completedTutorials') || '[]');
        const tutorialId = Object.keys(this.getTutorialDatabase()).find(id => 
            this.getTutorialDatabase()[id] === tutorial
        );
        
        if (tutorialId && !completedTutorials.includes(tutorialId)) {
            completedTutorials.push(tutorialId);
            localStorage.setItem('completedTutorials', JSON.stringify(completedTutorials));
        }
        
        this.logAudit('tutorial_completed', `Tutorial completed: ${tutorial.title}`);
        this.showTutorialCompletionMessage(tutorial.title);
    }

    // Finish interactive tutorial
    finishTutorial(tutorial) {
        this.closeTutorial();
        this.completeTutorial(tutorial);
        
        // Show tips if available
        if (tutorial.tips && tutorial.tips.length > 0) {
            this.showTutorialTips(tutorial.tips);
        }
    }

    // Close tutorial and cleanup
    closeTutorial() {
        const overlay = document.getElementById('tutorial-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        // Remove highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
    }

    // Show tutorial completion message
    showTutorialCompletionMessage(title) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 20px 25px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            z-index: 10001;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            max-width: 350px;
            animation: slideIn 0.5s ease-out;
        `;
        
        message.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 1.8rem;">🎓</span>
                <div>
                    <div style="font-size: 1.1rem; margin-bottom: 5px;">Tutorial Complete!</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">${title}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 500);
        }, 4000);
    }

    // Show tutorial tips
    showTutorialTips(tips) {
        const tipsModal = document.createElement('div');
        tipsModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.6);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
        `;

        tipsModal.innerHTML = `
            <div style="background: white; border-radius: 15px; padding: 30px; max-width: 500px; box-shadow: 0 15px 40px rgba(0,0,0,0.3);">
                <h3 style="margin-top: 0; color: #2c3e50; display: flex; align-items: center; gap: 10px;">
                    💡 Pro Tips
                </h3>
                <div style="margin-bottom: 25px;">
                    ${tips.map(tip => `
                        <div style="padding: 12px; margin-bottom: 10px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #3498db;">
                            ${tip}
                        </div>
                    `).join('')}
                </div>
                <div style="text-align: center;">
                    <button id="tips-close" style="padding: 10px 25px; background: linear-gradient(135deg, #3498db, #2ecc71); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Got it!
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(tipsModal);

        tipsModal.querySelector('#tips-close').addEventListener('click', () => {
            document.body.removeChild(tipsModal);
        });
    }

    // Add tutorial help buttons throughout the interface
    addTutorialHelpers() {
        // Helper configurations for different sections
        const helpers = [
            {
                target: '#add-goat-btn',
                tutorial: 'add-goat',
                position: 'after'
            },
            {
                target: '#add-breeding-record-btn',
                tutorial: 'breeding-records',
                position: 'after'
            },
            {
                target: '#health-records',
                tutorial: 'health-monitoring',
                position: 'before'
            },
            {
                target: '#milk-records',
                tutorial: 'milk-recording',
                position: 'before'
            },
            {
                target: '#feed-records',
                tutorial: 'feed-management',
                position: 'before'
            }
        ];

        helpers.forEach(helper => {
            const target = document.querySelector(helper.target);
            if (target) {
                const helpBtn = document.createElement('button');
                helpBtn.style.cssText = `
                    background: linear-gradient(135deg, #3498db, #2ecc71);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-left: 8px;
                    position: relative;
                    top: -2px;
                    transition: all 0.3s ease;
                `;
                helpBtn.innerHTML = '?';
                helpBtn.title = 'View tutorial';
                
                helpBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showContextualTutorial(helper.tutorial, target);
                });

                helpBtn.addEventListener('mouseenter', () => {
                    helpBtn.style.transform = 'scale(1.1)';
                    helpBtn.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
                });

                helpBtn.addEventListener('mouseleave', () => {
                    helpBtn.style.transform = 'scale(1)';
                    helpBtn.style.boxShadow = 'none';
                });

                if (helper.position === 'after') {
                    target.parentNode.insertBefore(helpBtn, target.nextSibling);
                } else {
                    target.parentNode.insertBefore(helpBtn, target);
                }
            }
        });
    }

    // Smart tutorial suggestions based on user behavior
    suggestRelevantTutorials() {
        const userActions = JSON.parse(localStorage.getItem('externalAccessAuditLog') || '[]');
        const recentActions = userActions.filter(action => 
            Date.now() - new Date(action.timestamp).getTime() < 24 * 60 * 60 * 1000
        );

        // Suggest tutorials based on recent struggles or new user behavior
        const completedTutorials = JSON.parse(localStorage.getItem('completedTutorials') || '[]');
        const suggestions = [];

        // New user suggestions
        if (userActions.length < 10) {
            suggestions.push({
                tutorial: 'add-goat',
                reason: 'Get started by learning how to add your first goat!'
            });
        }

        // Suggest based on incomplete actions
        const failedLogins = recentActions.filter(a => a.action === 'login_failed');
        if (failedLogins.length > 2 && !completedTutorials.includes('login-help')) {
            suggestions.push({
                tutorial: 'login-help',
                reason: 'Having trouble logging in? This tutorial can help!'
            });
        }

        if (suggestions.length > 0) {
            this.showTutorialSuggestions(suggestions);
        }
    }

    // Show tutorial suggestions popup
    showTutorialSuggestions(suggestions) {
        const suggestionsModal = document.createElement('div');
        suggestionsModal.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 1001;
            font-family: 'Montserrat', sans-serif;
            max-width: 350px;
            border: 2px solid #3498db;
        `;

        suggestionsModal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h4 style="margin: 0; color: #2c3e50; display: flex; align-items: center; gap: 8px;">
                    🎓 Helpful Tutorials
                </h4>
                <button id="suggestions-close" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #95a5a6;">×</button>
            </div>
            
            ${suggestions.map(suggestion => `
                <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;" 
                     onclick="farmManager.showContextualTutorial('${suggestion.tutorial}'); this.parentElement.parentElement.remove();">
                    <div style="font-weight: 600; color: #2c3e50; margin-bottom: 5px;">
                        ${this.getTutorialDatabase()[suggestion.tutorial]?.title || suggestion.tutorial}
                    </div>
                    <div style="font-size: 0.9rem; color: #7f8c8d;">
                        ${suggestion.reason}
                    </div>
                </div>
            `).join('')}
            
            <div style="text-align: center; margin-top: 15px;">
                <button onclick="this.parentElement.parentElement.remove();" style="padding: 8px 15px; background: #ecf0f1; border: none; border-radius: 5px; cursor: pointer; font-size: 0.9rem;">
                    Maybe later
                </button>
            </div>
        `;

        document.body.appendChild(suggestionsModal);

        suggestionsModal.querySelector('#suggestions-close').addEventListener('click', () => {
            document.body.removeChild(suggestionsModal);
        });

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (suggestionsModal.parentNode) {
                suggestionsModal.parentNode.removeChild(suggestionsModal);
            }
        }, 10000);
    }
    // Two-Factor Authentication (2FA) - Demo implementation
    request2FA(username) {
        // Simulate sending a code
        const code = Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('farm2FACode', code);
        alert(`2FA code sent to ${username}: ${code}`); // Replace with real delivery
    }

    verify2FA(inputCode) {
        const code = localStorage.getItem('farm2FACode');
        return inputCode == code;
    }

    // Granular Audit Logging
    logAudit(action, details) {
        const auditLog = JSON.parse(localStorage.getItem('externalAccessAuditLog') || '[]');
        auditLog.push({
            timestamp: new Date().toISOString(),
            user: this.currentUser ? this.currentUser.username : 'unknown',
            action,
            details
        });
        localStorage.setItem('externalAccessAuditLog', JSON.stringify(auditLog));
    }

    // Data Masking for Sensitive Fields
    maskSensitiveData(data, fields) {
        const masked = { ...data };
        fields.forEach(field => {
            if (masked[field]) masked[field] = '***';
        });
        return masked;
    }

    // Customizable Permissions
    setUserPermissions(username, permissions) {
        const users = JSON.parse(localStorage.getItem('farmUsers') || '[]');
        const user = users.find(u => u.username === username);
        if (user) {
            user.permissions = permissions;
            localStorage.setItem('farmUsers', JSON.stringify(users));
        }
    }

    // Access Request Workflow
    requestAccess(externalUser, requestedFields) {
        // Log request and notify admin
        this.logAudit('access_request', `User ${externalUser} requested access to: ${requestedFields.join(', ')}`);
        this.showAdminNotification(`Access request from ${externalUser} for fields: ${requestedFields.join(', ')}`);
    }

    approveAccessRequest(externalUser, fields) {
        // Grant access and log
        this.setUserPermissions(externalUser, fields);
        this.logAudit('access_approved', `Access approved for ${externalUser}: ${fields.join(', ')}`);
    }

    // Session Activity Monitoring
    logSessionActivity(activity) {
        const sessionLog = JSON.parse(localStorage.getItem('externalSessionLog') || '[]');
        sessionLog.push({
            timestamp: new Date().toISOString(),
            user: this.currentUser ? this.currentUser.username : 'unknown',
            activity
        });
        localStorage.setItem('externalSessionLog', JSON.stringify(sessionLog));
    }

    // Secure Token Revocation
    revokeToken(tokenId) {
        let tokens = JSON.parse(localStorage.getItem('externalAccessTokens') || '[]');
        tokens = tokens.filter(t => t.id !== tokenId);
        localStorage.setItem('externalAccessTokens', JSON.stringify(tokens));
        this.logAudit('token_revoked', `Token ${tokenId} revoked.`);
        this.showAdminNotification(`Token ${tokenId} has been revoked.`);
    }

    // UI Accessibility Improvements
    improveAccessibility() {
        // Add ARIA roles and keyboard navigation for read-only banner
        const banner = document.getElementById('readonly-banner');
        if (banner) {
            banner.setAttribute('role', 'status');
            banner.setAttribute('tabindex', '0');
        }
    }

    // API Rate Limiting (Demo)
    checkRateLimit(user) {
        const now = Date.now();
        const key = `rateLimit_${user.username}`;
        const lastCall = parseInt(localStorage.getItem(key) || '0');
        if (now - lastCall < 2000) { // 2 seconds between calls
            alert('Rate limit exceeded. Please wait before making another request.');
            return false;
        }
        localStorage.setItem(key, now);
        return true;
    }

    // Compliance Export (PDF/XLSX - Demo)
    exportCompliance(format = 'pdf') {
        // For demo, just log and show notification
        this.logAudit('compliance_export', `Exported data in ${format} format.`);
        this.showAdminNotification(`Compliance export in ${format} format completed.`);
    }
    // Read-Only UI Mode for External Users
    enableReadOnlyUIMode() {
        // Disable all form inputs and action buttons
        const inputs = document.querySelectorAll('input, textarea, select, button');
        inputs.forEach(el => {
            // Only disable if not a navigation or export button
            if (!el.classList.contains('nav-btn') && !el.classList.contains('export-btn')) {
                el.disabled = true;
                el.classList.add('readonly-ui');
            }
        });
        // Optionally hide or disable add/edit/delete buttons
        const actionBtns = document.querySelectorAll('.action-btn, .add-btn, .edit-btn, .delete-btn');
        actionBtns.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('readonly-ui');
        });
        // Add a banner to indicate read-only mode
        if (!document.getElementById('readonly-banner')) {
            const banner = document.createElement('div');
            banner.id = 'readonly-banner';
            banner.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                background: #f39c12;
                color: #fff;
                text-align: center;
                font-size: 1.1rem;
                font-family: 'Montserrat', sans-serif;
                font-weight: 600;
                padding: 12px 0;
                z-index: 2000;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            `;
            banner.textContent = 'Read-Only Mode: You have view-only access. Editing is disabled.';
            document.body.appendChild(banner);
        }
    }
    // Access Expiry Notification
    notifyAccessExpiry(token) {
        // Notify external user
        if (token && token.expiresAt) {
            const now = Date.now();
            const expiresAt = new Date(token.expiresAt).getTime();
            const timeLeft = expiresAt - now;
            if (timeLeft <= 0) {
                this.showExternalWelcomeMessage('Your access token has expired. Please contact the administrator for renewal.');
            } else if (timeLeft < 10 * 60 * 1000) { // less than 10 minutes left
                this.showExternalWelcomeMessage('Your access token will expire soon. Please save your work or contact the administrator.');
            }
        }
        // Notify admin (simple notification for demo)
        if (token && token.expiresAt && token.user) {
            const now = Date.now();
            const expiresAt = new Date(token.expiresAt).getTime();
            const timeLeft = expiresAt - now;
            if (timeLeft <= 0) {
                this.showAdminNotification(`External access for user ${token.user} has expired.`);
            } else if (timeLeft < 10 * 60 * 1000) {
                this.showAdminNotification(`External access for user ${token.user} will expire in less than 10 minutes.`);
            }
        }
    }

    showAdminNotification(message) {
        // Simple admin notification (could be improved for real dashboard)
        const adminDiv = document.createElement('div');
        adminDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #e67e22, #f1c40f);
            color: #2c3e50;
            padding: 18px 22px;
            border-radius: 10px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.12);
            z-index: 1002;
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;
            max-width: 320px;
            animation: slideIn 0.5s ease-out;
        `;
        adminDiv.innerHTML = `<div style="font-size: 1rem;">${message}</div>`;
        document.body.appendChild(adminDiv);
        setTimeout(() => {
            adminDiv.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                if (adminDiv.parentNode) {
                    adminDiv.parentNode.removeChild(adminDiv);
                }
            }, 500);
        }, 6000);
    }
    // === External Access Security & Controls ===
    // Restrict access to certain IP addresses or regions
    isIPAllowed(ip) {
        // Example: allow only specific IPs or ranges
        const allowedIPs = ['192.168.1.100', '203.0.113.0/24'];
        // Simple check for demo; use a proper IP range check in production
        return allowedIPs.some(allowed => ip === allowed || (allowed.endsWith('/24') && ip.startsWith(allowed.replace('/24', ''))));
    }

    isLocationAllowed(location) {
        // Example: allow only certain regions
        const allowedRegions = ['Kenya', 'Uganda'];
        return allowedRegions.includes(location);
    }

    // Download/Export Controls
    canExportReports(user) {
        // Only allow if user has export permission
        return user && user.permissions && user.permissions.includes('export_reports');
    }

    canExportAuditLog(user) {
        // Only allow if user has audit log export permission
        return user && user.permissions && user.permissions.includes('export_audit_log');
    }

    exportAuditLog() {
        // Example: export audit log to CSV
        const auditLog = JSON.parse(localStorage.getItem('externalAccessAuditLog') || '[]');
        let csv = 'Timestamp,User,Action,Details\n';
        auditLog.forEach(entry => {
            csv += `${entry.timestamp},${entry.user},${entry.action},${entry.details}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'audit-log.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Custom Welcome Message for External Users
    showExternalWelcomeMessage(message) {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2980b9, #6dd5fa);
            color: white;
            padding: 20px 25px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            z-index: 1001;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            max-width: 350px;
            animation: slideIn 0.5s ease-out;
        `;
        welcomeDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 1.8rem;">👋</span>
                <div>
                    <div style="font-size: 1.1rem; margin-bottom: 5px;">${message}</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">Welcome, trusted external user!</div>
                </div>
            </div>
        `;
        document.body.appendChild(welcomeDiv);
        setTimeout(() => {
            welcomeDiv.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                if (welcomeDiv.parentNode) {
                    welcomeDiv.parentNode.removeChild(welcomeDiv);
                }
            }, 500);
        }, 6000);
    }

    // Session Timeout for External Users
    startExternalSessionTimeout(timeoutMinutes = 15) {
        if (this.externalSessionTimeoutId) {
            clearTimeout(this.externalSessionTimeoutId);
        }
        this.externalSessionTimeoutId = setTimeout(() => {
            alert('Session expired due to inactivity. You have been logged out.');
            this.logout();
        }, timeoutMinutes * 60 * 1000);
        // Reset timer on user activity
        ['mousemove', 'keydown', 'click'].forEach(event => {
            window.addEventListener(event, this.resetExternalSessionTimeout.bind(this, timeoutMinutes));
        });
    }

    resetExternalSessionTimeout(timeoutMinutes = 15) {
        if (this.externalSessionTimeoutId) {
            clearTimeout(this.externalSessionTimeoutId);
        }
        this.externalSessionTimeoutId = setTimeout(() => {
            alert('Session expired due to inactivity. You have been logged out.');
            this.logout();
        }, timeoutMinutes * 60 * 1000);
    }
    constructor() {
        try {
            this.currentUser = null;
            this.goats = this.safeParseJSON(localStorage.getItem('farmGoats'), []);
            this.breedingRecords = this.safeParseJSON(localStorage.getItem('breedingRecords'), []);
            this.meatRecords = this.safeParseJSON(localStorage.getItem('meatRecords'), []);
            this.milkRecords = this.safeParseJSON(localStorage.getItem('milkRecords'), []);
            this.feedRecords = this.safeParseJSON(localStorage.getItem('feedRecords'), []);
            this.healthRecords = this.safeParseJSON(localStorage.getItem('healthRecords'), []);
            this.products = this.safeParseJSON(localStorage.getItem('farmProducts'), []);
            this.contacts = this.safeParseJSON(localStorage.getItem('farmContacts'), []);
            
            // Existing data arrays for additional features
            this.tasks = this.safeParseJSON(localStorage.getItem('farmTasks'), []);
            this.reminders = this.safeParseJSON(localStorage.getItem('farmReminders'), []);
            this.transactions = this.safeParseJSON(localStorage.getItem('farmTransactions'), []);
            this.sales = this.safeParseJSON(localStorage.getItem('farmSales'), []);
            this.crops = this.safeParseJSON(localStorage.getItem('farmCrops'), []);
            
            // New modules data arrays
            this.leases = this.safeParseJSON(localStorage.getItem('farmLeases'), []);
            this.equipment = this.safeParseJSON(localStorage.getItem('farmEquipment'), []);
            this.laborers = this.safeParseJSON(localStorage.getItem('farmLaborers'), []);
            this.jobAssignments = this.safeParseJSON(localStorage.getItem('farmJobAssignments'), []);
            this.laborPayments = this.safeParseJSON(localStorage.getItem('farmLaborPayments'), []);
            this.users = this.safeParseJSON(localStorage.getItem('farmUsers'), [{"id": 1, "name": "System Administrator", "username": "admin", "email": "admin@mountaingoatfarm.com", "role": "administrator", "status": "active", "dateCreated": "2024-01-01"}]);
            this.systemSettings = this.safeParseJSON(localStorage.getItem('farmSystemSettings'), {});
            
            // Bulk operations state
            this.selectedGoats = new Set();
            
            console.log('✅ FarmRecordsManager constructor completed successfully');
        } catch (error) {
            console.error('❌ Critical error in constructor:', error);
            this.initializeDefaults();
        }
    }

    // Safe JSON parsing with fallback
    safeParseJSON(jsonString, fallback = null) {
        try {
            if (!jsonString) return fallback;
            return JSON.parse(jsonString);
        } catch (error) {
            console.warn('JSON parse error, using fallback:', error);
            return fallback;
        }
    }

    // Initialize defaults in case of critical constructor error
    initializeDefaults() {
        this.currentUser = null;
        this.goats = [];
        this.breedingRecords = [];
        this.meatRecords = [];
        this.milkRecords = [];
        this.feedRecords = [];
        this.healthRecords = [];
        this.products = [];
        this.contacts = [];
        this.tasks = [];
        this.reminders = [];
        this.transactions = [];
        this.sales = [];
        this.crops = [];
        this.leases = [];
        this.equipment = [];
        this.laborers = [];
        this.jobAssignments = [];
        this.laborPayments = [];
        this.users = [{"id": 1, "name": "System Administrator", "username": "admin", "email": "admin@mountaingoatfarm.com", "role": "administrator", "status": "active", "dateCreated": "2024-01-01"}];
        this.systemSettings = {};
        this.selectedGoats = new Set();
        console.log('⚠️ Initialized with default values due to constructor error');
    }

    // Initialize the app - called from DOMContentLoaded
    init() {
        try {
            console.log('🚀 Starting app initialization...');
            this.initializeAuth();
            this.setupEventListeners();
            this.setupBulkOperations();
            this.setupMobileEnhancements(); // Add mobile support
            this.startThreatMonitoring(); // Start security monitoring
            
            // Initialize tutorial system
            setTimeout(() => {
                this.initializeTutorialSystem();
            }, 1000); // Delay to ensure DOM is fully loaded
            
            // Initialize tags and categories system
            setTimeout(() => {
                this.initializeTagsAndCategories();
            }, 1500); // Delay to ensure other systems are loaded
            
            console.log('✅ App initialization completed successfully');
        } catch (error) {
            console.error('❌ Critical error during initialization:', error);
            this.handleInitializationError(error);
        }
    }

    // Initialize the tutorial system
    initializeTutorialSystem() {
        try {
            // Add tutorial helper buttons throughout the interface
            this.addTutorialHelpers();
            
            // Add contextual help for specific terms
            this.addContextualHelp();
            
            // Check for tutorial suggestions for new/struggling users
            setTimeout(() => {
                this.suggestRelevantTutorials();
            }, 3000); // Wait 3 seconds after app load
            
            // Add global tutorial menu
            this.addTutorialMenu();
            
            this.logAudit('tutorial_system', 'Tutorial system initialized');
            console.log('🎓 Tutorial system initialized successfully');
        } catch (error) {
            console.error('Tutorial system initialization failed:', error);
        }
    }

    // Initialize tags and categories system
    initializeTagsAndCategories() {
        try {
            // Initialize the tags system
            this.initializeTagsSystem();
            
            // Add tag menu button to interface
            this.addTagMenuButton();
            
            // Add CSS styles for tags
            this.addTagsCSS();
            
            // Setup quick filter handlers
            this.setupQuickFilterHandlers();
            
            // Enhance existing record displays with tags after a short delay
            setTimeout(() => {
                this.enhanceRecordDisplaysWithTags();
            }, 2000);
            
            this.logAudit('tags_system', 'Tags and categories system initialized');
            console.log('🏷️ Tags and categories system initialized successfully');
        } catch (error) {
            console.error('Tags system initialization failed:', error);
        }
    }

    // Add CSS styles for tags system
    addTagsCSS() {
        if (!document.getElementById('tags-styles')) {
            const link = document.createElement('link');
            link.id = 'tags-styles';
            link.rel = 'stylesheet';
            link.href = 'tags-styles.css';
            document.head.appendChild(link);
        }
    }

    // Add contextual help for specific terms (like "withdrawal period")
    addContextualHelp() {
        // Terms that should have contextual help
        const helpTerms = [
            {
                term: 'withdrawal period',
                tutorial: 'withdrawal-period',
                regex: /withdrawal\s+period/gi
            },
            {
                term: 'breeding record',
                tutorial: 'breeding-records',
                regex: /breeding\s+record/gi
            },
            {
                term: 'milk recording',
                tutorial: 'milk-recording',
                regex: /milk\s+record/gi
            },
            {
                term: 'health monitoring',
                tutorial: 'health-monitoring',
                regex: /health\s+(monitoring|check)/gi
            }
        ];

        // Find and enhance text nodes with help terms
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.parentElement && !node.parentElement.querySelector('.tutorial-help-link')) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            let text = textNode.textContent;
            let hasChanges = false;

            helpTerms.forEach(helpTerm => {
                if (helpTerm.regex.test(text)) {
                    text = text.replace(helpTerm.regex, (match) => {
                        hasChanges = true;
                        return `<span class="tutorial-help-term" data-tutorial="${helpTerm.tutorial}">${match} <span class="tutorial-help-link">ⓘ</span></span>`;
                    });
                }
            });

            if (hasChanges) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = text;
                textNode.parentNode.replaceChild(wrapper, textNode);

                // Add click handlers to help links
                wrapper.querySelectorAll('.tutorial-help-term').forEach(term => {
                    term.style.cssText = `
                        position: relative;
                        cursor: help;
                    `;
                    
                    const helpLink = term.querySelector('.tutorial-help-link');
                    helpLink.style.cssText = `
                        color: #3498db;
                        font-size: 0.8em;
                        vertical-align: super;
                        cursor: pointer;
                        margin-left: 2px;
                    `;
                    
                    helpLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.showContextualTutorial(term.dataset.tutorial);
                    });
                });
            }
        });
    }

    // Add tutorial menu to the interface
    addTutorialMenu() {
        // Create floating tutorial menu button
        const tutorialMenuBtn = document.createElement('button');
        tutorialMenuBtn.id = 'tutorial-menu-btn';
        tutorialMenuBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #9b59b6, #8e44ad);
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            cursor: pointer;
            font-size: 24px;
            box-shadow: 0 4px 15px rgba(155, 89, 182, 0.4);
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        tutorialMenuBtn.innerHTML = '🎓';
        tutorialMenuBtn.title = 'Tutorials & Help';

        tutorialMenuBtn.addEventListener('mouseenter', () => {
            tutorialMenuBtn.style.transform = 'scale(1.1)';
            tutorialMenuBtn.style.boxShadow = '0 6px 20px rgba(155, 89, 182, 0.6)';
        });

        tutorialMenuBtn.addEventListener('mouseleave', () => {
            tutorialMenuBtn.style.transform = 'scale(1)';
            tutorialMenuBtn.style.boxShadow = '0 4px 15px rgba(155, 89, 182, 0.4)';
        });

        tutorialMenuBtn.addEventListener('click', () => {
            this.showTutorialMenu();
        });

        document.body.appendChild(tutorialMenuBtn);
    }

    // Show tutorial menu with all available tutorials
    showTutorialMenu() {
        const tutorials = this.getTutorialDatabase();
        const completedTutorials = JSON.parse(localStorage.getItem('completedTutorials') || '[]');

        const menu = document.createElement('div');
        menu.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        `;

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #2c3e50; display: flex; align-items: center; gap: 10px;">
                    🎓 Farm Management Tutorials
                </h2>
                <button id="tutorial-menu-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #95a5a6;">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="background: #e8f6f3; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60;">
                    <strong>📊 Progress:</strong> ${completedTutorials.length} of ${Object.keys(tutorials).length} tutorials completed
                </div>
            </div>
            
            <div style="display: grid; gap: 15px;">
                ${Object.entries(tutorials).map(([id, tutorial]) => {
                    const isCompleted = completedTutorials.includes(id);
                    return `
                        <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; cursor: pointer; transition: all 0.3s ease; ${isCompleted ? 'background: #f8f9fa; border-color: #27ae60;' : ''}"
                             onclick="farmManager.showContextualTutorial('${id}'); document.body.removeChild(document.querySelector('[style*=\"background: rgba(0,0,0,0.7)\"]'));">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                <h4 style="margin: 0; color: #2c3e50;">${tutorial.title}</h4>
                                <div style="display: flex; gap: 5px; align-items: center;">
                                    ${isCompleted ? '<span style="color: #27ae60; font-size: 18px;">✅</span>' : ''}
                                    <span style="background: ${tutorial.type === 'interactive' ? '#3498db' : '#e67e22'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8rem;">
                                        ${tutorial.type}
                                    </span>
                                </div>
                            </div>
                            <div style="color: #7f8c8d; font-size: 0.9rem;">
                                ${tutorial.type === 'interactive' ? 'Step-by-step guided tutorial' : 'Video tutorial with interactive elements'}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="margin-top: 25px; text-align: center;">
                <button onclick="document.body.removeChild(document.querySelector('[style*=\"background: rgba(0,0,0,0.7)\"]'))" 
                        style="padding: 10px 25px; background: #ecf0f1; border: none; border-radius: 8px; cursor: pointer; margin-right: 10px;">
                    Close
                </button>
                <button onclick="farmManager.resetTutorialProgress()" 
                        style="padding: 10px 25px; background: linear-gradient(135deg, #e67e22, #f39c12); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Reset Progress
                </button>
            </div>
        `;

        menu.appendChild(content);
        document.body.appendChild(menu);

        content.querySelector('#tutorial-menu-close').addEventListener('click', () => {
            document.body.removeChild(menu);
        });

        // Close on backdrop click
        menu.addEventListener('click', (e) => {
            if (e.target === menu) {
                document.body.removeChild(menu);
            }
        });
    }

            // Reset tutorial progress
    resetTutorialProgress() {
        if (confirm('Are you sure you want to reset all tutorial progress? This will mark all tutorials as incomplete.')) {
            localStorage.removeItem('completedTutorials');
            this.logAudit('tutorial_reset', 'Tutorial progress reset by user');
            alert('Tutorial progress has been reset. You can now retake all tutorials.');
            
            // Close menu and refresh
            const menu = document.querySelector('[style*="background: rgba(0,0,0,0.7)"]');
            if (menu) {
                document.body.removeChild(menu);
            }
        }
    }

    // === CUSTOM TAGS & CATEGORIES SYSTEM ===
    
    // Initialize tags system with predefined categories and user-defined tags
    initializeTagsSystem() {
        // Load existing tags or create default ones
        const existingTags = this.safeParseJSON(localStorage.getItem('farmTags'), null);
        
        if (!existingTags) {
            // Initialize with default tag categories
            this.tags = {
                // Predefined categories with common tags
                status: {
                    name: 'Status',
                    color: '#3498db',
                    icon: '🏷️',
                    tags: ['healthy', 'sick', 'quarantine', 'treatment', 'recovered', 'pregnant', 'lactating', 'dry']
                },
                quality: {
                    name: 'Quality',
                    color: '#27ae60',
                    icon: '⭐',
                    tags: ['premium', 'standard', 'export', 'local', 'organic', 'certified', 'grade-a', 'grade-b']
                },
                production: {
                    name: 'Production',
                    color: '#e67e22',
                    icon: '📊',
                    tags: ['high-yield', 'low-yield', 'consistent', 'seasonal', 'peak', 'declining', 'improving']
                },
                management: {
                    name: 'Management',
                    color: '#9b59b6',
                    icon: '📋',
                    tags: ['needs-attention', 'follow-up', 'routine', 'urgent', 'scheduled', 'completed', 'pending']
                },
                breeding: {
                    name: 'Breeding',
                    color: '#e74c3c',
                    icon: '💕',
                    tags: ['breeding', 'bred', 'confirmed-pregnant', 'due-soon', 'kidded', 'open', 'AI-candidate']
                },
                financial: {
                    name: 'Financial',
                    color: '#f39c12',
                    icon: '💰',
                    tags: ['profitable', 'cost-effective', 'expensive', 'investment', 'revenue', 'loss', 'break-even']
                }
            };
            
            // Save default tags
            localStorage.setItem('farmTags', JSON.stringify(this.tags));
        } else {
            this.tags = existingTags;
        }
        
        // Initialize record tags storage
        this.recordTags = this.safeParseJSON(localStorage.getItem('farmRecordTags'), {});
        
        this.logAudit('tags_system', 'Tags system initialized');
    }

    // Add a new custom tag to a category
    addCustomTag(categoryId, tagName, color = null) {
        if (!this.tags[categoryId]) {
            // Create new category if it doesn't exist
            this.tags[categoryId] = {
                name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
                color: color || '#95a5a6',
                icon: '🏷️',
                tags: []
            };
        }
        
        // Sanitize tag name
        const sanitizedTag = this.sanitizeInput(tagName.toLowerCase().trim());
        
        if (sanitizedTag && !this.tags[categoryId].tags.includes(sanitizedTag)) {
            this.tags[categoryId].tags.push(sanitizedTag);
            this.saveTags();
            this.logAudit('tag_added', `Added tag "${sanitizedTag}" to category "${categoryId}"`);
            return true;
        }
        
        return false;
    }

    // Create a completely new tag category
    createTagCategory(categoryName, color = '#95a5a6', icon = '🏷️') {
        const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
        
        if (!this.tags[categoryId]) {
            this.tags[categoryId] = {
                name: this.sanitizeInput(categoryName),
                color: color,
                icon: icon,
                tags: []
            };
            
            this.saveTags();
            this.logAudit('category_created', `Created new tag category: ${categoryName}`);
            return categoryId;
        }
        
        return null;
    }

    // Add tags to a specific record
    addTagsToRecord(recordType, recordId, tags) {
        const recordKey = `${recordType}_${recordId}`;
        
        if (!this.recordTags[recordKey]) {
            this.recordTags[recordKey] = [];
        }
        
        // Add new tags, avoiding duplicates
        tags.forEach(tag => {
            const sanitizedTag = this.sanitizeInput(tag.toLowerCase().trim());
            if (sanitizedTag && !this.recordTags[recordKey].includes(sanitizedTag)) {
                this.recordTags[recordKey].push(sanitizedTag);
            }
        });
        
        this.saveRecordTags();
        this.logAudit('tags_added', `Added tags to ${recordType} record ${recordId}: ${tags.join(', ')}`);
    }

    // Remove tags from a record
    removeTagsFromRecord(recordType, recordId, tags) {
        const recordKey = `${recordType}_${recordId}`;
        
        if (this.recordTags[recordKey]) {
            tags.forEach(tag => {
                const index = this.recordTags[recordKey].indexOf(tag);
                if (index > -1) {
                    this.recordTags[recordKey].splice(index, 1);
                }
            });
            
            // Remove empty tag arrays
            if (this.recordTags[recordKey].length === 0) {
                delete this.recordTags[recordKey];
            }
            
            this.saveRecordTags();
            this.logAudit('tags_removed', `Removed tags from ${recordType} record ${recordId}: ${tags.join(', ')}`);
        }
    }

    // Get all tags for a specific record
    getRecordTags(recordType, recordId) {
        const recordKey = `${recordType}_${recordId}`;
        return this.recordTags[recordKey] || [];
    }

    // Filter records by tags
    filterRecordsByTags(records, recordType, selectedTags, matchAll = false) {
        if (!selectedTags || selectedTags.length === 0) {
            return records;
        }
        
        return records.filter(record => {
            const recordTags = this.getRecordTags(recordType, record.id);
            
            if (matchAll) {
                // All selected tags must be present
                return selectedTags.every(tag => recordTags.includes(tag));
            } else {
                // At least one selected tag must be present
                return selectedTags.some(tag => recordTags.includes(tag));
            }
        });
    }

    // Get all records with specific tags across all record types
    getRecordsWithTags(tags, recordTypes = ['goat', 'breeding', 'health', 'milk', 'feed']) {
        const results = [];
        
        recordTypes.forEach(recordType => {
            const records = this.getRecordsByType(recordType);
            const filteredRecords = this.filterRecordsByTags(records, recordType, tags, false);
            
            filteredRecords.forEach(record => {
                results.push({
                    type: recordType,
                    record: record,
                    tags: this.getRecordTags(recordType, record.id)
                });
            });
        });
        
        return results;
    }

    // Get records by type helper method
    getRecordsByType(recordType) {
        switch (recordType) {
            case 'goat': return this.goats;
            case 'breeding': return this.breedingRecords;
            case 'health': return this.healthRecords;
            case 'milk': return this.milkRecords;
            case 'feed': return this.feedRecords;
            case 'product': return this.products;
            case 'contact': return this.contacts;
            case 'transaction': return this.transactions;
            case 'sale': return this.sales;
            default: return [];
        }
    }

    // Show tag management interface
    showTagManager() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            position: relative;
        `;

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #2c3e50; display: flex; align-items: center; gap: 10px;">
                    🏷️ Tag Manager
                </h2>
                <button id="tag-manager-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #95a5a6;">×</button>
            </div>
            
            <div style="margin-bottom: 25px;">
                <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                    <button id="add-category-btn" style="padding: 10px 20px; background: linear-gradient(135deg, #3498db, #2ecc71); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Add Category
                    </button>
                    <button id="bulk-tag-btn" style="padding: 10px 20px; background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Bulk Tag Records
                    </button>
                    <button id="export-tags-btn" style="padding: 10px 20px; background: linear-gradient(135deg, #e67e22, #f39c12); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Export Tags
                    </button>
                </div>
            </div>
            
            <div id="tag-categories-container">
                ${this.renderTagCategories()}
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Event listeners
        content.querySelector('#tag-manager-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        content.querySelector('#add-category-btn').addEventListener('click', () => {
            this.showAddCategoryDialog();
        });

        content.querySelector('#bulk-tag-btn').addEventListener('click', () => {
            this.showBulkTagDialog();
        });

        content.querySelector('#export-tags-btn').addEventListener('click', () => {
            this.exportTagsData();
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Render tag categories for the manager
    renderTagCategories() {
        return Object.entries(this.tags).map(([categoryId, category]) => `
            <div style="border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: ${category.color}; display: flex; align-items: center; gap: 8px;">
                        ${category.icon} ${category.name}
                    </h3>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="farmManager.addTagToCategory('${categoryId}')" 
                                style="padding: 5px 10px; background: ${category.color}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.9rem;">
                            Add Tag
                        </button>
                        <button onclick="farmManager.editCategory('${categoryId}')" 
                                style="padding: 5px 10px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.9rem;">
                            Edit
                        </button>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${category.tags.map(tag => `
                        <span style="background: ${category.color}20; color: ${category.color}; padding: 5px 10px; border-radius: 15px; font-size: 0.9rem; display: flex; align-items: center; gap: 5px;">
                            ${tag}
                            <button onclick="farmManager.removeTagFromCategory('${categoryId}', '${tag}')" 
                                    style="background: none; border: none; color: ${category.color}; cursor: pointer; font-size: 0.8rem; padding: 0;">
                                ×
                            </button>
                        </span>
                    `).join('')}
                </div>
                ${category.tags.length === 0 ? '<div style="color: #95a5a6; font-style: italic;">No tags in this category</div>' : ''}
            </div>
        `).join('');
    }

    // Add tag to category dialog
    addTagToCategory(categoryId) {
        const tagName = prompt(`Add a new tag to ${this.tags[categoryId].name}:`);
        if (tagName) {
            if (this.addCustomTag(categoryId, tagName)) {
                this.refreshTagManager();
                this.showNotification(`Tag "${tagName}" added successfully!`, 'success');
            } else {
                this.showNotification('Tag already exists or invalid name', 'error');
            }
        }
    }

    // Remove tag from category
    removeTagFromCategory(categoryId, tagName) {
        if (confirm(`Remove tag "${tagName}" from ${this.tags[categoryId].name}?`)) {
            const tagIndex = this.tags[categoryId].tags.indexOf(tagName);
            if (tagIndex > -1) {
                this.tags[categoryId].tags.splice(tagIndex, 1);
                this.saveTags();
                this.refreshTagManager();
                this.logAudit('tag_removed', `Removed tag "${tagName}" from category "${categoryId}"`);
                this.showNotification(`Tag "${tagName}" removed successfully!`, 'success');
            }
        }
    }

    // Show tag selection interface for records
    showTagSelector(recordType, recordId, existingTags = []) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.6);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 25px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        `;

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #2c3e50;">Select Tags</h3>
                <button id="tag-selector-close" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #95a5a6;">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <input type="text" id="quick-tag-input" placeholder="Type to add a quick tag..." 
                       style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 10px;">
                <button id="add-quick-tag" style="padding: 8px 15px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Add Quick Tag
                </button>
            </div>
            
            <div id="tag-categories-selector">
                ${this.renderTagSelector(existingTags)}
            </div>
            
            <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                <button id="clear-all-tags" style="padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Clear All
                </button>
                <div>
                    <button id="cancel-tags" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 8px; cursor: pointer; margin-right: 10px;">
                        Cancel
                    </button>
                    <button id="save-tags" style="padding: 10px 20px; background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Save Tags
                    </button>
                </div>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Track selected tags
        let selectedTags = [...existingTags];

        // Event listeners
        content.querySelector('#tag-selector-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        content.querySelector('#cancel-tags').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        content.querySelector('#add-quick-tag').addEventListener('click', () => {
            const input = content.querySelector('#quick-tag-input');
            const tagName = input.value.trim();
            if (tagName) {
                selectedTags.push(tagName);
                this.addCustomTag('custom', tagName, '#95a5a6'); // Add to custom category
                input.value = '';
                this.refreshTagSelector(content, selectedTags);
            }
        });

        content.querySelector('#clear-all-tags').addEventListener('click', () => {
            selectedTags = [];
            this.refreshTagSelector(content, selectedTags);
        });

        content.querySelector('#save-tags').addEventListener('click', () => {
            // Remove old tags and add new ones
            const currentTags = this.getRecordTags(recordType, recordId);
            this.removeTagsFromRecord(recordType, recordId, currentTags);
            this.addTagsToRecord(recordType, recordId, selectedTags);
            
            this.showNotification('Tags updated successfully!', 'success');
            document.body.removeChild(modal);
            
            // Refresh the current view if needed
            this.refreshCurrentView();
        });

        // Handle tag selection
        content.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-option')) {
                const tagName = e.target.dataset.tag;
                if (selectedTags.includes(tagName)) {
                    selectedTags = selectedTags.filter(t => t !== tagName);
                } else {
                    selectedTags.push(tagName);
                }
                this.refreshTagSelector(content, selectedTags);
            }
        });

        // Handle Enter key in quick tag input
        content.querySelector('#quick-tag-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                content.querySelector('#add-quick-tag').click();
            }
        });
    }

    // Render tag selector with checkboxes
    renderTagSelector(selectedTags = []) {
        return Object.entries(this.tags).map(([categoryId, category]) => `
            <div style="margin-bottom: 20px;">
                <h4 style="color: ${category.color}; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                    ${category.icon} ${category.name}
                </h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${category.tags.map(tag => `
                        <button class="tag-option" data-tag="${tag}" 
                                style="background: ${selectedTags.includes(tag) ? category.color : category.color + '20'}; 
                                       color: ${selectedTags.includes(tag) ? 'white' : category.color}; 
                                       padding: 8px 12px; border: none; border-radius: 15px; cursor: pointer; 
                                       font-size: 0.9rem; transition: all 0.3s ease;">
                            ${selectedTags.includes(tag) ? '✓ ' : ''}${tag}
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Refresh tag selector
    refreshTagSelector(content, selectedTags) {
        const container = content.querySelector('#tag-categories-selector');
        container.innerHTML = this.renderTagSelector(selectedTags);
    }

    // Show smart tag filters interface
    showSmartTagFilters() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 900px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        `;

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #2c3e50; display: flex; align-items: center; gap: 10px;">
                    🔍 Smart Tag Filters
                </h2>
                <button id="smart-filter-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #95a5a6;">×</button>
            </div>
            
            <div style="margin-bottom: 25px;">
                <div style="display: flex; gap: 15px; margin-bottom: 15px; align-items: center;">
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="radio" name="filter-mode" value="any" checked> Any tag
                    </label>
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="radio" name="filter-mode" value="all"> All tags
                    </label>
                    <button id="apply-filters" style="padding: 8px 15px; background: linear-gradient(135deg, #3498db, #2ecc71); color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: auto;">
                        Apply Filters
                    </button>
                </div>
            </div>
            
            <div id="filter-categories">
                ${this.renderFilterCategories()}
            </div>
            
            <div id="filter-results" style="margin-top: 25px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
                <h3 style="color: #2c3e50;">Filtered Results</h3>
                <div id="results-container">
                    Click "Apply Filters" to see results
                </div>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Track selected filter tags
        let filterTags = [];

        // Event listeners
        content.querySelector('#smart-filter-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        content.querySelector('#apply-filters').addEventListener('click', () => {
            const matchAll = content.querySelector('input[name="filter-mode"]:checked').value === 'all';
            this.applySmartFilters(filterTags, matchAll, content);
        });

        // Handle tag filter selection
        content.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tag')) {
                const tagName = e.target.dataset.tag;
                if (filterTags.includes(tagName)) {
                    filterTags = filterTags.filter(t => t !== tagName);
                    e.target.style.background = e.target.dataset.color + '20';
                    e.target.style.color = e.target.dataset.color;
                } else {
                    filterTags.push(tagName);
                    e.target.style.background = e.target.dataset.color;
                    e.target.style.color = 'white';
                }
            }
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Render filter categories
    renderFilterCategories() {
        return Object.entries(this.tags).map(([categoryId, category]) => `
            <div style="margin-bottom: 20px;">
                <h4 style="color: ${category.color}; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                    ${category.icon} ${category.name}
                </h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${category.tags.map(tag => `
                        <button class="filter-tag" data-tag="${tag}" data-color="${category.color}"
                                style="background: ${category.color}20; color: ${category.color}; 
                                       padding: 8px 12px; border: none; border-radius: 15px; cursor: pointer; 
                                       font-size: 0.9rem; transition: all 0.3s ease;">
                            ${tag}
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Apply smart filters and show results
    applySmartFilters(filterTags, matchAll, content) {
        if (filterTags.length === 0) {
            content.querySelector('#results-container').innerHTML = '<div style="color: #95a5a6; font-style: italic;">Select tags to filter</div>';
            return;
        }

        const results = this.getRecordsWithTags(filterTags);
        const filteredResults = matchAll ? 
            results.filter(item => filterTags.every(tag => item.tags.includes(tag))) :
            results;

        const resultsHTML = filteredResults.length > 0 ? 
            filteredResults.map(item => `
                <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <div>
                            <strong style="color: #2c3e50;">${item.type.toUpperCase()}: ${item.record.name || item.record.tag || item.record.id}</strong>
                            <div style="color: #7f8c8d; font-size: 0.9rem; margin-top: 5px;">
                                ${this.getRecordSummary(item.record, item.type)}
                            </div>
                        </div>
                        <button onclick="farmManager.editRecordTags('${item.type}', '${item.record.id}')" 
                                style="padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                            Edit Tags
                        </button>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                        ${item.tags.map(tag => {
                            const category = this.getTagCategory(tag);
                            return `<span style="background: ${category.color}20; color: ${category.color}; padding: 3px 8px; border-radius: 10px; font-size: 0.8rem;">${tag}</span>`;
                        }).join('')}
                    </div>
                </div>
            `).join('') :
            '<div style="color: #95a5a6; font-style: italic;">No records found with selected tags</div>';

        content.querySelector('#results-container').innerHTML = `
            <div style="margin-bottom: 15px; color: #2c3e50;">
                Found ${filteredResults.length} record(s) ${matchAll ? 'with ALL' : 'with ANY'} selected tags
            </div>
            ${resultsHTML}
        `;
    }

    // Get record summary for display
    getRecordSummary(record, type) {
        switch (type) {
            case 'goat':
                return `${record.breed} • Born: ${record.dateOfBirth || 'Unknown'}`;
            case 'health':
                return `${record.treatmentType} • Date: ${record.date}`;
            case 'milk':
                return `${record.quantity} L • Date: ${record.date}`;
            case 'breeding':
                return `Doe: ${record.doe} • Buck: ${record.buck}`;
            default:
                return record.description || record.notes || 'No description';
        }
    }

    // Get category for a tag
    getTagCategory(tagName) {
        for (const [categoryId, category] of Object.entries(this.tags)) {
            if (category.tags.includes(tagName)) {
                return category;
            }
        }
        return { color: '#95a5a6', name: 'Unknown' };
    }

    // Quick edit record tags
    editRecordTags(recordType, recordId) {
        const existingTags = this.getRecordTags(recordType, recordId);
        this.showTagSelector(recordType, recordId, existingTags);
    }

    // Save tags to localStorage
    saveTags() {
        localStorage.setItem('farmTags', JSON.stringify(this.tags));
    }

    // Save record tags to localStorage
    saveRecordTags() {
        localStorage.setItem('farmRecordTags', JSON.stringify(this.recordTags));
    }

    // Refresh tag manager interface
    refreshTagManager() {
        const container = document.querySelector('#tag-categories-container');
        if (container) {
            container.innerHTML = this.renderTagCategories();
        }
    }

    // Refresh current view (placeholder for integration with existing views)
    refreshCurrentView() {
        // This would integrate with existing view refresh methods
        console.log('Refreshing current view with updated tags');
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db',
            warning: '#f39c12'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10001;
            font-family: 'Montserrat', sans-serif;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Export tags data
    exportTagsData() {
        const taggedRecords = [];
        
        Object.entries(this.recordTags).forEach(([recordKey, tags]) => {
            const [type, id] = recordKey.split('_');
            taggedRecords.push({
                recordType: type,
                recordId: id,
                tags: tags
            });
        });

        const exportData = {
            categories: this.tags,
            taggedRecords: taggedRecords,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `farm-tags-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.logAudit('tags_exported', 'Tags data exported to JSON file');
        this.showNotification('Tags data exported successfully!', 'success');
    }

    // Add tag menu button to main interface
    addTagMenuButton() {
        const tagMenuBtn = document.createElement('button');
        tagMenuBtn.id = 'tag-menu-btn';
        tagMenuBtn.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 20px;
            background: linear-gradient(135deg, #e67e22, #f39c12);
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            cursor: pointer;
            font-size: 24px;
            box-shadow: 0 4px 15px rgba(230, 126, 34, 0.4);
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        tagMenuBtn.innerHTML = '🏷️';
        tagMenuBtn.title = 'Tags & Categories';

        tagMenuBtn.addEventListener('mouseenter', () => {
            tagMenuBtn.style.transform = 'scale(1.1)';
            tagMenuBtn.style.boxShadow = '0 6px 20px rgba(230, 126, 34, 0.6)';
        });

        tagMenuBtn.addEventListener('mouseleave', () => {
            tagMenuBtn.style.transform = 'scale(1)';
            tagMenuBtn.style.boxShadow = '0 4px 15px rgba(230, 126, 34, 0.4)';
        });

        tagMenuBtn.addEventListener('click', () => {
            this.showTagMenu();
        });

        document.body.appendChild(tagMenuBtn);
    }

    // Show main tag menu
    showTagMenu() {
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: fixed;
            bottom: 160px;
            left: 20px;
            background: white;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 1001;
            font-family: 'Montserrat', sans-serif;
            min-width: 200px;
            border: 2px solid #e67e22;
        `;

        menu.innerHTML = `
            <div style="font-weight: 600; color: #2c3e50; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                🏷️ Tags & Categories
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button onclick="farmManager.showTagManager(); this.parentElement.parentElement.remove();" 
                        style="padding: 8px 12px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; text-align: left;">
                    📋 Manage Tags
                </button>
                <button onclick="farmManager.showSmartTagFilters(); this.parentElement.parentElement.remove();" 
                        style="padding: 8px 12px; background: #9b59b6; color: white; border: none; border-radius: 5px; cursor: pointer; text-align: left;">
                    🔍 Smart Filters
                </button>
                <button onclick="farmManager.showTagStatistics(); this.parentElement.parentElement.remove();" 
                        style="padding: 8px 12px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; text-align: left;">
                    📊 Tag Statistics
                </button>
            </div>
        `;

        document.body.appendChild(menu);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (menu.parentNode) {
                menu.parentNode.removeChild(menu);
            }
        }, 10000);

        // Close when clicking outside
        const closeHandler = (e) => {
            if (!menu.contains(e.target) && e.target.id !== 'tag-menu-btn') {
                if (menu.parentNode) {
                    menu.parentNode.removeChild(menu);
                }
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 100);
    }

    // Show tag statistics
    showTagStatistics() {
        const stats = this.calculateTagStatistics();
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 700px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        `;

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #2c3e50; display: flex; align-items: center; gap: 10px;">
                    📊 Tag Statistics
                </h2>
                <button id="stats-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #95a5a6;">×</button>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px;">
                <div style="background: linear-gradient(135deg, #3498db, #2ecc71); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${stats.totalCategories}</div>
                    <div>Categories</div>
                </div>
                <div style="background: linear-gradient(135deg, #e67e22, #f39c12); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${stats.totalTags}</div>
                    <div>Total Tags</div>
                </div>
                <div style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${stats.taggedRecords}</div>
                    <div>Tagged Records</div>
                </div>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3 style="color: #2c3e50; margin-bottom: 15px;">Most Used Tags</h3>
                ${stats.mostUsedTags.map(item => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #ecf0f1;">
                        <span style="color: #2c3e50;">${item.tag}</span>
                        <span style="background: #3498db; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.9rem;">${item.count}</span>
                    </div>
                `).join('')}
            </div>
            
            <div>
                <h3 style="color: #2c3e50; margin-bottom: 15px;">Category Usage</h3>
                ${Object.entries(stats.categoryUsage).map(([category, data]) => `
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                            <span style="color: ${data.color}; font-weight: 600;">${data.icon} ${data.name}</span>
                            <span style="color: #7f8c8d;">${data.usage} records</span>
                        </div>
                        <div style="background: #ecf0f1; border-radius: 10px; height: 8px; overflow: hidden;">
                            <div style="background: ${data.color}; height: 100%; width: ${Math.max(5, (data.usage / stats.taggedRecords * 100))}%; border-radius: 10px;"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        content.querySelector('#stats-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Calculate tag statistics
    calculateTagStatistics() {
        const stats = {
            totalCategories: Object.keys(this.tags).length,
            totalTags: Object.values(this.tags).reduce((sum, cat) => sum + cat.tags.length, 0),
            taggedRecords: Object.keys(this.recordTags).length,
            mostUsedTags: [],
            categoryUsage: {}
        };

        // Count tag usage
        const tagCounts = {};
        Object.values(this.recordTags).forEach(recordTags => {
            recordTags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        // Get most used tags
        stats.mostUsedTags = Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([tag, count]) => ({ tag, count }));

        // Calculate category usage
        Object.entries(this.tags).forEach(([categoryId, category]) => {
            const categoryTagCount = category.tags.reduce((sum, tag) => {
                return sum + (tagCounts[tag] || 0);
            }, 0);

            stats.categoryUsage[categoryId] = {
                name: category.name,
                color: category.color,
                icon: category.icon,
                usage: categoryTagCount
            };
        });

        return stats;
    }

    // === INTEGRATION WITH EXISTING RECORD VIEWS ===
    
    // Add tag display and edit buttons to record tables
    enhanceRecordDisplaysWithTags() {
        // Add tags to goat records
        this.addTagsToRecordTable('goats-table', 'goat');
        
        // Add tags to breeding records
        this.addTagsToRecordTable('breeding-table', 'breeding');
        
        // Add tags to health records
        this.addTagsToRecordTable('health-table', 'health');
        
        // Add tags to milk records
        this.addTagsToRecordTable('milk-table', 'milk');
        
        // Add tags to feed records
        this.addTagsToRecordTable('feed-table', 'feed');
        
        this.logAudit('tags_integration', 'Record displays enhanced with tags');
    }

    // Add tags column and buttons to specific record table
    addTagsToRecordTable(tableId, recordType) {
        const table = document.getElementById(tableId);
        if (!table) return;

        // Add tags header to table if it doesn't exist
        const headerRow = table.querySelector('thead tr');
        if (headerRow && !headerRow.querySelector('.tags-header')) {
            const tagHeader = document.createElement('th');
            tagHeader.className = 'tags-header';
            tagHeader.innerHTML = '🏷️ Tags';
            tagHeader.style.cssText = 'min-width: 150px; text-align: center;';
            headerRow.appendChild(tagHeader);
        }

        // Add tags cells to each row
        const bodyRows = table.querySelectorAll('tbody tr');
        bodyRows.forEach((row, index) => {
            if (!row.querySelector('.tags-cell')) {
                const tagCell = document.createElement('td');
                tagCell.className = 'tags-cell';
                tagCell.style.cssText = 'padding: 8px; text-align: center; vertical-align: middle;';
                
                const records = this.getRecordsByType(recordType);
                const record = records[index];
                
                if (record) {
                    tagCell.innerHTML = this.renderRecordTagsCell(recordType, record.id);
                }
                
                row.appendChild(tagCell);
            }
        });
    }

    // Render tags cell for a specific record
    renderRecordTagsCell(recordType, recordId) {
        const tags = this.getRecordTags(recordType, recordId);
        
        return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <div style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; max-width: 200px;">
                    ${tags.slice(0, 3).map(tag => {
                        const category = this.getTagCategory(tag);
                        return `<span class="record-tag" style="background: ${category.color}20; color: ${category.color}; padding: 2px 6px; border-radius: 8px; font-size: 0.7rem;">${tag}</span>`;
                    }).join('')}
                    ${tags.length > 3 ? `<span style="color: #7f8c8d; font-size: 0.7rem;">+${tags.length - 3} more</span>` : ''}
                </div>
                <button onclick="farmManager.editRecordTags('${recordType}', '${recordId}')" 
                        style="padding: 4px 8px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.7rem; min-width: 60px;">
                    ${tags.length === 0 ? 'Add Tags' : 'Edit Tags'}
                </button>
            </div>
        `;
    }

    // Add quick tag filter bar to any page
    addQuickTagFilter(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const filterBar = document.createElement('div');
        filterBar.id = 'quick-tag-filter';
        filterBar.style.cssText = `
            background: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 20px;
            border-left: 4px solid #3498db;
        `;

        filterBar.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                <div style="font-weight: 600; color: #2c3e50; display: flex; align-items: center; gap: 5px;">
                    🔍 Quick Filter:
                </div>
                <div id="quick-filter-tags" style="display: flex; flex-wrap: wrap; gap: 8px; flex: 1;">
                    ${this.renderQuickFilterTags()}
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="farmManager.clearQuickFilter()" 
                            style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                        Clear
                    </button>
                    <button onclick="farmManager.showSmartTagFilters()" 
                            style="padding: 6px 12px; background: #9b59b6; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                        Advanced
                    </button>
                </div>
            </div>
        `;

        container.insertBefore(filterBar, container.firstChild);
    }

    // Render quick filter tags (most used tags)
    renderQuickFilterTags() {
        const tagCounts = {};
        Object.values(this.recordTags).forEach(recordTags => {
            recordTags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        const popularTags = Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([tag]) => tag);

        return popularTags.map(tag => {
            const category = this.getTagCategory(tag);
            return `
                <button class="quick-filter-tag" data-tag="${tag}" 
                        style="background: ${category.color}20; color: ${category.color}; 
                               padding: 6px 10px; border: none; border-radius: 12px; cursor: pointer; 
                               font-size: 0.8rem; transition: all 0.3s ease;">
                    ${tag}
                </button>
            `;
        }).join('');
    }

    // Handle quick filter tag clicks
    setupQuickFilterHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-filter-tag')) {
                const tag = e.target.dataset.tag;
                const isActive = e.target.classList.contains('active');
                
                if (isActive) {
                    e.target.classList.remove('active');
                    e.target.style.background = e.target.style.background.replace(/[^20]/g, '') + '20';
                    this.removeActiveFilter(tag);
                } else {
                    e.target.classList.add('active');
                    const category = this.getTagCategory(tag);
                    e.target.style.background = category.color;
                    e.target.style.color = 'white';
                    this.addActiveFilter(tag);
                }
                
                this.applyQuickFilters();
            }
        });
    }

    // Manage active filters
    addActiveFilter(tag) {
        if (!this.activeFilters) this.activeFilters = [];
        if (!this.activeFilters.includes(tag)) {
            this.activeFilters.push(tag);
        }
    }

    removeActiveFilter(tag) {
        if (!this.activeFilters) this.activeFilters = [];
        this.activeFilters = this.activeFilters.filter(t => t !== tag);
    }

    clearQuickFilter() {
        this.activeFilters = [];
        
        // Reset visual state of filter buttons
        const filterTags = document.querySelectorAll('.quick-filter-tag');
        filterTags.forEach(btn => {
            btn.classList.remove('active');
            const category = this.getTagCategory(btn.dataset.tag);
            btn.style.background = category.color + '20';
            btn.style.color = category.color;
        });
        
        this.applyQuickFilters();
    }

    // Apply active filters to current view
    applyQuickFilters() {
        // This would integrate with existing table filtering logic
        console.log('Applying filters:', this.activeFilters);
        
        // Show filter status
        this.showFilterStatus();
        
        // Here you would filter the visible records based on activeFilters
        // This is a placeholder for integration with existing view logic
    }

    // Show current filter status
    showFilterStatus() {
        const existingStatus = document.getElementById('filter-status');
        if (existingStatus) {
            existingStatus.remove();
        }

        if (!this.activeFilters || this.activeFilters.length === 0) {
            return;
        }

        const status = document.createElement('div');
        status.id = 'filter-status';
        status.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #3498db;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
            z-index: 1000;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9rem;
        `;

        status.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span>🔍 Filtering by: ${this.activeFilters.join(', ')}</span>
                <button onclick="farmManager.clearQuickFilter()" 
                        style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 2px 6px; border-radius: 4px; cursor: pointer;">
                    ×
                </button>
            </div>
        `;

        document.body.appendChild(status);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (status.parentNode) {
                status.parentNode.removeChild(status);
            }
        }, 10000);
    }

    // Bulk tag operations for selected records
    showBulkTagDialog() {
        if (!this.selectedGoats || this.selectedGoats.size === 0) {
            this.showNotification('Please select some records first', 'warning');
            return;
        }

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        `;

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #2c3e50; display: flex; align-items: center; gap: 10px;">
                    🏷️ Bulk Tag Operations
                </h2>
                <button id="bulk-tag-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #95a5a6;">×</button>
            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
                <strong>Selected Records:</strong> ${this.selectedGoats.size} items
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3 style="color: #2c3e50; margin-bottom: 15px;">Choose Operation:</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button id="bulk-add-tags" style="padding: 12px 20px; background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; border: none; border-radius: 8px; cursor: pointer; text-align: left;">
                        ➕ Add Tags to Selected Records
                    </button>
                    <button id="bulk-remove-tags" style="padding: 12px 20px; background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; border: none; border-radius: 8px; cursor: pointer; text-align: left;">
                        ➖ Remove Tags from Selected Records
                    </button>
                    <button id="bulk-replace-tags" style="padding: 12px 20px; background: linear-gradient(135deg, #f39c12, #e67e22); color: white; border: none; border-radius: 8px; cursor: pointer; text-align: left;">
                        🔄 Replace All Tags
                    </button>
                </div>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Event listeners
        content.querySelector('#bulk-tag-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        content.querySelector('#bulk-add-tags').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.showBulkTagSelector('add');
        });

        content.querySelector('#bulk-remove-tags').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.showBulkTagSelector('remove');
        });

        content.querySelector('#bulk-replace-tags').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.showBulkTagSelector('replace');
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Show tag selector for bulk operations
    showBulkTagSelector(operation) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.6);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 25px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        `;

        const operationTitles = {
            add: '➕ Add Tags to Selected Records',
            remove: '➖ Remove Tags from Selected Records',
            replace: '🔄 Replace All Tags'
        };

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #2c3e50;">${operationTitles[operation]}</h3>
                <button id="bulk-selector-close" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #95a5a6;">×</button>
            </div>
            
            <div id="bulk-tag-categories">
                ${this.renderTagSelector([])}
            </div>
            
            <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                <button id="cancel-bulk" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Cancel
                </button>
                <button id="apply-bulk" style="padding: 10px 20px; background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Apply to ${this.selectedGoats.size} Records
                </button>
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        let selectedTags = [];

        // Event listeners
        content.querySelector('#bulk-selector-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        content.querySelector('#cancel-bulk').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        content.querySelector('#apply-bulk').addEventListener('click', () => {
            this.executeBulkTagOperation(operation, selectedTags);
            document.body.removeChild(modal);
        });

        // Handle tag selection
        content.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-option')) {
                const tagName = e.target.dataset.tag;
                if (selectedTags.includes(tagName)) {
                    selectedTags = selectedTags.filter(t => t !== tagName);
                } else {
                    selectedTags.push(tagName);
                }
                this.refreshBulkTagSelector(content, selectedTags);
            }
        });
    }

    // Execute bulk tag operation on selected records
    executeBulkTagOperation(operation, tags) {
        if (tags.length === 0) {
            this.showNotification('Please select at least one tag', 'warning');
            return;
        }

        let count = 0;
        const recordType = 'goat'; // Assuming we're working with goats, but this could be dynamic

        this.selectedGoats.forEach(recordId => {
            const currentTags = this.getRecordTags(recordType, recordId);
            
            switch (operation) {
                case 'add':
                    this.addTagsToRecord(recordType, recordId, tags);
                    count++;
                    break;
                case 'remove':
                    this.removeTagsFromRecord(recordType, recordId, tags);
                    count++;
                    break;
                case 'replace':
                    this.removeTagsFromRecord(recordType, recordId, currentTags);
                    this.addTagsToRecord(recordType, recordId, tags);
                    count++;
                    break;
            }
        });

        this.showNotification(`${operation.charAt(0).toUpperCase() + operation.slice(1)} operation completed on ${count} records`, 'success');
        this.logAudit('bulk_tag_operation', `${operation} tags on ${count} records: ${tags.join(', ')}`);
        
        // Refresh the current view
        this.refreshCurrentView();
        this.enhanceRecordDisplaysWithTags();
    }

    // Refresh bulk tag selector
    refreshBulkTagSelector(content, selectedTags) {
        const container = content.querySelector('#bulk-tag-categories');
        container.innerHTML = this.renderTagSelector(selectedTags);
    }

    // Enhanced mobile responsiveness setup
    setupMobileEnhancements() {
        try {
            // Detect mobile device
            this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            this.isTablet = /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent);
            
            if (this.isMobile || this.isTablet) {
                document.body.classList.add('mobile-device');
                
                // Add touch-friendly enhancements
                this.addTouchGestures();
                this.optimizeForMobile();
                this.addMobileNavigation();
                
                this.logAudit('mobile_enhancement', `Mobile optimizations applied for ${this.isMobile ? 'mobile' : 'tablet'} device`);
            }

            // Add responsive viewport listeners
            window.addEventListener('resize', this.handleViewportChange.bind(this));
            window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
            
            // Initial viewport setup
            this.handleViewportChange();
        } catch (error) {
            console.error('Mobile enhancement setup failed:', error);
        }
    }

    // Add touch gesture support
    addTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Swipe detection (minimum 50px movement)
            if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }

            touchStartX = 0;
            touchStartY = 0;
        });
    }

    // Handle swipe gestures
    handleSwipeRight() {
        // Could implement navigation between sections
        console.log('Swipe right detected');
    }

    handleSwipeLeft() {
        // Could implement navigation between sections
        console.log('Swipe left detected');
    }

    // Optimize interface for mobile
    optimizeForMobile() {
        // Larger touch targets
        const buttons = document.querySelectorAll('button, .action-btn');
        buttons.forEach(btn => {
            btn.style.minHeight = '44px';
            btn.style.minWidth = '44px';
            btn.style.padding = '12px';
        });

        // Larger form inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.fontSize = '16px'; // Prevents zoom on iOS
            input.style.padding = '12px';
            input.style.minHeight = '44px';
        });

        // Optimize tables for mobile
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (this.isMobile) {
                table.style.fontSize = '14px';
                // Make tables horizontally scrollable
                const wrapper = document.createElement('div');
                wrapper.style.overflowX = 'auto';
                wrapper.style.WebkitOverflowScrolling = 'touch';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    }

    // Add mobile-friendly navigation
    addMobileNavigation() {
        if (this.isMobile) {
            // Create hamburger menu if it doesn't exist
            let hamburger = document.querySelector('.mobile-menu-toggle');
            if (!hamburger) {
                hamburger = document.createElement('button');
                hamburger.className = 'mobile-menu-toggle';
                hamburger.innerHTML = '☰';
                hamburger.style.cssText = `
                    position: fixed;
                    top: 15px;
                    left: 15px;
                    z-index: 1000;
                    background: #2c3e50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    padding: 10px;
                    font-size: 18px;
                    cursor: pointer;
                `;
                
                hamburger.addEventListener('click', this.toggleMobileMenu.bind(this));
                document.body.appendChild(hamburger);
            }
        }
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const nav = document.querySelector('.nav-links');
        if (nav) {
            nav.classList.toggle('mobile-open');
            if (nav.classList.contains('mobile-open')) {
                nav.style.cssText = `
                    position: fixed;
                    top: 60px;
                    left: 0;
                    width: 100%;
                    background: white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    z-index: 999;
                    display: block !important;
                `;
            } else {
                nav.style.display = '';
            }
        }
    }

    // Handle viewport changes
    handleViewportChange() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Adjust interface based on viewport size
        if (width < 768) {
            document.body.classList.add('small-screen');
        } else {
            document.body.classList.remove('small-screen');
        }

        // Adjust dashboard layout
        if (width < 1024) {
            document.body.classList.add('compact-layout');
        } else {
            document.body.classList.remove('compact-layout');
        }

        this.logAudit('viewport_change', `Viewport: ${width}x${height}`);
    }

    // Handle orientation changes
    handleOrientationChange() {
        setTimeout(() => {
            this.handleViewportChange();
            
            // Refresh charts if they exist
            if (typeof this.updateCharts === 'function') {
                this.updateCharts();
            }
            
            this.logAudit('orientation_change', `New orientation: ${window.orientation || 'unknown'}`);
        }, 100);
    }

    // Handle critical initialization errors
    handleInitializationError(error) {
        try {
            const errorMessage = `App initialization failed: ${error.message}`;
            this.logAudit('initialization_error', errorMessage);
            
            // Show user-friendly error message
            if (typeof alert !== 'undefined') {
                alert('Application failed to start properly. Please refresh the page. If the problem persists, contact support.');
            }
            
            // Try minimal initialization
            const loginModal = document.getElementById('login-modal');
            if (loginModal) {
                loginModal.style.display = 'flex';
            }
        } catch (fallbackError) {
            console.error('❌ Even fallback initialization failed:', fallbackError);
        }
    }

    // Utility function to calculate age from date of birth
    calculateAge(dob) {
        if (!dob) return 'N/A';
        
        const today = new Date();
        const birthDate = new Date(dob);
        
        if (isNaN(birthDate.getTime())) return 'N/A';
        
        const diffTime = today - birthDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 30) {
            return `${diffDays} days`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} months`;
        } else {
            const years = Math.floor(diffDays / 365);
            const remainingMonths = Math.floor((diffDays % 365) / 30);
            return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} years`;
        }
    }

    // Authentication
    initializeAuth() {
        const loginModal = document.getElementById('login-modal');
        const mainContent = document.getElementById('main-content');
        
        // Check if user is logged in
        const loggedIn = localStorage.getItem('farmRecordsAuth');
        if (loggedIn) {
            this.currentUser = JSON.parse(loggedIn);
            loginModal.style.display = 'none';
            mainContent.style.display = 'block';
            this.initializeApp();
        } else {
            loginModal.style.display = 'flex';
            mainContent.style.display = 'none';
        }
    }

    login(username, password) {
        try {
            // Input validation
            if (!username || !password) {
                alert('Please enter both username and password');
                return false;
            }

            username = this.sanitizeInput(username);
            password = this.sanitizeInput(password);

            // Two-Factor Authentication for admin
            if (username === 'admin' && password === 'farm2024') {
                try {
                    this.request2FA(username);
                    const inputCode = prompt('Enter the 2FA code sent to your device:');
                    if (!this.verify2FA(inputCode)) {
                        alert('Invalid 2FA code. Access denied.');
                        this.logAudit('login_failed', 'Admin 2FA verification failed');
                        return false;
                    }
                    this.currentUser = { username, loginTime: new Date().toISOString(), role: 'administrator', permissions: ['export_reports', 'export_audit_log'] };
                    localStorage.setItem('farmRecordsAuth', JSON.stringify(this.currentUser));
                    document.getElementById('login-modal').style.display = 'none';
                    document.getElementById('main-content').style.display = 'block';
                    this.showWelcomeMessage();
                    this.initializeApp();
                    this.logAudit('login', 'Admin logged in successfully');
                    return true;
                } catch (authError) {
                    console.error('Admin authentication error:', authError);
                    this.logAudit('login_error', `Admin authentication error: ${authError.message}`);
                    alert('Authentication system error. Please try again.');
                    return false;
                }
            } else if (username === 'external' && password === 'guest2025') {
                try {
                    // External user login
                    this.currentUser = { username, loginTime: new Date().toISOString(), role: 'external', permissions: ['export_reports'] };
                    localStorage.setItem('farmRecordsAuth', JSON.stringify(this.currentUser));
                    document.getElementById('login-modal').style.display = 'none';
                    document.getElementById('main-content').style.display = 'block';
                    this.showExternalWelcomeMessage('Welcome to Mountain Goat Farm Records! Please follow the instructions provided.');
                    this.startExternalSessionTimeout();
                    this.enableReadOnlyUIMode();
                    this.improveAccessibility();
                    this.initializeApp();
                    this.logAudit('login', 'External user logged in successfully');
                    return true;
                } catch (extError) {
                    console.error('External user authentication error:', extError);
                    this.logAudit('login_error', `External authentication error: ${extError.message}`);
                    alert('Authentication system error. Please try again.');
                    return false;
                }
            }
            
            this.logAudit('login_failed', `Failed login attempt for ${username}`);
            return false;
        } catch (error) {
            console.error('Critical login error:', error);
            this.logAudit('login_critical_error', `Critical login system error: ${error.message}`);
            alert('Login system error. Please refresh the page and try again.');
            return false;
        }
    }

    showWelcomeMessage() {
        // Create welcome notification
        const welcomeDiv = document.createElement('div');
        welcomeDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 20px 25px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            z-index: 1001;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            max-width: 350px;
            animation: slideIn 0.5s ease-out;
        `;
        
        welcomeDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 1.8rem;">🎉</span>
                <div>
                    <div style="font-size: 1.1rem; margin-bottom: 5px;">Welcome to Farm Records!</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">Mountain Goat Farm Management System</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(welcomeDiv);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            welcomeDiv.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                if (welcomeDiv.parentNode) {
                    welcomeDiv.parentNode.removeChild(welcomeDiv);
                }
            }, 500);
        }, 4000);
    }

    logout() {
        localStorage.removeItem('farmRecordsAuth');
        this.currentUser = null;
        document.getElementById('login-modal').style.display = 'flex';
        document.getElementById('main-content').style.display = 'none';
    }

    // Initialize the app
    initializeApp() {
        // Close any open modals first with extra security
        this.closeAllModals();
        
        this.loadGoats();
        this.loadBreedingRecords();
        this.loadMeatRecords();
        this.loadMilkRecords();
        this.loadFeedRecords();
        this.loadHealthRecords();
        this.loadProducts();
        this.loadContacts();
        this.loadCrops(); // Add missing loadCrops
        this.updateDashboard();
        this.populateGoatDropdowns();
        
        // Force close modals again after loading (emergency fix)
        setTimeout(() => {
            this.closeAllModals();
        }, 100);
    }

    // Close all modals to prevent unexpected modal displays
    closeAllModals() {
        const modalIds = [
            'goat-modal', 'breeding-modal', 'meat-modal', 'milk-modal', 
            'feed-modal', 'health-modal', 'product-modal', 'contact-modal',
            'task-modal', 'reminder-modal', 'transaction-modal', 'crop-modal'
        ];
        
        modalIds.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
                
                // Extra security - force hide
                modal.style.visibility = 'hidden';
                setTimeout(() => {
                    modal.style.visibility = '';
                }, 50);
            }
        });
        
        // Force focus back to main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.focus();
        }
        
        console.log('✅ All modals forcefully closed during initialization');
    }

    // Emergency modal closer function
    forceCloseAllModals() {
        const allModals = document.querySelectorAll('.modal');
        allModals.forEach(modal => {
            modal.style.display = 'none !important';
            modal.style.visibility = 'hidden';
            setTimeout(() => {
                modal.style.visibility = '';
            }, 100);
        });
        
        console.log('🚨 Emergency: All modals force-closed');
    }

    // Setup event listeners
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Helper function to safely add event listeners
        const safeAddEventListener = (selector, event, handler) => {
            const element = document.getElementById(selector) || document.querySelector(selector);
            if (element) {
                element.addEventListener(event, handler);
                console.log(`✅ Event listener added to: ${selector}`);
            } else {
                console.warn(`❌ Element not found: ${selector}`);
            }
        };

        // Login form
        safeAddEventListener('login-form', 'submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (this.login(username, password)) {
                document.getElementById('login-form').reset();
            } else {
                alert('Invalid credentials. Use admin/farm2024');
            }
        });

        // Quick demo access button
        safeAddEventListener('demo-login', 'click', () => {
            if (this.login('admin', 'farm2024')) {
                console.log('✅ Demo access granted');
            }
        });

        // Auto-fill credentials button
        safeAddEventListener('auto-fill', 'click', () => {
            const usernameField = document.getElementById('username');
            const passwordField = document.getElementById('password');
            
            if (usernameField && passwordField) {
                usernameField.value = 'admin';
                passwordField.value = 'farm2024';
                usernameField.focus();
                
                // Add visual feedback
                usernameField.style.background = '#e8f5e8';
                passwordField.style.background = '#e8f5e8';
                
                setTimeout(() => {
                    usernameField.style.background = '';
                    passwordField.style.background = '';
                }, 1500);
            }
        });

        // Logout button
        safeAddEventListener('logout-btn', 'click', () => {
            this.logout();
        });

        // Goat management
        safeAddEventListener('add-goat-btn', 'click', () => {
            this.showGoatModal();
        });

        safeAddEventListener('goat-form', 'submit', (e) => {
            e.preventDefault();
            this.saveGoat();
        });

        safeAddEventListener('goat-cancel', 'click', () => {
            this.hideGoatModal();
        });

        // Breeding record management
        safeAddEventListener('add-breeding-record-btn', 'click', () => {
            this.showBreedingModal();
        });

        // Meat production record management
        safeAddEventListener('add-meat-record-btn', 'click', () => {
            this.showMeatModal();
        });

        // Milk record management
        safeAddEventListener('add-milk-record-btn', 'click', () => {
            this.showMilkModal();
        });

        safeAddEventListener('milk-form', 'submit', (e) => {
            e.preventDefault();
            this.saveMilkRecord();
        });

        safeAddEventListener('milk-cancel', 'click', () => {
            this.hideMilkModal();
        });

        // Feed record management
        safeAddEventListener('add-feed-record-btn', 'click', () => {
            this.showFeedModal();
        });

        safeAddEventListener('feed-form', 'submit', (e) => {
            e.preventDefault();
            this.saveFeedRecord();
        });

        safeAddEventListener('feed-cancel', 'click', () => {
            this.hideFeedModal();
        });

        // Health record management
        safeAddEventListener('add-health-record-btn', 'click', () => {
            this.showHealthModal();
        });

        safeAddEventListener('health-form', 'submit', (e) => {
            e.preventDefault();
            this.saveHealthRecord();
        });

        safeAddEventListener('health-cancel', 'click', () => {
            this.hideHealthModal();
        });

        // Product management
        document.getElementById('add-product-btn-farm').addEventListener('click', () => {
            this.showProductModal();
        });

        document.getElementById('product-form-farm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        document.getElementById('product-cancel-farm').addEventListener('click', () => {
            this.hideProductModal();
        });

        // Contact management
        safeAddEventListener('add-contact-btn', 'click', () => {
            this.showContactModal();
        });

        safeAddEventListener('contact-form', 'submit', (e) => {
            e.preventDefault();
            this.saveContact();
        });

        safeAddEventListener('contact-cancel', 'click', () => {
            this.hideContactModal();
        });

        safeAddEventListener('contact-filter', 'change', (e) => {
            this.filterContacts(e.target.value);
        });

        // Task management
        safeAddEventListener('add-task-btn', 'click', () => {
            this.showTaskModal();
        });

        safeAddEventListener('task-form', 'submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });

        safeAddEventListener('task-cancel', 'click', () => {
            this.hideTaskModal();
        });

        safeAddEventListener('task-filter', 'change', (e) => {
            this.filterTasks(e.target.value);
        });

        // Reminder management
        safeAddEventListener('add-reminder-btn', 'click', () => {
            this.showReminderModal();
        });

        safeAddEventListener('reminder-form', 'submit', (e) => {
            e.preventDefault();
            this.saveReminder();
        });

        safeAddEventListener('reminder-cancel', 'click', () => {
            this.hideReminderModal();
        });

        document.getElementById('reminder-filter').addEventListener('change', (e) => {
            this.filterReminders(e.target.value);
        });

        // Transaction management
        safeAddEventListener('add-transaction-btn', 'click', () => {
            this.showTransactionModal();
        });

        safeAddEventListener('transaction-form', 'submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
        });

        safeAddEventListener('transaction-cancel', 'click', () => {
            this.hideTransactionModal();
        });

        // Financial tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showFinancialTab(e.target.dataset.tab);
            });
        });

        // Breakeven calculator
        document.getElementById('calculate-breakeven').addEventListener('click', () => {
            this.calculateBreakeven();
        });

        // Sales management
        safeAddEventListener('add-sale-btn', 'click', () => {
            this.showSaleModal();
        });

        safeAddEventListener('sale-form', 'submit', (e) => {
            e.preventDefault();
            this.saveSale();
        });

        safeAddEventListener('sale-cancel', 'click', () => {
            this.hideSaleModal();
        });

        // Sale quantity/price calculation
        document.getElementById('sale-quantity').addEventListener('input', () => {
            this.calculateSaleTotal();
        });

        document.getElementById('sale-unit-price').addEventListener('input', () => {
            this.calculateSaleTotal();
        });

        // Crop management
        safeAddEventListener('add-crop-btn', 'click', () => {
            this.showCropModal();
        });

        safeAddEventListener('crop-form', 'submit', (e) => {
            e.preventDefault();
            this.saveCrop();
        });

        safeAddEventListener('crop-cancel', 'click', () => {
            this.hideCropModal();
        });

        safeAddEventListener('crop-filter', 'change', (e) => {
            this.filterCrops(e.target.value);
        });

        // Navigation
        const navLinks = document.querySelectorAll('.nav-links a');
        console.log('Found navigation links:', navLinks.length);
        
        navLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            console.log(`Nav link ${index}: ${href}`, link.textContent);
            
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    console.log(`Navigation clicked: ${targetId}`);
                    this.showSection(targetId);
                });
                console.log(`✅ Event listener added to: ${link.textContent} -> ${href}`);
            } else {
                console.log(`⏭️ Skipping non-hash link: ${href}`);
            }
        });
        
        // Also add a global navigation function for testing
        window.navigateTo = (sectionId) => {
            console.log('Direct navigation to:', sectionId);
            this.showSection(sectionId);
        };

        // Form tabs (for goat modal and other multi-tab forms)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const tabName = e.target.dataset.tab;
                const modalContent = e.target.closest('.modal-content');
                
                if (modalContent) {
                    // Handle modal tabs for different roles/modal types
                    // Extendable: Add more roles/modal types as needed
                    if (modalContent.classList.contains('goat-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'goat');
                    } else if (modalContent.classList.contains('breeding-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'breeding');
                    } else if (modalContent.classList.contains('meat-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'meat');
                    } else if (modalContent.classList.contains('milk-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'milk');
                    } else if (modalContent.classList.contains('feed-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'feed');
                    } else if (modalContent.classList.contains('health-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'health');
                    } else if (modalContent.classList.contains('product-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'product');
                    } else if (modalContent.classList.contains('contact-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'contact');
                    } else if (modalContent.classList.contains('task-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'task');
                    } else if (modalContent.classList.contains('reminder-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'reminder');
                    } else if (modalContent.classList.contains('transaction-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'transaction');
                    } else if (modalContent.classList.contains('crop-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'crop');
                    } else if (modalContent.classList.contains('lease-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'lease');
                    } else if (modalContent.classList.contains('equipment-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'equipment');
                    } else if (modalContent.classList.contains('laborer-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'laborer');
                    } else if (modalContent.classList.contains('assignment-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'assignment');
                    } else if (modalContent.classList.contains('payment-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'payment');
                    } else if (modalContent.classList.contains('user-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'user');
                    } else if (modalContent.classList.contains('settings-modal-content')) {
                        this.switchModalTab(modalContent, tabName, 'settings');
                    } else {
                        // Default fallback for unknown modal types
                        this.switchModalTab(modalContent, tabName);
                    }
                }
            }
        });

        // === NEW MODULES EVENT LISTENERS ===

        // Land Lease Records
        safeAddEventListener('add-lease-btn', 'click', () => {
            this.showLeaseModal();
        });

        safeAddEventListener('lease-form', 'submit', (e) => {
            e.preventDefault();
            this.saveLease();
        });

        safeAddEventListener('lease-cancel', 'click', () => {
            this.hideLeaseModal();
        });

        // Machinery & Equipment
        safeAddEventListener('add-equipment-btn', 'click', () => {
            this.showEquipmentModal();
        });

        safeAddEventListener('equipment-form', 'submit', (e) => {
            e.preventDefault();
            this.saveEquipment();
        });

        safeAddEventListener('equipment-cancel', 'click', () => {
            this.hideEquipmentModal();
        });

        // Casual Laborers
        safeAddEventListener('add-laborer-btn', 'click', () => {
            this.showLaborerModal();
        });

        safeAddEventListener('add-job-assignment-btn', 'click', () => {
            this.showAssignmentModal();
        });

        safeAddEventListener('record-payment-btn', 'click', () => {
            this.showPaymentModal();
        });

        safeAddEventListener('laborer-form', 'submit', (e) => {
            e.preventDefault();
            this.saveLaborer();
        });

        safeAddEventListener('assignment-form', 'submit', (e) => {
            e.preventDefault();
            this.saveJobAssignment();
        });

        safeAddEventListener('payment-form', 'submit', (e) => {
            e.preventDefault();
            this.saveLaborPayment();
        });

        safeAddEventListener('laborer-cancel', 'click', () => {
            this.hideLaborerModal();
        });

        safeAddEventListener('assignment-cancel', 'click', () => {
            this.hideAssignmentModal();
        });

        safeAddEventListener('payment-cancel', 'click', () => {
            this.hidePaymentModal();
        });

        // Settings & Permissions
        safeAddEventListener('add-user-btn', 'click', () => {
            this.showUserModal();
        });

        safeAddEventListener('user-form', 'submit', (e) => {
            e.preventDefault();
            this.saveUser();
        });

        safeAddEventListener('user-cancel', 'click', () => {
            this.hideUserModal();
        });

        safeAddEventListener('system-settings-form', 'submit', (e) => {
            e.preventDefault();
            this.saveSystemSettings();
        });

        safeAddEventListener('security-settings-form', 'submit', (e) => {
            e.preventDefault();
            this.saveSecuritySettings();
        });

        // Auto-calculate payment amount when days or rate changes
        const calculatePaymentAmount = () => {
            const days = parseFloat(document.getElementById('payment-days-worked')?.value || 0);
            const rate = parseFloat(document.getElementById('payment-daily-rate')?.value || 0);
            const amount = days * rate;
            const amountField = document.getElementById('payment-amount');
            if (amountField) {
                amountField.value = amount.toFixed(2);
            }
        };

        safeAddEventListener('payment-days-worked', 'input', calculatePaymentAmount);
        safeAddEventListener('payment-daily-rate', 'input', calculatePaymentAmount);
    }

    // Navigation
    showSection(sectionId) {
        console.log('showSection called with:', sectionId);
        
        // Hide all sections
        const allSections = document.querySelectorAll('.records-section, .dashboard-section');
        console.log('Found sections to hide:', allSections.length);
        allSections.forEach(section => {
            section.style.display = 'none';
        });
        
        if (sectionId === 'dashboard' || !sectionId) {
            const dashboard = document.getElementById('dashboard');
            if (dashboard) {
                dashboard.style.display = 'block';
                console.log('✅ Showing dashboard');
            } else {
                console.error('❌ Dashboard section not found');
            }
        } else {
            const section = document.getElementById(sectionId);
            console.log(`Looking for section: ${sectionId}`, section);
            if (section) {
                section.style.display = 'block';
                console.log(`✅ Showing section: ${sectionId}`);
                
                // Also call the load function for this section if it exists
                this.loadSectionData(sectionId);
            } else {
                console.error(`❌ Section not found: ${sectionId}`);
            }
        }
    }
    
    // Load data for specific sections
    loadSectionData(sectionId) {
        console.log('Loading data for section:', sectionId);
        switch(sectionId) {
            case 'goat-records':
                this.loadGoats();
                break;
            case 'breeding-records':
                this.loadBreedingRecords();
                break;
            case 'meat-production':
                this.loadMeatRecords();
                break;
            case 'products-management':
                this.loadProducts();
                break;
            case 'feed-schedule':
                this.loadFeedRecords();
                break;
            case 'health-records':
                this.loadHealthRecords();
                break;
            case 'contact-management':
                this.loadContacts();
                break;
            case 'task-manager':
                this.loadTasks();
                break;
            case 'reminders':
                this.loadReminders();
                break;
            case 'financial-records':
                this.loadTransactions();
                break;
            case 'sales-records':
                this.loadSales();
                break;
            case 'crop-management':
                this.loadCrops();
                break;
            default:
                console.log('No specific load function for:', sectionId);
        }
    }

    // Dashboard
    updateDashboard() {
        // Basic goat statistics
        const totalGoats = this.goats.length;
        const bucks = this.goats.filter(goat => goat.gender === 'buck').length;
        const does = this.goats.filter(goat => goat.gender === 'doe').length;
        const kids = this.goats.filter(goat => goat.gender === 'kid').length;
        const breedingStock = this.goats.filter(goat => goat.breedingStatus === 'available').length;
        
        // Update goat counts
        document.getElementById('total-goats').textContent = totalGoats;
        document.getElementById('total-goats-count').textContent = totalGoats;
        document.getElementById('buck-count').textContent = bucks;
        document.getElementById('doe-count').textContent = does;
        document.getElementById('kid-count').textContent = kids;
        document.getElementById('breeding-count').textContent = breedingStock;
        
        // Calculate breeding pairs
        const breedingPairs = Math.min(bucks, Math.floor(does / 5));
        document.getElementById('breeding-stock').textContent = `${breedingPairs} pairs`;
        
        // Health alerts
        const healthAlerts = this.goats.filter(goat => 
            goat.healthStatus === 'treatment' || goat.healthStatus === 'monitoring'
        ).length;
        document.getElementById('health-alerts').textContent = healthAlerts;
        
        // Task and reminder counts
        const pendingTasks = this.tasks.filter(task => task.status === 'pending').length;
        const remindersDue = this.reminders.filter(reminder => {
            const reminderDate = new Date(reminder.datetime);
            const today = new Date();
            return reminderDate <= today && reminder.status === 'active';
        }).length;
        
        document.getElementById('pending-tasks').textContent = pendingTasks;
        document.getElementById('reminders-due').textContent = remindersDue;
        
        // Financial calculations
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyIncome = this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return t.type === 'income' && 
                   transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        }).reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        const monthlyExpenses = this.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return t.type === 'expense' && 
                   transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        }).reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        const cashFlow = monthlyIncome - monthlyExpenses;
        
        document.getElementById('monthly-revenue').textContent = `KSh ${monthlyIncome.toLocaleString()}`;
        document.getElementById('cash-flow').textContent = `KSh ${cashFlow.toLocaleString()}`;
        document.getElementById('cash-flow-status').textContent = cashFlow >= 0 ? 'Positive' : 'Negative';
        
        // Breeding alerts
        const breedingAlerts = this.breedingRecords.filter(record => {
            if (record.expectedDueDate) {
                const dueDate = new Date(record.expectedDueDate);
                const today = new Date();
                const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                return daysUntilDue >= 0 && daysUntilDue <= 7; // Due within 7 days
            }
            return false;
        }).length;
        
        document.getElementById('breeding-alerts').textContent = breedingAlerts;
        
        // Active alerts calculation
        const activeAlerts = healthAlerts + pendingTasks + remindersDue + breedingAlerts;
        document.getElementById('active-alerts').textContent = activeAlerts;
        document.getElementById('alert-details').textContent = activeAlerts === 0 ? 'All systems normal' : `${activeAlerts} items need attention`;
        
        // Update feed status
        const feedStatus = this.calculateFeedStatus();
        document.getElementById('feed-status').textContent = feedStatus;
        
        // Update charts
        this.updateCharts();
        
        // Update recent activity
        this.updateRecentActivity();
        
        // Update urgent alerts
        this.updateUrgentAlerts();
    }

    calculateFeedStatus() {
        // Simple feed status calculation - can be enhanced
        const feedRecords = this.feedRecords.filter(record => {
            const recordDate = new Date(record.date);
            const today = new Date();
            const daysDiff = Math.ceil((today - recordDate) / (1000 * 60 * 60 * 24));
            return daysDiff <= 7; // Recent feeding records
        });
        
        if (feedRecords.length === 0) return 'No Data';
        return feedRecords.length > 5 ? 'Good' : 'Low';
    }

    updateCharts() {
        // Update herd distribution chart
        this.updateHerdChart();
        
        // Update revenue chart
        this.updateRevenueChart();
        
        // Update feed chart
        this.updateFeedChart();
        
        // Update task completion chart
        this.updateTaskChart();
    }

    updateHerdChart() {
        const canvas = document.getElementById('herd-chart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simple pie chart for herd distribution
        const bucks = this.goats.filter(goat => goat.gender === 'buck').length;
        const does = this.goats.filter(goat => goat.gender === 'doe').length;
        const kids = this.goats.filter(goat => goat.gender === 'kid').length;
        
        const total = bucks + does + kids;
        if (total === 0) {
            ctx.fillStyle = '#7f8c8d';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;
        
        let currentAngle = 0;
        const colors = ['#3498db', '#e74c3c', '#f39c12'];
        const data = [bucks, does, kids];
        const labels = ['Bucks', 'Does', 'Kids'];
        
        data.forEach((value, index) => {
            if (value > 0) {
                const sliceAngle = (value / total) * 2 * Math.PI;
                
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.lineTo(centerX, centerY);
                ctx.fillStyle = colors[index];
                ctx.fill();
                
                currentAngle += sliceAngle;
            }
        });
        
        // Add legend
        let legendY = 20;
        labels.forEach((label, index) => {
            if (data[index] > 0) {
                ctx.fillStyle = colors[index];
                ctx.fillRect(10, legendY, 15, 15);
                ctx.fillStyle = '#2c3e50';
                ctx.font = '12px Arial';
                ctx.textAlign = 'left';
                ctx.fillText(`${label}: ${data[index]}`, 30, legendY + 12);
                legendY += 20;
            }
        });
    }

    updateRevenueChart() {
        const canvas = document.getElementById('revenue-chart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simple bar chart for monthly revenue
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const revenues = months.map(month => Math.random() * 100000); // Sample data
        
        const maxRevenue = Math.max(...revenues);
        const barWidth = canvas.width / months.length - 20;
        const barMaxHeight = canvas.height - 60;
        
        revenues.forEach((revenue, index) => {
            const barHeight = (revenue / maxRevenue) * barMaxHeight;
            const x = index * (barWidth + 20) + 10;
            const y = canvas.height - barHeight - 40;
            
            ctx.fillStyle = '#3498db';
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Add labels
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(months[index], x + barWidth / 2, canvas.height - 20);
            ctx.fillText(`KSh ${Math.round(revenue / 1000)}k`, x + barWidth / 2, y - 5);
        });
    }

    updateFeedChart() {
        const canvas = document.getElementById('feed-chart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simple inventory status chart
        const feedTypes = ['Hay', 'Pellets', 'Grain', 'Supplements'];
        const stockLevels = [75, 45, 60, 30]; // Sample data
        
        const barWidth = canvas.width / feedTypes.length - 20;
        const barMaxHeight = canvas.height - 60;
        
        stockLevels.forEach((level, index) => {
            const barHeight = (level / 100) * barMaxHeight;
            const x = index * (barWidth + 20) + 10;
            const y = canvas.height - barHeight - 40;
            
            // Color based on stock level
            let color = '#27ae60'; // Green for good stock
            if (level < 50) color = '#f39c12'; // Orange for medium stock
            if (level < 25) color = '#e74c3c'; // Red for low stock
            
            ctx.fillStyle = color;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Add labels
            ctx.fillStyle = '#2c3e50';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(feedTypes[index], x + barWidth / 2, canvas.height - 20);
            ctx.fillText(`${level}%`, x + barWidth / 2, y - 5);
        });
    }

    updateTaskChart() {
        const canvas = document.getElementById('task-chart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Task completion donut chart
        const completed = this.tasks.filter(task => task.status === 'completed').length;
        const pending = this.tasks.filter(task => task.status === 'pending').length;
        const inProgress = this.tasks.filter(task => task.status === 'in-progress').length;
        
        const total = completed + pending + inProgress;
        if (total === 0) {
            ctx.fillStyle = '#7f8c8d';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No tasks available', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;
        const innerRadius = 40;
        
        let currentAngle = 0;
        const colors = ['#27ae60', '#e74c3c', '#f39c12'];
        const data = [completed, pending, inProgress];
        const labels = ['Completed', 'Pending', 'In Progress'];
        
        data.forEach((value, index) => {
            if (value > 0) {
                const sliceAngle = (value / total) * 2 * Math.PI;
                
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
                ctx.fillStyle = colors[index];
                ctx.fill();
                
                currentAngle += sliceAngle;
            }
        });
        
        // Add center text
        ctx.fillStyle = '#2c3e50';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${total} Tasks`, centerX, centerY);
    }

    updateRecentActivity() {
        const activityList = document.getElementById('recent-activity-list');
        activityList.innerHTML = '';
        
        // Combine recent activities from different sources
        const recentActivities = [];
        
        // Recent goat additions
        this.goats.slice(-3).forEach(goat => {
            recentActivities.push({
                type: 'goat-added',
                message: `New goat added: ${goat.name} (${goat.tag})`,
                time: new Date().toLocaleString()
            });
        });
        
        // Recent sales
        this.sales.slice(-3).forEach(sale => {
            recentActivities.push({
                type: 'sale',
                message: `Sale recorded: ${sale.itemName} - KSh ${sale.total}`,
                time: new Date(sale.date).toLocaleString()
            });
        });
        
        // Recent tasks completed
        this.tasks.filter(task => task.status === 'completed').slice(-3).forEach(task => {
            recentActivities.push({
                type: 'task-completed',
                message: `Task completed: ${task.title}`,
                time: new Date().toLocaleString()
            });
        });
        
        if (recentActivities.length === 0) {
            activityList.innerHTML = '<div class="activity-item">No recent activity</div>';
            return;
        }
        
        recentActivities.slice(0, 5).forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <strong>${activity.message}</strong><br>
                <small>${activity.time}</small>
            `;
            activityList.appendChild(activityItem);
        });
    }

    updateUrgentAlerts() {
        const alertList = document.getElementById('alert-list');
        alertList.innerHTML = '';
        
        const urgentAlerts = [];
        
        // Health alerts
        this.goats.forEach(goat => {
            if (goat.healthStatus === 'treatment' || goat.healthStatus === 'monitoring') {
                urgentAlerts.push({
                    type: 'health',
                    message: `${goat.name} needs health attention`,
                    priority: 'high'
                });
            }
        });
        
        // Overdue tasks
        this.tasks.forEach(task => {
            if (task.status === 'pending' && new Date(task.dueDate) < new Date()) {
                urgentAlerts.push({
                    type: 'task-overdue',
                    message: `Overdue task: ${task.title}`,
                    priority: 'high'
                });
            }
        });
        
        // Breeding alerts
        this.breedingRecords.forEach(record => {
            if (record.expectedDueDate) {
                const dueDate = new Date(record.expectedDueDate);
                const today = new Date();
                const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                if (daysUntilDue >= 0 && daysUntilDue <= 3) {
                    urgentAlerts.push({
                        type: 'breeding',
                        message: `${record.doeName} due to kid in ${daysUntilDue} days`,
                        priority: 'medium'
                    });
                }
            }
        });
        
        if (urgentAlerts.length === 0) {
            alertList.innerHTML = '<div class="alert-item">No urgent alerts</div>';
            return;
        }
        
        urgentAlerts.slice(0, 5).forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = 'alert-item';
            alertItem.innerHTML = `
                <strong>${alert.message}</strong><br>
                <small>Priority: ${alert.priority}</small>
            `;
            alertList.appendChild(alertItem);
        });
    }

    // Goat Management
    loadGoats() {
        try {
            const tbody = document.getElementById('goats-tbody');
            if (!tbody) return; // Skip if not on goats page
            
            tbody.innerHTML = '';
            
            if (!this.goats || this.goats.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No goats registered yet</td></tr>';
                return;
            }
            
            this.goats.forEach((goat, index) => {
                try {
                    const row = document.createElement('tr');
                    
                    // Handle both legacy and new field formats with error checking
                    const displayData = {
                        id: goat.id || goat.tag || `goat-${index}`,
                        name: goat.name || 'N/A',
                        breed: goat.breed || 'N/A',
                        age: goat.age || (goat.dob ? this.calculateAge(goat.dob) : 'N/A'),
                        color: goat.color || 'N/A',
                        gender: goat.gender || 'N/A',
                        milkProduction: goat.milkProduction || 'N/A',
                        healthStatus: goat.healthStatus || goat.status || 'Unknown',
                        location: goat.location || 'N/A'
                    };
                    
                    row.innerHTML = `
                        <td><input type="checkbox" class="goat-checkbox" data-goat-id="${displayData.id}"></td>
                        <td>${this.sanitizeOutput(displayData.id)}</td>
                        <td>${this.sanitizeOutput(displayData.name)}</td>
                        <td>${this.sanitizeOutput(displayData.breed)}</td>
                        <td>${this.sanitizeOutput(displayData.age)}</td>
                        <td>${this.sanitizeOutput(displayData.color)}</td>
                        <td>${this.sanitizeOutput(displayData.milkProduction)}</td>
                        <td class="status-${displayData.healthStatus.toLowerCase().replace(' ', '-')}">${this.sanitizeOutput(displayData.healthStatus)}</td>
                        <td>
                            <button class="action-btn edit" onclick="farmRecords.editGoat('${displayData.id}')">Edit</button>
                            <button class="action-btn delete" onclick="farmRecords.deleteGoat('${displayData.id}')">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                } catch (goatError) {
                    console.error(`Error loading goat ${index}:`, goatError);
                    this.logAudit('goat_load_error', `Failed to load goat ${index}: ${goatError.message}`);
                }
            });
            
            // Update selection state if goats were previously selected
            this.updateSelectionCounter();
            this.updateMasterCheckbox();
        } catch (error) {
            console.error('Error loading goats:', error);
            this.logAudit('goats_load_error', `Failed to load goats: ${error.message}`);
            const tbody = document.getElementById('goats-tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="9" class="error-state">Error loading goats. Please refresh and try again.</td></tr>';
            }
        }
    }

    // Input/Output sanitization for security
    sanitizeOutput(value) {
        if (value === null || value === undefined) return 'N/A';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    // Enhanced input sanitization with comprehensive validation
    sanitizeInput(value) {
        if (!value) return '';
        
        let sanitized = String(value).trim();
        
        // Remove dangerous script tags and event handlers
        sanitized = sanitized
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
            .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/vbscript:/gi, '')
            .replace(/data:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/style\s*=/gi, '')
            .replace(/expression\s*\(/gi, '');

        // Remove SQL injection patterns
        sanitized = sanitized
            .replace(/('|(\\')|(;\s*(drop|alter|create|delete|insert|update)\s))/gi, '')
            .replace(/(union\s+(all\s+)?select)/gi, '')
            .replace(/(\|\||&&|;|\|)/g, '');

        // Limit length to prevent buffer overflow
        if (sanitized.length > 1000) {
            sanitized = sanitized.substring(0, 1000);
        }

        return sanitized;
    }

    // Validate specific input types
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone(phone) {
        // Kenyan phone number format
        const phoneRegex = /^(\+254|0)[17]\d{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    validateNumber(value, min = null, max = null) {
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        if (min !== null && num < min) return false;
        if (max !== null && num > max) return false;
        return true;
    }

    validateDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }

    // Comprehensive form validation
    validateFormData(formData, rules = {}) {
        const errors = [];
        
        Object.keys(rules).forEach(field => {
            const rule = rules[field];
            const value = formData[field];
            
            // Required field check
            if (rule.required && (!value || value.trim() === '')) {
                errors.push(`${field} is required`);
                return;
            }
            
            if (value) {
                // Type validation
                switch (rule.type) {
                    case 'email':
                        if (!this.validateEmail(value)) {
                            errors.push(`${field} must be a valid email`);
                        }
                        break;
                    case 'phone':
                        if (!this.validatePhone(value)) {
                            errors.push(`${field} must be a valid phone number`);
                        }
                        break;
                    case 'number':
                        if (!this.validateNumber(value, rule.min, rule.max)) {
                            errors.push(`${field} must be a valid number${rule.min ? ` (min: ${rule.min})` : ''}${rule.max ? ` (max: ${rule.max})` : ''}`);
                        }
                        break;
                    case 'date':
                        if (!this.validateDate(value)) {
                            errors.push(`${field} must be a valid date`);
                        }
                        break;
                }
                
                // Length validation
                if (rule.minLength && value.length < rule.minLength) {
                    errors.push(`${field} must be at least ${rule.minLength} characters`);
                }
                if (rule.maxLength && value.length > rule.maxLength) {
                    errors.push(`${field} must be no more than ${rule.maxLength} characters`);
                }
            }
        });
        
        return errors;
    }

    showGoatModal(goat = null) {
        // Check permissions before showing modal
        const action = goat ? 'edit_animals' : 'add_animals';
        if (!this.enforcePermission(action)) {
            return;
        }

        const modal = document.getElementById('goat-modal');
        const form = document.getElementById('goat-form');
        
        if (goat) {
            document.getElementById('goat-modal-title').textContent = 'Edit Goat';
            document.getElementById('goat-id').value = goat.id;
            
            // Map goat data to the actual form fields that exist
            if (document.getElementById('goat-tag')) document.getElementById('goat-tag').value = goat.tag || goat.id || '';
            if (document.getElementById('goat-name')) document.getElementById('goat-name').value = goat.name || '';
            if (document.getElementById('goat-gender')) document.getElementById('goat-gender').value = goat.gender || '';
            if (document.getElementById('goat-dob')) document.getElementById('goat-dob').value = goat.dob || '';
            if (document.getElementById('goat-color')) document.getElementById('goat-color').value = goat.color || '';
            if (document.getElementById('goat-milk-production')) document.getElementById('goat-milk-production').value = goat.milkProduction || '';
            if (document.getElementById('goat-health-status')) document.getElementById('goat-health-status').value = goat.healthStatus || '';
            if (document.getElementById('goat-notes')) document.getElementById('goat-notes').value = goat.notes || '';
        } else {
            document.getElementById('goat-modal-title').textContent = 'Add New Goat';
            form.reset();
        }
        
        modal.style.display = 'flex';
    }

    hideGoatModal() {
        document.getElementById('goat-modal').style.display = 'none';
    }

    saveGoat() {
        const form = document.getElementById('goat-form');
        const isEdit = document.getElementById('goat-id').value !== '';
        
        // Check permissions before saving
        const action = isEdit ? 'edit_animals' : 'add_animals';
        if (!this.enforcePermission(action)) {
            return;
        }
        
        try {
            // Helper function to safely get form values
            const getValue = (id) => {
            const element = document.getElementById(id);
            return element ? element.value : '';
        };
        
        const goat = {
            id: getValue('goat-id') || Date.now().toString(),
            // New form fields (preferred)
            tag: getValue('goat-tag'),
            name: getValue('goat-name'),
            gender: getValue('goat-gender'),
            dob: getValue('goat-dob'),
            breed: getValue('goat-breed'),
            location: getValue('goat-location'),
            status: getValue('goat-status') || 'alive',
            
            // Legacy fields for backward compatibility
            age: parseInt(getValue('goat-age')) || '',
            color: getValue('goat-color'),
            milkProduction: getValue('goat-milk-production'),
            healthStatus: getValue('goat-health-status'),
            notes: getValue('goat-notes'),
            
            dateAdded: new Date().toISOString()
        };
        
        // Calculate age from DOB if available
        if (goat.dob && !goat.age) {
            const today = new Date();
            const birthDate = new Date(goat.dob);
            const ageInMonths = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 30.44));
            goat.age = ageInMonths;
        }
        
        if (getValue('goat-id')) {
            // Update existing goat
            const index = this.goats.findIndex(g => g.id == goat.id);
            if (index !== -1) {
                this.goats[index] = { ...this.goats[index], ...goat };
            }
        } else {
            // Add new goat
            this.goats.push(goat);
        }
        
        localStorage.setItem('farmGoats', JSON.stringify(this.goats));
        this.logAudit('goat_saved', `Goat ${isEdit ? 'updated' : 'added'}: ${goat.name} (${goat.tag})`);
        this.loadGoats();
        this.updateDashboard();
        this.populateGoatDropdowns();
        this.hideGoatModal();
        } catch (error) {
            this.logAudit('goat_save_error', `Failed to save goat: ${error.message}`);
            alert('Failed to save goat. Please check your input and try again.');
            console.error('Save goat error:', error);
        }
    }

    editGoat(id) {
        if (!this.enforcePermission('edit_animals')) {
            return;
        }
        
        try {
            const goat = this.goats.find(g => g.id == id);
            if (goat) {
                this.showGoatModal(goat);
            } else {
                alert('Goat not found');
            }
        } catch (error) {
            this.logAudit('goat_edit_error', `Failed to edit goat: ${error.message}`);
            console.error('Edit goat error:', error);
        }
    }

    deleteGoat(id) {
        if (!this.enforcePermission('delete_animals')) {
            return;
        }
        
        try {
            const goat = this.goats.find(g => g.id == id);
            if (!goat) {
                alert('Goat not found');
                return;
            }
            
            if (confirm(`Are you sure you want to delete goat "${goat.name}" (${goat.tag})? This action cannot be undone.`)) {
                this.goats = this.goats.filter(g => g.id != id);
                localStorage.setItem('farmGoats', JSON.stringify(this.goats));
                this.logAudit('goat_deleted', `Goat deleted: ${goat.name} (${goat.tag})`);
                this.loadGoats();
                this.updateDashboard();
                this.populateGoatDropdowns();
            }
        } catch (error) {
            this.logAudit('goat_delete_error', `Failed to delete goat: ${error.message}`);
            alert('Failed to delete goat. Please try again.');
            console.error('Delete goat error:', error);
        }
    }

    // Milk Records
    loadMilkRecords() {
        const tbody = document.getElementById('milk-tbody');
        tbody.innerHTML = '';
        
        if (this.milkRecords.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No milk records yet</td></tr>';
            return;
        }
        
        this.milkRecords.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.goatName}</td>
                <td>${record.morning}</td>
                <td>${record.evening}</td>
                <td>${record.total}</td>
                <td>${record.notes || ''}</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.editMilkRecord(${record.id})">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteMilkRecord(${record.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    showMilkModal(record = null) {
        const modal = document.getElementById('milk-modal');
        const form = document.getElementById('milk-form');
        
        if (record) {
            document.getElementById('milk-modal-title').textContent = 'Edit Milk Record';
            document.getElementById('milk-id').value = record.id;
            document.getElementById('milk-date').value = record.date;
            document.getElementById('milk-goat-name').value = record.goatName;
            document.getElementById('milk-morning').value = record.morning;
            document.getElementById('milk-evening').value = record.evening;
            document.getElementById('milk-notes').value = record.notes || '';
        } else {
            document.getElementById('milk-modal-title').textContent = 'Add Milk Record';
            form.reset();
            document.getElementById('milk-date').value = new Date().toISOString().split('T')[0];
        }
        
        modal.style.display = 'flex';
    }

    hideMilkModal() {
        document.getElementById('milk-modal').style.display = 'none';
    }

    saveMilkRecord() {
        const morning = parseFloat(document.getElementById('milk-morning').value);
        const evening = parseFloat(document.getElementById('milk-evening').value);
        
        const record = {
            id: document.getElementById('milk-id').value || Date.now(),
            date: document.getElementById('milk-date').value,
            goatName: document.getElementById('milk-goat-name').value,
            morning: morning,
            evening: evening,
            total: morning + evening,
            notes: document.getElementById('milk-notes').value,
            dateAdded: new Date().toISOString()
        };
        
        if (document.getElementById('milk-id').value) {
            const index = this.milkRecords.findIndex(r => r.id == record.id);
            this.milkRecords[index] = record;
        } else {
            this.milkRecords.push(record);
        }
        
        localStorage.setItem('milkRecords', JSON.stringify(this.milkRecords));
        this.loadMilkRecords();
        this.updateDashboard();
        this.hideMilkModal();
    }

    editMilkRecord(id) {
        const record = this.milkRecords.find(r => r.id == id);
        if (record) {
            this.showMilkModal(record);
        }
    }

    deleteMilkRecord(id) {
        if (confirm('Are you sure you want to delete this milk record?')) {
            this.milkRecords = this.milkRecords.filter(r => r.id != id);
            localStorage.setItem('milkRecords', JSON.stringify(this.milkRecords));
            this.loadMilkRecords();
            this.updateDashboard();
        }
    }

    // Feed Records
    loadFeedRecords() {
        const tbody = document.getElementById('feed-tbody');
        tbody.innerHTML = '';
        
        if (this.feedRecords.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No feed records yet</td></tr>';
            return;
        }
        
        this.feedRecords.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.time}</td>
                <td>${record.feedType}</td>
                <td>${record.quantity}</td>
                <td>${record.goatsFed}</td>
                <td>${record.notes || ''}</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.editFeedRecord(${record.id})">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteFeedRecord(${record.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    showFeedModal(record = null) {
        const modal = document.getElementById('feed-modal');
        const form = document.getElementById('feed-form');
        
        if (record) {
            document.getElementById('feed-modal-title').textContent = 'Edit Feed Record';
            document.getElementById('feed-id').value = record.id;
            document.getElementById('feed-date').value = record.date;
            document.getElementById('feed-time').value = record.time;
            document.getElementById('feed-type').value = record.feedType;
            document.getElementById('feed-quantity').value = record.quantity;
            document.getElementById('feed-goats').value = record.goatsFed;
            document.getElementById('feed-notes').value = record.notes || '';
        } else {
            document.getElementById('feed-modal-title').textContent = 'Add Feed Record';
            form.reset();
            document.getElementById('feed-date').value = new Date().toISOString().split('T')[0];
        }
        
        modal.style.display = 'flex';
    }

    hideFeedModal() {
        document.getElementById('feed-modal').style.display = 'none';
    }

    saveFeedRecord() {
        const record = {
            id: document.getElementById('feed-id').value || Date.now(),
            date: document.getElementById('feed-date').value,
            time: document.getElementById('feed-time').value,
            feedType: document.getElementById('feed-type').value,
            quantity: document.getElementById('feed-quantity').value,
            goatsFed: document.getElementById('feed-goats').value,
            notes: document.getElementById('feed-notes').value,
            dateAdded: new Date().toISOString()
        };
        
        if (document.getElementById('feed-id').value) {
            const index = this.feedRecords.findIndex(r => r.id == record.id);
            this.feedRecords[index] = record;
        } else {
            this.feedRecords.push(record);
        }
        
        localStorage.setItem('feedRecords', JSON.stringify(this.feedRecords));
        this.loadFeedRecords();
        this.hideFeedModal();
    }

    editFeedRecord(id) {
        const record = this.feedRecords.find(r => r.id == id);
        if (record) {
            this.showFeedModal(record);
        }
    }

    deleteFeedRecord(id) {
        if (confirm('Are you sure you want to delete this feed record?')) {
            this.feedRecords = this.feedRecords.filter(r => r.id != id);
            localStorage.setItem('feedRecords', JSON.stringify(this.feedRecords));
            this.loadFeedRecords();
        }
    }

    // Health Records
    loadHealthRecords() {
        const tbody = document.getElementById('health-tbody');
        tbody.innerHTML = '';
        
        if (this.healthRecords.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No health records yet</td></tr>';
            return;
        }
        
        this.healthRecords.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.goatName}</td>
                <td>${record.type}</td>
                <td>${record.description}</td>
                <td>${record.treatment || ''}</td>
                <td>${record.vet || ''}</td>
                <td class="status-${record.status.toLowerCase()}">${record.status}</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.editHealthRecord(${record.id})">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteHealthRecord(${record.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    showHealthModal(record = null) {
        const modal = document.getElementById('health-modal');
        const form = document.getElementById('health-form');
        
        if (record) {
            document.getElementById('health-modal-title').textContent = 'Edit Health Record';
            document.getElementById('health-id').value = record.id;
            document.getElementById('health-date').value = record.date;
            document.getElementById('health-goat-name').value = record.goatName;
            document.getElementById('health-type').value = record.type;
            document.getElementById('health-description').value = record.description;
            document.getElementById('health-treatment').value = record.treatment || '';
            document.getElementById('health-vet').value = record.vet || '';
            document.getElementById('health-status').value = record.status;
        } else {
            document.getElementById('health-modal-title').textContent = 'Add Health Record';
            form.reset();
            document.getElementById('health-date').value = new Date().toISOString().split('T')[0];
        }
        
        modal.style.display = 'flex';
    }

    hideHealthModal() {
        document.getElementById('health-modal').style.display = 'none';
    }

    saveHealthRecord() {
        const record = {
            id: document.getElementById('health-id').value || Date.now(),
            date: document.getElementById('health-date').value,
            goatName: document.getElementById('health-goat-name').value,
            type: document.getElementById('health-type').value,
            description: document.getElementById('health-description').value,
            treatment: document.getElementById('health-treatment').value,
            vet: document.getElementById('health-vet').value,
            status: document.getElementById('health-status').value,
            dateAdded: new Date().toISOString()
        };
        
        if (document.getElementById('health-id').value) {
            const index = this.healthRecords.findIndex(r => r.id == record.id);
            this.healthRecords[index] = record;
        } else {
            this.healthRecords.push(record);
        }
        
        localStorage.setItem('healthRecords', JSON.stringify(this.healthRecords));
        this.loadHealthRecords();
        this.updateDashboard();
        this.hideHealthModal();
    }

    editHealthRecord(id) {
        const record = this.healthRecords.find(r => r.id == id);
        if (record) {
            this.showHealthModal(record);
        }
    }

    deleteHealthRecord(id) {
        if (confirm('Are you sure you want to delete this health record?')) {
            this.healthRecords = this.healthRecords.filter(r => r.id != id);
            localStorage.setItem('healthRecords', JSON.stringify(this.healthRecords));
            this.loadHealthRecords();
            this.updateDashboard();
        }
    }

    // Product Management
    loadProducts() {
        const tbody = document.getElementById('products-tbody');
        tbody.innerHTML = '';
        
        if (this.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No products added yet</td></tr>';
            return;
        }
        
        this.products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.featured ? '★ Yes' : 'No'}</td>
                <td class="status-${product.available ? 'healthy' : 'treatment'}">${product.available ? 'Available' : 'Unavailable'}</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.editProduct(${product.id})">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteProduct(${product.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    showProductModal(product = null) {
        const modal = document.getElementById('product-modal-farm');
        const form = document.getElementById('product-form-farm');
        
        if (product) {
            document.getElementById('product-modal-title-farm').textContent = 'Edit Product';
            document.getElementById('product-id-farm').value = product.id;
            document.getElementById('product-name-farm').value = product.name;
            document.getElementById('product-category-farm').value = product.category;
            document.getElementById('product-price-farm').value = product.price;
            document.getElementById('product-description-farm').value = product.description;
            document.getElementById('product-image-farm').value = product.image;
            document.getElementById('product-stock-farm').value = product.stock;
            document.getElementById('product-featured-farm').checked = product.featured;
            document.getElementById('product-available-farm').checked = product.available;
        } else {
            document.getElementById('product-modal-title-farm').textContent = 'Add New Product';
            form.reset();
            document.getElementById('product-available-farm').checked = true;
        }
        
        modal.style.display = 'flex';
    }

    hideProductModal() {
        document.getElementById('product-modal-farm').style.display = 'none';
    }

    saveProduct() {
        const productId = document.getElementById('product-id-farm').value;
        const product = {
            id: productId || Date.now(),
            name: document.getElementById('product-name-farm').value,
            category: document.getElementById('product-category-farm').value,
            price: document.getElementById('product-price-farm').value,
            description: document.getElementById('product-description-farm').value,
            image: document.getElementById('product-image-farm').value || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(document.getElementById('product-name-farm').value),
            stock: document.getElementById('product-stock-farm').value,
            featured: document.getElementById('product-featured-farm').checked,
            available: document.getElementById('product-available-farm').checked,
            dateAdded: new Date().toISOString()
        };
        
        if (productId) {
            // Update existing product
            const index = this.products.findIndex(p => p.id == productId);
            this.products[index] = product;
        } else {
            // Add new product
            this.products.push(product);
        }
        
        localStorage.setItem('farmProducts', JSON.stringify(this.products));
        this.loadProducts();
        this.hideProductModal();
    }

    editProduct(id) {
        const product = this.products.find(p => p.id == id);
        if (product) {
            this.showProductModal(product);
        }
    }

    deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id != id);
            localStorage.setItem('farmProducts', JSON.stringify(this.products));
            this.loadProducts();
        }
    }

    // Breeding Records Management
    loadBreedingRecords() {
        const tbody = document.getElementById('breeding-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.breedingRecords.map(record => `
            <tr>
                <td>${record.id}</td>
                <td>${record.buckName}</td>
                <td>${record.doeName}</td>
                <td>${record.breedingDate}</td>
                <td>${record.expectedDueDate}</td>
                <td><span class="status-${record.status.toLowerCase()}">${record.status}</span></td>
                <td>${record.kidsBorn || 'N/A'}</td>
                <td>${record.birthDate || 'N/A'}</td>
                <td>${record.notes || ''}</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.editBreedingRecord('${record.id}')">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteBreedingRecord('${record.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    addBreedingRecord(recordData) {
        const newRecord = {
            id: 'BR' + Date.now(),
            buckName: recordData.buckName,
            doeName: recordData.doeName,
            breedingDate: recordData.breedingDate,
            expectedDueDate: this.calculateDueDate(recordData.breedingDate),
            status: recordData.status || 'Bred',
            kidsBorn: recordData.kidsBorn || null,
            birthDate: recordData.birthDate || null,
            notes: recordData.notes || '',
            createdAt: new Date().toISOString()
        };

        this.breedingRecords.push(newRecord);
        localStorage.setItem('breedingRecords', JSON.stringify(this.breedingRecords));
        this.loadBreedingRecords();
        this.updateDashboard();
    }

    calculateDueDate(breedingDate) {
        const date = new Date(breedingDate);
        date.setDate(date.getDate() + 150); // Gestation period is about 150 days
        return date.toISOString().split('T')[0];
    }

    editBreedingRecord(id) {
        const record = this.breedingRecords.find(r => r.id === id);
        if (record) {
            this.showBreedingModal(record);
        }
    }

    deleteBreedingRecord(id) {
        if (confirm('Are you sure you want to delete this breeding record?')) {
            this.breedingRecords = this.breedingRecords.filter(r => r.id !== id);
            localStorage.setItem('breedingRecords', JSON.stringify(this.breedingRecords));
            this.loadBreedingRecords();
            this.updateDashboard();
        }
    }

    showBreedingModal(record = null) {
        // Create and show breeding modal (implementation needed)
        const modalHtml = `
            <div id="breeding-modal" class="modal" style="display: flex;">
                <div class="modal-content">
                    <h2>${record ? 'Edit' : 'Add'} Breeding Record</h2>
                    <form id="breeding-form">
                        <input type="hidden" id="breeding-record-id" value="${record ? record.id : ''}">
                        
                        <label>Buck (Male Goat):<br>
                            <select id="breeding-buck" required>
                                ${this.getMaleGoats().map(goat => 
                                    `<option value="${goat.name}" ${record && record.buckName === goat.name ? 'selected' : ''}>${goat.name}</option>`
                                ).join('')}
                            </select>
                        </label><br><br>
                        
                        <label>Doe (Female Goat):<br>
                            <select id="breeding-doe" required>
                                ${this.getFemaleGoats().map(goat => 
                                    `<option value="${goat.name}" ${record && record.doeName === goat.name ? 'selected' : ''}>${goat.name}</option>`
                                ).join('')}
                            </select>
                        </label><br><br>
                        
                        <label>Breeding Date:<br>
                            <input type="date" id="breeding-date" value="${record ? record.breedingDate : ''}" required>
                        </label><br><br>
                        
                        <label>Status:<br>
                            <select id="breeding-status">
                                <option value="Bred" ${record && record.status === 'Bred' ? 'selected' : ''}>Bred</option>
                                <option value="Pregnant" ${record && record.status === 'Pregnant' ? 'selected' : ''}>Pregnant</option>
                                <option value="Delivered" ${record && record.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="Failed" ${record && record.status === 'Failed' ? 'selected' : ''}>Failed</option>
                            </select>
                        </label><br><br>
                        
                        <label>Kids Born:<br>
                            <input type="number" id="breeding-kids" value="${record ? record.kidsBorn || '' : ''}" min="0" max="5">
                        </label><br><br>
                        
                        <label>Birth Date:<br>
                            <input type="date" id="breeding-birth-date" value="${record ? record.birthDate || '' : ''}">
                        </label><br><br>
                        
                        <label>Notes:<br>
                            <textarea id="breeding-notes">${record ? record.notes || '' : ''}</textarea>
                        </label><br><br>
                        
                        <div class="modal-buttons">
                            <button type="submit">Save Record</button>
                            <button type="button" onclick="farmRecords.closeBreedingModal()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('breeding-form').addEventListener('submit', (e) => this.handleBreedingSubmit(e));
    }

    getMaleGoats() {
        return this.goats.filter(goat => goat.gender === 'Male' || goat.gender === 'Buck');
    }

    getFemaleGoats() {
        return this.goats.filter(goat => goat.gender === 'Female' || goat.gender === 'Doe');
    }

    handleBreedingSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const recordData = {
            buckName: document.getElementById('breeding-buck').value,
            doeName: document.getElementById('breeding-doe').value,
            breedingDate: document.getElementById('breeding-date').value,
            status: document.getElementById('breeding-status').value,
            kidsBorn: document.getElementById('breeding-kids').value || null,
            birthDate: document.getElementById('breeding-birth-date').value || null,
            notes: document.getElementById('breeding-notes').value
        };

        const recordId = document.getElementById('breeding-record-id').value;
        if (recordId) {
            // Update existing record
            const index = this.breedingRecords.findIndex(r => r.id === recordId);
            if (index !== -1) {
                this.breedingRecords[index] = { ...this.breedingRecords[index], ...recordData };
                localStorage.setItem('breedingRecords', JSON.stringify(this.breedingRecords));
                this.loadBreedingRecords();
            }
        } else {
            this.addBreedingRecord(recordData);
        }
        
        this.closeBreedingModal();
    }

    closeBreedingModal() {
        const modal = document.getElementById('breeding-modal');
        if (modal) {
            modal.remove();
        }
    }

    // Meat Production Records Management
    loadMeatRecords() {
        const tbody = document.getElementById('meat-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.meatRecords.map(record => `
            <tr>
                <td>${record.date}</td>
                <td>${record.goatId}</td>
                <td>${record.liveWeight}</td>
                <td>${record.carcassWeight}</td>
                <td>${record.meatGrade}</td>
                <td>${record.customer}</td>
                <td>KSh ${record.price.toLocaleString()}</td>
                <td>${record.notes || ''}</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.editMeatRecord('${record.id}')">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteMeatRecord('${record.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    addMeatRecord(recordData) {
        const newRecord = {
            id: 'MR' + Date.now(),
            date: recordData.date,
            goatId: recordData.goatId,
            liveWeight: parseFloat(recordData.liveWeight),
            carcassWeight: parseFloat(recordData.carcassWeight),
            meatGrade: recordData.meatGrade,
            customer: recordData.customer,
            price: parseFloat(recordData.price),
            notes: recordData.notes || '',
            createdAt: new Date().toISOString()
        };

        this.meatRecords.push(newRecord);
        localStorage.setItem('meatRecords', JSON.stringify(this.meatRecords));
        this.loadMeatRecords();
        this.updateDashboard();
    }

    editMeatRecord(id) {
        const record = this.meatRecords.find(r => r.id === id);
        if (record) {
            this.showMeatModal(record);
        }
    }

    deleteMeatRecord(id) {
        if (confirm('Are you sure you want to delete this meat production record?')) {
            this.meatRecords = this.meatRecords.filter(r => r.id !== id);
            localStorage.setItem('meatRecords', JSON.stringify(this.meatRecords));
            this.loadMeatRecords();
            this.updateDashboard();
        }
    }

    showMeatModal(record = null) {
        const modalHtml = `
            <div id="meat-modal" class="modal" style="display: flex;">
                <div class="modal-content">
                    <h2>${record ? 'Edit' : 'Add'} Meat Production Record</h2>
                    <form id="meat-form">
                        <input type="hidden" id="meat-record-id" value="${record ? record.id : ''}">
                        
                        <label>Date:<br>
                            <input type="date" id="meat-date" value="${record ? record.date : ''}" required>
                        </label><br><br>
                        
                        <label>Goat ID:<br>
                            <select id="meat-goat-id" required>
                                ${this.goats.map(goat => 
                                    `<option value="${goat.id}" ${record && record.goatId === goat.id ? 'selected' : ''}>${goat.id} - ${goat.name}</option>`
                                ).join('')}
                            </select>
                        </label><br><br>
                        
                        <label>Live Weight (kg):<br>
                            <input type="number" id="meat-live-weight" value="${record ? record.liveWeight : ''}" step="0.1" required>
                        </label><br><br>
                        
                        <label>Carcass Weight (kg):<br>
                            <input type="number" id="meat-carcass-weight" value="${record ? record.carcassWeight : ''}" step="0.1" required>
                        </label><br><br>
                        
                        <label>Meat Grade:<br>
                            <select id="meat-grade" required>
                                <option value="Premium" ${record && record.meatGrade === 'Premium' ? 'selected' : ''}>Premium</option>
                                <option value="Grade A" ${record && record.meatGrade === 'Grade A' ? 'selected' : ''}>Grade A</option>
                                <option value="Grade B" ${record && record.meatGrade === 'Grade B' ? 'selected' : ''}>Grade B</option>
                                <option value="Commercial" ${record && record.meatGrade === 'Commercial' ? 'selected' : ''}>Commercial</option>
                            </select>
                        </label><br><br>
                        
                        <label>Customer:<br>
                            <input type="text" id="meat-customer" value="${record ? record.customer : ''}" required>
                        </label><br><br>
                        
                        <label>Price (KSh):<br>
                            <input type="number" id="meat-price" value="${record ? record.price : ''}" step="0.01" required>
                        </label><br><br>
                        
                        <label>Notes:<br>
                            <textarea id="meat-notes">${record ? record.notes || '' : ''}</textarea>
                        </label><br><br>
                        
                        <div class="modal-buttons">
                            <button type="submit">Save Record</button>
                            <button type="button" onclick="farmRecords.closeMeatModal()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('meat-form').addEventListener('submit', (e) => this.handleMeatSubmit(e));
    }

    handleMeatSubmit(e) {
        e.preventDefault();
        const recordData = {
            date: document.getElementById('meat-date').value,
            goatId: document.getElementById('meat-goat-id').value,
            liveWeight: document.getElementById('meat-live-weight').value,
            carcassWeight: document.getElementById('meat-carcass-weight').value,
            meatGrade: document.getElementById('meat-grade').value,
            customer: document.getElementById('meat-customer').value,
            price: document.getElementById('meat-price').value,
            notes: document.getElementById('meat-notes').value
        };

        const recordId = document.getElementById('meat-record-id').value;
        if (recordId) {
            // Update existing record
            const index = this.meatRecords.findIndex(r => r.id === recordId);
            if (index !== -1) {
                this.meatRecords[index] = { ...this.meatRecords[index], ...recordData };
                localStorage.setItem('meatRecords', JSON.stringify(this.meatRecords));
                this.loadMeatRecords();
            }
        } else {
            this.addMeatRecord(recordData);
        }
        
        this.closeMeatModal();
    }

    closeMeatModal() {
        const modal = document.getElementById('meat-modal');
        if (modal) {
            modal.remove();
        }
    }

    // Utility functions
    populateGoatDropdowns() {
        const milkGoatSelect = document.getElementById('milk-goat-name');
        const healthGoatSelect = document.getElementById('health-goat-name');
        
        const goatOptions = this.goats.map(goat => 
            `<option value="${goat.name}">${goat.name}</option>`
        ).join('');
        
        milkGoatSelect.innerHTML = '<option value="">Select Goat</option>' + goatOptions;
        healthGoatSelect.innerHTML = '<option value="">Select Goat</option>' + goatOptions;
    }

    // Contact Management
    loadContacts() {
        const tbody = document.getElementById('contacts-tbody');
        tbody.innerHTML = '';
        
        if (this.contacts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No contacts added yet</td></tr>';
            return;
        }
        
        this.contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.name}</td>
                <td class="contact-category">${contact.category}</td>
                <td>${contact.phone}</td>
                <td>${contact.email || 'N/A'}</td>
                <td>${contact.location || 'N/A'}</td>
                <td>${contact.services || 'N/A'}</td>
                <td class="status-${contact.status}">${contact.status}</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.editContact(${contact.id})">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteContact(${contact.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    filterContacts(category) {
        const tbody = document.getElementById('contacts-tbody');
        tbody.innerHTML = '';
        
        const filteredContacts = category ? 
            this.contacts.filter(contact => contact.category === category) : 
            this.contacts;
        
        if (filteredContacts.length === 0) {
            const message = category ? 
                `No ${category} contacts found` : 
                'No contacts added yet';
            tbody.innerHTML = `<tr><td colspan="8" class="empty-state">${message}</td></tr>`;
            return;
        }
        
        filteredContacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.name}</td>
                <td class="contact-category">${contact.category}</td>
                <td>${contact.phone}</td>
                <td>${contact.email || 'N/A'}</td>
                <td>${contact.location || 'N/A'}</td>
                <td>${contact.services || 'N/A'}</td>
                <td class="status-${contact.status}">${contact.status}</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.editContact(${contact.id})">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteContact(${contact.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    showContactModal(contact = null) {
        const modal = document.getElementById('contact-modal');
        const form = document.getElementById('contact-form');
        
        if (contact) {
            document.getElementById('contact-modal-title').textContent = 'Edit Contact';
            document.getElementById('contact-id').value = contact.id;
            document.getElementById('contact-name').value = contact.name;
            document.getElementById('contact-category').value = contact.category;
            document.getElementById('contact-phone').value = contact.phone;
            document.getElementById('contact-email').value = contact.email || '';
            document.getElementById('contact-location').value = contact.location || '';
            document.getElementById('contact-services').value = contact.services || '';
            document.getElementById('contact-status').value = contact.status;
            document.getElementById('contact-notes').value = contact.notes || '';
        } else {
            document.getElementById('contact-modal-title').textContent = 'Add New Contact';
            form.reset();
        }
        
        modal.style.display = 'flex';
    }

    hideContactModal() {
        document.getElementById('contact-modal').style.display = 'none';
    }

    saveContact() {
        const contactId = document.getElementById('contact-id').value;
        const contact = {
            id: contactId || Date.now(),
            name: document.getElementById('contact-name').value,
            category: document.getElementById('contact-category').value,
            phone: document.getElementById('contact-phone').value,
            email: document.getElementById('contact-email').value,
            location: document.getElementById('contact-location').value,
            services: document.getElementById('contact-services').value,
            status: document.getElementById('contact-status').value,
            notes: document.getElementById('contact-notes').value,
            dateAdded: new Date().toISOString()
        };
        
        if (contactId) {
            // Update existing contact
            const index = this.contacts.findIndex(c => c.id == contactId);
            this.contacts[index] = contact;
        } else {
            // Add new contact
            this.contacts.push(contact);
        }
        
        localStorage.setItem('farmContacts', JSON.stringify(this.contacts));
        this.loadContacts();
        this.hideContactModal();
    }

    editContact(id) {
        const contact = this.contacts.find(c => c.id == id);
        if (contact) {
            this.showContactModal(contact);
        }
    }

    deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.contacts = this.contacts.filter(c => c.id != id);
            localStorage.setItem('farmContacts', JSON.stringify(this.contacts));
            this.loadContacts();
        }
    }

    // Enhanced Task Management
    showTaskModal(taskId = null) {
        const modal = document.getElementById('task-modal');
        const title = document.getElementById('task-modal-title');
        const form = document.getElementById('task-form');
        
        if (taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                title.textContent = 'Edit Task';
                document.getElementById('task-id').value = task.id;
                document.getElementById('task-title').value = task.title;
                document.getElementById('task-category').value = task.category;
                document.getElementById('task-priority').value = task.priority;
                document.getElementById('task-due-date').value = task.dueDate;
                document.getElementById('task-assigned-to').value = task.assignedTo;
                document.getElementById('task-description').value = task.description;
                document.getElementById('task-status').value = task.status;
            }
        } else {
            title.textContent = 'Add New Task';
            form.reset();
        }
        
        modal.style.display = 'flex';
    }

    saveTask() {
        const taskId = document.getElementById('task-id').value;
        const taskData = {
            id: taskId || Date.now().toString(),
            title: document.getElementById('task-title').value,
            category: document.getElementById('task-category').value,
            priority: document.getElementById('task-priority').value,
            dueDate: document.getElementById('task-due-date').value,
            assignedTo: document.getElementById('task-assigned-to').value,
            description: document.getElementById('task-description').value,
            status: document.getElementById('task-status').value || 'pending',
            createdAt: new Date().toISOString(),
            progress: 0
        };

        if (taskId) {
            const index = this.tasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                this.tasks[index] = { ...this.tasks[index], ...taskData };
            }
        } else {
            this.tasks.push(taskData);
        }

        localStorage.setItem('farmTasks', JSON.stringify(this.tasks));
        this.loadTasks();
        this.hideTaskModal();
        this.updateDashboard();
    }

    loadTasks() {
        const tbody = document.getElementById('tasks-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.tasks.map(task => `
            <tr>
                <td>${task.title}</td>
                <td>${task.category}</td>
                <td><span class="priority-badge ${task.priority}">${task.priority}</span></td>
                <td>${new Date(task.dueDate).toLocaleDateString()}</td>
                <td>${task.assignedTo}</td>
                <td><span class="status-badge ${task.status}">${task.status}</span></td>
                <td>${task.progress}%</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.showTaskModal('${task.id}')">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteTask('${task.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            localStorage.setItem('farmTasks', JSON.stringify(this.tasks));
            this.loadTasks();
            this.updateDashboard();
        }
    }

    hideTaskModal() {
        document.getElementById('task-modal').style.display = 'none';
    }

    filterTasks(status) {
        const filtered = status ? this.tasks.filter(task => task.status === status || task.priority === status) : this.tasks;
        // Update table with filtered results
        this.displayFilteredTasks(filtered);
    }

    displayFilteredTasks(tasks) {
        const tbody = document.getElementById('tasks-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = tasks.map(task => `
            <tr>
                <td>${task.title}</td>
                <td>${task.category}</td>
                <td><span class="priority-badge ${task.priority}">${task.priority}</span></td>
                <td>${new Date(task.dueDate).toLocaleDateString()}</td>
                <td>${task.assignedTo}</td>
                <td><span class="status-badge ${task.status}">${task.status}</span></td>
                <td>${task.progress}%</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.showTaskModal('${task.id}')">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteTask('${task.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Enhanced Reminder Management
    showReminderModal(reminderId = null) {
        const modal = document.getElementById('reminder-modal');
        const title = document.getElementById('reminder-modal-title');
        const form = document.getElementById('reminder-form');
        
        if (reminderId) {
            const reminder = this.reminders.find(r => r.id === reminderId);
            if (reminder) {
                title.textContent = 'Edit Reminder';
                document.getElementById('reminder-id').value = reminder.id;
                document.getElementById('reminder-title').value = reminder.title;
                document.getElementById('reminder-type').value = reminder.type;
                document.getElementById('reminder-datetime').value = reminder.datetime;
                document.getElementById('reminder-subject').value = reminder.subject;
                document.getElementById('reminder-description').value = reminder.description;
                document.getElementById('reminder-status').value = reminder.status;
            }
        } else {
            title.textContent = 'Add New Reminder';
            form.reset();
        }
        
        modal.style.display = 'flex';
    }

    saveReminder() {
        const reminderId = document.getElementById('reminder-id').value;
        const reminderData = {
            id: reminderId || Date.now().toString(),
            title: document.getElementById('reminder-title').value,
            type: document.getElementById('reminder-type').value,
            datetime: document.getElementById('reminder-datetime').value,
            subject: document.getElementById('reminder-subject').value,
            description: document.getElementById('reminder-description').value,
            status: document.getElementById('reminder-status').value || 'active',
            createdAt: new Date().toISOString()
        };

        if (reminderId) {
            const index = this.reminders.findIndex(r => r.id === reminderId);
            if (index !== -1) {
                this.reminders[index] = { ...this.reminders[index], ...reminderData };
            }
        } else {
            this.reminders.push(reminderData);
        }

        localStorage.setItem('farmReminders', JSON.stringify(this.reminders));
        this.loadReminders();
        this.hideReminderModal();
        this.updateDashboard();
    }

    loadReminders() {
        const tbody = document.getElementById('reminders-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.reminders.map(reminder => `
            <tr>
                <td>${reminder.title}</td>
                <td>${reminder.type}</td>
                <td>${new Date(reminder.datetime).toLocaleString()}</td>
                <td>${reminder.subject}</td>
                <td>${reminder.description}</td>
                <td><span class="status-badge ${reminder.status}">${reminder.status}</span></td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.showReminderModal('${reminder.id}')">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteReminder('${reminder.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    deleteReminder(reminderId) {
        if (confirm('Are you sure you want to delete this reminder?')) {
            this.reminders = this.reminders.filter(r => r.id !== reminderId);
            localStorage.setItem('farmReminders', JSON.stringify(this.reminders));
            this.loadReminders();
            this.updateDashboard();
        }
    }

    hideReminderModal() {
        document.getElementById('reminder-modal').style.display = 'none';
    }

    // Enhanced Financial Management
    showTransactionModal(transactionId = null) {
        const modal = document.getElementById('transaction-modal');
        const title = document.getElementById('transaction-modal-title');
        const form = document.getElementById('transaction-form');
        
        if (transactionId) {
            const transaction = this.transactions.find(t => t.id === transactionId);
            if (transaction) {
                title.textContent = 'Edit Transaction';
                document.getElementById('transaction-id').value = transaction.id;
                document.getElementById('transaction-date').value = transaction.date;
                document.getElementById('transaction-type').value = transaction.type;
                document.getElementById('transaction-category').value = transaction.category;
                document.getElementById('transaction-description').value = transaction.description;
                document.getElementById('transaction-amount').value = transaction.amount;
                document.getElementById('transaction-payment-method').value = transaction.paymentMethod;
            }
        } else {
            title.textContent = 'Add New Transaction';
            form.reset();
        }
        
        modal.style.display = 'flex';
    }

    saveTransaction() {
        const transactionId = document.getElementById('transaction-id').value;
        const transactionData = {
            id: transactionId || Date.now().toString(),
            date: document.getElementById('transaction-date').value,
            type: document.getElementById('transaction-type').value,
            category: document.getElementById('transaction-category').value,
            description: document.getElementById('transaction-description').value,
            amount: parseFloat(document.getElementById('transaction-amount').value),
            paymentMethod: document.getElementById('transaction-payment-method').value,
            createdAt: new Date().toISOString()
        };

        if (transactionId) {
            const index = this.transactions.findIndex(t => t.id === transactionId);
            if (index !== -1) {
                this.transactions[index] = { ...this.transactions[index], ...transactionData };
            }
        } else {
            this.transactions.push(transactionData);
        }

        localStorage.setItem('farmTransactions', JSON.stringify(this.transactions));
        this.loadTransactions();
        this.hideTransactionModal();
        this.updateDashboard();
        this.updateFinancialReports();
    }

    loadTransactions() {
        const tbody = document.getElementById('transactions-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.transactions.map(transaction => `
            <tr>
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td><span class="type-badge ${transaction.type}">${transaction.type}</span></td>
                <td>${transaction.category}</td>
                <td>${transaction.description}</td>
                <td>KSh ${transaction.amount.toLocaleString()}</td>
                <td>${transaction.paymentMethod}</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.showTransactionModal('${transaction.id}')">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteTransaction('${transaction.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    deleteTransaction(transactionId) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== transactionId);
            localStorage.setItem('farmTransactions', JSON.stringify(this.transactions));
            this.loadTransactions();
            this.updateDashboard();
            this.updateFinancialReports();
        }
    }

    hideTransactionModal() {
        document.getElementById('transaction-modal').style.display = 'none';
    }

    showFinancialTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        const targetTab = document.getElementById(`${tabName}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // Add active class to selected tab button
        const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
        
        // Update tab content
        if (tabName === 'profit-loss' || tabName === 'balance-sheet') {
            this.updateFinancialReports();
        }
    }

    // Handle modal tab switching
    switchModalTab(modalContent, tabName) {
        // Hide all tab contents in this modal
        modalContent.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
            tab.style.display = 'none';
        });
        
        // Remove active class from all tab buttons in this modal
        modalContent.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content
        const targetTab = modalContent.querySelector(`#${tabName}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
            targetTab.style.display = 'block';
        }
        
        // Add active class to selected tab button
        const targetBtn = modalContent.querySelector(`[data-tab="${tabName}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    }

    updateFinancialReports() {
        // Calculate P&L
        const revenue = this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const netProfit = revenue - expenses;
        const profitMargin = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : 0;
        
        // Update P&L elements
        document.getElementById('total-revenue').textContent = `KSh ${revenue.toLocaleString()}`;
        document.getElementById('total-expenses').textContent = `KSh ${expenses.toLocaleString()}`;
        document.getElementById('net-profit').textContent = `KSh ${netProfit.toLocaleString()}`;
        document.getElementById('profit-margin').textContent = `${profitMargin}%`;
        
        // Calculate category breakdowns
        const goatSales = this.transactions.filter(t => t.category === 'goat-sales').reduce((sum, t) => sum + t.amount, 0);
        const feedExpenses = this.transactions.filter(t => t.category === 'feed').reduce((sum, t) => sum + t.amount, 0);
        const vetExpenses = this.transactions.filter(t => t.category === 'veterinary').reduce((sum, t) => sum + t.amount, 0);
        
        document.getElementById('goat-sales-total').textContent = `KSh ${goatSales.toLocaleString()}`;
        document.getElementById('feed-expenses-total').textContent = `KSh ${feedExpenses.toLocaleString()}`;
        document.getElementById('vet-expenses-total').textContent = `KSh ${vetExpenses.toLocaleString()}`;
        
        // Update balance sheet (simplified)
        const totalAssets = this.goats.length * 25000 + revenue; // Simplified asset calculation
        const totalLiabilities = expenses * 0.1; // Simplified liability calculation
        const ownersEquity = totalAssets - totalLiabilities;
        
        document.getElementById('total-assets').textContent = `KSh ${totalAssets.toLocaleString()}`;
        document.getElementById('total-liabilities').textContent = `KSh ${totalLiabilities.toLocaleString()}`;
        document.getElementById('owners-equity').textContent = `KSh ${ownersEquity.toLocaleString()}`;
    }

    calculateBreakeven() {
        const fixedCosts = parseFloat(document.getElementById('fixed-costs').value) || 0;
        const variableCosts = parseFloat(document.getElementById('variable-costs').value) || 0;
        const sellingPrice = parseFloat(document.getElementById('selling-price').value) || 0;
        
        if (sellingPrice > variableCosts) {
            const contributionMargin = sellingPrice - variableCosts;
            const breakevenUnits = Math.ceil(fixedCosts / contributionMargin);
            const breakevenRevenue = breakevenUnits * sellingPrice;
            
            document.getElementById('breakeven-units').textContent = breakevenUnits;
            document.getElementById('breakeven-revenue').textContent = `KSh ${breakevenRevenue.toLocaleString()}`;
            document.getElementById('contribution-margin').textContent = `KSh ${contributionMargin.toLocaleString()}`;
        } else {
            alert('Selling price must be greater than variable cost per goat');
        }
    }

    // Enhanced Sales Management
    showSaleModal(saleId = null) {
        const modal = document.getElementById('sale-modal');
        const title = document.getElementById('sale-modal-title');
        const form = document.getElementById('sale-form');
        
        if (saleId) {
            const sale = this.sales.find(s => s.id === saleId);
            if (sale) {
                title.textContent = 'Edit Sale';
                document.getElementById('sale-id').value = sale.id;
                document.getElementById('sale-date').value = sale.date;
                document.getElementById('sale-item-type').value = sale.itemType;
                document.getElementById('sale-item-name').value = sale.itemName;
                document.getElementById('sale-customer').value = sale.customer;
                document.getElementById('sale-quantity').value = sale.quantity;
                document.getElementById('sale-unit-price').value = sale.unitPrice;
                document.getElementById('sale-total').value = sale.total;
                document.getElementById('sale-payment-status').value = sale.paymentStatus;
                document.getElementById('sale-notes').value = sale.notes;
            }
        } else {
            title.textContent = 'Add New Sale';
            form.reset();
        }
        
        modal.style.display = 'flex';
    }

    saveSale() {
        const saleId = document.getElementById('sale-id').value;
        const quantity = parseFloat(document.getElementById('sale-quantity').value);
        const unitPrice = parseFloat(document.getElementById('sale-unit-price').value);
        const total = quantity * unitPrice;
        
        const saleData = {
            id: saleId || Date.now().toString(),
            date: document.getElementById('sale-date').value,
            itemType: document.getElementById('sale-item-type').value,
            itemName: document.getElementById('sale-item-name').value,
            customer: document.getElementById('sale-customer').value,
            quantity: quantity,
            unitPrice: unitPrice,
            total: total,
            paymentStatus: document.getElementById('sale-payment-status').value,
            notes: document.getElementById('sale-notes').value,
            createdAt: new Date().toISOString()
        };

        if (saleId) {
            const index = this.sales.findIndex(s => s.id === saleId);
            if (index !== -1) {
                this.sales[index] = { ...this.sales[index], ...saleData };
            }
        } else {
            this.sales.push(saleData);
            
            // Add corresponding transaction
            const transaction = {
                id: Date.now().toString() + '_tx',
                date: saleData.date,
                type: 'income',
                category: saleData.itemType === 'goats' ? 'goat-sales' : 'product-sales',
                description: `Sale: ${saleData.itemName} to ${saleData.customer}`,
                amount: saleData.total,
                paymentMethod: 'cash',
                createdAt: new Date().toISOString()
            };
            this.transactions.push(transaction);
            localStorage.setItem('farmTransactions', JSON.stringify(this.transactions));
        }

        localStorage.setItem('farmSales', JSON.stringify(this.sales));
        this.loadSales();
        this.hideSaleModal();
        this.updateDashboard();
    }

    loadSales() {
        const tbody = document.getElementById('sales-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.sales.map(sale => `
            <tr>
                <td>${new Date(sale.date).toLocaleDateString()}</td>
                <td>${sale.itemName}</td>
                <td>${sale.customer}</td>
                <td>${sale.quantity}</td>
                <td>KSh ${sale.unitPrice.toLocaleString()}</td>
                <td>KSh ${sale.total.toLocaleString()}</td>
                <td><span class="status-badge ${sale.paymentStatus}">${sale.paymentStatus}</span></td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.showSaleModal('${sale.id}')">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteSale('${sale.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    deleteSale(saleId) {
        if (confirm('Are you sure you want to delete this sale?')) {
            this.sales = this.sales.filter(s => s.id !== saleId);
            localStorage.setItem('farmSales', JSON.stringify(this.sales));
            this.loadSales();
            this.updateDashboard();
        }
    }

    hideSaleModal() {
        document.getElementById('sale-modal').style.display = 'none';
    }

    calculateSaleTotal() {
        const quantity = parseFloat(document.getElementById('sale-quantity').value) || 0;
        const unitPrice = parseFloat(document.getElementById('sale-unit-price').value) || 0;
        const total = quantity * unitPrice;
        document.getElementById('sale-total').value = total.toFixed(2);
    }

    // Enhanced Crop Management
    showCropModal(cropId = null) {
        const modal = document.getElementById('crop-modal');
        const title = document.getElementById('crop-modal-title');
        const form = document.getElementById('crop-form');
        
        if (cropId) {
            const crop = this.crops.find(c => c.id === cropId);
            if (crop) {
                title.textContent = 'Edit Crop';
                document.getElementById('crop-id').value = crop.id;
                document.getElementById('crop-name').value = crop.name;
                document.getElementById('crop-type').value = crop.type;
                document.getElementById('crop-area').value = crop.area;
                document.getElementById('crop-planting-date').value = crop.plantingDate;
                document.getElementById('crop-expected-harvest').value = crop.expectedHarvest;
                document.getElementById('crop-status').value = crop.status;
                document.getElementById('crop-yield').value = crop.yield;
                document.getElementById('crop-notes').value = crop.notes;
            }
        } else {
            title.textContent = 'Add New Crop';
            form.reset();
        }
        
        modal.style.display = 'flex';
    }

    saveCrop() {
        const cropId = document.getElementById('crop-id').value;
        const cropData = {
            id: cropId || Date.now().toString(),
            name: document.getElementById('crop-name').value,
            type: document.getElementById('crop-type').value,
            area: parseFloat(document.getElementById('crop-area').value),
            plantingDate: document.getElementById('crop-planting-date').value,
            expectedHarvest: document.getElementById('crop-expected-harvest').value,
            status: document.getElementById('crop-status').value,
            yield: parseFloat(document.getElementById('crop-yield').value) || 0,
            notes: document.getElementById('crop-notes').value,
            createdAt: new Date().toISOString()
        };

        if (cropId) {
            const index = this.crops.findIndex(c => c.id === cropId);
            if (index !== -1) {
                this.crops[index] = { ...this.crops[index], ...cropData };
            }
        } else {
            this.crops.push(cropData);
        }

        localStorage.setItem('farmCrops', JSON.stringify(this.crops));
        this.loadCrops();
        this.hideCropModal();
        this.updateDashboard();
    }

    loadCrops() {
        const tbody = document.getElementById('crops-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = this.crops.map(crop => `
            <tr>
                <td>${crop.name}</td>
                <td>${crop.type}</td>
                <td>${crop.area} acres</td>
                <td>${new Date(crop.plantingDate).toLocaleDateString()}</td>
                <td>${crop.expectedHarvest ? new Date(crop.expectedHarvest).toLocaleDateString() : 'N/A'}</td>
                <td><span class="status-badge ${crop.status}">${crop.status}</span></td>
                <td>${crop.yield} kg</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.showCropModal('${crop.id}')">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteCrop('${crop.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    deleteCrop(cropId) {
        if (confirm('Are you sure you want to delete this crop?')) {
            this.crops = this.crops.filter(c => c.id !== cropId);
            localStorage.setItem('farmCrops', JSON.stringify(this.crops));
            this.loadCrops();
            this.updateDashboard();
        }
    }

    hideCropModal() {
        const modal = document.getElementById('crop-modal');
        if (modal) {
            modal.style.display = 'none';
            
            // Clear the form
            const form = document.getElementById('crop-form');
            if (form) {
                form.reset();
            }
            
            // Clear any stored crop ID
            const cropIdField = document.getElementById('crop-id');
            if (cropIdField) {
                cropIdField.value = '';
            }
            
            console.log('✅ Crop modal closed and form cleared');
        }
    }

    filterCrops(type) {
        const filtered = type ? this.crops.filter(crop => crop.type === type) : this.crops;
        this.displayFilteredCrops(filtered);
    }

    displayFilteredCrops(crops) {
        const tbody = document.getElementById('crops-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = crops.map(crop => `
            <tr>
                <td>${crop.name}</td>
                <td>${crop.type}</td>
                <td>${crop.area} acres</td>
                <td>${new Date(crop.plantingDate).toLocaleDateString()}</td>
                <td>${crop.expectedHarvest ? new Date(crop.expectedHarvest).toLocaleDateString() : 'N/A'}</td>
                <td><span class="status-badge ${crop.status}">${crop.status}</span></td>
                <td>${crop.yield} kg</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.showCropModal('${crop.id}')">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteCrop('${crop.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Enhanced Goat Management with Search and Filters
    searchGoats() {
        const searchTerm = document.getElementById('goat-search').value.toLowerCase();
        const filtered = this.goats.filter(goat => 
            goat.name.toLowerCase().includes(searchTerm) ||
            goat.tag.toLowerCase().includes(searchTerm) ||
            goat.breed.toLowerCase().includes(searchTerm)
        );
        this.displayFilteredGoats(filtered);
    }

    filterGoats() {
        const statusFilter = document.getElementById('goat-status-filter').value;
        const genderFilter = document.getElementById('goat-gender-filter').value;
        const locationFilter = document.getElementById('goat-location-filter').value;
        
        let filtered = this.goats;
        
        if (statusFilter) {
            filtered = filtered.filter(goat => goat.status === statusFilter);
        }
        
        if (genderFilter) {
            filtered = filtered.filter(goat => goat.gender === genderFilter);
        }
        
        if (locationFilter) {
            filtered = filtered.filter(goat => goat.location === locationFilter);
        }
        
        this.displayFilteredGoats(filtered);
    }

    displayFilteredGoats(goats) {
        const tbody = document.getElementById('goats-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = goats.map(goat => `
            <tr>
                <td>
                    <div class="goat-photo">
                        ${goat.photo ? `<img src="${goat.photo}" alt="${goat.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;">` : '📷'}
                    </div>
                </td>
                <td>${goat.tag}</td>
                <td><strong>${goat.name}</strong></td>
                <td>${goat.gender}</td>
                <td>${goat.breed}</td>
                <td>${this.calculateAge(goat.dob)}</td>
                <td>${goat.weight || 'N/A'} kg</td>
                <td><span class="status-badge ${goat.status}">${goat.status}</span></td>
                <td>${goat.location}</td>
                <td>
                    <button class="action-btn qr" onclick="farmRecords.generateQRCode('${goat.id}')">QR</button>
                </td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.showGoatModal('${goat.id}')">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteGoat('${goat.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    calculateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        const ageInDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
        
        if (ageInDays < 30) {
            return `${ageInDays} days`;
        } else if (ageInDays < 365) {
            return `${Math.floor(ageInDays / 30)} months`;
        } else {
            return `${Math.floor(ageInDays / 365)} years`;
        }
    }

    generateQRCode(goatId) {
        const goat = this.goats.find(g => g.id === goatId);
        if (goat) {
            const qrData = JSON.stringify({
                id: goat.id,
                name: goat.name,
                tag: goat.tag,
                breed: goat.breed,
                farm: 'The Mountain Goat Farm - Quality Breeding, Superior Genetics',
                breedingQuality: 'Superior genetics for meat production',
                meatGrade: goat.meatGrade || 'Premium quality',
                genetics: goat.genetics || 'Superior bloodline'
            });
            
            // Simple QR code generation (in production, use a proper QR library)
            alert(`QR Code data for ${goat.name} - Superior Genetics:\n${qrData}`);
        }
    }

    // Report Generation
    generateReport(reportType) {
        switch(reportType) {
            case 'livestock-summary':
                this.generateLivestockSummary();
                break;
            case 'breeding-report':
                this.generateBreedingReport();
                break;
            case 'financial-report':
                this.generateFinancialReport();
                break;
            default:
                alert('Report type not implemented yet');
        }
    }

    generateLivestockSummary() {
        const reportData = {
            totalGoats: this.goats.length,
            bucks: this.goats.filter(g => g.gender === 'buck').length,
            does: this.goats.filter(g => g.gender === 'doe').length,
            kids: this.goats.filter(g => g.gender === 'kid').length,
            breeds: this.getBreedDistribution(),
            healthStatus: this.getHealthStatusDistribution(),
            farmInfo: {
                name: 'The Mountain Goat Farm - Quality Breeding, Superior Genetics',
                status: 'Newly Established',
                staffExperience: '10+ years combined expertise',
                focus: 'Premium meat goat breeding with superior genetics'
            }
        };
        
        this.downloadReport('livestock-summary', reportData);
    }

    generateBreedingReport() {
        const reportData = {
            totalBreedingRecords: this.breedingRecords.length,
            activeBreeders: this.goats.filter(g => g.breedingStatus === 'available').length,
            pregnantDoes: this.goats.filter(g => g.breedingStatus === 'pregnant').length,
            upcomingBirths: this.breedingRecords.filter(r => {
                const dueDate = new Date(r.expectedDueDate);
                const today = new Date();
                const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                return daysUntilDue >= 0 && daysUntilDue <= 30;
            }).length
        };
        
        this.downloadReport('breeding-report', reportData);
    }

    generateFinancialReport() {
        const reportData = {
            totalRevenue: this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
            totalExpenses: this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
            netProfit: 0,
            transactions: this.transactions
        };
        
        reportData.netProfit = reportData.totalRevenue - reportData.totalExpenses;
        this.downloadReport('financial-report', reportData);
    }

    getBreedDistribution() {
        const breeds = {};
        this.goats.forEach(goat => {
            breeds[goat.breed] = (breeds[goat.breed] || 0) + 1;
        });
        return breeds;
    }

    getHealthStatusDistribution() {
        const statuses = {};
        this.goats.forEach(goat => {
            statuses[goat.healthStatus] = (statuses[goat.healthStatus] || 0) + 1;
        });
        return statuses;
    }

    downloadReport(reportType, data) {
        const reportContent = JSON.stringify(data, null, 2);
        const blob = new Blob([reportContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Initialize all sections
    initializeApp() {
        this.loadGoats();
        this.loadTasks();
        this.loadReminders();
        this.loadTransactions();
        this.loadSales();
        this.loadCrops();
        this.updateDashboard();
        this.showSection('dashboard');
        
        // Set up search listeners
        const searchInput = document.getElementById('goat-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.searchGoats());
        }
        
        // Set up filter listeners
        const statusFilter = document.getElementById('goat-status-filter');
        const genderFilter = document.getElementById('goat-gender-filter');
        const locationFilter = document.getElementById('goat-location-filter');
        
        if (statusFilter) statusFilter.addEventListener('change', () => this.filterGoats());
        if (genderFilter) genderFilter.addEventListener('change', () => this.filterGoats());
        if (locationFilter) locationFilter.addEventListener('change', () => this.filterGoats());
    }

    // ===============================================
    // BULK OPERATIONS FUNCTIONALITY
    // ===============================================
    
    setupBulkOperations() {
        // Master checkbox for select all/none
        const masterCheckbox = document.getElementById('masterCheckbox');
        if (masterCheckbox) {
            masterCheckbox.addEventListener('change', (e) => {
                const checkboxes = document.querySelectorAll('.goat-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                    const goatId = checkbox.dataset.goatId;
                    if (e.target.checked) {
                        this.selectedGoats.add(goatId);
                    } else {
                        this.selectedGoats.delete(goatId);
                    }
                    this.updateRowSelection(checkbox);
                });
                this.updateSelectionCounter();
            });
        }

        // Individual checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('goat-checkbox')) {
                const goatId = e.target.dataset.goatId;
                if (e.target.checked) {
                    this.selectedGoats.add(goatId);
                } else {
                    this.selectedGoats.delete(goatId);
                }
                this.updateRowSelection(e.target);
                this.updateSelectionCounter();
                this.updateMasterCheckbox();
            }
        });

        // Bulk action buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('bulk-btn')) {
                e.preventDefault();
                const action = e.target.dataset.action;
                if (this.selectedGoats.size === 0) {
                    alert('Please select at least one goat before performing bulk operations.');
                    return;
                }
                this.handleBulkAction(action);
            }
        });

        // Bulk modal form submissions
        const bulkVaccinationForm = document.getElementById('bulkVaccinationForm');
        if (bulkVaccinationForm) {
            bulkVaccinationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.applyBulkVaccination();
            });
        }

        const bulkTreatmentForm = document.getElementById('bulkTreatmentForm');
        if (bulkTreatmentForm) {
            bulkTreatmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.applyBulkTreatment();
            });
        }

        const bulkLocationForm = document.getElementById('bulkLocationForm');
        if (bulkLocationForm) {
            bulkLocationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.applyBulkLocation();
            });
        }

        const bulkWeightForm = document.getElementById('bulkWeightForm');
        if (bulkWeightForm) {
            bulkWeightForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.applyBulkWeight();
            });
        }

        // Close modal buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-bulk-modal')) {
                const modalId = e.target.dataset.modal;
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = 'none';
                }
            }
        });

        console.log('✅ Bulk operations setup complete');
    }

    updateRowSelection(checkbox) {
        const row = checkbox.closest('tr');
        if (checkbox.checked) {
            row.classList.add('selected');
        } else {
            row.classList.remove('selected');
        }
    }

    updateSelectionCounter() {
        const counter = document.getElementById('selectionCounter');
        if (counter) {
            counter.textContent = this.selectedGoats.size;
        }
        
        // Enable/disable bulk operation buttons
        const bulkButtons = document.querySelectorAll('.bulk-btn');
        bulkButtons.forEach(btn => {
            btn.disabled = this.selectedGoats.size === 0;
        });
    }

    updateMasterCheckbox() {
        const masterCheckbox = document.getElementById('masterCheckbox');
        const checkboxes = document.querySelectorAll('.goat-checkbox');
        const checkedCheckboxes = document.querySelectorAll('.goat-checkbox:checked');
        
        if (masterCheckbox) {
            if (checkedCheckboxes.length === 0) {
                masterCheckbox.indeterminate = false;
                masterCheckbox.checked = false;
            } else if (checkedCheckboxes.length === checkboxes.length) {
                masterCheckbox.indeterminate = false;
                masterCheckbox.checked = true;
            } else {
                masterCheckbox.indeterminate = true;
            }
        }
    }

    handleBulkAction(action) {
        const selectedGoatData = this.getSelectedGoatData();
        
        switch(action) {
            case 'vaccinate':
                this.openBulkVaccinationModal(selectedGoatData);
                break;
            case 'treat':
                this.openBulkTreatmentModal(selectedGoatData);
                break;
            case 'quarantine':
                this.setBulkStatus(selectedGoatData, 'Quarantine');
                break;
            case 'active':
                this.setBulkStatus(selectedGoatData, 'Active');
                break;
            case 'sold':
                this.setBulkStatus(selectedGoatData, 'Sold');
                break;
            case 'move':
                this.openBulkLocationModal(selectedGoatData);
                break;
            case 'weight':
                this.openBulkWeightModal(selectedGoatData);
                break;
            case 'export':
                this.exportSelectedGoats(selectedGoatData);
                break;
            default:
                console.log('Unknown bulk action:', action);
        }
    }

    getSelectedGoatData() {
        return this.goats.filter(goat => this.selectedGoats.has(goat.id.toString()));
    }

    // ===============================================
    // BULK VACCINATION MODAL
    // ===============================================
    
    openBulkVaccinationModal(selectedGoatData) {
        const modal = document.getElementById('bulkVaccinationModal');
        
        // Populate with selected goat names
        const goatsList = document.getElementById('selectedGoatsVaccination');
        if (goatsList) {
            goatsList.innerHTML = selectedGoatData.map(goat => 
                `<label><input type="checkbox" checked value="${goat.id}"> ${goat.name} (ID: ${goat.id})</label>`
            ).join('');
        }
        
        if (modal) modal.style.display = 'block';
    }

    applyBulkVaccination() {
        const selectedIds = Array.from(document.querySelectorAll('#selectedGoatsVaccination input:checked'))
            .map(cb => cb.value);
        
        const vaccineType = document.getElementById('bulkVaccineType')?.value;
        const vaccinationDate = document.getElementById('bulkVaccinationDate')?.value;
        const veterinarian = document.getElementById('bulkVeterinarian')?.value;
        const notes = document.getElementById('bulkVaccinationNotes')?.value;
        
        if (!vaccineType || !vaccinationDate) {
            alert('Please fill in all required fields.');
            return;
        }

        // Update goats with vaccination record
        this.goats.forEach(goat => {
            if (selectedIds.includes(goat.id.toString())) {
                if (!goat.healthRecords) goat.healthRecords = [];
                goat.healthRecords.push({
                    type: 'Vaccination',
                    treatment: vaccineType,
                    date: vaccinationDate,
                    veterinarian: veterinarian,
                    notes: notes,
                    timestamp: new Date().toISOString()
                });
                goat.lastVaccination = vaccinationDate;
            }
        });

        localStorage.setItem('farmGoats', JSON.stringify(this.goats));
        this.loadGoats();
        this.closeBulkVaccinationModal();
        
        this.showBulkSuccessMessage(`Successfully vaccinated ${selectedIds.length} goats with ${vaccineType}`);
        
        // Log activity to enterprise feed
        if (window.enterpriseFeatures) {
            window.enterpriseFeatures.logBulkOperation('vaccination', selectedIds.length, vaccineType);
        }
        
        this.clearSelections();
    }

    closeBulkVaccinationModal() {
        const modal = document.getElementById('bulkVaccinationModal');
        if (modal) modal.style.display = 'none';
        const form = document.getElementById('bulkVaccinationForm');
        if (form) form.reset();
    }

    // ===============================================
    // BULK TREATMENT MODAL
    // ===============================================
    
    openBulkTreatmentModal(selectedGoatData) {
        const modal = document.getElementById('bulkTreatmentModal');
        
        const goatsList = document.getElementById('selectedGoatsTreatment');
        if (goatsList) {
            goatsList.innerHTML = selectedGoatData.map(goat => 
                `<label><input type="checkbox" checked value="${goat.id}"> ${goat.name} (ID: ${goat.id})</label>`
            ).join('');
        }
        
        if (modal) modal.style.display = 'block';
    }

    applyBulkTreatment() {
        const selectedIds = Array.from(document.querySelectorAll('#selectedGoatsTreatment input:checked'))
            .map(cb => cb.value);
        
        const treatmentType = document.getElementById('bulkTreatmentType')?.value;
        const treatmentDate = document.getElementById('bulkTreatmentDate')?.value;
        const veterinarian = document.getElementById('bulkTreatmentVeterinarian')?.value;
        const dosage = document.getElementById('bulkDosage')?.value;
        const notes = document.getElementById('bulkTreatmentNotes')?.value;
        
        if (!treatmentType || !treatmentDate) {
            alert('Please fill in all required fields.');
            return;
        }

        this.goats.forEach(goat => {
            if (selectedIds.includes(goat.id.toString())) {
                if (!goat.healthRecords) goat.healthRecords = [];
                goat.healthRecords.push({
                    type: 'Treatment',
                    treatment: treatmentType,
                    date: treatmentDate,
                    veterinarian: veterinarian,
                    dosage: dosage,
                    notes: notes,
                    timestamp: new Date().toISOString()
                });
                goat.lastTreatment = treatmentDate;
            }
        });

        localStorage.setItem('farmGoats', JSON.stringify(this.goats));
        this.loadGoats();
        this.closeBulkTreatmentModal();
        
        this.showBulkSuccessMessage(`Successfully treated ${selectedIds.length} goats with ${treatmentType}`);
        
        // Log activity to enterprise feed
        if (window.enterpriseFeatures) {
            window.enterpriseFeatures.logBulkOperation('treatment', selectedIds.length, treatmentType);
        }
        
        this.clearSelections();
    }

    closeBulkTreatmentModal() {
        const modal = document.getElementById('bulkTreatmentModal');
        if (modal) modal.style.display = 'none';
        const form = document.getElementById('bulkTreatmentForm');
        if (form) form.reset();
    }

    // ===============================================
    // BULK STATUS UPDATES
    // ===============================================
    
    setBulkStatus(selectedGoatData, newStatus) {
        const goatNames = selectedGoatData.map(g => g.name).join(', ');
        const confirmation = confirm(`Are you sure you want to set status to "${newStatus}" for ${selectedGoatData.length} goats?\n\nGoats: ${goatNames}`);
        
        if (confirmation) {
            this.goats.forEach(goat => {
                if (this.selectedGoats.has(goat.id.toString())) {
                    goat.status = newStatus;
                    goat.healthStatus = newStatus; // Update both fields for compatibility
                    // Add status change to health records
                    if (!goat.healthRecords) goat.healthRecords = [];
                    goat.healthRecords.push({
                        type: 'Status Change',
                        treatment: `Status changed to ${newStatus}`,
                        date: new Date().toISOString().split('T')[0],
                        notes: `Bulk status update`,
                        timestamp: new Date().toISOString()
                    });
                }
            });

            localStorage.setItem('farmGoats', JSON.stringify(this.goats));
            this.loadGoats();
            this.showBulkSuccessMessage(`Successfully updated status to "${newStatus}" for ${selectedGoatData.length} goats`);
            
            // Log activity to enterprise feed
            if (window.enterpriseFeatures) {
                window.enterpriseFeatures.logBulkOperation('statusChange', selectedGoatData.length, `Status changed to ${newStatus}`);
            }
            
            this.clearSelections();
        }
    }

    // ===============================================
    // BULK LOCATION MODAL
    // ===============================================
    
    openBulkLocationModal(selectedGoatData) {
        const modal = document.getElementById('bulkLocationModal');
        
        const goatsList = document.getElementById('selectedGoatsLocation');
        if (goatsList) {
            goatsList.innerHTML = selectedGoatData.map(goat => 
                `<label><input type="checkbox" checked value="${goat.id}"> ${goat.name} (Current: ${goat.location || 'Not set'})</label>`
            ).join('');
        }
        
        if (modal) modal.style.display = 'block';
    }

    applyBulkLocation() {
        const selectedIds = Array.from(document.querySelectorAll('#selectedGoatsLocation input:checked'))
            .map(cb => cb.value);
        
        const newLocation = document.getElementById('bulkNewLocation')?.value;
        const moveDate = document.getElementById('bulkMoveDate')?.value;
        const reason = document.getElementById('bulkMoveReason')?.value;
        
        if (!newLocation || !moveDate) {
            alert('Please fill in all required fields.');
            return;
        }

        this.goats.forEach(goat => {
            if (selectedIds.includes(goat.id.toString())) {
                const oldLocation = goat.location || 'Unknown';
                goat.location = newLocation;
                
                // Add location change to health records
                if (!goat.healthRecords) goat.healthRecords = [];
                goat.healthRecords.push({
                    type: 'Location Change',
                    treatment: `Moved from ${oldLocation} to ${newLocation}`,
                    date: moveDate,
                    notes: reason,
                    timestamp: new Date().toISOString()
                });
            }
        });

        localStorage.setItem('farmGoats', JSON.stringify(this.goats));
        this.loadGoats();
        this.closeBulkLocationModal();
        
        this.showBulkSuccessMessage(`Successfully moved ${selectedIds.length} goats to ${newLocation}`);
        this.clearSelections();
    }

    closeBulkLocationModal() {
        const modal = document.getElementById('bulkLocationModal');
        if (modal) modal.style.display = 'none';
        const form = document.getElementById('bulkLocationForm');
        if (form) form.reset();
    }

    // ===============================================
    // BULK WEIGHT MODAL
    // ===============================================
    
    openBulkWeightModal(selectedGoatData) {
        const modal = document.getElementById('bulkWeightModal');
        
        const weightsContainer = document.getElementById('individualWeightInputs');
        if (weightsContainer) {
            weightsContainer.innerHTML = selectedGoatData.map(goat => `
                <div class="weight-input-row">
                    <label for="weight_${goat.id}">${goat.name} (ID: ${goat.id})</label>
                    <input type="number" id="weight_${goat.id}" step="0.1" min="0" 
                           placeholder="kg" value="${goat.weight || ''}" required>
                </div>
            `).join('');
        }
        
        if (modal) modal.style.display = 'block';
    }

    applyBulkWeight() {
        const weightDate = document.getElementById('bulkWeightDate')?.value;
        const weighingMethod = document.getElementById('bulkWeighingMethod')?.value;
        const notes = document.getElementById('bulkWeightNotes')?.value;
        
        if (!weightDate) {
            alert('Please select a weighing date.');
            return;
        }

        let updatedCount = 0;
        const selectedGoatData = this.getSelectedGoatData();
        
        selectedGoatData.forEach(goat => {
            const weightInput = document.getElementById(`weight_${goat.id}`);
            if (weightInput) {
                const newWeight = parseFloat(weightInput.value);
                
                if (!isNaN(newWeight) && newWeight > 0) {
                    const oldWeight = goat.weight || 0;
                    goat.weight = newWeight;
                    
                    // Add weight record to health records
                    if (!goat.healthRecords) goat.healthRecords = [];
                    goat.healthRecords.push({
                        type: 'Weight Record',
                        treatment: `Weight: ${newWeight}kg (${oldWeight ? `Previous: ${oldWeight}kg` : 'First record'})`,
                        date: weightDate,
                        notes: `Method: ${weighingMethod}. ${notes}`,
                        timestamp: new Date().toISOString()
                    });
                    
                    updatedCount++;
                }
            }
        });

        if (updatedCount > 0) {
            localStorage.setItem('farmGoats', JSON.stringify(this.goats));
            this.loadGoats();
            this.closeBulkWeightModal();
            
            this.showBulkSuccessMessage(`Successfully updated weight for ${updatedCount} goats`);
            this.clearSelections();
        } else {
            alert('Please enter valid weights for at least one goat.');
        }
    }

    closeBulkWeightModal() {
        const modal = document.getElementById('bulkWeightModal');
        if (modal) modal.style.display = 'none';
        const form = document.getElementById('bulkWeightForm');
        if (form) form.reset();
    }

    // ===============================================
    // BULK EXPORT FUNCTIONALITY
    // ===============================================
    
    exportSelectedGoats(selectedGoatData) {
        if (selectedGoatData.length === 0) {
            alert('No goats selected for export.');
            return;
        }

        const csvContent = this.generateCSV(selectedGoatData);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `selected_goats_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        this.showBulkSuccessMessage(`Successfully exported ${selectedGoatData.length} goat records`);
        this.clearSelections();
    }

    generateCSV(goats) {
        const headers = ['ID', 'Name', 'Breed', 'Gender', 'Date of Birth', 'Weight', 'Location', 'Status', 'Last Vaccination', 'Health Records Count'];
        
        const rows = goats.map(goat => [
            goat.id,
            goat.name,
            goat.breed,
            goat.gender,
            goat.dateOfBirth || goat.dob,
            goat.weight || '',
            goat.location || '',
            goat.status || goat.healthStatus || '',
            goat.lastVaccination || '',
            (goat.healthRecords || []).length
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
            
        return csvContent;
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    
    showBulkSuccessMessage(message) {
        // Create or update success message
        let successDiv = document.getElementById('bulkSuccessMessage');
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.id = 'bulkSuccessMessage';
            successDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
                font-weight: 500;
            `;
            document.body.appendChild(successDiv);
        }
        
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 300);
        }, 4000);
    }

    clearSelections() {
        this.selectedGoats.clear();
        this.updateSelectionCounter();
        
        // Uncheck all checkboxes
        const checkboxes = document.querySelectorAll('.goat-checkbox, #masterCheckbox');
        checkboxes.forEach(cb => {
            cb.checked = false;
            cb.indeterminate = false;
        });
        
        // Remove selected styling from rows
        document.querySelectorAll('tr.selected').forEach(row => {
            row.classList.remove('selected');
        });
    }

    // Enhanced loadGoats method to include bulk operations support
    loadGoats() {
        const tbody = document.getElementById('goats-tbody');
        if (!tbody) return; // Skip if not on goats page
        
        tbody.innerHTML = '';
        
        if (this.goats.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No goats registered yet</td></tr>';
            return;
        }
        
        this.goats.forEach(goat => {
            const row = document.createElement('tr');
            
            // Handle both legacy and new field formats
            const displayData = {
                id: goat.id || goat.tag || 'N/A',
                name: goat.name || 'N/A',
                breed: goat.breed || 'N/A',
                age: goat.age || (goat.dob ? this.calculateAge(goat.dob) : 'N/A'),
                color: goat.color || 'N/A',
                gender: goat.gender || 'N/A',
                milkProduction: goat.milkProduction || 'N/A',
                healthStatus: goat.healthStatus || goat.status || 'Unknown',
                location: goat.location || 'N/A'
            };
            
            row.innerHTML = `
                <td><input type="checkbox" class="goat-checkbox" data-goat-id="${goat.id}"></td>
                <td>${displayData.id}</td>
                <td>${displayData.name}</td>
                <td>${displayData.breed}</td>
                <td>${displayData.age}</td>
                <td>${displayData.color}</td>
                <td>${displayData.milkProduction}</td>
                <td class="status-${displayData.healthStatus.toLowerCase().replace(' ', '-')}">${displayData.healthStatus}</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.editGoat('${goat.id}')">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteGoat('${goat.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Update selection state if goats were previously selected
        this.updateSelectionCounter();
        this.updateMasterCheckbox();
    }
}

// Initialize the farm records manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    window.farmApp = new FarmRecordsManager();
    window.farmApp.init(); // Call init after DOM is ready
    // Maintain backward compatibility for onclick handlers
    window.farmRecords = window.farmApp;
    
    // Hamburger mobile nav toggle
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            // Animate hamburger into an 'X'
            hamburger.classList.toggle('open');
            console.log('Mobile navigation toggled');
        });
        
        // Close mobile menu when clicking on a navigation link
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                navLinks.classList.remove('show');
                hamburger.classList.remove('open');
                console.log('Mobile navigation closed after link click');
            }
        });
        
        console.log('Hamburger menu initialized');
    }
    
    // Add debugging function
    window.testButton = function(buttonId) {
        const button = document.getElementById(buttonId);
        console.log(`Testing button: ${buttonId}`, button);
        if (button) {
            console.log('Button found, simulating click...');
            button.click();
        } else {
            console.error('Button not found!');
        }
    };
    
    console.log('Farm app initialized. Try: testButton("add-goat-btn")');

    // ================================
    // LAND LEASE RECORDS MANAGEMENT
    // ================================

    farmRecords.loadLeases = function() {
        const tbody = document.getElementById('leases-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.leases.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No lease records found</td></tr>';
            this.updateLeaseStats();
            return;
        }

        this.leases.forEach(lease => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${lease.id}</td>
                <td>${lease.propertyName}</td>
                <td>${lease.lesseeName}</td>
                <td>${lease.type}</td>
                <td>${new Date(lease.startDate).toLocaleDateString()}</td>
                <td>${new Date(lease.endDate).toLocaleDateString()}</td>
                <td>KSh ${lease.monthlyRent.toLocaleString()}</td>
                <td class="status-${lease.status}">${lease.status}</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.editLease('${lease.id}')">Edit</button>
                    <button class="action-btn delete" onclick="farmRecords.deleteLease('${lease.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.updateLeaseStats();
    };

    farmRecords.updateLeaseStats = function() {
        const totalLeases = this.leases.length;
        const activeLeases = this.leases.filter(l => l.status === 'active').length;
        const monthlyRevenue = this.leases.filter(l => l.status === 'active').reduce((sum, l) => sum + l.monthlyRent, 0);
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
        const expiringLeases = this.leases.filter(l => 
            l.status === 'active' && new Date(l.endDate) <= thirtyDaysFromNow
        ).length;

        const totalLeasesEl = document.getElementById('total-leases');
        const activeLeasesEl = document.getElementById('active-leases');
        const monthlyRevenueEl = document.getElementById('monthly-lease-revenue');
        const expiringLeasesEl = document.getElementById('expiring-leases');

        if (totalLeasesEl) totalLeasesEl.textContent = totalLeases;
        if (activeLeasesEl) activeLeasesEl.textContent = activeLeases;
        if (monthlyRevenueEl) monthlyRevenueEl.textContent = `KSh ${monthlyRevenue.toLocaleString()}`;
        if (expiringLeasesEl) expiringLeasesEl.textContent = expiringLeases;
    };

    farmRecords.showLeaseModal = function(lease = null) {
        const modal = document.getElementById('lease-modal');
        const form = document.getElementById('lease-form');
        
        if (lease) {
            document.getElementById('lease-modal-title').textContent = 'Edit Lease';
            this.populateLeaseForm(lease);
        } else {
            document.getElementById('lease-modal-title').textContent = 'Add New Lease';
            form.reset();
            document.getElementById('lease-id').value = '';
        }
        
        modal.style.display = 'flex';
    };

    farmRecords.hideLeaseModal = function() {
        document.getElementById('lease-modal').style.display = 'none';
    };

    farmRecords.populateLeaseForm = function(lease) {
        document.getElementById('lease-id').value = lease.id;
        document.getElementById('lease-property-name').value = lease.propertyName;
        document.getElementById('lease-type').value = lease.type;
        document.getElementById('lease-lessee-name').value = lease.lesseeName;
        document.getElementById('lease-lessee-contact').value = lease.lesseeContact;
        document.getElementById('lease-area').value = lease.area;
        document.getElementById('lease-location').value = lease.location;
        document.getElementById('lease-monthly-rent').value = lease.monthlyRent;
        document.getElementById('lease-security-deposit').value = lease.securityDeposit;
        document.getElementById('lease-payment-method').value = lease.paymentMethod;
        document.getElementById('lease-payment-day').value = lease.paymentDay;
        document.getElementById('lease-start-date').value = lease.startDate;
        document.getElementById('lease-end-date').value = lease.endDate;
        document.getElementById('lease-renewal').value = lease.autoRenewal;
        document.getElementById('lease-status').value = lease.status;
        document.getElementById('lease-terms').value = lease.terms;
        document.getElementById('lease-notes').value = lease.notes;
    };

    farmRecords.saveLease = function() {
        const lease = {
            id: document.getElementById('lease-id').value || Date.now().toString(),
            propertyName: document.getElementById('lease-property-name').value,
            type: document.getElementById('lease-type').value,
            lesseeName: document.getElementById('lease-lessee-name').value,
            lesseeContact: document.getElementById('lease-lessee-contact').value,
            area: parseFloat(document.getElementById('lease-area').value),
            location: document.getElementById('lease-location').value,
            monthlyRent: parseFloat(document.getElementById('lease-monthly-rent').value),
            securityDeposit: parseFloat(document.getElementById('lease-security-deposit').value || 0),
            paymentMethod: document.getElementById('lease-payment-method').value,
            paymentDay: parseInt(document.getElementById('lease-payment-day').value),
            startDate: document.getElementById('lease-start-date').value,
            endDate: document.getElementById('lease-end-date').value,
            autoRenewal: document.getElementById('lease-renewal').value,
            status: document.getElementById('lease-status').value,
            terms: document.getElementById('lease-terms').value,
            notes: document.getElementById('lease-notes').value,
            dateCreated: new Date().toISOString()
        };

        if (document.getElementById('lease-id').value) {
            const index = this.leases.findIndex(l => l.id === lease.id);
            this.leases[index] = lease;
        } else {
            this.leases.push(lease);
        }

        localStorage.setItem('farmLeases', JSON.stringify(this.leases));
        this.loadLeases();
        this.hideLeaseModal();
    };

    farmRecords.editLease = function(id) {
        const lease = this.leases.find(l => l.id === id);
        if (lease) {
            this.showLeaseModal(lease);
        }
    };

    farmRecords.deleteLease = function(id) {
        if (confirm('Are you sure you want to delete this lease record?')) {
            this.leases = this.leases.filter(l => l.id !== id);
            localStorage.setItem('farmLeases', JSON.stringify(this.leases));
            this.loadLeases();
        }
    };

    // Add other module functions in similar pattern...
    console.log('✅ Additional modules initialized');

    // User Management Functions
    farmRecords.loadUsers = function() {
        const tbody = document.getElementById('users-tbody');
        if (!tbody) return; // Skip if not on settings page
        
        tbody.innerHTML = '';
        
        if (this.users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No users registered yet</td></tr>';
            return;
        }
        
        this.users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${user.email || 'N/A'}</td>
                <td><span class="role-badge ${user.role}">${user.role}</span></td>
                <td><span class="status-${user.status}">${user.status}</span></td>
                <td>${user.lastLogin || 'Never'}</td>
                <td>
                    <button class="action-btn edit" onclick="farmRecords.editUser('${user.id}')">Edit</button>
                    ${user.id !== 1 ? `<button class="action-btn delete" onclick="farmRecords.deleteUser('${user.id}')">Delete</button>` : ''}
                </td>
            `;
            tbody.appendChild(row);
        });
    };

    farmRecords.showUserModal = function(user = null) {
        const modal = document.getElementById('user-modal');
        const form = document.getElementById('user-form');
        
        if (user) {
            document.getElementById('user-modal-title').textContent = 'Edit User';
            document.getElementById('user-id').value = user.id;
            document.getElementById('user-full-name').value = user.name;
            document.getElementById('user-username').value = user.username;
            document.getElementById('user-email').value = user.email || '';
            document.getElementById('user-phone').value = user.phone || '';
            document.getElementById('user-role').value = user.role;
            document.getElementById('user-status').value = user.status;
            document.getElementById('user-notes').value = user.notes || '';
            // Don't prefill passwords for editing
            document.getElementById('user-password').value = '';
            document.getElementById('user-confirm-password').value = '';
        } else {
            document.getElementById('user-modal-title').textContent = 'Add New User';
            form.reset();
        }
        
        modal.style.display = 'flex';
    };

    farmRecords.hideUserModal = function() {
        document.getElementById('user-modal').style.display = 'none';
    };

    farmRecords.saveUser = function() {
        const form = document.getElementById('user-form');
        
        // Helper function to safely get form values
        const getValue = (id) => {
            const element = document.getElementById(id);
            return element ? element.value : '';
        };

        const password = getValue('user-password');
        const confirmPassword = getValue('user-confirm-password');
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        const user = {
            id: getValue('user-id') || Date.now().toString(),
            name: getValue('user-full-name'),
            username: getValue('user-username'),
            email: getValue('user-email'),
            phone: getValue('user-phone'),
            role: getValue('user-role'),
            status: getValue('user-status') || 'active',
            notes: getValue('user-notes'),
            dateCreated: new Date().toISOString(),
            lastLogin: null
        };
        
        if (getValue('user-id')) {
            // Update existing user
            const index = this.users.findIndex(u => u.id == user.id);
            if (index !== -1) {
                this.users[index] = { ...this.users[index], ...user };
            }
        } else {
            // Add new user
            this.users.push(user);
        }
        
        localStorage.setItem('farmUsers', JSON.stringify(this.users));
        this.loadUsers();
        this.hideUserModal();
    };

    farmRecords.editUser = function(id) {
        const user = this.users.find(u => u.id == id);
        if (user) {
            this.showUserModal(user);
        }
    };

    farmRecords.deleteUser = function(id) {
        if (id == 1) {
            alert('Cannot delete the system administrator!');
            return;
        }
        
        if (confirm('Are you sure you want to delete this user?')) {
            this.users = this.users.filter(u => u.id != id);
            localStorage.setItem('farmUsers', JSON.stringify(this.users));
            this.loadUsers();
        }
    };

    // System Settings Functions
    farmRecords.loadSystemSettings = function() {
        const settings = this.systemSettings;
        
        // Load settings into form fields if they exist
        const setValue = (id, value) => {
            const element = document.getElementById(id);
            if (element && value !== undefined) {
                element.value = value;
            }
        };
        
        setValue('farm-name', settings.farmName || 'The Mountain Goat Farm');
        setValue('farm-location', settings.farmLocation || 'Nakuru, Kenya');
        setValue('farm-contact', settings.farmContact || '+254 700 000 000');
        setValue('farm-email', settings.farmEmail || 'info@mountaingoatfarm.com');
        setValue('currency', settings.currency || 'KSh');
        setValue('date-format', settings.dateFormat || 'DD/MM/YYYY');
        setValue('session-timeout', settings.sessionTimeout || 60);
        setValue('auto-backup', settings.autoBackup || 'daily');
        
        // Load notification settings
        const setCheckbox = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.checked = value !== false; // default to true if not set
            }
        };
        
        setCheckbox('notify-health', settings.notifyHealth);
        setCheckbox('notify-breeding', settings.notifyBreeding);
        setCheckbox('notify-lease', settings.notifyLease);
        setCheckbox('notify-maintenance', settings.notifyMaintenance);
        setCheckbox('notify-payments', settings.notifyPayments);
    };

    farmRecords.saveSystemSettings = function() {
        const getValue = (id) => {
            const element = document.getElementById(id);
            return element ? element.value : '';
        };
        
        const getCheckbox = (id) => {
            const element = document.getElementById(id);
            return element ? element.checked : false;
        };
        
        const settings = {
            farmName: getValue('farm-name'),
            farmLocation: getValue('farm-location'),
            farmContact: getValue('farm-contact'),
            farmEmail: getValue('farm-email'),
            currency: getValue('currency'),
            dateFormat: getValue('date-format'),
            sessionTimeout: parseInt(getValue('session-timeout')) || 60,
            autoBackup: getValue('auto-backup'),
            notifyHealth: getCheckbox('notify-health'),
            notifyBreeding: getCheckbox('notify-breeding'),
            notifyLease: getCheckbox('notify-lease'),
            notifyMaintenance: getCheckbox('notify-maintenance'),
            notifyPayments: getCheckbox('notify-payments'),
            lastUpdated: new Date().toISOString()
        };
        
        this.systemSettings = settings;
        localStorage.setItem('farmSystemSettings', JSON.stringify(settings));
        
        alert('Settings saved successfully!');
    };

    // Backup Functions
    farmRecords.createBackup = function() {
        const backupData = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            data: {
                goats: this.goats,
                breedingRecords: this.breedingRecords,
                meatRecords: this.meatRecords,
                milkRecords: this.milkRecords,
                feedRecords: this.feedRecords,
                healthRecords: this.healthRecords,
                products: this.products,
                contacts: this.contacts,
                tasks: this.tasks,
                reminders: this.reminders,
                transactions: this.transactions,
                sales: this.sales,
                crops: this.crops,
                leases: this.leases,
                equipment: this.equipment,
                laborers: this.laborers,
                jobAssignments: this.jobAssignments,
                laborPayments: this.laborPayments,
                users: this.users,
                systemSettings: this.systemSettings
            }
        };
        
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `farm-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        // Update last backup date
        localStorage.setItem('lastBackupDate', new Date().toISOString());
        document.getElementById('last-backup-date').textContent = new Date().toLocaleDateString();
        
        alert('Backup created successfully!');
    };

    farmRecords.exportData = function() {
        this.createBackup(); // Same as backup for now
    };
});

// Initialize the app when DOM is loaded
let farmRecords;
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Farm Records System...');
    farmRecords = new FarmRecordsManager();
    farmRecords.init();
    
    // Make it globally available for debugging
    window.farmRecords = farmRecords;
    
    console.log('✅ Farm Records System initialized successfully!');
});
