async function fetchWeatherData(city) {
    showSpinner();
    try {
        const apiKey = CONFIG.OPENWEATHER_API_KEY;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        
        if (data.cod === '200') {
            return processWeatherData(data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);
        throw error;
    } finally {
        hideSpinner();
    }
}

async function fetchWeatherDataByCoords(lat, lon) {
    showSpinner();
    try {
        const apiKey = CONFIG.OPENWEATHER_API_KEY;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        
        if (data.cod === '200') {
            return processWeatherData(data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);
        throw error;
    } finally {
        hideSpinner();
    }
}

function processWeatherData(data) {
    const weatherData = data.list.map(item => ({
        date: new Date(item.dt * 1000),
        temperature: item.main.temp,
        condition: item.weather[0].main,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        icon: item.weather[0].icon
    }));

    return {
        cityName: data.city.name,
        weatherData: weatherData
    };
}