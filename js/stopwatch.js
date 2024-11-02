//Start of timer code
let startTime, intervalId;
let elapsedTime = 0;
let isRunning = false;

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
}

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
  display.innerHTML = formattedTime;
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millisecondsPart = Math.floor((milliseconds % 1000) / 10);

  return `Current Score:${pad(minutes)}:${pad(seconds)}.${pad(
    millisecondsPart
  )}`;
}

function pad(number) {
  return (number < 10 ? '0' : '') + number;
}
//End of timer code
