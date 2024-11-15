import {
  mainDiv,
  initializeSettingToggles,
  initializeSettingsListeners,
  initializeGame,
} from './homepage.js';

import {
  startTimer,
  stopTimer,
  formatTime,
  resetTimer,
  score,
} from './stopwatch.js';

let cupColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
let comparisonColors = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
];
const socket = io('http://localhost:3000');
let source;
let clone; // This will be the smaller "ghost" image
let joinedRoomCode;
let currentUser;
let playingUser;
let playingUserIndex = 0;
let counter = 0;
let roomUsers;

socket.on('connected', (data) => {
  const { userId } = data;

  currentUser = userId;
});

export let gameSelectToggle = false;
export function gameSelect() {
  gameSelectToggle = true;
  mainDiv.innerHTML = `
     <div class="settings-cog" id="settings-cog">
        <img src="../imgs/Settings-cog.png" />
      </div>
      <div class="button-container">
        <div class="title"><img src="../imgs/Gabis-cup-game-title.png" /></div>
        <div class="button" id = "multiplayer-button">
          <span>Multiplayer</span>
          <img
            src="../imgs/multiplayer-button.png"
            alt="Multiplayer Cups"
            class="button-icon"
       
          />
        </div>
        <div class="button" id = "singleplayer-button">
          <span>Singleplayer</span>
          <img
            src="../imgs/cup-colors/red-cup.png"
            alt="Singleplayer Cup"
            class="button-icon"
          />
        </div>
      </div>

         <div class="settings-container" id="settings-modal">
      <div class="settings-top-bar">
        <div class="settings-header">Settings</div>
        <img id="settings-exit-btn" src="../imgs/exit-button.png" />
      </div>
      <div class="settings-toggles">
        <div class="music-row">
          <div class="music-header">Music</div>
          <div class="settings-spacer"></div>
          <button class="music-toggle" id="music-toggle"></button>
        </div>
        <div class="bg-color-row">
          <div class="bg-color-header">BG Color</div>
          <div class="settings-spacer"></div>
          <button class="bg-color-toggle" id="bg-color-toggle"></button>
        </div>
        <div class="cup-mode-row">
          <div class="cup-mode-header">Cup Mode</div>
          <div class="settings-spacer"></div>
          <button class="cup-mode-toggle" id="cup-mode-toggle">Pastel</button>
        </div>
      </div>
      <div class="settings-bottom-bar">
        <button class="main-menu-button">Main Menu</button>
        <button class="play-button">
          <img style="width: 1rem" src="../imgs/play-button.png" />
        </button>
      </div>
    </div>
    `;

  //Set up both buttons
  const multiplayerButton = document.getElementById('multiplayer-button');
  const singleplayerButton = document.getElementById('singleplayer-button');

  initializeSettingsListeners();
  initializeSettingToggles();

  multiplayerButton.onclick = function () {
    multiplayerMode();
  };
  singleplayerButton.onclick = function () {
    initializeGame();
    gameSelectToggle = false;
  };
}

