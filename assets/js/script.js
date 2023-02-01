var APIKey = "5e5c2d650b810bd48ba1f15cd93707d2"

var userFormEl = document.querySelector('#user-form');
var historyButtonsEl = document.querySelector('#history-buttons');
var cityInputEl = document.querySelector('#city');
var todayWeather = document.querySelector('#today-weather');
var forecastContent = document.querySelector('#forecast-content');

var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = cityInputEl.value.trim();

  if (city) {
    getLocation(city);

    todayWeather.textContent = '';
    cityInputEl.value = '';
  } else {
    alert('Please enter a City');
  }
};

var getLocation = function (city) {
  var locationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey;
  var location;
  var lat;
  var lon;
if (city) {
  fetch(locationUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log("location", data[0]["name"]);
          location = data[0].name;
          lat = data[0].lat;
          lon = data[0].lon;
          localStorage.setItem('location', location);
          localStorage.setItem('lat', JSON.stringify(lat));
          localStorage.setItem('lon', JSON.stringify(lon));
          getWeather();
          saveHistory();
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect');
    });
  }
   
var getWeather = function (lat, lon) {
  lat = localStorage.getItem('lat');
  lon = localStorage.getItem('lon');
  var weatherUrl =  'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + "&units=metric&appid=" + APIKey;
 
  fetch(weatherUrl)
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {

          var temp = [];
          var wind = [];
          var humidity = [];

        for (let i = 0; i < 7; i++){
        console.log(data);

        date = data.list[i].dt_txt;
        console.log(date);

        tempData = data.list[i].main.temp;
        console.log(tempData);
        temp.push(tempData);
        localStorage.setItem('temp', JSON.stringify(temp));

        windData = data.list[i].wind.speed;
        console.log(windData);
        wind.push(windData);
        localStorage.setItem('wind', JSON.stringify(wind));

        humidityData = data.list[i].main.humidity;
        console.log(humidityData);
        humidity.push(humidityData);
        localStorage.setItem('humidity', JSON.stringify(humidity));
   
        }
        displayWeather();
        displayForecast();
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  })
  .catch(function (error) {
    alert('Unable to connect');
  });
};  
}

var saveHistory = function(history) {
  var history = localStorage.getItem('location');
  var cityButton = document.createElement('button');
  var buttonText = document.createTextNode(history);

  cityButton.setAttribute('value', value = history);
  cityButton.appendChild(buttonText);
  cityButton.classList.add('btn', 'btn-secondary')

  historyButtonsEl.appendChild(cityButton);

}

var buttonClickHandler = function (event) {
  var city = event.target.getAttribute('value','button');
 
  getLocation(city);
  todayWeather.textContent = '';
};


var displayWeather = function() {
  var location = localStorage.getItem('location');
  var temp = JSON.parse(localStorage.getItem('temp'));
  var wind = JSON.parse(localStorage.getItem('wind'));
  var humidity = JSON.parse(localStorage.getItem('humidity'));

    var weatherCard = document.createElement('div');
    weatherCard.classList.add('card', 'width-12rem');

    var cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    weatherCard.append(cardBody);

    var cityEl = document.createElement('h3');
    cityEl.textContent = location;   

    var bodyContentEl = document.createElement('p');
    bodyContentEl.innerHTML =
      '<strong>Temp:</strong> ' + temp[0] + ' °C<br/>';

    bodyContentEl.innerHTML +=
      '<strong>Wind:</strong> ' + wind[0] + ' m/s<br/>';

      bodyContentEl.innerHTML +=
      '<strong>Humidity:</strong> ' + humidity[0] + ' %<br/>';

      cardBody.append(cityEl, bodyContentEl);

      todayWeather.append(weatherCard);

}

var displayForecast = function() {
  var temp = JSON.parse(localStorage.getItem('temp')) || [];
  var wind = JSON.parse(localStorage.getItem('wind')) || [];
  var humidity = JSON.parse(localStorage.getItem('humidity')) || [];

  var titleEl = document.createElement('h2');
  titleEl.textContent = "5-Day Forecast:";  

  forecastContent.append(titleEl);

  for (let i =1; i < 6; i++) {

    var weatherCard = document.createElement('div');
    weatherCard.classList.add('card', 'bg-dark', 'text-light', 'mb-3', 'p-2', 'width-12rem');

    var cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    weatherCard.append(cardBody);

    var bodyContentEl = document.createElement('p');
    bodyContentEl.innerHTML =
      '<strong>Temp:</strong> ' + temp[i] + ' °C<br/>';

    bodyContentEl.innerHTML +=
      '<strong>Wind:</strong> ' + wind[i] + ' m/s<br/>';

      bodyContentEl.innerHTML +=
      '<strong>Humidity:</strong> ' + humidity[i] + ' %<br/>';

      cardBody.append(bodyContentEl);

      forecastContent.append(weatherCard);
  }
}

userFormEl.addEventListener('submit', formSubmitHandler);
historyButtonsEl.addEventListener('click', buttonClickHandler);