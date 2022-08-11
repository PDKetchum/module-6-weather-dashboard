var $todayDate = $("#today-date");
var $searchButton = $("#search-button");
var $searchInput = $("#search-input");
var $fiveDayForcastBody = $("#five-day-forcast-body");
var $cityName = $("#city-name");
var city;

var dateUnix = moment().unix();
var date = moment().format("MMMM Do, YYYY");
var lat;
var lon;

function searchCoordinates() {
  city = $searchInput.val();
  var url =
    "https://api.openweathermap.org/geo/1.0/direct?q=$" +
    city +
    "&limit=1&appid=56d93d0b8d7b2c21a7f8fd90a7c509fc";
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
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
      var temp = data.current.temp;
      var wind = data.current.wind_speed;
      var humidity = data.current.humidity;
      $("#today-temp").text("Today's temperature: " + temp + " °F");
      $("#today-wind").text("Wind: " + wind + " mph");
      $("#today-humidity").text("Humidity: " + humidity + " %");

      for (var i = 0; i < 5; i++) {
        var temp = data.daily[i].temp.day;
        var wind = data.daily[i].wind_speed;
        var humidity = data.daily[i].humidity;

        var $dayCardEl = $("<div>");
        var $dayDateEl = $("<h4>");
        $dayDateEl.text(
          moment()
            .add(1 + i, "days")
            .format("dddd MMMM Do, YYYY")
        );
        var $dayTempEl = $("<p>");
        $dayTempEl.text("temperature: " + temp + " °F");
        var $dayWindEl = $("<p>");
        $dayWindEl.text("Wind: " + wind + " mph");
        var $dayHumidityEl = $("<p>");
        $dayHumidityEl.text("Humidity: " + humidity + " %");

        $dayCardEl.append($dayDateEl, $dayTempEl, $dayWindEl, $dayHumidityEl);
        $fiveDayForcastBody.append($dayCardEl);
      }
    });
}

$searchButton.on("click", print);

function print() {
  printToday();
  searchCoordinates();
}

function printToday() {
  $todayDate.text(date);
  $cityName.text($searchInput.val().toUpperCase());
}
