// AI-Generated Insights Engine
// Intelligent analysis and recommendations for farm optimization

class AIInsightsEngine {
    constructor(farmRecordsManager) {
        this.farmManager = farmRecordsManager;
        this.insights = [];
        this.analysisRules = new Map();
        this.trendData = new Map();
        this.performanceBaselines = new Map();
        this.insightHistory = [];
        
        this.severityLevels = {
            CRITICAL: { level: 0, color: '#dc3545', icon: '🚨', priority: 1 },
            HIGH: { level: 1, color: '#fd7e14', icon: '⚠️', priority: 2 },
            MEDIUM: { level: 2, color: '#ffc107', icon: '💡', priority: 3 },
            LOW: { level: 3, color: '#28a745', icon: 'ℹ️', priority: 4 },
            OPPORTUNITY: { level: 4, color: '#17a2b8', icon: '🎯', priority: 5 }
        };

        this.categories = {
            GROWTH: { name: 'Growth & Development', icon: '📈', color: '#28a745' },
            REPRODUCTION: { name: 'Breeding & Reproduction', icon: '💕', color: '#e74c3c' },
            HEALTH: { name: 'Health & Wellness', icon: '🏥', color: '#17a2b8' },
            NUTRITION: { name: 'Feed & Nutrition', icon: '🌾', color: '#f39c12' },
            PRODUCTION: { name: 'Milk Production', icon: '🥛', color: '#6f42c1' },
            FINANCIAL: { name: 'Financial Performance', icon: '💰', color: '#20c997' },
            EFFICIENCY: { name: 'Operational Efficiency', icon: '⚡', color: '#fd7e14' },
            GENETICS: { name: 'Genetic Optimization', icon: '🧬', color: '#6610f2' }
        };

        this.init();
    }

    init() {
        this.setupAnalysisRules();
        this.loadHistoricalData();
        this.calculateBaselines();
        this.startPeriodicAnalysis();
        this.setupEventListeners();
    }

    // ============ ANALYSIS RULES SETUP ============
    setupAnalysisRules() {
        // Growth Performance Analysis
        this.addAnalysisRule('growth_performance', {
            category: 'GROWTH',
            name: 'Daily Weight Gain Analysis',
            description: 'Analyze daily weight gain patterns across goat groups',
            frequency: 'weekly',
            analyze: (data) => this.analyzeGrowthPerformance(data),
            threshold: { min: 0.15, target: 0.25, excellent: 0.35 } // kg per day
        });

        // Breeding Efficiency Analysis
        this.addAnalysisRule('breeding_efficiency', {
            category: 'REPRODUCTION',
            name: 'Breeding Interval Analysis',
            description: 'Monitor kidding intervals and breeding success rates',
            frequency: 'monthly',
            analyze: (data) => this.analyzeBreedingEfficiency(data),
            threshold: { target: 365, warning: 450, critical: 500 } // days between kiddings
        });

        // Milk Production Trends
        this.addAnalysisRule('milk_production', {
            category: 'PRODUCTION',
            name: 'Milk Production Optimization',
            description: 'Analyze milk yield patterns and lactation curves',
            frequency: 'weekly',
            analyze: (data) => this.analyzeMilkProduction(data),
            threshold: { min: 1.5, target: 2.5, excellent: 3.5 } // liters per day
        });

        // Health Pattern Recognition
        this.addAnalysisRule('health_patterns', {
            category: 'HEALTH',
            name: 'Health Issue Pattern Analysis',
            description: 'Identify recurring health issues and prevention opportunities',
            frequency: 'monthly',
            analyze: (data) => this.analyzeHealthPatterns(data),
            threshold: { acceptable: 5, concern: 10, critical: 15 } // % sick animals
        });

        // Feed Efficiency Analysis
        this.addAnalysisRule('feed_efficiency', {
            category: 'NUTRITION',
            name: 'Feed Conversion Efficiency',
            description: 'Optimize feed-to-production ratios',
            frequency: 'weekly',
            analyze: (data) => this.analyzeFeedEfficiency(data),
            threshold: { excellent: 3.0, good: 4.0, poor: 6.0 } // kg feed per kg milk
        });

        // Financial Performance Analysis
        this.addAnalysisRule('financial_trends', {
            category: 'FINANCIAL',
            name: 'Financial Performance Trends',
            description: 'Monitor profitability and cost efficiency',
            frequency: 'monthly',
            analyze: (data) => this.analyzeFinancialTrends(data),
            threshold: { target_margin: 0.30, warning: 0.15, critical: 0.05 }
        });

        // Genetic Potential Analysis
        this.addAnalysisRule('genetic_optimization', {
            category: 'GENETICS',
            name: 'Genetic Improvement Opportunities',
            description: 'Identify breeding pairs for genetic advancement',
            frequency: 'quarterly',
            analyze: (data) => this.analyzeGeneticPotential(data),
            threshold: { improvement_target: 0.10 } // 10% genetic gain target
        });

        // Operational Efficiency Analysis
        this.addAnalysisRule('operational_efficiency', {
            category: 'EFFICIENCY',
            name: 'Operational Workflow Analysis',
            description: 'Optimize daily operations and resource utilization',
            frequency: 'monthly',
            analyze: (data) => this.analyzeOperationalEfficiency(data),
            threshold: { efficiency_target: 0.85 } // 85% efficiency target
        });
    }

    // ============ SPECIFIC ANALYSIS METHODS ============
    
