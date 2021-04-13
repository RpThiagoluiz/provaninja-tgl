const gameApiResult = [];
let gameSelected = [];
let gameRange = [];
let selectedNumbers = [];

const storage = {
  get() {
    return (
      JSON.parse(localStorage.getItem("@luby-test-ninja-thiagoluiz")) || []
    );
  },
  set(transactions) {
    localStorage.setItem(
      "@luby-test-ninja-thiagoluiz",
      JSON.stringify(transactions)
    );
  },
};
const api = {
  getApiGames() {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "/games.json", true);
    ajax.send();

    const successCall = () => {
      try {
        if (ajax.readyState === 4 && ajax.status === 200) {
          //JSON parse, copy all sub propries in OBJ.
          gameApiResult.push(JSON.parse(ajax.responseText).types);
          htmlRenderGame.gameButtonTypes();
        }
      } catch (error) {
        handleModalError.errorMessage(
          "Error durante a Chamada da API! - Tente Novamente mais tarde!"
        );
        handleModalError.toggle();
      }
    };

    ajax.addEventListener("readystatechange", successCall, false);
  },
};

const utilsFormat = {
  inputValue(number) {
    return number < 10 ? `0${number}` : number;
  },

  //Format Value in Cart.
  //if need * 100 for save and next /100 for back it is great!
  currencyValue(value) {
    value = value * 100;
    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return value;
  },

  crescentArrayNumbers(selectedNumber) {
    const crescs = (cr1, cr2) => {
      return cr1 - cr2;
    };

    const crescResult = [...selectedNumber];

    return crescResult.sort(crescs);
  },
};

const handleModalError = {
  toggle() {
    const $modal = document.querySelector(".modal-overlay");
    $modal.classList.toggle("active");
  },
  errorMessage(message) {
    const $modalContent = document.querySelector(".modal-content");
    $modalContent.innerHTML = `

    <p>Ocorreu um Error !</p>
    <h2>${message}</h2>
    <button onclick="handleModalError.toggle()"> FECHAR! </button>
    `;
  },
};

