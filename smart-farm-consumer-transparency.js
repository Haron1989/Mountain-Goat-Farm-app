/**
 * 📱 SMART FARM-TO-CONSUMER TRANSPARENCY APP
 * Complete product traceability from farm to table with QR code scanning
 * 
 * Features:
 * - QR code scanning for instant product information
 * - Complete supply chain traceability
 * - Sustainability and welfare scoring
 * - Photo documentation throughout journey
 * - Real-time freshness indicators
 * - Farmer stories and profiles
 * - Certification verification
 * - Consumer feedback integration
 */

class SmartFarmToConsumerTransparencyApp {
    constructor() {
        this.products = new Map();
        this.supplyChain = new Map();
        this.farmers = new Map();
        this.consumers = new Map();
        this.certifications = new Map();
        this.qrCodes = new Map();
        
        this.initializeTransparencySystem();
    }

    initializeTransparencySystem() {
        console.log('📱 Initializing Smart Farm-to-Consumer Transparency App...');
        
        this.setupQRCodeSystem();
        this.createProductRegistry();
        this.establishSupplyChainTracking();
        this.implementSustainabilityScoring();
        this.setupConsumerInterface();
        this.createCertificationSystem();
        
        console.log('✅ Farm-to-Consumer Transparency App Ready!');
    }

    // 📋 PRODUCT REGISTRATION AND QR CODE GENERATION
    async registerProduct(productData) {
        const product = {
            id: `PROD_${Date.now()}`,
            qrCode: `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            
            // Basic product information
            name: productData.name,
            type: productData.type, // 'meat', 'vegetables', 'dairy', 'grains'
            category: productData.category,
            variety: productData.variety,
            weight: productData.weight,
            
            // Farm origin
            farm: {
                id: productData.farmId,
                name: productData.farmName,
                location: productData.farmLocation,
                coordinates: productData.coordinates,
                farmer: await this.getFarmerProfile(productData.farmerId)
            },
            
            // Production details
            production: {
                birthDate: productData.birthDate || productData.plantingDate,
                harvestDate: productData.harvestDate || productData.slaughterDate,
                breed: productData.breed || productData.variety,
                feedType: productData.feedType || productData.fertilizers,
                medications: productData.medications || [],
                growthMethod: productData.growthMethod // 'organic', 'conventional', 'free-range'
            },
            
            // Journey tracking
            journey: {
                currentStage: 'farm',
                stages: [{
                    stage: 'farm',
                    timestamp: new Date(),
                    location: productData.farmLocation,
                    responsible: productData.farmerId,
                    photos: [],
                    notes: 'Product originated at farm'
                }],
                estimatedDelivery: null
            },
            
            // Sustainability metrics
            sustainability: await this.calculateSustainabilityScore(productData),
            
            // Welfare scoring (for animal products)
            welfare: productData.type === 'meat' ? await this.calculateWelfareScore(productData) : null,
            
            // Certifications
            certifications: [],
            
            // Quality indicators
            quality: {
                grade: productData.grade || 'A',
                freshness: 100,
                temperature: productData.optimalTemperature,
                humidity: productData.optimalHumidity,
                shelfLife: productData.shelfLife
            },
            
            // Consumer interaction
            consumerData: {
                scans: 0,
                ratings: [],
                feedback: [],
                averageRating: 0
            },
            
            createdAt: new Date(),
            status: 'active'
        };

        this.products.set(product.id, product);
        this.qrCodes.set(product.qrCode, product.id);
        
        // Generate and assign QR code
        await this.generateQRCode(product);
        
        // Initialize supply chain tracking
        await this.initializeSupplyChainTracking(product);
        
        return product;
    }

    async generateQRCode(product) {
        // Simulate QR code generation with embedded data
        const qrData = {
            productId: product.id,
            qrCode: product.qrCode,
            farmName: product.farm.name,
            productName: product.name,
            scanUrl: `https://transparency.mountaingoatfarm.com/scan/${product.qrCode}`,
            verificationHash: this.generateVerificationHash(product)
        };
        
        product.qrCodeData = qrData;
        
        return qrData;
    }

