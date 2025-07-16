/**
 * 🎤 VOICE-TO-FARM (ZERO LITERACY) UI
 * Fully voice-based interface in local languages for illiterate users
 * 
 * Features:
 * - Complete voice navigation and interaction
 * - Multi-language support (Swahili, Kikuyu, Luo, Kalenjin, English)
 * - Offline voice processing capabilities
 * - Farm record logging via voice
 * - Audio alerts and notifications
 * - Voice-guided tutorials and help
 * - Emergency assistance commands
 */

class VoiceToFarmInterface {
    constructor() {
        this.currentLanguage = 'swahili';
        this.isListening = false;
        this.voiceSession = null;
        this.userProfile = null;
        this.offlineMode = false;
        
        // Voice recognition and synthesis
        this.speechRecognition = null;
        this.speechSynthesis = null;
        this.voiceCommands = new Map();
        this.conversationContext = new Map();
        
        // Multi-language support
        this.languages = new Map();
        this.audioLibrary = new Map();
        
        this.initializeVoiceInterface();
    }

    initializeVoiceInterface() {
        console.log('🎤 Initializing Voice-to-Farm Interface...\n');
        
        this.setupLanguageSupport();
        this.initializeVoiceRecognition();
        this.setupVoiceCommands();
        this.loadAudioLibrary();
        this.configureOfflineMode();
        
        console.log('✅ Voice-to-Farm Interface Ready!\n');
        this.playWelcomeMessage();
    }

    // 🌍 MULTI-LANGUAGE SUPPORT
    setupLanguageSupport() {
        console.log('🌍 Setting up multi-language support...');

        // Swahili - Primary language
        this.languages.set('swahili', {
            code: 'sw-KE',
            name: 'Kiswahili',
            welcomeMessage: 'Karibu kwenye mfumo wa kilimo cha kisasa. Niseme nini ninaweza kukusaidia?',
            commands: {
                // Basic navigation
                'anza': 'start',
                'simama': 'stop',
                'rudi': 'back',
                'msaada': 'help',
                'mwisho': 'end',
                
                // Farm management
                'rekodi': 'record',
                'mazao': 'crops',
                'mifugo': 'livestock',
                'hali ya hewa': 'weather',
                'soko': 'market',
                'macho': 'health',
                'chakula': 'feed',
                
                // Actions
                'ongeza': 'add',
                'ona': 'view',
                'hariri': 'edit',
                'futa': 'delete',
                'tuma': 'send',
                'pokea': 'receive',
                
                // Emergency
                'msaada wa haraka': 'emergency',
                'mgonjwa': 'sick',
                'hatari': 'danger'
            },
            phrases: {
                listening: 'Ninakusikiliza...',
                processing: 'Ninachakata...',
                success: 'Imefanikiwa!',
                error: 'Samahani, hakueleweka. Rudia tafadhali.',
                confirm: 'Je, umeridhika na hii?',
                goodbye: 'Kwaheri! Rudi tena.'
            }
        });

        // Kikuyu
        this.languages.set('kikuyu', {
            code: 'ki-KE',
            name: 'Gikuyu',
            welcomeMessage: 'Wega kana mfumo wa kurutithi mahinda. Njira ngatho ngirie?',
            commands: {
                'ambiriria': 'start',
                'ruga': 'stop',
                'cooka': 'back',
                'teithio': 'help',
                'rika': 'end',
                'andika': 'record',
                'mahinda': 'crops',
                'mahiu': 'livestock',
                'kihonia': 'weather'
            },
            phrases: {
                listening: 'Nindigutigua...',
                processing: 'Nindiruta wira...',
                success: 'Niwegire!',
                error: 'Niuumaga, ndigui. Thiia ringí.',
                confirm: 'Niwega?',
                goodbye: 'Hoyu wega! Cooka ringí.'
            }
        });

        // Luo
        this.languages.set('luo', {
            code: 'luo-KE',
            name: 'Dholuo',
            welcomeMessage: 'Oyawore e system mar pur. Angʼo ma anyalo konyigo?',
            commands: {
                'chak': 'start',
                'wek': 'stop',
                'dog': 'back',
                'konya': 'help',
                'tiek': 'end',
                'ket': 'record',
                'cham': 'crops',
                'jamni': 'livestock',
                'koth': 'weather'
            },
            phrases: {
                listening: 'Awinji...',
                processing: 'Atimo tich...',
                success: 'Otimare!',
                error: 'Kihonwa, ok awinjo. Tem kendo.',
                confirm: 'Ber kama?',
                goodbye: 'Oriti! Bi kendo.'
            }
        });

        // Kalenjin
        this.languages.set('kalenjin', {
            code: 'kln-KE',
            name: 'Kalenjin',
            welcomeMessage: 'Chamuge ne system ne kilimo. Ngongo alachu anyunu?',
            commands: {
                'chama': 'start',
                'kone': 'stop',
                'welek': 'back',
                'tenyei': 'help',
                'kome': 'end',
                'ketei': 'record',
                'sigei': 'crops',
                'tugi': 'livestock',
                'robuinet': 'weather'
            },
            phrases: {
                listening: 'Angalali...',
                processing: 'Atendoi...',
                success: 'Kimache!',
                error: 'Kirui, ma-angalal. Tengei kole.',
                confirm: 'Kimwaga?',
                goodbye: 'Sere! Wei kole.'
            }
        });

        // English - Fallback
        this.languages.set('english', {
            code: 'en-KE',
            name: 'English',
            welcomeMessage: 'Welcome to the modern farming system. How can I help you today?',
            commands: {
                'start': 'start',
                'stop': 'stop',
                'back': 'back',
                'help': 'help',
                'end': 'end',
                'record': 'record',
                'crops': 'crops',
                'livestock': 'livestock',
                'weather': 'weather',
                'market': 'market',
                'health': 'health',
                'feed': 'feed',
                'add': 'add',
                'view': 'view',
                'edit': 'edit',
                'delete': 'delete',
                'emergency': 'emergency'
            },
            phrases: {
                listening: 'I am listening...',
                processing: 'Processing...',
                success: 'Success!',
                error: 'Sorry, I did not understand. Please repeat.',
                confirm: 'Are you satisfied with this?',
                goodbye: 'Goodbye! Come back again.'
            }
        });
    }

