const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { generateRoomCode } = require('./utils/generateRoomCode.js');

// Serve static files (frontend files)
app.use(express.static('public'));
// In-memory storage for rooms
const rooms = {};

// Listen for socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle custom events
  socket.on('custom-event', (string) => {
    console.log('Message from client:', string);
    // Broadcast to all other clients
    socket.broadcast.emit('message', string);
  });

  // Function to generate a unique room code
  function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 6;
    let roomCode = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      roomCode += characters[randomIndex];
    }
    return roomCode;
  }

  socket.on('createRoom', (data) => {
    const userName = data.name;
    const roomCode = generateRoomCode(); // Generate a unique room code

    // Add the creator as the first user in the room
    const room = {
      roomCode,
      users: [{ id: socket.id, name: userName }],
    };

    // Store the room in memory
    rooms[roomCode] = room;

    // Log room creation
    console.log(`Room ${roomCode} created by ${userName}`);

    // Add the socket to the room
    socket.join(roomCode);

    // Notify the creator that the room is created
    socket.emit('roomCreated', { roomCode, userName });

    // Trigger `updateRoom` so the room creator sees themselves in the lobby
    io.to(roomCode).emit('updateRoom', room.users);
  });

  socket.on('joinRoom', (data) => {
    console.log('joinRoom event received with data:', data);
    const { roomCode, name } = data;

    if (!roomCode || !name) {
      console.error('Missing roomCode or name in data:', data);
      socket.emit('error', { message: 'Invalid room data provided.' });
      return;
    }

    const room = rooms[roomCode];

    if (room) {
      room.users.push({ id: socket.id, name });
      console.log(`${name} joined room ${roomCode}`);

      // Notify all users in the room about the update

      // Send room details to the user who joined
      socket.join(roomCode);
      socket.emit('joinedRoom', { roomCode, users: room.users });

      io.to(roomCode).emit('updateRoom', room.users);
      console.log(
        `Emitting updateRoom for room ${roomCode} with users:`,
        room.users
      );
    } else {
      console.error('Room does not exist:', roomCode);
      socket.emit('error', { message: 'Room code does not exist.' });
    }
  });
  // Handle user disconnection
  socket.on('disconnect', () => {
    // Find the room the user was in
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const userIndex = room.users.findIndex((user) => user.id === socket.id);

      if (userIndex !== -1) {
        // Remove the user from the room
        const [removedUser] = room.users.splice(userIndex, 1);

        // Notify remaining clients in the room
        io.to(roomCode).emit('updateRoom', room.users);

        console.log(`${removedUser.name} left room ${roomCode}`);

        // Remove the room if empty
        if (room.users.length === 0) {
          delete rooms[roomCode];
          console.log(`Room ${roomCode} deleted as it is empty.`);
        }

        break;
      }
    }
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
