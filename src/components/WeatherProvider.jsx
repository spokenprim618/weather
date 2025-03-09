// WeatherContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetchWeatherData().then(data => setWeatherData(data));
  }, []);

  return (
    <WeatherContext.Provider value={weatherData}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}

async function fetchWeatherData() {
  try {
    const response = await fetch(
      'https://api.weatherbit.io/v2.0/forecast/hourly?city=New%2BYork%2CNY&units=I&hours=48&key=64c448e434e94fc6beb98393a0229eec'
    );
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