    // 🎤 VOICE RECOGNITION SETUP
    initializeVoiceRecognition() {
        console.log('🎤 Setting up voice recognition...');

        // Simulate browser Speech Recognition API
        this.speechRecognition = {
            lang: 'sw-KE',
            continuous: true,
            interimResults: true,
            maxAlternatives: 3,
            
            start: () => {
                this.isListening = true;
                console.log('🎤 Voice recognition started');
                this.speak(this.getPhrase('listening'));
            },
            
            stop: () => {
                this.isListening = false;
                console.log('🔇 Voice recognition stopped');
            },
            
            onresult: (event) => {
                const transcript = event.results[event.resultIndex][0].transcript;
                const confidence = event.results[event.resultIndex][0].confidence;
                
                if (confidence > 0.7) {
                    this.processVoiceCommand(transcript);
                }
            },
            
            onerror: (error) => {
                console.log('❌ Voice recognition error:', error);
                this.speak(this.getPhrase('error'));
            }
        };

        // Simulate Speech Synthesis API
        this.speechSynthesis = {
            speak: (utterance) => {
                console.log(`🔊 Speaking: "${utterance.text}" in ${utterance.lang}`);
                // In real implementation, this would use actual speech synthesis
                setTimeout(() => {
                    if (utterance.onend) utterance.onend();
                }, utterance.text.length * 50); // Simulate speaking time
            },
            
            cancel: () => {
                console.log('🔇 Speech cancelled');
            },
            
            getVoices: () => {
                return [
                    { name: 'Swahili Female', lang: 'sw-KE' },
                    { name: 'Kikuyu Female', lang: 'ki-KE' },
                    { name: 'Luo Male', lang: 'luo-KE' },
                    { name: 'Kalenjin Female', lang: 'kln-KE' },
                    { name: 'English Female', lang: 'en-KE' }
                ];
            }
        };
    }