function multiplayerMode() {
  mainDiv.innerHTML = `
      <div class="settings-cog" id="settings-cog">
        <img src="../imgs/Settings-cog.png" />
      </div>
      <div class="title"><img src="../imgs/Gabis-cup-game-title.png" />
      </div>
      <div class="multiplayer-title">Multiplayer</div>
      <img  class = "multiplayer-char "src = "../imgs/multiplayer-char.png"> 
        <div class="room-container">
        <form id="room-form" action="your-server-endpoint" method="POST">
            <div class="input-section">
            <div class="input-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" placeholder="Enter your name" required />
            </div>
            <div class="input-group">
                <label for="room-code">Room code:</label>
                <input type="text" id="room-code" name="roomCode" placeholder="Enter room code" required/>
                <button type="submit" class="join-button">
                <img src="../imgs/play-button.png" alt="Play" />
                </button>
            </div>
            </div>
        </form>
        <div class="room-info">
            <p>Don't have a room?</p>
            <button class="create-room-button">Create room</button>
        </div>
        </div>
      
     
      <div class="settings-container" id="settings-modal">
        <div class="settings-top-bar">
          <div class="settings-header">Settings</div>
          <img id="settings-exit-btn" src="../imgs/exit-button.png" />
        </div>
        <div class="settings-toggles">
          <div class="music-row">
            <div class="music-header">Music</div>
            <div class="settings-spacer"></div>
            <button class="music-toggle" id="music-toggle"></button>
          </div>
          <div class="bg-color-row">
            <div class="bg-color-header">BG Color</div>
            <div class="settings-spacer"></div>
            <button class="bg-color-toggle" id="bg-color-toggle"></button>
          </div>
          <div class="cup-mode-row">
            <div class="cup-mode-header">Cup Mode</div>
            <div class="settings-spacer"></div>
            <button class="cup-mode-toggle" id="cup-mode-toggle">Pastel</button>
          </div>
        </div>
        <div class="settings-bottom-bar">
          <button class="main-menu-button">Main Menu</button>
          <button class="play-button">
            <img style="width: 1rem" src="../imgs/play-button.png" />
          </button>
        </div>
    </div>
  `;

  initializeSettingsListeners();
  initializeSettingToggles();

  const roomForm = document.getElementById('room-form');
  const nameInput = document.getElementById('name');
  const roomCodeInput = document.getElementById('room-code');
  const createRoom = document.querySelector('.create-room-button');

  roomForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    const name = nameInput.value.trim();
    const roomCode = roomCodeInput.value.trim();

    if (name && roomCode) {
      // Emit joinRoom event to the server
      socket.emit('joinRoom', { name, roomCode });
    } else {
      alert('Both fields are required!');
    }
  });

  // Listener for when a room is created
  socket.on('roomCreated', (data) => {
    const { roomCode, userName, userId } = data;
    console.log(`Room created! Code: ${roomCode}, Creator: ${userName}`);
    joinedRoomCode = roomCode;
    renderRoomUI(roomCode, userName);
  });

  // Listener for when a user joins a room
  socket.on('joinedRoom', (data) => {
    const { roomCode, users } = data;

    console.log('Users in room:', users);
    joinedRoomCode = roomCode;
    roomUsers = users;

    // Render the room UI
    renderRoomUI(roomCode, users[0].name);
  });

  // Error handling from the server
  socket.on('error', (data) => {
    alert(data.message);
  });

  // Handle "Create Room" button click
  createRoom.onclick = function () {
    if (nameInput.value === '') {
      alert('Please enter the username.');
    } else {
      // Emit the createRoom event to the server with the user's name
      socket.emit('createRoom', { name: nameInput.value });
    }
  };
}
// Function to render the room UI
function renderRoomUI(roomCode, userName) {
  mainDiv.innerHTML = `
   <div class="settings-cog" id="settings-cog">
      <img src="../imgs/Settings-cog.png" />
    </div>
    <div class="title"><img src="../imgs/Gabis-cup-game-title.png" /></div>
    <div class="multiplayer-title">${userName}'s Lobby</div>
    <div class="lobby-code">Lobby code: ${roomCode}</div>
    <div class="player-count">Player Count: 1</div>

    <div class="room-container">
      <!-- Player list will be dynamically updated here -->
    </div>
    <button class="start-game-button" id="start-game-button">Start Game</button>
    <button onclick = "window.location.reload();"class="return-main-button" id="return-main-button">Return to Main Menu</button>

    <div class="settings-container" id="settings-modal">
      <div class="settings-top-bar">
        <div class="settings-header">Settings</div>
        <img id="settings-exit-btn" src="../imgs/exit-button.png" />
      </div>
      <div class="settings-toggles">
        <div class="music-row">
          <div class="music-header">Music</div>
          <div class="settings-spacer"></div>
          <button class="music-toggle" id="music-toggle"></button>
        </div>
        <div class="bg-color-row">
          <div class="bg-color-header">BG Color</div>
          <div class="settings-spacer"></div>
          <button class="bg-color-toggle" id="bg-color-toggle"></button>
        </div>
        <div class="cup-mode-row">
          <div class="cup-mode-header">Cup Mode</div>
          <div class="settings-spacer"></div>
          <button class="cup-mode-toggle" id="cup-mode-toggle">Pastel</button>
        </div>
      </div>
      <div class="settings-bottom-bar">
        <button class="main-menu-button">Main Menu</button>
        <button class="play-button">
          <img style="width: 1rem" src="../imgs/play-button.png" />
        </button>
      </div>
    </div>
  `;

  initializeSettingsListeners();
  initializeSettingToggles();
  const playButton = document.querySelector('.start-game-button');

  playButton.onclick = function () {
    playGame();
  };
}

