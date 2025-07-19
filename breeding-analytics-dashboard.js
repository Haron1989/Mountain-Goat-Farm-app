// --- Authentication Modal Logic ---
let authToken = '';
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('auth-modal');
  const openBtn = document.getElementById('open-auth');
  const closeBtn = document.getElementById('close-auth');
  const dashboard = document.querySelector('main.dashboard-main');
  const logoutBtn = document.getElementById('logout-btn');
  openBtn.onclick = () => { modal.style.display = 'block'; };
  closeBtn.onclick = () => { modal.style.display = 'none'; };
  window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
  function showDashboard(role) {
    dashboard.style.display = '';
    logoutBtn.style.display = '';
    // Role-based UI logic
    if (role === 'manager') {
      // Managers see all features
      dashboard.querySelectorAll('.dashboard-form, .dashboard-filters').forEach(el => el.style.display = '');
    } else if (role === 'staff') {
      // Staff can add records but not see analytics
      dashboard.querySelectorAll('.dashboard-form').forEach(el => el.style.display = '');
      dashboard.querySelectorAll('.dashboard-section').forEach(el => el.style.display = 'none');
    } else if (role === 'external') {
      // External users see only analytics
      dashboard.querySelectorAll('.dashboard-form').forEach(el => el.style.display = 'none');
      dashboard.querySelectorAll('.dashboard-section').forEach(el => el.style.display = '');
    }
  }
  function hideDashboard() {
    dashboard.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
  logoutBtn.onclick = function() {
    authToken = '';
    hideDashboard();
  };

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
      if (result.token && result.role) {
        authToken = result.token;
        statusDiv.textContent = 'Login successful!';
        modal.style.display = 'none';
        showDashboard(result.role);
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
// Breeding & Genetic Analytics Dashboard JS
// Demo: Uses sample data, can be extended to fetch from backend


let breedingData = [];
let filteredData = [];

async function fetchBreedingRecords() {
  const headers = authToken ? { 'Authorization': 'Bearer ' + authToken } : {};
  const res = await fetch('/api/breeding-records', { headers });
  if (!res.ok) throw new Error('Failed to fetch breeding records');
  breedingData = await res.json();
  filteredData = [...breedingData];
}

function renderCharts(data) {
  // Pregnancy Tracking
  const pregnantCount = data.filter(d => d.pregnant).length;
  const notPregnantCount = data.length - pregnantCount;
  new Chart(document.getElementById('pregnancy-chart'), {
    type: 'doughnut',
    data: {
      labels: ['Pregnant', 'Not Pregnant'],
      datasets: [{
        data: [pregnantCount, notPregnantCount],
        backgroundColor: ['#27ae60', '#e67e22']
      }]
    },
    options: { responsive: true }
  });

  // Overdue Kiddings
  const today = new Date();
  const overdue = data.filter(d => d.pregnant && d.kiddingDate && new Date(d.kiddingDate) < today).length;
  new Chart(document.getElementById('overdue-chart'), {
    type: 'bar',
    data: {
      labels: ['Overdue Kiddings'],
      datasets: [{
        data: [overdue],
        backgroundColor: ['#e74c3c']
      }]
    },
    options: { responsive: true }
  });

  // Genetic Lineage
  const lineageCounts = {};
  data.forEach(d => {
    lineageCounts[d.lineage] = (lineageCounts[d.lineage] || 0) + 1;
  });
  new Chart(document.getElementById('lineage-chart'), {
    type: 'pie',
    data: {
      labels: Object.keys(lineageCounts),
      datasets: [{
        data: Object.values(lineageCounts),
        backgroundColor: ['#3498db','#9b59b6','#f39c12','#2ecc71','#e67e22']
      }]
    },
    options: { responsive: true }
  });

  // Breeding Success Rate
  const successCount = data.filter(d => d.success).length;
  new Chart(document.getElementById('success-chart'), {
    type: 'bar',
    data: {
      labels: ['Successes', 'Failures'],
      datasets: [{
        data: [successCount, data.length - successCount],
        backgroundColor: ['#27ae60', '#e74c3c']
      }]
    },
    options: { responsive: true }
  });
}

async function addBreedingRecord(e) {
  e.preventDefault();
  const goatId = document.getElementById('form-goat-id').value.trim();
  const pregnant = document.getElementById('form-pregnant').checked;
  const kiddingDate = document.getElementById('form-kidding-date').value;
  const lineage = document.getElementById('form-lineage').value.trim();
  // For demo, randomly assign success
  const success = Math.random() > 0.5;
  const statusDiv = document.getElementById('breeding-form-status');
  statusDiv.textContent = 'Saving...';
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
    const res = await fetch('/api/breeding-records', {
      method: 'POST',
      headers,
      body: JSON.stringify({ goatId, pregnant, kiddingDate, lineage, success })
    });
    const result = await res.json();
    if (result.success) {
      statusDiv.textContent = 'Record added!';
      document.getElementById('breeding-form').reset();
      await refreshDashboard();
    } else {
      statusDiv.textContent = 'Error: ' + (result.error || 'Unknown error');
    }
  } catch (err) {
    statusDiv.textContent = 'Error saving record.';
  }
}

function applyFilters() {
  const goatId = document.getElementById('filter-goat-id').value.trim().toLowerCase();
  const pregnant = document.getElementById('filter-pregnant').value;
  const lineage = document.getElementById('filter-lineage').value.trim().toLowerCase();
  filteredData = breedingData.filter(record => {
    let match = true;
    if (goatId && !record.goatId.toLowerCase().includes(goatId)) match = false;
    if (pregnant && String(record.pregnant) !== pregnant) match = false;
    if (lineage && !record.lineage.toLowerCase().includes(lineage)) match = false;
    return match;
  });
}

async function refreshDashboard() {
  await fetchBreedingRecords();
  applyFilters();
  renderCharts(filteredData);
}

window.addEventListener('DOMContentLoaded', async () => {
  await refreshDashboard();
  document.getElementById('breeding-form').addEventListener('submit', addBreedingRecord);
  document.getElementById('breeding-filter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
    renderCharts(filteredData);
  });
  document.getElementById('clear-filters').addEventListener('click', () => {
    document.getElementById('breeding-filter-form').reset();
    filteredData = [...breedingData];
    renderCharts(filteredData);
  });
});
