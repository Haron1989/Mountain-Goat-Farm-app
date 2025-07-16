// ===============================================
// MULTI-LANGUAGE SUPPORT SYSTEM
// ===============================================

class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('farmLanguage') || 'en';
        this.translations = {};
        this.init();
    }

    init() {
        this.loadTranslations();
        this.setupLanguageToggle();
        this.applyTranslations();
    }

    loadTranslations() {
        this.translations = {
            en: {
                // Navigation
                home: "Home",
                records: "Records",
                genealogy: "Genealogy",
                qr_scanner: "QR Scanner",
                logout: "Logout",
                
                // Common Actions
                save: "Save",
                cancel: "Cancel",
                edit: "Edit",
                delete: "Delete",
                add: "Add",
                search: "Search",
                filter: "Filter",
                export: "Export",
                print: "Print",
                close: "Close",
                
                // Farm Management
                farm_name: "Mountain Goat Farm",
                farm_tagline: "Premium Goat Farming Excellence",
                dashboard: "Dashboard",
                goat_records: "Goat Records",
                health_records: "Health Records",
                breeding_records: "Breeding Records",
                feed_schedule: "Feed Schedule",
                financial_records: "Financial Records",
                
                // Goat Management
                goat_name: "Goat Name",
                goat_id: "Goat ID",
                breed: "Breed",
                gender: "Gender",
                age: "Age",
                weight: "Weight",
                location: "Location",
                status: "Status",
                date_of_birth: "Date of Birth",
                color: "Color",
                
                // Health Management
                vaccination: "Vaccination",
                treatment: "Treatment",
                health_check: "Health Check",
                veterinarian: "Veterinarian",
                symptoms: "Symptoms",
                diagnosis: "Diagnosis",
                medication: "Medication",
                dosage: "Dosage",
                
                // Breeding
                breeding: "Breeding",
                sire: "Sire",
                dam: "Dam",
                breeding_date: "Breeding Date",
                expected_delivery: "Expected Delivery",
                offspring: "Offspring",
                
                // Bulk Operations
                bulk_operations: "Bulk Operations",
                select_all: "Select All",
                bulk_vaccination: "Bulk Vaccination",
                bulk_treatment: "Bulk Treatment",
                bulk_status_update: "Bulk Status Update",
                bulk_location_change: "Bulk Location Change",
                bulk_weight_recording: "Bulk Weight Recording",
                
                // Status
                active: "Active",
                quarantine: "Quarantine",
                sold: "Sold",
                deceased: "Deceased",
                
                // Messages
                success: "Success",
                error: "Error",
                warning: "Warning",
                no_data: "No data available",
                loading: "Loading...",
                
                // QR Scanner
                scan_qr: "Scan QR Code",
                generate_qr: "Generate QR Code",
                start_camera: "Start Camera",
                stop_camera: "Stop Camera",
                upload_image: "Upload Image",
                
                // Reports
                daily_report: "Daily Report",
                weekly_report: "Weekly Report",
                monthly_report: "Monthly Report",
                annual_report: "Annual Report"
            },
            sw: {
                // Navigation (Swahili)
                home: "Nyumbani",
                records: "Rekodi",
                genealogy: "Historia ya Uzazi",
                qr_scanner: "Kiskani cha QR",
                logout: "Toka",
                
                // Common Actions
                save: "Hifadhi",
                cancel: "Ghairi",
                edit: "Hariri",
                delete: "Futa",
                add: "Ongeza",
                search: "Tafuta",
                filter: "Chuja",
                export: "Hamisha",
                print: "Chapisha",
                close: "Funga",
                
                // Farm Management
                farm_name: "Shamba la Mbuzi wa Mlimani",
                farm_tagline: "Ufugaji Bora wa Mbuzi",
                dashboard: "Dashibodi",
                goat_records: "Rekodi za Mbuzi",
                health_records: "Rekodi za Afya",
                breeding_records: "Rekodi za Uzazi",
                feed_schedule: "Ratiba ya Chakula",
                financial_records: "Rekodi za Fedha",
                
                // Goat Management
                goat_name: "Jina la Mbuzi",
                goat_id: "Nambari ya Mbuzi",
                breed: "Aina",
                gender: "Jinsia",
                age: "Umri",
                weight: "Uzito",
                location: "Mahali",
                status: "Hali",
                date_of_birth: "Tarehe ya Kuzaliwa",
                color: "Rangi",
                
                // Health Management
                vaccination: "Chanjo",
                treatment: "Matibabu",
                health_check: "Uchunguzi wa Afya",
                veterinarian: "Daktari wa Wanyamapori",
                symptoms: "Dalili",
                diagnosis: "Utambuzi",
                medication: "Dawa",
                dosage: "Kipimo cha Dawa",
                
                // Breeding
                breeding: "Uzazi",
                sire: "Dume",
                dam: "Jike",
                breeding_date: "Tarehe ya Uzazi",
                expected_delivery: "Tarehe ya Kujifungua",
                offspring: "Watoto",
                
                // Bulk Operations
                bulk_operations: "Shughuli za Kimbele",
                select_all: "Chagua Zote",
                bulk_vaccination: "Chanjo za Kimbele",
                bulk_treatment: "Matibabu ya Kimbele",
                bulk_status_update: "Sasisha Hali za Kimbele",
                bulk_location_change: "Badili Mahali pa Kimbele",
                bulk_weight_recording: "Rekodi Uzito wa Kimbele",
                
                // Status
                active: "Hai",
                quarantine: "Karantini",
                sold: "Ameuzwa",
                deceased: "Amefariki",
                
                // Messages
                success: "Imefanikiwa",
                error: "Hitilafu",
                warning: "Onyo",
                no_data: "Hakuna data",
                loading: "Inapakia...",
                
                // QR Scanner
                scan_qr: "Kiskani Msimbo wa QR",
                generate_qr: "Tengeneza Msimbo wa QR",
                start_camera: "Anza Kamera",
                stop_camera: "Simamisha Kamera",
                upload_image: "Pakia Picha",
                
                // Reports
                daily_report: "Ripoti ya Kila Siku",
                weekly_report: "Ripoti ya Kila Wiki",
                monthly_report: "Ripoti ya Kila Mwezi",
                annual_report: "Ripoti ya Kila Mwaka"
            }
        };
    }

    setupLanguageToggle() {
        // Create language toggle if it doesn't exist
        this.createLanguageToggle();
        
        // Add event listeners for language switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-toggle')) {
                const newLang = e.target.dataset.lang;
                this.switchLanguage(newLang);
            }
        });
    }

    createLanguageToggle() {
        // Add language toggle to navigation if not present
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && !document.querySelector('.language-toggle')) {
            const languageToggle = document.createElement('div');
            languageToggle.className = 'language-toggle';
            languageToggle.innerHTML = `
                <button class="lang-toggle ${this.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">
                    EN
                </button>
                <button class="lang-toggle ${this.currentLanguage === 'sw' ? 'active' : ''}" data-lang="sw">
                    SW
                </button>
            `;
            navLinks.appendChild(languageToggle);
        }
    }

    switchLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('farmLanguage', language);
            this.applyTranslations();
            this.updateLanguageToggle();
            
            // Trigger language change event
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: language }
            }));
        }
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.dataset.translate;
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' && (element.type === 'submit' || element.type === 'button')) {
                    element.value = translation;
                } else if (element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update document title
        const title = this.getTranslation('farm_name');
        if (title) {
            document.title = title;
        }

        // Update language direction for RTL languages (if needed in future)
        document.documentElement.setAttribute('lang', this.currentLanguage);
    }

    updateLanguageToggle() {
        const toggles = document.querySelectorAll('.lang-toggle');
        toggles.forEach(toggle => {
            toggle.classList.toggle('active', toggle.dataset.lang === this.currentLanguage);
        });
    }

    getTranslation(key) {
        return this.translations[this.currentLanguage]?.[key] || 
               this.translations['en']?.[key] || 
               key;
    }

    t(key) {
        return this.getTranslation(key);
    }

    // Method to translate dynamic content
    translateDynamic(text, context = '') {
        const dynamicTranslations = {
            en: {
                'goats_count': (count) => `${count} goat${count !== 1 ? 's' : ''}`,
                'selected_count': (count) => `${count} selected`,
                'days_old': (days) => `${days} day${days !== 1 ? 's' : ''} old`,
                'months_old': (months) => `${months} month${months !== 1 ? 's' : ''} old`,
                'years_old': (years) => `${years} year${years !== 1 ? 's' : ''} old`,
            },
            sw: {
                'goats_count': (count) => `Mbuzi ${count}`,
                'selected_count': (count) => `${count} wamechaguliwa`,
                'days_old': (days) => `Umri siku ${days}`,
                'months_old': (months) => `Umri miezi ${months}`,
                'years_old': (years) => `Umri miaka ${years}`,
            }
        };

        const translator = dynamicTranslations[this.currentLanguage]?.[context];
        return translator ? translator(text) : text;
    }

    // Method to add translations for new features
    addTranslations(newTranslations) {
        Object.keys(newTranslations).forEach(lang => {
            if (this.translations[lang]) {
                Object.assign(this.translations[lang], newTranslations[lang]);
            } else {
                this.translations[lang] = newTranslations[lang];
            }
        });
    }

    // Method to get all available languages
    getAvailableLanguages() {
        return Object.keys(this.translations).map(code => ({
            code: code,
            name: code === 'en' ? 'English' : code === 'sw' ? 'Kiswahili' : code
        }));
    }

    // Method to format numbers based on locale
    formatNumber(number) {
        const localeMap = {
            'en': 'en-US',
            'sw': 'sw-KE'
        };
        
        const locale = localeMap[this.currentLanguage] || 'en-US';
        return new Intl.NumberFormat(locale).format(number);
    }

    // Method to format dates based on locale
    formatDate(date) {
        const localeMap = {
            'en': 'en-US',
            'sw': 'sw-KE'
        };
        
        const locale = localeMap[this.currentLanguage] || 'en-US';
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    // Method to format currency
    formatCurrency(amount) {
        const localeMap = {
            'en': 'en-KE',
            'sw': 'sw-KE'
        };
        
        const locale = localeMap[this.currentLanguage] || 'en-KE';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    }
}

// CSS for language toggle
const languageCSS = `
.language-toggle {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-left: 1rem;
}

.lang-toggle {
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.lang-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
}

.lang-toggle.active {
    background: white;
    color: var(--logo-green);
    border-color: white;
}

@media (max-width: 768px) {
    .language-toggle {
        margin-left: 0;
        margin-top: 1rem;
        justify-content: center;
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = languageCSS;
document.head.appendChild(style);

// Initialize language manager
let languageManager;
document.addEventListener('DOMContentLoaded', function() {
    languageManager = new LanguageManager();
    
    // Make it globally available
    window.languageManager = languageManager;
    window.t = (key) => languageManager.getTranslation(key);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
