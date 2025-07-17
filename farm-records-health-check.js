// Farm Records Health Check System
// Comprehensive validation, reporting, and integration system

class FarmRecordsHealthCheck {
    constructor(farmRecordsManager) {
        this.farmManager = farmRecordsManager;
        this.validationRules = new Map();
        this.reportQueue = [];
        this.notifications = [];
        this.lastHealthCheck = null;
        this.autoCheckInterval = null;
        this.severityLevels = {
            CRITICAL: { level: 0, color: '#dc3545', icon: '🚨' },
            HIGH: { level: 1, color: '#fd7e14', icon: '⚠️' },
            MEDIUM: { level: 2, color: '#ffc107', icon: '⚡' },
            LOW: { level: 3, color: '#28a745', icon: 'ℹ️' },
            INFO: { level: 4, color: '#17a2b8', icon: '📋' }
        };
        
        this.init();
    }

    init() {
        this.setupValidationRules();
        this.setupEventListeners();
        this.loadLastHealthCheck();
        this.startAutoHealthCheck();
    }

    // ============ VALIDATION RULES SETUP ============
    setupValidationRules() {
        // Goat Records Validation
        this.addValidationRule('goats', 'missing_required_fields', {
            description: 'Goats missing required fields',
            severity: 'HIGH',
            check: (goats) => {
                const required = ['name', 'earTag', 'breed', 'gender', 'dateOfBirth'];
                return goats.filter(goat => 
                    required.some(field => !goat[field] || goat[field].trim() === '')
                ).map(goat => ({
                    id: goat.id,
                    name: goat.name || 'Unnamed',
                    earTag: goat.earTag,
                    missing: required.filter(field => !goat[field] || goat[field].trim() === '')
                }));
            }
        });

        this.addValidationRule('goats', 'duplicate_ear_tags', {
            description: 'Duplicate ear tags detected',
            severity: 'CRITICAL',
            check: (goats) => {
                const tagCounts = {};
                const duplicates = [];
                
                goats.forEach(goat => {
                    if (goat.earTag) {
                        tagCounts[goat.earTag] = (tagCounts[goat.earTag] || 0) + 1;
                    }
                });
                
                Object.entries(tagCounts).forEach(([tag, count]) => {
                    if (count > 1) {
                        duplicates.push({
                            earTag: tag,
                            count: count,
                            goats: goats.filter(g => g.earTag === tag).map(g => ({
                                id: g.id,
                                name: g.name
                            }))
                        });
                    }
                });
                
                return duplicates;
            }
        });

        this.addValidationRule('goats', 'age_validation', {
            description: 'Invalid age calculations',
            severity: 'MEDIUM',
            check: (goats) => {
                const today = new Date();
                return goats.filter(goat => {
                    if (!goat.dateOfBirth) return false;
                    
                    const birthDate = new Date(goat.dateOfBirth);
                    const ageDays = (today - birthDate) / (1000 * 60 * 60 * 24);
                    
                    return ageDays < 0 || ageDays > (20 * 365); // Future date or over 20 years
                }).map(goat => ({
                    id: goat.id,
                    name: goat.name,
                    earTag: goat.earTag,
                    dateOfBirth: goat.dateOfBirth,
                    issue: new Date(goat.dateOfBirth) > today ? 'Future birth date' : 'Unrealistic age (>20 years)'
                }));
            }
        });

        // Health Records Validation
        this.addValidationRule('health', 'missing_recent_checkups', {
            description: 'Goats missing recent health checkups',
            severity: 'HIGH',
            check: (healthRecords, goats) => {
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                
                const recentCheckups = new Set();
                healthRecords.forEach(record => {
                    if (new Date(record.date) > sixMonthsAgo) {
                        recentCheckups.add(record.goatId);
                    }
                });
                
                return goats.filter(goat => !recentCheckups.has(goat.id))
                    .map(goat => ({
                        id: goat.id,
                        name: goat.name,
                        earTag: goat.earTag,
                        lastCheckup: this.getLastHealthRecord(goat.id, healthRecords)
                    }));
            }
        });

        this.addValidationRule('health', 'expired_treatments', {
            description: 'Treatments with expired follow-up dates',
            severity: 'CRITICAL',
            check: (healthRecords) => {
                const today = new Date();
                return healthRecords.filter(record => 
                    record.followUpDate && new Date(record.followUpDate) < today
                ).map(record => ({
                    id: record.id,
                    goatId: record.goatId,
                    treatment: record.treatment,
                    followUpDate: record.followUpDate,
                    daysOverdue: Math.floor((today - new Date(record.followUpDate)) / (1000 * 60 * 60 * 24))
                }));
            }
        });

        // Breeding Records Validation
        this.addValidationRule('breeding', 'pregnancy_tracking', {
            description: 'Pregnancies missing expected kidding dates',
            severity: 'HIGH',
            check: (breedingRecords) => {
                const today = new Date();
                return breedingRecords.filter(record => {
                    if (record.status !== 'pregnant' || !record.breedingDate) return false;
                    
                    const breedingDate = new Date(record.breedingDate);
                    const expectedKidding = new Date(breedingDate);
                    expectedKidding.setDate(expectedKidding.getDate() + 150); // ~5 months gestation
                    
                    return expectedKidding < today && !record.kiddingDate;
                }).map(record => ({
                    id: record.id,
                    doe: record.doe,
                    breedingDate: record.breedingDate,
                    expectedKidding: new Date(new Date(record.breedingDate).getTime() + (150 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
                    daysOverdue: Math.floor((today - new Date(new Date(record.breedingDate).getTime() + (150 * 24 * 60 * 60 * 1000))) / (1000 * 60 * 60 * 24))
                }));
            }
        });

        // Financial Records Validation
        this.addValidationRule('financial', 'missing_receipts', {
            description: 'Transactions missing receipt documentation',
            severity: 'MEDIUM',
            check: (transactions) => {
                return transactions.filter(transaction => 
                    transaction.amount > 1000 && !transaction.receipt && !transaction.documentation
                ).map(transaction => ({
                    id: transaction.id,
                    description: transaction.description,
                    amount: transaction.amount,
                    date: transaction.date,
                    category: transaction.category
                }));
            }
        });

        // Feed Records Validation
        this.addValidationRule('feed', 'irregular_feeding', {
            description: 'Irregular feeding patterns detected',
            severity: 'MEDIUM',
            check: (feedRecords) => {
                const feedingGaps = [];
                const sortedRecords = feedRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
                
                for (let i = 1; i < sortedRecords.length; i++) {
                    const current = new Date(sortedRecords[i].date);
                    const previous = new Date(sortedRecords[i-1].date);
                    const daysDiff = (current - previous) / (1000 * 60 * 60 * 24);
                    
                    if (daysDiff > 3) { // Gap of more than 3 days
                        feedingGaps.push({
                            startDate: sortedRecords[i-1].date,
                            endDate: sortedRecords[i].date,
                            gapDays: Math.floor(daysDiff),
                            feedType: sortedRecords[i].feedType
                        });
                    }
                }
                
                return feedingGaps;
            }
        });

        // Data Integrity Validation
        this.addValidationRule('integrity', 'orphaned_records', {
            description: 'Records referencing non-existent goats',
            severity: 'HIGH',
            check: (allData) => {
                const { goats, healthRecords, breedingRecords, feedRecords } = allData;
                const goatIds = new Set(goats.map(g => g.id));
                const orphans = [];
                
                // Check health records
                healthRecords.forEach(record => {
                    if (!goatIds.has(record.goatId)) {
                        orphans.push({
                            type: 'Health Record',
                            id: record.id,
                            goatId: record.goatId,
                            description: record.treatment || 'Health record'
                        });
                    }
                });
                
                // Check breeding records
                breedingRecords.forEach(record => {
                    if (!goatIds.has(record.doeId)) {
                        orphans.push({
                            type: 'Breeding Record',
                            id: record.id,
                            goatId: record.doeId,
                            description: `Breeding with ${record.buck}`
                        });
                    }
                });
                
                return orphans;
            }
        });
    }

    addValidationRule(category, ruleName, rule) {
        if (!this.validationRules.has(category)) {
            this.validationRules.set(category, new Map());
        }
        this.validationRules.get(category).set(ruleName, rule);
    }

    // ============ HEALTH CHECK EXECUTION ============
    async runFullHealthCheck() {
        console.log('🔍 Starting comprehensive farm records health check...');
        
        const startTime = Date.now();
        const results = {
            timestamp: new Date().toISOString(),
            duration: 0,
            categories: {},
            summary: {
                totalIssues: 0,
                criticalIssues: 0,
                highIssues: 0,
                mediumIssues: 0,
                lowIssues: 0,
                infoIssues: 0
            },
            recommendations: []
        };

        // Get all farm data
        const farmData = {
            goats: this.farmManager.goats,
            healthRecords: this.farmManager.healthRecords,
            breedingRecords: this.farmManager.breedingRecords,
            feedRecords: this.farmManager.feedRecords,
            transactions: this.farmManager.transactions,
            sales: this.farmManager.sales,
            products: this.farmManager.products,
            contacts: this.farmManager.contacts
        };

        // Run validation rules
        for (const [category, rules] of this.validationRules) {
            results.categories[category] = {
                name: this.getCategoryDisplayName(category),
                issues: [],
                passed: 0,
                failed: 0
            };

            for (const [ruleName, rule] of rules) {
                try {
                    let ruleResults;
                    
                    // Pass appropriate data to each rule
                    switch (category) {
                        case 'goats':
                            ruleResults = rule.check(farmData.goats);
                            break;
                        case 'health':
                            ruleResults = rule.check(farmData.healthRecords, farmData.goats);
                            break;
                        case 'breeding':
                            ruleResults = rule.check(farmData.breedingRecords);
                            break;
                        case 'financial':
                            ruleResults = rule.check(farmData.transactions);
                            break;
                        case 'feed':
                            ruleResults = rule.check(farmData.feedRecords);
                            break;
                        case 'integrity':
                            ruleResults = rule.check(farmData);
                            break;
                        default:
                            ruleResults = rule.check(farmData);
                    }

                    if (ruleResults && ruleResults.length > 0) {
                        const issue = {
                            ruleName,
                            description: rule.description,
                            severity: rule.severity,
                            count: ruleResults.length,
                            details: ruleResults,
                            recommendations: this.generateRecommendations(ruleName, ruleResults)
                        };
                        
                        results.categories[category].issues.push(issue);
                        results.categories[category].failed++;
                        results.summary.totalIssues += ruleResults.length;
                        
                        // Count by severity
                        const severityKey = rule.severity.toLowerCase() + 'Issues';
                        if (results.summary.hasOwnProperty(severityKey)) {
                            results.summary[severityKey] += ruleResults.length;
                        }
                    } else {
                        results.categories[category].passed++;
                    }
                } catch (error) {
                    console.error(`Error running validation rule ${category}.${ruleName}:`, error);
                }
            }
        }

        // Generate overall recommendations
        results.recommendations = this.generateOverallRecommendations(results);
        
        results.duration = Date.now() - startTime;
        this.lastHealthCheck = results;
        this.saveHealthCheckResults(results);
        
        // Create notifications for critical issues
        this.createNotificationsFromResults(results);
        
        console.log(`✅ Health check completed in ${results.duration}ms`);
        console.log(`📊 Found ${results.summary.totalIssues} issues across ${Object.keys(results.categories).length} categories`);
        
        return results;
    }

    // ============ REPORTING FEATURES ============
    generateHealthCheckReport(results, format = 'html') {
        switch (format) {
            case 'html':
                return this.generateHTMLReport(results);
            case 'pdf':
                return this.generatePDFReport(results);
            case 'csv':
                return this.generateCSVReport(results);
            case 'json':
                return JSON.stringify(results, null, 2);
            default:
                return this.generateTextReport(results);
        }
    }

    generateHTMLReport(results) {
        const severityColors = {
            CRITICAL: '#dc3545',
            HIGH: '#fd7e14',
            MEDIUM: '#ffc107',
            LOW: '#28a745',
            INFO: '#17a2b8'
        };

        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Farm Records Health Check Report</title>
            <style>
                body { font-family: 'Montserrat', Arial, sans-serif; margin: 20px; background: #f8f9fa; }
                .header { background: var(--logo-green, #2E7D2E); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
                .summary-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
                .category { background: white; margin-bottom: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .category-header { background: #e9ecef; padding: 15px; font-weight: bold; }
                .issue { padding: 15px; border-bottom: 1px solid #dee2e6; }
                .issue:last-child { border-bottom: none; }
                .severity { display: inline-block; padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; font-weight: bold; }
                .details { margin-top: 10px; font-size: 14px; color: #6c757d; }
                .recommendations { background: #e7f3ff; padding: 15px; margin-top: 10px; border-radius: 4px; }
                .timestamp { text-align: right; color: #6c757d; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🏔️ Mountain Goat Farm - Health Check Report</h1>
                <div class="timestamp">Generated: ${new Date(results.timestamp).toLocaleString()}</div>
                <div>Duration: ${results.duration}ms | Total Issues: ${results.summary.totalIssues}</div>
            </div>

            <div class="summary">
                <div class="summary-card">
                    <h3 style="color: #dc3545;">🚨 Critical</h3>
                    <div style="font-size: 24px; font-weight: bold;">${results.summary.criticalIssues}</div>
                </div>
                <div class="summary-card">
                    <h3 style="color: #fd7e14;">⚠️ High</h3>
                    <div style="font-size: 24px; font-weight: bold;">${results.summary.highIssues}</div>
                </div>
                <div class="summary-card">
                    <h3 style="color: #ffc107;">⚡ Medium</h3>
                    <div style="font-size: 24px; font-weight: bold;">${results.summary.mediumIssues}</div>
                </div>
                <div class="summary-card">
                    <h3 style="color: #28a745;">ℹ️ Low</h3>
                    <div style="font-size: 24px; font-weight: bold;">${results.summary.lowIssues}</div>
                </div>
            </div>
        `;

        // Add categories
        for (const [categoryId, category] of Object.entries(results.categories)) {
            if (category.issues.length > 0) {
                html += `
                <div class="category">
                    <div class="category-header">
                        📋 ${category.name} (${category.issues.length} issues)
                    </div>
                `;

                category.issues.forEach(issue => {
                    html += `
                    <div class="issue">
                        <div>
                            <span class="severity" style="background-color: ${severityColors[issue.severity]}">
                                ${issue.severity}
                            </span>
                            <strong>${issue.description}</strong>
                            <span style="color: #6c757d;">(${issue.count} items)</span>
                        </div>
                        <div class="details">
                            ${this.formatIssueDetails(issue.details).substring(0, 200)}...
                        </div>
                        ${issue.recommendations.length > 0 ? `
                        <div class="recommendations">
                            <strong>💡 Recommendations:</strong>
                            <ul>
                                ${issue.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>
                    `;
                });

                html += `</div>`;
            }
        }

        // Add overall recommendations
        if (results.recommendations.length > 0) {
            html += `
            <div class="category">
                <div class="category-header">🎯 Overall Recommendations</div>
                <div class="issue">
                    <ul>
                        ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
            `;
        }

        html += `
        </body>
        </html>
        `;

        return html;
    }

    generateCSVReport(results) {
        let csv = 'Category,Issue Type,Severity,Count,Description\n';
        
        for (const [categoryId, category] of Object.entries(results.categories)) {
            category.issues.forEach(issue => {
                csv += `"${category.name}","${issue.description}","${issue.severity}",${issue.count},"${this.formatIssueDetails(issue.details).replace(/"/g, '""')}"\n`;
            });
        }
        
        return csv;
    }

    generateTextReport(results) {
        let report = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🏔️  MOUNTAIN GOAT FARM HEALTH CHECK REPORT                ║
║                           ${new Date(results.timestamp).toLocaleString()}                            ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 SUMMARY:
Total Issues: ${results.summary.totalIssues}
🚨 Critical: ${results.summary.criticalIssues}
⚠️  High: ${results.summary.highIssues}
⚡ Medium: ${results.summary.mediumIssues}
ℹ️  Low: ${results.summary.lowIssues}
Duration: ${results.duration}ms

`;

        for (const [categoryId, category] of Object.entries(results.categories)) {
            if (category.issues.length > 0) {
                report += `\n📋 ${category.name.toUpperCase()}\n`;
                report += '═'.repeat(50) + '\n';
                
                category.issues.forEach(issue => {
                    const icon = this.severityLevels[issue.severity]?.icon || '•';
                    report += `${icon} ${issue.severity}: ${issue.description} (${issue.count} items)\n`;
                    
                    if (issue.recommendations.length > 0) {
                        report += '   💡 Recommendations:\n';
                        issue.recommendations.forEach(rec => {
                            report += `      • ${rec}\n`;
                        });
                    }
                    report += '\n';
                });
            }
        }

        if (results.recommendations.length > 0) {
            report += '\n🎯 OVERALL RECOMMENDATIONS\n';
            report += '═'.repeat(50) + '\n';
            results.recommendations.forEach(rec => {
                report += `• ${rec}\n`;
            });
        }

        return report;
    }

    // ============ INTEGRATION FEATURES ============
    integrateWithTaskManager() {
        if (!this.lastHealthCheck) return;

        const tasks = [];
        
        for (const [categoryId, category] of Object.entries(this.lastHealthCheck.categories)) {
            category.issues.forEach(issue => {
                if (issue.severity === 'CRITICAL' || issue.severity === 'HIGH') {
                    issue.recommendations.forEach(recommendation => {
                        tasks.push({
                            id: Date.now() + Math.random(),
                            title: `Health Check: ${issue.description}`,
                            description: recommendation,
                            priority: issue.severity === 'CRITICAL' ? 'high' : 'medium',
                            dueDate: this.calculateTaskDueDate(issue.severity),
                            category: 'Health Check',
                            status: 'pending',
                            assignedTo: 'Farm Manager',
                            createdDate: new Date().toISOString(),
                            source: 'health-check'
                        });
                    });
                }
            });
        }

        // Add tasks to farm manager
        if (this.farmManager.tasks) {
            tasks.forEach(task => {
                this.farmManager.tasks.push(task);
            });
            this.farmManager.saveTasks();
        }

        return tasks;
    }

    integrateWithReminders() {
        if (!this.lastHealthCheck) return;

        const reminders = [];
        
        // Create reminders for critical issues
        for (const [categoryId, category] of Object.entries(this.lastHealthCheck.categories)) {
            category.issues.forEach(issue => {
                if (issue.severity === 'CRITICAL') {
                    reminders.push({
                        id: Date.now() + Math.random(),
                        title: `🚨 Critical Issue: ${issue.description}`,
                        description: `Health check found ${issue.count} critical issues that need immediate attention.`,
                        date: new Date().toISOString().split('T')[0],
                        time: '08:00',
                        type: 'health-check',
                        recurring: false,
                        completed: false,
                        priority: 'high',
                        source: 'health-check'
                    });
                }
            });
        }

        // Add reminders to farm manager
        if (this.farmManager.reminders) {
            reminders.forEach(reminder => {
                this.farmManager.reminders.push(reminder);
            });
            this.farmManager.saveReminders();
        }

        return reminders;
    }

    integrateWithNotifications() {
        if (!this.lastHealthCheck) return;

        const notifications = [];
        
        for (const [categoryId, category] of Object.entries(this.lastHealthCheck.categories)) {
            category.issues.forEach(issue => {
                notifications.push({
                    id: Date.now() + Math.random(),
                    title: `${this.severityLevels[issue.severity].icon} ${issue.description}`,
                    message: `Found ${issue.count} issues in ${category.name}`,
                    type: issue.severity.toLowerCase(),
                    timestamp: new Date().toISOString(),
                    read: false,
                    source: 'health-check',
                    action: {
                        label: 'View Details',
                        callback: () => this.showHealthCheckDetails(categoryId, issue)
                    }
                });
            });
        }

        this.notifications.push(...notifications);
        this.displayNotifications();
        
        return notifications;
    }

    // ============ AUTO HEALTH CHECK ============
    startAutoHealthCheck(intervalHours = 24) {
        if (this.autoCheckInterval) {
            clearInterval(this.autoCheckInterval);
        }

        this.autoCheckInterval = setInterval(() => {
            this.runFullHealthCheck().then(results => {
                console.log('🔄 Automatic health check completed');
                
                // Only notify for new critical issues
                const criticalIssues = this.getCriticalIssues(results);
                if (criticalIssues.length > 0) {
                    this.showNotification(
                        '🚨 Critical Issues Detected',
                        `Found ${criticalIssues.length} critical issues requiring immediate attention.`,
                        'error'
                    );
                }
            });
        }, intervalHours * 60 * 60 * 1000);
    }

    stopAutoHealthCheck() {
        if (this.autoCheckInterval) {
            clearInterval(this.autoCheckInterval);
            this.autoCheckInterval = null;
        }
    }

    // ============ UTILITY METHODS ============
    getCategoryDisplayName(category) {
        const names = {
            'goats': 'Goat Records',
            'health': 'Health Records',
            'breeding': 'Breeding Records',
            'financial': 'Financial Records',
            'feed': 'Feed Records',
            'integrity': 'Data Integrity'
        };
        return names[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    formatIssueDetails(details) {
        if (!Array.isArray(details)) return 'No details available';
        
        return details.map(detail => {
            if (typeof detail === 'string') return detail;
            
            // Format based on the structure of the detail object
            if (detail.name && detail.earTag) {
                return `${detail.name} (${detail.earTag})`;
            } else if (detail.id && detail.description) {
                return `ID: ${detail.id} - ${detail.description}`;
            } else {
                return JSON.stringify(detail, null, 2);
            }
        }).join(', ');
    }

    generateRecommendations(ruleName, results) {
        const recommendations = [];
        
        switch (ruleName) {
            case 'missing_required_fields':
                recommendations.push('Update goat records with missing information');
                recommendations.push('Implement data validation at entry point');
                break;
            case 'duplicate_ear_tags':
                recommendations.push('Assign unique ear tags to affected goats');
                recommendations.push('Implement ear tag validation system');
                break;
            case 'missing_recent_checkups':
                recommendations.push('Schedule health checkups for affected goats');
                recommendations.push('Set up automated health check reminders');
                break;
            case 'expired_treatments':
                recommendations.push('Schedule follow-up treatments immediately');
                recommendations.push('Review treatment protocols');
                break;
            case 'pregnancy_tracking':
                recommendations.push('Verify pregnancy status of overdue goats');
                recommendations.push('Update breeding records with outcomes');
                break;
            default:
                recommendations.push('Review and address identified issues');
        }
        
        return recommendations;
    }

    generateOverallRecommendations(results) {
        const recommendations = [];
        
        if (results.summary.criticalIssues > 0) {
            recommendations.push('🚨 Address all critical issues immediately to ensure farm compliance and animal welfare');
        }
        
        if (results.summary.highIssues > 5) {
            recommendations.push('📅 Create a prioritized action plan to resolve high-priority issues within 1 week');
        }
        
        if (results.summary.totalIssues > 20) {
            recommendations.push('📊 Consider implementing automated data validation to prevent future issues');
        }
        
        recommendations.push('🔄 Run health checks weekly to maintain data quality');
        recommendations.push('📋 Train staff on proper record-keeping procedures');
        
        return recommendations;
    }

    calculateTaskDueDate(severity) {
        const today = new Date();
        let daysToAdd = 7; // Default: 1 week
        
        switch (severity) {
            case 'CRITICAL':
                daysToAdd = 1; // Tomorrow
                break;
            case 'HIGH':
                daysToAdd = 3; // 3 days
                break;
            case 'MEDIUM':
                daysToAdd = 7; // 1 week
                break;
            default:
                daysToAdd = 14; // 2 weeks
        }
        
        today.setDate(today.getDate() + daysToAdd);
        return today.toISOString().split('T')[0];
    }

    getCriticalIssues(results) {
        const critical = [];
        for (const [categoryId, category] of Object.entries(results.categories)) {
            category.issues.forEach(issue => {
                if (issue.severity === 'CRITICAL') {
                    critical.push({ category: categoryId, issue });
                }
            });
        }
        return critical;
    }

    getLastHealthRecord(goatId, healthRecords) {
        const goatRecords = healthRecords.filter(record => record.goatId === goatId);
        if (goatRecords.length === 0) return 'Never';
        
        const latest = goatRecords.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        return latest.date;
    }

    saveHealthCheckResults(results) {
        localStorage.setItem('farmHealthCheckResults', JSON.stringify(results));
        localStorage.setItem('farmHealthCheckHistory', JSON.stringify(
            this.getHealthCheckHistory().concat([{
                timestamp: results.timestamp,
                summary: results.summary,
                duration: results.duration
            }])
        ));
    }

    loadLastHealthCheck() {
        const saved = localStorage.getItem('farmHealthCheckResults');
        if (saved) {
            this.lastHealthCheck = JSON.parse(saved);
        }
    }

    getHealthCheckHistory() {
        return JSON.parse(localStorage.getItem('farmHealthCheckHistory') || '[]');
    }

    createNotificationsFromResults(results) {
        // Implementation depends on existing notification system
        console.log('Creating notifications for health check results...');
    }

    displayNotifications() {
        // Implementation depends on existing notification system
        console.log(`Displaying ${this.notifications.length} notifications...`);
    }

    showNotification(title, message, type = 'info') {
        // Implementation depends on existing notification system
        console.log(`${type.toUpperCase()}: ${title} - ${message}`);
    }

    showHealthCheckDetails(categoryId, issue) {
        // Implementation depends on existing UI system
        console.log(`Showing details for ${categoryId}: ${issue.description}`);
    }

    setupEventListeners() {
        // Add event listeners for integration with existing UI
        document.addEventListener('farmDataUpdated', () => {
            // Run health check when farm data is updated
            setTimeout(() => this.runFullHealthCheck(), 1000);
        });
    }

    // ============ PUBLIC API METHODS ============
    async runQuickCheck() {
        return await this.runFullHealthCheck();
    }

    exportReport(format = 'html') {
        if (!this.lastHealthCheck) {
            throw new Error('No health check results available. Run a health check first.');
        }
        return this.generateHealthCheckReport(this.lastHealthCheck, format);
    }

    getSystemStatus() {
        return {
            lastCheck: this.lastHealthCheck?.timestamp,
            autoCheckEnabled: !!this.autoCheckInterval,
            totalRules: Array.from(this.validationRules.values()).reduce((sum, rules) => sum + rules.size, 0),
            notifications: this.notifications.length,
            integrations: {
                tasks: !!this.farmManager.tasks,
                reminders: !!this.farmManager.reminders
            }
        };
    }

    addCustomValidationRule(category, ruleName, rule) {
        this.addValidationRule(category, ruleName, rule);
        console.log(`✅ Added custom validation rule: ${category}.${ruleName}`);
    }

    removeValidationRule(category, ruleName) {
        if (this.validationRules.has(category)) {
            this.validationRules.get(category).delete(ruleName);
            console.log(`🗑️ Removed validation rule: ${category}.${ruleName}`);
        }
    }
}

// Initialize health check system when farm records manager is available
if (typeof window !== 'undefined') {
    window.FarmRecordsHealthCheck = FarmRecordsHealthCheck;
    
    // Auto-initialize when farm manager is ready
    document.addEventListener('DOMContentLoaded', () => {
        if (window.farmRecordsManager) {
            window.healthCheckSystem = new FarmRecordsHealthCheck(window.farmRecordsManager);
            console.log('🏔️ Farm Records Health Check System initialized');
        }
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FarmRecordsHealthCheck;
}
