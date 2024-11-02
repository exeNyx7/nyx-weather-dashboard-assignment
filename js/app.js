let weatherData = [];
let isCelsius = true;
let lastSearchedCity = '';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const tempToggleBtn = document.getElementById('tempToggleBtn');
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profile-modal');
const closeProfileBtn = document.getElementById('close-profile-btn');
const chatButton = document.getElementById('chatButton');
const chatModal = document.getElementById('chat-modal');
const closeChatBtn = document.getElementById('close-chat-btn');
const filterDropdown = document.getElementById('filterDropdown');
const cityName = document.getElementById('city-name');
const spinner = document.getElementById('loading-spinner');

// Chart instances
let temperatureChart, conditionsChart, forecastChart;

// Event Listeners
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city && city !== lastSearchedCity) {
            lastSearchedCity = city;
            fetchWeatherData(city).then(updateUI).catch(handleError);
        }
    });
}

if (locationBtn) {
    locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherDataByCoords(lat, lon).then(updateUI).catch(handleError);
            }, () => {
                showError('Unable to retrieve your location');
            });
        } else {
            showError('Geolocation is not supported by your browser');
        }
    });
}

if (tempToggleBtn) {
    tempToggleBtn.addEventListener('click', () => {
        isCelsius = !isCelsius;
        updateTemperatureDisplay();
    });
}

if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        if (profileModal) {
            profileModal.style.display = 'block';
        }
    });
}

if (closeProfileBtn) {
    closeProfileBtn.addEventListener('click', () => {
        if (profileModal) {
            profileModal.style.display = 'none';
        }
    });
}

if (chatButton) {
    chatButton.addEventListener('click', () => {
        if (chatModal) {
            chatModal.style.display = 'block';
        }
    });
}

if (closeChatBtn) {
    closeChatBtn.addEventListener('click', () => {
        if (chatModal) {
            chatModal.style.display = 'none';
        }
    });
}

if (filterDropdown) {
    filterDropdown.addEventListener('change', (event) => {
        const filterValue = event.target.value;
        let filteredData = [...weatherData];

        switch(filterValue) {
            case 'ascTemp':
                filteredData.sort((a, b) => a.temperature - b.temperature);
                break;
            case 'descTemp':
                filteredData.sort((a, b) => b.temperature - a.temperature);
                break;
            case 'rainOnly':
                filteredData = filteredData.filter(day => day.condition.toLowerCase().includes('rain'));
                break;
            case 'highestTemp':
                const highestTemp = filteredData.reduce((max, day) => day.temperature > max ? day.temperature : max, filteredData[0].temperature);
                filteredData = filteredData.filter(day => day.temperature === highestTemp);
                break;
        }

        updateForecastTable(filteredData.slice(0, 10));
    });
}

function updateUI(data) {
    weatherData = data.weatherData;
    if (cityName) {
        updateCityName(data.cityName);
    }
    updateCurrentWeather(weatherData[0]);
    updateCharts();
    updateForecastTable(weatherData.slice(0, 10));
    updateBackgroundColor(weatherData[0].temperature);
}

function updateCityName(name) {
    if (cityName) {
        cityName.textContent = name;
    }
}

function updateCurrentWeather(data) {
    const temperatureElement = document.querySelector('.temperature');
    const descriptionElement = document.querySelector('.description');
    const detailsElement = document.querySelector('.details');

    if (temperatureElement) {
        temperatureElement.textContent = `${formatTemperature(data.temperature)}`;
    }
    if (descriptionElement) {
        descriptionElement.textContent = data.condition;
    }
    if (detailsElement) {
        detailsElement.innerHTML = `
            <span>Humidity: ${data.humidity}%</span>
            <span>Wind: ${data.windSpeed} m/s</span>
        `;
    }
}

function updateCharts() {
    const ctx1 = document.getElementById('temperatureChart');
    const ctx2 = document.getElementById('conditionsChart');
    const ctx3 = document.getElementById('forecastChart');

    if (!ctx1 && !ctx2 && !ctx3) return;

    if (temperatureChart) temperatureChart.destroy();
    if (conditionsChart) conditionsChart.destroy();
    if (forecastChart) forecastChart.destroy();

    const next5Days = weatherData.slice(0, 5);

    if (ctx1) {
        temperatureChart = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: next5Days.map(day => day.date.toLocaleDateString()),
                datasets: [{
                    label: 'Temperature',
                    data: next5Days.map(day => day.temperature),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    }
                }
            }
        });
    }

    if (ctx2) {
        const conditionCounts = next5Days.reduce((acc, day) => {
            acc[day.condition] = (acc[day.condition] || 0) + 1;
            return acc;
        }, {});

        conditionsChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: Object.keys(conditionCounts),
                datasets: [{
                    data: Object.values(conditionCounts),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(153, 102, 255, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Weather Conditions Distribution'
                    }
                }
            }
        });
    }

    if (ctx3) {
        forecastChart = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: next5Days.map(day => day.date.toLocaleDateString()),
                datasets: [{
                    label: 'Temperature',
                    data: next5Days.map(day => day.temperature),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    }
                }
            }
        });
    }
}

