// Simulation & Forecasting Dashboard JS
function simulateScenario(goatCount, feedPerGoat, breedingSuccess, income, expense) {
  // Feed Needs Forecast
  const feedForecast = Array.from({ length: 6 }, (_, i) => ({
    month: `Month ${i + 1}`,
    feed: goatCount * feedPerGoat * 30 // 30 days per month
  }));

  // Breeding Outcome Simulation
  const breedingSim = Array.from({ length: 6 }, (_, i) => ({
    month: `Month ${i + 1}`,
    kids: Math.round(goatCount * (breedingSuccess / 100) * 0.2) // 20% breeding per month
  }));

  // Financial Trend Forecast
  const financialForecast = Array.from({ length: 6 }, (_, i) => ({
    month: `Month ${i + 1}`,
    balance: income * (i + 1) - expense * (i + 1)
  }));

  return { feedForecast, breedingSim, financialForecast };
}

function renderCharts(sim) {
  // Feed Needs Forecast
  new Chart(document.getElementById('feed-forecast-chart'), {
    type: 'line',
    data: {
      labels: sim.feedForecast.map(f => f.month),
      datasets: [{
        label: 'Feed Needed (kg)',
        data: sim.feedForecast.map(f => f.feed),
        borderColor: '#27ae60',
        fill: true
      }]
    },
    options: { responsive: true }
  });

  // Breeding Outcome Simulation
  new Chart(document.getElementById('breeding-sim-chart'), {
    type: 'bar',
    data: {
      labels: sim.breedingSim.map(b => b.month),
      datasets: [{
        label: 'Expected Kids',
        data: sim.breedingSim.map(b => b.kids),
        backgroundColor: '#2980b9'
      }]
    },
    options: { responsive: true }
  });

  // Financial Trend Forecast
  new Chart(document.getElementById('financial-forecast-chart'), {
    type: 'line',
    data: {
      labels: sim.financialForecast.map(f => f.month),
      datasets: [{
        label: 'Balance ($)',
        data: sim.financialForecast.map(f => f.balance),
        borderColor: '#e67e22',
        fill: true
      }]
    },
    options: { responsive: true }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  // Initial simulation
  const form = document.getElementById('scenario-form');
  function runSim() {
    const goatCount = Number(document.getElementById('form-goat-count').value);
    const feedPerGoat = Number(document.getElementById('form-feed-per-goat').value);
    const breedingSuccess = Number(document.getElementById('form-breeding-success').value);
    const income = Number(document.getElementById('form-income').value);
    const expense = Number(document.getElementById('form-expense').value);
    const sim = simulateScenario(goatCount, feedPerGoat, breedingSuccess, income, expense);
    renderCharts(sim);
    document.getElementById('scenario-form-status').textContent = 'Simulation complete!';
  }
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    runSim();
  });
  runSim();
});
