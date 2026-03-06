const API_KEY = "d96a303461300614f408acabd0ed7e8e";

const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_API = "https://api.openweathermap.org/data/2.5/forecast";


function WeatherApp(){

this.cityInput = document.getElementById("city-input");
this.searchBtn = document.getElementById("search-btn");
this.weatherDisplay = document.getElementById("weather-display");
this.forecastContainer = document.getElementById("forecast-container");

this.init();

}


WeatherApp.prototype.init = function(){

this.showWelcome();

this.searchBtn.addEventListener(
"click",
this.handleSearch.bind(this)
);

};


WeatherApp.prototype.showWelcome = function(){

this.weatherDisplay.innerHTML =
"<p class='loading'>Enter a city to get weather information</p>";

this.forecastContainer.innerHTML = "";

};


WeatherApp.prototype.handleSearch = function(){

const city = this.cityInput.value.trim();

if(!city){
this.showError("Please enter a city name");
return;
}

this.getWeather(city);

};


WeatherApp.prototype.showLoading = function(){

this.weatherDisplay.innerHTML = `
<div>
<div class="spinner"></div>
<p class="loading">Loading weather...</p>
</div>
`;

this.forecastContainer.innerHTML = "";

};


WeatherApp.prototype.showError = function(message){

this.weatherDisplay.innerHTML = `
<div class="error-message">
⚠️ ${message}
</div>
`;

this.forecastContainer.innerHTML = "";

};


WeatherApp.prototype.getWeather = async function(city){

this.showLoading();

const weatherUrl =
`${WEATHER_API}?q=${city}&appid=${API_KEY}&units=metric`;

const forecastUrl =
`${FORECAST_API}?q=${city}&appid=${API_KEY}&units=metric`;

try{

const [weatherResponse, forecastResponse] =
await Promise.all([
axios.get(weatherUrl),
axios.get(forecastUrl)
]);

const weatherData = weatherResponse.data;
const forecastData = forecastResponse.data;

this.displayWeather(weatherData);

const processedForecast =
this.processForecastData(forecastData.list);

this.displayForecast(processedForecast);

}catch(error){

if(error.response && error.response.status === 404){
this.showError("City not found. Please check spelling.");
}else{
this.showError("Something went wrong. Please try again.");
}

}

};


WeatherApp.prototype.displayWeather = function(data){

const cityName = data.name;
const temperature = Math.round(data.main.temp);
const description = data.weather[0].description;
const icon = data.weather[0].icon;

const iconUrl =
`https://openweathermap.org/img/wn/${icon}@2x.png`;

const weatherHTML = `
<div class="weather-info">
<h2 class="city-name">${cityName}</h2>
<img src="${iconUrl}" class="weather-icon">
<div class="temperature">${temperature}°C</div>
<p class="description">${description}</p>
</div>
`;

this.weatherDisplay.innerHTML = weatherHTML;

};


WeatherApp.prototype.processForecastData = function(list){

const daily = list.filter(item =>
item.dt_txt.includes("12:00:00")
);

return daily.slice(0,5);

};


WeatherApp.prototype.displayForecast = function(days){

this.forecastContainer.innerHTML = "";

days.forEach(day => {

const date = new Date(day.dt_txt);

const dayName =
date.toLocaleDateString("en-US",{weekday:"short"});

const temp = Math.round(day.main.temp);

const icon = day.weather[0].icon;

const description = day.weather[0].description;

const iconUrl =
`https://openweathermap.org/img/wn/${icon}@2x.png`;

const card = `
<div class="forecast-card">

<div class="forecast-day">${dayName}</div>

<img src="${iconUrl}" class="forecast-icon">

<div class="forecast-temp">${temp}°C</div>

<div>${description}</div>

</div>
`;

this.forecastContainer.innerHTML += card;

});

};


const app = new WeatherApp();