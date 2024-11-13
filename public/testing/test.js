let cupColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
let source;

let iteration = 15;
function shuffleAndChangeCups() {
  if (iteration <= 0) {
    // playGame();
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

function dragStarted(evt) {
  source = evt.target;
  evt.dataTransfer.setData('text/plain', evt.target.src);
  evt.dataTransfer.setDragImage(evt.target, 20, 15);
  evt.dataTransfer.effectAllowed = 'move';
  console.log(evt);
}

function draggingOver(evt) {
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'move';
  console.log(evt);
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

  document.getElementById('arroutput').innerHTML = cupColors.join('<br />');
}

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
