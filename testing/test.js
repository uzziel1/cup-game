var arr = [
  ['red', 'Image 1'],
  ['orange', 'Image 2'],
  ['yellow', 'Image 3'],
  ['green', 'Image A'],
  ['blue', 'Image B'],
  ['purple', 'Image C'],
  ['pink', 'Image D'],
];
var source;

shuffle(arr);

let iteration = 15;
function shuffleAndChangeCups() {
  if (iteration <= 0) {
    // playGame();
    return;
  }

  shuffle(arr);

  const cups = document.querySelectorAll('.M');
  cups.forEach((cup, index) => {
    cup.src = `../imgs/${arr[index][0]}-cup.png`;
    cup.id = `${arr[index][0]}`;
  });

  iteration--;

  setTimeout(shuffleAndChangeCups, 200);
}

shuffleAndChangeCups();

function dragStarted(evt) {
  source = evt.target; // Stores the source element being dragged
  evt.dataTransfer.setData('text/plain', evt.target.src); // Saves the image source as the data to be transferred
  evt.dataTransfer.setDragImage(evt.target, 20, 15); // Use evt.target to specify the drag image
  evt.dataTransfer.effectAllowed = 'move';
  console.log(evt);
}

function draggingOver(evt) {
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'move';
  document.getElementById(evt.target.id).style.border = '1px solid orange';
  console.log(evt);
}

function draggingLeave(evt) {
  evt.preventDefault();
  document.getElementById(evt.target.id).style.border = 'thin solid #bbb';
  console.log(evt);
}

function dropped(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  // Get IDs of source and target elements
  var sid = source.id;
  var tid = evt.target.id;

  // Swap image sources between the elements
  var tempSrc = source.src;
  source.src = evt.target.src;
  evt.target.src = tempSrc;

  // Reset the border of the target element
  document.getElementById(evt.target.id).style.border = 'thin solid #bbb';

  // Check and update arr only if IDs exist in the array
  const sourceIndex = returnIndex(arr, sid);
  const targetIndex = returnIndex(arr, tid);
  if (sourceIndex !== undefined && targetIndex !== undefined) {
    arr[sourceIndex][0] = tid;
    arr[targetIndex][0] = sid;
  }

  // Swap IDs of source and target elements in the DOM
  source.id = tid;
  evt.target.id = sid;

  // Display updated array in arroutput
  document.getElementById('arroutput').innerHTML = arr
    .map((item) => item.join(', '))
    .join('<br />');
}

function returnIndex(array, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][0] === value) {
      return i;
    }
  }
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