    analyzeGrowthPerformance(data) {
        const insights = [];
        const goats = data.goats || [];
        const weightRecords = this.extractWeightRecords(goats);
        
        // Group goats by category (age, breed, etc.)
        const groups = this.groupGoatsByCharacteristics(goats);
        
        for (const [groupName, groupGoats] of Object.entries(groups)) {
            const avgDailyGain = this.calculateAverageDailyGain(groupGoats, weightRecords);
            const groupSize = groupGoats.length;
            
            if (avgDailyGain < 0.15) {
                insights.push({
                    type: 'growth_concern',
                    severity: 'HIGH',
                    title: `Low Growth Rate in ${groupName}`,
                    message: `${groupName} goats show below-average daily weight gain (${avgDailyGain.toFixed(3)} kg/day). Target: 0.25+ kg/day.`,
                    recommendation: `Review feed quality and quantity for ${groupName}. Consider:
                    • Increasing protein content (16-18% for growing goats)
                    • Adding energy supplements (corn, barley)
                    • Checking for parasites or health issues
                    • Evaluating pasture quality
                    • Consulting with nutritionist`,
                    affected_animals: groupGoats.length,
                    metrics: {
                        current_adg: avgDailyGain,
                        target_adg: 0.25,
                        improvement_potential: `${((0.25 - avgDailyGain) * 30 * groupSize).toFixed(1)} kg additional weight per month`
                    },
                    actions: [
                        { action: 'feed_analysis', priority: 'HIGH', timeline: '1 week' },
                        { action: 'health_check', priority: 'MEDIUM', timeline: '2 weeks' },
                        { action: 'pasture_evaluation', priority: 'MEDIUM', timeline: '1 month' }
                    ]
                });
            } else if (avgDailyGain > 0.35) {
                insights.push({
                    type: 'growth_excellence',
                    severity: 'OPPORTUNITY',
                    title: `Excellent Growth in ${groupName}`,
                    message: `${groupName} goats are achieving excellent daily weight gain (${avgDailyGain.toFixed(3)} kg/day).`,
                    recommendation: `Consider replicating successful practices:
                    • Document current feeding program
                    • Share management practices with other groups
                    • Consider these goats for breeding program
                    • Maintain current management intensity`,
                    affected_animals: groupGoats.length,
                    metrics: {
                        current_adg: avgDailyGain,
                        target_adg: 0.25,
                        excellence_margin: `${((avgDailyGain - 0.25) * 100).toFixed(1)}% above target`
                    }
                });
            }
        }
        
        return insights;
    }

    analyzeBreedingEfficiency(data) {
        const insights = [];
        const breedingRecords = data.breedingRecords || [];
        const goats = data.goats || [];
        
        // Calculate kidding intervals for each doe
        const doesWithIntervals = this.calculateKiddingIntervals(breedingRecords, goats);
        
        // Group by breed or management group
        const breedGroups = this.groupDoesByBreed(doesWithIntervals);
        
        for (const [breed, does] of Object.entries(breedGroups)) {
            const avgInterval = this.calculateAverageKiddingInterval(does);
            const conceptionRate = this.calculateConceptionRate(does, breedingRecords);
            
            if (avgInterval > 450) {
                insights.push({
                    type: 'breeding_interval_concern',
                    severity: avgInterval > 500 ? 'CRITICAL' : 'HIGH',
                    title: `Extended Kidding Intervals - ${breed}`,
                    message: `${breed} does averaging ${avgInterval.toFixed(0)} days between kiddings. Target: 365 days.`,
                    recommendation: `Improve breeding efficiency:
                    • Implement estrus synchronization program
                    • Improve body condition scoring
                    • Review nutrition during breeding season
                    • Consider breeding soundness exams
                    • Evaluate buck fertility
                    • Implement pregnancy checking at 30-45 days`,
                    affected_animals: does.length,
                    metrics: {
                        current_interval: avgInterval,
                        target_interval: 365,
                        conception_rate: conception_rate,
                        lost_productivity: `${((avgInterval - 365) / 365 * 100).toFixed(1)}% reduction in annual productivity`
                    },
                    actions: [
                        { action: 'body_condition_assessment', priority: 'HIGH', timeline: '1 week' },
                        { action: 'breeding_soundness_exam', priority: 'HIGH', timeline: '2 weeks' },
                        { action: 'nutrition_review', priority: 'MEDIUM', timeline: '1 month' }
                    ]
                });
            }
        }
        
        return insights;
    }

    analyzeMilkProduction(data) {
        const insights = [];
        const milkRecords = data.milkRecords || [];
        const goats = data.goats || [];
        
        // Analyze milk production by lactation stage
        const productionAnalysis = this.analyzeLactationCurves(milkRecords, goats);
        
        for (const analysis of productionAnalysis) {
            if (analysis.avgProduction < 1.5) {
                insights.push({
                    type: 'milk_production_concern',
                    severity: 'MEDIUM',
                    title: `Low Milk Production - ${analysis.group}`,
                    message: `${analysis.group} averaging ${analysis.avgProduction.toFixed(2)} L/day. Target: 2.5+ L/day.`,
                    recommendation: `Optimize milk production:
                    • Increase concentrate feeding (0.4-0.5 kg per liter of milk)
                    • Improve forage quality (increase legume content)
                    • Ensure adequate fresh water (3-4 L per L of milk produced)
                    • Check for mastitis or udder health issues
                    • Evaluate milking frequency and technique
                    • Consider genetic potential of the animals`,
                    affected_animals: analysis.animalCount,
                    metrics: {
                        current_production: analysis.avgProduction,
                        target_production: 2.5,
                        potential_increase: `${((2.5 - analysis.avgProduction) * analysis.animalCount * 30).toFixed(0)} additional liters per month`
                    },
                    actions: [
                        { action: 'udder_health_check', priority: 'HIGH', timeline: '1 week' },
                        { action: 'nutrition_optimization', priority: 'MEDIUM', timeline: '2 weeks' },
                        { action: 'milking_technique_review', priority: 'LOW', timeline: '1 month' }
                    ]
                });
            }
        }
        
        return insights;
    }

