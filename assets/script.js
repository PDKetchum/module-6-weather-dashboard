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

// API call to fetch coordinate by passing through a city name
function searchCoordinates(city) {
  var url =
    "https://api.openweathermap.org/geo/1.0/direct?q=$" +
    city +
    "&limit=1&appid=56d93d0b8d7b2c21a7f8fd90a7c509fc";
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
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
      // If city name is invalid, alert
      alert(error);
    });
}

// API call to fetch weather information based on coordinates
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
      // Show hidden html
      $(".search-results").attr("class", "show");
      $(".search-history").attr("class", "show");
      $todayDate.text(date);
      // Retrieving data
      var temp = data.current.temp;
      var wind = data.current.wind_speed;
      var humidity = data.current.humidity;
      // Adding data text to HTML
      $("#today-temp").text("Current temperature: " + temp + " °F");
      $("#today-wind").text("Wind: " + wind + " mph");
      $("#today-humidity").text("Humidity: " + humidity + " %");
      // Clearing out HTML for previous searches
      $fiveDayForcastBody.empty();

      // For loop for next 5 day forcast
      for (var i = 0; i < 5; i++) {
        var temp = data.daily[i].temp.day;
        var wind = data.daily[i].wind_speed;
        var humidity = data.daily[i].humidity;
        // Create a div element for each one of the five days
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
        $dayTempEl.text("Day temperature: " + temp + " °F");
        var $dayWindEl = $("<p>");
        $dayWindEl.text("Wind: " + wind + " mph");
        var $dayHumidityEl = $("<p>");
        $dayHumidityEl.text("Humidity: " + humidity + " %");

        $dayCardEl.append($dayDateEl, $dayTempEl, $dayWindEl, $dayHumidityEl);
        // Append cards to HTML
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

// Add searched city names to local storage
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
  // Retrieve searched cities from local storage
  var searches = JSON.parse(localStorage.getItem("RecentSearches"));
  var counter = 0;
  // Display the last 5 searches by creating a counter and stopping when it reaches 5
  $("#recent-searches-list").empty();
  for (var i = searches.length - 1; i >= 0; i--) {
    if (counter === 5) {
      return;
    } else {
      // Create a button and append the city name from local storage as text
      var $searchedCityButton = $("<button>");
      $searchedCityButton.attr("class", "btn btn-outline-info");
      $searchedCityButton.text(searches[i]);

      $("#recent-searches-list").append($searchedCityButton);
      $searchedCityButton.on("click", openRecentSearch);
      counter++;
    }
  }
}

// When clicking a button of a recently searched city, pass the city name through the function below
function openRecentSearch(event) {
  var cityClicked = event.target.innerText;
  searchCoordinates(cityClicked);
  printCityName(cityClicked);
}
