// --- Authentication Modal Logic ---
let authToken = '';
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('auth-modal');
  const openBtn = document.getElementById('open-auth');
  const closeBtn = document.getElementById('close-auth');
  openBtn.onclick = () => { modal.style.display = 'block'; };
  closeBtn.onclick = () => { modal.style.display = 'none'; };
  window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

  // Login
  document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const statusDiv = document.getElementById('login-status');
    statusDiv.textContent = 'Logging in...';
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const result = await res.json();
      if (result.token) {
        authToken = result.token;
        statusDiv.textContent = 'Login successful!';
        modal.style.display = 'none';
      } else {
        statusDiv.textContent = 'Error: ' + (result.error || 'Unknown error');
      }
    } catch (err) {
      statusDiv.textContent = 'Login failed.';
    }
  };

  // Register
  document.getElementById('register-form').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;
    const statusDiv = document.getElementById('register-status');
    statusDiv.textContent = 'Registering...';
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      const result = await res.json();
      if (result.success) {
        statusDiv.textContent = 'Registration successful!';
      } else {
        statusDiv.textContent = 'Error: ' + (result.error || 'Unknown error');
      }
    } catch (err) {
      statusDiv.textContent = 'Registration failed.';
    }
  };
});
// Health Analytics Dashboard JS
let healthData = [];
let filteredData = [];

async function fetchHealthRecords() {
  const headers = authToken ? { 'Authorization': 'Bearer ' + authToken } : {};
  const res = await fetch('/api/health-records', { headers });
  if (!res.ok) throw new Error('Failed to fetch health records');
  healthData = await res.json();
  filteredData = [...healthData];
}

function renderCharts(data) {
  // Checkup Status
  const checkupCounts = {};
  data.forEach(d => {
    const date = d.checkupDate || 'Unknown';
    checkupCounts[date] = (checkupCounts[date] || 0) + 1;
  });
  new Chart(document.getElementById('checkup-chart'), {
    type: 'bar',
    data: {
      labels: Object.keys(checkupCounts),
      datasets: [{
        data: Object.values(checkupCounts),
        backgroundColor: '#2980b9'
      }]
    },
    options: { responsive: true }
  });

  // Treatment Types
  const treatmentCounts = {};
  data.forEach(d => {
    const treatment = d.treatment || 'None';
    treatmentCounts[treatment] = (treatmentCounts[treatment] || 0) + 1;
  });
  new Chart(document.getElementById('treatment-chart'), {
    type: 'pie',
    data: {
      labels: Object.keys(treatmentCounts),
      datasets: [{
        data: Object.values(treatmentCounts),
        backgroundColor: ['#27ae60','#e67e22','#e74c3c','#9b59b6','#f39c12']
      }]
    },
    options: { responsive: true }
  });

  // Health Status
  const statusCounts = { Healthy: 0, 'Needs Attention': 0, Critical: 0 };
  data.forEach(d => {
    statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
  });
  new Chart(document.getElementById('status-chart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#27ae60','#e67e22','#e74c3c']
      }]
    },
    options: { responsive: true }
  });
}

function applyFilters() {
  const goatId = document.getElementById('filter-goat-id').value.trim().toLowerCase();
  const status = document.getElementById('filter-status').value;
  filteredData = healthData.filter(record => {
    let match = true;
    if (goatId && !record.goatId.toLowerCase().includes(goatId)) match = false;
    if (status && record.status !== status) match = false;
    return match;
  });
}

async function refreshDashboard() {
  await fetchHealthRecords();
  applyFilters();
  renderCharts(filteredData);
}

async function addHealthRecord(e) {
  e.preventDefault();
  const goatId = document.getElementById('form-goat-id').value.trim();
  const checkupDate = document.getElementById('form-checkup-date').value;
  const treatment = document.getElementById('form-treatment').value.trim();
  const status = document.getElementById('form-status').value;
  const statusDiv = document.getElementById('health-form-status');
  statusDiv.textContent = 'Saving...';
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
    const res = await fetch('/api/health-records', {
      method: 'POST',
      headers,
      body: JSON.stringify({ goatId, checkupDate, treatment, status })
    });
    const result = await res.json();
    if (result.success) {
      statusDiv.textContent = 'Record added!';
      document.getElementById('health-form').reset();
      await refreshDashboard();
    } else {
      statusDiv.textContent = 'Error: ' + (result.error || 'Unknown error');
    }
  } catch (err) {
    statusDiv.textContent = 'Error saving record.';
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  await refreshDashboard();
  document.getElementById('health-form').addEventListener('submit', addHealthRecord);
  document.getElementById('health-filter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
    renderCharts(filteredData);
  });
  document.getElementById('clear-filters').addEventListener('click', () => {
    document.getElementById('health-filter-form').reset();
    filteredData = [...healthData];
    renderCharts(filteredData);
  });
});
