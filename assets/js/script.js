var APIKey = "5e5c2d650b810bd48ba1f15cd93707d2"

var userFormEl = document.querySelector('#user-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weather-container');


var formSubmitHandler = function (event) {
  event.preventDefault();

  var city = cityInputEl.value.trim();

  if (city) {
    getLocation(city);

    weatherContainerEl.textContent = '';
    cityInputEl.value = '';
  } else {
    alert('Please enter a City');
  }
};


var buttonClickHandler = function (event) {
  var city = event.target.getAttribute('data-city');

  if (city) {
    getLocation(city);
  
    weatherContainerEl.textContent = '';
  }
  };


var getLocation = function (city) {
  var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&lat=&lon=&appid=" + APIKey;

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayCity(city);
          console.log(data);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect');
    });
};


var displayCity = function (city) {

var cityEl = document.createElement('h3');
cityEl.textContent = city;

weatherContainerEl.appendChild(cityEl);

}

userFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);