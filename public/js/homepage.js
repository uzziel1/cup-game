import {
  startTimer,
  stopTimer,
  formatTime,
  resetTimer,
  score,
} from './stopwatch.js';
import { dragStarted, draggingOver, draggingLeave, dropped } from './drag.js';
import { touchStarted, touchMoving, touchEnded } from './touch.js';
import { shuffle, shuffleComparison } from './utils.js';
import { gameSelect, gameSelectToggle } from './game-select.js';

// const socket = io('http://localhost:3000');
// socket.on('connect', () => {
//   console.log(`You connected with id: ${socket.id}`);
//   socket.emit('custom-event', 'Hello World');
// });

let music = new Audio('../music/savage-funk.mp3');

const highScoreText = document.querySelector('.high-score');

//Start of game starting code
let mainHTML = ` 
 <div class="title"><img src="../imgs/Gabis-cup-game-title.png" /></div>
    <div class = "scores" style = "margin-top: 0px;"> 
        <div class="high-score">High score: ${formatTime(
          score.highScoreMs
        )}</div>
    </div>

       <div class="settings-cog" id = "settings-cog"><img src="../imgs/Settings-cog.png" /></div>
      <div class="table-container">
        <div class="table-group">
          <div class="cup-container">
            <img
              id="red"
              class="cup"
              src="../imgs/cup-colors/red-cup.png"
              alt="Red Cup"
              draggable="true"
            />
            <img
              id="orange"
              class="cup"
              src="../imgs/cup-colors/orange-cup.png"
              alt="Orange Cup"
              draggable="true"
            />
            <img
              id="yellow"
              class="cup"
              src="../imgs/cup-colors/yellow-cup.png"
              alt="Yellow Cup"
              draggable="true"
            />
            <img
              id="green"
              class="cup"
              src="../imgs/cup-colors/green-cup.png"
              alt="Green Cup"
              draggable="true"
            />
            <img
              id="blue"
              class="cup"
              src="../imgs/cup-colors/blue-cup.png"
              alt="Blue Cup"
              draggable="true"
            />
            <img
              id="purple"
              class="cup"
              src="../imgs/cup-colors/purple-cup.png"
              alt="Purple Cup"
              draggable="true"
            />
            <img
              id="pink"
              class="cup"
              src="../imgs/cup-colors/pink-cup.png "
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
    <div class="play">Click to play now!</div>

   `;

export const mainDiv = document.querySelector('.main');

mainDiv.innerHTML = mainHTML;

export let cupColors = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
];
export let comparisonColors = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
];

//Page indicators
let mainMenu = true;
let mainMenuToggle = true;

initializeSettingsListeners();
initializeSettingToggles();

const playButton = document.querySelector('.play');

playButton.addEventListener(
  'click',
  () => {
    mainMenuToggle = false;
    mainMenu = false;
    gameSelect();
  },
  { once: true }
);

export function playGame() {
  let counter = 0;

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
    setTimeout(playAgainModal, 500);
  }
}

function playAgainModal() {
  mainDiv.innerHTML += `   
    <div class="play-again-container" id="play-again-modal">
        <div class="top-bar">
          <div></div>
          <div class="play-again-text">Congrats on winning!</div>
          <div class="exit-button" id="exit-btn">
            <img src="../imgs/exit-button.png" />
          </div>
        </div>
        <div class="score-bar">
          <div class="cscore">
            <div>Current score:</div>
            <div>${formatTime(score.currentTotalMs)}</div>
          </div>
          <div class="hscore">
            <div>High score:</div>
            <div>${formatTime(score.highScoreMs)}</div>
          </div>
        </div>
        <button class="play-again-button" id="play-again-btn">
          <img src="../imgs/play-again-button.png" />
        </button>
      </div>`;

  const modal = document.getElementById('play-again-modal');
  const closeBtn = document.getElementById('exit-btn');
  const playAgainBtn = document.getElementById('play-again-btn');

  // Close modal when clicking the exit button
  closeBtn.onclick = function () {
    modal.style.display = 'none';
  };

  // Restart the game when clicking "Play Again"
  playAgainBtn.onclick = function () {
    modal.style.display = 'none';
    resetGame();
  };
}

function resetGame() {
  // Reset score and timer
  resetTimer();

  document.getElementById('display').innerHTML = 'Current score: 00:00.00';

  initializeGame();
}

