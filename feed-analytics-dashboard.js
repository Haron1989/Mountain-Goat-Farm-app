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
// Feed Analytics Dashboard JS
let feedData = [];
let filteredData = [];

async function fetchFeedRecords() {
  const headers = authToken ? { 'Authorization': 'Bearer ' + authToken } : {};
  const res = await fetch('/api/feed-records', { headers });
  if (!res.ok) throw new Error('Failed to fetch feed records');
  feedData = await res.json();
  filteredData = [...feedData];
}

function renderCharts(data) {
  // Feed Types
  const typeCounts = {};
  data.forEach(d => {
    typeCounts[d.feedType] = (typeCounts[d.feedType] || 0) + 1;
  });
  new Chart(document.getElementById('feed-type-chart'), {
    type: 'pie',
    data: {
      labels: Object.keys(typeCounts),
      datasets: [{
        data: Object.values(typeCounts),
        backgroundColor: ['#27ae60','#e67e22','#e74c3c','#9b59b6','#f39c12']
      }]
    },
    options: { responsive: true }
  });

  // Feed Quantity
  const quantityCounts = {};
  data.forEach(d => {
    quantityCounts[d.goatId] = (quantityCounts[d.goatId] || 0) + d.quantity;
  });
  new Chart(document.getElementById('feed-quantity-chart'), {
    type: 'bar',
    data: {
      labels: Object.keys(quantityCounts),
      datasets: [{
        data: Object.values(quantityCounts),
        backgroundColor: '#2980b9'
      }]
    },
    options: { responsive: true }
  });
}

function applyFilters() {
  const goatId = document.getElementById('filter-goat-id').value.trim().toLowerCase();
  const feedType = document.getElementById('filter-feed-type').value.trim().toLowerCase();
  filteredData = feedData.filter(record => {
    let match = true;
    if (goatId && !record.goatId.toLowerCase().includes(goatId)) match = false;
    if (feedType && !record.feedType.toLowerCase().includes(feedType)) match = false;
    return match;
  });
}

async function refreshDashboard() {
  await fetchFeedRecords();
  applyFilters();
  renderCharts(filteredData);
}

async function addFeedRecord(e) {
  e.preventDefault();
  const goatId = document.getElementById('form-goat-id').value.trim();
  const feedDate = document.getElementById('form-feed-date').value;
  const feedType = document.getElementById('form-feed-type').value.trim();
  const quantity = Number(document.getElementById('form-quantity').value);
  const statusDiv = document.getElementById('feed-form-status');
  statusDiv.textContent = 'Saving...';
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
    const res = await fetch('/api/feed-records', {
      method: 'POST',
      headers,
      body: JSON.stringify({ goatId, feedDate, feedType, quantity })
    });
    const result = await res.json();
    if (result.success) {
      statusDiv.textContent = 'Record added!';
      document.getElementById('feed-form').reset();
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
  document.getElementById('feed-form').addEventListener('submit', addFeedRecord);
  document.getElementById('feed-filter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
    renderCharts(filteredData);
  });
  document.getElementById('clear-filters').addEventListener('click', () => {
    document.getElementById('feed-filter-form').reset();
    filteredData = [...feedData];
    renderCharts(filteredData);
  });
});
