var API_KEY = "efd0a521bf563cfcccef7a25d96e2a18";
var input = $('#city-search');
var submitButton = $('#search-button');
var mainContainer = $('#main-container');
var dayContainer = $('#5day-container');
var storageContainer = $('#previous-search-container');

submitButton.on('click', submitButtonClicked);
fetchFromStorage();

function fetchFromStorage() {
    storageContainer.empty();
    var storage = JSON.parse(localStorage.getItem("cities"));
    for(var i = 0; i < storage.length; i++) {
        var button = $('<button>');
        button.attr('type', 'submit');
        button.attr('class', 'btn btn-primary btn-lg btn-block');
        button.text(`${storage[i]}`);
        button.on('click', {city: storage[i]} ,(e) => {
            e.preventDefault();
            clearElements();
            getWeather(e.data.city);
        });
        storageContainer.append(button);
    }
}

function addToStorage(city) {
    var storage = JSON.parse(localStorage.getItem("cities"));
    if(storage && storage.length >= 8) {
        storage.shift();
        storage.push(city);
    }
    if(storage && storage.length < 8) {
        storage.push(city);
    }
    if(!storage) {
        storage = [];
        storage.push(city);
    }
    localStorage.setItem("cities", JSON.stringify(storage));
    fetchFromStorage();
}

function submitButtonClicked(event) {
    event.preventDefault();
    clearElements();
    getWeather(input.val());
    addToStorage(input.val());
}

function clearElements() {
    var headerChildren = mainContainer.find("*");
    if(headerChildren.length > 0) {
        mainContainer.empty();
    }

    var dayChildren = dayContainer.find("*");
    if(dayChildren.length > 0) {
        dayContainer.empty();
    }
}


function getWeather(input) {
    var coords = {};
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${input}&appid=${API_KEY}`)
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
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${API_KEY}`)
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log(data);
        let forecasts = [];
        let previousDay = -1;
        var i = 0;
        while(forecasts.length < 6) {
            var date = new Date(data.list[i].dt * 1000);
            console.log(date);
            if(previousDay != date.getUTCDate()) {
                forecasts.push(data.list[i]);
                previousDay = date.getUTCDate();
                console.log(forecasts);
            }
            i++;
        }
        createElements(forecasts, data.city.name);
    })
    .catch((e) => {
        console.log(e);
    })
}

function createElements(forecasts, city) {
    var header = $('<h2>');
    header.attr('class', 'd-inline');
    header.text(`${city} (${convertTime(forecasts[0].dt)})`);

    var headerIcon = $('<img>');
    headerIcon.attr('class', 'd-inline');
    headerIcon.attr('src', `https://openweathermap.org/img/wn/${forecasts[0].weather[0].icon}@2x.png`);

    var headerTemp = $('<h5>');
    var headerWind = $('<h5>');
    var headerHumidity = $('<h5>');

    headerTemp.text(`Temp: ${forecasts[0].main.temp} \xB0 F`);
    headerWind.text(`Wind: ${forecasts[0].wind.speed} MPH`);
    headerHumidity.text(`Humidity: ${forecasts[0].main.humidity}%`);

    mainContainer.append(header);
    mainContainer.append(headerIcon);
    mainContainer.append(headerTemp);
    mainContainer.append(headerWind);
    mainContainer.append(headerHumidity);

    for(var i = 1; i < 6; i++) {
        var container = $('<div>');
        container.attr('class', 'col bg-info m-2 text-light');

        var title = $('<h3>');
        title.attr('class', 'd-inline');
        title.text(convertTime(forecasts[i].dt));

        var icon = $('<img>');
        icon.attr('class', 'd-inline');
        icon.attr('src', `https://openweathermap.org/img/wn/${forecasts[i].weather[0].icon}.png`);

        var temp = $('<h5>');
        var wind = $('<h5>');
        var humidity = $('<h5>');

        temp.text(`Temp: ${forecasts[i].main.temp} \xB0 F`);
        wind.text(`Wind: ${forecasts[i].wind.speed} MPH`);
        humidity.text(`Humidity: ${forecasts[i].main.humidity}%`);

        container.append(title).append(icon).append(temp).append(wind).append(humidity);
        dayContainer.append(container);
    }
}

function convertTime(unix) {
    var date = new Date(unix * 1000);
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`
}


