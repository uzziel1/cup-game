let mainHTML = `  <div class="title"><img src="../imgs/Gabis-cup-game-title.png" /></div>
    <div class="high-score">High score: 0.00s</div>
    <div class="settings-cog"><img src="../imgs/Settings-cog.png" /></div>
    <div class="default-table"><img src="../imgs/default-table.png" /></div>
    <div class="play">Click to play now!</div>

   `;

const mainDiv = document.querySelector('.main');

mainDiv.innerHTML = mainHTML;

document.body.addEventListener('click', function (evt) {
  console.log(evt.target);
  console.log('clicked!');

  mainDiv.innerHTML = `   <div class="scores">
        <div class="game-current-score">Current score: 0.00s</div>
        <div class="game-high-score">High score: 0.00s</div>
      </div>

      <div class="settings-cog"><img src="../imgs/Settings-cog.png" /></div>

      <div class="table-group">
        <div class="cups">
          <img src="../imgs/white-cup.png" />
          <img src="../imgs/white-cup.png" />
          <img src="../imgs/white-cup.png" />
          <img src="../imgs/white-cup.png" />
          <img src="../imgs/white-cup.png" />
          <img src="../imgs/white-cup.png" />
          <img src="../imgs/white-cup.png" />
        </div>
        <div class="table"><img src="../imgs/table.png" /></div>
      </div>

      <div class="play">Shuffling Cups...</div>`;
});

let cupColors = [];
