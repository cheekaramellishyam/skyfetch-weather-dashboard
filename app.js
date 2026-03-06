const API_KEY = "d96a303461300614f408acabd0ed7e8e";

const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_API = "https://api.openweathermap.org/data/2.5/forecast";

function WeatherApp(){

this.cityInput = document.getElementById("city-input");
this.searchBtn = document.getElementById("search-btn");
this.weatherDisplay = document.getElementById("weather-display");
this.forecastContainer = document.getElementById("forecast-container");

this.recentContainer = document.getElementById("recent-container");
this.clearBtn = document.getElementById("clear-btn");

this.recentSearches = [];

this.init();
}

WeatherApp.prototype.init = function(){

this.loadRecentSearches();
this.loadLastCity();

this.searchBtn.addEventListener(
"click",
this.handleSearch.bind(this)
);

this.clearBtn.addEventListener(
"click",
this.clearHistory.bind(this)
);

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

<div class="error-message">⚠️ ${message}</div>
`;

};

WeatherApp.prototype.getWeather = async function(city){

this.showLoading();

const weatherUrl =
`${WEATHER_API}?q=${city}&appid=${API_KEY}&units=metric`;

const forecastUrl =
`${FORECAST_API}?q=${city}&appid=${API_KEY}&units=metric`;

try{

const [weatherRes, forecastRes] = await Promise.all([
axios.get(weatherUrl),
axios.get(forecastUrl)
]);

this.displayWeather(weatherRes.data);

const forecast =
this.processForecastData(forecastRes.data.list);

this.displayForecast(forecast);

this.saveRecentSearch(city);

localStorage.setItem("lastCity", city);

}catch(error){

if(error.response && error.response.status === 404){
this.showError("City not found");
}else{
this.showError("Something went wrong");
}

}

};

WeatherApp.prototype.displayWeather = function(data){

const city = data.name;
const temp = Math.round(data.main.temp);
const desc = data.weather[0].description;
const icon = data.weather[0].icon;

const iconUrl =
`https://openweathermap.org/img/wn/${icon}@2x.png`;

this.weatherDisplay.innerHTML = `

<div class="weather-info">
<h2 class="city-name">${city}</h2>
<img src="${iconUrl}" class="weather-icon">
<div class="temperature">${temp}°C</div>
<p>${desc}</p>
</div>
`;

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

const iconUrl =
`https://openweathermap.org/img/wn/${icon}@2x.png`;

this.forecastContainer.innerHTML += `

<div class="forecast-card">
<div>${dayName}</div>
<img src="${iconUrl}" class="forecast-icon">
<div>${temp}°C</div>
</div>
`;

});

};

WeatherApp.prototype.loadRecentSearches = function(){

const data = localStorage.getItem("recentSearches");

if(data){
this.recentSearches = JSON.parse(data);
this.displayRecentSearches();
}

};

WeatherApp.prototype.saveRecentSearch = function(city){

city =
city.charAt(0).toUpperCase() +
city.slice(1).toLowerCase();

this.recentSearches =
this.recentSearches.filter(c => c !== city);

this.recentSearches.unshift(city);

if(this.recentSearches.length > 5){
this.recentSearches.pop();
}

localStorage.setItem(
"recentSearches",
JSON.stringify(this.recentSearches)
);

this.displayRecentSearches();

};

WeatherApp.prototype.displayRecentSearches = function(){

this.recentContainer.innerHTML = "";

this.recentSearches.forEach(function(city){

const btn = document.createElement("button");

btn.textContent = city;

btn.className = "recent-btn";

btn.addEventListener(
"click",
function(){
this.getWeather(city);
}.bind(this)
);

this.recentContainer.appendChild(btn);

}.bind(this));

};

WeatherApp.prototype.loadLastCity = function(){

const lastCity =
localStorage.getItem("lastCity");

if(lastCity){
this.getWeather(lastCity);
}

};

WeatherApp.prototype.clearHistory = function(){

localStorage.removeItem("recentSearches");
localStorage.removeItem("lastCity");

this.recentSearches = [];

this.displayRecentSearches();

};

const app = new WeatherApp();
