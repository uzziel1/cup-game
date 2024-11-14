function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Allowed characters
  const length = 6; // Desired room code length
  let roomCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomCode += characters[randomIndex];
  }

  return roomCode;
}

// Example usage
const newRoomCode = generateRoomCode();
console.log(`Generated Room Code: ${newRoomCode}`);

module.exports = { generateRoomCode };
