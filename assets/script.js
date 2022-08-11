var $cityName = $("#city-name");
var $todayDate = $("#today-date");
var $todayInfo = $("#today-info");
var $searchInput = $("#search-input");
var $searchButton = $("#search-button");

var dateUnix = moment().unix();
var date = moment().format("MMMM Do, YYYY");
var lat;
var lon;
var temp;
var wind;
var humidity;
console.log($searchButton);

function searchCoordinates() {
  var city = $searchInput.val();
  var url =
    "https://api.openweathermap.org/geo/1.0/direct?q=$" +
    city +
    "&limit=1&appid=56d93d0b8d7b2c21a7f8fd90a7c509fc";
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      lon = data[0].lon;
      lat = data[0].lat;
      searchWeather();
    });
}

function searchWeather() {
  var url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&dt=" +
    dateUnix +
    "&units=imperial&exclude=minutely,hourly,alerts&appid=56d93d0b8d7b2c21a7f8fd90a7c509fc";

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      temp = data.current.temp;
      wind = data.current.wind_speed;
      humidity = data.current.humidity;
      $("#today-temp").text("Today's temperature: " + temp);
    });
}

$searchButton.on("click", print);

function print() {
  printToday();
  searchCoordinates();
}

function printToday() {
  $todayDate.text(date);
}

// "lat": 44.9772995,
// "lon": -93.2654692,
