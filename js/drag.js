import { cupColors, playGame } from './homepage.js';

let source;

export function dragStarted(evt) {
  source = evt.target;
  evt.dataTransfer.setData('text/plain', evt.target.src);
  evt.dataTransfer.setDragImage(evt.target, 20, 15);
  evt.dataTransfer.effectAllowed = 'move';
}

export function draggingOver(evt) {
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'move';
}

export function draggingLeave(evt) {
  evt.preventDefault();
}

export function dropped(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  var sid = source.id;
  var tid = evt.target.id;

  var tempSrc = source.src;
  source.src = evt.target.src;
  evt.target.src = tempSrc;

  const sourceIndex = cupColors.indexOf(sid);
  const targetIndex = cupColors.indexOf(tid);
  if (sourceIndex !== -1 && targetIndex !== -1) {
    [cupColors[sourceIndex], cupColors[targetIndex]] = [
      cupColors[targetIndex],
      cupColors[sourceIndex],
    ];
  }

  source.id = tid;
  evt.target.id = sid;

  playGame();
}
