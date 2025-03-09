// HourDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useWeather } from '../components/WeatherProvider';

export default function HourDetail() {
  const { hourIndex } = useParams();
  const weatherData = useWeather();
  const hourlyForecast = weatherData?.data[hourIndex];

  if (!hourlyForecast) return <p>No data found for this hour.</p>;

  return (
    <div>
      <h2>Details for {new Date(hourlyForecast.timestamp_local).toLocaleString()}</h2>
      <p>Temperature: {hourlyForecast.temp}°F</p>
      <p>Conditions: {hourlyForecast.weather.description}</p>
      <p>Wind Speed: {hourlyForecast.wind_spd} mph</p>
    </div>
  );
}
