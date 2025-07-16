/**
 * 🚀 WORLD-CLASS FARM MANAGEMENT DASHBOARD
 * Comprehensive integration of all revolutionary features
 * AI, IoT, Blockchain, Data Monetization, and Global Supply Chain
 */

class WorldClassFarmDashboard {
    constructor() {
        this.isInitialized = false;
        this.modules = {
            farmGPT: null,
            digitalTwin: null,
            supplyChain: null,
            dataMonetization: null,
            aiAnalytics: null,
            iotSensors: null
        };
        this.dashboardData = {};
        this.realTimeUpdates = true;
        this.init();
    }

    async init() {
        console.log('🚀 Initializing World-Class Farm Dashboard...');
        await this.initializeModules();
        await this.loadDashboardData();
        this.setupRealTimeUpdates();
        this.createDashboardUI();
        this.isInitialized = true;
        console.log('✅ World-Class Farm Dashboard operational!');
    }

    async initializeModules() {
        // Wait for all core modules to be ready
        this.modules.farmGPT = window.farmGPT;
        this.modules.digitalTwin = window.digitalTwinFarm;
        this.modules.supplyChain = window.globalSupplyChain;
        this.modules.dataMonetization = window.dataMonetizationPlatform;
        this.modules.aiAnalytics = window.aiAnalytics;
        this.modules.iotSensors = window.iotSensorManager;
    }

    async loadDashboardData() {
        this.dashboardData = {
            overview: await this.getOverviewMetrics(),
            ai: await this.getAIInsights(),
            iot: await this.getIoTStatus(),
            blockchain: await this.getBlockchainStatus(),
            revenue: await this.getRevenueMetrics(),
            export: await this.getExportStatus(),
            sustainability: await this.getSustainabilityMetrics(),
            alerts: await this.getActiveAlerts()
        };
    }

    async getOverviewMetrics() {
        return {
            totalGoats: 2340,
            healthyGoats: 2199,
            breedingRate: 94.5,
            averageWeight: 42.3,
            monthlyRevenue: 'KES 1,170,000',
            exportOrders: 7,
            sustainabilityScore: 92,
            aiAccuracy: 91.2,
            iotSensorsActive: 156,
            dataSubscribers: 23,
            lastUpdated: new Date()
        };
    }

    async getAIInsights() {
        return {
            breedingRecommendations: [
                'Buck ID #B247 shows optimal genetic markers for breeding',
                'Recommend breeding Nubian does during upcoming short rains',
                'Genetic diversity score improved to 0.89 (+3% this quarter)'
            ],
            healthPredictions: [
                'Low respiratory disease risk (12%) for next 30 days',
                'Recommended vaccination for new kids in 2 weeks',
                'Parasite load monitoring needed for Sector 3'
            ],
            yieldForecasts: [
                'Projected 2,450 goats by end of Q4 (+110 head)',
                'Revenue forecast: KES 4.68M annual (+15.2%)',
                'Market timing optimal for premium sales in 3 weeks'
            ],
            anomalies: [
                'Feed consumption 8% below normal in Pasture B',
                'Water usage spike detected in Sector 2 (possible leak)',
                'Unusual nighttime activity pattern in breeding area'
            ]
        };
    }

    async getIoTStatus() {
        return {
            sensorsOnline: 156,
            sensorsOffline: 4,
            batteryAlerts: 12,
            dataQuality: 97.3,
            recentReadings: {
                temperature: { value: 24.5, trend: 'stable', status: 'normal' },
                humidity: { value: 68, trend: 'rising', status: 'normal' },
                soilMoisture: { value: 72, trend: 'stable', status: 'optimal' },
                waterLevel: { value: 85, trend: 'declining', status: 'monitor' }
            },
            automationRules: {
                active: 23,
                triggered: 8,
                efficiency: 94.2
            }
        };
    }

    async getBlockchainStatus() {
        return {
            activeContracts: 7,
            pendingTransactions: 3,
            traceabilityRecords: 12450,
            exportCertifications: 15,
            recentActivity: [
                'Smart contract deployed for UAE export (Order #EXP_789)',
                'Traceability chain created for 50 goats',
                'Halal certification verified on blockchain',
                'Payment milestone triggered for Qatar order'
            ]
        };
    }

