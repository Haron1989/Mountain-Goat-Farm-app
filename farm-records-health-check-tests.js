// Farm Records Health Check Test Suite
// Comprehensive testing for validation rules, reporting, and integration

class HealthCheckTestSuite {
    constructor() {
        this.testResults = [];
        this.mockData = this.generateMockData();
        this.healthCheck = null;
    }

    // Generate comprehensive mock data for testing
    generateMockData() {
        return {
            farmManager: {
                goats: [
                    {
                        id: '1',
                        name: 'Bella',
                        earTag: 'GT001',
                        breed: 'Boer',
                        gender: 'Female',
                        dateOfBirth: '2022-03-15'
                    },
                    {
                        id: '2',
                        name: 'Charlie',
                        earTag: 'GT002',
                        breed: 'Nubian',
                        gender: 'Male',
                        dateOfBirth: '2021-08-20'
                    },
                    {
                        id: '3',
                        name: '', // Missing name - should trigger validation
                        earTag: 'GT001', // Duplicate ear tag - should trigger validation
                        breed: 'Boer',
                        gender: 'Female',
                        dateOfBirth: '2030-01-01' // Future date - should trigger validation
                    },
                    {
                        id: '4',
                        name: 'Old Goat',
                        earTag: 'GT004',
                        breed: 'Mixed',
                        gender: 'Male',
                        dateOfBirth: '2000-01-01' // Very old - should trigger validation
                    }
                ],
                healthRecords: [
                    {
                        id: 'h1',
                        goatId: '1',
                        date: '2025-01-15',
                        treatment: 'Vaccination',
                        veterinarian: 'Dr. Smith',
                        followUpDate: null
                    },
                    {
                        id: 'h2',
                        goatId: '2',
                        date: '2024-06-01', // Old record - should trigger missing checkup
                        treatment: 'Deworming',
                        veterinarian: 'Dr. Johnson',
                        followUpDate: '2025-06-01' // Expired follow-up
                    },
                    {
                        id: 'h3',
                        goatId: '999', // Orphaned record - should trigger integrity check
                        date: '2025-07-01',
                        treatment: 'Health Check',
                        veterinarian: 'Dr. Brown'
                    }
                ],
                breedingRecords: [
                    {
                        id: 'b1',
                        doeId: '1',
                        doe: 'Bella',
                        buck: 'Champion',
                        breedingDate: '2024-12-01',
                        status: 'pregnant',
                        kiddingDate: null // Should be overdue
                    },
                    {
                        id: 'b2',
                        doeId: '999', // Orphaned record
                        doe: 'NonExistent',
                        buck: 'Charlie',
                        breedingDate: '2025-06-01',
                        status: 'bred'
                    }
                ],
                feedRecords: [
                    {
                        id: 'f1',
                        date: '2025-07-01',
                        feedType: 'Hay',
                        quantity: 50,
                        cost: 2000
                    },
                    {
                        id: 'f2',
                        date: '2025-07-10', // 9-day gap - should trigger irregular feeding
                        feedType: 'Pellets',
                        quantity: 25,
                        cost: 1500
                    }
                ],
                transactions: [
                    {
                        id: 't1',
                        description: 'Feed Purchase',
                        amount: 5000,
                        date: '2025-07-01',
                        category: 'Expense',
                        receipt: true
                    },
                    {
                        id: 't2',
                        description: 'Veterinary Services',
                        amount: 15000, // Large amount without receipt
                        date: '2025-07-05',
                        category: 'Expense',
                        receipt: false,
                        documentation: false
                    }
                ],
                sales: [],
                products: [],
                contacts: []
            }
        };
    }

    // Initialize health check system with mock data
    initializeHealthCheck() {
        // Create a mock farm manager
        const mockFarmManager = this.mockData.farmManager;
        mockFarmManager.tasks = [];
        mockFarmManager.reminders = [];
        mockFarmManager.saveTasks = () => console.log('Tasks saved');
        mockFarmManager.saveReminders = () => console.log('Reminders saved');

        this.healthCheck = new FarmRecordsHealthCheck(mockFarmManager);
        return this.healthCheck;
    }

