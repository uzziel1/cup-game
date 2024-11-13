const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (frontend files)
app.use(express.static('public'));

// Listen for socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle custom events
  socket.on('custom-event', (string) => {
    console.log('Message from client:', string);
    // Broadcast to all other clients
    socket.broadcast.emit('message', string);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/index.html');
});
// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
