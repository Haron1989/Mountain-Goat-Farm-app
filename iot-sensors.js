// ===============================================
// IOT & SENSOR INTEGRATION SYSTEM
// ===============================================

class IoTSensorManager {
    constructor() {
        this.sensors = new Map();
        this.sensorReadings = new Map();
        this.alertThresholds = new Map();
        this.automationRules = new Map();
        this.isConnected = false;
        this.init();
    }

    init() {
        this.setupSensorNetwork();
        this.createIoTDashboard();
        this.startDataCollection();
        this.setupAutomationRules();
        this.simulateSensorData(); // For demo purposes
    }

    setupSensorNetwork() {
        // Define available sensor types and their configurations
        this.sensorTypes = {
            weight_scale: {
                name: 'Smart Weighing Scale',
                unit: 'kg',
                range: [0, 200],
                accuracy: 0.1,
                location: 'multiple'
            },
            temperature: {
                name: 'Temperature Sensor',
                unit: '°C',
                range: [-10, 50],
                accuracy: 0.1,
                location: 'barn, outdoor'
            },
            humidity: {
                name: 'Humidity Sensor',
                unit: '%',
                range: [0, 100],
                accuracy: 1,
                location: 'barn, feed_storage'
            },
            water_level: {
                name: 'Water Level Sensor',
                unit: 'L',
                range: [0, 1000],
                accuracy: 1,
                location: 'water_tanks'
            },
            feed_level: {
                name: 'Feed Level Sensor',
                unit: 'kg',
                range: [0, 500],
                accuracy: 0.5,
                location: 'feed_bins'
            },
            motion: {
                name: 'Motion/Activity Sensor',
                unit: 'count',
                range: [0, 1000],
                accuracy: 1,
                location: 'pens, pasture'
            },
            air_quality: {
                name: 'Air Quality Sensor',
                unit: 'ppm',
                range: [0, 1000],
                accuracy: 1,
                location: 'barn'
            },
            soil_moisture: {
                name: 'Soil Moisture Sensor',
                unit: '%',
                range: [0, 100],
                accuracy: 1,
                location: 'pasture, crop_fields'
            },
            gate_sensor: {
                name: 'Smart Gate Sensor',
                unit: 'status',
                range: ['open', 'closed'],
                accuracy: 100,
                location: 'all_gates'
            },
            rfid_reader: {
                name: 'RFID Reader',
                unit: 'tag_id',
                range: 'alphanumeric',
                accuracy: 99.9,
                location: 'entry_points'
            }
        };

        // Initialize sensor instances
        this.initializeSensors();
    }

    initializeSensors() {
        const sensorConfigs = [
            { id: 'scale_01', type: 'weight_scale', location: 'main_gate', name: 'Main Gate Scale' },
            { id: 'scale_02', type: 'weight_scale', location: 'pen_a', name: 'Pen A Scale' },
            { id: 'temp_01', type: 'temperature', location: 'barn_1', name: 'Barn 1 Temperature' },
            { id: 'temp_02', type: 'temperature', location: 'barn_2', name: 'Barn 2 Temperature' },
            { id: 'temp_03', type: 'temperature', location: 'outdoor', name: 'Outdoor Temperature' },
            { id: 'humid_01', type: 'humidity', location: 'barn_1', name: 'Barn 1 Humidity' },
            { id: 'humid_02', type: 'humidity', location: 'feed_storage', name: 'Feed Storage Humidity' },
            { id: 'water_01', type: 'water_level', location: 'tank_1', name: 'Main Water Tank' },
            { id: 'water_02', type: 'water_level', location: 'tank_2', name: 'Backup Water Tank' },
            { id: 'feed_01', type: 'feed_level', location: 'bin_1', name: 'Feed Bin 1' },
            { id: 'feed_02', type: 'feed_level', location: 'bin_2', name: 'Feed Bin 2' },
            { id: 'motion_01', type: 'motion', location: 'pen_a', name: 'Pen A Activity' },
            { id: 'motion_02', type: 'motion', location: 'pen_b', name: 'Pen B Activity' },
            { id: 'air_01', type: 'air_quality', location: 'barn_1', name: 'Barn 1 Air Quality' },
            { id: 'soil_01', type: 'soil_moisture', location: 'pasture_1', name: 'Pasture 1 Soil' },
            { id: 'soil_02', type: 'soil_moisture', location: 'pasture_2', name: 'Pasture 2 Soil' },
            { id: 'gate_01', type: 'gate_sensor', location: 'main_gate', name: 'Main Gate Status' },
            { id: 'gate_02', type: 'gate_sensor', location: 'pen_gate_a', name: 'Pen A Gate' },
            { id: 'rfid_01', type: 'rfid_reader', location: 'main_entrance', name: 'Main RFID Reader' },
            { id: 'rfid_02', type: 'rfid_reader', location: 'feed_station', name: 'Feed Station RFID' }
        ];

        sensorConfigs.forEach(config => {
            this.sensors.set(config.id, {
                ...config,
                status: 'active',
                lastReading: null,
                lastUpdate: null,
                batteryLevel: Math.random() * 30 + 70, // 70-100%
                connectionStrength: Math.random() * 20 + 80 // 80-100%
            });
        });

        // Set up alert thresholds
        this.setupAlertThresholds();
    }