socket.on('updateRoom', (users) => {
  console.log('Updating room with users:', users);

  roomUsers = users;
  const playerList = document.querySelector('.room-container');
  if (!playerList) {
    console.error('room-container does not exist');
    return;
  }

  // Clear the list and add new users
  playerList.innerHTML = '';
  users.forEach((user) => {
    playerList.innerHTML += `<div class = "player"> ${user.name} </div>`;
  });

  // Update player count
  const playerCount = document.querySelector('.player-count');
  if (playerCount) {
    playerCount.textContent = `Player Count: ${users.length}`;
  }
});

function initializeMultiplayerGame() {
  mainDiv.innerHTML = `
  <div class="main" style="background: transparent; box-shadow: none;">
      <div class="scores">
        <div class="players-turn">Loading...</div>
        <div class="game-current-score" id="display">
          Current score: 00:00.00
        </div>
        

      <div class="settings-cog" id="settings-cog"
      onclick = "window.location.reload()">
        <img src="../imgs/Settings-cog.png" />
      </div>

      <div class="table-container">
        <div class="table-group">
          <div class="cup-container">
            <img
              id="red"
              class="cup"
              src="../imgs/cup-colors/white-cup.png"
              alt="Red Cup"
              draggable="true"
            />
            <img
              id="orange"
              class="cup"
              src="../imgs/cup-colors/white-cup.png"
              alt="Orange Cup"
              draggable="true"
            />
            <img
              id="yellow"
              class="cup"
              src="../imgs/cup-colors/white-cup.png"
              alt="Yellow Cup"
              draggable="true"
            />
            <img
              id="green"
              class="cup"
              src="../imgs/cup-colors/white-cup.png"
              alt="Green Cup"
              draggable="true"
            />
            <img
              id="blue"
              class="cup"
              src="../imgs/cup-colors/white-cup.png"
              alt="Blue Cup"
              draggable="true"
            />
            <img
              id="purple"
              class="cup"
              src="../imgs/cup-colors/white-cup.png"
              alt="Purple Cup"
              draggable="true"
            />
            <img
              id="pink"
              class="cup"
              src="../imgs/cup-colors/white-cup.png "
              alt="Pink Cup"
              draggable="true"
            />
          </div>
        </div>
        <div class="table"><img src="../imgs/table.png" /></div>
      </div>

      <div class="settings-container" id="settings-modal">
        <div class="settings-top-bar">
          <div class="settings-header">Settings</div>
          <img id="settings-exit-btn" src="../imgs/exit-button.png" />
        </div>
        <div class="settings-toggles">
          <div class="music-row">
            <div class="music-header">Music</div>
            <div class="settings-spacer"></div>
            <button class="music-toggle" id="music-toggle"></button>
          </div>
          <div class="bg-color-row">
            <div class="bg-color-header">BG Color</div>
            <div class="settings-spacer"></div>
            <button class="bg-color-toggle" id="bg-color-toggle"></button>
          </div>
          <div class="cup-mode-row">
            <div class="cup-mode-header">Cup Mode</div>
            <div class="settings-spacer"></div>
            <button class="cup-mode-toggle" id="cup-mode-toggle">Pastel</button>
          </div>
        </div>
        <div class="settings-bottom-bar">
          <button class="main-menu-button">Main Menu</button>
          <button class="play-button">
            <img style="width: 1rem" src="../imgs/play-button.png" />
          </button>
        </div>
      </div>
      <div class="play">Shuffling Cups...</div>
    </div> `;
  //SETTINGS
  setTimeout(() => {
    initializeSettingsListeners();
    initializeSettingToggles();
  }, 0);

  // //SETTINGS END
  const display = document.querySelector('.game-current-score');
  const highScoreDisplay = document.querySelector('.game-high-score');
  // Use these functions to attach the drag event listeners
  document.querySelectorAll('.cup').forEach((cup) => {
    cup.addEventListener('dragstart', dragStarted);
    cup.addEventListener('dragover', draggingOver);
    cup.addEventListener('dragleave', draggingLeave);
    cup.addEventListener('drop', dropped);
  });

  // Add event listeners to the elements for touch events
  document.querySelectorAll('.cup').forEach((cup) => {
    cup.addEventListener('touchstart', touchStarted);
    cup.addEventListener('touchmove', touchMoving);
    cup.addEventListener('touchend', touchEnded);
  });

  let iteration = 15;
  function shuffleAndChangeCups() {
    if (iteration <= 0) {
      shuffleComparison(comparisonColors);
      socket.emit('shuffleCompleted', {
        cupColors,
        comparisonColors,
        joinedRoomCode,
      });

      return;
    }

    shuffle(cupColors);
    console.log(`CupColors: ${cupColors}`);
    updateGameUI();

    iteration--;

    setTimeout(shuffleAndChangeCups, 200);
  }

  shuffleAndChangeCups();
}

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function shuffleComparison(array) {
  let matching = true;
  let i = 0;

  while (matching) {
    console.log(`array: ${array}`);
    shuffle(array);
    console.log('iteration');
    console.log(`cupColors: ${cupColors}`);
    console.log(`comparisonColors: ${comparisonColors}`);
    let counter = 0;
    for (let i = 0; i < cupColors.length; i++) {
      if (cupColors[i] === array[i]) {
        counter++;
      }
    }
    if (counter === 0) {
      matching = false;
    }
    i++;
    if (i > 10) {
      break;
    }
  }
}

