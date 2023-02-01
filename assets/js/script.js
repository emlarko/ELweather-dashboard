var APIKey = "5e5c2d650b810bd48ba1f15cd93707d2"

var userFormEl = document.querySelector('#user-form');
var historyButtonsEl = document.querySelector('#history-buttons');
var cityInputEl = document.querySelector('#city');
var todayWeather = document.querySelector('#today-weather');


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
          displayCity();
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

        console.log(data);
        var temp = data.list[0].main.temp;
        console.log(temp);
        var wind = data.list[0].wind.speed;
        console.log(wind);
        var humidity = data.list[0].main.humidity;
        console.log(humidity);
      
        localStorage.setItem('temp', temp);
        localStorage.setItem('wind', wind);
        localStorage.setItem('humidity', humidity);
       
        displayWeather();
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
  console.log(cityButton.value);

  historyButtonsEl.appendChild(cityButton);

}

var buttonClickHandler = function (event) {
  var city = event.target.getAttribute('value','button');
 
  getLocation(city);
  todayWeather.textContent = '';
};

var displayCity = function (location) {
  var location = localStorage.getItem('location');

  var cityEl = document.createElement('h3');
  cityEl.textContent = location;

  todayWeather.appendChild(cityEl);

}

var displayWeather = function() {
  
  var temp = localStorage.getItem('temp');
  var wind = localStorage.getItem('wind');
  var humidity = localStorage.getItem('humidity');

  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');

  tempEl.innerHTML = "Temp: " + temp + "°C";
  windEl.innerHTML = "Wind: " + wind + "m/s";
  humidityEl.innerHTML = "Humidity: " + humidity + "%";

  todayWeather.appendChild(tempEl);
  todayWeather.appendChild(windEl);
  todayWeather.appendChild(humidityEl);

}


userFormEl.addEventListener('submit', formSubmitHandler);
historyButtonsEl.addEventListener('click', buttonClickHandler);