const axios = require('axios');
const route = [
  { latitude: 27.7172, longitude: 85.3240 },
  { latitude: 27.7182, longitude: 85.3250 },
  { latitude: 27.7190, longitude: 85.3260 },
];

let i = 0;
setInterval(async () => {
  const point = route[i++ % route.length];
  await axios.post('http://localhost:3000/update-location', {
    busId: 'Sim-Bus-1',
    latitude: point.latitude,
    longitude: point.longitude,
  });
  console.log('Sent location:', point);
}, 3000);