//Touch FUNCTIONS
function touchStarted(evt) {
  if (playingUser !== currentUser) {
    console.log("It's not your turn!");
    return; // Prevent dropping if the user is not the playing user
  }
  evt.preventDefault();
  source = evt.target;

  // Create a smaller clone of the source image to follow the touch
  clone = source.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.pointerEvents = 'none'; // Ensure it doesn’t interfere with touch events
  clone.style.opacity = '0.8'; // Make it slightly transparent
  clone.style.width = '50px'; // Set the width to 50px
  clone.style.height = '50px'; // Set the height to 50px
  clone.style.zIndex = '1000'; // Bring it to the front layer
  document.body.appendChild(clone);

  // Set the initial position of the clone at the touch point
  const touch = evt.touches[0];
  clone.style.left = `${touch.clientX - 25}px`; // Center the 50px clone
  clone.style.top = `${touch.clientY - 25}px`;
}

// Replace draggingOver with touchMoving
function touchMoving(evt) {
  if (playingUser !== currentUser) {
    console.log("It's not your turn!");
    return; // Prevent dropping if the user is not the playing user
  }
  evt.preventDefault();

  const touch = evt.touches[0];
  const touchX = touch.clientX;
  const touchY = touch.clientY;

  // Move the clone to follow the touch
  if (clone) {
    clone.style.left = `${touchX - 25}px`; // Center the 50px clone
    clone.style.top = `${touchY - 25}px`;
  }
}

// Replace dropped with touchEnded
function touchEnded(evt) {
  // Check if it's the current user's turn
  if (playingUser !== currentUser) {
    console.log("It's not your turn!");
    return; // Prevent any action if the user is not the playing user
  }

  evt.preventDefault();
  evt.stopPropagation();

  // Remove the clone when touch ends
  if (clone) {
    document.body.removeChild(clone);
    clone = null;
  }

  const touch = evt.changedTouches[0];
  const touchEndX = touch.clientX;
  const touchEndY = touch.clientY;

  const target = document.elementFromPoint(touchEndX, touchEndY);

  // Ensure that the target is a cup and not any other element
  if (target && target.tagName === 'IMG' && target.classList.contains('cup')) {
    var sid = source.id;
    var tid = target.id;

    // Swap the sources and IDs of the cups
    var tempSrc = source.src;
    source.src = target.src;
    target.src = tempSrc;

    const sourceIndex = cupColors.indexOf(sid);
    const targetIndex = cupColors.indexOf(tid);
    if (sourceIndex === targetIndex) {
      console.log('Cannot drop on the same cup!');
      return;
    }
    if (sourceIndex !== -1 && targetIndex !== -1) {
      [cupColors[sourceIndex], cupColors[targetIndex]] = [
        cupColors[targetIndex],
        cupColors[sourceIndex],
      ];
    }

    source.id = tid;
    target.id = sid;

    // Emit the move to the server
    socket.emit('movePlayed', {
      cupColors,
      playingUser: socket.id,
      joinedRoomCode,
    });
  }
}