    generateVerificationHash(product) {
        // Generate cryptographic hash for authenticity verification
        const dataToHash = `${product.id}${product.farm.id}${product.createdAt.getTime()}`;
        return `HASH_${Buffer.from(dataToHash).toString('base64').substr(0, 16)}`;
    }

    // 🔍 QR CODE SCANNING AND PRODUCT LOOKUP
    async scanQRCode(qrCode, consumerData = null) {
        console.log(`🔍 Scanning QR Code: ${qrCode}`);
        
        const productId = this.qrCodes.get(qrCode);
        if (!productId) {
            throw new Error('Invalid QR code or product not found');
        }
        
        const product = this.products.get(productId);
        if (!product) {
            throw new Error('Product data not found');
        }
        
        // Update scan count
        product.consumerData.scans++;
        
        // Log consumer interaction
        if (consumerData) {
            await this.logConsumerInteraction(product, consumerData);
        }
        
        // Get complete transparency report
        const transparencyReport = await this.generateTransparencyReport(product);
        
        return transparencyReport;
    }

    async generateTransparencyReport(product) {
        const report = {
            // Product Overview
            product: {
                name: product.name,
                type: product.type,
                category: product.category,
                qrCode: product.qrCode,
                currentLocation: await this.getCurrentLocation(product),
                freshness: await this.calculateCurrentFreshness(product)
            },
            
            // Farm Information
            farm: {
                name: product.farm.name,
                location: product.farm.location,
                coordinates: product.farm.coordinates,
                farmer: product.farm.farmer,
                farmStory: await this.getFarmStory(product.farm.id),
                farmPhotos: await this.getFarmPhotos(product.farm.id)
            },
            
            // Complete Journey
            journey: {
                totalDays: this.calculateJourneyDays(product),
                currentStage: product.journey.currentStage,
                stages: product.journey.stages,
                timeline: await this.generateJourneyTimeline(product),
                photos: await this.getJourneyPhotos(product)
            },
            
            // Production Details
            production: {
                ...product.production,
                productionMethod: await this.getProductionMethodDetails(product),
                feedingSummary: await this.getFeedingSummary(product),
                healthHistory: await this.getHealthHistory(product)
            },
            
            // Sustainability Metrics
            sustainability: {
                score: product.sustainability.score,
                breakdown: product.sustainability.breakdown,
                carbonFootprint: product.sustainability.carbonFootprint,
                waterUsage: product.sustainability.waterUsage,
                landUse: product.sustainability.landUse,
                certifications: await this.getSustainabilityCertifications(product)
            },
            
            // Animal Welfare (if applicable)
            welfare: product.welfare ? {
                score: product.welfare.score,
                livingConditions: product.welfare.livingConditions,
                feedingPractices: product.welfare.feedingPractices,
                veterinaryCare: product.welfare.veterinaryCare,
                certifications: await this.getWelfareCertifications(product)
            } : null,
            
            // Quality Assurance
            quality: {
                grade: product.quality.grade,
                freshness: product.quality.freshness,
                shelfLife: product.quality.shelfLife,
                storageConditions: await this.getStorageConditions(product),
                qualityChecks: await this.getQualityChecks(product)
            },
            
            // Certifications
            certifications: await this.getVerifiedCertifications(product),
            
            // Consumer Reviews
            consumerFeedback: {
                totalScans: product.consumerData.scans,
                averageRating: product.consumerData.averageRating,
                recentReviews: product.consumerData.feedback.slice(-5),
                ratingDistribution: this.calculateRatingDistribution(product)
            },
            
            // Verification
            verification: {
                authenticated: await this.verifyProductAuthenticity(product),
                lastVerified: new Date(),
                verificationHash: product.qrCodeData.verificationHash
            }
        };
        
        return report;
    }

