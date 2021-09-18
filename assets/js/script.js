const apiKey = "d1ed7be948d11ed8ac35d1aa806592ad";
const apiUrl = 'https://api.openweathermap.org/data/2.5/';
const onecall = 'onecall?';
const weather = 'weather?';
const currentWeatherDetail = document.querySelector('#cw-detail');
const searchForm = document.querySelector('#search-form');
const cities = document.querySelector('#city-list');

let lastRes = null;

const initHistory = () => {
  localStorage['cities'] = JSON.stringify([]);
  cities.innerHTML = '';
}

if (localStorage.getItem('cities') === null) {
  initHistory();
}

const getCities = () => JSON.parse(localStorage['cities']);

const hasCity = (cityName) => getCities().some(c => c.name === cityName);

const pushCity = (cityName, coord) => {
  let cs = getCities();
  if (cs.every(c => c.name !== cityName)) 
    cs.push({name: cityName, coords: coord});
  localStorage['cities'] = JSON.stringify(cs);
}

const updateHistory = () => {
  let cs = getCities();
  cities.innerHTML = '';
  for (c of cs) {
    let b = document.createElement('button');
    b.textContent = c.name;
    b.classList.add('cityBtn');
    cities.appendChild(b);
  }
}

updateHistory();

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

cities.addEventListener('click', ev => {
  ev.preventDefault();
  if (ev.target.classList.contains('cityBtn')) {
    let cs = getCities();
    let d = cs.find(c => c.name === ev.target.textContent);
    forecast(d.coords.lat, d.coords.lon
    ).then(blob => {
      let c = blob.current;
      displayCurrentWeather(d.name, Date(), c.temp, c.wind_speed, c.humidity, c.uvi);
    })
  }
})

searchForm.querySelector('button').addEventListener('click', (ev) => {
  ev.preventDefault();
  console.log(this);
  let sTerm = searchForm.querySelector('input').value;
  console.log(`search term: ${sTerm}`);
  weatherCall(sTerm)
  .then(json => {
    pushCity(json.name, json.coord);
    updateHistory();
    return forecast(json.coord.lat, json.coord.lon)
  }).then(blob => {
    let c = blob.current;
    displayCurrentWeather(sTerm, Date(), c.temp, c.wind_speed, c.humidity, c.uvi);
  })
 });
