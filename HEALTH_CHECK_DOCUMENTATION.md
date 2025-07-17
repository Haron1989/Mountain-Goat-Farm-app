# Farm Records Health Check System Documentation

## Overview

The Farm Records Health Check System is a comprehensive validation, reporting, and integration solution for the Mountain Goat Farm Management System. It automatically monitors farm data quality, identifies issues, generates actionable reports, and integrates seamlessly with existing farm management workflows.

## Features

### 🔍 Comprehensive Validation Engine
- **9+ Validation Categories** covering all aspects of farm data
- **Real-time Issue Detection** with severity classification
- **Intelligent Analysis** of data relationships and integrity
- **Customizable Rules** for farm-specific requirements

### 📊 Advanced Reporting System
- **HTML Reports** - Beautiful, professional reports with charts and summaries
- **CSV Exports** - Data-friendly format for analysis and external tools
- **Text Reports** - Human-readable documentation format
- **JSON Exports** - Machine-readable format for system integration

### 🔗 Deep Integration
- **Dashboard Widgets** showing real-time health status
- **Navigation Integration** with issue badges and indicators
- **Task Management** auto-creation for critical issues
- **Reminder System** integration for overdue items
- **Notification Center** with smart alerts

### ⚙️ Automation & Monitoring
- **Scheduled Health Checks** with configurable intervals
- **Background Monitoring** of data changes
- **Auto-remediation** suggestions and task creation
- **Historical Tracking** and trend analysis

## Installation

### 1. Include Required Files

Add to your HTML `<head>` section:
```html
<link rel="stylesheet" href="farm-records-health-check.css">
```

Add before closing `</body>` tag:
```html
<script src="farm-records-health-check.js"></script>
<script src="farm-records-health-check-ui.js"></script>
```

### 2. Initialize the System

The system will automatically initialize when your farm management system is ready:

```javascript
// Manual initialization (if needed)
if (window.farmRecordsManager) {
    window.healthCheckSystem = new FarmRecordsHealthCheck(window.farmRecordsManager);
    window.healthCheckUI = new HealthCheckUIIntegration(
        window.farmRecordsManager, 
        window.healthCheckSystem
    );
}
```

## Validation Rules

### Goat Records Validation

#### Missing Required Fields
- **Severity**: HIGH
- **Checks**: Name, ear tag, breed, gender, date of birth
- **Action**: Update goat records with missing information

#### Duplicate Ear Tags
- **Severity**: CRITICAL
- **Checks**: Unique ear tag assignments
- **Action**: Assign unique ear tags to affected goats

#### Age Validation
- **Severity**: MEDIUM
- **Checks**: Realistic age calculations (no future birth dates, max 20 years)
- **Action**: Verify and correct birth dates

### Health Records Validation

#### Missing Recent Checkups
- **Severity**: HIGH
- **Checks**: Health checkups within last 6 months
- **Action**: Schedule health checkups for affected goats

#### Expired Treatments
- **Severity**: CRITICAL
- **Checks**: Follow-up dates for treatments
- **Action**: Schedule follow-up treatments immediately

### Breeding Records Validation

#### Pregnancy Tracking
- **Severity**: HIGH
- **Checks**: Expected kidding dates (150-day gestation)
- **Action**: Verify pregnancy status and update records

### Financial Records Validation

#### Missing Receipts
- **Severity**: MEDIUM
- **Checks**: Documentation for transactions > 1000 KES
- **Action**: Collect and attach receipt documentation

### Feed Records Validation

#### Irregular Feeding
- **Severity**: MEDIUM
- **Checks**: Feeding gaps > 3 days
- **Action**: Review feeding schedule and consistency

### Data Integrity Validation

#### Orphaned Records
- **Severity**: HIGH
- **Checks**: Records referencing non-existent goats
- **Action**: Clean up orphaned records or restore missing data

## Using the System

### Running Health Checks

#### Quick Health Check
```javascript
// From browser console or code
healthCheckUI.runQuickCheck();
```

#### Full Health Check with Results
```javascript
const results = await healthCheckSystem.runFullHealthCheck();
console.log(results);
```

#### Scheduled Auto Checks
```javascript
// Enable auto checks every 24 hours
healthCheckSystem.startAutoHealthCheck(24);

// Disable auto checks
healthCheckSystem.stopAutoHealthCheck();
```

