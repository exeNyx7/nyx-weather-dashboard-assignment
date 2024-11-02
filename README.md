
# NyxWeather Dashboard

## Description

NyxWeather Dashboard is a feature-rich web application that provides real-time weather updates, a 5-day forecast for any specified city, and interactive weather analytics through dynamic charts. Leveraging OpenWeatherMap API for fetching weather data, this dashboard incorporates a responsive design suitable for various devices and integrates a Gemini AI chatbot for interactive user engagement.

## Live Demo

View the live demo of the project: [https://nyx-weather.web.app/](https://nyx-weather.web.app/)

## Table of Contents

1. [Installation](#installation)
2. [Features](#features)
3. [File Structure](#file-structure)
4. [API Documentation](#api-documentation)
5. [Setup and Installation](#setup-and-installation)
6. [Running the Project Locally](#running-the-project-locally)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)

## Installation

Clone the repository:

```bash
git clone https://github.com/DawoodQamar2522/nyx-weather-dashboard-assignment
cd nyx-weather-dashboard-assignment
```

Open the project in your preferred code editor.

## Features

- **Weather Search**: Users can search by city name or use their current location to find weather forecasts.
- **Temperature Toggle**: Users can switch between Celsius and Fahrenheit.
- **Interactive Weather Charts**: Utilizes Chart.js to dynamically display temperature trends and condition forecasts.
- **Weather Filtering**: Provides options to filter weather data by criteria like temperature range or specific weather conditions.
- **Gemini AI Chatbot Integration**: Engage with an AI-powered chatbot for additional weather details and insights.
- **Responsive Layout**: Adaptable interface for desktop, tablet, and mobile views.

## File Structure

```
- index.html
- tables.html
- README.md
- assets/
- styles/
  - styles.css
  - media-queries.css
- js/
  - config.js (you need to create this file and the code is given below in "Running the project locally" Section)
  - weather.js
  - app.js
  - gemini.js
```

## API Documentation

Utilizes the OpenWeatherMap API for weather data:

1. **Current weather endpoint**:
   - `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}`
   - `https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`
2. **5-day forecast endpoint**:
   - `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`

Replace `{API key}` with your personal API key from OpenWeatherMap.

## Setup and Installation

```bash
# Install dependencies (if any)
npm install

# Run the project
npm start
```

## Running the Project Locally

1. First of all create a file named config.js in the js folder and configure API keys in `config.js` - replace 'YOUR_API_KEY' & 'YOUR_GEMINI_API_KEY' with your API keys.
   ```javascript
   const CONFIG = {
       OPENWEATHER_API_KEY: 'YOUR_API_KEY',
       GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY',
       CHART_JS_VERSION: '3.7.0'
   };
   ```
2. Open `index.html` in a web browser to access the dashboard locally.

## Deployment

Deployed using Firebase, accessible at: [https://nyx-weather.web.app/](https://nyx-weather.web.app/).

To run this project locally, simply open the `index.html` file in a web browser after setting up your API key in the `config.js` file. Make sure you have an active internet connection for the API calls to work.

## Contributing

Contributions are welcome! Please refer to the repository's issues page to propose changes or open new issues.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
