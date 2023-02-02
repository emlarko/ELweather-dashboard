var APIKey = "5e5c2d650b810bd48ba1f15cd93707d2"

var userFormEl = document.querySelector('#user-form');
var historyButtonsEl = document.querySelector('#history-buttons');
var cityInputEl = document.querySelector('#city');
var todayWeather = document.querySelector('#today-weather');
var forecastContent = document.querySelector('#forecast-content');
var forecastTitle = document.querySelector('#forecast-title');

var saveCity = function(location) {
  var previousSaveHistory = JSON.parse(localStorage.getItem('save-history')) || [];
  previousSaveHistory.push(location);
  localStorage.setItem('save-history', JSON.stringify(previousSaveHistory));
};

var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = cityInputEl.value.trim();
  

  if (city) {
    getLocation(city);
    saveCity(city);

    todayWeather.textContent = '';
    cityInputEl.value = '';
  } else {
    alert('Please enter a City');
  }
};


var getLocation = function (city) {
  var locationUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey;
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
          localStorage.setItem('location', location)
          localStorage.setItem('lat', lat);
          localStorage.setItem('lon', lon);
          getCurrentWeather();
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
   
var getCurrentWeather = function (lat, lon) {
  lat = localStorage.getItem('lat');
  lon = localStorage.getItem('lon');
  var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + APIKey;
  
  fetch(weatherUrl)
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log("current", data);

        date = data.dt_txt;
        var today = dayjs(date).format('DD / MM / YY'); 
        
        var location = localStorage.getItem('location');

          var temp = data.main.temp;
          console.log('current temp', temp);
        var wind = data.wind.speed;
        var humidity = data.main.humidity;
      
        var weatherCard = document.createElement('div');
        weatherCard.classList.add('card', 'width-12rem');
      
        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        weatherCard.append(cardBody);
      
        var cityEl = document.createElement('h3');
        cityEl.textContent = location;   
      
        var dateEl = document.createElement('h3');
        dateEl.textContent = today;
      
        var iconEl = document.createElement('i');
      
        if (temp[0] > 20) {
          iconEl.classList.add("fa-solid", "fa-sun");
        }
        else {
          iconEl.classList.add("fa-solid", "fa-cloud");
        }
      
        var bodyContentEl = document.createElement('p');
        bodyContentEl.innerHTML =
          '<strong>Temp:</strong> ' + temp + ' °C<br/>';
      
        bodyContentEl.innerHTML +=
          '<strong>Wind:</strong> ' + wind + ' m/s<br/>';
      
        bodyContentEl.innerHTML +=
          '<strong>Humidity:</strong> ' + humidity + ' %<br/>';
      
        cardBody.append(cityEl, dateEl, iconEl, bodyContentEl);
      
        todayWeather.append(weatherCard);

      })
    }
  })
};

var getWeather = function (lat, lon) {
  lat = localStorage.getItem('lat');
  lon = localStorage.getItem('lon');
  var weatherUrl =  'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + "&units=metric&appid=" + APIKey;
 
  fetch(weatherUrl)
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {

          var date = [];
          var temp = [];
          var wind = [];
          var humidity = [];

        for (let i = 0; i < data.list.length; i++){
        console.log(data);

        dateData = data.list[i].dt_txt;

          if (dateData.endsWith("12:00:00")) {
      
          date.push(dateData);
          localStorage.setItem('date', JSON.stringify(date));

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
        }
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

var saveHistory = function() {
  var history = JSON.parse(localStorage.getItem('save-history'));
  historyButtonsEl.textContent = "";
  for (let i = 0; i < history.length; i++) {
    const cityName = history[i];
    
  
  var cityButton = document.createElement('button');
  var buttonText = document.createTextNode(cityName);

  cityButton.setAttribute('value', value = cityName);
  cityButton.appendChild(buttonText);
  cityButton.classList.add('btn', 'btn-secondary')

  historyButtonsEl.appendChild(cityButton);
}
}

var buttonClickHandler = function (event) {
  var city = event.target.getAttribute('value','button');
 
  getLocation(city);
  todayWeather.textContent = '';
};

var displayForecast = function() {
  var temp = JSON.parse(localStorage.getItem('temp')) || [];
  var wind = JSON.parse(localStorage.getItem('wind')) || [];
  var humidity = JSON.parse(localStorage.getItem('humidity')) || [];
  var date = JSON.parse(localStorage.getItem('date')) || [];

  var titleEl = document.createElement('h2');
  titleEl.textContent = "5-Day Forecast:";  
  forecastContent.textContent = "";
  forecastTitle.textContent = "";
  forecastTitle.appendChild(titleEl);

  for (let i = 0; i < 5; i++) {

    var weatherCard = document.createElement('div');
    weatherCard.classList.add('card', 'bg-dark', 'text-light', 'mb-3', 'p-2', 'width-12rem');

    var cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    weatherCard.append(cardBody);
  
      var forecastDate = dayjs(date[i]).format('DD / MM / YY'); 
      var dateEl = document.createElement('h4');
      dateEl.innerHTML = forecastDate;
   
    var iconEl = document.createElement('i');

    if (temp[i] > 20) {
      iconEl.classList.add("fa-solid", "fa-sun");
    }
    else {
      iconEl.classList.add("fa-solid", "fa-cloud");
    }
  
    var bodyContentEl = document.createElement('p');
    bodyContentEl.innerHTML =
      '<strong>Temp:</strong> ' + temp[i] + ' °C<br/>';

    bodyContentEl.innerHTML +=
      '<strong>Wind:</strong> ' + wind[i] + ' m/s<br/>';

      bodyContentEl.innerHTML +=
      '<strong>Humidity:</strong> ' + humidity[i] + ' %<br/>';

      cardBody.append(dateEl, iconEl, bodyContentEl);

      forecastContent.append(weatherCard);
  }
}

userFormEl.addEventListener('submit', formSubmitHandler);
historyButtonsEl.addEventListener('click', buttonClickHandler);
saveHistory();