let game = [];
let gameRange = [];
let cart = [];

//Html variables

const $betTypeRange = document.querySelector(".grid-bet-container-range"); //ok

const api = {
  getApiGames() {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "/games.json", true);
    ajax.send();

    const successCall = () => {
      try {
        if (ajax.readyState === 4 && ajax.status === 200) {
          //JSON parse, copy all sub propries in OBJ.
          game.push(JSON.parse(ajax.responseText).types);
          htmlRender.gameTypes();
        }
      } catch (error) {
        console.log(error);
      }
    };

    ajax.addEventListener("readystatechange", successCall, false);
  },
};

//Onlick do button.
const handleEvents = {
  switchGameMode() {
    console.log(`hi`); //ReferenceError
  },
};

//Render gametypes button
const htmlRender = {
  gameTypes() {
    const $betTypes = document.querySelector(".grid-bet-container-button");
    game[0].map((game) => {
      $betTypes.innerHTML += `
      <button
        onclick="handleEvents.switchGameMode()"
        style="color:${game.color};border:2px solid ${game.color}" >
        ${game.type}
      </button>
      `;
    });
  },
};

const app = {
  init() {
    api.getApiGames();
    console.log(game);
  },
};

app.init();