    setupAlertThresholds() {
        this.alertThresholds.set('temperature', { min: 5, max: 35 });
        this.alertThresholds.set('humidity', { min: 30, max: 80 });
        this.alertThresholds.set('water_level', { min: 50, max: 950 });
        this.alertThresholds.set('feed_level', { min: 20, max: 480 });
        this.alertThresholds.set('air_quality', { min: 0, max: 400 });
        this.alertThresholds.set('soil_moisture', { min: 20, max: 80 });
    }

    createIoTDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'iotDashboard';
        dashboard.className = 'iot-dashboard';
        dashboard.innerHTML = `
            <div class="iot-header">
                <h2>🌐 IoT Sensor Network</h2>
                <div class="iot-status">
                    <span class="connection-indicator ${this.isConnected ? 'connected' : 'disconnected'}"></span>
                    <span>Network Status: ${this.isConnected ? 'Connected' : 'Connecting...'}</span>
                    <button class="refresh-sensors" onclick="iotManager.refreshAllSensors()">🔄 Refresh</button>
                </div>
            </div>

            <div class="iot-controls">
                <div class="sensor-summary">
                    <div class="summary-card">
                        <h3>Active Sensors</h3>
                        <div class="summary-value" id="activeSensorCount">${this.sensors.size}</div>
                    </div>
                    <div class="summary-card">
                        <h3>Alerts</h3>
                        <div class="summary-value alert" id="alertCount">0</div>
                    </div>
                    <div class="summary-card">
                        <h3>Automation Rules</h3>
                        <div class="summary-value" id="automationCount">0</div>
                    </div>
                    <div class="summary-card">
                        <h3>Data Points Today</h3>
                        <div class="summary-value" id="dataPointsCount">1,247</div>
                    </div>
                </div>
            </div>

            <div class="iot-tabs">
                <button class="tab-btn active" onclick="iotManager.switchTab('sensors')">📡 Sensor Status</button>
                <button class="tab-btn" onclick="iotManager.switchTab('realtime')">📊 Real-time Data</button>
                <button class="tab-btn" onclick="iotManager.switchTab('automation')">🤖 Automation</button>
                <button class="tab-btn" onclick="iotManager.switchTab('alerts')">⚠️ Alerts</button>
                <button class="tab-btn" onclick="iotManager.switchTab('config')">⚙️ Configuration</button>
            </div>

            <div class="iot-content">
                <div id="sensorsTab" class="tab-content active">
                    <div class="sensors-grid" id="sensorsGrid">
                        <!-- Sensors will be populated here -->
                    </div>
                </div>

                <div id="realtimeTab" class="tab-content">
                    <div class="realtime-charts">
                        <div class="chart-container">
                            <h3>Temperature Trends</h3>
                            <canvas id="temperatureChart" width="400" height="200"></canvas>
                        </div>
                        <div class="chart-container">
                            <h3>Humidity Levels</h3>
                            <canvas id="humidityChart" width="400" height="200"></canvas>
                        </div>
                        <div class="chart-container">
                            <h3>Water & Feed Levels</h3>
                            <canvas id="levelsChart" width="400" height="200"></canvas>
                        </div>
                        <div class="chart-container">
                            <h3>Activity Monitoring</h3>
                            <canvas id="activityChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>

                <div id="automationTab" class="tab-content">
                    <div class="automation-rules">
                        <div class="automation-header">
                            <h3>Automation Rules</h3>
                            <button class="add-rule-btn" onclick="iotManager.addAutomationRule()">+ Add Rule</button>
                        </div>
                        <div id="automationRules" class="rules-list">
                            <!-- Automation rules will be populated here -->
                        </div>
                    </div>
                </div>

                <div id="alertsTab" class="tab-content">
                    <div class="alerts-panel">
                        <div class="alerts-header">
                            <h3>Active Alerts</h3>
                            <button class="clear-alerts-btn" onclick="iotManager.clearAllAlerts()">Clear All</button>
                        </div>
                        <div id="alertsList" class="alerts-list">
                            <!-- Alerts will be populated here -->
                        </div>
                    </div>
                </div>

                <div id="configTab" class="tab-content">
                    <div class="config-panel">
                        <h3>Sensor Configuration</h3>
                        <div class="config-form">
                            <div class="form-group">
                                <label>Data Collection Interval:</label>
                                <select id="dataInterval">
                                    <option value="30">30 seconds</option>
                                    <option value="60" selected>1 minute</option>
                                    <option value="300">5 minutes</option>
                                    <option value="600">10 minutes</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Alert Sensitivity:</label>
                                <select id="alertSensitivity">
                                    <option value="low">Low</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Auto-export Data:</label>
                                <input type="checkbox" id="autoExport" checked>
                                <span>Export daily reports automatically</span>
                            </div>
                            <button class="save-config-btn" onclick="iotManager.saveConfiguration()">Save Configuration</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to main content
        const mainContent = document.querySelector('.main-content, main');
        if (mainContent) {
            mainContent.appendChild(dashboard);
        }

        this.populateSensorsGrid();
        this.setupAutomationRules();
        this.injectIoTStyles();
    }

    populateSensorsGrid() {
        const grid = document.getElementById('sensorsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        this.sensors.forEach((sensor, id) => {
            const sensorCard = document.createElement('div');
            sensorCard.className = `sensor-card ${sensor.status}`;
            sensorCard.innerHTML = `
                <div class="sensor-header">
                    <h4>${sensor.name}</h4>
                    <div class="sensor-status ${sensor.status}"></div>
                </div>
                <div class="sensor-type">${this.sensorTypes[sensor.type].name}</div>
                <div class="sensor-location">📍 ${sensor.location.replace('_', ' ')}</div>
                <div class="sensor-reading">
                    <span class="reading-value" id="reading-${id}">
                        ${sensor.lastReading || '--'}
                    </span>
                    <span class="reading-unit">${this.sensorTypes[sensor.type].unit}</span>
                </div>
                <div class="sensor-details">
                    <div class="detail-item">
                        <span>Battery:</span>
                        <div class="battery-indicator">
                            <div class="battery-level" style="width: ${sensor.batteryLevel}%"></div>
                        </div>
                        <span>${Math.round(sensor.batteryLevel)}%</span>
                    </div>
                    <div class="detail-item">
                        <span>Signal:</span>
                        <div class="signal-bars">
                            ${this.generateSignalBars(sensor.connectionStrength)}
                        </div>
                        <span>${Math.round(sensor.connectionStrength)}%</span>
                    </div>
                </div>
                <div class="sensor-actions">
                    <button class="calibrate-btn" onclick="iotManager.calibrateSensor('${id}')">🔧 Calibrate</button>
                    <button class="configure-btn" onclick="iotManager.configureSensor('${id}')">⚙️ Configure</button>
                </div>
                <div class="last-update">
                    Last update: ${sensor.lastUpdate ? new Date(sensor.lastUpdate).toLocaleTimeString() : 'Never'}
                </div>
            `;
            grid.appendChild(sensorCard);
        });
    }

    generateSignalBars(strength) {
        const bars = 4;
        const filledBars = Math.ceil((strength / 100) * bars);
        let html = '';
        
        for (let i = 1; i <= bars; i++) {
            html += `<div class="signal-bar ${i <= filledBars ? 'filled' : ''}"></div>`;
        }
        
        return html;
    }

    startDataCollection() {
        // Simulate real sensor data collection
        setInterval(() => {
            this.collectSensorData();
        }, 5000); // Collect every 5 seconds for demo

        // Simulate IoT connection
        setTimeout(() => {
            this.isConnected = true;
            this.updateConnectionStatus();
        }, 3000);
    }

    collectSensorData() {
        this.sensors.forEach((sensor, id) => {
            if (sensor.status === 'active') {
                const newReading = this.generateSensorReading(sensor.type);
                sensor.lastReading = newReading;
                sensor.lastUpdate = new Date().toISOString();

                // Update UI
                const readingElement = document.getElementById(`reading-${id}`);
                if (readingElement) {
                    readingElement.textContent = newReading;
                }

                // Store reading for historical data
                if (!this.sensorReadings.has(id)) {
                    this.sensorReadings.set(id, []);
                }
                
                const readings = this.sensorReadings.get(id);
                readings.push({
                    timestamp: new Date().toISOString(),
                    value: newReading
                });

                // Keep only last 100 readings
                if (readings.length > 100) {
                    readings.shift();
                }

                // Check for alerts
                this.checkAlerts(id, sensor, newReading);

                // Execute automation rules
                this.executeAutomationRules(id, sensor, newReading);
            }
        });

        this.updateDashboardSummary();
    }

    generateSensorReading(sensorType) {
        const type = this.sensorTypes[sensorType];
        
        switch (sensorType) {
            case 'weight_scale':
                return (Math.random() * 180 + 20).toFixed(1); // 20-200 kg
            case 'temperature':
                return (Math.random() * 25 + 15).toFixed(1); // 15-40°C
            case 'humidity':
                return Math.round(Math.random() * 40 + 40); // 40-80%
            case 'water_level':
                return Math.round(Math.random() * 800 + 100); // 100-900L
            case 'feed_level':
                return Math.round(Math.random() * 400 + 50); // 50-450kg
            case 'motion':
                return Math.round(Math.random() * 50); // 0-50 movements
            case 'air_quality':
                return Math.round(Math.random() * 300 + 100); // 100-400 ppm
            case 'soil_moisture':
                return Math.round(Math.random() * 50 + 25); // 25-75%
            case 'gate_sensor':
                return Math.random() > 0.9 ? 'open' : 'closed';
            case 'rfid_reader':
                return Math.random() > 0.8 ? `GOAT${Math.random().toString(36).substr(2, 6).toUpperCase()}` : null;
            default:
                return '0';
        }
    }

    checkAlerts(sensorId, sensor, reading) {
        const thresholds = this.alertThresholds.get(sensor.type);
        if (!thresholds || sensor.type === 'gate_sensor' || sensor.type === 'rfid_reader') return;

        const numericReading = parseFloat(reading);
        let alertType = null;

        if (numericReading < thresholds.min) {
            alertType = 'low';
        } else if (numericReading > thresholds.max) {
            alertType = 'high';
        }

        if (alertType) {
            this.createAlert({
                id: `alert_${Date.now()}`,
                sensorId: sensorId,
                sensorName: sensor.name,
                type: alertType,
                value: reading,
                threshold: alertType === 'low' ? thresholds.min : thresholds.max,
                timestamp: new Date().toISOString(),
                severity: this.calculateAlertSeverity(sensor.type, numericReading, thresholds)
            });
        }
    }

    calculateAlertSeverity(sensorType, value, thresholds) {
        const range = thresholds.max - thresholds.min;
        const deviation = Math.min(
            Math.abs(value - thresholds.min),
            Math.abs(value - thresholds.max)
        );
        
        const deviationPercent = (deviation / range) * 100;
        
        if (deviationPercent > 30) return 'critical';
        if (deviationPercent > 15) return 'high';
        if (deviationPercent > 5) return 'medium';
        return 'low';
    }

    createAlert(alert) {
        // Add to alerts list if not already present
        const existingAlert = Array.from(document.querySelectorAll('.alert-item'))
            .find(item => item.dataset.sensorId === alert.sensorId);
        
        if (existingAlert) {
            // Update existing alert
            existingAlert.querySelector('.alert-value').textContent = alert.value;
            existingAlert.querySelector('.alert-timestamp').textContent = 
                new Date(alert.timestamp).toLocaleTimeString();
        } else {
            // Create new alert
            const alertsList = document.getElementById('alertsList');
            if (alertsList) {
                const alertElement = document.createElement('div');
                alertElement.className = `alert-item severity-${alert.severity}`;
                alertElement.dataset.sensorId = alert.sensorId;
                alertElement.innerHTML = `
                    <div class="alert-header">
                        <h4>${alert.sensorName}</h4>
                        <span class="severity-badge ${alert.severity}">${alert.severity.toUpperCase()}</span>
                    </div>
                    <div class="alert-message">
                        ${alert.type === 'low' ? 'Below' : 'Above'} threshold: 
                        <span class="alert-value">${alert.value}</span> 
                        (Limit: ${alert.threshold})
                    </div>
                    <div class="alert-timestamp">${new Date(alert.timestamp).toLocaleTimeString()}</div>
                    <div class="alert-actions">
                        <button class="acknowledge-btn" onclick="iotManager.acknowledgeAlert('${alert.id}')">✓ Acknowledge</button>
                        <button class="dismiss-btn" onclick="iotManager.dismissAlert('${alert.id}')">✕ Dismiss</button>
                    </div>
                `;
                alertsList.prepend(alertElement);
            }
        }

        this.updateAlertCount();
    }

    setupAutomationRules() {
        const defaultRules = [
            {
                id: 'water_refill',
                name: 'Automatic Water Refill',
                condition: 'water_level < 100',
                action: 'Send refill notification',
                enabled: true,
                priority: 'high'
            },
            {
                id: 'feed_alert',
                name: 'Low Feed Alert',
                condition: 'feed_level < 50',
                action: 'Notify feed manager',
                enabled: true,
                priority: 'medium'
            },
            {
                id: 'temp_ventilation',
                name: 'Temperature Control',
                condition: 'temperature > 30',
                action: 'Increase ventilation',
                enabled: true,
                priority: 'medium'
            },
            {
                id: 'gate_security',
                name: 'Gate Security Alert',
                condition: 'gate_sensor = open AND time > 22:00',
                action: 'Send security alert',
                enabled: true,
                priority: 'critical'
            }
        ];

        defaultRules.forEach(rule => {
            this.automationRules.set(rule.id, rule);
        });

        this.updateAutomationRulesDisplay();
    }

    updateAutomationRulesDisplay() {
        const container = document.getElementById('automationRules');
        if (!container) return;

        container.innerHTML = '';
        
        this.automationRules.forEach((rule, id) => {
            const ruleElement = document.createElement('div');
            ruleElement.className = `automation-rule ${rule.enabled ? 'enabled' : 'disabled'}`;
            ruleElement.innerHTML = `
                <div class="rule-header">
                    <h4>${rule.name}</h4>
                    <div class="rule-controls">
                        <label class="toggle-switch">
                            <input type="checkbox" ${rule.enabled ? 'checked' : ''} 
                                   onchange="iotManager.toggleRule('${id}')">
                            <span class="slider"></span>
                        </label>
                        <span class="priority-badge ${rule.priority}">${rule.priority.toUpperCase()}</span>
                    </div>
                </div>
                <div class="rule-condition">
                    <strong>Condition:</strong> ${rule.condition}
                </div>
                <div class="rule-action">
                    <strong>Action:</strong> ${rule.action}
                </div>
                <div class="rule-actions">
                    <button class="edit-rule-btn" onclick="iotManager.editRule('${id}')">✏️ Edit</button>
                    <button class="delete-rule-btn" onclick="iotManager.deleteRule('${id}')">🗑️ Delete</button>
                </div>
            `;
            container.appendChild(ruleElement);
        });

        document.getElementById('automationCount').textContent = this.automationRules.size;
    }

    executeAutomationRules(sensorId, sensor, reading) {
        this.automationRules.forEach((rule, ruleId) => {
            if (!rule.enabled) return;

            // Simple rule evaluation (in real implementation, this would be more sophisticated)
            if (this.evaluateRuleCondition(rule.condition, sensor.type, reading)) {
                this.executeRuleAction(rule, sensor, reading);
            }
        });
    }

    evaluateRuleCondition(condition, sensorType, reading) {
        // Simplified rule evaluation
        if (condition.includes('water_level < 100') && sensorType === 'water_level') {
            return parseFloat(reading) < 100;
        }
        if (condition.includes('feed_level < 50') && sensorType === 'feed_level') {
            return parseFloat(reading) < 50;
        }
        if (condition.includes('temperature > 30') && sensorType === 'temperature') {
            return parseFloat(reading) > 30;
        }
        if (condition.includes('gate_sensor = open') && sensorType === 'gate_sensor') {
            const currentHour = new Date().getHours();
            return reading === 'open' && currentHour >= 22;
        }
        return false;
    }

    executeRuleAction(rule, sensor, reading) {
        console.log(`Executing automation rule: ${rule.name}`);
        
        // Create automation notification
        this.showNotification(
            `🤖 Automation: ${rule.action} triggered by ${sensor.name}`,
            'automation'
        );

        // Log automation action
        this.logAutomationAction(rule, sensor, reading);
    }

    logAutomationAction(rule, sensor, reading) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            ruleId: rule.id,
            ruleName: rule.name,
            sensorId: sensor.id,
            sensorName: sensor.name,
            triggerValue: reading,
            action: rule.action
        };

        // Store in local storage for now (in real implementation, send to backend)
        const logs = JSON.parse(localStorage.getItem('automationLogs') || '[]');
        logs.unshift(logEntry);
        
        // Keep only last 1000 entries
        if (logs.length > 1000) {
            logs.splice(1000);
        }
        
        localStorage.setItem('automationLogs', JSON.stringify(logs));
    }

    // UI Interaction Methods
    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(`${tabName}Tab`).classList.add('active');
        event.target.classList.add('active');

        // Update charts if real-time tab is selected
        if (tabName === 'realtime') {
            setTimeout(() => this.updateRealtimeCharts(), 100);
        }
    }

    updateRealtimeCharts() {
        // Update temperature chart
        this.updateTemperatureChart();
        this.updateHumidityChart();
        this.updateLevelsChart();
        this.updateActivityChart();
    }

    updateTemperatureChart() {
        const canvas = document.getElementById('temperatureChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get temperature sensor data
        const tempSensors = Array.from(this.sensors.entries())
            .filter(([id, sensor]) => sensor.type === 'temperature');

        // Simple line chart for temperature trends
        this.drawLineChart(ctx, tempSensors, 'Temperature (°C)', canvas.width, canvas.height);
    }

    updateHumidityChart() {
        const canvas = document.getElementById('humidityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const humiditySensors = Array.from(this.sensors.entries())
            .filter(([id, sensor]) => sensor.type === 'humidity');

        this.drawLineChart(ctx, humiditySensors, 'Humidity (%)', canvas.width, canvas.height);
    }

    updateLevelsChart() {
        const canvas = document.getElementById('levelsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const levelSensors = Array.from(this.sensors.entries())
            .filter(([id, sensor]) => sensor.type === 'water_level' || sensor.type === 'feed_level');

        this.drawBarChart(ctx, levelSensors, 'Levels', canvas.width, canvas.height);
    }

    updateActivityChart() {
        const canvas = document.getElementById('activityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const motionSensors = Array.from(this.sensors.entries())
            .filter(([id, sensor]) => sensor.type === 'motion');

        this.drawLineChart(ctx, motionSensors, 'Activity Count', canvas.width, canvas.height);
    }

    drawLineChart(ctx, sensors, title, width, height) {
        const padding = 60;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);

        // Draw title
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 30);

        // Draw axes
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw data for each sensor
        const colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0'];
        
        sensors.forEach(([id, sensor], index) => {
            const readings = this.sensorReadings.get(id) || [];
            if (readings.length < 2) return;

            ctx.strokeStyle = colors[index % colors.length];
            ctx.lineWidth = 2;
            ctx.beginPath();

            const last20 = readings.slice(-20); // Show last 20 readings
            const maxValue = Math.max(...last20.map(r => parseFloat(r.value) || 0));
            const minValue = Math.min(...last20.map(r => parseFloat(r.value) || 0));
            const range = maxValue - minValue || 1;

            last20.forEach((reading, i) => {
                const x = padding + (i * chartWidth / (last20.length - 1));
                const value = parseFloat(reading.value) || 0;
                const y = height - padding - ((value - minValue) / range) * chartHeight;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();

            // Draw sensor name
            ctx.fillStyle = colors[index % colors.length];
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(sensor.name, padding + 10, padding + 20 + (index * 15));
        });
    }

    drawBarChart(ctx, sensors, title, width, height) {
        const padding = 60;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);

        // Draw title
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 30);

        // Draw axes
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw bars
        const barWidth = chartWidth / sensors.length - 10;
        const colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0'];

        sensors.forEach(([id, sensor], index) => {
            const value = parseFloat(sensor.lastReading) || 0;
            const maxValue = sensor.type === 'water_level' ? 1000 : 500; // Different scales
            const barHeight = (value / maxValue) * chartHeight;

            const x = padding + (index * (barWidth + 10)) + 5;
            const y = height - padding - barHeight;

            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw value on top
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth / 2, y - 5);

            // Draw sensor name at bottom
            ctx.save();
            ctx.translate(x + barWidth / 2, height - padding + 15);
            ctx.rotate(-Math.PI / 4);
            ctx.textAlign = 'right';
            ctx.fillText(sensor.name, 0, 0);
            ctx.restore();
        });
    }

    // Additional methods for UI interactions
    refreshAllSensors() {
        this.showNotification('🔄 Refreshing all sensors...', 'info');
        this.collectSensorData();
        this.populateSensorsGrid();
        this.showNotification('✅ All sensors refreshed successfully!', 'success');
    }

    calibrateSensor(sensorId) {
        this.showNotification(`🔧 Calibrating sensor ${sensorId}...`, 'info');
        setTimeout(() => {
            this.showNotification(`✅ Sensor ${sensorId} calibrated successfully!`, 'success');
        }, 2000);
    }

    configureSensor(sensorId) {
        this.showNotification(`⚙️ Opening configuration for sensor ${sensorId}`, 'info');
    }

    toggleRule(ruleId) {
        const rule = this.automationRules.get(ruleId);
        if (rule) {
            rule.enabled = !rule.enabled;
            this.updateAutomationRulesDisplay();
            this.showNotification(
                `Rule "${rule.name}" ${rule.enabled ? 'enabled' : 'disabled'}`,
                'info'
            );
        }
    }

    addAutomationRule() {
        this.showNotification('➕ Opening rule creation wizard...', 'info');
    }

    editRule(ruleId) {
        this.showNotification(`✏️ Editing rule ${ruleId}...`, 'info');
    }

    deleteRule(ruleId) {
        if (confirm('Are you sure you want to delete this rule?')) {
            this.automationRules.delete(ruleId);
            this.updateAutomationRulesDisplay();
            this.showNotification('🗑️ Rule deleted successfully!', 'success');
        }
    }

    acknowledgeAlert(alertId) {
        const alertElement = document.querySelector(`[data-alert-id="${alertId}"]`);
        if (alertElement) {
            alertElement.classList.add('acknowledged');
        }
        this.showNotification('✓ Alert acknowledged', 'success');
    }

    dismissAlert(alertId) {
        const alertElement = document.querySelector(`[data-alert-id="${alertId}"]`);
        if (alertElement) {
            alertElement.remove();
        }
        this.updateAlertCount();
        this.showNotification('✕ Alert dismissed', 'info');
    }

    clearAllAlerts() {
        if (confirm('Clear all alerts?')) {
            document.getElementById('alertsList').innerHTML = 
                '<div class="no-alerts">No active alerts</div>';
            this.updateAlertCount();
            this.showNotification('All alerts cleared', 'success');
        }
    }

    saveConfiguration() {
        const config = {
            dataInterval: document.getElementById('dataInterval').value,
            alertSensitivity: document.getElementById('alertSensitivity').value,
            autoExport: document.getElementById('autoExport').checked
        };

        localStorage.setItem('iotConfig', JSON.stringify(config));
        this.showNotification('⚙️ Configuration saved successfully!', 'success');
    }

    updateConnectionStatus() {
        const indicator = document.querySelector('.connection-indicator');
        const status = document.querySelector('.iot-status span');
        
        if (indicator && status) {
            indicator.className = `connection-indicator ${this.isConnected ? 'connected' : 'disconnected'}`;
            status.textContent = `Network Status: ${this.isConnected ? 'Connected' : 'Connecting...'}`;
        }
    }

    updateDashboardSummary() {
        const activeSensors = Array.from(this.sensors.values()).filter(s => s.status === 'active').length;
        const alerts = document.querySelectorAll('.alert-item').length;
        
        document.getElementById('activeSensorCount').textContent = activeSensors;
        this.updateAlertCount();
    }

    updateAlertCount() {
        const alertCount = document.querySelectorAll('.alert-item').length;
        document.getElementById('alertCount').textContent = alertCount;
    }

    simulateSensorData() {
        // Simulate realistic sensor data patterns
        this.collectSensorData();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `iot-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    injectIoTStyles() {
        const styles = `
            .iot-dashboard {
                background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
                color: white;
                padding: 2rem;
                border-radius: 16px;
                margin: 2rem 0;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }

            .iot-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }

            .iot-header h2 {
                margin: 0;
                font-size: 2rem;
                font-weight: 700;
            }

            .iot-status {
                display: flex;
                align-items: center;
                gap: 1rem;
                background: rgba(255,255,255,0.1);
                padding: 0.5rem 1rem;
                border-radius: 25px;
            }

            .connection-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #f39c12;
                animation: pulse 2s infinite;
            }

            .connection-indicator.connected {
                background: #27ae60;
                animation: none;
            }

            .connection-indicator.disconnected {
                background: #e74c3c;
            }

            .refresh-sensors {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
            }

            .iot-controls {
                margin-bottom: 2rem;
            }

            .sensor-summary {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }

            .summary-card {
                background: rgba(255,255,255,0.95);
                color: #333;
                padding: 1.5rem;
                border-radius: 12px;
                text-align: center;
            }

            .summary-card h3 {
                margin: 0 0 1rem 0;
                color: #2c3e50;
                font-size: 1rem;
            }

            .summary-value {
                font-size: 2rem;
                font-weight: 700;
                color: #3498db;
            }

            .summary-value.alert {
                color: #e74c3c;
            }

            .iot-tabs {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }

            .tab-btn {
                background: rgba(255,255,255,0.1);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .tab-btn.active,
            .tab-btn:hover {
                background: rgba(255,255,255,0.2);
            }

            .iot-content {
                background: rgba(255,255,255,0.95);
                color: #333;
                border-radius: 12px;
                padding: 2rem;
            }

            .tab-content {
                display: none;
            }

            .tab-content.active {
                display: block;
            }

            .sensors-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 1.5rem;
            }

            .sensor-card {
                background: #f8f9fa;
                border: 2px solid #e9ecef;
                border-radius: 12px;
                padding: 1.5rem;
                transition: all 0.3s ease;
            }

            .sensor-card.active {
                border-color: #28a745;
                box-shadow: 0 4px 8px rgba(40, 167, 69, 0.2);
            }

            .sensor-card.inactive {
                border-color: #dc3545;
                opacity: 0.7;
            }

            .sensor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .sensor-header h4 {
                margin: 0;
                color: #2c3e50;
            }

            .sensor-status {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #dc3545;
            }

            .sensor-status.active {
                background: #28a745;
                animation: pulse 2s infinite;
            }

            .sensor-type {
                color: #6c757d;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .sensor-location {
                color: #495057;
                font-size: 0.9rem;
                margin-bottom: 1rem;
            }

            .sensor-reading {
                text-align: center;
                margin: 1rem 0;
            }

            .reading-value {
                font-size: 2rem;
                font-weight: 700;
                color: #2c3e50;
            }

            .reading-unit {
                color: #6c757d;
                margin-left: 0.5rem;
            }

            .sensor-details {
                margin: 1rem 0;
            }

            .detail-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
            }

            .battery-indicator {
                width: 30px;
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
                position: relative;
            }

            .battery-level {
                height: 100%;
                background: linear-gradient(90deg, #dc3545 0%, #ffc107 50%, #28a745 100%);
                transition: width 0.3s ease;
            }

            .signal-bars {
                display: flex;
                gap: 2px;
                align-items: flex-end;
            }

            .signal-bar {
                width: 4px;
                background: #e9ecef;
                border-radius: 2px;
            }

            .signal-bar:nth-child(1) { height: 6px; }
            .signal-bar:nth-child(2) { height: 9px; }
            .signal-bar:nth-child(3) { height: 12px; }
            .signal-bar:nth-child(4) { height: 15px; }

            .signal-bar.filled {
                background: #28a745;
            }

            .sensor-actions {
                display: flex;
                gap: 0.5rem;
                margin-top: 1rem;
            }

            .calibrate-btn,
            .configure-btn {
                flex: 1;
                background: #6c757d;
                color: white;
                border: none;
                padding: 0.5rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
            }

            .calibrate-btn:hover,
            .configure-btn:hover {
                background: #5a6268;
            }

            .last-update {
                text-align: center;
                color: #6c757d;
                font-size: 0.8rem;
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid #e9ecef;
            }

            .realtime-charts {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 2rem;
            }

            .chart-container {
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }

            .chart-container h3 {
                margin: 0 0 1rem 0;
                color: #2c3e50;
                text-align: center;
            }

            .automation-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }

            .add-rule-btn {
                background: #28a745;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
            }

            .automation-rule {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 1.5rem;
                margin-bottom: 1rem;
            }

            .automation-rule.enabled {
                border-color: #28a745;
                background: #f1f8e9;
            }

            .automation-rule.disabled {
                opacity: 0.6;
            }

            .rule-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .rule-controls {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }

            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 24px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .slider {
                background-color: #28a745;
            }

            input:checked + .slider:before {
                transform: translateX(26px);
            }

            .priority-badge {
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                color: white;
            }

            .priority-badge.critical {
                background: #dc3545;
            }

            .priority-badge.high {
                background: #fd7e14;
            }

            .priority-badge.medium {
                background: #ffc107;
                color: #333;
            }

            .priority-badge.low {
                background: #6c757d;
            }

            .rule-condition,
            .rule-action {
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
            }

            .rule-actions {
                margin-top: 1rem;
                display: flex;
                gap: 0.5rem;
            }

            .edit-rule-btn,
            .delete-rule-btn {
                background: #6c757d;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
            }

            .delete-rule-btn {
                background: #dc3545;
            }

            .alerts-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }

            .clear-alerts-btn {
                background: #dc3545;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
            }

            .alert-item {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            }

            .alert-item.severity-high {
                background: #f8d7da;
                border-color: #f5c6cb;
            }

            .alert-item.severity-critical {
                background: #f5c6cb;
                border-color: #f1b0b7;
            }

            .alert-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .severity-badge {
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                color: white;
            }

            .severity-badge.low {
                background: #28a745;
            }

            .severity-badge.medium {
                background: #ffc107;
                color: #333;
            }

            .severity-badge.high {
                background: #fd7e14;
            }

            .severity-badge.critical {
                background: #dc3545;
            }

            .alert-actions {
                margin-top: 1rem;
                display: flex;
                gap: 0.5rem;
            }

            .acknowledge-btn,
            .dismiss-btn {
                background: #6c757d;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
            }

            .acknowledge-btn {
                background: #28a745;
            }

            .dismiss-btn {
                background: #dc3545;
            }

            .config-form {
                max-width: 500px;
            }

            .form-group {
                margin-bottom: 1.5rem;
            }

            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }

            .form-group select,
            .form-group input[type="checkbox"] {
                margin-right: 0.5rem;
            }

            .save-config-btn {
                background: #007bff;
                color: white;
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
            }

            .iot-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem;
                border-radius: 8px;
                color: white;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                max-width: 300px;
            }

            .iot-notification.success {
                background: #28a745;
            }

            .iot-notification.info {
                background: #17a2b8;
            }

            .iot-notification.automation {
                background: #6f42c1;
            }

            @media (max-width: 768px) {
                .iot-dashboard {
                    padding: 1rem;
                }

                .iot-header {
                    flex-direction: column;
                    gap: 1rem;
                }

                .iot-tabs {
                    justify-content: center;
                }

                .sensors-grid {
                    grid-template-columns: 1fr;
                }

                .realtime-charts {
                    grid-template-columns: 1fr;
                }

                .sensor-summary {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Initialize IoT System
let iotManager;
document.addEventListener('DOMContentLoaded', function() {
    // Add IoT navigation link
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const iotLink = document.createElement('li');
        iotLink.innerHTML = '<a href="#iot-sensors" onclick="window.location.hash=\'iot-sensors\'; iotManager.scrollToIoT()">🌐 IoT Sensors</a>';
        navLinks.appendChild(iotLink);
    }
    
    // Initialize IoT system
    iotManager = new IoTSensorManager();
    
    // Make globally available
    window.iotManager = iotManager;
    
    // Add scroll-to-IoT functionality
    iotManager.scrollToIoT = function() {
        const dashboard = document.getElementById('iotDashboard');
        if (dashboard) {
            dashboard.scrollIntoView({ behavior: 'smooth' });
        }
    };
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IoTSensorManager;
}
