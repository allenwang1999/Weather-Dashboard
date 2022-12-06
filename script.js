//remove later
var API_KEY = "efd0a521bf563cfcccef7a25d96e2a18";

var input = $('#city-search');
var submitButton = $('#search-button');

submitButton.on('click', submitButtonClicked);

function submitButtonClicked(event) {
    event.preventDefault();
    getWeather(input.val());
}

function getWeather(input) {
    var coords = {};
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input}&appid=${API_KEY}`)
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        coords.lat = data[0].lat;
        coords.lon = data[0].lon;
        getForecast(coords);
    })
    .catch((e) => {
        console.log(e);
    })
}

function getForecast(coords) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`)
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        let forecasts = [];
        for(let i = 0; i < 6; i++) {
            forecasts.push(data.list[i]);
        }
    })
    .catch((e) => {
        console.log(e);
    })
}