    analyzeHealthPatterns(data) {
        const insights = [];
        const healthRecords = data.healthRecords || [];
        const goats = data.goats || [];
        
        // Identify recurring health issues
        const healthPatterns = this.identifyHealthPatterns(healthRecords, goats);
        
        for (const pattern of healthPatterns) {
            if (pattern.frequency > 10) { // More than 10% incidence
                insights.push({
                    type: 'health_pattern_alert',
                    severity: pattern.frequency > 20 ? 'CRITICAL' : 'HIGH',
                    title: `Recurring Health Issue: ${pattern.condition}`,
                    message: `${pattern.condition} affecting ${pattern.frequency.toFixed(1)}% of animals. Consider preventive measures.`,
                    recommendation: this.getHealthRecommendation(pattern.condition),
                    affected_animals: pattern.affectedAnimals,
                    metrics: {
                        incidence_rate: pattern.frequency,
                        trend: pattern.trend,
                        seasonal_pattern: pattern.seasonality
                    },
                    actions: this.getHealthActions(pattern.condition)
                });
            }
        }
        
        return insights;
    }

    analyzeFeedEfficiency(data) {
        const insights = [];
        const feedRecords = data.feedRecords || [];
        const milkRecords = data.milkRecords || [];
        
        // Calculate feed conversion efficiency
        const efficiency = this.calculateFeedConversionEfficiency(feedRecords, milkRecords);
        
        if (efficiency.ratio > 4.5) {
            insights.push({
                type: 'feed_efficiency_concern',
                severity: 'MEDIUM',
                title: 'Poor Feed Conversion Efficiency',
                message: `Current feed conversion ratio: ${efficiency.ratio.toFixed(2)} kg feed per kg milk. Target: <4.0`,
                recommendation: `Improve feed efficiency:
                • Analyze feed quality and composition
                • Balance energy-protein ratio
                • Reduce feed wastage
                • Improve forage digestibility
                • Consider feed additives (probiotics, enzymes)
                • Optimize feeding times and frequency`,
                metrics: {
                    current_fcr: efficiency.ratio,
                    target_fcr: 4.0,
                    potential_savings: `${(efficiency.ratio - 4.0) * efficiency.totalMilk * 0.5} kg feed savings possible`
                }
            });
        }
        
        return insights;
    }

    analyzeFinancialTrends(data) {
        const insights = [];
        const transactions = data.transactions || [];
        const sales = data.sales || [];
        
        // Calculate profit margins and trends
        const financialMetrics = this.calculateFinancialMetrics(transactions, sales);
        
        if (financialMetrics.profitMargin < 0.20) {
            insights.push({
                type: 'financial_concern',
                severity: financialMetrics.profitMargin < 0.10 ? 'CRITICAL' : 'HIGH',
                title: 'Low Profit Margins Detected',
                message: `Current profit margin: ${(financialMetrics.profitMargin * 100).toFixed(1)}%. Target: 30%+`,
                recommendation: `Improve profitability:
                • Review feed costs (typically 60-70% of production costs)
                • Optimize milk pricing and marketing channels
                • Reduce waste and improve efficiency
                • Consider value-added products
                • Evaluate animal productivity vs. maintenance costs
                • Implement cost tracking by enterprise`,
                metrics: {
                    current_margin: financialMetrics.profitMargin,
                    target_margin: 0.30,
                    revenue_trend: financialMetrics.revenueTrend,
                    cost_trend: financialMetrics.costTrend
                }
            });
        }
        
        return insights;
    }

    // ============ DATA PROCESSING HELPERS ============
    
    groupGoatsByCharacteristics(goats) {
        const groups = {};
        
        goats.forEach(goat => {
            // Group by breed and age category
            const ageCategory = this.getAgeCategory(goat);
            const groupKey = `${goat.breed || 'Unknown'} - ${ageCategory}`;
            
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(goat);
        });
        
        return groups;
    }

    getAgeCategory(goat) {
        const age = this.calculateAge(goat.dateOfBirth);
        if (age < 6) return 'Kids (0-6 months)';
        if (age < 18) return 'Young (6-18 months)';
        if (age < 60) return 'Adults (1.5-5 years)';
        return 'Mature (5+ years)';
    }

