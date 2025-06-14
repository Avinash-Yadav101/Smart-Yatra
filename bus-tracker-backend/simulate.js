// simulate.js
const axios = require('axios');

const route = [
  { lat: 27.7172, lng: 85.3240 },
  { lat: 27.7180, lng: 85.3250 },
  { lat: 27.7190, lng: 85.3260 },
  { lat: 27.7200, lng: 85.3270 },
];

let index = 0;

setInterval(() => {
  const point = route[index % route.length];
  axios.post('http://localhost:3000/update-location', {
    busId: 'Bus-1',
    latitude: point.lat,
    longitude: point.lng
  }).then(() => {
    console.log("Updated bus location");
  });
  index++;
}, 3000);
