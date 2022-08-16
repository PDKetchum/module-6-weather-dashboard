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
var $searchedCityButton;

function searchCoordinates(city) {
  console.log("search");
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
      if (data.length === 0) {
        throw new Error("Invalid city name");
      } else {
        lon = data[0].lon;
        lat = data[0].lat;

        searchWeather();
        printCityName(city.toUpperCase());
        saveRecentSearches(city);
        displayRecentSearches();
      }
    })
    .catch(function (error) {
      alert(error);
    });
}

function searchWeather() {
  console.log("Search weather");
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
      $(".search-results").attr("class", "show");
      $(".search-history").attr("class", "show");
      $todayDate.text(date);
      var temp = data.current.temp;
      var wind = data.current.wind_speed;
      var humidity = data.current.humidity;
      $("#today-temp").text("Current temperature: " + temp + " °F");
      $("#today-wind").text("Wind: " + wind + " mph");
      $("#today-humidity").text("Humidity: " + humidity + " %");
      $fiveDayForcastBody.empty();

      for (var i = 0; i < 5; i++) {
        var temp = data.daily[i].temp.day;
        var wind = data.daily[i].wind_speed;
        var humidity = data.daily[i].humidity;

        var $dayCardEl = $("<div>");
        $dayCardEl.attr(
          "class",
          "card border border-info rounded d-inline-flex p-3 "
        );
        var $dayDateEl = $("<h4>");
        $dayDateEl.text(
          moment()
            .add(1 + i, "days")
            .format("dddd MMMM Do, YYYY")
        );
        var $dayTempEl = $("<p>");
        $dayTempEl.text("Temperature: " + temp + " °F");
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
  searchCoordinates($searchInput.val());
}

function printCityName(city) {
  $cityName.text(city.toUpperCase());
}

function saveRecentSearches(city) {
  var recentSearch = city.toUpperCase();
  var recentSearches = localStorage.getItem("RecentSearches");
  if (recentSearches) {
    recentSearches = JSON.parse(recentSearches);
  } else {
    recentSearches = [];
  }

  recentSearches.push(recentSearch);

  localStorage.setItem("RecentSearches", JSON.stringify(recentSearches));
}

function displayRecentSearches() {
  var searches = JSON.parse(localStorage.getItem("RecentSearches"));
  var counter = 0;
  $("#recent-searches-list").empty();
  for (var i = searches.length - 1; i >= 0; i--) {
    if (counter === 5) {
      return;
    } else {
      var $searchedCityButton = $("<button>");
      $searchedCityButton.attr("class", "btn btn-outline-info");
      $searchedCityButton.text(searches[i]);

      $("#recent-searches-list").append($searchedCityButton);
      $searchedCityButton.on("click", openRecentSearch);
      counter++;
    }
  }
}

function openRecentSearch(event) {
  console.log(event);
  var cityClicked = event.target.innerText;
  console.log(cityClicked);
  searchCoordinates(cityClicked);
  printCityName(cityClicked);
}