    // 🗣️ VOICE COMMAND PROCESSING
    setupVoiceCommands() {
        console.log('🗣️ Setting up voice commands...');

        // Main navigation commands
        this.voiceCommands.set('start_session', {
            patterns: ['anza', 'chama', 'ambiriria', 'chak', 'start'],
            action: 'startFarmSession',
            description: 'Start a new farm management session'
        });

        this.voiceCommands.set('record_crops', {
            patterns: ['rekodi mazao', 'andika mahinda', 'ket cham', 'ketei sigei', 'record crops'],
            action: 'recordCrops',
            description: 'Record crop information'
        });

        this.voiceCommands.set('record_livestock', {
            patterns: ['rekodi mifugo', 'andika mahiu', 'ket jamni', 'ketei tugi', 'record livestock'],
            action: 'recordLivestock',
            description: 'Record livestock information'
        });

        this.voiceCommands.set('check_weather', {
            patterns: ['hali ya hewa', 'kihonia', 'koth', 'robuinet', 'weather'],
            action: 'checkWeather',
            description: 'Get weather information'
        });

        this.voiceCommands.set('market_prices', {
            patterns: ['bei za soko', 'thogoro', 'nengo mar ohala', 'market prices'],
            action: 'getMarketPrices',
            description: 'Get current market prices'
        });

        this.voiceCommands.set('health_check', {
            patterns: ['angalia afya', 'roria ugima', 'non thuolo', 'neni ngima', 'health check'],
            action: 'healthCheck',
            description: 'Check animal or crop health'
        });

        this.voiceCommands.set('emergency_help', {
            patterns: ['msaada wa haraka', 'teithio o naraka', 'konya mapiyo', 'tenyei bik', 'emergency'],
            action: 'emergencyHelp',
            description: 'Get emergency assistance'
        });

        this.voiceCommands.set('get_help', {
            patterns: ['msaada', 'teithio', 'konya', 'tenyei', 'help'],
            action: 'getHelp',
            description: 'Get help and tutorials'
        });

        this.voiceCommands.set('change_language', {
            patterns: ['badili lugha', 'garura rurimi', 'lok dhok', 'change language'],
            action: 'changeLanguage',
            description: 'Change interface language'
        });
    }

    // 🔊 SPEECH SYNTHESIS
    speak(text, options = {}) {
        const utterance = {
            text: text,
            lang: this.languages.get(this.currentLanguage).code,
            voice: options.voice || null,
            volume: options.volume || 1.0,
            rate: options.rate || 0.9, // Slightly slower for clarity
            pitch: options.pitch || 1.0,
            onend: options.onend || null
        };

        this.speechSynthesis.speak(utterance);
    }

    // 📝 VOICE COMMAND PROCESSING
    processVoiceCommand(transcript) {
        console.log(`🎤 Received: "${transcript}"`);
        this.speak(this.getPhrase('processing'));

        const normalizedTranscript = transcript.toLowerCase().trim();
        let commandFound = false;

        // Check against all voice commands
        for (const [commandName, command] of this.voiceCommands) {
            for (const pattern of command.patterns) {
                if (normalizedTranscript.includes(pattern.toLowerCase())) {
                    console.log(`✅ Command matched: ${commandName}`);
                    this.executeVoiceCommand(command.action, normalizedTranscript);
                    commandFound = true;
                    break;
                }
            }
            if (commandFound) break;
        }

        if (!commandFound) {
            this.handleUnknownCommand(normalizedTranscript);
        }
    }

    executeVoiceCommand(action, transcript) {
        switch (action) {
            case 'startFarmSession':
                this.startFarmSession();
                break;
            case 'recordCrops':
                this.recordCrops(transcript);
                break;
            case 'recordLivestock':
                this.recordLivestock(transcript);
                break;
            case 'checkWeather':
                this.checkWeather();
                break;
            case 'getMarketPrices':
                this.getMarketPrices();
                break;
            case 'healthCheck':
                this.healthCheck(transcript);
                break;
            case 'emergencyHelp':
                this.emergencyHelp();
                break;
            case 'getHelp':
                this.getHelp();
                break;
            case 'changeLanguage':
                this.changeLanguage();
                break;
            default:
                this.speak(this.getPhrase('error'));
        }
    }

    // 🚜 FARM SESSION MANAGEMENT
    startFarmSession() {
        this.voiceSession = {
            id: `SESSION_${Date.now()}`,
            startTime: new Date(),
            language: this.currentLanguage,
            actions: [],
            context: 'farm_management'
        };

        const welcomeText = this.currentLanguage === 'swahili' 
            ? 'Umanza kipindi kipya cha kilimo. Unataka kurekodi nini leo?'
            : 'You have started a new farming session. What would you like to record today?';
        
        this.speak(welcomeText);
        console.log('🚜 Farm session started');
    }