    calculateAge(dateOfBirth) {
        if (!dateOfBirth) return 0;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        return Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 30)); // Age in months
    }

    calculateAverageDailyGain(goats, weightRecords) {
        let totalGain = 0;
        let validRecords = 0;
        
        goats.forEach(goat => {
            const goatWeights = weightRecords.filter(record => 
                record.goatId === goat.id
            ).sort((a, b) => new Date(a.date) - new Date(b.date));
            
            if (goatWeights.length >= 2) {
                const firstWeight = goatWeights[0];
                const lastWeight = goatWeights[goatWeights.length - 1];
                const daysDiff = (new Date(lastWeight.date) - new Date(firstWeight.date)) / (1000 * 60 * 60 * 24);
                
                if (daysDiff > 0) {
                    const dailyGain = (lastWeight.weight - firstWeight.weight) / daysDiff;
                    totalGain += dailyGain;
                    validRecords++;
                }
            }
        });
        
        return validRecords > 0 ? totalGain / validRecords : 0;
    }

    extractWeightRecords(goats) {
        // Extract weight records from goat health records or dedicated weight tracking
        const weightRecords = [];
        
        goats.forEach(goat => {
            if (goat.weightHistory) {
                goat.weightHistory.forEach(record => {
                    weightRecords.push({
                        goatId: goat.id,
                        date: record.date,
                        weight: record.weight
                    });
                });
            }
        });
        
        return weightRecords;
    }

    // ============ INSIGHT GENERATION ============
    
    async generateInsights() {
        console.log('🤖 Generating AI insights...');
        
        const farmData = {
            goats: this.farmManager.goats,
            breedingRecords: this.farmManager.breedingRecords,
            healthRecords: this.farmManager.healthRecords,
            milkRecords: this.farmManager.milkRecords,
            feedRecords: this.farmManager.feedRecords,
            transactions: this.farmManager.transactions,
            sales: this.farmManager.sales
        };
        
        const newInsights = [];
        
        // Run all analysis rules
        for (const [ruleId, rule] of this.analysisRules) {
            try {
                const ruleInsights = rule.analyze(farmData);
                ruleInsights.forEach(insight => {
                    insight.id = this.generateInsightId();
                    insight.timestamp = new Date().toISOString();
                    insight.category = rule.category;
                    insight.source = ruleId;
                    insight.confidence = this.calculateConfidence(insight, farmData);
                    newInsights.push(insight);
                });
            } catch (error) {
                console.error(`Error in analysis rule ${ruleId}:`, error);
            }
        }
        
        // Sort by priority and confidence
        newInsights.sort((a, b) => {
            const severityA = this.severityLevels[a.severity].priority;
            const severityB = this.severityLevels[b.severity].priority;
            
            if (severityA !== severityB) {
                return severityA - severityB;
            }
            
            return b.confidence - a.confidence;
        });
        
        this.insights = newInsights;
        this.saveInsights();
        this.notifyNewInsights(newInsights);
        
        console.log(`🎯 Generated ${newInsights.length} AI insights`);
        return newInsights;
    }

    calculateConfidence(insight, farmData) {
        // Calculate confidence based on data quality and sample size
        let confidence = 0.5; // Base confidence
        
        // Increase confidence based on affected animals
        if (insight.affected_animals > 10) confidence += 0.2;
        if (insight.affected_animals > 20) confidence += 0.1;
        
        // Increase confidence based on data recency
        const dataAge = this.calculateDataAge(farmData);
        if (dataAge < 30) confidence += 0.2; // Recent data
        
        // Increase confidence based on trend consistency
        if (insight.metrics && insight.metrics.trend) {
            confidence += 0.1;
        }
        
        return Math.min(1.0, confidence);
    }

    // ============ UI INTEGRATION ============
    
    showInsightsDashboard() {
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
            padding: 30px;
            max-width: 1000px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            position: relative;
        `;

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #2c3e50; display: flex; align-items: center; gap: 10px;">
                    🤖 AI-Generated Insights
                </h2>
                <div style="display: flex; gap: 10px;">
                    <button onclick="aiInsights.generateInsights()" style="padding: 8px 15px; background: linear-gradient(135deg, #3498db, #2ecc71); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        🔄 Refresh
                    </button>
                    <button id="insights-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #95a5a6;">×</button>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                ${this.renderInsightsSummary()}
            </div>
            
            <div style="margin-bottom: 20px;">
                ${this.renderInsightsFilters()}
            </div>
            
            <div id="insights-container">
                ${this.renderInsightsList()}
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Event listeners
        content.querySelector('#insights-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        return modal;
    }

    renderInsightsSummary() {
        const summary = this.calculateInsightsSummary();
        
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${summary.critical}</div>
                    <div>Critical Issues</div>
                </div>
                <div style="background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${summary.high}</div>
                    <div>High Priority</div>
                </div>
                <div style="background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${summary.opportunities}</div>
                    <div>Opportunities</div>
                </div>
                <div style="background: linear-gradient(135deg, #27ae60, #229954); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold;">${(summary.avgConfidence * 100).toFixed(0)}%</div>
                    <div>Avg Confidence</div>
                </div>
            </div>
        `;
    }

    renderInsightsList() {
        if (!this.insights || this.insights.length === 0) {
            return `
                <div style="text-align: center; padding: 40px; color: #7f8c8d;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🤖</div>
                    <h3>No Insights Available</h3>
                    <p>Click "Refresh" to generate AI insights based on your farm data.</p>
                </div>
            `;
        }

        return this.insights.map(insight => this.renderInsightCard(insight)).join('');
    }

    renderInsightCard(insight) {
        const severity = this.severityLevels[insight.severity];
        const category = this.categories[insight.category];
        
        return `
            <div style="border: 1px solid #e0e0e0; border-left: 4px solid ${severity.color}; border-radius: 8px; padding: 20px; margin-bottom: 15px; background: white;">
                <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 15px;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="background: ${severity.color}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">
                                ${severity.icon} ${insight.severity}
                            </span>
                            <span style="background: ${category.color}20; color: ${category.color}; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">
                                ${category.icon} ${category.name}
                            </span>
                            <span style="color: #7f8c8d; font-size: 0.8rem;">
                                Confidence: ${(insight.confidence * 100).toFixed(0)}%
                            </span>
                        </div>
                        <h4 style="margin: 0 0 10px 0; color: #2c3e50;">${insight.title}</h4>
                        <p style="margin: 0 0 15px 0; color: #5a6c7d; line-height: 1.5;">${insight.message}</p>
                    </div>
                    <div style="margin-left: 15px; text-align: center;">
                        <div style="background: #ecf0f1; padding: 8px 12px; border-radius: 8px; font-size: 0.9rem;">
                            <strong>${insight.affected_animals || 0}</strong><br>
                            <span style="color: #7f8c8d; font-size: 0.8rem;">Animals</span>
                        </div>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <h5 style="margin: 0 0 10px 0; color: #2c3e50;">💡 Recommendations:</h5>
                    <div style="color: #5a6c7d; line-height: 1.6; white-space: pre-line;">${insight.recommendation}</div>
                </div>
                
                ${insight.metrics ? `
                    <div style="background: #e8f6f3; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                        <h5 style="margin: 0 0 10px 0; color: #2c3e50;">📊 Key Metrics:</h5>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                            ${Object.entries(insight.metrics).map(([key, value]) => `
                                <div>
                                    <strong>${key.replace(/_/g, ' ').toUpperCase()}:</strong><br>
                                    <span style="color: #27ae60;">${value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${insight.actions ? `
                    <div style="margin-top: 15px;">
                        <h5 style="margin: 0 0 10px 0; color: #2c3e50;">⚡ Suggested Actions:</h5>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${insight.actions.map(action => `
                                <button onclick="aiInsights.createActionTask('${insight.id}', '${action.action}')" 
                                        style="padding: 6px 12px; background: ${this.getActionColor(action.priority)}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                                    ${action.action.replace(/_/g, ' ')} (${action.timeline})
                                </button>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ecf0f1; display: flex; justify-content: space-between; align-items: center;">
                    <div style="color: #7f8c8d; font-size: 0.8rem;">
                        Generated: ${new Date(insight.timestamp).toLocaleDateString()}
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="aiInsights.dismissInsight('${insight.id}')" 
                                style="padding: 4px 8px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                            Dismiss
                        </button>
                        <button onclick="aiInsights.markAsImplemented('${insight.id}')" 
                                style="padding: 4px 8px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                            Mark Done
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ============ UTILITY METHODS ============
    
    addAnalysisRule(ruleId, rule) {
        this.analysisRules.set(ruleId, rule);
    }

    generateInsightId() {
        return 'insight_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    calculateInsightsSummary() {
        const summary = {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            opportunities: 0,
            avgConfidence: 0
        };

        let totalConfidence = 0;

        this.insights.forEach(insight => {
            switch (insight.severity) {
                case 'CRITICAL': summary.critical++; break;
                case 'HIGH': summary.high++; break;
                case 'MEDIUM': summary.medium++; break;
                case 'LOW': summary.low++; break;
                case 'OPPORTUNITY': summary.opportunities++; break;
            }
            totalConfidence += insight.confidence || 0;
        });

        summary.avgConfidence = this.insights.length > 0 ? totalConfidence / this.insights.length : 0;
        return summary;
    }

    getActionColor(priority) {
        const colors = {
            'HIGH': '#e74c3c',
            'MEDIUM': '#f39c12',
            'LOW': '#3498db'
        };
        return colors[priority] || '#95a5a6';
    }

    // ============ INTEGRATION METHODS ============
    
    startPeriodicAnalysis() {
        // Run insights generation every 6 hours
        setInterval(() => {
            this.generateInsights();
        }, 6 * 60 * 60 * 1000);

        // Initial generation
        setTimeout(() => {
            this.generateInsights();
        }, 5000); // Wait 5 seconds after initialization
    }

    saveInsights() {
        localStorage.setItem('aiInsights', JSON.stringify(this.insights));
        localStorage.setItem('aiInsightsHistory', JSON.stringify(this.insightHistory));
    }

    loadInsights() {
        const saved = localStorage.getItem('aiInsights');
        if (saved) {
            this.insights = JSON.parse(saved);
        }
        
        const history = localStorage.getItem('aiInsightsHistory');
        if (history) {
            this.insightHistory = JSON.parse(history);
        }
    }

    notifyNewInsights(insights) {
        const criticalInsights = insights.filter(i => i.severity === 'CRITICAL');
        const highInsights = insights.filter(i => i.severity === 'HIGH');
        
        if (criticalInsights.length > 0 || highInsights.length > 0) {
            this.showInsightNotification(criticalInsights.length, highInsights.length);
        }
    }

    showInsightNotification(critical, high) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
            z-index: 10001;
            font-family: 'Montserrat', sans-serif;
            max-width: 300px;
            cursor: pointer;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.5rem;">🤖</span>
                <div>
                    <div style="font-weight: 600; margin-bottom: 5px;">New AI Insights</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">
                        ${critical} critical, ${high} high priority issues detected
                    </div>
                </div>
            </div>
        `;
        
        notification.addEventListener('click', () => {
            this.showInsightsDashboard();
            document.body.removeChild(notification);
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 8000);
    }

    setupEventListeners() {
        // Listen for data changes to trigger re-analysis
        document.addEventListener('farmDataUpdated', () => {
            setTimeout(() => {
                this.generateInsights();
            }, 2000); // Delay to allow data to settle
        });
    }

    // ============ MISSING HELPER METHODS ============
    
    calculateKiddingIntervals(breedingRecords, goats) {
        const doesWithIntervals = [];
        
        goats.filter(goat => goat.gender === 'female').forEach(doe => {
            const doeBreedingRecords = breedingRecords
                .filter(record => record.doe === doe.name || record.doeId === doe.id)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            
            if (doeBreedingRecords.length >= 2) {
                const intervals = [];
                for (let i = 1; i < doeBreedingRecords.length; i++) {
                    const interval = (new Date(doeBreedingRecords[i].date) - new Date(doeBreedingRecords[i-1].date)) / (1000 * 60 * 60 * 24);
                    intervals.push(interval);
                }
                
                doesWithIntervals.push({
                    ...doe,
                    intervals: intervals,
                    avgInterval: intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
                });
            }
        });
        
        return doesWithIntervals;
    }

    groupDoesByBreed(doesWithIntervals) {
        const groups = {};
        
        doesWithIntervals.forEach(doe => {
            const breed = doe.breed || 'Unknown';
            if (!groups[breed]) {
                groups[breed] = [];
            }
            groups[breed].push(doe);
        });
        
        return groups;
    }

    calculateAverageKiddingInterval(does) {
        const allIntervals = does.flatMap(doe => doe.intervals || []);
        return allIntervals.length > 0 ? 
            allIntervals.reduce((sum, interval) => sum + interval, 0) / allIntervals.length : 
            0;
    }

    calculateConceptionRate(does, breedingRecords) {
        // Simplified conception rate calculation
        const totalBreedings = breedingRecords.length;
        const successfulBreedings = breedingRecords.filter(record => 
            record.result === 'pregnant' || record.pregnant === true
        ).length;
        
        return totalBreedings > 0 ? successfulBreedings / totalBreedings : 0;
    }

    analyzeLactationCurves(milkRecords, goats) {
        const analyses = [];
        
        // Group by lactating does
        const lactatingDoes = goats.filter(goat => 
            goat.gender === 'female' && goat.status === 'lactating'
        );
        
        const breeds = [...new Set(lactatingDoes.map(goat => goat.breed))];
        
        breeds.forEach(breed => {
            const breedDoes = lactatingDoes.filter(goat => goat.breed === breed);
            const breedMilkRecords = milkRecords.filter(record => 
                breedDoes.some(doe => doe.id === record.goatId || doe.name === record.goatName)
            );
            
            if (breedMilkRecords.length > 0) {
                const avgProduction = breedMilkRecords.reduce((sum, record) => 
                    sum + (parseFloat(record.quantity) || 0), 0
                ) / breedMilkRecords.length;
                
                analyses.push({
                    group: `${breed} Does`,
                    avgProduction: avgProduction,
                    animalCount: breedDoes.length,
                    recordCount: breedMilkRecords.length
                });
            }
        });
        
        return analyses;
    }

    identifyHealthPatterns(healthRecords, goats) {
        const patterns = [];
        const conditionCounts = {};
        const totalAnimals = goats.length;
        
        // Count health conditions
        healthRecords.forEach(record => {
            const condition = record.condition || record.treatment || record.symptom || 'Unknown';
            conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
        });
        
        // Calculate patterns
        Object.entries(conditionCounts).forEach(([condition, count]) => {
            const frequency = (count / totalAnimals) * 100;
            
            if (frequency > 5) { // More than 5% incidence
                patterns.push({
                    condition: condition,
                    frequency: frequency,
                    affectedAnimals: count,
                    trend: this.calculateHealthTrend(condition, healthRecords),
                    seasonality: this.calculateSeasonality(condition, healthRecords)
                });
            }
        });
        
        return patterns;
    }

    calculateHealthTrend(condition, healthRecords) {
        // Simplified trend calculation - compare last 3 months vs previous 3 months
        const now = new Date();
        const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        const sixMonthsAgo = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));
        
        const recentRecords = healthRecords.filter(record => 
            (record.condition === condition || record.treatment === condition) &&
            new Date(record.date) >= threeMonthsAgo
        ).length;
        
        const previousRecords = healthRecords.filter(record => 
            (record.condition === condition || record.treatment === condition) &&
            new Date(record.date) >= sixMonthsAgo && 
            new Date(record.date) < threeMonthsAgo
        ).length;
        
        if (previousRecords === 0) return 'stable';
        const change = (recentRecords - previousRecords) / previousRecords;
        
        if (change > 0.2) return 'increasing';
        if (change < -0.2) return 'decreasing';
        return 'stable';
    }

    calculateSeasonality(condition, healthRecords) {
        // Simple seasonality check
        const seasonCounts = { spring: 0, summer: 0, fall: 0, winter: 0 };
        
        healthRecords.filter(record => 
            record.condition === condition || record.treatment === condition
        ).forEach(record => {
            const month = new Date(record.date).getMonth();
            if (month >= 2 && month <= 4) seasonCounts.spring++;
            else if (month >= 5 && month <= 7) seasonCounts.summer++;
            else if (month >= 8 && month <= 10) seasonCounts.fall++;
            else seasonCounts.winter++;
        });
        
        const maxSeason = Object.keys(seasonCounts).reduce((a, b) => 
            seasonCounts[a] > seasonCounts[b] ? a : b
        );
        
        return maxSeason;
    }

    getHealthRecommendation(condition) {
        const recommendations = {
            'parasites': `Implement parasite management program:
            • Regular fecal egg counts
            • Rotational grazing
            • Strategic deworming
            • Improve pasture drainage
            • Consider copper boluses`,
            
            'mastitis': `Improve udder health:
            • Pre and post milking teat dipping
            • Improve milking hygiene
            • Regular equipment cleaning
            • California Mastitis Test (CMT)
            • Dry doe therapy`,
            
            'pneumonia': `Respiratory health program:
            • Improve ventilation
            • Reduce dust and ammonia
            • Vaccination program
            • Stress reduction
            • Quarantine new animals`,
            
            'foot rot': `Foot health management:
            • Regular hoof trimming
            • Zinc sulfate foot baths
            • Improve pen drainage
            • Reduce overcrowding
            • Copper supplementation`,
            
            'default': `General health improvement:
            • Veterinary consultation
            • Review biosecurity protocols
            • Improve nutrition
            • Reduce stress factors
            • Implement monitoring program`
        };
        
        return recommendations[condition.toLowerCase()] || recommendations['default'];
    }

    getHealthActions(condition) {
        const actions = {
            'parasites': [
                { action: 'fecal_egg_count', priority: 'HIGH', timeline: '1 week' },
                { action: 'pasture_rotation', priority: 'MEDIUM', timeline: '2 weeks' },
                { action: 'deworming_program', priority: 'HIGH', timeline: '1 week' }
            ],
            'mastitis': [
                { action: 'milking_hygiene_audit', priority: 'HIGH', timeline: '3 days' },
                { action: 'equipment_cleaning_check', priority: 'HIGH', timeline: '1 week' },
                { action: 'cmt_testing', priority: 'MEDIUM', timeline: '1 week' }
            ],
            'default': [
                { action: 'veterinary_consultation', priority: 'HIGH', timeline: '1 week' },
                { action: 'management_review', priority: 'MEDIUM', timeline: '2 weeks' }
            ]
        };
        
        return actions[condition.toLowerCase()] || actions['default'];
    }

    calculateFeedConversionEfficiency(feedRecords, milkRecords) {
        // Simplified FCR calculation
        const totalFeed = feedRecords.reduce((sum, record) => 
            sum + (parseFloat(record.quantity) || 0), 0
        );
        
        const totalMilk = milkRecords.reduce((sum, record) => 
            sum + (parseFloat(record.quantity) || 0), 0
        );
        
        return {
            ratio: totalMilk > 0 ? totalFeed / totalMilk : 0,
            totalFeed: totalFeed,
            totalMilk: totalMilk
        };
    }

    calculateFinancialMetrics(transactions, sales) {
        const revenue = sales.reduce((sum, sale) => sum + (parseFloat(sale.amount) || 0), 0);
        const costs = transactions.reduce((sum, transaction) => 
            sum + (parseFloat(transaction.amount) || 0), 0
        );
        
        return {
            revenue: revenue,
            costs: costs,
            profit: revenue - costs,
            profitMargin: revenue > 0 ? (revenue - costs) / revenue : 0,
            revenueTrend: this.calculateTrend(sales),
            costTrend: this.calculateTrend(transactions)
        };
    }

    calculateTrend(records) {
        // Simple trend calculation
        if (records.length < 2) return 'insufficient_data';
        
        const sorted = records.sort((a, b) => new Date(a.date) - new Date(b.date));
        const midpoint = Math.floor(sorted.length / 2);
        
        const firstHalf = sorted.slice(0, midpoint);
        const secondHalf = sorted.slice(midpoint);
        
        const firstAvg = firstHalf.reduce((sum, record) => 
            sum + (parseFloat(record.amount) || 0), 0
        ) / firstHalf.length;
        
        const secondAvg = secondHalf.reduce((sum, record) => 
            sum + (parseFloat(record.amount) || 0), 0
        ) / secondHalf.length;
        
        if (secondAvg > firstAvg * 1.1) return 'increasing';
        if (secondAvg < firstAvg * 0.9) return 'decreasing';
        return 'stable';
    }

    analyzeGeneticPotential(data) {
        // Placeholder for genetic analysis
        return [];
    }

    analyzeOperationalEfficiency(data) {
        // Placeholder for efficiency analysis
        return [];
    }

    calculateDataAge(farmData) {
        // Calculate average age of data
        const allRecords = [
            ...farmData.healthRecords,
            ...farmData.milkRecords,
            ...farmData.feedRecords
        ];
        
        if (allRecords.length === 0) return 365; // No data = very old
        
        const now = new Date();
        const avgAge = allRecords.reduce((sum, record) => {
            const recordDate = new Date(record.date);
            const ageInDays = (now - recordDate) / (1000 * 60 * 60 * 24);
            return sum + ageInDays;
        }, 0) / allRecords.length;
        
        return avgAge;
    }

    loadHistoricalData() {
        this.loadInsights();
    }

    calculateBaselines() {
        // Calculate performance baselines from historical data
        const goats = this.farmManager.goats || [];
        
        // Daily gain baseline
        this.performanceBaselines.set('daily_gain', {
            excellent: 0.35,
            good: 0.25,
            poor: 0.15
        });
        
        // Milk production baseline  
        this.performanceBaselines.set('milk_production', {
            excellent: 3.5,
            good: 2.5,
            poor: 1.5
        });
        
        // Kidding interval baseline
        this.performanceBaselines.set('kidding_interval', {
            excellent: 350,
            good: 365,
            poor: 450
        });
    }

    renderInsightsFilters() {
        return `
            <div class="insights-filters">
                <span style="font-weight: 600; color: #2c3e50; margin-right: 10px;">Filter by:</span>
                <button class="insights-filter active" onclick="aiInsights.filterInsights('all')">All</button>
                <button class="insights-filter" onclick="aiInsights.filterInsights('CRITICAL')">Critical</button>
                <button class="insights-filter" onclick="aiInsights.filterInsights('HIGH')">High</button>
                <button class="insights-filter" onclick="aiInsights.filterInsights('OPPORTUNITY')">Opportunities</button>
                <button class="insights-filter" onclick="aiInsights.filterInsights('GROWTH')">Growth</button>
                <button class="insights-filter" onclick="aiInsights.filterInsights('REPRODUCTION')">Breeding</button>
                <button class="insights-filter" onclick="aiInsights.filterInsights('HEALTH')">Health</button>
            </div>
        `;
    }

    filterInsights(filter) {
        // Update active filter button
        document.querySelectorAll('.insights-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Filter insights
        let filteredInsights = this.insights;
        
        if (filter !== 'all') {
            if (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'OPPORTUNITY'].includes(filter)) {
                filteredInsights = this.insights.filter(insight => insight.severity === filter);
            } else {
                filteredInsights = this.insights.filter(insight => insight.category === filter);
            }
        }
        
        // Re-render insights list
        const container = document.getElementById('insights-container');
        if (container) {
            container.innerHTML = filteredInsights.map(insight => this.renderInsightCard(insight)).join('');
        }
    }

    createActionTask(insightId, actionName) {
        // Create a task from an insight action
        const insight = this.insights.find(i => i.id === insightId);
        if (!insight) return;
        
        const task = {
            id: 'task_' + Date.now(),
            title: `${actionName.replace(/_/g, ' ').toUpperCase()}: ${insight.title}`,
            description: `Action required from AI insight: ${insight.message}`,
            priority: 'high',
            category: 'ai_insight',
            dueDate: this.calculateDueDate(actionName),
            assignedTo: 'farm_manager',
            status: 'pending',
            relatedInsight: insightId,
            createdDate: new Date().toISOString()
        };
        
        // Add to farm manager tasks if available
        if (this.farmManager && this.farmManager.tasks) {
            this.farmManager.tasks.push(task);
            this.farmManager.saveTasks();
        }
        
        this.showNotification(`Task created: ${task.title}`, 'success');
    }

    calculateDueDate(actionName) {
        const urgentActions = ['veterinary_consultation', 'health_check', 'fecal_egg_count'];
        const mediumActions = ['feed_analysis', 'nutrition_review', 'breeding_soundness_exam'];
        
        const now = new Date();
        let daysToAdd = 7; // Default 1 week
        
        if (urgentActions.includes(actionName)) {
            daysToAdd = 3;
        } else if (mediumActions.includes(actionName)) {
            daysToAdd = 14;
        }
        
        return new Date(now.getTime() + (daysToAdd * 24 * 60 * 60 * 1000)).toISOString();
    }

    dismissInsight(insightId) {
        this.insights = this.insights.filter(insight => insight.id !== insightId);
        this.saveInsights();
        
        // Re-render insights
        const container = document.getElementById('insights-container');
        if (container) {
            container.innerHTML = this.renderInsightsList();
        }
        
        this.showNotification('Insight dismissed', 'info');
    }

    markAsImplemented(insightId) {
        const insight = this.insights.find(i => i.id === insightId);
        if (insight) {
            insight.status = 'implemented';
            insight.implementedDate = new Date().toISOString();
            
            // Move to history
            this.insightHistory.push(insight);
            this.insights = this.insights.filter(i => i.id !== insightId);
            
            this.saveInsights();
            
            // Re-render insights
            const container = document.getElementById('insights-container');
            if (container) {
                container.innerHTML = this.renderInsightsList();
            }
            
            this.showNotification('Insight marked as implemented', 'success');
        }
    }

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

    addInsightsButton() {
        const insightsBtn = document.createElement('button');
        insightsBtn.id = 'ai-insights-btn';
        insightsBtn.style.cssText = `
            position: fixed;
            bottom: 160px;
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
        insightsBtn.innerHTML = '🤖';
        insightsBtn.title = 'AI Insights';

        insightsBtn.addEventListener('mouseenter', () => {
            insightsBtn.style.transform = 'scale(1.1)';
            insightsBtn.style.boxShadow = '0 6px 20px rgba(155, 89, 182, 0.6)';
        });

        insightsBtn.addEventListener('mouseleave', () => {
            insightsBtn.style.transform = 'scale(1)';
            insightsBtn.style.boxShadow = '0 4px 15px rgba(155, 89, 182, 0.4)';
        });

        insightsBtn.addEventListener('click', () => {
            this.showInsightsDashboard();
        });

        document.body.appendChild(insightsBtn);
    }
}

// Global instance
let aiInsights = null;

// Initialize when farm manager is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.farmManager) {
        aiInsights = new AIInsightsEngine(window.farmManager);
        aiInsights.addInsightsButton();
    }
});
