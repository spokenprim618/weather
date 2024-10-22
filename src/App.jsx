import React, { useState, useEffect } from 'react';
import './App.css'; // Updated CSS file

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [originalWeatherData, setOriginalWeatherData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkState, setCheckState] = useState(0); // State variable for weather or statistics
  const [statistics, setStatistics] = useState({}); // State for statistics
  const [searchTerm, setSearchTerm] = useState(''); // State for search query


  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          'https://api.weatherbit.io/v2.0/forecast/hourly?city=New%2BYork%2CNY&units=I&hours=48&key=64c448e434e94fc6beb98393a0229eec'
        );
        const data = await response.json();
        setWeatherData(data);
        setOriginalWeatherData(data);

        // Calculate statistics after fetching data
        const averages = calculateAverageWeatherDescriptions(data.data);
        const averageWindSpeed = calculateAverageWindSpeed(data.data);
        const [minWindSpeed, maxWindSpeed] = findMinMaxWindSpeed(data.data);
        const averageTemperature = calculateAverageTemperature(data.data);
        const [minTemperature, maxTemperature] = findMinMaxTemperatures(data.data);

        // Set the calculated statistics in state
        setStatistics({
          averageFewClouds: averages.averageFewClouds,
          averageClearSky: averages.averageClearSky,
          averageWindSpeed,
          minWindSpeed,
          maxWindSpeed,
          averageTemperature,
          minTemperature,
          maxTemperature,
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  
    // Only filter if there's something to search for
    if (!searchTerm) {
      setWeatherData(originalWeatherData);
      return;
    }
  
    const filteredData = originalWeatherData.data.filter((entry) => {
      // Get the forecast time and day
      
      const forecastTime = new Date(entry.timestamp_local).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).toLowerCase().replace(/\s+/g, ' ').trim();;
  
      const forecastDay = new Date(entry.timestamp_local).toLocaleDateString('en-US', {
        weekday: 'long',
      }).toLowerCase();
  
      // Check if search term matches either time or day
      const matchesTime = forecastTime.includes(searchTerm);
      const matchesDay = forecastDay.includes(searchTerm);
  
      // Filter if either matches
      return matchesTime || matchesDay;
    });
  
    // Update the weather data with filtered results
    setWeatherData((prevData) => ({ ...prevData, data: filteredData }));
  };
  
  const handleQuestionClick = (event) => {
    const answerElement = event.target.nextElementSibling; // Get the next sibling (the corresponding answer)
    
    if (answerElement) {
      answerElement.classList.toggle('expanded'); // Toggle the expanded class
    }
  };
  
  const countWeatherDescriptions = (data) => {
    const counts = {
      "few clouds": 0,
      "clear sky": 0
    };
    const total = data.length; // Total number of weather data entries

    for (let i = 0; i < data.length; i++) {
      const description = data[i].weather.description.toLowerCase(); // Normalize to lowercase

      // Increment counts based on description
      if (description.includes("few clouds")) {
        counts["few clouds"] += 1; 
      }
      if (description.includes("clear sky")) {
        counts["clear sky"] += 1; 
      }
    }

    return { counts, total };
  };

  const calculateAverageWeatherDescriptions = (data) => {
    const { counts, total } = countWeatherDescriptions(data);

    // Calculate averages
    const averageFewClouds = total > 0 ? counts["few clouds"] / total : 0;
    const averageClearSky = total > 0 ? counts["clear sky"] / total : 0;

    return { averageFewClouds, averageClearSky };
  };

  const calculateAverageWindSpeed = (data) => {
    if (data.length === 0) return 0; // Handle empty data case

    let totalWindSpeed = 0;

    for (let i = 0; i < data.length; i++) {
      totalWindSpeed += data[i].wind_spd; // Use wind_spd instead of wind_speed
    }

    return totalWindSpeed / data.length; // Calculate average
  };

  const findMinMaxWindSpeed = (data) => {
    if (data.length === 0) return [null, null]; // Handle empty data case

    let minWindSpeed = data[0].wind_spd; // Start with the first wind speed
    let maxWindSpeed = data[0].wind_spd; // Start with the first wind speed

    for (let i = 1; i < data.length; i++) {
      const currentWindSpeed = data[i].wind_spd; // Use wind_spd

      if (currentWindSpeed < minWindSpeed) {
        minWindSpeed = currentWindSpeed; // Update min if current wind speed is lower
      }
      
      if (currentWindSpeed > maxWindSpeed) {
        maxWindSpeed = currentWindSpeed; // Update max if current wind speed is higher
      }
    }

    return [minWindSpeed, maxWindSpeed]; // Return as an array
  };

  const calculateAverageTemperature = (data) => {
    let totalTemperature = 0;

    for (let i = 0; i < data.length; i++) {
      totalTemperature += data[i].temp; // Assuming the temperature is stored in the `temp` field
    }

    const averageTemperature = totalTemperature / data.length; // Calculate average
    return averageTemperature;
  };

  const findMinMaxTemperatures = (data) => {
    if (data.length === 0) return [null, null]; // Handle empty data case
  
    let minTemperature = data[0].temp; // Start with the first temperature
    let maxTemperature = data[0].temp; // Start with the first temperature
  
    for (let i = 1; i < data.length; i++) {
      const currentTemp = data[i].temp;
  
      if (currentTemp < minTemperature) {
        minTemperature = currentTemp; // Update min if current temp is lower
      }
      
      if (currentTemp > maxTemperature) {
        maxTemperature = currentTemp; // Update max if current temp is higher
      }
    }
  
    return [minTemperature, maxTemperature]; // Return as an array
  };

  // Updated stateIs function using if and else if
  const stateIs = (value) => {
    if (checkState === 0) {
      value = checkState;
      
    } else if (checkState === 1) {
      value = checkState;
    }
    return value;
  };

  const renderConditionIcon = (description) => {
    if (description.toLowerCase().includes('few clouds')) {
      return '⛅';
    } else if (description.toLowerCase().includes('clear')) {
      return '☀️';
    }
    return '';
  };

  const renderTemperatureIcon = (temp) => {
    if (temp > 50 && temp < 80) {
      return '💨';
    }
    return '';
  };
  const filterData = (filterType) => {
    let filteredData;

    switch (filterType) {
      case 'highestWind':
        filteredData = originalWeatherData.data.filter((entry) => entry.wind_spd > statistics.averageWindSpeed);
        break;
      case 'lowestWind':
        filteredData = originalWeatherData.data.filter((entry) => entry.wind_spd < statistics.averageWindSpeed);
        break;
      case 'highestTemp':
        filteredData = originalWeatherData.data.filter((entry) => entry.temp > statistics.averageTemperature);
        break;
      case 'lowestTemp':
        filteredData = originalWeatherData.data.filter((entry) => entry.temp < statistics.averageTemperature);
        break;
      default:
        filteredData = originalWeatherData.data; // Default to showing all data
    }

    // Update state with filtered data
    setWeatherData((prevData) => ({ ...prevData, data: filteredData }));
  };
 
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="weather-container">
      {/* NavBar with City Name */}
      <nav className="navbar">
        <h1>{weatherData.city_name}</h1>
        {/* Buttons for Weather and Statistics */}
        <div className="button-container">
          <button onClick={() => {setCheckState(0); setWeatherData(originalWeatherData);}}>Weather/reset</button>
          <button onClick={() => setCheckState(1)}>Statistics</button>
        </div>
        <h1>Filter</h1>
