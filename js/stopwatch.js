//Start of timer code
let startTime, intervalId;
let elapsedTime = 0;
let isRunning = false;
const highScore = localStorage.getItem('high-score') || 0;
export let score = { currentTotalMs: 0, highScoreMs: highScore };

export function startTimer() {
  if (!isRunning) {
    startTime = Date.now() - elapsedTime;
    intervalId = setInterval(updateDisplay, 10);
    isRunning = true;
  }
}

export function stopTimer() {
  if (isRunning) {
    clearInterval(intervalId);
    isRunning = false;
  }

  if (score.highScoreMs === 0) {
    localStorage.setItem('high-score', score.currentTotalMs);

    document.querySelector(
      '.game-high-score'
    ).innerHTML = `High Score: ${formatTime(score.currentTotalMs)}`;
  } else if (score.currentTotalMs < score.highScoreMs) {
    localStorage.setItem('high-score', score.currentTotalMs);

    document.querySelector(
      '.game-high-score'
    ).innerHTML = `High Score: ${formatTime(score.currentTotalMs)}`;
  }
}

function setNewHighScore() {}

export function resetTimer() {
  clearInterval(intervalId);
  elapsedTime = 0;
  isRunning = false;
  updateDisplay();
}

function updateDisplay() {
  if (isRunning) {
    elapsedTime = Date.now() - startTime;
  }

  const formattedTime = formatTime(elapsedTime);
  display.innerHTML = `Current score: ${formattedTime}`;
}

export function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millisecondsPart = Math.floor((milliseconds % 1000) / 10);

  score.currentTotalMs = milliseconds;

  return `${pad(minutes)}:${pad(seconds)}.${pad(millisecondsPart)}`;
}

function pad(number) {
  return (number < 10 ? '0' : '') + number;
}
//End of timer code
