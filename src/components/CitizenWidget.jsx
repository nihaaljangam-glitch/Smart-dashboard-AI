import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';

export default function CitizenWidget({ onDataReady }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCitizen = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://randomuser.me/api/');
      const json = await res.json();
      const user = json.results[0];
      
      const citizen = {
        name: `${user.name.first} ${user.name.last}`,
        photo: user.picture.large,
        email: user.email,
        city: user.location.city,
      };
      
      setData(citizen);
      if (onDataReady) onDataReady(citizen);
    } catch (e) {
      console.error(e);
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
      {data && (
        <div className="citizen-info">
          <img src={data.photo} alt={data.name} className="citizen-avatar" />
          <div className="citizen-details">
            <h4>{data.name}</h4>
            <p>🏙️ {data.city}</p>
            <p>✉️ {data.email}</p>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