//Drag functions
function dragStarted(evt) {
  if (playingUser !== currentUser) {
    console.log("It's not your turn!");
    return; // Prevent dropping if the user is not the playing user
  }
  source = evt.target;
  evt.dataTransfer.setData('text/plain', evt.target.src);
  evt.dataTransfer.setDragImage(evt.target, 20, 15);
  evt.dataTransfer.effectAllowed = 'move';
}

function draggingOver(evt) {
  if (playingUser !== currentUser) {
    console.log("It's not your turn!");
    return; // Prevent dropping if the user is not the playing user
  }
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'move';
}

function draggingLeave(evt) {
  if (playingUser !== currentUser) {
    console.log("It's not your turn!");
    return; // Prevent dropping if the user is not the playing user
  }
  evt.preventDefault();
}

// Listen for updates to the playing user
socket.on('updateGameState', (data) => {
  roomUsers = data.users;
  playingUserIndex = data.playingUserIndex;
  playingUser = data.playingUserId; // Update the playing user ID
  console.log(`It's now ${playingUser}'s turn.`);

  cupColors = data.cupColors;
  updateGameUI(roomUsers);
});

function dropped(evt) {
  if (playingUser !== currentUser) {
    console.log("It's not your turn!");
    return; // Prevent dropping if the user is not the playing user
  }

  evt.preventDefault();
  evt.stopPropagation();

  var sid = source.id;
  var tid = evt.target.id;

  var tempSrc = source.src;
  source.src = evt.target.src;
  evt.target.src = tempSrc;

  const sourceIndex = cupColors.indexOf(sid);
  const targetIndex = cupColors.indexOf(tid);

  if (sourceIndex === targetIndex) {
    console.log('Cannot drop on the same cup!');
    return;
  }
  if (sourceIndex !== -1 && targetIndex !== -1) {
    [cupColors[sourceIndex], cupColors[targetIndex]] = [
      cupColors[targetIndex],
      cupColors[sourceIndex],
    ];
  }

  source.id = tid;
  evt.target.id = sid;

  // Emit the move to the server
  socket.emit('movePlayed', {
    cupColors,
    playingUser: socket.id,
    joinedRoomCode,
  });
}

socket.on('beginGameState', (data) => {
  const {
    cupColors: firstPlayerCups,
    comparisonColors: firstPlayerComparison,
    users,
  } = data;

  cupColors = firstPlayerCups;
  comparisonColors = firstPlayerComparison;

  playingUser = users[playingUserIndex].id;
  mainDiv.innerHTML = `
  <div class="main" style="background: transparent; box-shadow: none;">
      <div class="scores">
        <div class="players-turn">${users[playingUserIndex].name}'s turn</div>
        <div class="game-current-score" id="display">
          Current score: 00:00.00
        </div>
        

      <div class="settings-cog" id="settings-cog">
        <img src="../imgs/Settings-cog.png" />
      </div>

      <div class="table-container">
        <div class="table-group">
          <div class="cup-container">
            <img
              id="red"
              class="cup"
              src="../imgs/cup-colors/white-cup.png"
              alt="Red Cup"
              draggable="true"
            />
            <img
              id="orange"
              class="cup"
              src="../imgs/cup-colors/white-cup.png"
              alt="Orange Cup"
              draggable="true"
            />
            <img
              id="yellow"
              class="cup"
              src="../imgs/cup-colors/white-cup.png"
              alt="Yellow Cup"
              draggable="true"
            />
            <img
              id="green"
              class="cup"
              src="../imgs/cup-colors/white-cup.png"
              alt="Green Cup"
              draggable="true"
            />
            <img
              id="blue"
              class="cup"
              src="../imgs/cup-colors/white-cup.png"
              alt="Blue Cup"
              draggable="true"
            />
            <img
              id="purple"
              class="cup"
              src="../imgs/cup-colors/white-cup.png"
              alt="Purple Cup"
              draggable="true"
            />
            <img
              id="pink"
              class="cup"
              src="../imgs/cup-colors/white-cup.png "
              alt="Pink Cup"
              draggable="true"
            />
          </div>
        </div>
        <div class="table"><img src="../imgs/table.png" /></div>
      </div>

      <div class="settings-container" id="settings-modal">
        <div class="settings-top-bar">
          <div class="settings-header">Settings</div>
          <img id="settings-exit-btn" src="../imgs/exit-button.png" />
        </div>
        <div class="settings-toggles">
          <div class="music-row">
            <div class="music-header">Music</div>
            <div class="settings-spacer"></div>
            <button class="music-toggle" id="music-toggle"></button>
          </div>
          <div class="bg-color-row">
            <div class="bg-color-header">BG Color</div>
            <div class="settings-spacer"></div>
            <button class="bg-color-toggle" id="bg-color-toggle"></button>
          </div>
          <div class="cup-mode-row">
            <div class="cup-mode-header">Cup Mode</div>
            <div class="settings-spacer"></div>
            <button class="cup-mode-toggle" id="cup-mode-toggle">Pastel</button>
          </div>
        </div>
        <div class="settings-bottom-bar">
          <button class="main-menu-button">Main Menu</button>
          <button class="play-button">
            <img style="width: 1rem" src="../imgs/play-button.png" />
          </button>
        </div>
      </div>
      <div class="play">Shuffling Cups...</div>
    </div> `;
  //SETTINGS
  setTimeout(() => {
    initializeSettingsListeners();
    initializeSettingToggles();
  }, 0);

  // //SETTINGS END
  const display = document.querySelector('.game-current-score');
  const highScoreDisplay = document.querySelector('.game-high-score');
  // Use these functions to attach the drag event listeners
  document.querySelectorAll('.cup').forEach((cup) => {
    cup.addEventListener('dragstart', dragStarted);
    cup.addEventListener('dragover', draggingOver);
    cup.addEventListener('dragleave', draggingLeave);
    cup.addEventListener('drop', dropped);
  });

  // Add event listeners to the elements for touch events
  document.querySelectorAll('.cup').forEach((cup) => {
    cup.addEventListener('touchstart', touchStarted);
    cup.addEventListener('touchmove', touchMoving);
    cup.addEventListener('touchend', touchEnded);
  });

  startTimer();
  updateGameUI();
});

