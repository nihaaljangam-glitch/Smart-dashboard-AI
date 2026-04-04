import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';

export default function CitizenWidget({ onDataReady }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCitizen = async () => {
    setLoading(true);
    setError(null);
    try {
      const randomId = Math.floor(Math.random() * 100) + 1;
      const res = await fetch(`https://dummyjson.com/users/${randomId}`);
      if (!res.ok) throw new Error('API Rate Limit Exceeded');
      const user = await res.json();
      if (!user.firstName) throw new Error('The API returned no data (Rate Limit)');
      
      const citizen = {
        name: `${user.firstName} ${user.lastName}`,
        photo: user.image,
        email: user.email,
        city: user.address.city,
      };
      
      setData(citizen);
      if (onDataReady) onDataReady(citizen);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizen();
  }, []);

  return (
    <DashboardCard 
      title="Featured Citizen" 
      icon="👤" 
      loading={loading} 
      onRefresh={fetchCitizen}
    >
      {error ? (
        <div style={{color: '#F87171', padding: '1rem', textAlign: 'center'}}>⚠️ API Error: {error}</div>
      ) : data ? (
        <div className="citizen-info">
          <img src={data.photo} alt={data.name} className="citizen-avatar" />
          <div className="citizen-details">
            <h4>{data.name}</h4>
            <p>🏙️ {data.city}</p>
            <p>✉️ {data.email}</p>
          </div>
        </div>
      ) : null}
    </DashboardCard>
  );
}
