// ===============================================
// M-PESA INTEGRATION FOR PAYMENTS AND TRANSACTIONS
// ===============================================

class MPesaIntegration {
    constructor() {
        this.isProduction = false; // Set to true for production
        this.baseURL = this.isProduction ? 
            'https://api.safaricom.co.ke' : 
            'https://sandbox.safaricom.co.ke';
        
        this.credentials = {
            consumerKey: 'YOUR_CONSUMER_KEY', // Replace with actual credentials
            consumerSecret: 'YOUR_CONSUMER_SECRET',
            shortcode: '174379', // Test shortcode
            passkey: 'YOUR_PASSKEY',
            initiatorName: 'testapi',
            securityCredential: 'YOUR_SECURITY_CREDENTIAL'
        };
        
        this.accessToken = null;
        this.tokenExpiry = null;
        this.init();
    }

    init() {
        this.createPaymentInterface();
        this.setupEventListeners();
        this.loadTransactionHistory();
    }

    // Authentication
    async getAccessToken() {
        if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const auth = btoa(`${this.credentials.consumerKey}:${this.credentials.consumerSecret}`);
            
            const response = await fetch(`${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.access_token) {
                this.accessToken = data.access_token;
                this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
                return this.accessToken;
            } else {
                throw new Error('Failed to get access token');
            }
        } catch (error) {
            console.error('M-Pesa authentication error:', error);
            throw error;
        }
    }

    // STK Push (Lipa na M-Pesa)
    async stkPush(phoneNumber, amount, accountReference, transactionDesc) {
        try {
            const token = await this.getAccessToken();
            const timestamp = this.generateTimestamp();
            const password = btoa(`${this.credentials.shortcode}${this.credentials.passkey}${timestamp}`);

            const payload = {
                BusinessShortCode: this.credentials.shortcode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: this.credentials.shortcode,
                PhoneNumber: phoneNumber,
                CallBackURL: `${window.location.origin}/api/mpesa/callback`,
                AccountReference: accountReference,
                TransactionDesc: transactionDesc
            };

            const response = await fetch(`${this.baseURL}/mpesa/stkpush/v1/processrequest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            
            if (data.ResponseCode === '0') {
                this.trackTransaction(data.CheckoutRequestID, phoneNumber, amount, accountReference);
                return {
                    success: true,
                    checkoutRequestID: data.CheckoutRequestID,
                    merchantRequestID: data.MerchantRequestID,
                    message: data.ResponseDescription
                };
            } else {
                throw new Error(data.ResponseDescription || 'STK Push failed');
            }
        } catch (error) {
            console.error('STK Push error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Query STK Push status
    async querySTKStatus(checkoutRequestID) {
        try {
            const token = await this.getAccessToken();
            const timestamp = this.generateTimestamp();
            const password = btoa(`${this.credentials.shortcode}${this.credentials.passkey}${timestamp}`);

            const payload = {
                BusinessShortCode: this.credentials.shortcode,
                Password: password,
                Timestamp: timestamp,
                CheckoutRequestID: checkoutRequestID
            };

            const response = await fetch(`${this.baseURL}/mpesa/stkpushquery/v1/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('STK Query error:', error);
            throw error;
        }
    }

    // B2C (Business to Customer) Transaction
    async b2cTransaction(phoneNumber, amount, occasion, remarks) {
        try {
            const token = await this.getAccessToken();

            const payload = {
                InitiatorName: this.credentials.initiatorName,
                SecurityCredential: this.credentials.securityCredential,
                CommandID: 'BusinessPayment',
                Amount: amount,
                PartyA: this.credentials.shortcode,
                PartyB: phoneNumber,
                Remarks: remarks,
                QueueTimeOutURL: `${window.location.origin}/api/mpesa/timeout`,
                ResultURL: `${window.location.origin}/api/mpesa/result`,
                Occasion: occasion
            };

            const response = await fetch(`${this.baseURL}/mpesa/b2c/v1/paymentrequest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('B2C Transaction error:', error);
            throw error;
        }
    }

    // Payment Interface Creation
    createPaymentInterface() {
        // Create payment modal
        const paymentModal = document.createElement('div');
        paymentModal.id = 'mpesaPaymentModal';
        paymentModal.className = 'payment-modal';
        paymentModal.innerHTML = `
            <div class="payment-modal-content">
                <div class="payment-header">
                    <h3 data-translate="mpesa_payment">M-Pesa Payment</h3>
                    <button class="close-payment" onclick="this.closest('.payment-modal').style.display='none'">&times;</button>
                </div>
                
                <div class="payment-body">
                    <div class="mpesa-logo">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8dGV4dCB4PSI1IiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAwODAzNyI+TS1QRVNBPC90ZXh0Pgo8L3N2Zz4K" alt="M-Pesa">
                    </div>
                    
                    <form id="mpesaPaymentForm">
                        <div class="form-group">
                            <label data-translate="phone_number">Phone Number:</label>
                            <input type="tel" id="mpesaPhone" pattern="[0-9]{10,12}" placeholder="254712345678" required>
                            <small data-translate="phone_format">Format: 254712345678</small>
                        </div>
                        
                        <div class="form-group">
                            <label data-translate="amount">Amount (KES):</label>
                            <input type="number" id="mpesaAmount" min="1" step="0.01" required>
                        </div>
                        
                        <div class="form-group">
                            <label data-translate="payment_for">Payment For:</label>
                            <select id="mpesaPaymentType">
                                <option value="goat_sale" data-translate="goat_sale">Goat Sale</option>
                                <option value="milk_payment" data-translate="milk_payment">Milk Payment</option>
                                <option value="service_fee" data-translate="service_fee">Service Fee</option>
                                <option value="feed_purchase" data-translate="feed_purchase">Feed Purchase</option>
                                <option value="veterinary_bill" data-translate="veterinary_bill">Veterinary Bill</option>
                                <option value="other" data-translate="other">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label data-translate="reference">Reference:</label>
                            <input type="text" id="mpesaReference" placeholder="INV-2024-001" required>
                        </div>
                        
                        <div class="form-group">
                            <label data-translate="description">Description:</label>
                            <textarea id="mpesaDescription" rows="3"></textarea>
                        </div>
                        
                        <div class="payment-actions">
                            <button type="button" class="btn-secondary" onclick="this.closest('.payment-modal').style.display='none'" data-translate="cancel">Cancel</button>
                            <button type="submit" class="btn-primary" data-translate="request_payment">Request Payment</button>
                        </div>
                    </form>
                    
                    <div id="paymentStatus" class="payment-status" style="display: none;">
                        <div class="status-icon"></div>
                        <div class="status-message"></div>
                        <div class="status-details"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(paymentModal);
        
        // Add M-Pesa payment buttons to relevant pages
        this.addPaymentButtons();
        this.injectPaymentCSS();
    }

    addPaymentButtons() {
        // Add payment button to financial records page
        const addPaymentBtn = document.createElement('button');
        addPaymentBtn.className = 'mpesa-btn';
        addPaymentBtn.innerHTML = '<span class="mpesa-icon">💳</span> <span data-translate="mpesa_payment">M-Pesa Payment</span>';
        addPaymentBtn.onclick = () => this.openPaymentModal();
        
        // Find appropriate container for the button
        const actionsContainer = document.querySelector('.bulk-actions, .page-actions, .header-actions');
        if (actionsContainer) {
            actionsContainer.appendChild(addPaymentBtn);
        }
    }

    setupEventListeners() {
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'mpesaPaymentForm') {
                e.preventDefault();
                this.processPayment();
            }
        });

        // Listen for payment status updates
        document.addEventListener('mpesaPaymentStatus', (e) => {
            this.handlePaymentStatusUpdate(e.detail);
        });
    }

    openPaymentModal(amount = '', reference = '', description = '') {
        const modal = document.getElementById('mpesaPaymentModal');
        const form = document.getElementById('mpesaPaymentForm');
        
        // Pre-fill form if values provided
        if (amount) document.getElementById('mpesaAmount').value = amount;
        if (reference) document.getElementById('mpesaReference').value = reference;
        if (description) document.getElementById('mpesaDescription').value = description;
        
        modal.style.display = 'flex';
        document.getElementById('mpesaPhone').focus();
    }

    async processPayment() {
        const form = document.getElementById('mpesaPaymentForm');
        const statusDiv = document.getElementById('paymentStatus');
        
        const phoneNumber = document.getElementById('mpesaPhone').value;
        const amount = parseFloat(document.getElementById('mpesaAmount').value);
        const paymentType = document.getElementById('mpesaPaymentType').value;
        const reference = document.getElementById('mpesaReference').value;
        const description = document.getElementById('mpesaDescription').value;
        
        // Validate inputs
        if (!this.validatePhone(phoneNumber)) {
            this.showPaymentStatus('error', 'Invalid phone number format');
            return;
        }
        
        if (amount < 1) {
            this.showPaymentStatus('error', 'Amount must be at least KES 1');
            return;
        }
        
        // Show loading status
        this.showPaymentStatus('loading', 'Initiating M-Pesa payment...');
        
        try {
            const result = await this.stkPush(
                phoneNumber,
                amount,
                reference,
                description || `${paymentType.replace('_', ' ')} - ${reference}`
            );
            
            if (result.success) {
                this.showPaymentStatus('success', 'Payment request sent to your phone', 
                    'Please check your phone and enter your M-Pesa PIN to complete the payment');
                
                // Start monitoring payment status
                this.monitorPaymentStatus(result.checkoutRequestID);
                
                // Save transaction record
                this.saveTransactionRecord({
                    checkoutRequestID: result.checkoutRequestID,
                    phoneNumber,
                    amount,
                    reference,
                    description,
                    paymentType,
                    status: 'pending',
                    timestamp: new Date().toISOString()
                });
                
            } else {
                this.showPaymentStatus('error', 'Payment request failed', result.error);
            }
        } catch (error) {
            this.showPaymentStatus('error', 'Payment failed', error.message);
        }
    }

    async monitorPaymentStatus(checkoutRequestID) {
        let attempts = 0;
        const maxAttempts = 30; // Monitor for 5 minutes (30 * 10 seconds)
        
        const checkStatus = async () => {
            try {
                const status = await this.querySTKStatus(checkoutRequestID);
                
                if (status.ResultCode === '0') {
                    // Payment successful
                    this.showPaymentStatus('success', 'Payment completed successfully!');
                    this.updateTransactionStatus(checkoutRequestID, 'completed', status);
                    this.refreshFinancialRecords();
                } else if (status.ResultCode) {
                    // Payment failed
                    this.showPaymentStatus('error', 'Payment failed', status.ResultDesc);
                    this.updateTransactionStatus(checkoutRequestID, 'failed', status);
                } else if (attempts < maxAttempts) {
                    // Still pending, check again
                    attempts++;
                    setTimeout(checkStatus, 10000); // Check every 10 seconds
                } else {
                    // Timeout
                    this.showPaymentStatus('warning', 'Payment status unknown', 
                        'Please check your M-Pesa messages for confirmation');
                    this.updateTransactionStatus(checkoutRequestID, 'timeout');
                }
            } catch (error) {
                console.error('Status check error:', error);
                if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkStatus, 10000);
                }
            }
        };
        
        // Start checking after 5 seconds
        setTimeout(checkStatus, 5000);
    }

    showPaymentStatus(type, message, details = '') {
        const statusDiv = document.getElementById('paymentStatus');
        const iconDiv = statusDiv.querySelector('.status-icon');
        const messageDiv = statusDiv.querySelector('.status-message');
        const detailsDiv = statusDiv.querySelector('.status-details');
        
        statusDiv.style.display = 'block';
        statusDiv.className = `payment-status ${type}`;
        
        const icons = {
            loading: '⏳',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };
        
        iconDiv.textContent = icons[type] || '📱';
        messageDiv.textContent = message;
        detailsDiv.textContent = details;
        
        // Auto-hide after 10 seconds for success/error
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
                if (type === 'success') {
                    document.getElementById('mpesaPaymentModal').style.display = 'none';
                }
            }, 10000);
        }
    }

    // Transaction Management
    saveTransactionRecord(transaction) {
        const transactions = this.getTransactionHistory();
        transactions.unshift(transaction);
        localStorage.setItem('mpesaTransactions', JSON.stringify(transactions));
    }

    updateTransactionStatus(checkoutRequestID, status, details = {}) {
        const transactions = this.getTransactionHistory();
        const transaction = transactions.find(t => t.checkoutRequestID === checkoutRequestID);
        
        if (transaction) {
            transaction.status = status;
            transaction.lastUpdated = new Date().toISOString();
            if (details.MpesaReceiptNumber) {
                transaction.mpesaReceiptNumber = details.MpesaReceiptNumber;
            }
            localStorage.setItem('mpesaTransactions', JSON.stringify(transactions));
        }
    }

    getTransactionHistory() {
        return JSON.parse(localStorage.getItem('mpesaTransactions') || '[]');
    }

    loadTransactionHistory() {
        // This would typically load from a backend database
        const transactions = this.getTransactionHistory();
        console.log('M-Pesa transaction history:', transactions);
    }

    // Utility Methods
    validatePhone(phone) {
        const kenyanPhoneRegex = /^254[0-9]{9}$/;
        return kenyanPhoneRegex.test(phone);
    }

    generateTimestamp() {
        const now = new Date();
        return now.getFullYear() +
               String(now.getMonth() + 1).padStart(2, '0') +
               String(now.getDate()).padStart(2, '0') +
               String(now.getHours()).padStart(2, '0') +
               String(now.getMinutes()).padStart(2, '0') +
               String(now.getSeconds()).padStart(2, '0');
    }

    trackTransaction(checkoutRequestID, phoneNumber, amount, reference) {
        // Send tracking data to analytics or backend
        console.log('Tracking M-Pesa transaction:', {
            checkoutRequestID,
            phoneNumber: phoneNumber.substring(0, 6) + 'XXX', // Partial phone for privacy
            amount,
            reference
        });
    }

    refreshFinancialRecords() {
        // Refresh the financial records page if open
        if (window.location.pathname.includes('financial-records')) {
            window.location.reload();
        }
    }

    // Payment shortcuts for specific use cases
    async requestGoatPayment(goatId, buyerPhone, amount) {
        return this.openPaymentModal(amount, `GOAT-${goatId}`, `Payment for goat ${goatId}`);
    }

    async requestMilkPayment(period, buyerPhone, amount) {
        return this.openPaymentModal(amount, `MILK-${period}`, `Milk payment for ${period}`);
    }

    async paySupplier(supplierPhone, amount, invoiceRef) {
        // B2C payment to supplier
        try {
            const result = await this.b2cTransaction(
                supplierPhone,
                amount,
                `Payment for ${invoiceRef}`,
                `Supplier payment - ${invoiceRef}`
            );
            return result;
        } catch (error) {
            console.error('Supplier payment error:', error);
            throw error;
        }
    }

    injectPaymentCSS() {
        const css = `
            .payment-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 1000;
                align-items: center;
                justify-content: center;
            }

            .payment-modal-content {
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }

            .payment-header {
                padding: 1.5rem;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #00803D, #28a745);
                color: white;
                border-radius: 12px 12px 0 0;
            }

            .payment-header h3 {
                margin: 0;
                color: white;
            }

            .close-payment {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .close-payment:hover {
                background: rgba(255,255,255,0.1);
            }

            .payment-body {
                padding: 1.5rem;
            }

            .mpesa-logo {
                text-align: center;
                margin-bottom: 1.5rem;
            }

            .mpesa-logo img {
                height: 40px;
            }

            .form-group {
                margin-bottom: 1rem;
            }

            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
                color: var(--text-dark);
            }

            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e1e8ed;
                border-radius: 6px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }

            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: var(--logo-green);
            }

            .form-group small {
                display: block;
                margin-top: 0.25rem;
                color: #666;
                font-size: 0.875rem;
            }

            .payment-actions {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
            }

            .payment-actions button {
                flex: 1;
                padding: 0.75rem;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-primary {
                background: var(--logo-green);
                color: white;
            }

            .btn-primary:hover {
                background: var(--logo-green-dark);
            }

            .btn-secondary {
                background: #6c757d;
                color: white;
            }

            .btn-secondary:hover {
                background: #5a6268;
            }

            .payment-status {
                margin-top: 1.5rem;
                padding: 1rem;
                border-radius: 6px;
                text-align: center;
            }

            .payment-status.loading {
                background: #e3f2fd;
                border: 1px solid #2196f3;
                color: #1976d2;
            }

            .payment-status.success {
                background: #e8f5e8;
                border: 1px solid #4caf50;
                color: #2e7d32;
            }

            .payment-status.error {
                background: #ffebee;
                border: 1px solid #f44336;
                color: #c62828;
            }

            .payment-status.warning {
                background: #fff3e0;
                border: 1px solid #ff9800;
                color: #ef6c00;
            }

            .status-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }

            .status-message {
                font-weight: 600;
                margin-bottom: 0.5rem;
            }

            .status-details {
                font-size: 0.9rem;
                opacity: 0.8;
            }

            .mpesa-btn {
                background: linear-gradient(135deg, #00803D, #28a745);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
            }

            .mpesa-btn:hover {
                background: linear-gradient(135deg, #006b33, #218838);
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }

            .mpesa-icon {
                font-size: 1.2rem;
            }

            @media (max-width: 768px) {
                .payment-modal-content {
                    width: 95%;
                    margin: 1rem;
                }

                .payment-actions {
                    flex-direction: column;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
}

// Initialize M-Pesa Integration
let mpesaIntegration;
document.addEventListener('DOMContentLoaded', function() {
    mpesaIntegration = new MPesaIntegration();
    
    // Make it globally available
    window.mpesaIntegration = mpesaIntegration;
    
    // Add translations for M-Pesa
    if (window.languageManager) {
        languageManager.addTranslations({
            en: {
                mpesa_payment: "M-Pesa Payment",
                phone_number: "Phone Number",
                phone_format: "Format: 254712345678",
                amount: "Amount (KES)",
                payment_for: "Payment For",
                goat_sale: "Goat Sale",
                milk_payment: "Milk Payment",
                service_fee: "Service Fee",
                feed_purchase: "Feed Purchase",
                veterinary_bill: "Veterinary Bill",
                other: "Other",
                reference: "Reference",
                description: "Description",
                request_payment: "Request Payment"
            },
            sw: {
                mpesa_payment: "Malipo ya M-Pesa",
                phone_number: "Nambari ya Simu",
                phone_format: "Mfumo: 254712345678",
                amount: "Kiasi (KES)",
                payment_for: "Malipo ya",
                goat_sale: "Uuzaji wa Mbuzi",
                milk_payment: "Malipo ya Maziwa",
                service_fee: "Ada ya Huduma",
                feed_purchase: "Ununuzi wa Chakula",
                veterinary_bill: "Bill ya Daktari wa Wanyamapori",
                other: "Mengine",
                reference: "Rejea",
                description: "Maelezo",
                request_payment: "Omba Malipo"
            }
        });
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MPesaIntegration;
}
