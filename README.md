# Weather Dashboard

This project is a Weather Dashboard application that provides current weather information and a 5-day forecast for a specified city. It uses the OpenWeatherMap API to fetch weather data.

## Live Demo

You can view the live demo of this project at: [https://nyx-weather.web.app/](https://nyx-weather.web.app/)

## Table of Contents

1. [Installation](#installation)
2. [File Structure](#file-structure)
3. [API Documentation](#api-documentation)
4. [Running the Project Locally](#running-the-project-locally)
5. [File Explanations](#file-explanations)
6. [Deployment](#deployment)

## Installation

1. Clone the repository to your local machine:

   ```
   git clone https://github.com/DawoodQamar2522/NyxWeatherWebpage-Final
   ```

2. Navigate to the project directory:

   ```
   cd NyxWeatherWebpage-Final
   ```

3. Open the project in your preferred code editor.

## File Structure

- index.html
- tables.html
- styles.css
- media-queries.css
- assests
- README.md
- js/
  - config.js
  - weather.js
  - app.js
  - gemini.js
  

## API Documentation

This project uses the OpenWeatherMap API. Here's an overview of the API calls used:

1. Current weather:
   `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}`
   or
   `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`

2. 5-day weather forecast:
   `api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`

Replace `{API key}` with your own API key generated from OpenWeatherMap.

Parameters:

- lat: latitude of the city
- lon: longitude of the city
- units: standard, metric, or imperial

The API returns data in JSON format by default.

## Running the Project Locally

1. Open the `config.js` file and replace `'YOUR_API_KEY'` with your actual OpenWeatherMap API key.

2. Open the `index.html` file in a web browser to view the main dashboard.

3. Click on the "Tables" link in the side menu to view the `tables.html` page.

4. Use the search input to enter a city name and click the search button or press Enter to fetch weather data.

5. Use the temperature toggle button to switch between Celsius and Fahrenheit.

6. Click on the profile button to view the profile modal.

7. On the tables page, use the filter dropdown to sort and filter the weather data.

## File Explanations

### index.html

This is the main page of the Weather Dashboard. It contains the structure for the dashboard view, including the current weather widget and charts for temperature, conditions, and forecast.

### tables.html

This page displays the 5-day weather forecast in a tabular format. It includes filtering options and a chat interface.

### styles.css

This file contains the main styles for the application. It defines the layout, colors, and responsive design for both the dashboard and tables views.

### media-queries.css

This file contains additional CSS rules for responsive design, ensuring the application looks good on various screen sizes.

### js/config.js

This file stores the API key for OpenWeatherMap. Replace the placeholder with your actual API key.

```javascript
const CONFIG = {
    OPENWEATHER_API_KEY: 'YOUR_API_KEY'
    GEMINI_API_KEY: 'YOUR_API_KEY',
    CHART_JS_VERSION: '3.7.0'
};
```

### js/weather.js

This file handles the API calls to OpenWeatherMap and processes the received data.

Methods used: Fetch API

Key functions:

- `fetchWeatherData(city)`: Fetches weather data for a given city.
- `fetchWeatherDataByCoords(lat, lon)`: Fetches weather data for given coordinates.
- `processWeatherData(data)`: Processes the raw API response into a more usable format.

### js/app.js

This file contains the main application logic, including UI updates, event listeners, and data manipulation.

Methods used: Vanilla JavaScript DOM manipulation

Key functions:

- `updateUI(data)`: Updates the UI with new weather data.
- `updateCurrentWeather(data)`: Updates the current weather widget.
- `updateCharts()`: Updates the temperature, conditions, and forecast charts.
- `updateForecastTable(data)`: Updates the forecast table on the tables page.
- `updateBackgroundColor(temperature)`: Changes the background color based on temperature.
- `sendMessage()`: Handles sending messages in the chat interface.
- `getChatbotResponse(userInput)`: Generates responses for the chatbot.

Error Handling:

- The application implements error handling for invalid city names or API request failures.
- User-friendly error messages are displayed using the `showError(message)` function.

API Call Optimization:

- The application stores the last searched city to avoid unnecessary API calls.
- API calls are only made when the input changes or when explicitly requested (e.g., using current location).

## Deployment

This website is deployed using Firebase. You can access the live version at [https://nyx-weather.web.app/](https://nyx-weather.web.app/).

To run this project locally, simply open the `index.html` file in a web browser after setting up your API key in the `config.js` file. Make sure you have an active internet connection for the API calls to work.
