// ===============================================
// VOICE COMMAND SYSTEM FOR HANDS-FREE OPERATION
// ===============================================

class VoiceCommandManager {
    constructor() {
        this.recognition = null;
        this.synthesis = null;
        this.isListening = false;
        this.isEnabled = false;
        this.currentContext = 'general';
        this.commands = {};
        this.lastCommand = '';
        this.confidenceThreshold = 0.7;
        this.init();
    }

    init() {
        this.checkBrowserSupport();
        this.setupSpeechRecognition();
        this.setupSpeechSynthesis();
        this.defineCommands();
        this.createVoiceControls();
        this.setupEventListeners();
    }

    checkBrowserSupport() {
        this.hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        this.hasSpeechSynthesis = 'speechSynthesis' in window;
        
        if (!this.hasSpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
        }
        
        if (!this.hasSpeechSynthesis) {
            console.warn('Speech synthesis not supported in this browser');
        }
    }

    setupSpeechRecognition() {
        if (!this.hasSpeechRecognition) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 3;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceStatus('listening');
            this.speak('Voice commands activated');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateVoiceStatus('stopped');
            
            // Auto-restart if still enabled
            if (this.isEnabled) {
                setTimeout(() => {
                    this.startListening();
                }, 1000);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.updateVoiceStatus('error');
            
            if (event.error === 'no-speech') {
                this.speak('No speech detected. Try again.');
            } else if (event.error === 'audio-capture') {
                this.speak('Microphone not accessible. Please check permissions.');
            }
        };

        this.recognition.onresult = (event) => {
            this.processVoiceInput(event);
        };
    }

    setupSpeechSynthesis() {
        if (!this.hasSpeechSynthesis) return;
        
        this.synthesis = window.speechSynthesis;
        
        // Wait for voices to load
        this.synthesis.onvoiceschanged = () => {
            this.voices = this.synthesis.getVoices();
            this.selectedVoice = this.voices.find(voice => 
                voice.lang.includes('en') && voice.name.includes('Female')
            ) || this.voices[0];
        };
    }

    defineCommands() {
        this.commands = {
            // Navigation Commands
            navigation: {
                patterns: [
                    { pattern: /go to (home|dashboard)/, action: () => this.navigate('/') },
                    { pattern: /go to goat records/, action: () => this.navigate('/goat-records.html') },
                    { pattern: /go to health records/, action: () => this.navigate('/health-records.html') },
                    { pattern: /go to breeding records/, action: () => this.navigate('/breeding-records.html') },
                    { pattern: /go to financial records/, action: () => this.navigate('/financial-records.html') },
                    { pattern: /open qr scanner/, action: () => this.navigate('/qr-scanner.html') },
                    { pattern: /show genealogy/, action: () => this.navigate('/genealogy.html') },
                ]
            },

            // Goat Management Commands
            goatManagement: {
                patterns: [
                    { pattern: /add new goat/, action: () => this.addNewGoat() },
                    { pattern: /search for goat (.+)/, action: (match) => this.searchGoat(match[1]) },
                    { pattern: /show goat (.+)/, action: (match) => this.showGoat(match[1]) },
                    { pattern: /update weight (\d+(?:\.\d+)?) for goat (.+)/, action: (match) => this.updateWeight(match[2], match[1]) },
                    { pattern: /mark goat (.+) as (healthy|sick|quarantine)/, action: (match) => this.updateStatus(match[1], match[2]) },
                ]
            },

            // Health Commands
            healthManagement: {
                patterns: [
                    { pattern: /record vaccination for goat (.+)/, action: (match) => this.recordVaccination(match[1]) },
                    { pattern: /schedule health check for goat (.+)/, action: (match) => this.scheduleHealthCheck(match[1]) },
                    { pattern: /add treatment for goat (.+)/, action: (match) => this.addTreatment(match[1]) },
                    { pattern: /show health history for goat (.+)/, action: (match) => this.showHealthHistory(match[1]) },
                ]
            },

            // Breeding Commands
            breedingManagement: {
                patterns: [
                    { pattern: /record breeding between (.+) and (.+)/, action: (match) => this.recordBreeding(match[1], match[2]) },
                    { pattern: /show breeding recommendations/, action: () => this.showBreedingRecommendations() },
                    { pattern: /mark pregnancy for goat (.+)/, action: (match) => this.markPregnancy(match[1]) },
                ]
            },

            // QR Commands
            qrCommands: {
                patterns: [
                    { pattern: /start qr scanner/, action: () => this.startQRScanner() },
                    { pattern: /generate qr code for goat (.+)/, action: (match) => this.generateQR(match[1]) },
                    { pattern: /print qr codes/, action: () => this.printQRCodes() },
                ]
            },

            // General Commands
            general: {
                patterns: [
                    { pattern: /(help|what can you do)/, action: () => this.showHelp() },
                    { pattern: /save (data|changes)/, action: () => this.saveData() },
                    { pattern: /cancel/, action: () => this.cancelAction() },
                    { pattern: /repeat last command/, action: () => this.repeatLastCommand() },
                    { pattern: /stop (listening|voice commands)/, action: () => this.stopListening() },
                    { pattern: /change language to (english|swahili)/, action: (match) => this.changeLanguage(match[1]) },
                ]
            }
        };
    }