export function initializeGame() {
  music.play();
  mainDiv.innerHTML = `
 <div class="scores">
      <div class="game-current-score" id="display">Current score: 00:00.00</div>
      <div class="game-high-score" id="high-score">High score: 00:00.00</div>
    </div>

    <div class="settings-cog" id = "settings-cog"><img src="../imgs/Settings-cog.png" /></div>

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
    <div class="play">Shuffling Cups...</div> `;
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
  highScoreDisplay.innerHTML = `High Score: ${formatTime(score.highScoreMs)}`; //Set highscore display before shuffling cups
  let iteration = 15;
  function shuffleAndChangeCups() {
    if (iteration <= 0) {
      startTimer();
      shuffleComparison(comparisonColors);
      playGame();
      console.log(comparisonColors);

      //   // utils.js:4 Uncaught TypeError: Cannot read properties of undefined (reading 'length')
      // at shuffle (utils.js:4:28)
      // at shuffleComparison (utils.js:22:5)
      // at shuffleAndChangeCups (homepage.js:346:7)
      return;
    }

    shuffle(cupColors);

    const cups = document.querySelectorAll('.cup');
    cups.forEach((cup, index) => {
      cup.src = `../imgs/cup-colors/${cupColors[index]}-cup.png`; // Use arr[index] instead of arr[index][0]
      cup.id = cupColors[index];
    });

    iteration--;

    setTimeout(shuffleAndChangeCups, 200);
  }

  shuffleAndChangeCups();
}

export function initializeSettingsListeners() {
  const settingsModal = document.getElementById('settings-modal');
  const settingsCog = document.getElementById('settings-cog');
  const closeSettings = document.getElementById('settings-exit-btn');

  if (!settingsModal || !settingsCog || !closeSettings) {
    console.error('Settings modal elements are missing.');
    return;
  }

  // Attach event listeners for settings
  settingsCog.onclick = function () {
    settingsModal.style.display = 'block';
  };

  closeSettings.onclick = function () {
    settingsModal.style.display = 'none';
  };
}