function updateGameUI() {
  const playersTurn = document.querySelector('.players-turn');

  playersTurn.innerHTML = `${roomUsers[playingUserIndex].name}'s turn`;
  const cups = document.querySelectorAll('.cup');
  cups.forEach((cup, index) => {
    cup.src = `../imgs/cup-colors/${cupColors[index]}-cup.png`;
    cup.id = cupColors[index];
  });

  counter = 0;

  for (let i = 0; i < cupColors.length; i++) {
    if (cupColors[i] === comparisonColors[i]) {
      counter++;
    }
  }
  if (counter !== 7) {
    document.querySelector('.play').innerHTML = `You have ${counter} correct.`;
  } else {
    document.querySelector('.play').innerHTML = `You won!`;
    stopTimer();
    setTimeout(multiPlayAgainModal, 500);
  }
}

function multiPlayAgainModal() {
  mainDiv.innerHTML += `   
    <div class="multi-play-again-container" id="multi-play-again-modal">
        <div class="multi-top-bar">
          <div></div>
          <div class="multi-play-again-text">Congrats on winning!</div>
          <div class="exit-button" id="exit-btn">
            <img src="../imgs/exit-button.png" />
          </div>
        </div>
        <div class="multi-score-bar">
          <div class="multi-cscore">
            <div>Final score:</div>
            <div>${formatTime(score.currentTotalMs)}</div>
          </div>
        </div>
        <button class="multi-play-again-button" id="multi-play-again-btn">
          <img src="../imgs/play-again-button.png" />
        </button>
    </div>`;

  const modal = document.getElementById('multi-play-again-modal');
  const closeBtn = document.getElementById('exit-btn');
  const playAgainBtn = document.getElementById('multi-play-again-btn');

  // Close modal when clicking the exit button
  closeBtn.onclick = function () {
    modal.style.display = 'none';
  };

  // Return to the lobby when clicking "Play Again"
  playAgainBtn.onclick = function () {
    modal.style.display = 'none';
    if (roomUsers && joinedRoomCode) {
      resetGame();
    } else {
      console.error('Room data is missing! Cannot render the lobby.');
    }
  };
}

function resetGame() {
  socket.emit('resetGame', { roomCode: joinedRoomCode });
}

socket.on('resetGame', () => {
  resetTimer();
  initializeMultiplayerGame();
});

function playGame() {
  socket.emit('playGame', { roomCode: joinedRoomCode });
}

socket.on('playGame', () => {
  initializeMultiplayerGame();
});