### Viewing Results

#### Dashboard Widget
- Automatic display on main dashboard
- Real-time status updates
- Quick action buttons for reports and exports

#### Detailed Health Check Page
- Navigate via "Health Check" in main menu
- Comprehensive issue breakdown by category
- Historical trend analysis
- Settings configuration

#### Notifications
- Real-time alerts for critical issues
- Notification center with issue history
- Configurable severity levels

### Generating Reports

#### Export Options
```javascript
// HTML Report (default)
healthCheckUI.exportReport('html');

// CSV Data Export
healthCheckUI.exportReport('csv');

// Text Report
healthCheckUI.exportReport('text');

// JSON Export
healthCheckUI.exportReport('json');
```

#### Report Content
- **Executive Summary** with issue counts by severity
- **Category Breakdown** with detailed issue lists
- **Recommendations** for each issue type
- **Historical Trends** and comparison data
- **Action Items** with priority and due dates

### Integration Features

#### Task Management Integration
```javascript
// Auto-create tasks for critical issues
const tasks = healthCheckSystem.integrateWithTaskManager();
```

#### Reminder System Integration
```javascript
// Auto-create reminders for overdue items
const reminders = healthCheckSystem.integrateWithReminders();
```

#### Notification Integration
```javascript
// Create notifications from health check results
const notifications = healthCheckSystem.integrateWithNotifications();
```

## Trusted External Vet/Advisor Access

### Overview

Allow remote veterinarians, consultants, or inspectors to access farm records and health check reports with temporary, auto-expiring permissions. All access is logged for audit and compliance.

### How It Works
- Farm owner generates a secure access token for the external user.
- Token grants read-only access to farm records and health check reports.
- Permissions automatically expire after a set duration (e.g., 1 hour, 1 day).
- All access and actions are logged for audit purposes.
- Tokens can be manually revoked at any time.

### Usage Example

```javascript
// Initialize external access manager
const externalAccess = new ExternalAccessManager(window.farmRecordsManager);

// Create a token for a vet (valid for 2 hours)
const token = externalAccess.createAccessToken('Dr. Vet', ['view'], 120);

// Vet accesses farm records (read-only)
const records = externalAccess.getExternalRecords(token);

// Vet accesses health check report (HTML format)
const report = externalAccess.getExternalReport(token, 'html');

// Revoke access manually if needed
externalAccess.revokeToken(token);

// View audit log
const log = externalAccess.getAccessLog();
```

### Security & Compliance
- Tokens are random and hard to guess.
- Permissions expire automatically; no persistent access.
- Only non-sensitive data is shared.
- All access is logged for compliance and review.
- Designed for remote audits, vet reviews, and regulatory inspections.

### Integration
- Add `external-access.js` to your project.
- Use the API to manage external access as needed.
- Works seamlessly with the health check system and reporting features.

## Customization

### Adding Custom Validation Rules

```javascript
healthCheckSystem.addCustomValidationRule('custom_category', 'rule_name', {
    description: 'Custom validation rule description',
    severity: 'HIGH', // CRITICAL, HIGH, MEDIUM, LOW, INFO
    check: (data) => {
        // Your validation logic here
        // Return array of issues found
        return [];
    }
});
```

### Configuring Settings

#### Auto Check Interval
- Access via Health Check page settings
- Options: Hourly, 6 Hours, Daily, Weekly
- Default: Daily (24 hours)

#### Notification Level
- Critical Only: Only critical issues trigger notifications
- High & Critical: High and critical issues
- Medium & Above: Medium, high, and critical issues
- All Issues: All severity levels

#### Auto-Integration
- **Auto-create Tasks**: Automatically create tasks for critical issues
- **Auto-create Reminders**: Automatically create reminders for overdue items

### Styling Customization

The health check system uses CSS custom properties that can be overridden:

```css
:root {
    --logo-green: #2E7D2E;
    --logo-brown: #8B4513;
    --logo-yellow: #FFD700;
    --logo-beige: #f5f2e8;
}
```

## API Reference

### FarmRecordsHealthCheck Class

#### Constructor
```javascript
new FarmRecordsHealthCheck(farmRecordsManager)
```

#### Methods