export function initializeSettingToggles() {
  const musicToggle = document.getElementById('music-toggle');
  const bgColorToggle = document.getElementById('bg-color-toggle');
  const cupModeToggle = document.getElementById('cup-mode-toggle');
  const imageGrid = document.getElementById('image-grid');
  const mainMenuButton = document.querySelector('.main-menu-button');
  const settingsPlayButton = document.querySelector('.play-button');

  //Styles

  const buttonGreenColor = '#bcff96';
  const buttonRedColor = '#ff6a6e';

  //purple, green, blue, orange, pink, red, yellow,
  const bgColorOptions = [
    '#eaddff',
    '#e2ffdd',
    '#c9f0ff',
    '#ffceb9',
    '#ffccff',
    '#f78f8f',
    '#f4da90',
    '#ffffff',
  ];
  const cupColorOptions = {
    0: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'],
    1: [
      'vibrant-red',
      'vibrant-orange',
      'vibrant-yellow',
      'vibrant-green',
      'vibrant-blue',
      'vibrant-purple',
      'vibrant-pink',
    ],
    2: [
      'sienna',
      'peru',
      'burlywood',
      'dark-olive-green',
      'olive-drab',
      'dark-sea-green',
      'darkwood',
    ],
    3: [
      'black',
      'dark-gray',
      'gray',
      'light-gray',
      'lighter-gray',
      'lightest-gray',
      'white',
    ],
    4: ['shayla', 'alexa', 'addison', 'saad', 'shravani', 'jennifer', 'jaime'],
    5: ['gabi1', 'gabi2', 'gabi3', 'gabi4', 'gabi5', 'gabi6', 'gabi7'],
  };
  const cupColorNames = [
    'Pastel',
    'Vibrant',
    'Earth',
    'Mono',
    'Friends',
    'Gabi',
  ];
  let bgColorIndex = JSON.parse(localStorage.getItem('bgColorIndex')) || 0;
  let cupModeIndex = JSON.parse(localStorage.getItem('cupModeIndex')) || 0;
  let musicOn = localStorage.getItem('musicOn') === 'true'; // Convert to boolean

  // Set initial background color based on musicOn
  if (musicOn) {
    musicToggle.style.backgroundColor = buttonGreenColor;
    music.play();
  } else {
    musicToggle.style.backgroundColor = buttonRedColor;
  }

  if (!gameSelectToggle) {
    const scoreStyle = document.querySelector('.scores').style;
    const tableStyle = document.querySelector('.table-container').style;
    const playStyle = document.querySelector('.play').style;

    document.body.style.backgroundColor = bgColorOptions[bgColorIndex];
    bgColorToggle.style.backgroundColor = bgColorOptions[bgColorIndex];

    if (bgColorOptions[bgColorIndex] == '#ffffff') {
      imageGrid.innerHTML = `
        <img src="../imgs/collage1.png" />
        <img src="../imgs/collage2.png" />
        <img src="../imgs/collage3.png" />
        <img src="../imgs/collage4.png" />
        <img src="../imgs/collage5.png" />
        <img src="../imgs/collage3.png" />`;

      //Styles
      scoreStyle.backgroundColor = 'rgba(0, 0, 0, 0.656) ';
      scoreStyle.color = 'white';
      scoreStyle.borderRadius = '1rem';
      tableStyle.backgroundColor = 'transparent';
      tableStyle.padding = '3rem';
      tableStyle.borderRadius = '1rem';
      playStyle.backgroundColor = 'rgba(0, 0, 0, 0.656) ';
      playStyle.color = 'white';
      playStyle.borderRadius = '1rem';
    } else {
      imageGrid.innerHTML = ``;
      //Styles
      scoreStyle.backgroundColor = 'transparent';
      scoreStyle.color = 'black';
      scoreStyle.borderRadius = 'none';
      tableStyle.backgroundColor = 'transparent';
      tableStyle.padding = 'none';
      tableStyle.borderRadius = 'none';
      playStyle.backgroundColor = 'transparent';
      playStyle.color = 'black';
      playStyle.borderRadius = 'none';
    }

    cupModeToggle.innerHTML = cupColorNames[cupModeIndex];
    if (mainMenu) {
      cupColors = [
        ...(cupColorOptions[cupModeIndex] || cupColorOptions.pastel),
      ];
      comparisonColors = [
        ...(cupColorOptions[cupModeIndex] || cupColorOptions.pastel),
      ];

      const cups = document.querySelectorAll('.cup');
      cups.forEach((cup, index) => {
        cup.src = `../imgs/cup-colors/${cupColors[index]}-cup.png`; // Use arr[index] instead of arr[index][0]
        cup.id = cupColors[index];
      });
      mainMenu = false;
    }

    //Setting Buttons

    bgColorToggle.onclick = function () {
      bgColorIndex = (bgColorIndex + 1) % bgColorOptions.length;
      document.body.style.backgroundColor = bgColorOptions[bgColorIndex];
      bgColorToggle.style.backgroundColor = bgColorOptions[bgColorIndex];

      if (bgColorOptions[bgColorIndex] == '#ffffff') {
        imageGrid.innerHTML = `
        <img src="../imgs/collage1.png" />
        <img src="../imgs/collage2.png" />
        <img src="../imgs/collage3.png" />
        <img src="../imgs/collage4.png" />
        <img src="../imgs/collage5.png" />
        <img src="../imgs/collage3.png" />`;

        //Styles
        scoreStyle.backgroundColor = 'rgba(0, 0, 0, 0.656) ';
        scoreStyle.color = 'white';
        scoreStyle.borderRadius = '1rem';
        tableStyle.backgroundColor = 'rgba(44, 44, 44, 0.656)';
        tableStyle.padding = '3rem';
        tableStyle.borderRadius = '1rem';
        playStyle.backgroundColor = 'rgba(0, 0, 0, 0.656) ';
        playStyle.color = 'white';
        playStyle.borderRadius = '1rem';
      } else {
        imageGrid.innerHTML = ``;
        //Styles
        scoreStyle.backgroundColor = 'transparent';
        scoreStyle.color = 'black';
        scoreStyle.borderRadius = 'none';
        tableStyle.backgroundColor = 'transparent';
        tableStyle.padding = 'none';
        tableStyle.borderRadius = 'none';
        playStyle.backgroundColor = 'transparent';
        playStyle.color = 'black';
        playStyle.borderRadius = 'none';
      }

      localStorage.setItem('bgColorIndex', bgColorIndex);
    };
  }

  document.body.style.backgroundColor = bgColorOptions[bgColorIndex];
  bgColorToggle.style.backgroundColor = bgColorOptions[bgColorIndex];
  bgColorToggle.onclick = function () {
    bgColorIndex = (bgColorIndex + 1) % bgColorOptions.length;
    document.body.style.backgroundColor = bgColorOptions[bgColorIndex];
    bgColorToggle.style.backgroundColor = bgColorOptions[bgColorIndex];

    localStorage.setItem('bgColorIndex', bgColorIndex);
  };

  musicToggle.onclick = function () {
    if (musicOn) {
      musicOn = false;
      musicToggle.style.backgroundColor = buttonRedColor;
      music.pause();
      localStorage.setItem('musicOn', 'false');
    } else {
      musicOn = true;
      musicToggle.style.backgroundColor = buttonGreenColor;
      music.play();
      localStorage.setItem('musicOn', 'true');
    }
  };
  cupModeToggle.onclick = function () {
    if (!mainMenuToggle || gameSelectToggle) {
      alert('Please be in the Main Menu to change cup color');
    } else {
      cupModeIndex = (cupModeIndex + 1) % 6;
      cupColors = [
        ...(cupColorOptions[cupModeIndex] || cupColorOptions.pastel),
      ];
      comparisonColors = [
        ...(cupColorOptions[cupModeIndex] || cupColorOptions.pastel),
      ];

      cupModeToggle.innerHTML = cupColorNames[cupModeIndex];
      const cups = document.querySelectorAll('.cup');
      cups.forEach((cup, index) => {
        cup.src = `../imgs/cup-colors/${cupColors[index]}-cup.png`;
        // Use arr[index] instead of arr[index][0]
        cup.id = cupColors[index];
      });
    }

    localStorage.setItem('cupModeIndex', cupModeIndex);
  };

  mainMenuButton.onclick = function () {
    window.location.reload();
  };

  settingsPlayButton.onclick = function () {
    if (mainMenuToggle) {
      initializeGame();
      mainMenuToggle = false;
      mainMenu = false;
    } else {
      resetGame();
    }
  };
}
