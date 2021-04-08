function getApiGames() {
  const ajax = new XMLHttpRequest();
  ajax.open("GET", "/games.json", true);
  ajax.send();

  const successCall = () => {
    if (ajax.readyState === 4 && ajax.status === 200) {
      console.log(ajax.responseText);
    }
  };

  ajax.addEventListener("readystatechange", successCall, false);
}
getApiGames();