<div className="filter-buttons">
<button onClick={() => filterData('highestWind')}>Highest Winds</button>
  <button onClick={() => filterData('lowestWind')}>Lowest Winds</button>
  <button onClick={() => filterData('highestTemp')}>Highest Temps</button>
  <button onClick={() => filterData('lowestTemp')}>Lowest Temps</button>
</div>
{/* Search Bar */}
<h1>Search</h1>
        <form >
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search weather description..."
            className="search-bar"
          />
        
        </form>
      </nav>

      {/* Conditional Rendering for Weather Section */}
      {weatherData && stateIs(0) === 0 && (
        <div className="weather-grid">
          <div className="weather-header">
            <div>Day</div>
            <div>Temperature</div>
            <div>Conditions</div>
            <div>Wind Speed</div>
          </div>

          {weatherData.data.map((hourlyForecast, index) => (
            <div className="weather-row" key={index}>
              <div>{new Date(hourlyForecast.timestamp_local).toLocaleString('en-US', { weekday: 'short', hour: 'numeric' })}</div>
              <div>{hourlyForecast.temp}°F {renderTemperatureIcon(hourlyForecast.temp)}</div>
              <div>{hourlyForecast.weather.description} {renderConditionIcon(hourlyForecast.weather.description)}</div>
              <div>{hourlyForecast.wind_spd.toFixed(1)} mph</div>
            </div>
          ))}
        </div>
      )}

      {/* Conditional Rendering for Statistics Section */}
      {weatherData && stateIs(1) === 1 && (
       <div className="statistics-section">
       <h1>Statistics</h1>
       
       <button id="question1" className="question" onClick={handleQuestionClick}>
         Q1: What is the average percentage of Few Clouds Days?
       </button>
       <p id="answer1" className="answer">
         A: {(statistics.averageFewClouds * 100).toFixed(2)}%
       </p>
       
       <button id="question2" className="question" onClick={handleQuestionClick}>
         Q2: What is the average percentage of Clear Sky Days?
       </button>
       <p id="answer2" className="answer">
         A: {(statistics.averageClearSky * 100).toFixed(2)}%
       </p>
       
       <button id="question3" className="question" onClick={handleQuestionClick}>
         Q3: What is the average Wind Speed?
       </button>
       <p id="answer3" className="answer">
         A: {statistics.averageWindSpeed.toFixed(1)} mph
       </p>
       
       <button id="question4" className="question" onClick={handleQuestionClick}>
         Q4: What is the Minimum Wind Speed?
       </button>
       <p id="answer4" className="answer">
         A: {statistics.minWindSpeed?.toFixed(1)} mph
       </p>
       
       <button id="question5" className="question" onClick={handleQuestionClick}>
         Q5: What is the Maximum Wind Speed?
       </button>
       <p id="answer5" className="answer">
         A: {statistics.maxWindSpeed?.toFixed(1)} mph
       </p>
       
       <button id="question6" className="question" onClick={handleQuestionClick}>
         Q6: What is the Average Temperature?
       </button>
       <p id="answer6" className="answer">
         A: {statistics.averageTemperature?.toFixed(1)}°F
       </p>
       
       <button id="question7" className="question" onClick={handleQuestionClick}>
         Q7: What is the Minimum Temperature?
       </button>
       <p id="answer7" className="answer">
         A: {statistics.minTemperature?.toFixed(1)}°F
       </p>
       
       <button id="question8" className="question" onClick={handleQuestionClick}>
         Q8: What is the Maximum Temperature?
       </button>
       <p id="answer8" className="answer">
         A: {statistics.maxTemperature?.toFixed(1)}°F
       </p>
     </div>
      )};
      </div>
  );
  
}
