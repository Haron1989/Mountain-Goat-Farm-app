// Farm Records Health Check UI Integration
// Seamless integration with existing farm management interface

class HealthCheckUIIntegration {
    constructor(farmRecordsManager, healthCheckSystem) {
        this.farmManager = farmRecordsManager;
        this.healthCheck = healthCheckSystem;
        this.currentView = 'dashboard';
        this.autoRefreshInterval = null;
        
        this.init();
    }

    init() {
        this.createHealthCheckUI();
        this.setupEventListeners();
        this.integrateWithNavigation();
        this.setupAutoRefresh();
    }

    // ============ UI CREATION ============
    createHealthCheckUI() {
        // Add health check section to the main dashboard
        this.createDashboardWidget();
        
        // Create dedicated health check page
        this.createHealthCheckPage();
        
        // Add navigation link
        this.addNavigationLink();
        
        // Create notification center
        this.createNotificationCenter();
        
        // Add quick action buttons
        this.addQuickActionButtons();
    }

    createDashboardWidget() {
        const dashboard = document.querySelector('.dashboard-section .container');
        if (!dashboard) return;

        const healthWidget = document.createElement('div');
        healthWidget.className = 'kpi-card health-check-widget';
        healthWidget.innerHTML = `
            <div class="health-check-header">
                <h3>🔍 Farm Health Status</h3>
                <button class="btn-health-check" onclick="healthCheckUI.runQuickCheck()">
                    Quick Check
                </button>
            </div>
            <div class="health-check-summary" id="health-summary">
                <div class="loading">Loading health status...</div>
            </div>
            <div class="health-check-actions">
                <button onclick="healthCheckUI.showDetailedReport()" class="btn-secondary">
                    View Report
                </button>
                <button onclick="healthCheckUI.exportReport('html')" class="btn-secondary">
                    Export Report
                </button>
            </div>
        `;

        // Insert after the first KPI card
        const firstCard = dashboard.querySelector('.kpi-card');
        if (firstCard) {
            firstCard.parentNode.insertBefore(healthWidget, firstCard.nextSibling);
        } else {
            dashboard.appendChild(healthWidget);
        }
    }