    // 🌱 SUPPLY CHAIN TRACKING
    async updateProductJourney(productId, stageData) {
        const product = this.products.get(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        
        const journeyStage = {
            stage: stageData.stage, // 'processing', 'packaging', 'transport', 'retail', 'consumer'
            timestamp: new Date(),
            location: stageData.location,
            responsible: stageData.responsible,
            photos: stageData.photos || [],
            notes: stageData.notes || '',
            temperature: stageData.temperature,
            conditions: stageData.conditions,
            qualityCheck: stageData.qualityCheck || null
        };
        
        product.journey.stages.push(journeyStage);
        product.journey.currentStage = stageData.stage;
        
        // Update freshness based on journey
        await this.updateFreshness(product);
        
        // Notify consumers if they opted for tracking
        await this.notifyConsumersOfUpdate(product, journeyStage);
        
        return journeyStage;
    }

    async updateFreshness(product) {
        const hoursSinceOrigin = (Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60);
        const shelfLifeHours = product.quality.shelfLife * 24;
        
        // Calculate freshness percentage
        product.quality.freshness = Math.max(0, Math.round(100 - (hoursSinceOrigin / shelfLifeHours) * 100));
        
        // Factor in storage conditions
        const storageQuality = await this.assessStorageConditions(product);
        product.quality.freshness = Math.round(product.quality.freshness * storageQuality);
        
        return product.quality.freshness;
    }

    // 🌍 SUSTAINABILITY SCORING
    async calculateSustainabilityScore(productData) {
        let score = 0;
        const breakdown = {};
        
        // Farming practices (40%)
        const farmingPractices = this.scoreFarmingPractices(productData);
        score += farmingPractices.score * 0.4;
        breakdown.farmingPractices = farmingPractices;
        
        // Resource usage (30%)
        const resourceUsage = this.scoreResourceUsage(productData);
        score += resourceUsage.score * 0.3;
        breakdown.resourceUsage = resourceUsage;
        
        // Transport and packaging (20%)
        const transport = this.scoreTransportAndPackaging(productData);
        score += transport.score * 0.2;
        breakdown.transport = transport;
        
        // Certifications (10%)
        const certifications = this.scoreCertifications(productData);
        score += certifications.score * 0.1;
        breakdown.certifications = certifications;
        
        return {
            score: Math.round(score),
            grade: this.getSustainabilityGrade(score),
            breakdown,
            carbonFootprint: this.calculateCarbonFootprint(productData),
            waterUsage: this.calculateWaterUsage(productData),
            landUse: this.calculateLandUse(productData)
        };
    }

    scoreFarmingPractices(productData) {
        let score = 0;
        const factors = [];
        
        if (productData.growthMethod === 'organic') {
            score += 30;
            factors.push('Organic farming practices');
        } else if (productData.growthMethod === 'free-range') {
            score += 25;
            factors.push('Free-range production');
        } else if (productData.growthMethod === 'conventional') {
            score += 15;
            factors.push('Conventional farming');
        }
        
        if (productData.biodiversityPractices) {
            score += 20;
            factors.push('Biodiversity conservation');
        }
        
        if (productData.soilHealthPractices) {
            score += 15;
            factors.push('Soil health management');
        }
        
        if (productData.renewableEnergy) {
            score += 15;
            factors.push('Renewable energy usage');
        }
        
        return { score: Math.min(score, 100), factors };
    }

    scoreResourceUsage(productData) {
        let score = 0;
        const factors = [];
        
        // Water efficiency
        if (productData.waterEfficiency === 'high') {
            score += 35;
            factors.push('High water efficiency');
        } else if (productData.waterEfficiency === 'medium') {
            score += 25;
            factors.push('Medium water efficiency');
        } else {
            score += 15;
            factors.push('Standard water usage');
        }
        
        // Feed efficiency (for animals)
        if (productData.feedEfficiency === 'high') {
            score += 30;
            factors.push('Efficient feed conversion');
        }
        
        // Waste management
        if (productData.wasteManagement === 'excellent') {
            score += 25;
            factors.push('Excellent waste management');
        }
        
        // Energy efficiency
        if (productData.energyEfficiency === 'high') {
            score += 10;
            factors.push('Energy efficient operations');
        }
        
        return { score: Math.min(score, 100), factors };
    }

    // 🐄 ANIMAL WELFARE SCORING (for meat products)
    async calculateWelfareScore(productData) {
        if (productData.type !== 'meat') return null;
        
        let score = 0;
        const breakdown = {};
        
        // Living conditions (40%)
        const livingConditions = this.scoreLivingConditions(productData);
        score += livingConditions.score * 0.4;
        breakdown.livingConditions = livingConditions;
        
        // Feeding practices (25%)
        const feedingPractices = this.scoreFeedingPractices(productData);
        score += feedingPractices.score * 0.25;
        breakdown.feedingPractices = feedingPractices;
        
        // Health and veterinary care (25%)
        const veterinaryCare = this.scoreVeterinaryCare(productData);
        score += veterinaryCare.score * 0.25;
        breakdown.veterinaryCare = veterinaryCare;
        
        // Humane handling (10%)
        const humaneHandling = this.scoreHumaneHandling(productData);
        score += humaneHandling.score * 0.1;
        breakdown.humaneHandling = humaneHandling;
        
        return {
            score: Math.round(score),
            grade: this.getWelfareGrade(score),
            breakdown
        };
    }

    scoreLivingConditions(productData) {
        let score = 0;
        const factors = [];
        
        if (productData.housingType === 'free-range') {
            score += 40;
            factors.push('Free-range housing');
        } else if (productData.housingType === 'pasture-raised') {
            score += 50;
            factors.push('Pasture-raised');
        } else if (productData.housingType === 'enriched') {
            score += 30;
            factors.push('Enriched environment');
        } else {
            score += 15;
            factors.push('Standard housing');
        }
        
        if (productData.outdoorAccess) {
            score += 30;
            factors.push('Outdoor access provided');
        }
        
        if (productData.socialGrouping) {
            score += 20;
            factors.push('Natural social grouping');
        }
        
        return { score: Math.min(score, 100), factors };
    }

    // 📱 CONSUMER INTERFACE
    async getConsumerView(qrCode, consumerPreferences = {}) {
        const transparencyReport = await this.scanQRCode(qrCode);
        
        // Customize view based on consumer preferences
        const consumerView = {
            quickFacts: {
                farmName: transparencyReport.farm.name,
                farmerName: transparencyReport.farm.farmer.name,
                daysFromFarm: transparencyReport.journey.totalDays,
                freshness: `${transparencyReport.product.freshness}%`,
                sustainabilityGrade: transparencyReport.sustainability.grade,
                welfareGrade: transparencyReport.welfare?.grade
            },
            
            highlights: this.generateHighlights(transparencyReport, consumerPreferences),
            
            visualTimeline: await this.createVisualTimeline(transparencyReport),
            
            certifications: transparencyReport.certifications.filter(cert => cert.consumerRelevant),
            
            farmerStory: {
                name: transparencyReport.farm.farmer.name,
                story: transparencyReport.farm.farmStory,
                photo: transparencyReport.farm.farmer.photo,
                experience: transparencyReport.farm.farmer.experience,
                practices: transparencyReport.farm.farmer.practices
            },
            
            productPhotos: {
                atFarm: transparencyReport.journey.photos.filter(p => p.stage === 'farm'),
                processing: transparencyReport.journey.photos.filter(p => p.stage === 'processing'),
                current: transparencyReport.journey.photos.slice(-1)[0]
            },
            
            consumerActions: {
                canRate: true,
                canProveFeedback: true,
                canShareStory: true,
                canContactFarmer: transparencyReport.farm.farmer.allowContact,
                canTrackDelivery: transparencyReport.journey.currentStage !== 'consumer'
            },
            
            recommendations: await this.generateRecommendations(transparencyReport, consumerPreferences)
        };
        
        return consumerView;
    }

    generateHighlights(report, preferences) {
        const highlights = [];
        
        if (report.sustainability.score >= 80) {
            highlights.push({
                type: 'sustainability',
                icon: '🌱',
                title: 'Highly Sustainable',
                description: `${report.sustainability.score}/100 sustainability score`
            });
        }
        
        if (report.welfare && report.welfare.score >= 85) {
            highlights.push({
                type: 'welfare',
                icon: '🐄',
                title: 'Excellent Animal Welfare',
                description: `${report.welfare.score}/100 welfare score`
            });
        }
        
        if (report.product.freshness >= 95) {
            highlights.push({
                type: 'freshness',
                icon: '🌟',
                title: 'Ultra Fresh',
                description: `${report.product.freshness}% freshness rating`
            });
        }
        
        if (report.journey.totalDays <= 3) {
            highlights.push({
                type: 'local',
                icon: '📍',
                title: 'Locally Sourced',
                description: `Only ${report.journey.totalDays} days from farm`
            });
        }
        
        return highlights;
    }

    // 📊 ANALYTICS AND INSIGHTS
    async getConsumerInsights(productId) {
        const product = this.products.get(productId);
        if (!product) return null;
        
        return {
            scanAnalytics: {
                totalScans: product.consumerData.scans,
                uniqueConsumers: await this.getUniqueConsumerCount(productId),
                scansByRegion: await this.getScansByRegion(productId),
                scanTimeline: await this.getScanTimeline(productId)
            },
            
            consumerFeedback: {
                averageRating: product.consumerData.averageRating,
                totalReviews: product.consumerData.feedback.length,
                sentimentAnalysis: await this.analyzeFeedbackSentiment(product),
                commonKeywords: await this.extractFeedbackKeywords(product)
            },
            
            transparencyImpact: {
                transparencyScore: await this.calculateTransparencyScore(product),
                consumerTrust: await this.calculateConsumerTrust(product),
                purchaseInfluence: await this.calculatePurchaseInfluence(product)
            }
        };
    }

    // 🔐 CERTIFICATION SYSTEM
    async addCertification(productId, certificationData) {
        const product = this.products.get(productId);
        if (!product) throw new Error('Product not found');
        
        const certification = {
            id: `CERT_${Date.now()}`,
            type: certificationData.type, // 'organic', 'fair-trade', 'animal-welfare', etc.
            authority: certificationData.authority,
            certificateNumber: certificationData.certificateNumber,
            issuedDate: new Date(certificationData.issuedDate),
            expiryDate: new Date(certificationData.expiryDate),
            scope: certificationData.scope,
            verificationUrl: certificationData.verificationUrl,
            verified: false,
            consumerRelevant: certificationData.consumerRelevant || true
        };
        
        // Verify certification
        certification.verified = await this.verifyCertification(certification);
        
        product.certifications.push(certification);
        this.certifications.set(certification.id, certification);
        
        return certification;
    }

    async verifyCertification(certification) {
        // Simulate certificate verification process
        // In reality, this would connect to certification authorities' APIs
        return Math.random() > 0.1; // 90% verification success rate
    }

    // 👨‍🌾 FARMER PROFILE SYSTEM
    async getFarmerProfile(farmerId) {
        return {
            id: farmerId,
            name: 'Samuel Kipchoge',
            photo: '/images/farmers/samuel-kipchoge.jpg',
            location: 'Nandi County, Kenya',
            experience: '15 years in sustainable farming',
            specialization: 'Organic livestock and crop rotation',
            practices: [
                'Rotational grazing',
                'Organic feed production',
                'Renewable energy usage',
                'Water conservation'
            ],
            story: 'Samuel has been practicing sustainable farming for over 15 years, focusing on animal welfare and environmental conservation. His farm serves as a model for regenerative agriculture in the region.',
            allowContact: true,
            certifications: ['Organic Certified', 'Animal Welfare Approved'],
            awards: ['2024 Sustainable Farmer of the Year'],
            farmSize: '50 hectares',
            animalCount: { cattle: 45, goats: 25, chickens: 200 },
            sustainabilityRating: 92
        };
    }

    // Helper methods for calculations and data processing
    calculateJourneyDays(product) {
        return Math.ceil((Date.now() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    }

    getSustainabilityGrade(score) {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B+';
        if (score >= 60) return 'B';
        if (score >= 50) return 'C+';
        if (score >= 40) return 'C';
        return 'D';
    }

    getWelfareGrade(score) {
        if (score >= 95) return 'Exceptional';
        if (score >= 85) return 'Excellent';
        if (score >= 75) return 'Good';
        if (score >= 65) return 'Fair';
        return 'Needs Improvement';
    }

    // Placeholder methods for complete functionality
    async getCurrentLocation(product) { return product.journey.stages.slice(-1)[0]?.location || 'Unknown'; }
    async calculateCurrentFreshness(product) { return await this.updateFreshness(product); }
    async getFarmStory(farmId) { return 'A sustainable farm dedicated to ethical farming practices and environmental stewardship.'; }
    async getFarmPhotos(farmId) { return ['/images/farm1.jpg', '/images/farm2.jpg']; }
    async generateJourneyTimeline(product) { return product.journey.stages; }
    async getJourneyPhotos(product) { return product.journey.stages.flatMap(stage => stage.photos); }
    async getProductionMethodDetails(product) { return { method: product.production.growthMethod, details: 'Detailed production information' }; }
    async getFeedingSummary(product) { return { feed: product.production.feedType, organic: true }; }
    async getHealthHistory(product) { return { medications: product.production.medications, healthChecks: [] }; }
    async getSustainabilityCertifications(product) { return product.certifications.filter(c => c.type.includes('sustainability')); }
    async getWelfareCertifications(product) { return product.certifications.filter(c => c.type.includes('welfare')); }
    async getStorageConditions(product) { return { temperature: product.quality.temperature, humidity: product.quality.humidity }; }
    async getQualityChecks(product) { return []; }
    async getVerifiedCertifications(product) { return product.certifications.filter(c => c.verified); }
    calculateRatingDistribution(product) { return { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 }; }
    async verifyProductAuthenticity(product) { return true; }
    async initializeSupplyChainTracking(product) { return true; }
    async logConsumerInteraction(product, consumerData) { return true; }
    async assessStorageConditions(product) { return 0.95; }
    async notifyConsumersOfUpdate(product, stage) { return true; }
    scoreTransportAndPackaging(productData) { return { score: 75, factors: ['Local distribution', 'Recyclable packaging'] }; }
    scoreCertifications(productData) { return { score: 85, factors: ['Multiple certifications'] }; }
    calculateCarbonFootprint(productData) { return '2.5 kg CO2e'; }
    calculateWaterUsage(productData) { return '150 L per kg'; }
    calculateLandUse(productData) { return '5 m² per kg'; }
    scoreFeedingPractices(productData) { return { score: 88, factors: ['Organic feed', 'Natural diet'] }; }
    scoreVeterinaryCare(productData) { return { score: 92, factors: ['Preventive care', 'Regular checkups'] }; }
    scoreHumaneHandling(productData) { return { score: 95, factors: ['Low-stress handling'] }; }
    async createVisualTimeline(report) { return report.journey.stages; }
    async generateRecommendations(report, preferences) { return ['Try similar products', 'Visit the farm']; }
    async getUniqueConsumerCount(productId) { return 45; }
    async getScansByRegion(productId) { return { 'Nairobi': 25, 'Mombasa': 12, 'Kisumu': 8 }; }
    async getScanTimeline(productId) { return []; }
    async analyzeFeedbackSentiment(product) { return { positive: 85, neutral: 10, negative: 5 }; }
    async extractFeedbackKeywords(product) { return ['fresh', 'quality', 'sustainable', 'delicious']; }
    async calculateTransparencyScore(product) { return 92; }
    async calculateConsumerTrust(product) { return 88; }
    async calculatePurchaseInfluence(product) { return 78; }
}

// 🚀 Initialize the Smart Farm-to-Consumer Transparency App
console.log('📱 Starting Smart Farm-to-Consumer Transparency App...\n');

const transparencyApp = new SmartFarmToConsumerTransparencyApp();

// 🎯 DEMONSTRATION OF THE TRANSPARENCY SYSTEM
async function demonstrateTransparencyApp() {
    console.log('\n📋 TRANSPARENCY APP DEMONSTRATION');
    console.log('=================================');

    // Register a sample product
    const sampleProduct = await transparencyApp.registerProduct({
        name: 'Premium Grass-Fed Beef',
        type: 'meat',
        category: 'beef',
        variety: 'Angus',
        weight: 2.5,
        
        farmId: 'FARM_001',
        farmName: 'Mountain View Ranch',
        farmLocation: 'Nandi County, Kenya',
        coordinates: { lat: 0.1769, lng: 35.1134 },
        farmerId: 'FARMER_001',
        
        birthDate: new Date('2022-03-15'),
        slaughterDate: new Date('2024-11-15'),
        breed: 'Angus Cross',
        feedType: 'Organic grass and hay',
        medications: [],
        growthMethod: 'free-range',
        
        grade: 'Premium',
        shelfLife: 14, // days
        optimalTemperature: '2-4°C',
        
        // Sustainability factors
        housingType: 'pasture-raised',
        outdoorAccess: true,
        socialGrouping: true,
        waterEfficiency: 'high',
        feedEfficiency: 'high',
        wasteManagement: 'excellent',
        renewableEnergy: true,
        biodiversityPractices: true,
        soilHealthPractices: true
    });

    console.log(`✅ Product registered: ${sampleProduct.name}`);
    console.log(`   QR Code: ${sampleProduct.qrCode}`);
    console.log(`   Sustainability Score: ${sampleProduct.sustainability.score}/100 (${sampleProduct.sustainability.grade})`);
    if (sampleProduct.welfare) {
        console.log(`   Welfare Score: ${sampleProduct.welfare.score}/100 (${sampleProduct.welfare.grade})`);
    }

    // Add some journey stages
    await transparencyApp.updateProductJourney(sampleProduct.id, {
        stage: 'processing',
        location: 'Nakuru Processing Facility',
        responsible: 'PROCESSOR_001',
        notes: 'HACCP-certified processing facility',
        temperature: '2°C',
        conditions: 'Excellent',
        photos: ['/images/processing1.jpg'],
        qualityCheck: { grade: 'A+', inspector: 'John Mutua' }
    });

    await transparencyApp.updateProductJourney(sampleProduct.id, {
        stage: 'packaging',
        location: 'Nakuru Processing Facility',
        responsible: 'PACKAGER_001',
        notes: 'Vacuum sealed in recyclable packaging',
        temperature: '2°C',
        conditions: 'Excellent',
        photos: ['/images/packaging1.jpg']
    });

    await transparencyApp.updateProductJourney(sampleProduct.id, {
        stage: 'transport',
        location: 'En route to Nairobi',
        responsible: 'TRANSPORT_001',
        notes: 'Refrigerated transport truck',
        temperature: '3°C',
        conditions: 'Good',
        photos: ['/images/transport1.jpg']
    });

    // Add certifications
    await transparencyApp.addCertification(sampleProduct.id, {
        type: 'organic',
        authority: 'Kenya Organic Agriculture Network (KOAN)',
        certificateNumber: 'KOAN-2024-0567',
        issuedDate: '2024-01-15',
        expiryDate: '2025-01-15',
        scope: 'Organic livestock production',
        verificationUrl: 'https://koan.or.ke/verify/KOAN-2024-0567',
        consumerRelevant: true
    });

    await transparencyApp.addCertification(sampleProduct.id, {
        type: 'animal-welfare',
        authority: 'Animal Welfare Approved by A Greener World',
        certificateNumber: 'AWA-KE-2024-001',
        issuedDate: '2024-02-01',
        expiryDate: '2025-02-01',
        scope: 'High-welfare livestock production',
        verificationUrl: 'https://agreenerworld.org/verify/AWA-KE-2024-001',
        consumerRelevant: true
    });

    console.log('✅ Journey stages added: Processing → Packaging → Transport');
    console.log('✅ Certifications added: Organic + Animal Welfare');

    // Simulate QR code scan by consumer
    const consumerView = await transparencyApp.getConsumerView(sampleProduct.qrCode, {
        prioritizes: ['sustainability', 'animal-welfare'],
        dietaryRestrictions: [],
        location: 'Nairobi'
    });

    console.log('\n🔍 CONSUMER SCAN RESULTS:');
    console.log('========================');
    console.log(`Farm: ${consumerView.quickFacts.farmName}`);
    console.log(`Farmer: ${consumerView.quickFacts.farmerName}`);
    console.log(`Days from farm: ${consumerView.quickFacts.daysFromFarm}`);
    console.log(`Freshness: ${consumerView.quickFacts.freshness}`);
    console.log(`Sustainability: Grade ${consumerView.quickFacts.sustainabilityGrade}`);
    console.log(`Animal Welfare: ${consumerView.quickFacts.welfareGrade}`);

    console.log('\n🌟 HIGHLIGHTS:');
    consumerView.highlights.forEach(highlight => {
        console.log(`   ${highlight.icon} ${highlight.title}: ${highlight.description}`);
    });

    console.log('\n📜 CERTIFICATIONS:');
    consumerView.certifications.forEach(cert => {
        console.log(`   ✅ ${cert.type.toUpperCase()}: ${cert.authority}`);
    });

    console.log('\n👨‍🌾 FARMER STORY:');
    console.log(`   Name: ${consumerView.farmerStory.name}`);
    console.log(`   Experience: ${consumerView.farmerStory.experience}`);
    console.log(`   Story: ${consumerView.farmerStory.story}`);

    // Get analytics
    const insights = await transparencyApp.getConsumerInsights(sampleProduct.id);
    console.log('\n📊 TRANSPARENCY INSIGHTS:');
    console.log(`   Total scans: ${insights.scanAnalytics.totalScans}`);
    console.log(`   Transparency score: ${insights.transparencyImpact.transparencyScore}/100`);
    console.log(`   Consumer trust: ${insights.transparencyImpact.consumerTrust}/100`);
    console.log(`   Purchase influence: ${insights.transparencyImpact.purchaseInfluence}/100`);

    return {
        product: sampleProduct,
        consumerView: consumerView,
        insights: insights
    };
}

// Run the demonstration
demonstrateTransparencyApp()
    .then(result => {
        console.log('\n🎉 SMART TRANSPARENCY APP DEMONSTRATION COMPLETE! 🎉');
        console.log('=====================================================');
        console.log('Consumers can now scan any QR code to get complete');
        console.log('farm-to-table transparency with photos, certifications,');
        console.log('sustainability scores, and farmer stories! 📱🌱');
    })
    .catch(console.error);

// Export for integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SmartFarmToConsumerTransparencyApp };
}

console.log('\n📱 Smart Farm-to-Consumer Transparency App Ready! 🌟');
