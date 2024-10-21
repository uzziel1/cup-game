// let music = new Audio('../music/savage-funk.mp3');

let mainHTML = `  <div class="title"><img src="../imgs/Gabis-cup-game-title.png" /></div>
    <div class="high-score">High score: 0.00s</div>
    <div class="settings-cog"><img src="../imgs/Settings-cog.png" /></div>
    <div class="default-table"><img src="../imgs/default-table.png" /></div>
    <div class="play">Click to play now!</div>

   `;

const mainDiv = document.querySelector('.main');

mainDiv.innerHTML = mainHTML;

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

document.body.addEventListener(
  'click',
  function (evt) {
    // music.play();
    mainDiv.innerHTML = `   <div class="scores">
        <div class="game-current-score">Current score: 0.00s</div>
        <div class="game-high-score">High score: 0.00s</div>
      </div>

      <div class="settings-cog"><img src="../imgs/Settings-cog.png" /></div>

      <div class="table-group">
        <div class="cup-container">
          <img class="cup" draggable="true" src="../imgs/white-cup.png" />
          <img class="cup" draggable="true" src="../imgs/white-cup.png" />
          <img class="cup" draggable="true" src="../imgs/white-cup.png" />
          <img class="cup" draggable="true" src="../imgs/white-cup.png" />
          <img class="cup" draggable="true" src="../imgs/white-cup.png" />
          <img class="cup" draggable="true" src="../imgs/white-cup.png" />
          <img class="cup" draggable="true" src="../imgs/white-cup.png" />
        </div>
        <div class="table"><img src="../imgs/table.png" /></div>
      </div>

      <div class="play">Shuffling Cups...</div>`;

    let iteration = 15;

    //Recursive function that calls itself

    function shuffleAndChangeCups() {
      if (iteration <= 0) {
        playGame();
        return;
      }

      shuffle(cupColors);

      const cups = document.querySelectorAll('.cup');
      cups.forEach((cup, index) => {
        cup.src = `../imgs/${cupColors[index]}-cup.png`;
      });

      iteration--;

      setTimeout(shuffleAndChangeCups, 200);
    }

    shuffleAndChangeCups();
  },
  { once: true }
);

function playGame() {
  let counter = 0;

  shuffle(comparisonColors);

  for (let i = 0; i < cupColors.length; i++) {
    if (cupColors[i] === comparisonColors[i]) {
      console.log(cupColors[i]);
      counter++;
    }
  }

  console.log(`CupColors are: ${cupColors}`);
  console.log(`comparisonColors are: ${comparisonColors}`);

  document.querySelector('.play').innerHTML = `You have ${counter} correct.`;

  // Select all the cup images
  const cups = document.querySelectorAll('.cup');

  // Loop through each cup and add the dragstart event
  cups.forEach((cup) => {
    cup.addEventListener('dragstart', function (event) {
      // Set the correct drag image (the cup itself)
      event.dataTransfer.setDragImage(cup, 20, 15); // 0, 0 places the image at the cursor point
    });
  });
}