    createHealthCheckPage() {
        const healthCheckHTML = `
        <div id="health-check-page" class="records-section" style="display: none;">
            <div class="container">
                <div class="section-header">
                    <h2>🔍 Farm Records Health Check</h2>
                    <div class="health-check-controls">
                        <button onclick="healthCheckUI.runFullHealthCheck()" class="btn-primary">
                            <span class="icon">🔄</span>
                            Run Full Check
                        </button>
                        <button onclick="healthCheckUI.toggleAutoCheck()" class="btn-secondary" id="auto-check-btn">
                            <span class="icon">⏰</span>
                            Enable Auto Check
                        </button>
                        <div class="export-dropdown">
                            <button class="btn-secondary dropdown-toggle">
                                <span class="icon">📊</span>
                                Export Report
                            </button>
                            <div class="dropdown-menu">
                                <a href="#" onclick="healthCheckUI.exportReport('html')">HTML Report</a>
                                <a href="#" onclick="healthCheckUI.exportReport('csv')">CSV Data</a>
                                <a href="#" onclick="healthCheckUI.exportReport('text')">Text Report</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="health-check-overview">
                    <div class="overview-grid">
                        <div class="overview-card critical">
                            <div class="card-icon">🚨</div>
                            <div class="card-content">
                                <h3 id="critical-count">0</h3>
                                <p>Critical Issues</p>
                            </div>
                        </div>
                        <div class="overview-card high">
                            <div class="card-icon">⚠️</div>
                            <div class="card-content">
                                <h3 id="high-count">0</h3>
                                <p>High Priority</p>
                            </div>
                        </div>
                        <div class="overview-card medium">
                            <div class="card-icon">⚡</div>
                            <div class="card-content">
                                <h3 id="medium-count">0</h3>
                                <p>Medium Priority</p>
                            </div>
                        </div>
                        <div class="overview-card low">
                            <div class="card-icon">ℹ️</div>
                            <div class="card-content">
                                <h3 id="low-count">0</h3>
                                <p>Low Priority</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="health-check-details" id="health-check-details">
                    <div class="details-placeholder">
                        <div class="placeholder-icon">🔍</div>
                        <h3>Run a health check to see detailed results</h3>
                        <p>Click "Run Full Check" to analyze your farm records for issues and inconsistencies.</p>
                    </div>
                </div>

                <div class="health-check-history">
                    <h3>📊 Health Check History</h3>
                    <div class="history-timeline" id="health-history">
                        <div class="no-history">No previous health checks found.</div>
                    </div>
                </div>

                <div class="health-check-settings">
                    <h3>⚙️ Settings</h3>
                    <div class="settings-grid">
                        <div class="setting-item">
                            <label for="auto-check-interval">Auto Check Interval</label>
                            <select id="auto-check-interval" onchange="healthCheckUI.updateAutoCheckInterval()">
                                <option value="1">Every Hour</option>
                                <option value="6">Every 6 Hours</option>
                                <option value="24" selected>Daily</option>
                                <option value="168">Weekly</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="notification-level">Notification Level</label>
                            <select id="notification-level" onchange="healthCheckUI.updateNotificationLevel()">
                                <option value="critical">Critical Only</option>
                                <option value="high" selected>High & Critical</option>
                                <option value="medium">Medium & Above</option>
                                <option value="all">All Issues</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="auto-create-tasks" onchange="healthCheckUI.updateAutoCreateTasks()" checked>
                                Auto-create tasks for critical issues
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="auto-create-reminders" onchange="healthCheckUI.updateAutoCreateReminders()" checked>
                                Auto-create reminders for overdue items
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', healthCheckHTML);
    }

    addNavigationLink() {
        const nav = document.querySelector('.nav-links');
        if (!nav) return;

        const healthLink = document.createElement('li');
        healthLink.innerHTML = `
            <a href="#" onclick="healthCheckUI.showHealthCheckPage()" id="health-check-nav">
                <span class="nav-icon">🔍</span>
                Health Check
                <span class="issue-badge" id="nav-issue-badge" style="display: none;">0</span>
            </a>
        `;

        // Insert before the last nav item (usually logout)
        nav.insertBefore(healthLink, nav.lastElementChild);
    }

    createNotificationCenter() {
        const notificationHTML = `
        <div id="notification-center" class="notification-center">
            <div class="notification-header">
                <h3>🔔 Health Check Notifications</h3>
                <button onclick="healthCheckUI.clearAllNotifications()" class="btn-clear">
                    Clear All
                </button>
            </div>
            <div class="notifications-list" id="notifications-list">
                <div class="no-notifications">No notifications</div>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', notificationHTML);
    }

    addQuickActionButtons() {
        // Add floating action button for quick health check
        const fab = document.createElement('div');
        fab.className = 'health-check-fab';
        fab.innerHTML = `
            <button onclick="healthCheckUI.runQuickCheck()" title="Quick Health Check">
                <span class="fab-icon">🔍</span>
                <span class="fab-text">Health Check</span>
            </button>
        `;
        document.body.appendChild(fab);

        // Add health status indicator to header
        const header = document.querySelector('header nav');
        if (header) {
            const statusIndicator = document.createElement('div');
            statusIndicator.className = 'health-status-indicator';
            statusIndicator.id = 'health-status-indicator';
            statusIndicator.innerHTML = `
                <div class="status-dot" title="Health Status"></div>
                <span class="status-text">Checking...</span>
            `;
            header.appendChild(statusIndicator);
        }
    }