    // Run all tests
    async runAllTests() {
        console.log('🧪 Starting Farm Records Health Check Test Suite...\n');
        
        try {
            // Initialize health check system
            this.initializeHealthCheck();

            // Test validation rules
            await this.testValidationRules();
            
            // Test health check execution
            await this.testHealthCheckExecution();
            
            // Test reporting features
            await this.testReportingFeatures();
            
            // Test integration features
            await this.testIntegrationFeatures();
            
            // Test auto health check
            await this.testAutoHealthCheck();
            
            // Test custom validation rules
            await this.testCustomValidationRules();

            // Display results
            this.displayTestResults();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    // Test individual validation rules
    async testValidationRules() {
        console.log('📋 Testing Validation Rules...');

        const tests = [
            {
                name: 'Missing Required Fields Detection',
                test: () => {
                    const rule = this.healthCheck.validationRules.get('goats').get('missing_required_fields');
                    const results = rule.check(this.mockData.farmManager.goats);
                    return results.length === 1 && results[0].id === '3';
                }
            },
            {
                name: 'Duplicate Ear Tags Detection',
                test: () => {
                    const rule = this.healthCheck.validationRules.get('goats').get('duplicate_ear_tags');
                    const results = rule.check(this.mockData.farmManager.goats);
                    return results.length === 1 && results[0].earTag === 'GT001';
                }
            },
            {
                name: 'Age Validation',
                test: () => {
                    const rule = this.healthCheck.validationRules.get('goats').get('age_validation');
                    const results = rule.check(this.mockData.farmManager.goats);
                    return results.length === 2; // Future date and very old goat
                }
            },
            {
                name: 'Missing Recent Checkups',
                test: () => {
                    const rule = this.healthCheck.validationRules.get('health').get('missing_recent_checkups');
                    const results = rule.check(
                        this.mockData.farmManager.healthRecords, 
                        this.mockData.farmManager.goats
                    );
                    return results.length >= 2; // At least Charlie and Old Goat missing recent checkups
                }
            },
            {
                name: 'Expired Treatments',
                test: () => {
                    const rule = this.healthCheck.validationRules.get('health').get('expired_treatments');
                    const results = rule.check(this.mockData.farmManager.healthRecords);
                    return results.length === 1 && results[0].goatId === '2';
                }
            },
            {
                name: 'Pregnancy Tracking',
                test: () => {
                    const rule = this.healthCheck.validationRules.get('breeding').get('pregnancy_tracking');
                    const results = rule.check(this.mockData.farmManager.breedingRecords);
                    return results.length === 1 && results[0].doe === 'Bella';
                }
            },
            {
                name: 'Missing Receipts',
                test: () => {
                    const rule = this.healthCheck.validationRules.get('financial').get('missing_receipts');
                    const results = rule.check(this.mockData.farmManager.transactions);
                    return results.length === 1 && results[0].amount === 15000;
                }
            },
            {
                name: 'Irregular Feeding',
                test: () => {
                    const rule = this.healthCheck.validationRules.get('feed').get('irregular_feeding');
                    const results = rule.check(this.mockData.farmManager.feedRecords);
                    return results.length === 1 && results[0].gapDays === 9;
                }
            },
            {
                name: 'Orphaned Records',
                test: () => {
                    const rule = this.healthCheck.validationRules.get('integrity').get('orphaned_records');
                    const results = rule.check(this.mockData.farmManager);
                    return results.length === 2; // One health record and one breeding record
                }
            }
        ];

        for (const testCase of tests) {
            try {
                const passed = testCase.test();
                this.addTestResult(testCase.name, passed, passed ? null : 'Test condition not met');
            } catch (error) {
                this.addTestResult(testCase.name, false, error.message);
            }
        }
    }

    // Test health check execution
    async testHealthCheckExecution() {
        console.log('⚡ Testing Health Check Execution...');

        const tests = [
            {
                name: 'Full Health Check Execution',
                test: async () => {
                    const results = await this.healthCheck.runFullHealthCheck();
                    return results && 
                           results.timestamp && 
                           results.categories && 
                           results.summary && 
                           results.summary.totalIssues > 0;
                }
            },
            {
                name: 'Health Check Results Structure',
                test: async () => {
                    const results = await this.healthCheck.runFullHealthCheck();
                    const requiredKeys = ['timestamp', 'duration', 'categories', 'summary', 'recommendations'];
                    return requiredKeys.every(key => results.hasOwnProperty(key));
                }
            },
            {
                name: 'Summary Calculations',
                test: async () => {
                    const results = await this.healthCheck.runFullHealthCheck();
                    const totalCalculated = results.summary.criticalIssues + 
                                          results.summary.highIssues + 
                                          results.summary.mediumIssues + 
                                          results.summary.lowIssues + 
                                          results.summary.infoIssues;
                    return results.summary.totalIssues === totalCalculated;
                }
            }
        ];

        for (const testCase of tests) {
            try {
                const passed = await testCase.test();
                this.addTestResult(testCase.name, passed, passed ? null : 'Test condition not met');
            } catch (error) {
                this.addTestResult(testCase.name, false, error.message);
            }
        }
    }

    // Test reporting features
    async testReportingFeatures() {
        console.log('📊 Testing Reporting Features...');

        // Ensure we have health check results
        if (!this.healthCheck.lastHealthCheck) {
            await this.healthCheck.runFullHealthCheck();
        }

        const tests = [
            {
                name: 'HTML Report Generation',
                test: () => {
                    const htmlReport = this.healthCheck.generateHTMLReport(this.healthCheck.lastHealthCheck);
                    return htmlReport.includes('<!DOCTYPE html>') && 
                           htmlReport.includes('Mountain Goat Farm') &&
                           htmlReport.includes('Health Check Report');
                }
            },
            {
                name: 'CSV Report Generation',
                test: () => {
                    const csvReport = this.healthCheck.generateCSVReport(this.healthCheck.lastHealthCheck);
                    return csvReport.includes('Category,Issue Type,Severity,Count,Description') &&
                           csvReport.split('\n').length > 1;
                }
            },
            {
                name: 'Text Report Generation',
                test: () => {
                    const textReport = this.healthCheck.generateTextReport(this.healthCheck.lastHealthCheck);
                    return textReport.includes('MOUNTAIN GOAT FARM HEALTH CHECK REPORT') &&
                           textReport.includes('SUMMARY:');
                }
            },
            {
                name: 'Export Report Function',
                test: () => {
                    try {
                        const htmlExport = this.healthCheck.exportReport('html');
                        const csvExport = this.healthCheck.exportReport('csv');
                        const textExport = this.healthCheck.exportReport('text');
                        return htmlExport.includes('<!DOCTYPE html>') &&
                               csvExport.includes('Category,Issue Type') &&
                               textExport.includes('MOUNTAIN GOAT FARM');
                    } catch (error) {
                        return false;
                    }
                }
            }
        ];

        for (const testCase of tests) {
            try {
                const passed = testCase.test();
                this.addTestResult(testCase.name, passed, passed ? null : 'Test condition not met');
            } catch (error) {
                this.addTestResult(testCase.name, false, error.message);
            }
        }
    }

    // Test integration features
    async testIntegrationFeatures() {
        console.log('🔗 Testing Integration Features...');

        // Ensure we have health check results
        if (!this.healthCheck.lastHealthCheck) {
            await this.healthCheck.runFullHealthCheck();
        }

        const tests = [
            {
                name: 'Task Manager Integration',
                test: () => {
                    const initialTaskCount = this.healthCheck.farmManager.tasks.length;
                    const generatedTasks = this.healthCheck.integrateWithTaskManager();
                    return Array.isArray(generatedTasks) && 
                           generatedTasks.length > 0 &&
                           this.healthCheck.farmManager.tasks.length > initialTaskCount;
                }
            },
            {
                name: 'Reminders Integration',
                test: () => {
                    const initialReminderCount = this.healthCheck.farmManager.reminders.length;
                    const generatedReminders = this.healthCheck.integrateWithReminders();
                    return Array.isArray(generatedReminders) && 
                           this.healthCheck.farmManager.reminders.length >= initialReminderCount;
                }
            },
            {
                name: 'Notifications Integration',
                test: () => {
                    const generatedNotifications = this.healthCheck.integrateWithNotifications();
                    return Array.isArray(generatedNotifications) && 
                           generatedNotifications.length > 0 &&
                           this.healthCheck.notifications.length > 0;
                }
            },
            {
                name: 'System Status Reporting',
                test: () => {
                    const status = this.healthCheck.getSystemStatus();
                    const requiredKeys = ['lastCheck', 'autoCheckEnabled', 'totalRules', 'notifications', 'integrations'];
                    return requiredKeys.every(key => status.hasOwnProperty(key)) &&
                           status.totalRules > 0;
                }
            }
        ];

        for (const testCase of tests) {
            try {
                const passed = testCase.test();
                this.addTestResult(testCase.name, passed, passed ? null : 'Test condition not met');
            } catch (error) {
                this.addTestResult(testCase.name, false, error.message);
            }
        }
    }

    // Test auto health check functionality
    async testAutoHealthCheck() {
        console.log('🔄 Testing Auto Health Check...');

        const tests = [
            {
                name: 'Start Auto Health Check',
                test: () => {
                    this.healthCheck.startAutoHealthCheck(0.001); // 0.001 hours = 3.6 seconds
                    return this.healthCheck.autoCheckInterval !== null;
                }
            },
            {
                name: 'Stop Auto Health Check',
                test: () => {
                    this.healthCheck.stopAutoHealthCheck();
                    return this.healthCheck.autoCheckInterval === null;
                }
            }
        ];

        for (const testCase of tests) {
            try {
                const passed = testCase.test();
                this.addTestResult(testCase.name, passed, passed ? null : 'Test condition not met');
            } catch (error) {
                this.addTestResult(testCase.name, false, error.message);
            }
        }
    }

    // Test custom validation rules
    async testCustomValidationRules() {
        console.log('🛠️ Testing Custom Validation Rules...');

        const tests = [
            {
                name: 'Add Custom Validation Rule',
                test: () => {
                    this.healthCheck.addCustomValidationRule('test', 'custom_rule', {
                        description: 'Test custom rule',
                        severity: 'LOW',
                        check: () => []
                    });
                    return this.healthCheck.validationRules.has('test') &&
                           this.healthCheck.validationRules.get('test').has('custom_rule');
                }
            },
            {
                name: 'Remove Validation Rule',
                test: () => {
                    this.healthCheck.removeValidationRule('test', 'custom_rule');
                    return !this.healthCheck.validationRules.get('test')?.has('custom_rule');
                }
            },
            {
                name: 'Custom Rule Execution',
                test: async () => {
                    // Add a custom rule that should find issues
                    this.healthCheck.addCustomValidationRule('test', 'always_fails', {
                        description: 'Always finds issues',
                        severity: 'INFO',
                        check: () => [{ issue: 'test issue' }]
                    });

                    const results = await this.healthCheck.runFullHealthCheck();
                    const testCategory = results.categories.test;
                    
                    return testCategory && 
                           testCategory.issues.length > 0 &&
                           testCategory.issues.some(issue => issue.description === 'Always finds issues');
                }
            }
        ];

        for (const testCase of tests) {
            try {
                const passed = await testCase.test();
                this.addTestResult(testCase.name, passed, passed ? null : 'Test condition not met');
            } catch (error) {
                this.addTestResult(testCase.name, false, error.message);
            }
        }
    }

    // Add test result
    addTestResult(testName, passed, error = null) {
        this.testResults.push({
            name: testName,
            passed,
            error,
            timestamp: new Date().toISOString()
        });
        
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${testName}${error ? `: ${error}` : ''}`);
    }

    // Display comprehensive test results
    displayTestResults() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        const successRate = ((passedTests / totalTests) * 100).toFixed(1);

        console.log('\n' + '='.repeat(80));
        console.log('🏔️ MOUNTAIN GOAT FARM HEALTH CHECK TEST RESULTS');
        console.log('='.repeat(80));
        console.log(`Total Tests: ${totalTests}`);
        console.log(`✅ Passed: ${passedTests}`);
        console.log(`❌ Failed: ${failedTests}`);
        console.log(`📊 Success Rate: ${successRate}%`);
        console.log('='.repeat(80));

        if (failedTests > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.testResults
                .filter(r => !r.passed)
                .forEach(result => {
                    console.log(`   • ${result.name}: ${result.error}`);
                });
        }

        console.log('\n📋 TEST CATEGORIES:');
        const categories = {
            'Validation': this.testResults.filter(r => r.name.includes('Detection') || r.name.includes('Validation')),
            'Execution': this.testResults.filter(r => r.name.includes('Execution') || r.name.includes('Results')),
            'Reporting': this.testResults.filter(r => r.name.includes('Report') || r.name.includes('Export')),
            'Integration': this.testResults.filter(r => r.name.includes('Integration') || r.name.includes('Status')),
            'Auto Check': this.testResults.filter(r => r.name.includes('Auto')),
            'Custom Rules': this.testResults.filter(r => r.name.includes('Custom'))
        };

        Object.entries(categories).forEach(([category, tests]) => {
            if (tests.length > 0) {
                const categoryPassed = tests.filter(t => t.passed).length;
                const categoryRate = ((categoryPassed / tests.length) * 100).toFixed(0);
                console.log(`   ${category}: ${categoryPassed}/${tests.length} (${categoryRate}%)`);
            }
        });

        if (successRate >= 90) {
            console.log('\n🎉 Excellent! Health Check System is working perfectly!');
        } else if (successRate >= 75) {
            console.log('\n👍 Good! Health Check System is mostly functional with minor issues.');
        } else {
            console.log('\n⚠️ Warning! Health Check System has significant issues that need attention.');
        }

        return {
            totalTests,
            passedTests,
            failedTests,
            successRate: parseFloat(successRate),
            results: this.testResults
        };
    }

    // Generate test report
    generateTestReport() {
        const summary = this.displayTestResults();
        
        return {
            summary,
            detailedResults: this.testResults,
            mockDataUsed: this.mockData,
            timestamp: new Date().toISOString()
        };
    }
}

// Auto-run tests when loaded in browser
if (typeof window !== 'undefined') {
    window.HealthCheckTestSuite = HealthCheckTestSuite;
    
    // Make available globally for manual testing
    window.runHealthCheckTests = async () => {
        const testSuite = new HealthCheckTestSuite();
        return await testSuite.runAllTests();
    };
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HealthCheckTestSuite;
}

// Console instructions
console.log(`
🧪 Farm Records Health Check Test Suite Loaded!

To run tests:
- In browser: runHealthCheckTests()
- In Node.js: const TestSuite = require('./farm-records-health-check-tests.js'); new TestSuite().runAllTests();

Test Categories:
📋 Validation Rules (9 tests)
⚡ Health Check Execution (3 tests) 
📊 Reporting Features (4 tests)
🔗 Integration Features (4 tests)
🔄 Auto Health Check (2 tests)
🛠️ Custom Validation Rules (3 tests)

Total: 25 comprehensive tests
`);