##### runFullHealthCheck()
```javascript
const results = await healthCheck.runFullHealthCheck();
```
Returns comprehensive health check results with categories, issues, and recommendations.

##### exportReport(format)
```javascript
const report = healthCheck.exportReport('html'); // 'html', 'csv', 'text', 'json'
```
Generates and returns a report in the specified format.

##### addCustomValidationRule(category, ruleName, rule)
```javascript
healthCheck.addCustomValidationRule('category', 'rule', {
    description: 'Rule description',
    severity: 'HIGH',
    check: (data) => []
});
```
Adds a custom validation rule to the system.

##### startAutoHealthCheck(intervalHours)
```javascript
healthCheck.startAutoHealthCheck(24); // Check every 24 hours
```
Starts automatic health checks at specified interval.

##### stopAutoHealthCheck()
```javascript
healthCheck.stopAutoHealthCheck();
```
Stops automatic health checks.

##### getSystemStatus()
```javascript
const status = healthCheck.getSystemStatus();
```
Returns current system status including last check time, enabled features, and statistics.

### HealthCheckUIIntegration Class

#### Constructor
```javascript
new HealthCheckUIIntegration(farmRecordsManager, healthCheckSystem)
```

#### Methods

##### showHealthCheckPage()
```javascript
healthCheckUI.showHealthCheckPage();
```
Navigates to the dedicated health check page.

##### runQuickCheck()
```javascript
await healthCheckUI.runQuickCheck();
```
Runs a health check and updates the UI with results.

##### exportReport(format)
```javascript
healthCheckUI.exportReport('html');
```
Exports and downloads a report in the specified format.

## Testing

### Running the Test Suite

#### Browser Console
```javascript
runHealthCheckTests();
```

#### Node.js Environment
```javascript
const TestSuite = require('./farm-records-health-check-tests.js');
const testSuite = new TestSuite();
await testSuite.runAllTests();
```

### Test Categories

1. **Validation Rules** (9 tests)
   - Missing required fields detection
   - Duplicate ear tags detection
   - Age validation
   - Health checkup tracking
   - Treatment follow-ups
   - Pregnancy tracking
   - Receipt documentation
   - Feeding patterns
   - Data integrity

2. **Health Check Execution** (3 tests)
   - Full health check execution
   - Results structure validation
   - Summary calculations

3. **Reporting Features** (4 tests)
   - HTML report generation
   - CSV export functionality
   - Text report creation
   - Export function testing

4. **Integration Features** (4 tests)
   - Task manager integration
   - Reminder system integration
   - Notification system integration
   - System status reporting

5. **Auto Health Check** (2 tests)
   - Auto check start/stop functionality
   - Scheduling validation

6. **Custom Validation Rules** (3 tests)
   - Adding custom rules
   - Removing rules
   - Custom rule execution

### Mock Data

The test suite includes comprehensive mock data covering:
- Sample goat records with various issues
- Health records with missing checkups and expired treatments
- Breeding records with overdue pregnancies
- Financial transactions with missing documentation
- Feed records with irregular patterns
- Orphaned records for integrity testing

## Troubleshooting

### Common Issues

#### Health Check Not Running
- Ensure farm records manager is initialized
- Check browser console for JavaScript errors
- Verify all required files are loaded

#### UI Not Displaying
- Check CSS file is properly linked
- Verify JavaScript files are loaded in correct order
- Ensure DOM is ready before initialization

#### Reports Not Exporting
- Check browser's download settings
- Verify localStorage permissions
- Ensure health check has been run before export

#### Auto Checks Not Working
- Verify auto check is enabled in settings
- Check browser tab remains active (required for intervals)
- Review notification permissions

### Debug Mode

Enable debug logging:
```javascript
localStorage.setItem('healthCheckDebug', 'true');
```

### Performance Optimization

For large datasets:
- Increase auto check interval
- Disable real-time notifications for low severity issues
- Use CSV exports for data analysis instead of HTML reports

## Support

For issues, suggestions, or contributions:
- Check the comprehensive test suite for examples
- Review the demo script for usage patterns
- Examine the CSS file for styling customization options
- Test with mock data before implementing with real farm data

## License

This health check system is part of the Mountain Goat Farm Management System and follows the same licensing terms.

---

*Happy farming with intelligent health monitoring! 🏔️🐐*
