let game = [];
let gameSelected = [];
let gameRange = [];
let cart = []; //ok

//Html variables

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
          htmlRender.gameButtonTypes();
        }
      } catch (error) {
        console.log(error);
      }
    };

    ajax.addEventListener("readystatechange", successCall, false);
  },
};

//Onlick do button.
//Set Active
// Call Description
// Call Numbers

//Render gameButtonTypes button
const htmlRender = {
  gameButtonTypes() {
    const $betTypes = document.querySelector(".grid-bet-container-button");
    game[0].map((game) => {
      $betTypes.innerHTML += `
      <button
        onclick="handleEvents.switchGameMode('${game.type}','${game.color}')"
        data-js="${game.type}"
        type="button"
        style="color:${game.color};border:2px solid ${game.color}" >
        ${game.type}
      </button>
      `;
    });
  },

  gameDescriptionType() {
    const $betTypeDescription = document.querySelector(
      ".grid-bet-container-description"
    );

    $betTypeDescription.innerHTML = `
    <h2>Fill your bet</h2>
    <p>${gameSelected[0].description}</p>
    `;
  },

  gameRangeInputType() {
    const $betTypeRange = document.querySelector(".grid-bet-container-range");

    gameRange = gameSelected[0].range;
    $betTypeRange.innerHTML = ""; //clean inputs-container
    //Found 80 elements with non-unique id #
    //In react we have a keyProps. Here....

    for (let index = 1; index <= gameRange; index++) {
      $betTypeRange.innerHTML += `
      
      <input type="text" name="" id="${index}" value="${index}" readonly />
    `;
    }

    console.log(gameRange);
  },
};

/* w8 */
const handleEvents = {
  switchGameMode(gameType, gameColor) {
    console.log(gameType, gameColor);

    const $lotoButton = document.querySelector('[data-js="Lotofácil"]');
    const $MegaButton = document.querySelector('[data-js="Mega-Sena"]');
    const $QuinaButton = document.querySelector('[data-js="Quina"]');

    switch (gameType) {
      case "Lotofácil":
        handleEvents.setGame(gameType);
        htmlRender.gameDescriptionType();
        htmlRender.gameRangeInputType();
        break;
      case "Mega-Sena":
        handleEvents.setGame(gameType);
        htmlRender.gameDescriptionType();
        htmlRender.gameRangeInputType();
        break;
      case "Quina":
        handleEvents.setGame(gameType);
        htmlRender.gameDescriptionType();
        htmlRender.gameRangeInputType();
        break;

      default:
        alert("GameInvalido!");
        break;
    }
  },

  setGame(gameType) {
    const test = game[0].filter((game) => game.type === gameType);
    gameSelected = [...test];
    console.log(gameSelected);
  },
};

const app = {
  init() {
    api.getApiGames();
    console.log(game);
  },
};

app.init();
