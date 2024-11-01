//let music = new Audio('../music/savage-funk.mp3');

function dragStarted(evt) {
  source = evt.target;
  evt.dataTransfer.setData('text/plain', evt.target.src);
  evt.dataTransfer.setDragImage(evt.target, 20, 15);
  evt.dataTransfer.effectAllowed = 'move';
}

function draggingOver(evt) {
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'move';
}

function draggingLeave(evt) {
  evt.preventDefault();
}

function dropped(evt) {
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

let mainHTML = ` 
 <div class="title"><img src="../imgs/Gabis-cup-game-title.png" /></div>
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
      <img
      id="red"
      class="cup"
      src="../imgs/red-cup.png"
      alt="Image 1"
      draggable="true"
      ondragstart="dragStarted(event)"
      ondragover="draggingOver(event)"
      ondragleave="draggingLeave(event)"
      ondrop="dropped(event)"
      />
      <img
      id="orange"
      class="cup"
      src="../imgs/orange-cup.png"
      alt="Image 2"
      draggable="true"
      ondragstart="dragStarted(event)"
      ondragover="draggingOver(event)"
      ondragleave="draggingLeave(event)"
      ondrop="dropped(event)"
      />
      <img
      id="yellow"
      class="cup"
      src="../imgs/yellow-cup.png"
      alt="Image 3"
      draggable="true"
      ondragstart="dragStarted(event)"
      ondragover="draggingOver(event)"
      ondragleave="draggingLeave(event)"
      ondrop="dropped(event)"
      />
      <img
      id="green"
      class="cup"
      src="../imgs/green-cup.png"
      alt="Image 4"
      draggable="true"
      ondragstart="dragStarted(event)"
      ondragover="draggingOver(event)"
      ondragleave="draggingLeave(event)"
      ondrop="dropped(event)"
      />
      <img
      id="blue"
      class="cup"
      src="../imgs/blue-cup.png"
      alt="Image 5"
      draggable="true"
      ondragstart="dragStarted(event)"
      ondragover="draggingOver(event)"
      ondragleave="draggingLeave(event)"
      ondrop="dropped(event)"
      />
      <img
      id="purple"
      class="cup"
      src="../imgs/purple-cup.png"
      alt="Image 6"
      draggable="true"
      ondragstart="dragStarted(event)"
      ondragover="draggingOver(event)"
      ondragleave="draggingLeave(event)"
      ondrop="dropped(event)"
      />
      <img
      id="pink"
      class="cup"
      src="../imgs/pink-cup.png"
      alt="Image 7"
      draggable="true"
      ondragstart="dragStarted(event)"
      ondragover="draggingOver(event)"
      ondragleave="draggingLeave(event)"
      ondrop="dropped(event)"
      />
  
    </div>
    <div class="table"><img src="../imgs/table.png" /></div>
  </div>
      <div class="play">Shuffling Cups...</div>`;

    let iteration = 15;
    function shuffleAndChangeCups() {
      if (iteration <= 0) {
        playGame();
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
    shuffle(comparisonColors);
  },
  { once: true }
);

function playGame() {
  let counter = 0;

  for (let i = 0; i < cupColors.length; i++) {
    if (cupColors[i] === comparisonColors[i]) {
      console.log(cupColors[i]);
      counter++;
    }
  }

  if (counter !== 7) {
    document.querySelector('.play').innerHTML = `You have ${counter} correct.`;
  } else {
    document.querySelector('.play').innerHTML = `You won!`;
  }
}
