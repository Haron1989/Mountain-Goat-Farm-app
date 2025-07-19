// Map & Calendar Dashboard JS
// Demo: Uses sample data, can be extended to fetch from backend

document.addEventListener('DOMContentLoaded', function() {
  // --- Map ---
  const map = L.map('farm-map').setView([0.285, 36.072], 15); // Example coordinates
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Sample goat locations
  const goats = [
    { id: 'G001', lat: 0.285, lng: 36.072, zone: 'A' },
    { id: 'G002', lat: 0.286, lng: 36.073, zone: 'B' },
    { id: 'G003', lat: 0.284, lng: 36.071, zone: 'A' }
  ];
  goats.forEach(goat => {
    L.marker([goat.lat, goat.lng]).addTo(map)
      .bindPopup(`Goat ${goat.id} (Zone ${goat.zone})`);
  });

  // Sample feed zones
  L.circle([0.285, 36.072], { radius: 100, color: '#27ae60', fillOpacity: 0.2 }).addTo(map).bindPopup('Feed Zone A');
  L.circle([0.286, 36.073], { radius: 80, color: '#e67e22', fillOpacity: 0.2 }).addTo(map).bindPopup('Feed Zone B');

  // --- Calendar ---
  const calendarEl = document.getElementById('farm-calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 400,
    events: [
      { title: 'Health Check G001', start: '2025-07-20' },
      { title: 'Breeding G002', start: '2025-07-22' },
      { title: 'Feed Delivery', start: '2025-07-23' }
    ]
  });
  calendar.render();
});
