let game = [];
let gameSelected = [];
let gameRange = [];
let selectedNumbers = [];
let cart = [];

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
      const format = formatedNumber.inputValue(index);
      $betTypeRange.innerHTML += `
      <input type="text" name="" id="${index}" value="${format}" readonly />
    `;
    }
  },
};

//Utils
const formatedNumber = {
  inputValue(number) {
    return number < 10 ? `0${number}` : number;
  },

  //Format Value in Cart.
  //if need * 100 for save and next /100 for back it is great!
  currencyValue(value) {
    value = String(value).replace(/\D/g, "");

    value = Number(value);

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return value;
  },
};

/* w8 */
const handleEvents = {
  switchGameMode(gameType, gameColor) {
    console.log(gameType, gameColor);

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

  //Take value inputs, put in array.
  //When click, Clear Array.
  //Or save in cart.
  //HtmlRender for create it in cart.
  //When create make id for delete him.

  setChooseNumbers() {
    //Put in Array?
  },
};

const app = {
  init() {
    api.getApiGames();
    console.log(game);
  },
};

app.init();
