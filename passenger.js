socket.on('busLocationUpdate', (data) => {
  if (data.id === 'bus1') {
    busMarker.setLatLng([data.lat, data.lng]);
    map.panTo([data.lat, data.lng]);
  }
});