    // ============ EVENT HANDLERS ============
    setupEventListeners() {
        // Listen for farm data changes
        document.addEventListener('farmDataUpdated', () => {
            this.updateHealthStatus();
        });

        // Listen for health check completion
        document.addEventListener('healthCheckCompleted', (event) => {
            this.handleHealthCheckCompleted(event.detail);
        });

        // Page visibility change (run check when page becomes visible)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.shouldRunAutoCheck()) {
                this.runQuickCheck();
            }
        });
    }

    integrateWithNavigation() {
        // Modify existing navigation to highlight health issues
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (e.target.href && !e.target.href.includes('#')) {
                    // Moving to a different page, update health status
                    setTimeout(() => this.updateHealthStatus(), 500);
                }
            });
        });
    }

    setupAutoRefresh() {
        // Refresh health status every 5 minutes
        this.autoRefreshInterval = setInterval(() => {
            this.updateHealthStatusSummary();
        }, 5 * 60 * 1000);
    }

    // ============ HEALTH CHECK OPERATIONS ============
    async runQuickCheck() {
        this.showLoadingState();
        
        try {
            const results = await this.healthCheck.runFullHealthCheck();
            this.handleHealthCheckCompleted(results);
            this.showNotification('✅ Health check completed', 'success');
            
            // Dispatch custom event
            document.dispatchEvent(new CustomEvent('healthCheckCompleted', { 
                detail: results 
            }));
            
            return results;
        } catch (error) {
            console.error('Health check failed:', error);
            this.showNotification('❌ Health check failed: ' + error.message, 'error');
            this.hideLoadingState();
        }
    }

    async runFullHealthCheck() {
        this.showHealthCheckPage();
        return await this.runQuickCheck();
    }

    toggleAutoCheck() {
        const btn = document.getElementById('auto-check-btn');
        const isEnabled = this.healthCheck.autoCheckInterval !== null;
        
        if (isEnabled) {
            this.healthCheck.stopAutoHealthCheck();
            btn.innerHTML = '<span class="icon">⏰</span> Enable Auto Check';
            this.showNotification('Auto health check disabled', 'info');
        } else {
            const interval = parseInt(document.getElementById('auto-check-interval')?.value || '24');
            this.healthCheck.startAutoHealthCheck(interval);
            btn.innerHTML = '<span class="icon">⏸️</span> Disable Auto Check';
            this.showNotification(`Auto health check enabled (every ${interval}h)`, 'info');
        }
    }

    // ============ UI UPDATES ============
    updateHealthStatus() {
        if (this.healthCheck.lastHealthCheck) {
            this.updateHealthStatusSummary();
            this.updateNavigationBadge();
            this.updateStatusIndicator();
        }
    }

    updateHealthStatusSummary() {
        const summary = document.getElementById('health-summary');
        if (!summary || !this.healthCheck.lastHealthCheck) return;

        const results = this.healthCheck.lastHealthCheck;
        const criticalIssues = results.summary.criticalIssues;
        const highIssues = results.summary.highIssues;
        const totalIssues = results.summary.totalIssues;
        
        let statusClass = 'healthy';
        let statusText = 'All Good';
        let statusIcon = '✅';
        
        if (criticalIssues > 0) {
            statusClass = 'critical';
            statusText = `${criticalIssues} Critical Issues`;
            statusIcon = '🚨';
        } else if (highIssues > 0) {
            statusClass = 'warning';
            statusText = `${highIssues} High Priority Issues`;
            statusIcon = '⚠️';
        } else if (totalIssues > 0) {
            statusClass = 'info';
            statusText = `${totalIssues} Minor Issues`;
            statusIcon = 'ℹ️';
        }

        summary.className = `health-check-summary ${statusClass}`;
        summary.innerHTML = `
            <div class="status-main">
                <span class="status-icon">${statusIcon}</span>
                <span class="status-text">${statusText}</span>
            </div>
            <div class="status-details">
                Last checked: ${new Date(results.timestamp).toLocaleString()}
            </div>
        `;
    }

    updateNavigationBadge() {
        const badge = document.getElementById('nav-issue-badge');
        if (!badge || !this.healthCheck.lastHealthCheck) return;

        const criticalCount = this.healthCheck.lastHealthCheck.summary.criticalIssues;
        
        if (criticalCount > 0) {
            badge.textContent = criticalCount;
            badge.style.display = 'inline';
            badge.className = 'issue-badge critical';
        } else {
            badge.style.display = 'none';
        }
    }

    updateStatusIndicator() {
        const indicator = document.getElementById('health-status-indicator');
        if (!indicator || !this.healthCheck.lastHealthCheck) return;

        const results = this.healthCheck.lastHealthCheck;
        const dot = indicator.querySelector('.status-dot');
        const text = indicator.querySelector('.status-text');
        
        if (results.summary.criticalIssues > 0) {
            dot.className = 'status-dot critical';
            text.textContent = 'Issues';
        } else if (results.summary.totalIssues > 0) {
            dot.className = 'status-dot warning';
            text.textContent = 'Minor Issues';
        } else {
            dot.className = 'status-dot healthy';
            text.textContent = 'Healthy';
        }
    }

    handleHealthCheckCompleted(results) {
        this.hideLoadingState();
        this.updateOverviewCards(results);
        this.updateHealthDetails(results);
        this.updateHealthHistory();
        this.updateHealthStatus();
        
        // Auto-integrate with other systems if enabled
        if (document.getElementById('auto-create-tasks')?.checked) {
            this.healthCheck.integrateWithTaskManager();
        }
        
        if (document.getElementById('auto-create-reminders')?.checked) {
            this.healthCheck.integrateWithReminders();
        }
        
        // Create notifications based on settings
        this.createNotificationsFromResults(results);
    }

    updateOverviewCards(results) {
        document.getElementById('critical-count').textContent = results.summary.criticalIssues;
        document.getElementById('high-count').textContent = results.summary.highIssues;
        document.getElementById('medium-count').textContent = results.summary.mediumIssues;
        document.getElementById('low-count').textContent = results.summary.lowIssues;
    }

    updateHealthDetails(results) {
        const detailsContainer = document.getElementById('health-check-details');
        if (!detailsContainer) return;

        let detailsHTML = '';
        
        for (const [categoryId, category] of Object.entries(results.categories)) {
            if (category.issues.length > 0) {
                detailsHTML += `
                <div class="category-section">
                    <h3>📋 ${category.name}</h3>
                    <div class="issues-list">
                `;
                
                category.issues.forEach(issue => {
                    const severityClass = issue.severity.toLowerCase();
                    detailsHTML += `
                    <div class="issue-item ${severityClass}">
                        <div class="issue-header">
                            <span class="severity-badge ${severityClass}">
                                ${this.healthCheck.severityLevels[issue.severity].icon}
                                ${issue.severity}
                            </span>
                            <span class="issue-title">${issue.description}</span>
                            <span class="issue-count">${issue.count} items</span>
                        </div>
                        <div class="issue-details">
                            ${this.formatIssueDetailsForUI(issue.details)}
                        </div>
                        ${issue.recommendations.length > 0 ? `
                        <div class="issue-recommendations">
                            <strong>💡 Recommendations:</strong>
                            <ul>
                                ${issue.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>
                    `;
                });
                
                detailsHTML += '</div></div>';
            }
        }
        
        if (detailsHTML === '') {
            detailsHTML = `
            <div class="no-issues">
                <div class="success-icon">✅</div>
                <h3>Excellent! No issues found</h3>
                <p>Your farm records are in good shape.</p>
            </div>
            `;
        }
        
        detailsContainer.innerHTML = detailsHTML;
    }

    updateHealthHistory() {
        const historyContainer = document.getElementById('health-history');
        if (!historyContainer) return;

        const history = this.healthCheck.getHealthCheckHistory();
        
        if (history.length === 0) {
            historyContainer.innerHTML = '<div class="no-history">No previous health checks found.</div>';
            return;
        }

        let historyHTML = '';
        history.slice(-10).reverse().forEach(entry => { // Show last 10 checks
            const date = new Date(entry.timestamp);
            const severityClass = entry.summary.criticalIssues > 0 ? 'critical' : 
                                 entry.summary.highIssues > 0 ? 'warning' : 'success';
            
            historyHTML += `
            <div class="history-item ${severityClass}">
                <div class="history-date">${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div>
                <div class="history-summary">
                    Total Issues: ${entry.summary.totalIssues} | 
                    Critical: ${entry.summary.criticalIssues} | 
                    Duration: ${entry.duration}ms
                </div>
            </div>
            `;
        });
        
        historyContainer.innerHTML = historyHTML;
    }

    // ============ PAGE NAVIGATION ============
    showHealthCheckPage() {
        // Hide all other sections
        document.querySelectorAll('.records-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show health check page
        const healthPage = document.getElementById('health-check-page');
        if (healthPage) {
            healthPage.style.display = 'block';
            this.currentView = 'health-check';
            
            // Update navigation active state
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            document.getElementById('health-check-nav')?.classList.add('active');
        }
    }

    showDetailedReport() {
        this.showHealthCheckPage();
        if (!this.healthCheck.lastHealthCheck) {
            this.runQuickCheck();
        }
    }

    // ============ EXPORT FUNCTIONALITY ============
    exportReport(format = 'html') {
        if (!this.healthCheck.lastHealthCheck) {
            this.showNotification('❌ No health check results to export. Run a health check first.', 'error');
            return;
        }

        try {
            const report = this.healthCheck.exportReport(format);
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `farm-health-check-${timestamp}.${format}`;
            
            this.downloadFile(report, filename, this.getMimeType(format));
            this.showNotification(`✅ Report exported as ${filename}`, 'success');
        } catch (error) {
            this.showNotification(`❌ Export failed: ${error.message}`, 'error');
        }
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    getMimeType(format) {
        const mimeTypes = {
            'html': 'text/html',
            'csv': 'text/csv',
            'txt': 'text/plain',
            'json': 'application/json'
        };
        return mimeTypes[format] || 'text/plain';
    }

    // ============ SETTINGS ============
    updateAutoCheckInterval() {
        const interval = parseInt(document.getElementById('auto-check-interval').value);
        if (this.healthCheck.autoCheckInterval) {
            this.healthCheck.stopAutoHealthCheck();
            this.healthCheck.startAutoHealthCheck(interval);
            this.showNotification(`Auto check interval updated to ${interval} hours`, 'info');
        }
    }

    updateNotificationLevel() {
        const level = document.getElementById('notification-level').value;
        localStorage.setItem('healthCheckNotificationLevel', level);
        this.showNotification(`Notification level set to ${level}`, 'info');
    }

    updateAutoCreateTasks() {
        const enabled = document.getElementById('auto-create-tasks').checked;
        localStorage.setItem('healthCheckAutoCreateTasks', enabled);
        this.showNotification(`Auto task creation ${enabled ? 'enabled' : 'disabled'}`, 'info');
    }

    updateAutoCreateReminders() {
        const enabled = document.getElementById('auto-create-reminders').checked;
        localStorage.setItem('healthCheckAutoCreateReminders', enabled);
        this.showNotification(`Auto reminder creation ${enabled ? 'enabled' : 'disabled'}`, 'info');
    }

    // ============ NOTIFICATIONS ============
    createNotificationsFromResults(results) {
        const notificationLevel = localStorage.getItem('healthCheckNotificationLevel') || 'high';
        const severityOrder = ['critical', 'high', 'medium', 'low', 'info'];
        const levelIndex = severityOrder.indexOf(notificationLevel);
        
        for (const [categoryId, category] of Object.entries(results.categories)) {
            category.issues.forEach(issue => {
                const issueIndex = severityOrder.indexOf(issue.severity.toLowerCase());
                if (issueIndex <= levelIndex) {
                    this.addNotification({
                        title: `${this.healthCheck.severityLevels[issue.severity].icon} ${issue.description}`,
                        message: `Found ${issue.count} issues in ${category.name}`,
                        severity: issue.severity,
                        timestamp: new Date().toISOString(),
                        category: categoryId
                    });
                }
            });
        }
    }

    addNotification(notification) {
        const notificationsList = document.getElementById('notifications-list');
        if (!notificationsList) return;

        // Remove "no notifications" message
        const noNotifications = notificationsList.querySelector('.no-notifications');
        if (noNotifications) {
            noNotifications.remove();
        }

        const notificationElement = document.createElement('div');
        notificationElement.className = `notification ${notification.severity.toLowerCase()}`;
        notificationElement.innerHTML = `
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${new Date(notification.timestamp).toLocaleString()}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        notificationsList.insertBefore(notificationElement, notificationsList.firstChild);
    }

    clearAllNotifications() {
        const notificationsList = document.getElementById('notifications-list');
        if (notificationsList) {
            notificationsList.innerHTML = '<div class="no-notifications">No notifications</div>';
        }
        this.showNotification('All notifications cleared', 'info');
    }

    // ============ UTILITY METHODS ============
    showLoadingState() {
        const summaries = document.querySelectorAll('.health-check-summary');
        summaries.forEach(summary => {
            summary.innerHTML = '<div class="loading">🔄 Running health check...</div>';
        });
    }

    hideLoadingState() {
        // Loading states will be replaced by actual results
    }

    showNotification(message, type = 'info') {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    formatIssueDetailsForUI(details) {
        if (!Array.isArray(details) || details.length === 0) {
            return '<em>No specific details available</em>';
        }

        return details.slice(0, 5).map(detail => {
            if (typeof detail === 'string') return `<div class="detail-item">${detail}</div>`;
            
            if (detail.name && detail.earTag) {
                return `<div class="detail-item">🐐 ${detail.name} (${detail.earTag})</div>`;
            } else if (detail.id && detail.description) {
                return `<div class="detail-item">📋 ${detail.description}</div>`;
            } else {
                return `<div class="detail-item">${JSON.stringify(detail)}</div>`;
            }
        }).join('') + (details.length > 5 ? `<div class="detail-more">... and ${details.length - 5} more</div>` : '');
    }

    shouldRunAutoCheck() {
        const lastCheck = this.healthCheck.lastHealthCheck;
        if (!lastCheck) return true;
        
        const lastCheckTime = new Date(lastCheck.timestamp);
        const now = new Date();
        const hoursSinceLastCheck = (now - lastCheckTime) / (1000 * 60 * 60);
        
        return hoursSinceLastCheck >= 1; // Run if more than 1 hour since last check
    }

    // ============ CLEANUP ============
    destroy() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
        
        // Remove event listeners
        document.removeEventListener('farmDataUpdated', this.updateHealthStatus);
        document.removeEventListener('healthCheckCompleted', this.handleHealthCheckCompleted);
    }
}

// Initialize when both farm manager and health check system are ready
if (typeof window !== 'undefined') {
    window.HealthCheckUIIntegration = HealthCheckUIIntegration;
    
    // Auto-initialize when both systems are available
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (window.farmRecordsManager && window.healthCheckSystem) {
                window.healthCheckUI = new HealthCheckUIIntegration(
                    window.farmRecordsManager, 
                    window.healthCheckSystem
                );
                console.log('🔗 Health Check UI Integration initialized');
                
                // Run initial health check
                window.healthCheckUI.runQuickCheck();
            }
        }, 1000);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HealthCheckUIIntegration;
}
