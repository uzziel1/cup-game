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

let music = new Audio('../music/savage-funk.mp3');

const highScoreText = document.querySelector('.high-score');

//Start of game starting code
let mainHTML = ` 
 <div class="title"><img src="../imgs/Gabis-cup-game-title.png" /></div>
    <div class="high-score">High score: ${formatTime(score.highScoreMs)}</div>
    <div class="settings-cog"><img src="../imgs/Settings-cog.png" /></div>
    <div class="default-table"><img src="../imgs/default-table.png" /></div>
    <div class="play">Click to play now!</div>

   `;

const mainDiv = document.querySelector('.main');

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

document.body.addEventListener(
  'click',
  () => {
    initializeGame();
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

function initializeGame() {
  //  music.play();
  mainDiv.innerHTML = `   <div class="scores">
      <div class="game-current-score" id ="display">Current score: 00:00.00</div>
      <div class="game-high-score" id = "high-score">High score: 00:00.00</div>
    </div>

    <div class="settings-cog"><img src="../imgs/Settings-cog.png" /></div>

     <div class="table-group">
  <div class="cup-container">
   <img id="red" class="cup" src="../imgs/red-cup.png" alt="Red Cup" draggable="true" />
<img id="orange" class="cup" src="../imgs/orange-cup.png" alt="Orange Cup" draggable="true" />
<img id="yellow" class="cup" src="../imgs/yellow-cup.png" alt="Yellow Cup" draggable="true" />
<img id="green" class="cup" src="../imgs/green-cup.png" alt="Green Cup" draggable="true" />
<img id="blue" class="cup" src="../imgs/blue-cup.png" alt="Blue Cup" draggable="true" />
<img id="purple" class="cup" src="../imgs/purple-cup.png" alt="Purple Cup" draggable="true" />
<img id="pink" class="cup" src="../imgs/pink-cup.png" alt="Pink Cup" draggable="true" />

  </div>
  <div class="table"><img src="../imgs/table.png" /></div>
</div>
    <div class="play">Shuffling Cups...</div>`;
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
      return;
    }

    shuffle(cupColors);

    const cups = document.querySelectorAll('.cup');
    cups.forEach((cup, index) => {
      cup.src = `../imgs/${cupColors[index]}-cup.png`; // Use arr[index] instead of arr[index][0]
      cup.id = cupColors[index];
    });

    iteration--;

    setTimeout(shuffleAndChangeCups, 200);
  }

  shuffleAndChangeCups();
}
