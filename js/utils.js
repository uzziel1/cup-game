import { cupColors, comparisonColors } from './homepage.js';

export function shuffle(array) {
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

export function shuffleComparison(array) {
  let matching = true;
  while (matching) {
    shuffle(array);
    console.log('iteration');
    let counter = 0;
    for (let i = 0; i < cupColors.length; i++) {
      if (cupColors[i] === comparisonColors[i]) {
        counter++;
      }
    }
    if (counter === 0) {
      matching = false;
    }
  }
}