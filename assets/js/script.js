const apiKey = "d1ed7be948d11ed8ac35d1aa806592ad";
const apiUrl = 'https://api.openweathermap.org/data/2.5/';
const onecall = 'onecall?';
const weather = 'weather?';
const currentWeatherDiv = document.querySelector('#current-weather');

let lastRes = null;
const displayCurrentWeather = function(cityName, date, temp, wind, humidity, uv) {
}

const forecast = (lat, lon) => {
  return fetch(apiUrl + onecall +
    [
      'lat=' + lat,
      'lon=' + lon,
      'exclude=' + ['minutely', 'hourly', 'alerts'].join(','),
      'units=imperial',
      'appid=' + apiKey].join('&')
  ).then(res => res.json()
  ).then(json => {
    console.log(json);
    lastRes = json;
  })
}

const weatherCall = function (cityName) {
  return fetch(apiUrl + weather +
    [
      `q=${cityName}`,
      `appid=${apiKey}`
    ].join('&'))
    .then(res => res.json())
    .then(o => {
      lastRes = o;
      console.log(o);
    })
}