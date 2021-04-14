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
          gameApiResult.push(JSON.parse(ajax.responseText).types);
          htmlRenderGame.gameButtonTypes();

          const findLotofacil = gameApiResult[0].filter(
            (game) => game.type === "Lotofácil"
          );
          gameSelected = [...findLotofacil];

          htmlRenderGame.gameDescriptionType();
          htmlRenderGame.gameRangeInputType();
          handleActiveStyle.game("Lotofácil");
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
        onclick="handleLoteryGames.setGame('${game.type}')"
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

const handleActiveStyle = {
  game(gameType) {
    const { color, type } = gameSelected[0];

    const $gameSelected = document.querySelector(
      `.gamelotery-active-${gameType}`
    );

    gameApiResult[0].map((el) => {
      const $AllGamesTypes = document.querySelector(
        `.gamelotery-active-${el.type}`
      );

      if (el.type === type) {
        $gameSelected.style.background = `${color}`;
        $gameSelected.style.color = "var(--white)";
      } else {
        $AllGamesTypes.style.background = "transparent";
        $AllGamesTypes.style.borderColor = `${el.color}`;
        $AllGamesTypes.style.color = `${el.color}`;
      }
    });
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
  setGame(gameType) {
    gameSelected = [];
    selectedNumbers = [];

    const result = gameApiResult[0].filter((game) => game.type === gameType);
    gameSelected = [...result];
    htmlRenderGame.gameDescriptionType();
    htmlRenderGame.gameRangeInputType();
    handleActiveStyle.game(gameType);
  },

  getValue(value) {
    const indexSelected = selectedNumbers.indexOf(value);
    const numExists = indexSelected === -1;
    const maxNumbersSelected =
      selectedNumbers.length < gameSelected[0]["max-number"];

    try {
      if (numExists && maxNumbersSelected) {
        selectedNumbers.push(value);
        handleActiveStyle.number(value);
        console.log(selectedNumbers);
      } else if (!numExists) {
        selectedNumbers.splice(indexSelected, 1);
        handleActiveStyle.number(value);
        console.log(selectedNumbers);
      } else {
        throw new Error(
          `Quantidade selecionada, excede a quantidade maxima ${gameSelected[0]["max-number"]}`
        );
      }
    } catch (error) {
      handleModalError.errorMessage(error.message);
      handleModalError.toggle();
    }
  },

  randomSelectedNumbers(gameRange) {
    return String(utilsFormat.inputValue(Math.ceil(Math.random() * gameRange)));
  },
};

const handleButtonEvents = {
  //!important
  completeGame() {
    const { range } = gameSelected[0];

    const maxNumber = gameSelected[0]["max-number"];

    console.log(range);

    while (maxNumber > selectedNumbers.length) {
      let randomNum = handleLoteryGames.randomSelectedNumbers(range);
      if (selectedNumbers.indexOf(randomNum) === -1) {
        selectedNumbers.push(randomNum);
      }
    }
    selectedNumbers.map((el) => handleActiveStyle.number(el));
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
