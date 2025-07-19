// Farm Map Dashboard JS
let markers = [];
let map;

function addMarkerToMap(marker) {
  const icon = marker.type === 'Goat' ? '🐐' : marker.type === 'Feed Zone' ? '🌾' : '📅';
  const leafletMarker = L.marker([marker.lat, marker.lng]).addTo(map);
  leafletMarker.bindPopup(`<b>${icon} ${marker.type}</b><br>${marker.name}`);
  markers.push(leafletMarker);
}

window.addEventListener('DOMContentLoaded', () => {
  map = L.map('map').setView([-1.2921, 36.8219], 13); // Default to Nairobi
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  document.getElementById('map-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('form-type').value;
    const name = document.getElementById('form-name').value.trim();
    const lat = parseFloat(document.getElementById('form-lat').value);
    const lng = parseFloat(document.getElementById('form-lng').value);
    addMarkerToMap({ type, name, lat, lng });
    document.getElementById('map-form-status').textContent = 'Marker added!';
    document.getElementById('map-form').reset();
  });
});
