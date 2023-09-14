const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const cityTimeElement = document.getElementById('city-time');

const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');

async function getCityTime(city) {
    const apiKey = 'aFdHlRsyqzbrAcBPQmfR'; // Replace with your actual API key
    const apiUrl = `https://timezoneapi.io/api/timezone/?search=${city}&token=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.meta.code === 404) {
            return null; // City not found
        }

        const cityTime = new Date(data.data.datetime);
        if (!isNaN(cityTime.getTime())) {
            return cityTime; // Check if the date is valid
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching city time:', error);
        return null;
    }
}

async function checkWeatherAndTime(city) {
    const apiKey = '9d71ef6c119ec6f8b199bb1bd4d8ece7';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
        // Fetch weather data
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod === '404') {
            location_not_found.style.display = 'flex';
            weather_body.style.display = 'none';
            return;
        }

        location_not_found.style.display = 'none';
        weather_body.style.display = 'flex';

        // Display weather data
        temperature.innerHTML = `${Math.round(weatherData.main.temp - 273.15)}°C`;
        description.innerHTML = `${weatherData.weather[0].description}`;
        humidity.innerHTML = `${weatherData.main.humidity}%`;
        wind_speed.innerHTML = `${weatherData.wind.speed}Km/H`;

        // Fetch city time
        const cityTime = await getCityTime(city);

        if (cityTime) {
            // Display the city time
            const formattedTime = cityTime.toLocaleTimeString();
            cityTimeElement.textContent = `City Time: ${formattedTime}`;
        } else {
            cityTimeElement.textContent = 'City Time: Not Available';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        location_not_found.style.display = 'flex';
        weather_body.style.display = 'none';
    }
}

searchBtn.addEventListener('click', () => {
    checkWeatherAndTime(inputBox.value);
});

