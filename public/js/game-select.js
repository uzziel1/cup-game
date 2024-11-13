import {
  mainDiv,
  initializeSettingToggles,
  initializeSettingsListeners,
  initializeGame,
} from './homepage.js';

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
                <input type="text" id="room-code" name="roomCode" placeholder="Enter room code" required />
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

  document.querySelectorAll('input[required]').forEach((input) => {
    input.addEventListener('invalid', (event) => {
      event.target.setCustomValidity('This field is required.');
    });

    input.addEventListener('input', (event) => {
      event.target.setCustomValidity(''); // Clear custom message on input
    });
  });
}
