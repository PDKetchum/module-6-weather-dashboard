var $cityName = $("#city-name");
var $todayDate = $("#today-date");
var $todayInfo = $("#today-info");
var $searchInput = $("#search-input");
var $searchButton = $("#search-button");

var dateUnix = moment().unix();
var date = moment().format("MMMM Do, YYYY");
var lat = 44.970797;
var lon = -93.3315183;
console.log($searchButton);

function search(query, format) {
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
    });
}

search();

$searchButton.on("click", print);

function print() {
  $todayDate.text(date);
  $cityName.text($searchInput.val());
}
