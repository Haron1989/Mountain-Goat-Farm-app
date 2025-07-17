// Trusted External Vet/Advisor Access Module
// Allows temporary, controlled access to farm records for remote vet, consultant, or inspector

class ExternalAccessManager {
    // Field-level permissions per role
    static ROLE_FIELD_PERMISSIONS = {
        vet: {
            goats: ['id', 'name', 'earTag', 'breed', 'gender', 'dateOfBirth'],
            healthRecords: ['id', 'goatId', 'date', 'treatment', 'veterinarian', 'followUpDate'],
            breedingRecords: ['id', 'doeId', 'doe', 'buck', 'breedingDate', 'status', 'kiddingDate'],
            feedRecords: ['id', 'date', 'feedType', 'quantity'],
            transactions: [],
            sales: [],
            products: [],
            contacts: []
        },
        consultant: {
            goats: ['id', 'name', 'earTag', 'breed', 'gender', 'dateOfBirth'],
            healthRecords: ['id', 'goatId', 'date', 'treatment'],
            breedingRecords: ['id', 'doeId', 'doe', 'buck', 'breedingDate', 'status', 'kiddingDate'],
            feedRecords: ['id', 'date', 'feedType', 'quantity'],
            transactions: ['id', 'description', 'amount', 'date', 'category'],
            sales: ['id', 'product', 'amount', 'date'],
            products: ['id', 'name', 'type', 'quantity'],
            contacts: ['id', 'name', 'role']
        },
        inspector: {
            goats: ['id', 'name', 'earTag', 'breed', 'gender'],
            healthRecords: ['id', 'goatId', 'date', 'treatment'],
            breedingRecords: ['id', 'doeId', 'doe', 'buck', 'breedingDate', 'status'],
            feedRecords: ['id', 'date', 'feedType'],
            transactions: [],
            sales: [],
            products: [],
            contacts: []
        }
    };
    constructor(farmRecordsManager) {
        this.farmManager = farmRecordsManager;
        this.activeTokens = new Map(); // token -> { user, expires, permissions }
        this.accessLog = [];
    }

    // Generate a secure access token for external user
    createAccessToken(user, permissions = ['view'], durationMinutes = 60) {
        const token = this.generateToken();
        const expires = Date.now() + durationMinutes * 60 * 1000;
        this.activeTokens.set(token, { user, expires, permissions });
        this.logAccess(user, 'token_created', { token, expires, permissions });
        return token;
    }

    // Validate token and permissions
    validateToken(token, requiredPermission = 'view') {
        const entry = this.activeTokens.get(token);
        if (!entry) return false;
        if (Date.now() > entry.expires) {
            this.activeTokens.delete(token);
            this.logAccess(entry.user, 'token_expired', { token });
            return false;
        }
        if (!entry.permissions.includes(requiredPermission)) return false;
        this.logAccess(entry.user, 'token_validated', { token, requiredPermission });
        return true;
    }

    // Revoke token manually
    revokeToken(token) {
        const entry = this.activeTokens.get(token);
        if (entry) {
            this.activeTokens.delete(token);
            this.logAccess(entry.user, 'token_revoked', { token });
        }
    }

    // Get farm records for external user (read-only, field-level restrictions)
    getExternalRecords(token) {
        if (!this.validateToken(token, 'view')) return null;
        const entry = this.activeTokens.get(token);
        const allowed = entry.user.dataTypes || [];
        const role = entry.user.role;
        const records = {};
        const fieldConfig = ExternalAccessManager.ROLE_FIELD_PERMISSIONS[role] || {};

        // Helper to filter fields
        function filterFields(arr, fields) {
            if (!Array.isArray(arr) || !fields || fields.length === 0) return [];
            return arr.map(obj => {
                const filtered = {};
                fields.forEach(f => { if (obj.hasOwnProperty(f)) filtered[f] = obj[f]; });
                return filtered;
            });
        }

        if (allowed.includes('goats') && fieldConfig.goats) {
            records.goats = filterFields(this.farmManager.goats, fieldConfig.goats);
        }
        if (allowed.includes('health') && fieldConfig.healthRecords) {
            records.healthRecords = filterFields(this.farmManager.healthRecords, fieldConfig.healthRecords);
        }
        if (allowed.includes('breeding') && fieldConfig.breedingRecords) {
            records.breedingRecords = filterFields(this.farmManager.breedingRecords, fieldConfig.breedingRecords);
        }
        if (allowed.includes('feed') && fieldConfig.feedRecords) {
            records.feedRecords = filterFields(this.farmManager.feedRecords, fieldConfig.feedRecords);
        }
        if (allowed.includes('financial') && fieldConfig.transactions) {
            records.transactions = filterFields(this.farmManager.transactions, fieldConfig.transactions);
        }
        if (allowed.includes('financial') && fieldConfig.sales) {
            records.sales = filterFields(this.farmManager.sales, fieldConfig.sales);
        }
        if (allowed.includes('products') && fieldConfig.products) {
            records.products = filterFields(this.farmManager.products, fieldConfig.products);
        }
        if (allowed.includes('contacts') && fieldConfig.contacts) {
            records.contacts = filterFields(this.farmManager.contacts, fieldConfig.contacts);
        }
        records.lastHealthCheck = this.farmManager.healthCheckSystem?.lastHealthCheck || null;
        return records;
    }

    // Get health check report for external user
    getExternalReport(token, format = 'html') {
        if (!this.validateToken(token, 'view')) return null;
        if (!this.farmManager.healthCheckSystem?.lastHealthCheck) return null;
        return this.farmManager.healthCheckSystem.generateHealthCheckReport(
            this.farmManager.healthCheckSystem.lastHealthCheck, format
        );
    }

    // Utility: Generate a random token
    generateToken(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < length; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }

    // Log all access for audit
    logAccess(user, action, details) {
        this.accessLog.push({
            timestamp: new Date().toISOString(),
            user,
            action,
            details
        });
        // Optionally, persist log to localStorage or server
    }

    // Cleanup expired tokens periodically
    cleanupExpiredTokens() {
        const now = Date.now();
        for (const [token, entry] of this.activeTokens.entries()) {
            if (now > entry.expires) {
                this.activeTokens.delete(token);
                this.logAccess(entry.user, 'token_expired', { token });
            }
        }
    }

    // Get audit log
    getAccessLog() {
        return this.accessLog;
    }
}

// Usage Example:
// const externalAccess = new ExternalAccessManager(window.farmRecordsManager);
// const token = externalAccess.createAccessToken('Dr. Vet', ['view'], 120); // 2 hours
// externalAccess.getExternalRecords(token);
// externalAccess.getExternalReport(token, 'html');

if (typeof window !== 'undefined') {
    window.ExternalAccessManager = ExternalAccessManager;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExternalAccessManager;
}
