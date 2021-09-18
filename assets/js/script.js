const apiKey = "d1ed7be948d11ed8ac35d1aa806592ad";
const apiUrl = 'https://api.openweathermap.org/data/2.5/';
const onecall = 'onecall?';

let lastRes = null;
const weatherCall = function(cityName) {
  fetch(apiUrl + onecall +
    [
      `q=${cityName}`,
      `exclude=${['minutely', 'hourly', 'alerts'].join(',')}`,
      `appid=${apiKey}`
    ].join('&'))
    .then(res => {
      res.json();
    }).then(json => {
      console.log(json);
      lastRes = json;
    })
}