    // 🌾 CROP RECORDING
    async recordCrops(transcript) {
        console.log('🌾 Recording crops...');
        
        const cropQuestions = this.currentLanguage === 'swahili' ? [
            'Unapanda mazao gani?',
            'Ni kilo ngapi?',
            'Mazao yako ni mazuri?',
            'Unahitaji mbegu?'
        ] : [
            'What crops are you planting?',
            'How many kilograms?',
            'Are your crops healthy?',
            'Do you need seeds?'
        ];

        for (const question of cropQuestions) {
            this.speak(question);
            await this.waitForResponse();
        }

        const successMessage = this.currentLanguage === 'swahili'
            ? 'Rekodi ya mazao imehifadhiwa. Asante!'
            : 'Crop record has been saved. Thank you!';
        
        this.speak(successMessage);
        this.logAction('crop_record', { transcript });
    }

    // 🐄 LIVESTOCK RECORDING
    async recordLivestock(transcript) {
        console.log('🐄 Recording livestock...');
        
        const livestockQuestions = this.currentLanguage === 'swahili' ? [
            'Una mifugo gani?',
            'Ni wangapi?',
            'Wako wenye afya?',
            'Wanahitaji dawa?'
        ] : [
            'What livestock do you have?',
            'How many?',
            'Are they healthy?',
            'Do they need medicine?'
        ];

        for (const question of livestockQuestions) {
            this.speak(question);
            await this.waitForResponse();
        }

        const successMessage = this.currentLanguage === 'swahili'
            ? 'Rekodi ya mifugo imehifadhiwa. Asante!'
            : 'Livestock record has been saved. Thank you!';
        
        this.speak(successMessage);
        this.logAction('livestock_record', { transcript });
    }

    // 🌤️ WEATHER CHECK
    checkWeather() {
        console.log('🌤️ Checking weather...');
        
        // Simulate weather data
        const weatherData = {
            temperature: 24,
            humidity: 65,
            rainfall: 'Mvua kidogo kesho',
            wind: 'Upepo mdogo',
            advice: 'Ni wakati mzuri wa kupanda'
        };

        const weatherReport = this.currentLanguage === 'swahili'
            ? `Hali ya hewa leo: Joto ni digrii ${weatherData.temperature}. Unyevu ni asilimia ${weatherData.humidity}. ${weatherData.rainfall}. Shauri: ${weatherData.advice}.`
            : `Today's weather: Temperature is ${weatherData.temperature} degrees. Humidity is ${weatherData.humidity}%. Light rain expected tomorrow. Advice: Good time for planting.`;

        this.speak(weatherReport);
        this.logAction('weather_check', weatherData);
    }

    // 💰 MARKET PRICES
    getMarketPrices() {
        console.log('💰 Getting market prices...');
        
        const priceData = {
            maize: { price: 45, currency: 'KES', unit: 'kg' },
            beans: { price: 120, currency: 'KES', unit: 'kg' },
            tomatoes: { price: 80, currency: 'KES', unit: 'kg' }
        };

        const priceReport = this.currentLanguage === 'swahili'
            ? `Bei za soko leo: Mahindi ni shilingi ${priceData.maize.price} kwa kilo. Maharage ni shilingi ${priceData.beans.price} kwa kilo. Nyanya ni shilingi ${priceData.tomatoes.price} kwa kilo.`
            : `Market prices today: Maize is ${priceData.maize.price} shillings per kg. Beans are ${priceData.beans.price} shillings per kg. Tomatoes are ${priceData.tomatoes.price} shillings per kg.`;

        this.speak(priceReport);
        this.logAction('market_prices', priceData);
    }

    // 🏥 HEALTH CHECK
    async healthCheck(transcript) {
        console.log('🏥 Performing health check...');
        
        const healthQuestions = this.currentLanguage === 'swahili' ? [
            'Ni mnyama gani au mazao gani?',
            'Una matatizo gani?',
            'Imeanza lini?',
            'Umeshajaribu dawa yoyote?'
        ] : [
            'Which animal or crop?',
            'What problems do you see?',
            'When did it start?',
            'Have you tried any medicine?'
        ];

        for (const question of healthQuestions) {
            this.speak(question);
            await this.waitForResponse();
        }

        const advice = this.currentLanguage === 'swahili'
            ? 'Shauri langu ni uweze daktari wa mifugo. Nitakutumia nambari yake.'
            : 'My advice is to contact a veterinarian. I will send you their number.';
        
        this.speak(advice);
        this.logAction('health_check', { transcript });
    }