    processVoiceInput(event) {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript.toLowerCase().trim();
        const confidence = event.results[current][0].confidence;

        console.log('Voice input:', transcript, 'Confidence:', confidence);

        // Update voice feedback
        this.updateVoiceTranscript(transcript, confidence);

        // Only process if confidence is high enough and result is final
        if (confidence >= this.confidenceThreshold && event.results[current].isFinal) {
            this.executeVoiceCommand(transcript);
        }
    }

    executeVoiceCommand(transcript) {
        let commandExecuted = false;

        // Check all command categories
        for (const category in this.commands) {
            const patterns = this.commands[category].patterns;
            
            for (const command of patterns) {
                const match = transcript.match(command.pattern);
                if (match) {
                    console.log('Executing command:', command.pattern, 'Match:', match);
                    this.lastCommand = transcript;
                    command.action(match);
                    commandExecuted = true;
                    break;
                }
            }
            
            if (commandExecuted) break;
        }

        if (!commandExecuted) {
            this.speak(`Sorry, I didn't understand "${transcript}". Say "help" for available commands.`);
        }
    }

    // Command Implementation Methods
    navigate(url) {
        this.speak(`Navigating to ${url.replace('.html', '').replace('/', ' ')}`);
        window.location.href = url;
    }

    addNewGoat() {
        this.speak('Opening add new goat form');
        if (window.location.pathname.includes('goat-records')) {
            document.querySelector('#addGoatBtn')?.click();
        } else {
            this.navigate('/goat-records.html?action=add');
        }
    }

    searchGoat(goatName) {
        this.speak(`Searching for goat ${goatName}`);
        const searchInput = document.querySelector('#searchInput, .search-input');
        if (searchInput) {
            searchInput.value = goatName;
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    updateWeight(goatName, weight) {
        this.speak(`Recording weight ${weight} kilograms for goat ${goatName}`);
        // Implementation would depend on your specific form structure
        this.showNotification(`Voice command: Update weight ${weight}kg for ${goatName}`);
    }

    updateStatus(goatName, status) {
        this.speak(`Marking goat ${goatName} as ${status}`);
        this.showNotification(`Voice command: Mark ${goatName} as ${status}`);
    }

    recordVaccination(goatName) {
        this.speak(`Recording vaccination for goat ${goatName}`);
        this.showNotification(`Voice command: Record vaccination for ${goatName}`);
    }

    startQRScanner() {
        this.speak('Starting QR code scanner');
        if (window.qrScannerManager) {
            window.qrScannerManager.startScanning();
        } else {
            this.navigate('/qr-scanner.html');
        }
    }

    showHelp() {
        const helpText = `Available voice commands:
        Navigation: "Go to goat records", "Open QR scanner"
        Goat management: "Add new goat", "Search for goat [name]"
        Health: "Record vaccination for goat [name]"
        QR: "Start QR scanner", "Generate QR code"
        General: "Save data", "Stop listening"`;
        
        this.speak('Here are the available voice commands');
        this.showNotification(helpText);
    }

    changeLanguage(language) {
        const langCode = language === 'swahili' ? 'sw' : 'en';
        this.speak(`Changing language to ${language}`);
        
        if (window.languageManager) {
            window.languageManager.switchLanguage(langCode);
            this.recognition.lang = langCode === 'sw' ? 'sw-KE' : 'en-US';
        }
    }

    // Voice Control UI Methods
    createVoiceControls() {
        const voiceControls = document.createElement('div');
        voiceControls.className = 'voice-controls';
        voiceControls.innerHTML = `
            <div class="voice-toggle">
                <button id="voiceToggleBtn" class="voice-btn" title="Toggle Voice Commands">
                    🎤
                </button>
                <div class="voice-status" id="voiceStatus">
                    <span class="status-text">Voice Off</span>
                    <div class="voice-indicator"></div>
                </div>
            </div>
            <div class="voice-transcript" id="voiceTranscript" style="display: none;">
                <div class="transcript-text"></div>
                <div class="confidence-bar">
                    <div class="confidence-fill"></div>
                </div>
            </div>
        `;

        document.body.appendChild(voiceControls);
        this.injectVoiceCSS();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'voiceToggleBtn') {
                this.toggleVoiceCommands();
            }
        });

