// External Access Management UI
// Admin dashboard for managing trusted external access

class ExternalAccessUI {
    constructor(externalAccessManager) {
        this.manager = externalAccessManager;
        this.init();
    }

    init() {
        this.createUI();
        this.renderTokenList();
        this.renderAuditLog();
        this.setupEventListeners();
    }

    createUI() {
        // Show field-level permissions per role
        const roleFields = window.ExternalAccessManager?.ROLE_FIELD_PERMISSIONS || {};
        let roleTable = '<table class="role-fields-table" style="margin-bottom:1em;width:100%;border-collapse:collapse;font-size:0.95em;"><tr><th>Role</th><th>Data Type</th><th>Fields Visible</th></tr>';
        for (const role in roleFields) {
            for (const type in roleFields[role]) {
                if (roleFields[role][type].length > 0) {
                    roleTable += `<tr><td>${role}</td><td>${type}</td><td>${roleFields[role][type].join(', ')}</td></tr>`;
                }
            }
        }
        roleTable += '</table>';

        const html = `
        <div id="external-access-section" class="records-section" style="display:none;">
            <div class="container">
                <div class="section-header">
                    <h2>🔑 External Access Management</h2>
                </div>
                <div class="role-fields-info">
                    <h4>Field-Level Permissions by Role</h4>
                    ${roleTable}
                </div>
                <form id="external-access-form" class="access-form">
                    <label>
                        Name/Email:
                        <input type="text" id="access-user" required placeholder="Dr. Vet, inspector@agency.com">
                    </label>
                    <label>
                        Role:
                        <select id="access-role">
                            <option value="vet">Vet</option>
                            <option value="consultant">Consultant</option>
                            <option value="inspector">Inspector</option>
                        </select>
                    </label>
                    <label>
                        Permissions:
                        <select id="access-permissions" multiple>
                            <option value="view" selected>View Records</option>
                            <option value="export">Export Reports</option>
                        </select>
                    </label>
                    <label>
                        Data Types:
                        <select id="access-data-types" multiple>
                            <option value="goats" selected>Goat Records</option>
                            <option value="health" selected>Health Records</option>
                            <option value="breeding">Breeding Records</option>
                            <option value="feed">Feed Records</option>
                            <option value="financial">Financial Records</option>
                        </select>
                    </label>
                    <label>
                        Expiration (minutes):
                        <input type="number" id="access-expiry" value="60" min="5" max="1440">
                    </label>
                    <button type="submit" class="btn-primary">Generate Access Token</button>
                </form>
                <div class="token-list-section">
                    <h3>Active Tokens</h3>
                    <div id="token-list"></div>
                </div>
                <div class="audit-log-section">
                    <h3>Audit Log</h3>
                    <div id="audit-log"></div>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        this.addNavLink();
    }

    addNavLink() {
        const nav = document.querySelector('.nav-links');
        if (!nav) return;
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" onclick="externalAccessUI.showSection()">🔑 External Access</a>`;
        nav.appendChild(li);
    }

    setupEventListeners() {
        document.getElementById('external-access-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateToken();
        });
    }

    showSection() {
        document.querySelectorAll('.records-section').forEach(s => s.style.display = 'none');
        document.getElementById('external-access-section').style.display = 'block';
    }

    generateToken() {
        const user = document.getElementById('access-user').value.trim();
        const role = document.getElementById('access-role').value;
        const permissions = Array.from(document.getElementById('access-permissions').selectedOptions).map(o => o.value);
        const dataTypes = Array.from(document.getElementById('access-data-types').selectedOptions).map(o => o.value);
        const expiry = parseInt(document.getElementById('access-expiry').value, 10);
        if (!user || !expiry) return;
        const token = this.manager.createAccessToken({ user, role, dataTypes }, permissions, expiry);
        this.renderTokenList();
        this.renderAuditLog();
        alert(`Access token generated for ${user}:\n${token}`);
    }

    renderTokenList() {
        const container = document.getElementById('token-list');
        if (!container) return;
        container.innerHTML = '';
        for (const [token, entry] of this.manager.activeTokens.entries()) {
            const expiresIn = Math.max(0, Math.floor((entry.expires - Date.now()) / 60000));
            const div = document.createElement('div');
            div.className = 'token-item';
            div.innerHTML = `
                <strong>${entry.user.user}</strong> (${entry.user.role})<br>
                Permissions: ${entry.permissions.join(', ')}<br>
                Data Types: ${entry.user.dataTypes.join(', ')}<br>
                Expires in: ${expiresIn} min<br>
                <input type="text" readonly value="${token}" style="width:250px;">
                <button onclick="externalAccessUI.revokeToken('${token}')" class="btn-secondary">Revoke</button>
            `;
            container.appendChild(div);
        }
    }

    revokeToken(token) {
        this.manager.revokeToken(token);
        this.renderTokenList();
        this.renderAuditLog();
    }

    renderAuditLog() {
        const container = document.getElementById('audit-log');
        if (!container) return;
        const log = this.manager.getAccessLog();
        container.innerHTML = log.length === 0 ? '<em>No access events yet.</em>' :
            log.slice(-20).reverse().map(entry => `
                <div class="audit-item">
                    <strong>${entry.user.user || entry.user}</strong> - ${entry.action}
                    <span style="float:right; color:#888;">${entry.timestamp}</span><br>
                    <small>${JSON.stringify(entry.details)}</small>
                </div>
            `).join('');
    }
}

// Auto-init if manager is available
if (typeof window !== 'undefined') {
    window.ExternalAccessUI = ExternalAccessUI;
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (window.ExternalAccessManager && window.farmRecordsManager) {
                window.externalAccessUI = new ExternalAccessUI(
                    new window.ExternalAccessManager(window.farmRecordsManager)
                );
            }
        }, 1000);
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExternalAccessUI;
}