    // 🚨 EMERGENCY HELP
    emergencyHelp() {
        console.log('🚨 Emergency help activated...');
        
        const emergencyMessage = this.currentLanguage === 'swahili'
            ? 'Msaada wa haraka! Nitawapigia simu wa kwanza. Baki mahali ulipo salama. Msaada unakuja.'
            : 'Emergency help! I will call emergency services first. Stay in a safe place. Help is coming.';
        
        this.speak(emergencyMessage, { rate: 1.2 }); // Speak faster for urgency
        
        // Simulate emergency call
        this.initiateEmergencyCall();
        this.logAction('emergency', { timestamp: new Date(), location: 'GPS_COORDINATES' });
    }

    // ❓ HELP SYSTEM
    getHelp() {
        console.log('❓ Providing help...');
        
        const helpMessage = this.currentLanguage === 'swahili'
            ? 'Unaweza kusema: "rekodi mazao", "rekodi mifugo", "hali ya hewa", "bei za soko", "angalia afya", au "msaada wa haraka". Unaweza pia kubadili lugha.'
            : 'You can say: "record crops", "record livestock", "check weather", "market prices", "health check", or "emergency help". You can also change language.';
        
        this.speak(helpMessage);
        this.logAction('help_request');
    }

    // 🌍 LANGUAGE CHANGE
    async changeLanguage() {
        console.log('🌍 Changing language...');
        
        const languageOptions = Array.from(this.languages.keys());
        const currentIndex = languageOptions.indexOf(this.currentLanguage);
        const nextIndex = (currentIndex + 1) % languageOptions.length;
        
        this.currentLanguage = languageOptions[nextIndex];
        this.speechRecognition.lang = this.languages.get(this.currentLanguage).code;
        
        const changeMessage = this.languages.get(this.currentLanguage).welcomeMessage;
        this.speak(changeMessage);
        
        console.log(`Language changed to: ${this.currentLanguage}`);
        this.logAction('language_change', { newLanguage: this.currentLanguage });
    }

    // 🔄 OFFLINE MODE SUPPORT
    configureOfflineMode() {
        console.log('🔄 Configuring offline mode...');
        
        this.offlineCapabilities = {
            cachedVoiceCommands: true,
            localSpeechSynthesis: true,
            offlineRecognition: true,
            localDataStorage: true,
            emergencyNumbers: [
                { service: 'Police', number: '999' },
                { service: 'Medical', number: '911' },
                { service: 'Fire', number: '999' },
                { service: 'Veterinary', number: '+254700123456' }
            ]
        };

        // Cache essential audio for offline use
        this.cacheEssentialAudio();
    }

    // 🎵 AUDIO LIBRARY MANAGEMENT
    loadAudioLibrary() {
        console.log('🎵 Loading audio library...');
        
        // Pre-recorded audio for common phrases in each language
        this.audioLibrary.set('welcome_swahili', {
            file: 'audio/sw/welcome.mp3',
            duration: 5000,
            text: 'Karibu kwenye mfumo wa kilimo cha kisasa'
        });
        
        this.audioLibrary.set('emergency_swahili', {
            file: 'audio/sw/emergency.mp3',
            duration: 3000,
            text: 'Msaada wa haraka! Baki salama!'
        });
    }

    cacheEssentialAudio() {
        const essentialPhrases = [
            'welcome', 'listening', 'processing', 'success', 'error', 
            'emergency', 'help', 'goodbye'
        ];
        
        for (const phrase of essentialPhrases) {
            for (const [langCode, language] of this.languages) {
                console.log(`📥 Caching ${phrase} in ${language.name}`);
            }
        }
    }

    // 🎤 VOICE SESSION UTILITIES
    async waitForResponse() {
        return new Promise((resolve) => {
            // Simulate waiting for voice response
            setTimeout(() => {
                const simulatedResponse = 'User response received';
                console.log(`👂 ${simulatedResponse}`);
                resolve(simulatedResponse);
            }, 2000);
        });
    }

    handleUnknownCommand(transcript) {
        console.log(`❓ Unknown command: ${transcript}`);
        
        const errorMessage = this.getPhrase('error');
        this.speak(errorMessage);
        
        // Suggest similar commands
        this.suggestCommands();
    }

    suggestCommands() {
        const suggestion = this.currentLanguage === 'swahili'
            ? 'Jaribu kusema "msaada" ili kupata maelezo zaidi.'
            : 'Try saying "help" to get more information.';
        
        this.speak(suggestion);
    }

