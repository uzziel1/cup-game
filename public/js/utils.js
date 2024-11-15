import { cupColors, comparisonColors } from './homepage.js';

export function shuffle(array) {
  let currentIndex = array.length;
  console.log(array);
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
