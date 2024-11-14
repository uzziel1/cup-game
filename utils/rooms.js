const fs = require('fs');

// File to store rooms
const ROOMS_FILE = 'rooms.json';

// Load rooms from file
function loadRooms() {
  if (fs.existsSync(ROOMS_FILE)) {
    return JSON.parse(fs.readFileSync(ROOMS_FILE, 'utf-8'));
  }
  return {};
}

// Save rooms to file
function saveRooms(rooms) {
  fs.writeFileSync(ROOMS_FILE, JSON.stringify(rooms, null, 2));
}

let rooms = loadRooms();

// Create a new room
function createRoom(roomCode, roomDetails) {
  rooms[roomCode] = roomDetails;
  saveRooms(rooms);
}

// Retrieve a room
function getRoom(roomCode) {
  return rooms[roomCode];
}

// Delete a room
function deleteRoom(roomCode) {
  delete rooms[roomCode];
  saveRooms(rooms);
}

// Example Usage
createRoom('XKDSO1', { players: ['Uzziel'], maxPlayers: 7 });
console.log(getRoom('XKDSO1')); // { players: ['Uzziel'], maxPlayers: 7 }
deleteRoom('XKDSO1');
console.log(getRoom('XKDSO1')); // undefined
