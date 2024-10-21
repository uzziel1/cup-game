let mainHTML = `  <div class="title"><img src="../imgs/Gabis-cup-game-title.png" /></div>
    <div class="high-score">High score: 0.00s</div>
    <div class="settings-cog"><img src="../imgs/Settings-cog.png" /></div>
    <div class="default-table"><img src="../imgs/default-table.png" /></div>
    <div class="play">Click to play now!</div>

   `;

document.querySelector('.main').innerHTML = mainHTML;

document.body.addEventListener('click', function (evt) {
  console.log(evt.target);
  console.log('clicked!');
});
