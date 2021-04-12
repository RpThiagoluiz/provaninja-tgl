const gameApiResult = [];
let gameSelected = [];
let gameRange = [];
let selectedNumbers = [];

let cart = [
  {
    id: 1,
    type: "lotofacil", //gameSelected[0].type
    numbers: [1, 2, 3, 4], //[...selectedNumbers]
    color: "red", //gameSelected[0].color
    price: 8, //gameSelected[0].price
  },
];

const localStorageCartItens = {};

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
    $betTypeRange.innerHTML = "";

    for (let index = 1; index <= range; index++) {
      const format = utilsFormat.inputValue(index);
      $betTypeRange.innerHTML += `
      <input type="text" name="" id="${index}" value="${format}" class="grid-bet-container-range-input" onclick="getValue()" readonly />
    `;
    }
  },
};

const htmlRenderGameCart = {
  cartContainer: document.querySelector(".grid-cart-container-section"),

  gameCartItem(loteryGame, index) {
    // //Take Array numbers.
    // gametype
    // game value
    // deletar o array dos number

    //TryCatch -> ErrorHandle - !add[]

    const { type, price, color, numbers } = loteryGame;

    const divCartItem = `
      <div class="grid-cart-item">
        <img src="./assets/delete.svg" alt="Delete cart Item" onclick="console.log('${type}')"/>
        
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

  innerCartItem(loteryGame, index) {
    htmlRenderGameCart.cartContainer.innerHTML += htmlRenderGameCart.gameCartItem(
      loteryGame
    );
    //$girdCartContainer.dataset.index = index; -> index come to ArrayCart
    //TakeDelete expecific Element
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

/* w8 */
const handleEvents = {
  switchGameMode(gameType, gameColor) {
    console.log(gameType, gameColor);

    switch (gameType) {
      case "Lotofácil":
        handleEvents.setGame(gameType);
        htmlRenderGame.gameDescriptionType();
        htmlRenderGame.gameRangeInputType();
        break;
      case "Mega-Sena":
        handleEvents.setGame(gameType);
        htmlRenderGame.gameDescriptionType();
        htmlRenderGame.gameRangeInputType();
        break;
      case "Quina":
        handleEvents.setGame(gameType);
        htmlRenderGame.gameDescriptionType();
        htmlRenderGame.gameRangeInputType();
        break;

      default:
        handleModalError.errorMessage(
          "Game Invalido! Ou Error no processamento do game."
        );
        handleModalError.toggle();
    }
  },

  setGame(gameType) {
    selectedNumbers = [];
    const result = gameApiResult[0].filter((game) => game.type === gameType);
    gameSelected = [...result];
    console.log(gameSelected[0]);
  },

  //Take value inputs, put in array.
  //When click, Clear Array.
  //Or save in cart.
  //htmlRenderGame for create it in cart.
  //When create make id for delete him.

  getValue() {
    // const takeInput = document.querySelector(".grid-bet-container-range-input");

    // takeInput.classList.toggle("selected");

    return {};
  },

  randomSelectedNumbers(gameRange) {
    return String(utilsFormat.inputValue(Math.ceil(Math.random() * gameRange)));
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
  allCartItems: [...cart], //test fase. LoteryGame can ad but, app dont Reload yet.

  addToCart(loteryGame) {
    //Check Errors numbers > max-number in array seleceted.
    try {
      loteryGame = {
        id: (Math.random() * 99) / 100,
        type: gameSelected[0].type,
        numbers: [...selectedNumbers].map((el) => Number(el)),
        color: gameSelected[0].color,
        price: gameSelected[0].price,
      };

      handleCartEvents.allCartItems.push(loteryGame);
      //app.reload;
      console.log(handleCartEvents.allCartItems);
    } catch (error) {
      handleModalError.errorMessage(error.message);
      handleModalError.toggle();
    }
  },

  removeToCart(index) {
    handleCartEvents.allCartItems.splice(index, 1);
    app.reload;
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

    cart.map((game) => {
      htmlRenderGameCart.innerCartItem(game);
    });

    htmlRenderGameCart.innerCartTotal();
  },

  reload() {
    htmlRenderGameCart.clearCartItens();
    app.init();
  },
};

app.init();
