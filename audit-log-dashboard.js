// Audit Log Dashboard JS
// Loads audit log data, populates table, filters, and renders charts

// Example: Load from localStorage (replace with real API in production)
async function getAuditLogData() {
    const response = await fetch('/api/audit-logs');
    if (!response.ok) throw new Error('Failed to fetch audit logs');
    return await response.json();
}

function populateFilters(logs) {
    // User filter
    const userSet = new Set(logs.map(l => l.user));
    const userFilter = document.getElementById('user-filter');
    userSet.forEach(user => {
        if (user) {
            const opt = document.createElement('option');
            opt.value = user;
            opt.textContent = user;
            userFilter.appendChild(opt);
        }
    });
    // Module filter
    const moduleSet = new Set(logs.map(l => l.action.split('_')[0]));
    const moduleFilter = document.getElementById('module-filter');
    moduleSet.forEach(module => {
        if (module) {
            const opt = document.createElement('option');
            opt.value = module;
            opt.textContent = module.charAt(0).toUpperCase() + module.slice(1);
            moduleFilter.appendChild(opt);
        }
    });
}

function filterLogs(logs) {
    const user = document.getElementById('user-filter').value;
    const date = document.getElementById('date-filter').value;
    const module = document.getElementById('module-filter').value;
    return logs.filter(l => {
        let match = true;
        if (user && l.user !== user) match = false;
        if (date && !l.timestamp.startsWith(date)) match = false;
        if (module && !l.action.startsWith(module)) match = false;
        return match;
    });
}

function populateTable(logs) {
    const tbody = document.querySelector('#audit-log-table tbody');
    tbody.innerHTML = '';
    logs.forEach(l => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${l.timestamp}</td>
            <td>${l.user}</td>
            <td>${l.action}</td>
            <td>${l.action.split('_')[0]}</td>
            <td>${l.details}</td>
        `;
        tbody.appendChild(tr);
    });
}

function exportCSV(logs) {
    let csv = 'Date/Time,User,Action,Module,Details\n';
    logs.forEach(l => {
        csv += `${l.timestamp},${l.user},${l.action},${l.action.split('_')[0]},${l.details}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-log.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function renderCharts(logs) {
    // Most Active Staff
    const userCounts = {};
    logs.forEach(l => {
        userCounts[l.user] = (userCounts[l.user] || 0) + 1;
    });
    const activeUsersChart = new Chart(document.getElementById('active-users-chart'), {
        type: 'bar',
        data: {
            labels: Object.keys(userCounts),
            datasets: [{
                label: 'Actions',
                data: Object.values(userCounts),
                backgroundColor: '#27ae60',
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
    // Peak Usage Hours
    const hourCounts = {};
    logs.forEach(l => {
        const hour = new Date(l.timestamp).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const usageHoursChart = new Chart(document.getElementById('usage-hours-chart'), {
        type: 'line',
        data: {
            labels: Object.keys(hourCounts).map(h => h + ':00'),
            datasets: [{
                label: 'Actions',
                data: Object.values(hourCounts),
                borderColor: '#2980b9',
                backgroundColor: 'rgba(41,128,185,0.1)',
                fill: true,
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
    // Action Breakdown
    const actionCounts = {};
    logs.forEach(l => {
        const action = l.action.split('_')[0];
        actionCounts[action] = (actionCounts[action] || 0) + 1;
    });
    const actionBreakdownChart = new Chart(document.getElementById('action-breakdown-chart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(actionCounts),
            datasets: [{
                label: 'Actions',
                data: Object.values(actionCounts),
                backgroundColor: ['#27ae60','#e67e22','#3498db','#e74c3c','#9b59b6','#f39c12'],
            }]
        },
        options: { responsive: true }
    });
}

// Main
async function refreshDashboard() {
    try {
        const logs = await getAuditLogData();
        populateFilters(logs);
        let filtered = filterLogs(logs);
        populateTable(filtered);
        renderCharts(filtered);
    } catch (err) {
        console.error('Error loading audit logs:', err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    await refreshDashboard();
    // Filter handlers
    document.getElementById('user-filter').addEventListener('change', refreshDashboard);
    document.getElementById('date-filter').addEventListener('change', refreshDashboard);
    document.getElementById('module-filter').addEventListener('change', refreshDashboard);
    document.getElementById('export-btn').addEventListener('click', async () => {
        const logs = await getAuditLogData();
        exportCSV(filterLogs(logs));
    });
    // Form handler
    document.getElementById('audit-log-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('form-user').value.trim();
        const action = document.getElementById('form-action').value.trim();
        const details = document.getElementById('form-details').value.trim();
        const timestamp = new Date().toISOString();
        const statusDiv = document.getElementById('form-status');
        statusDiv.textContent = 'Saving...';
        try {
            const res = await fetch('/api/audit-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timestamp, user, action, details })
            });
            const result = await res.json();
            if (result.success) {
                statusDiv.textContent = 'Entry added!';
                document.getElementById('audit-log-form').reset();
                await refreshDashboard();
            } else {
                statusDiv.textContent = 'Error: ' + (result.error || 'Unknown error');
            }
        } catch (err) {
            statusDiv.textContent = 'Error saving entry.';
        }
    });

    // WebSocket client for real-time updates
    let wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let wsUrl = wsProtocol + '//' + window.location.hostname + ':' + (window.location.port || '3001');
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
        // Re-fetch logs and update dashboard on new log broadcast
        refreshDashboard();
    };
});
