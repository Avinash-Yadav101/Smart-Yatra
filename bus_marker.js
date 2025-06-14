const busIcon = L.icon({
  iconUrl: 'bus-icon.png', // Replace with your bus icon URL
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const busMarker = L.marker([27.7172, 85.3240], { icon: busIcon }).addTo(map);
