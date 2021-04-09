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

    const { description } = gameSelected[0];

    $betTypeDescription.innerHTML = `
    <h2>Fill your bet</h2>
    <p>${description}</p>
    `;
  },

  gameRangeInputType() {
    const $betTypeRange = document.querySelector(".grid-bet-container-range");

    const { range } = gameSelected[0];
    $betTypeRange.innerHTML = ""; //clean inputs-container
    //Found 80 elements with non-unique id #
    //In react we have a keyProps. Here....

    for (let index = 1; index <= range; index++) {
      const format = formatedNumber.inputValue(index);
      $betTypeRange.innerHTML += `
      <input type="text" name="" id="${index}" value="${format}" class="grid-bet-container-range-input" onclick="getValue()" readonly />
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
    selectedNumbers = [];
    const test = game[0].filter((game) => game.type === gameType);
    gameSelected = [...test];
    console.log(gameSelected);
  },

  //Take value inputs, put in array.
  //When click, Clear Array.
  //Or save in cart.
  //HtmlRender for create it in cart.
  //When create make id for delete him.

  getValue() {
    // const takeInput = document.querySelector(".grid-bet-container-range-input");

    // takeInput.classList.toggle("selected");

    return {};
  },

  randomSelectedNumbers(gameRange) {
    return String(
      formatedNumber.inputValue(Math.ceil(Math.random() * gameRange))
    );
  },
};

const handleButtonEvents = {
  completeGame() {
    try {
      const { range } = gameSelected[0];
      const maxNumber = gameSelected[0]["max-number"];

      //while is true, when he false result -1.
      //Check if number exists in Array. ╰（‵□′）╯
      while (maxNumber > selectedNumbers.length) {
        let randomNum = handleEvents.randomSelectedNumbers(range);
        if (selectedNumbers.indexOf(randomNum) === -1) {
          selectedNumbers.push(randomNum);
        }
      }

      const crescs = (cr1, cr2) => {
        return cr1 - cr2;
      };
      //CompletedGame Repeat a number!

      const crescResult = [...selectedNumbers];

      console.log(crescResult.sort(crescs));
    } catch (error) {
      alert("Selecione um game primeiramente!");
    }
  },

  resetGame() {
    selectedNumbers = [];
    const gameNumbersRange = document.querySelectorAll(
      ".grid-bet-container-range-input"
    );
    gameNumbersRange.forEach((number) => {
      number.style.background = "var(--cyan-gray-300)"; //
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