const htmlRenderGame = {
  gameButtonTypes() {
    const $betTypes = document.querySelector(".grid-bet-container-button");
    gameApiResult[0].map((game) => {
      $betTypes.innerHTML += `
      <button
        onclick="handleLoteryGames.switchGameMode('${game.type}')"
        data-js="${game.type}"
        class="gamelotery-active-${game.type}"
        
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
    $betTypeRange.innerHTML = "";

    for (let index = 1; index <= range; index++) {
      const format = utilsFormat.inputValue(index);
      $betTypeRange.innerHTML += `
      <input type="text" name="" id="range-input-${index}" value="${format}" class="grid-bet-container-range-input" onclick="handleLoteryGames.getValue(${index})" readonly />
    `;
    }
  },
};

const htmlRenderGameCart = {
  cartContainer: document.querySelector(".grid-cart-container-section"),

  innerCartItem(loteryGame, index) {
    const $divItem = document.createElement("div");

    $divItem.innerHTML = htmlRenderGameCart.gameCartItem(loteryGame, index);

    $divItem.dataset.index = index; //Unique Caracter

    htmlRenderGameCart.cartContainer.appendChild($divItem);
  },

  gameCartItem(loteryGame, index) {
    const { type, price, color, numbers } = loteryGame;

    const divCartItem = `
      <div class="grid-cart-item">
        <img src="./assets/delete.svg" alt="Delete cart Item" onclick="handleCartEvents.remove(${index})"/>
        
        <div class="grid-cart-item-description"  style="border-left: 0.25rem solid ${color} ">
          <p>${utilsFormat.crescentArrayNumbers(numbers)}</p>
          <span
            ><strong style="color:${color} ">${type}</strong>
            <span data-js="game-type-price">${utilsFormat.currencyValue(
              price
            )}</span>
          </span>
        </div>
      </div>
    `;

    return divCartItem;
  },

  innerCartTotal() {
    document.querySelector(
      '[data-js="cart-total"]'
    ).innerHTML = utilsFormat.currencyValue(handleCartEvents.total());
  },

  clearCartItens() {
    htmlRenderGameCart.cartContainer.innerHTML = "";
  },
};

const handleActive = {
  //gameType - arg
  game() {
    // const { color, type } = gameSelected[0];
    // const $gameLoterySelected = document.querySelector(
    //   `.gamelotery-active-${gameType}`
    // );
    // gameApiResult[0].map((el) => {
    //   if (el === gameSelected[0]) {
    //     $gameLoterySelected.style.background = `${color}`;
    //     $gameLoterySelected.style.color = "var(--white)";
    //   } else if (el !== gameSelected[0]) {
    //     $gameLoterySelected.style.background = "transparent";
    //     $gameLoterySelected.style.color = `${color}`;
    //     $gameLoterySelected.style.borderColor = `${color}`;
    //   }
    // });

    const { color, type } = gameSelected[0];
    const $gameLoteryQuina = document.querySelector(`.gamelotery-active-Quina`);
    const $gameLoteryMega = document.querySelector(
      `.gamelotery-active-Mega-Sena`
    );
    const $gameLoteryLotofacil = document.querySelector(
      `.gamelotery-active-Lotofácil`
    );

    const mega = gameApiResult[0][1];
    const quina = gameApiResult[0][2];
    const loto = gameApiResult[0][0];

    console.log(type);

    switch (type) {
      case "Lotofácil":
        $gameLoteryLotofacil.style.background = `${color}`;
        $gameLoteryLotofacil.style.color = "var(--white)";

        $gameLoteryMega.style.background = "transparent";
        $gameLoteryMega.style.color = `${mega.color}`;
        $gameLoteryMega.style.borderColor = `${mega.color}`;

        $gameLoteryQuina.style.background = "transparent";
        $gameLoteryQuina.style.color = `${quina.color}`;
        $gameLoteryQuina.style.borderColor = `${quina.color}`;

        break;
      case "Mega-Sena":
        $gameLoteryMega.style.background = `${color}`;
        $gameLoteryMega.style.color = "var(--white)";

        $gameLoteryLotofacil.style.background = "transparent";
        $gameLoteryLotofacil.style.color = `${loto.color}`;
        $gameLoteryLotofacil.style.borderColor = `${loto.color}`;

        $gameLoteryQuina.style.background = "transparent";
        $gameLoteryQuina.style.color = `${quina.color}`;
        $gameLoteryQuina.style.borderColor = `${quina.color}`;
        break;
      case "Quina":
        $gameLoteryQuina.style.background = `${color}`;
        $gameLoteryQuina.style.color = "var(--white)";

        $gameLoteryMega.style.background = "transparent";
        $gameLoteryMega.style.color = `${mega.color}`;
        $gameLoteryMega.style.borderColor = `${mega.color}`;

        $gameLoteryLotofacil.style.background = "transparent";
        $gameLoteryLotofacil.style.color = `${loto.color}`;
        $gameLoteryLotofacil.style.borderColor = `${loto.color}`;
        break;

      default:
        break;
    }
  },

  number(value) {
    const $inputValue = document.querySelector(`#range-input-${value}`);
    const exists = selectedNumbers.indexOf(value);

    if (exists !== -1) {
      $inputValue.style.background = "var(--green-500)";
    } else {
      $inputValue.style.background = "var(--cyan-gray-300)";
    }
  },
};

const handleLoteryGames = {
  switchGameMode(gameType) {
    switch (gameType) {
      case "Lotofácil":
        handleLoteryGames.setGame(gameType);
        htmlRenderGame.gameDescriptionType();
        htmlRenderGame.gameRangeInputType();
        break;
      case "Mega-Sena":
        handleLoteryGames.setGame(gameType);
        htmlRenderGame.gameDescriptionType();
        htmlRenderGame.gameRangeInputType();
        break;
      case "Quina":
        handleLoteryGames.setGame(gameType);
        htmlRenderGame.gameDescriptionType();
        htmlRenderGame.gameRangeInputType();
        break;
      default:
        handleModalError.errorMessage(
          "Game Invalido! Ou Error no processamento do game."
        );
        handleModalError.toggle();
    }
    handleActive.game();
  },

  setGame(gameType) {
    selectedNumbers = [];

    const result = gameApiResult[0].filter((game) => game.type === gameType);
    gameSelected = [...result];
  },

  getValue(value) {
    const indexSelected = selectedNumbers.indexOf(value);
    const numExists = indexSelected === -1;

    if (numExists) {
      selectedNumbers.push(value);
      handleActive.number(value);
    } else {
      const index = selectedNumbers.indexOf(value);
      selectedNumbers.splice(index, 1);
      handleActive.number(value);
    }
  },

  randomSelectedNumbers(gameRange) {
    return String(utilsFormat.inputValue(Math.ceil(Math.random() * gameRange)));
  },
};

const handleButtonEvents = {
  //Bug - I need every time when i click generate a new
  completeGame() {
    try {
      const { range } = gameSelected[0];

      const maxNumber = gameSelected[0]["max-number"];

      while (maxNumber > selectedNumbers.length) {
        let randomNum = handleLoteryGames.randomSelectedNumbers(range);
        if (selectedNumbers.indexOf(randomNum) === -1) {
          selectedNumbers.push(randomNum);
          // selectedNumbers.map((el) => handleActive.number(el));
          //But in Lotery game.
        }
      }
    } catch (error) {
      handleModalError.errorMessage("Selecione um game primeiramente!");
      handleModalError.toggle();
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

const handleCartEvents = {
  allCartItems: storage.get(),

  add(loteryGame) {
    try {
      const maxNumber = gameSelected[0]["max-number"];
      const numbersChoise = [...selectedNumbers].map((el) => Number(el));

      if (numbersChoise.length === maxNumber) {
        const { type, color, price } = gameSelected[0];

        loteryGame = {
          type,
          numbers: numbersChoise,
          color,
          price,
        };

        handleCartEvents.allCartItems.push(loteryGame);
        app.reload();
        handleButtonEvents.resetGame();
      } else {
        throw new Error(
          `Selecione  ${maxNumber} numeros, para adicionar o game ao carrinho`
        );
      }
    } catch (error) {
      handleModalError.errorMessage(error.message);
      handleModalError.toggle();
    }
  },

  remove(index) {
    handleCartEvents.allCartItems.splice(index, 1);

    app.reload();
  },

  total() {
    let total = 0;

    handleCartEvents.allCartItems.map((loteryGame) => {
      total += loteryGame.price;
    });

    return total;
  },
};

const app = {
  init() {
    api.getApiGames();
    app.cartItem();
  },

  cartItem() {
    handleCartEvents.allCartItems.map((game, index) => {
      htmlRenderGameCart.innerCartItem(game, index);
    });

    htmlRenderGameCart.innerCartTotal();
    storage.set(handleCartEvents.allCartItems);
  },

  reload() {
    htmlRenderGameCart.clearCartItens();
    storage.set(handleCartEvents.allCartItems);
    app.cartItem();
  },
};

app.init();
