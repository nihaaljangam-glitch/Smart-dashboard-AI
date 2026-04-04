import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';

export default function WeatherWidget({ onDataReady }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=18.52&longitude=73.86&current_weather=true');
      const json = await res.json();
      const current = json.current_weather;
      setData(current);
      if (onDataReady) onDataReady(current);
    } catch (e) {
      console.error(e);
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
      {data && (
        <div className="weather-info">
          <div className="weather-temp">{data.temperature}°C</div>
          <div className="weather-details">
            <div className="weather-desc">Wind: {data.windspeed} km/h</div>
            <div>Code: {data.weathercode}</div>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