        // Keyboard shortcut (Ctrl + `)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === '`') {
                e.preventDefault();
                this.toggleVoiceCommands();
            }
        });
    }

    toggleVoiceCommands() {
        if (this.isEnabled) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.hasSpeechRecognition) {
            this.speak('Speech recognition not supported in this browser');
            return;
        }

        this.isEnabled = true;
        this.recognition.start();
        this.updateVoiceToggle(true);
    }

    stopListening() {
        this.isEnabled = false;
        if (this.recognition) {
            this.recognition.stop();
        }
        this.updateVoiceToggle(false);
        this.speak('Voice commands deactivated');
    }

    updateVoiceStatus(status) {
        const statusElement = document.querySelector('#voiceStatus .status-text');
        const indicator = document.querySelector('.voice-indicator');
        
        if (statusElement && indicator) {
            switch (status) {
                case 'listening':
                    statusElement.textContent = 'Listening...';
                    indicator.className = 'voice-indicator listening';
                    break;
                case 'stopped':
                    statusElement.textContent = this.isEnabled ? 'Voice On' : 'Voice Off';
                    indicator.className = 'voice-indicator';
                    break;
                case 'error':
                    statusElement.textContent = 'Error';
                    indicator.className = 'voice-indicator error';
                    break;
            }
        }
    }

    updateVoiceToggle(enabled) {
        const toggleBtn = document.querySelector('#voiceToggleBtn');
        if (toggleBtn) {
            toggleBtn.className = `voice-btn ${enabled ? 'active' : ''}`;
            toggleBtn.title = enabled ? 'Voice Commands On (Ctrl+`)' : 'Voice Commands Off (Ctrl+`)';
        }
    }

    updateVoiceTranscript(transcript, confidence) {
        const transcriptElement = document.querySelector('#voiceTranscript');
        const textElement = document.querySelector('.transcript-text');
        const confidenceBar = document.querySelector('.confidence-fill');
        
        if (transcriptElement && textElement && confidenceBar) {
            transcriptElement.style.display = 'block';
            textElement.textContent = transcript;
            confidenceBar.style.width = `${confidence * 100}%`;
            confidenceBar.className = `confidence-fill ${confidence >= 0.7 ? 'high' : confidence >= 0.5 ? 'medium' : 'low'}`;
            
            // Hide transcript after 3 seconds
            clearTimeout(this.transcriptTimeout);
            this.transcriptTimeout = setTimeout(() => {
                transcriptElement.style.display = 'none';
            }, 3000);
        }
    }

    speak(text) {
        if (!this.hasSpeechSynthesis) return;

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.selectedVoice;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        this.synthesis.speak(utterance);
    }

    showNotification(message) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'voice-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    injectVoiceCSS() {
        const css = `
            .voice-controls {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 1rem;
                min-width: 150px;
            }

            .voice-toggle {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .voice-btn {
                background: var(--logo-green);
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .voice-btn:hover {
                background: var(--logo-green-dark);
                transform: scale(1.05);
            }

            .voice-btn.active {
                background: #ff4757;
                animation: pulse 2s infinite;
            }

            .voice-status {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .status-text {
                font-size: 0.8rem;
                color: var(--text-dark);
                font-weight: 500;
            }

            .voice-indicator {
                width: 20px;
                height: 4px;
                background: #ddd;
                border-radius: 2px;
                transition: all 0.3s ease;
            }

            .voice-indicator.listening {
                background: #2ecc71;
                animation: listening-pulse 1.5s infinite;
            }

            .voice-indicator.error {
                background: #e74c3c;
            }

            .voice-transcript {
                position: absolute;
                bottom: 100%;
                right: 0;
                margin-bottom: 0.5rem;
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 0.75rem;
                border-radius: 8px;
                min-width: 200px;
                max-width: 300px;
            }

            .transcript-text {
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .confidence-bar {
                height: 3px;
                background: rgba(255,255,255,0.3);
                border-radius: 2px;
                overflow: hidden;
            }

            .confidence-fill {
                height: 100%;
                transition: width 0.3s ease;
                border-radius: 2px;
            }

            .confidence-fill.high {
                background: #2ecc71;
            }

            .confidence-fill.medium {
                background: #f39c12;
            }

            .confidence-fill.low {
                background: #e74c3c;
            }

            .voice-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--logo-green);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                max-width: 300px;
                z-index: 1001;
                animation: slideIn 0.3s ease;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            @keyframes listening-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .voice-controls {
                    bottom: 80px;
                    right: 10px;
                    left: 10px;
                    width: auto;
                }

                .voice-transcript {
                    position: relative;
                    bottom: auto;
                    margin-bottom: 0;
                    margin-top: 0.5rem;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Methods to be called by other parts of the application
    setContext(context) {
        this.currentContext = context;
    }

    addCustomCommands(commands) {
        Object.assign(this.commands, commands);
    }

    // Cleanup method
    destroy() {
        if (this.recognition) {
            this.recognition.stop();
        }
        
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        
        const voiceControls = document.querySelector('.voice-controls');
        if (voiceControls) {
            voiceControls.remove();
        }
    }
}

// Initialize Voice Commands
let voiceCommandManager;
document.addEventListener('DOMContentLoaded', function() {
    voiceCommandManager = new VoiceCommandManager();
    
    // Make it globally available
    window.voiceCommandManager = voiceCommandManager;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceCommandManager;
}