    async getRevenueMetrics() {
        return {
            traditional: {
                livestock: 'KES 890,000',
                meat: 'KES 280,000',
                total: 'KES 1,170,000'
            },
            digital: {
                dataSubscriptions: 'USD 12,400',
                apiUsage: 'USD 3,200',
                consultingServices: 'USD 8,900',
                total: 'USD 24,500'
            },
            projectedAnnual: {
                traditional: 'KES 14.04M',
                digital: 'USD 294,000',
                combined: 'KES 43.2M' // including USD conversion
            }
        };
    }

    async getExportStatus() {
        return {
            activeOrders: [
                { id: 'EXP_789', destination: 'UAE', goats: 150, value: 'KES 1.87M', status: 'in_transit' },
                { id: 'EXP_790', destination: 'Saudi Arabia', goats: 200, value: 'KES 2.64M', status: 'preparing' },
                { id: 'EXP_791', destination: 'Qatar', goats: 100, value: 'KES 1.18M', status: 'compliance_check' }
            ],
            monthlyExports: 450,
            exportRevenue: 'KES 5.69M',
            markets: {
                UAE: { orders: 3, revenue: 'KES 2.1M', status: 'excellent' },
                Saudi: { orders: 2, revenue: 'KES 1.8M', status: 'growing' },
                Qatar: { orders: 2, revenue: 'KES 1.3M', status: 'stable' }
            }
        };
    }

    async getSustainabilityMetrics() {
        return {
            carbonFootprint: '-2.3 tons CO2/month', // negative = sequestration
            soilHealth: 87,
            waterEfficiency: 92,
            biodiversityIndex: 89,
            renewableEnergy: 78,
            wasteReduction: 94,
            certifications: ['Organic', 'Animal Welfare', 'Carbon Neutral'],
            carbonCredits: {
                earned: 45,
                sold: 32,
                revenue: 'USD 1,920'
            }
        };
    }

    async getActiveAlerts() {
        return [
            { 
                type: 'iot', 
                severity: 'medium', 
                message: 'Water level in Tank 2 below 20%',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                action: 'Auto-refill scheduled'
            },
            { 
                type: 'health', 
                severity: 'low', 
                message: '3 goats require deworming in Sector B',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                action: 'Treatment scheduled'
            },
            { 
                type: 'export', 
                severity: 'high', 
                message: 'UAE shipment requires additional health certificates',
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                action: 'Documentation in progress'
            },
            { 
                type: 'ai', 
                severity: 'medium', 
                message: 'Breeding optimization suggests genetic diversity improvement',
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
                action: 'Review breeding plan'
            }
        ];
    }

