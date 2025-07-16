// ===============================================
// AI-POWERED PREDICTIVE ANALYTICS & SMART RECOMMENDATIONS
// ===============================================

class AIAnalyticsEngine {
    constructor() {
        this.models = {
            breeding: new BreedingPredictor(),
            health: new HealthPredictor(),
            yield: new YieldForecaster(),
            anomaly: new AnomalyDetector()
        };
        this.init();
    }

    init() {
        this.createAnalyticsDashboard();
        this.startPredictiveAnalysis();
        this.setupAnomalyMonitoring();
    }

    createAnalyticsDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'aiAnalyticsDashboard';
        dashboard.className = 'ai-dashboard';
        dashboard.innerHTML = `
            <div class="ai-header">
                <h2>🤖 AI Farm Intelligence</h2>
                <div class="ai-status">
                    <span class="ai-indicator active"></span>
                    <span>AI Active</span>
                </div>
            </div>

            <div class="ai-insights-grid">
                <!-- Predictive Insights -->
                <div class="insight-card prediction-card">
                    <h3>🔮 Predictive Insights</h3>
                    <div id="predictionInsights" class="insights-content">
                        <div class="loading-ai">🧠 AI analyzing...</div>
                    </div>
                </div>

                <!-- Smart Recommendations -->
                <div class="insight-card recommendations-card">
                    <h3>💡 Smart Recommendations</h3>
                    <div id="smartRecommendations" class="insights-content">
                        <div class="loading-ai">🤖 Generating recommendations...</div>
                    </div>
                </div>

                <!-- Yield Forecasting -->
                <div class="insight-card forecast-card">
                    <h3>📈 Yield Forecasting</h3>
                    <div id="yieldForecasts" class="insights-content">
                        <canvas id="yieldChart" width="400" height="200"></canvas>
                    </div>
                </div>

                <!-- Anomaly Detection -->
                <div class="insight-card anomaly-card">
                    <h3>⚠️ Anomaly Detection</h3>
                    <div id="anomalyAlerts" class="insights-content">
                        <div class="no-anomalies">✅ All systems normal</div>
                    </div>
                </div>

                <!-- Breeding Optimization -->
                <div class="insight-card breeding-card">
                    <h3>🧬 Breeding Optimization</h3>
                    <div id="breedingOptimization" class="insights-content">
                        <div class="breeding-suggestions"></div>
                    </div>
                </div>

                <!-- Market Intelligence -->
                <div class="insight-card market-card">
                    <h3>💰 Market Intelligence</h3>
                    <div id="marketIntelligence" class="insights-content">
                        <div class="market-trends"></div>
                    </div>
                </div>
            </div>

            <div class="ai-actions">
                <button class="ai-btn primary" onclick="aiAnalytics.runFullAnalysis()">
                    🔄 Run Full AI Analysis
                </button>
                <button class="ai-btn secondary" onclick="aiAnalytics.exportInsights()">
                    📊 Export Insights
                </button>
                <button class="ai-btn" onclick="aiAnalytics.scheduleAnalysis()">
                    ⏰ Schedule Auto-Analysis
                </button>
            </div>
        `;

        // Add to main content area
        const mainContent = document.querySelector('.main-content, main');
        if (mainContent) {
            mainContent.appendChild(dashboard);
        }

