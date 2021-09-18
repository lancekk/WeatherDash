const apiKey = "d1ed7be948d11ed8ac35d1aa806592ad";
const apiUrl = 'https://api.openweathermap.org/data/2.5/';
const onecall = 'onecall?';
const weather = 'weather?';
const currentWeatherDetail = document.querySelector('#cw-detail');
const searchForm = document.querySelector('#search-form');

let lastRes = null;

const uviTier = (uv) => {
  if (uv < 3) {
    return 'favorable';
  } else if (uv < 6) {
    return 'moderate';
  } else {
    return 'severe';
  }
}

const displayCurrentWeather = (cityName, date, temp, wind, humidity, uv) => {
  let wHead = document.querySelector('#cw-header');
  wHead.textContent = `${cityName} (${date})`;
  let pTemp = document.createElement('p');
  pTemp.textContent = `Temp: ${temp}°F`;
  let pWind = document.createElement('p');
  pWind.textContent = `Wind: ${wind} MPH`;
  let pHumid = document.createElement('p');
  pHumid.textContent = `Humidity: ${humidity} %`;
  let pUVi = document.createElement('p');
  pUVi.textContent = `UV Index: ${uv}`;

  currentWeatherDetail.innerHTML = '';
  currentWeatherDetail.appendChild(pTemp);
  currentWeatherDetail.appendChild(pWind);
  currentWeatherDetail.appendChild(pHumid);
  currentWeatherDetail.appendChild(pUVi);
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
    return json;
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
      return o;
    })
}

searchForm.querySelector('button').addEventListener('click', (ev) => {
  ev.preventDefault();
  console.log(this);
  let sTerm = searchForm.querySelector('input').value;
  console.log(`search term: ${sTerm}`);
  weatherCall(sTerm)
  .then(json => {
    return forecast(json.coord.lat, json.coord.lon)
  }).then(blob => {
    let c = blob.current;
    displayCurrentWeather(sTerm, Date(), c.temp, c.wind_speed, c.humidity, c.uvi);
  })
 });