    createDashboardUI() {
        const dashboardHTML = `
            <div id="worldClassDashboard" class="world-class-dashboard">
                <header class="dashboard-header">
                    <div class="header-brand">
                        <h1>🐐 Mountain Goat Farm - World-Class Management Platform</h1>
                        <p>AI-Powered • IoT-Connected • Blockchain-Secured • Globally-Integrated</p>
                    </div>
                    <div class="header-stats">
                        <div class="stat-card">
                            <span class="stat-value">${this.dashboardData.overview.totalGoats}</span>
                            <span class="stat-label">Total Goats</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">${this.dashboardData.overview.sustainabilityScore}%</span>
                            <span class="stat-label">Sustainability Score</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">${this.dashboardData.overview.aiAccuracy}%</span>
                            <span class="stat-label">AI Accuracy</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value">${this.dashboardData.overview.dataSubscribers}</span>
                            <span class="stat-label">Data Subscribers</span>
                        </div>
                    </div>
                </header>

                <nav class="dashboard-nav">
                    <button class="nav-btn active" data-section="overview">📊 Overview</button>
                    <button class="nav-btn" data-section="ai-insights">🤖 AI Insights</button>
                    <button class="nav-btn" data-section="iot-monitoring">🌐 IoT Monitoring</button>
                    <button class="nav-btn" data-section="blockchain">⛓️ Blockchain</button>
                    <button class="nav-btn" data-section="export-management">🌍 Export Management</button>
                    <button class="nav-btn" data-section="data-monetization">💰 Data Revenue</button>
                    <button class="nav-btn" data-section="sustainability">🌱 Sustainability</button>
                    <button class="nav-btn" data-section="farm-gpt">🧠 Farm GPT</button>
                </nav>

                <main class="dashboard-content">
                    ${this.createOverviewSection()}
                    ${this.createAIInsightsSection()}
                    ${this.createIoTMonitoringSection()}
                    ${this.createBlockchainSection()}
                    ${this.createExportManagementSection()}
                    ${this.createDataMonetizationSection()}
                    ${this.createSustainabilitySection()}
                    ${this.createFarmGPTSection()}
                </main>

                <aside class="dashboard-alerts">
                    <h3>🚨 Active Alerts</h3>
                    <div class="alerts-container">
                        ${this.createAlertsHTML()}
                    </div>
                </aside>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
        this.attachEventListeners();
        this.setupRealTimeCharts();
    }

    createOverviewSection() {
        return `
            <section id="overview" class="dashboard-section active">
                <div class="section-grid">
                    <div class="metric-cards">
                        <div class="metric-card primary">
                            <div class="metric-icon">🐐</div>
                            <div class="metric-content">
                                <h3>Livestock Status</h3>
                                <div class="metric-value">${this.dashboardData.overview.totalGoats}</div>
                                <div class="metric-subtitle">${this.dashboardData.overview.healthyGoats} healthy (${((this.dashboardData.overview.healthyGoats/this.dashboardData.overview.totalGoats)*100).toFixed(1)}%)</div>
                            </div>
                        </div>
                        <div class="metric-card success">
                            <div class="metric-icon">💰</div>
                            <div class="metric-content">
                                <h3>Monthly Revenue</h3>
                                <div class="metric-value">${this.dashboardData.overview.monthlyRevenue}</div>
                                <div class="metric-subtitle">+15.3% vs last month</div>
                            </div>
                        </div>
                        <div class="metric-card info">
                            <div class="metric-icon">🌍</div>
                            <div class="metric-content">
                                <h3>Export Orders</h3>
                                <div class="metric-value">${this.dashboardData.overview.exportOrders}</div>
                                <div class="metric-subtitle">3 countries, KES 5.69M value</div>
                            </div>
                        </div>
                        <div class="metric-card warning">
                            <div class="metric-icon">🤖</div>
                            <div class="metric-content">
                                <h3>AI Performance</h3>
                                <div class="metric-value">${this.dashboardData.overview.aiAccuracy}%</div>
                                <div class="metric-subtitle">Prediction accuracy</div>
                            </div>
                        </div>
                    </div>

                    <div class="charts-container">
                        <div class="chart-card">
                            <h4>Revenue Trends (6 Months)</h4>
                            <canvas id="revenueChart" width="400" height="200"></canvas>
                        </div>
                        <div class="chart-card">
                            <h4>Herd Growth Projection</h4>
                            <canvas id="herdGrowthChart" width="400" height="200"></canvas>
                        </div>
                    </div>

                    <div class="quick-actions">
                        <h4>Quick Actions</h4>
                        <button class="action-btn" onclick="window.farmGPT.openCopilot()">
                            🧠 Ask Farm GPT
                        </button>
                        <button class="action-btn" onclick="this.runDigitalTwinScenario()">
                            🔬 Run Scenario
                        </button>
                        <button class="action-btn" onclick="this.createExportOrder()">
                            🌍 New Export Order
                        </button>
                        <button class="action-btn" onclick="this.generateDataInsight()">
                            💡 Generate Insights
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    createAIInsightsSection() {
        return `
            <section id="ai-insights" class="dashboard-section">
                <div class="ai-insights-grid">
                    <div class="insights-panel">
                        <h3>🧬 Breeding Recommendations</h3>
                        <ul class="insights-list">
                            ${this.dashboardData.ai.breedingRecommendations.map(rec => 
                                `<li class="insight-item">${rec}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div class="insights-panel">
                        <h3>🏥 Health Predictions</h3>
                        <ul class="insights-list">
                            ${this.dashboardData.ai.healthPredictions.map(pred => 
                                `<li class="insight-item">${pred}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div class="insights-panel">
                        <h3>📈 Yield Forecasts</h3>
                        <ul class="insights-list">
                            ${this.dashboardData.ai.yieldForecasts.map(forecast => 
                                `<li class="insight-item">${forecast}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div class="insights-panel anomalies">
                        <h3>⚠️ Anomaly Detection</h3>
                        <ul class="insights-list">
                            ${this.dashboardData.ai.anomalies.map(anomaly => 
                                `<li class="insight-item warning">${anomaly}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="ai-controls">
                    <button class="ai-btn" onclick="this.refreshAIAnalysis()">🔄 Refresh Analysis</button>
                    <button class="ai-btn" onclick="this.trainModel()">🎯 Retrain Models</button>
                    <button class="ai-btn" onclick="this.exportAIReport()">📄 Export Report</button>
                </div>
            </section>
        `;
    }

    createIoTMonitoringSection() {
        const iotData = this.dashboardData.iot;
        return `
            <section id="iot-monitoring" class="dashboard-section">
                <div class="iot-overview">
                    <div class="iot-stats">
                        <div class="iot-stat">
                            <span class="stat-number">${iotData.sensorsOnline}</span>
                            <span class="stat-label">Sensors Online</span>
                        </div>
                        <div class="iot-stat warning">
                            <span class="stat-number">${iotData.sensorsOffline}</span>
                            <span class="stat-label">Offline</span>
                        </div>
                        <div class="iot-stat info">
                            <span class="stat-number">${iotData.dataQuality}%</span>
                            <span class="stat-label">Data Quality</span>
                        </div>
                        <div class="iot-stat success">
                            <span class="stat-number">${iotData.automationRules.active}</span>
                            <span class="stat-label">Active Rules</span>
                        </div>
                    </div>
                </div>

                <div class="sensor-readings">
                    <h3>📊 Real-time Sensor Data</h3>
                    <div class="readings-grid">
                        ${Object.entries(iotData.recentReadings).map(([sensor, data]) => `
                            <div class="reading-card ${data.status}">
                                <h4>${sensor.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                                <div class="reading-value">${data.value}${this.getUnit(sensor)}</div>
                                <div class="reading-trend ${data.trend}">${data.trend}</div>
                                <div class="reading-status">${data.status}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="automation-panel">
                    <h3>🤖 Automation Rules</h3>
                    <div class="automation-stats">
                        <p>Active Rules: ${iotData.automationRules.active}</p>
                        <p>Rules Triggered Today: ${iotData.automationRules.triggered}</p>
                        <p>Automation Efficiency: ${iotData.automationRules.efficiency}%</p>
                    </div>
                    <button class="automation-btn" onclick="this.manageAutomationRules()">⚙️ Manage Rules</button>
                </div>
            </section>
        `;
    }

    createBlockchainSection() {
        const blockchain = this.dashboardData.blockchain;
        return `
            <section id="blockchain" class="dashboard-section">
                <div class="blockchain-overview">
                    <h3>⛓️ Blockchain Operations</h3>
                    <div class="blockchain-stats">
                        <div class="blockchain-stat">
                            <span class="stat-icon">📋</span>
                            <span class="stat-value">${blockchain.activeContracts}</span>
                            <span class="stat-label">Active Smart Contracts</span>
                        </div>
                        <div class="blockchain-stat">
                            <span class="stat-icon">🔄</span>
                            <span class="stat-value">${blockchain.pendingTransactions}</span>
                            <span class="stat-label">Pending Transactions</span>
                        </div>
                        <div class="blockchain-stat">
                            <span class="stat-icon">🔍</span>
                            <span class="stat-value">${blockchain.traceabilityRecords}</span>
                            <span class="stat-label">Traceability Records</span>
                        </div>
                        <div class="blockchain-stat">
                            <span class="stat-icon">✅</span>
                            <span class="stat-value">${blockchain.exportCertifications}</span>
                            <span class="stat-label">Export Certifications</span>
                        </div>
                    </div>
                </div>

                <div class="blockchain-activity">
                    <h4>Recent Blockchain Activity</h4>
                    <div class="activity-timeline">
                        ${blockchain.recentActivity.map((activity, index) => `
                            <div class="activity-item">
                                <div class="activity-time">${this.getRelativeTime(index * 2)} ago</div>
                                <div class="activity-description">${activity}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="blockchain-actions">
                    <button class="blockchain-btn" onclick="this.deploySmartContract()">📋 Deploy Contract</button>
                    <button class="blockchain-btn" onclick="this.createTraceabilityRecord()">🔍 Create Traceability</button>
                    <button class="blockchain-btn" onclick="this.verifyAuthenticity()">✅ Verify Authenticity</button>
                </div>
            </section>
        `;
    }

    createExportManagementSection() {
        const exportData = this.dashboardData.export;
        return `
            <section id="export-management" class="dashboard-section">
                <div class="export-overview">
                    <h3>🌍 Global Export Operations</h3>
                    <div class="export-summary">
                        <div class="export-metric">
                            <span class="metric-value">${exportData.monthlyExports}</span>
                            <span class="metric-label">Monthly Exports</span>
                        </div>
                        <div class="export-metric">
                            <span class="metric-value">${exportData.exportRevenue}</span>
                            <span class="metric-label">Export Revenue</span>
                        </div>
                    </div>
                </div>

                <div class="active-orders">
                    <h4>📦 Active Export Orders</h4>
                    <div class="orders-table">
                        ${exportData.activeOrders.map(order => `
                            <div class="order-row">
                                <div class="order-id">${order.id}</div>
                                <div class="order-destination">${order.destination}</div>
                                <div class="order-quantity">${order.goats} goats</div>
                                <div class="order-value">${order.value}</div>
                                <div class="order-status ${order.status}">${order.status.replace('_', ' ')}</div>
                                <button class="order-action" onclick="this.viewOrderDetails('${order.id}')">View</button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="market-performance">
                    <h4>🎯 Market Performance</h4>
                    <div class="markets-grid">
                        ${Object.entries(exportData.markets).map(([market, data]) => `
                            <div class="market-card">
                                <h5>${market}</h5>
                                <p>Orders: ${data.orders}</p>
                                <p>Revenue: ${data.revenue}</p>
                                <p class="market-status ${data.status}">Status: ${data.status}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    createDataMonetizationSection() {
        const revenue = this.dashboardData.revenue;
        return `
            <section id="data-monetization" class="dashboard-section">
                <div class="monetization-overview">
                    <h3>💰 Data Revenue Streams</h3>
                    <div class="revenue-cards">
                        <div class="revenue-card traditional">
                            <h4>🐐 Traditional Revenue</h4>
                            <div class="revenue-breakdown">
                                <p>Livestock Sales: ${revenue.traditional.livestock}</p>
                                <p>Meat Products: ${revenue.traditional.meat}</p>
                                <div class="revenue-total">Total: ${revenue.traditional.total}</div>
                            </div>
                        </div>
                        <div class="revenue-card digital">
                            <h4>💻 Digital Revenue</h4>
                            <div class="revenue-breakdown">
                                <p>Data Subscriptions: ${revenue.digital.dataSubscriptions}</p>
                                <p>API Usage: ${revenue.digital.apiUsage}</p>
                                <p>Consulting: ${revenue.digital.consultingServices}</p>
                                <div class="revenue-total">Total: ${revenue.digital.total}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="data-products">
                    <h4>📊 Data Product Performance</h4>
                    <div class="products-list">
                        <div class="product-item">
                            <span class="product-name">Breeding Intelligence</span>
                            <span class="product-subscribers">8 subscribers</span>
                            <span class="product-revenue">USD 4,200/month</span>
                        </div>
                        <div class="product-item">
                            <span class="product-name">Climate Adaptation Data</span>
                            <span class="product-subscribers">5 subscribers</span>
                            <span class="product-revenue">USD 2,800/month</span>
                        </div>
                        <div class="product-item">
                            <span class="product-name">Sustainability Metrics</span>
                            <span class="product-subscribers">6 subscribers</span>
                            <span class="product-revenue">USD 3,600/month</span>
                        </div>
                        <div class="product-item">
                            <span class="product-name">Market Intelligence</span>
                            <span class="product-subscribers">4 subscribers</span>
                            <span class="product-revenue">USD 1,800/month</span>
                        </div>
                    </div>
                </div>

                <div class="projections">
                    <h4>📈 Annual Projections</h4>
                    <div class="projection-chart">
                        <p>Traditional: ${revenue.projectedAnnual.traditional}</p>
                        <p>Digital: ${revenue.projectedAnnual.digital}</p>
                        <p class="projection-total">Combined Total: ${revenue.projectedAnnual.combined}</p>
                    </div>
                </div>
            </section>
        `;
    }

    createSustainabilitySection() {
        const sustainability = this.dashboardData.sustainability;
        return `
            <section id="sustainability" class="dashboard-section">
                <div class="sustainability-overview">
                    <h3>🌱 Sustainability Dashboard</h3>
                    <div class="sustainability-metrics">
                        <div class="sustainability-card carbon">
                            <h4>🌿 Carbon Impact</h4>
                            <div class="metric-large">${sustainability.carbonFootprint}</div>
                            <p>Net carbon sequestration</p>
                        </div>
                        <div class="sustainability-card soil">
                            <h4>🌍 Soil Health</h4>
                            <div class="metric-large">${sustainability.soilHealth}%</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${sustainability.soilHealth}%"></div>
                            </div>
                        </div>
                        <div class="sustainability-card water">
                            <h4>💧 Water Efficiency</h4>
                            <div class="metric-large">${sustainability.waterEfficiency}%</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${sustainability.waterEfficiency}%"></div>
                            </div>
                        </div>
                        <div class="sustainability-card biodiversity">
                            <h4>🦋 Biodiversity</h4>
                            <div class="metric-large">${sustainability.biodiversityIndex}%</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${sustainability.biodiversityIndex}%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="certifications">
                    <h4>🏆 Certifications</h4>
                    <div class="cert-badges">
                        ${sustainability.certifications.map(cert => `
                            <div class="cert-badge">${cert}</div>
                        `).join('')}
                    </div>
                </div>

                <div class="carbon-credits">
                    <h4>💚 Carbon Credit Trading</h4>
                    <div class="carbon-stats">
                        <p>Credits Earned: ${sustainability.carbonCredits.earned}</p>
                        <p>Credits Sold: ${sustainability.carbonCredits.sold}</p>
                        <p>Revenue Generated: ${sustainability.carbonCredits.revenue}</p>
                    </div>
                </div>
            </section>
        `;
    }

    createFarmGPTSection() {
        return `
            <section id="farm-gpt" class="dashboard-section">
                <div class="farm-gpt-interface">
                    <h3>🧠 Farm GPT Copilot</h3>
                    <div class="gpt-chat-container">
                        <div class="chat-messages" id="farmGPTMessages">
                            <div class="message bot">
                                <strong>Farm GPT:</strong> Hello! I'm your AI farm assistant. I can help with breeding decisions, health protocols, market analysis, and operational recommendations. What would you like to know?
                            </div>
                        </div>
                        <div class="chat-input-container">
                            <input type="text" id="farmGPTInput" placeholder="Ask Farm GPT anything about your farm..." />
                            <button onclick="this.sendGPTMessage()">Send</button>
                        </div>
                    </div>
                    
                    <div class="gpt-quick-actions">
                        <h4>Quick Questions</h4>
                        <button class="quick-btn" onclick="this.askGPT('Draft SOP for goat vaccination based on recent incidents')">
                            Draft Vaccination SOP
                        </button>
                        <button class="quick-btn" onclick="this.askGPT('Summarize last quarter performance for investors')">
                            Quarterly Summary
                        </button>
                        <button class="quick-btn" onclick="this.askGPT('Recommend pasture optimization strategy')">
                            Pasture Optimization
                        </button>
                        <button class="quick-btn" onclick="this.askGPT('Analyze breeding program performance')">
                            Breeding Analysis
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    createAlertsHTML() {
        return this.dashboardData.alerts.map(alert => `
            <div class="alert-item ${alert.severity}">
                <div class="alert-header">
                    <span class="alert-type">${alert.type.toUpperCase()}</span>
                    <span class="alert-time">${this.formatTime(alert.timestamp)}</span>
                </div>
                <div class="alert-message">${alert.message}</div>
                <div class="alert-action">${alert.action}</div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Farm GPT input
        const gptInput = document.getElementById('farmGPTInput');
        if (gptInput) {
            gptInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendGPTMessage();
                }
            });
        }
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        document.getElementById(sectionId)?.classList.add('active');
        
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');
    }

    async sendGPTMessage() {
        const input = document.getElementById('farmGPTInput');
        const message = input.value.trim();
        if (!message) return;

        this.addGPTMessage(message, 'user');
        input.value = '';

        try {
            const response = await this.modules.farmGPT.processQuery(message);
            this.addGPTMessage(this.formatGPTResponse(response), 'bot');
        } catch (error) {
            this.addGPTMessage('Sorry, I encountered an error processing your request.', 'bot');
        }
    }

    addGPTMessage(message, sender) {
        const messagesContainer = document.getElementById('farmGPTMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Farm GPT'}:</strong> ${message}`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatGPTResponse(response) {
        if (typeof response === 'string') return response;
        if (response.content) return response.content;
        return JSON.stringify(response, null, 2);
    }

    async askGPT(question) {
        const input = document.getElementById('farmGPTInput');
        input.value = question;
        await this.sendGPTMessage();
    }

    setupRealTimeUpdates() {
        setInterval(() => {
            this.updateDashboardData();
        }, 30000); // Update every 30 seconds
    }

    async updateDashboardData() {
        try {
            this.dashboardData = await this.loadDashboardData();
            this.updateUIElements();
        } catch (error) {
            console.error('Error updating dashboard data:', error);
        }
    }

    updateUIElements() {
        // Update key metrics
        const elements = {
            totalGoats: this.dashboardData.overview.totalGoats,
            sustainabilityScore: this.dashboardData.overview.sustainabilityScore,
            aiAccuracy: this.dashboardData.overview.aiAccuracy,
            dataSubscribers: this.dashboardData.overview.dataSubscribers
        };

        Object.entries(elements).forEach(([key, value]) => {
            const element = document.querySelector(`[data-metric="${key}"]`);
            if (element) element.textContent = value;
        });
    }

    setupRealTimeCharts() {
        // Revenue chart
        const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
        if (revenueCtx) {
            this.createRevenueChart(revenueCtx);
        }

        // Herd growth chart
        const herdCtx = document.getElementById('herdGrowthChart')?.getContext('2d');
        if (herdCtx) {
            this.createHerdGrowthChart(herdCtx);
        }
    }

    createRevenueChart(ctx) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const revenue = [890000, 950000, 1020000, 1100000, 1150000, 1170000];

        // Simple canvas chart implementation
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        revenue.forEach((value, index) => {
            const x = (index / (revenue.length - 1)) * ctx.canvas.width;
            const y = ctx.canvas.height - (value / 1200000) * ctx.canvas.height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    createHerdGrowthChart(ctx) {
        const projectedGrowth = [2340, 2365, 2390, 2415, 2440, 2450];
        
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        projectedGrowth.forEach((value, index) => {
            const x = (index / (projectedGrowth.length - 1)) * ctx.canvas.width;
            const y = ctx.canvas.height - ((value - 2300) / 200) * ctx.canvas.height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    getUnit(sensor) {
        const units = {
            temperature: '°C',
            humidity: '%',
            soilMoisture: '%',
            waterLevel: '%'
        };
        return units[sensor] || '';
    }

    getRelativeTime(hours) {
        if (hours < 1) return `${Math.floor(hours * 60)} minutes`;
        return `${hours} hours`;
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString();
    }

    // Action methods
    async runDigitalTwinScenario() {
        const scenario = await this.modules.digitalTwin.doubleIrrigationScenario();
        alert(`Scenario Result: ${JSON.stringify(scenario.projectedOutcomes, null, 2)}`);
    }

    async createExportOrder() {
        alert('Export order creation interface would open here');
    }

    async generateDataInsight() {
        const insight = await this.modules.dataMonetization.generateDataInsight('breeding_analytics');
        alert(`Data Insight Generated: ${insight.insights.length} insights created`);
    }

    async refreshAIAnalysis() {
        this.dashboardData.ai = await this.getAIInsights();
        this.updateUIElements();
        alert('AI analysis refreshed successfully');
    }
}

// Initialize World-Class Dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.worldClassDashboard = new WorldClassFarmDashboard();
});

// Add comprehensive CSS styles
const dashboardStyles = `
<style>
.world-class-dashboard {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.dashboard-header {
    background: rgba(255, 255, 255, 0.95);
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.header-brand h1 {
    color: #2c3e50;
    margin: 0;
    font-size: 2.5em;
    font-weight: bold;
}

.header-brand p {
    color: #7f8c8d;
    margin: 5px 0 0 0;
    font-style: italic;
}

.header-stats {
    display: flex;
    gap: 20px;
}

.stat-card {
    text-align: center;
    padding: 10px 15px;
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: white;
    border-radius: 10px;
    min-width: 80px;
}

.stat-value {
    display: block;
    font-size: 1.8em;
    font-weight: bold;
}

.stat-label {
    display: block;
    font-size: 0.8em;
    opacity: 0.9;
}

.dashboard-nav {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.nav-btn {
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.nav-btn:hover {
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.nav-btn.active {
    background: #4CAF50;
    color: white;
}

.dashboard-content {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
}

.dashboard-section {
    display: none;
    background: rgba(255, 255, 255, 0.95);
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.dashboard-section.active {
    display: block;
}

.section-grid {
    display: grid;
    gap: 20px;
}

.metric-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
}

.metric-card {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 12px;
    color: white;
    gap: 15px;
}

.metric-card.primary { background: linear-gradient(45deg, #3498db, #2980b9); }
.metric-card.success { background: linear-gradient(45deg, #2ecc71, #27ae60); }
.metric-card.info { background: linear-gradient(45deg, #9b59b6, #8e44ad); }
.metric-card.warning { background: linear-gradient(45deg, #f39c12, #e67e22); }

.metric-icon {
    font-size: 2.5em;
}

.metric-value {
    font-size: 1.8em;
    font-weight: bold;
    margin-bottom: 5px;
}

.metric-subtitle {
    font-size: 0.9em;
    opacity: 0.9;
}

.charts-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.chart-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #e9ecef;
}

.chart-card h4 {
    margin-top: 0;
    color: #495057;
}

.quick-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.action-btn {
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s;
}

.action-btn:hover {
    background: #45a049;
}

.dashboard-alerts {
    background: rgba(255, 255, 255, 0.95);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    height: fit-content;
}

.alerts-container {
    max-height: 400px;
    overflow-y: auto;
}

.alert-item {
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    border-left: 4px solid;
}

.alert-item.high { 
    background: #ffeaea; 
    border-left-color: #e74c3c; 
}

.alert-item.medium { 
    background: #fff3cd; 
    border-left-color: #f39c12; 
}

.alert-item.low { 
    background: #e8f5e8; 
    border-left-color: #27ae60; 
}

.alert-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 5px;
}

.alert-message {
    margin-bottom: 5px;
}

.alert-action {
    font-size: 0.9em;
    font-style: italic;
    opacity: 0.8;
}

/* IoT Section Styles */
.iot-overview {
    margin-bottom: 25px;
}

.iot-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
}

.iot-stat {
    text-align: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 2px solid #e9ecef;
}

.iot-stat.warning { border-color: #ffc107; background: #fff3cd; }
.iot-stat.success { border-color: #28a745; background: #d4edda; }
.iot-stat.info { border-color: #17a2b8; background: #d1ecf1; }

.readings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.reading-card {
    padding: 15px;
    border-radius: 8px;
    border: 2px solid;
}

.reading-card.normal { border-color: #28a745; background: #d4edda; }
.reading-card.monitor { border-color: #ffc107; background: #fff3cd; }
.reading-card.alert { border-color: #dc3545; background: #f8d7da; }

.reading-value {
    font-size: 2em;
    font-weight: bold;
    margin: 10px 0;
}

.reading-trend {
    font-size: 0.9em;
    font-weight: 600;
}

.reading-trend.stable { color: #28a745; }
.reading-trend.rising { color: #17a2b8; }
.reading-trend.declining { color: #ffc107; }

/* Farm GPT Styles */
.farm-gpt-interface {
    max-width: 800px;
}

.gpt-chat-container {
    border: 1px solid #e9ecef;
    border-radius: 10px;
    margin-bottom: 20px;
}

.chat-messages {
    height: 300px;
    overflow-y: auto;
    padding: 15px;
    background: #f8f9fa;
}

.message {
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 8px;
}

.message.user {
    background: #e3f2fd;
    margin-left: 20%;
}

.message.bot {
    background: #f1f8e9;
    margin-right: 20%;
}

.chat-input-container {
    display: flex;
    padding: 15px;
    background: white;
    border-top: 1px solid #e9ecef;
}

.chat-input-container input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin-right: 10px;
}

.chat-input-container button {
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.gpt-quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
}

.quick-btn {
    padding: 10px 15px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    font-size: 0.9em;
}

.quick-btn:hover {
    background: #5a6268;
}

/* Responsive Design */
@media (max-width: 768px) {
    .dashboard-content {
        grid-template-columns: 1fr;
    }
    
    .header-stats {
        flex-direction: column;
        gap: 10px;
    }
    
    .metric-cards {
        grid-template-columns: 1fr;
    }
    
    .charts-container {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .world-class-dashboard {
        padding: 10px;
    }
    
    .dashboard-header {
        flex-direction: column;
        text-align: center;
        gap: 15px;
    }
    
    .nav-btn {
        padding: 8px 12px;
        font-size: 0.9em;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', dashboardStyles);
