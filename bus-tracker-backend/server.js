const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // socket.io server

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve frontend from "public"
app.use(express.static('public'));
app.use(express.json()); // for JSON POSTs

// When client connects
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // Listen for location update from driver's phone
  socket.on('busLocationUpdate', (data) => {
    console.log('📍 Location update received:', data);

    // Broadcast to all clients (except the sender)
    socket.broadcast.emit('busLocationUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Optional: allow external POST API to simulate location
app.post('/update-location', (req, res) => {
  const { busId, latitude, longitude } = req.body;
  if (!busId || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  // Broadcast this location to all connected clients
  io.emit('busLocationUpdate', { busId, latitude, longitude });

  res.json({ status: 'ok' });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
