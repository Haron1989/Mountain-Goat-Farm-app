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

// --- Financial Analytics Logic ---
let financialData = [];
let filteredData = [];

async function fetchFinancialRecords() {
  const headers = authToken ? { 'Authorization': 'Bearer ' + authToken } : {};
  const res = await fetch('/api/financial-records', { headers });
  if (!res.ok) throw new Error('Failed to fetch financial records');
  financialData = await res.json();
  filteredData = [...financialData];
}

function renderCharts(data) {
  // Income vs Expense
  let income = 0, expense = 0;
  data.forEach(d => {
    if (d.type === 'Income') income += d.amount;
    else if (d.type === 'Expense') expense += d.amount;
  });
  new Chart(document.getElementById('income-expense-chart'), {
    type: 'bar',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#27ae60','#e74c3c']
      }]
    },
    options: { responsive: true }
  });

  // Record Types
  const typeCounts = { Income: 0, Expense: 0 };
  data.forEach(d => {
    typeCounts[d.type] = (typeCounts[d.type] || 0) + 1;
  });
  new Chart(document.getElementById('type-chart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(typeCounts),
      datasets: [{
        data: Object.values(typeCounts),
        backgroundColor: ['#27ae60','#e74c3c']
      }]
    },
    options: { responsive: true }
  });
}

function applyFilters() {
  const type = document.getElementById('filter-type').value;
  const recordDate = document.getElementById('filter-record-date').value;
  filteredData = financialData.filter(record => {
    let match = true;
    if (type && record.type !== type) match = false;
    if (recordDate && record.recordDate !== recordDate) match = false;
    return match;
  });
}

async function refreshDashboard() {
  await fetchFinancialRecords();
  applyFilters();
  renderCharts(filteredData);
}

async function addFinancialRecord(e) {
  e.preventDefault();
  const recordDate = document.getElementById('form-record-date').value;
  const type = document.getElementById('form-type').value;
  const amount = Number(document.getElementById('form-amount').value);
  const description = document.getElementById('form-description').value.trim();
  const statusDiv = document.getElementById('financial-form-status');
  statusDiv.textContent = 'Saving...';
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = 'Bearer ' + authToken;
    const res = await fetch('/api/financial-records', {
      method: 'POST',
      headers,
      body: JSON.stringify({ recordDate, type, amount, description })
    });
    const result = await res.json();
    if (result.success) {
      statusDiv.textContent = 'Record added!';
      document.getElementById('financial-form').reset();
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
  document.getElementById('financial-form').addEventListener('submit', addFinancialRecord);
  document.getElementById('financial-filter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
    renderCharts(filteredData);
  });
  document.getElementById('clear-filters').addEventListener('click', () => {
    document.getElementById('financial-filter-form').reset();
    filteredData = [...financialData];
    renderCharts(filteredData);
  });
});