function updateForecastTable(data) {
    const tableBody = document.getElementById('forecastTableBody');
    if (tableBody) {
        tableBody.innerHTML = '';
        data.forEach(day => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${day.date.toLocaleDateString()}</td>
                <td>${formatTemperature(day.temperature)}</td>
                <td>
                    <img src="http://openweathermap.org/img/w/${day.icon}.png" alt="${day.condition}" class="weather-icon">
                    ${day.condition}
                </td>
                <td>${day.humidity}%</td>
                <td>${day.windSpeed} m/s</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

function updateTemperatureDisplay() {
    updateCurrentWeather(weatherData[0]);
    updateCharts();
    updateForecastTable(weatherData.slice(0, 10));
}

function formatTemperature(temp) {
    if (isCelsius) {
        return `${temp.toFixed(1)}°C`;
    } else {
        const fahrenheit = (temp * 9/5) + 32;
        return `${fahrenheit.toFixed(1)}°F`;
    }
}

function showSpinner() {
    if (spinner) {
        spinner.style.display = 'block';
    }
}

function hideSpinner() {
    if (spinner) {
        spinner.style.display = 'none';
    }
}

function handleError(error) {
    hideSpinner();
    showError(error.message);
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

function updateBackgroundColor(temperature) {
    const body = document.body;
    let gradient;

    if (temperature <= 30) {
        // Cool gradient for temperatures below or equal to 30°C
        const blueIntensity = Math.max(0, (30 - temperature) / 30);
        gradient = `linear-gradient(135deg, 
            rgba(0, 63, 252, ${blueIntensity * 0.7}) 0%, 
            rgba(135, 206, 235, ${blueIntensity * 0.5}) 50%, 
            rgba(224, 255, 255, ${blueIntensity * 0.3}) 100%)`;
    } else {
        // Warm gradient for temperatures above 30°C
        const redIntensity = Math.min(1, (temperature - 30) / 20);
        gradient = `linear-gradient(135deg, 
            rgba(255, 0, 0, ${redIntensity * 0.7}) 0%, 
            rgba(255, 165, 0, ${redIntensity * 0.5}) 50%, 
            rgba(255, 255, 0, ${redIntensity * 0.3}) 100%)`;
    }

    body.style.backgroundImage = gradient;
    body.style.backgroundAttachment = 'fixed';
    body.style.backgroundSize = 'cover';
}



function getChatbotResponse(userInput) {
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes("highest temperature")) {
        const maxTemp = Math.max(...weatherData.map(data => data.temperature));
        return `The highest temperature in the forecast is ${formatTemperature(maxTemp)}.`;
    } else if (lowerInput.includes("lowest temperature")) {
        const minTemp = Math.min(...weatherData.map(data => data.temperature));
        return `The lowest temperature in the forecast is ${formatTemperature(minTemp)}.`;
    } else if (lowerInput.includes("average temperature")) {
        const avgTemp = weatherData.reduce((sum, data) => sum + data.temperature, 0) / weatherData.length;
        return `The average temperature in the forecast is ${formatTemperature(avgTemp)}.`;
    } else if (lowerInput.includes("weather in")) {
        const cityMatch = userInput.match(/weather in (.+?)( on |$)/i);
        const dateMatch = userInput.match(/on (.+)$/i);
        
        if (cityMatch) {
            const city = cityMatch[1];
            const date = dateMatch ? new Date(dateMatch[1]) : new Date();
            
            // Fetch weather data for the specified city
            return fetchWeatherData(city)
                .then(data => {
                    const weatherForDate = data.weatherData.find(w => w.date.toDateString() === date.toDateString());
                    if (weatherForDate) {
                        return `The weather in ${city} on ${date.toDateString()} is ${weatherForDate.condition} with a temperature of ${formatTemperature(weatherForDate.temperature)}.`;
                    } else {
                        return `I'm sorry, I don't have weather data for ${city} on ${date.toDateString()}.`;
                    }
                })
                .catch(error => {
                    return `I'm sorry, I couldn't fetch weather data for ${city}. ${error.message}`;
                });
        }
    } else if (lowerInput.includes("hi") || lowerInput.includes("hello") || lowerInput.includes("greetings")) {
        return `Greetings! How may I assist you with the weather information?`;
    } else {
        return "I'm sorry, I can only answer questions about the highest, lowest, and average temperatures in the forecast, or provide weather information for specific cities and dates.";
    }
}

function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    const chatLog = document.getElementById('chat-log');
    
    if (userInput === '') {
        alert('Please enter a message.');
        return;
    }
    
    chatLog.innerHTML += `
    <div class="user-message">${userInput}</div>`;
    
    chatLog.innerHTML += `
    <div id="loading-indicator" class="bot-message">...</div>`;
    
    chatLog.scrollTop = chatLog.scrollHeight;
    
    const response = getChatbotResponse(userInput);
    if (response instanceof Promise) {
        response.then(message => {
            updateChatWithResponse(message);
        });
    } else {
        setTimeout(() => {
            updateChatWithResponse(response);
        }, 1000);
    }
    
    document.getElementById('user-input').value = '';
}

function updateChatWithResponse(message) {
    const chatLog = document.getElementById('chat-log');
    const loadingElement = document.getElementById('loading-indicator');
    loadingElement.remove();
    
    chatLog.innerHTML += `
    <div class="bot-message">${message}</div>`;
    chatLog.scrollTop = chatLog.scrollHeight;
}




// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    if (cityInput && cityInput.value.trim()) {
        lastSearchedCity = cityInput.value.trim();
        fetchWeatherData(lastSearchedCity).then(updateUI).catch(handleError);
    }
});

function updateUI(data) {
    weatherData = data.weatherData;
    if (cityName) {
        updateCityName(data.cityName);
    }
    updateCurrentWeather(weatherData[0]);
    updateCharts();
    updateForecastTable(weatherData.slice(0, 10));
    updateBackgroundColor(weatherData[0].temperature); 
}