// Initialize Leaflet map centered on Kathmandu
const map = L.map('map').setView([27.7172, 85.3240], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Custom bus icon
const busIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/61/61231.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Bus data tracking
const markers = {};
const routes = {};
const polylines = {};
const busData = {};

// Update the info panel on the right
function updateSidebar() {
  const infoDiv = document.getElementById('bus-info');
  infoDiv.innerHTML = '';

  Object.entries(busData).forEach(([busId, data]) => {
    const card = document.createElement('div');
    card.className = 'bus-card';
    card.innerHTML = `
      <h3>Bus ID: ${busId}</h3>
      <p>Lat: ${data.latitude.toFixed(5)}</p>
      <p>Lng: ${data.longitude.toFixed(5)}</p>
      <p>Last Seen: ${new Date(data.timestamp).toLocaleTimeString()}</p>
    `;
    infoDiv.appendChild(card);
  });
}

// Add or update bus marker and route
function updateBusLocation(busId, lat, lng) {
  const position = [lat, lng];

  busData[busId] = { latitude: lat, longitude: lng, timestamp: Date.now() };

  if (markers[busId]) {
    markers[busId].setLatLng(position);
  } else {
    markers[busId] = L.marker(position, { icon: busIcon }).addTo(map)
      .bindPopup(`Bus ID: ${busId}`);
  }

  if (!routes[busId]) routes[busId] = [];
  routes[busId].push(position);

  if (polylines[busId]) {
    polylines[busId].setLatLngs(routes[busId]);
  } else {
    polylines[busId] = L.polyline(routes[busId], { color: 'blue' }).addTo(map);
  }

  updateSidebar();
  fitMapToBuses();
}

// Fit map to include all buses
function fitMapToBuses() {
  const group = new L.featureGroup(Object.values(markers));
  if (Object.keys(markers).length > 0) {
    map.fitBounds(group.getBounds().pad(0.2));
  }
}

// Socket.IO for real-time updates
const socket = io(); // auto connects to your backend

// Receive updates from server (other clients or backend)
socket.on('busLocationUpdate', ({ busId, latitude, longitude }) => {
  updateBusLocation(busId, latitude, longitude);
});

// Optional: Send location if this client is the driver
navigator.geolocation.watchPosition((pos) => {
  socket.emit('busLocationUpdate', {
    busId: 'driver-bus-1',
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
  });
});
