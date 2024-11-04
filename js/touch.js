import { cupColors, playGame } from './homepage.js';

let source;
let clone; // This will be the smaller "ghost" image

// Replace dragStarted with touchStarted
export function touchStarted(evt) {
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
export function touchMoving(evt) {
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
export function touchEnded(evt) {
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

  if (target && target.tagName === 'IMG') {
    var sid = source.id;
    var tid = target.id;

    var tempSrc = source.src;
    source.src = target.src;
    target.src = tempSrc;

    const sourceIndex = cupColors.indexOf(sid);
    const targetIndex = cupColors.indexOf(tid);
    if (sourceIndex !== -1 && targetIndex !== -1) {
      [cupColors[sourceIndex], cupColors[targetIndex]] = [
        cupColors[targetIndex],
        cupColors[sourceIndex],
      ];
    }

    source.id = tid;
    target.id = sid;

    playGame();
  }
}