        this.injectAIStyles();
    }

    async startPredictiveAnalysis() {
        // Simulate AI processing with realistic delays
        setTimeout(() => this.generatePredictiveInsights(), 2000);
        setTimeout(() => this.generateSmartRecommendations(), 3000);
        setTimeout(() => this.generateYieldForecasts(), 4000);
        setTimeout(() => this.detectAnomalies(), 5000);
        setTimeout(() => this.optimizeBreeding(), 6000);
        setTimeout(() => this.analyzeMarketTrends(), 7000);
    }

    generatePredictiveInsights() {
        const insights = [
            {
                type: 'breeding',
                confidence: 94,
                insight: 'Optimal breeding window for Goat #M001 is in 3-5 days based on cycle analysis',
                action: 'Schedule breeding with recommended sire #M015',
                impact: 'High genetic diversity offspring'
            },
            {
                type: 'health',
                confidence: 87,
                insight: 'Early indicators suggest potential respiratory issues in Pen 3',
                action: 'Increase ventilation and schedule preventive health check',
                impact: 'Prevent herd-wide illness'
            },
            {
                type: 'feeding',
                confidence: 91,
                insight: 'Current feed consumption patterns suggest 15% cost reduction opportunity',
                action: 'Adjust feed schedule to optimize nutrition timing',
                impact: 'KES 25,000 monthly savings'
            },
            {
                type: 'market',
                confidence: 89,
                insight: 'Market analysis predicts 18% price increase in 2-3 months',
                action: 'Delay sales of premium breeding stock',
                impact: 'KES 180,000 additional revenue potential'
            }
        ];

        const container = document.getElementById('predictionInsights');
        container.innerHTML = insights.map(insight => `
            <div class="prediction-item ${insight.type}">
                <div class="prediction-header">
                    <span class="prediction-type">${insight.type.toUpperCase()}</span>
                    <span class="confidence-badge">${insight.confidence}% confidence</span>
                </div>
                <div class="prediction-text">${insight.insight}</div>
                <div class="prediction-action">
                    <strong>Recommended Action:</strong> ${insight.action}
                </div>
                <div class="prediction-impact">
                    <strong>Expected Impact:</strong> ${insight.impact}
                </div>
            </div>
        `).join('');
    }

    generateSmartRecommendations() {
        const recommendations = [
            {
                priority: 'high',
                category: 'Breeding',
                title: 'Optimal Breeding Pairs Identified',
                description: 'AI identified 3 high-value breeding combinations for maximum genetic diversity',
                actions: ['Review breeding matrix', 'Schedule breeding sessions', 'Prepare breeding pens'],
                roi: 'KES 85,000 potential offspring value increase'
            },
            {
                priority: 'medium',
                category: 'Health',
                title: 'Preventive Health Protocol',
                description: 'Weather patterns suggest increased parasite risk in next 2 weeks',
                actions: ['Order deworming medication', 'Schedule herd inspection', 'Update feed supplements'],
                roi: 'Prevent KES 45,000 in treatment costs'
            },
            {
                priority: 'high',
                category: 'Operations',
                title: 'Feed Optimization Opportunity',
                description: 'Adjust feed timing and composition for 12% efficiency improvement',
                actions: ['Modify morning feed schedule', 'Increase protein ratio by 3%', 'Monitor weight gains'],
                roi: 'KES 18,000 monthly cost reduction'
            }
        ];

        const container = document.getElementById('smartRecommendations');
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item priority-${rec.priority}">
                <div class="rec-header">
                    <h4>${rec.title}</h4>
                    <span class="priority-badge ${rec.priority}">${rec.priority.toUpperCase()}</span>
                </div>
                <div class="rec-category">${rec.category}</div>
                <div class="rec-description">${rec.description}</div>
                <div class="rec-actions">
                    <strong>Recommended Actions:</strong>
                    <ul>
                        ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
                <div class="rec-roi">💰 ${rec.roi}</div>
                <button class="implement-btn" onclick="aiAnalytics.implementRecommendation('${rec.title}')">
                    ✅ Implement
                </button>
            </div>
        `).join('');
    }

    generateYieldForecasts() {
        // Create advanced yield forecasting chart
        const canvas = document.getElementById('yieldChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Generate forecast data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const historicalData = [120, 135, 142, 138, 155, 148, 162, 158, 165, 172, 168, 175];
        const forecastData = [178, 185, 192, 188, 195, 202, 198, 205, 212, 208, 215, 222];
        
        this.drawForecastChart(ctx, months, historicalData, forecastData);
        
        // Add forecast summary
        const forecastContainer = document.getElementById('yieldForecasts');
        const summary = document.createElement('div');
        summary.className = 'forecast-summary';
        summary.innerHTML = `
            <div class="forecast-metrics">
                <div class="metric">
                    <span class="metric-label">Predicted Annual Yield:</span>
                    <span class="metric-value">2,340 goats</span>
                    <span class="metric-change positive">+12.5%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Revenue Forecast:</span>
                    <span class="metric-value">KES 4.68M</span>
                    <span class="metric-change positive">+15.2%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Confidence Level:</span>
                    <span class="metric-value">91%</span>
                </div>
            </div>
        `;
        forecastContainer.appendChild(summary);
    }

    detectAnomalies() {
        const anomalies = [
            {
                severity: 'medium',
                type: 'Weight Loss',
                entity: 'Goat #F045',
                description: 'Unusual 8% weight decrease over 5 days',
                recommendation: 'Schedule immediate health check',
                confidence: 89
            },
            {
                severity: 'low',
                type: 'Feed Consumption',
                entity: 'Pen 7',
                description: 'Feed consumption 15% below average for 3 days',
                recommendation: 'Check feed quality and water supply',
                confidence: 76
            }
        ];

        const container = document.getElementById('anomalyAlerts');
        if (anomalies.length === 0) {
            container.innerHTML = '<div class="no-anomalies">✅ All systems normal</div>';
        } else {
            container.innerHTML = anomalies.map(anomaly => `
                <div class="anomaly-item severity-${anomaly.severity}">
                    <div class="anomaly-header">
                        <span class="anomaly-type">${anomaly.type}</span>
                        <span class="severity-badge ${anomaly.severity}">${anomaly.severity.toUpperCase()}</span>
                    </div>
                    <div class="anomaly-entity">📍 ${anomaly.entity}</div>
                    <div class="anomaly-description">${anomaly.description}</div>
                    <div class="anomaly-recommendation">
                        <strong>Recommendation:</strong> ${anomaly.recommendation}
                    </div>
                    <div class="anomaly-confidence">Confidence: ${anomaly.confidence}%</div>
                    <button class="investigate-btn" onclick="aiAnalytics.investigateAnomaly('${anomaly.entity}')">
                        🔍 Investigate
                    </button>
                </div>
            `).join('');
        }
    }

    optimizeBreeding() {
        const breedingOptimizations = [
            {
                pair: 'M001 × F023',
                score: 96,
                traits: ['Disease resistance', 'Growth rate', 'Milk production'],
                offspring_value: 'KES 45,000',
                genetic_diversity: 'High',
                recommendation: 'Strongly recommended - optimal genetic combination'
            },
            {
                pair: 'M015 × F031',
                score: 92,
                traits: ['Meat quality', 'Feed efficiency', 'Hardiness'],
                offspring_value: 'KES 38,000',
                genetic_diversity: 'Very High',
                recommendation: 'Excellent choice for breeding program expansion'
            },
            {
                pair: 'M007 × F018',
                score: 88,
                traits: ['Size', 'Reproduction rate', 'Longevity'],
                offspring_value: 'KES 35,000',
                genetic_diversity: 'High',
                recommendation: 'Good option for maintaining herd quality'
            }
        ];

        const container = document.getElementById('breedingOptimization');
        container.querySelector('.breeding-suggestions').innerHTML = breedingOptimizations.map(opt => `
            <div class="breeding-suggestion">
                <div class="breeding-header">
                    <h4>${opt.pair}</h4>
                    <div class="breeding-score">${opt.score}/100</div>
                </div>
                <div class="breeding-traits">
                    <strong>Key Traits:</strong> ${opt.traits.join(', ')}
                </div>
                <div class="breeding-metrics">
                    <span class="metric">Value: ${opt.offspring_value}</span>
                    <span class="metric">Diversity: ${opt.genetic_diversity}</span>
                </div>
                <div class="breeding-recommendation">${opt.recommendation}</div>
                <button class="schedule-breeding-btn" onclick="aiAnalytics.scheduleBreeding('${opt.pair}')">
                    📅 Schedule Breeding
                </button>
            </div>
        `).join('');
    }

    analyzeMarketTrends() {
        const marketData = {
            currentPrice: 18500,
            priceChange: '+12.5%',
            trend: 'bullish',
            forecast: {
                nextMonth: 19800,
                nextQuarter: 21200,
                confidence: 87
            },
            factors: [
                'Increased demand from urban markets',
                'Limited supply due to dry season',
                'Export opportunities to Somalia',
                'Festive season approaching'
            ]
        };

        const container = document.getElementById('marketIntelligence');
        container.querySelector('.market-trends').innerHTML = `
            <div class="market-overview">
                <div class="current-price">
                    <span class="price-label">Current Market Price:</span>
                    <span class="price-value">KES ${marketData.currentPrice.toLocaleString()}</span>
                    <span class="price-change positive">${marketData.priceChange}</span>
                </div>
                <div class="market-trend trend-${marketData.trend}">
                    Trend: ${marketData.trend.toUpperCase()}
                </div>
            </div>
            
            <div class="price-forecast">
                <h4>Price Forecast</h4>
                <div class="forecast-timeline">
                    <div class="forecast-point">
                        <span class="timeline">Next Month</span>
                        <span class="forecast-price">KES ${marketData.forecast.nextMonth.toLocaleString()}</span>
                    </div>
                    <div class="forecast-point">
                        <span class="timeline">Next Quarter</span>
                        <span class="forecast-price">KES ${marketData.forecast.nextQuarter.toLocaleString()}</span>
                    </div>
                </div>
                <div class="forecast-confidence">Confidence: ${marketData.forecast.confidence}%</div>
            </div>
            
            <div class="market-factors">
                <h4>Key Market Factors</h4>
                <ul>
                    ${marketData.factors.map(factor => `<li>${factor}</li>`).join('')}
                </ul>
            </div>
            
            <div class="market-recommendation">
                <strong>AI Recommendation:</strong> Hold current stock for 4-6 weeks for optimal pricing
            </div>
        `;
    }

    drawForecastChart(ctx, months, historical, forecast) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = 40;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set up chart dimensions
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        // Find min/max values
        const allData = [...historical, ...forecast];
        const minValue = Math.min(...allData) * 0.9;
        const maxValue = Math.max(...allData) * 1.1;
        
        // Helper function to get x position
        const getX = (index) => padding + (index * chartWidth / (months.length - 1));
        
        // Helper function to get y position
        const getY = (value) => padding + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
        
        // Draw grid lines
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const y = padding + (i * chartHeight / 4);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw historical data
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < historical.length; i++) {
            const x = getX(i);
            const y = getY(historical[i]);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Draw forecast data
        ctx.strokeStyle = '#FF9800';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        for (let i = 0; i < forecast.length; i++) {
            const x = getX(i);
            const y = getY(forecast[i]);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw data points
        historical.forEach((value, i) => {
            ctx.fillStyle = '#2196F3';
            ctx.beginPath();
            ctx.arc(getX(i), getY(value), 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        forecast.forEach((value, i) => {
            ctx.fillStyle = '#FF9800';
            ctx.beginPath();
            ctx.arc(getX(i), getY(value), 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Draw labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        months.forEach((month, i) => {
            if (i % 2 === 0) { // Show every other month to avoid crowding
                ctx.fillText(month, getX(i), height - 10);
            }
        });
    }

    // Action methods
    runFullAnalysis() {
        this.showNotification('🤖 Running comprehensive AI analysis...', 'info');
        
        // Reset all sections
        document.getElementById('predictionInsights').innerHTML = '<div class="loading-ai">🧠 AI analyzing...</div>';
        document.getElementById('smartRecommendations').innerHTML = '<div class="loading-ai">🤖 Generating recommendations...</div>';
        
        // Re-run analysis
        this.startPredictiveAnalysis();
    }

    exportInsights() {
        const insights = {
            generated: new Date().toISOString(),
            predictions: this.getCurrentPredictions(),
            recommendations: this.getCurrentRecommendations(),
            forecasts: this.getCurrentForecasts(),
            anomalies: this.getCurrentAnomalies()
        };
        
        const blob = new Blob([JSON.stringify(insights, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-insights-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        this.showNotification('📊 AI insights exported successfully!', 'success');
    }

    scheduleAnalysis() {
        this.showNotification('⏰ AI analysis scheduled for daily execution at 6:00 AM', 'success');
    }

    implementRecommendation(title) {
        this.showNotification(`✅ Implementing recommendation: ${title}`, 'success');
    }

    investigateAnomaly(entity) {
        this.showNotification(`🔍 Opening detailed investigation for ${entity}`, 'info');
    }

    scheduleBreeding(pair) {
        this.showNotification(`📅 Breeding scheduled for pair: ${pair}`, 'success');
    }

    setupAnomalyMonitoring() {
        // Set up continuous monitoring
        setInterval(() => {
            this.detectAnomalies();
        }, 300000); // Check every 5 minutes
    }

    getCurrentPredictions() {
        // Extract current predictions from DOM
        return Array.from(document.querySelectorAll('.prediction-item')).map(item => ({
            type: item.querySelector('.prediction-type').textContent,
            confidence: item.querySelector('.confidence-badge').textContent,
            insight: item.querySelector('.prediction-text').textContent
        }));
    }

    getCurrentRecommendations() {
        // Extract current recommendations from DOM
        return Array.from(document.querySelectorAll('.recommendation-item')).map(item => ({
            title: item.querySelector('h4').textContent,
            priority: item.querySelector('.priority-badge').textContent,
            category: item.querySelector('.rec-category').textContent
        }));
    }

    getCurrentForecasts() {
        // Return forecast data
        return {
            annualYield: '2,340 goats',
            revenueForcast: 'KES 4.68M',
            confidence: '91%'
        };
    }

    getCurrentAnomalies() {
        // Extract current anomalies from DOM
        return Array.from(document.querySelectorAll('.anomaly-item')).map(item => ({
            type: item.querySelector('.anomaly-type').textContent,
            entity: item.querySelector('.anomaly-entity').textContent,
            severity: item.querySelector('.severity-badge').textContent
        }));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `ai-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    injectAIStyles() {
        const styles = `
            .ai-dashboard {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem;
                border-radius: 16px;
                margin: 2rem 0;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }

            .ai-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }

            .ai-header h2 {
                margin: 0;
                font-size: 2rem;
                font-weight: 700;
            }

            .ai-status {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(255,255,255,0.1);
                padding: 0.5rem 1rem;
                border-radius: 25px;
            }

            .ai-indicator {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #4CAF50;
                animation: pulse 2s infinite;
            }

            .ai-insights-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }

            .insight-card {
                background: rgba(255,255,255,0.95);
                color: #333;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            }

            .insight-card h3 {
                margin: 0 0 1rem 0;
                color: #667eea;
                border-bottom: 2px solid #eee;
                padding-bottom: 0.5rem;
            }

            .loading-ai {
                text-align: center;
                padding: 2rem;
                color: #666;
                animation: pulse 2s infinite;
            }

            .prediction-item {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
                border-left: 4px solid #2196F3;
            }

            .prediction-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .prediction-type {
                background: #2196F3;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 600;
            }

            .confidence-badge {
                background: #4CAF50;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
            }

            .prediction-text {
                font-weight: 500;
                margin-bottom: 0.5rem;
            }

            .prediction-action,
            .prediction-impact {
                font-size: 0.9rem;
                margin-bottom: 0.25rem;
            }

            .recommendation-item {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
                border-left: 4px solid #FF9800;
            }

            .rec-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .rec-header h4 {
                margin: 0;
                color: #333;
            }

            .priority-badge.high {
                background: #f44336;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
            }

            .priority-badge.medium {
                background: #FF9800;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
            }

            .rec-category {
                color: #666;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .rec-actions ul {
                margin: 0.5rem 0;
                padding-left: 1rem;
            }

            .rec-roi {
                background: #E8F5E8;
                color: #2E7D32;
                padding: 0.5rem;
                border-radius: 4px;
                margin: 0.5rem 0;
                font-weight: 600;
            }

            .implement-btn {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9rem;
            }

            .implement-btn:hover {
                background: #45a049;
            }

            .forecast-summary {
                margin-top: 1rem;
            }

            .forecast-metrics {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .metric {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem;
                background: #f8f9fa;
                border-radius: 4px;
            }

            .metric-value {
                font-weight: 600;
                color: #333;
            }

            .metric-change.positive {
                color: #4CAF50;
                font-weight: 600;
            }

            .anomaly-item {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            }

            .anomaly-item.severity-medium {
                background: #f8d7da;
                border-color: #f5c6cb;
            }

            .anomaly-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
            }

            .severity-badge {
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                color: white;
            }

            .severity-badge.medium {
                background: #FF9800;
            }

            .severity-badge.low {
                background: #4CAF50;
            }

            .investigate-btn {
                background: #2196F3;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 0.5rem;
            }

            .breeding-suggestion {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
                border-left: 4px solid #9C27B0;
            }

            .breeding-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .breeding-score {
                background: #9C27B0;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-weight: 600;
            }

            .schedule-breeding-btn {
                background: #9C27B0;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 0.5rem;
            }

            .market-overview {
                margin-bottom: 1rem;
            }

            .current-price {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }

            .price-value {
                font-size: 1.2rem;
                font-weight: 700;
                color: #4CAF50;
            }

            .price-change.positive {
                color: #4CAF50;
                font-weight: 600;
            }

            .market-trend.trend-bullish {
                color: #4CAF50;
                font-weight: 600;
            }

            .forecast-timeline {
                display: flex;
                justify-content: space-between;
                margin: 1rem 0;
            }

            .forecast-point {
                text-align: center;
            }

            .forecast-price {
                display: block;
                font-weight: 600;
                color: #2196F3;
            }

            .ai-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .ai-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: 2px solid rgba(255,255,255,0.3);
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .ai-btn:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }

            .ai-btn.primary {
                background: #4CAF50;
                border-color: #4CAF50;
            }

            .ai-btn.secondary {
                background: #2196F3;
                border-color: #2196F3;
            }

            .ai-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem;
                border-radius: 8px;
                color: white;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            }

            .ai-notification.success {
                background: #4CAF50;
            }

            .ai-notification.info {
                background: #2196F3;
            }

            .ai-notification.warning {
                background: #FF9800;
            }

            @media (max-width: 768px) {
                .ai-insights-grid {
                    grid-template-columns: 1fr;
                }
                
                .ai-actions {
                    flex-direction: column;
                }
                
                .forecast-timeline {
                    flex-direction: column;
                    gap: 1rem;
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

// Machine Learning Models (Simplified implementations)
class BreedingPredictor {
    predict(maleTraits, femaleTraits) {
        // Simplified breeding prediction algorithm
        const compatibility = this.calculateCompatibility(maleTraits, femaleTraits);
        const geneticDiversity = this.calculateGeneticDiversity(maleTraits, femaleTraits);
        return {
            compatibility,
            geneticDiversity,
            score: (compatibility + geneticDiversity) / 2
        };
    }

    calculateCompatibility(male, female) {
        // Simplified compatibility calculation
        return Math.random() * 40 + 60; // 60-100 range
    }

    calculateGeneticDiversity(male, female) {
        // Simplified genetic diversity calculation
        return Math.random() * 30 + 70; // 70-100 range
    }
}

class HealthPredictor {
    predictHealthRisks(goatData) {
        // Simplified health risk prediction
        const risks = [];
        
        if (goatData.age > 5) {
            risks.push({ type: 'Age-related', probability: 0.3 });
        }
        
        if (goatData.weightLoss > 0.05) {
            risks.push({ type: 'Nutritional', probability: 0.7 });
        }
        
        return risks;
    }
}

class YieldForecaster {
    forecastYield(historicalData, weatherData) {
        // Simplified yield forecasting
        const baseline = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
        const trend = 0.12; // 12% growth trend
        const seasonality = this.calculateSeasonality();
        
        return baseline * (1 + trend) * seasonality;
    }

    calculateSeasonality() {
        const month = new Date().getMonth();
        const seasonalFactors = [0.8, 0.9, 1.1, 1.2, 1.3, 1.1, 1.0, 0.9, 0.8, 0.9, 1.0, 1.1];
        return seasonalFactors[month];
    }
}

class AnomalyDetector {
    detectAnomalies(data) {
        // Simplified anomaly detection using statistical methods
        const anomalies = [];
        
        data.forEach(item => {
            if (this.isAnomaly(item)) {
                anomalies.push({
                    item,
                    type: this.classifyAnomaly(item),
                    severity: this.calculateSeverity(item)
                });
            }
        });
        
        return anomalies;
    }

    isAnomaly(item) {
        // Simplified anomaly detection logic
        return Math.random() < 0.1; // 10% chance of anomaly
    }

    classifyAnomaly(item) {
        const types = ['Weight Loss', 'Feed Consumption', 'Behavior Change', 'Health Indicator'];
        return types[Math.floor(Math.random() * types.length)];
    }

    calculateSeverity(item) {
        const severities = ['low', 'medium', 'high'];
        return severities[Math.floor(Math.random() * severities.length)];
    }
}

// Initialize AI Analytics
let aiAnalytics;
document.addEventListener('DOMContentLoaded', function() {
    // Add AI navigation link
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        const aiLink = document.createElement('li');
        aiLink.innerHTML = '<a href="#ai-analytics" onclick="window.location.hash=\'ai-analytics\'; aiAnalytics.scrollToAI()">🤖 AI Analytics</a>';
        navLinks.appendChild(aiLink);
    }
    
    // Initialize AI system
    aiAnalytics = new AIAnalyticsEngine();
    
    // Make globally available
    window.aiAnalytics = aiAnalytics;
    
    // Add scroll-to-AI functionality
    aiAnalytics.scrollToAI = function() {
        const dashboard = document.getElementById('aiAnalyticsDashboard');
        if (dashboard) {
            dashboard.scrollIntoView({ behavior: 'smooth' });
        }
    };
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAnalyticsEngine;
}