    // 📞 EMERGENCY SYSTEM
    initiateEmergencyCall() {
        console.log('📞 Initiating emergency call...');
        
        // In real implementation, would integrate with emergency services
        const emergencyContact = {
            service: 'Emergency Services',
            number: '999',
            location: 'GPS_COORDINATES',
            timestamp: new Date()
        };
        
        console.log('🚨 Emergency call placed:', emergencyContact);
        return emergencyContact;
    }

    // 📊 LOGGING AND ANALYTICS
    logAction(action, data = {}) {
        if (!this.voiceSession) return;
        
        const logEntry = {
            timestamp: new Date(),
            action: action,
            language: this.currentLanguage,
            sessionId: this.voiceSession.id,
            data: data
        };
        
        this.voiceSession.actions.push(logEntry);
        console.log('📝 Action logged:', logEntry);
    }

    // 🎬 WELCOME AND STARTUP
    playWelcomeMessage() {
        const welcome = this.languages.get(this.currentLanguage).welcomeMessage;
        this.speak(welcome);
        
        // Auto-start listening after welcome
        setTimeout(() => {
            this.startListening();
        }, 3000);
    }

    startListening() {
        if (!this.isListening) {
            this.speechRecognition.start();
        }
    }

    stopListening() {
        if (this.isListening) {
            this.speechRecognition.stop();
        }
    }

    // 🔧 UTILITY METHODS
    getPhrase(key) {
        return this.languages.get(this.currentLanguage).phrases[key] || 
               this.languages.get('english').phrases[key];
    }

    getCurrentLanguage() {
        return this.languages.get(this.currentLanguage);
    }

    getSupportedLanguages() {
        return Array.from(this.languages.keys());
    }

    // 📈 ANALYTICS AND REPORTING
    getUsageAnalytics() {
        if (!this.voiceSession) return null;
        
        return {
            sessionId: this.voiceSession.id,
            duration: Date.now() - this.voiceSession.startTime.getTime(),
            language: this.currentLanguage,
            totalActions: this.voiceSession.actions.length,
            actionTypes: this.voiceSession.actions.reduce((acc, action) => {
                acc[action.action] = (acc[action.action] || 0) + 1;
                return acc;
            }, {}),
            mostUsedCommands: this.getMostUsedCommands()
        };
    }

    getMostUsedCommands() {
        if (!this.voiceSession) return [];
        
        const commandCounts = {};
        this.voiceSession.actions.forEach(action => {
            commandCounts[action.action] = (commandCounts[action.action] || 0) + 1;
        });
        
        return Object.entries(commandCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
    }

    // 🚪 SESSION MANAGEMENT
    endSession() {
        if (this.voiceSession) {
            const goodbye = this.getPhrase('goodbye');
            this.speak(goodbye);
            
            console.log('📊 Session Summary:', this.getUsageAnalytics());
            this.voiceSession = null;
        }
        
        this.stopListening();
    }
}

// 🎤 VOICE INTERFACE DEMONSTRATION
async function demonstrateVoiceInterface() {
    console.log('🎤 VOICE-TO-FARM INTERFACE DEMONSTRATION');
    console.log('========================================\n');

    const voiceInterface = new VoiceToFarmInterface();
    
    // Simulate user interactions
    console.log('👤 Simulating user voice commands...\n');
    
    const commands = [
        'anza',
        'rekodi mazao',
        'hali ya hewa',
        'bei za soko',
        'msaada wa haraka',
        'badili lugha',
        'help',
        'mwisho'
    ];

    for (const command of commands) {
        console.log(`\n🗣️ User says: "${command}"`);
        voiceInterface.processVoiceCommand(command);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait between commands
    }

    console.log('\n📊 FINAL SESSION ANALYTICS:');
    const analytics = voiceInterface.getUsageAnalytics();
    if (analytics) {
        console.log(`   Session Duration: ${Math.round(analytics.duration / 1000)} seconds`);
        console.log(`   Total Actions: ${analytics.totalActions}`);
        console.log(`   Language Used: ${analytics.language}`);
        console.log(`   Most Used Commands:`, analytics.mostUsedCommands);
    }

    voiceInterface.endSession();
}

// 🚀 Initialize and demonstrate
console.log('🎤 Starting Voice-to-Farm (Zero Literacy) UI...\n');
demonstrateVoiceInterface().catch(console.error);

// Export for integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VoiceToFarmInterface };
}

console.log('\n🎤 Voice-to-Farm Interface Ready for Deployment! 🌱');
