var APIKey = "5e5c2d650b810bd48ba1f15cd93707d2"
var queryUrl = "https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=" + APIKey;

var city = 


fetch(queryUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });