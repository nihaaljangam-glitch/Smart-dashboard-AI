import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';

export default function WeatherWidget({ onDataReady }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://wttr.in/Pune?format=j1');
      if (!res.ok) throw new Error('Network error or rate limit hit');
      const json = await res.json();
      if (!json.current_condition || json.current_condition.length === 0) throw new Error('Weather Data Unavailable');
      
      const current = json.current_condition[0];
      const dataMapping = {
        temperature: current.temp_C,
        windspeed: current.windspeedKmph,
        weathercode: current.weatherDesc[0].value,
      };
      setData(dataMapping);
      if (onDataReady) onDataReady(dataMapping);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <DashboardCard 
      title="Live Weather" 
      icon="🌤️" 
      loading={loading} 
      onRefresh={fetchWeather}
    >
      {error ? (
        <div style={{color: '#F87171', padding: '1rem', textAlign: 'center'}}>⚠️ API Error: {error}</div>
      ) : data ? (
        <div className="weather-info">
          <div className="weather-temp">{data.temperature}°C</div>
          <div className="weather-details">
            <div className="weather-desc">Wind: {data.windspeed} km/h</div>
            <div>Code: {data.weathercode}</div>
          </div>
        </div>
      ) : null}
    </DashboardCard>
  );
}
