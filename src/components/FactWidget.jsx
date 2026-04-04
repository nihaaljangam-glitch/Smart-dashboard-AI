import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';

export default function FactWidget({ onDataReady }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFact = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://uselessfacts.jsph.pl/api/v2/facts/random?language=en&t=${Date.now()}`);
      if (!res.ok) throw new Error('API Rate Limit Exceeded');
      const json = await res.json();
      if (!json.text) throw new Error('Fact dataset unavailable');
      
      const factData = { text: json.text };
      setData(factData);
      if (onDataReady) onDataReady(factData);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  return (
    <DashboardCard 
      title="Fact of the Day" 
      icon="💡" 
      loading={loading} 
      onRefresh={fetchFact}
    >
      {error ? (
        <div style={{color: '#F87171', padding: '1rem', textAlign: 'center'}}>⚠️ API Error: {error}</div>
      ) : data ? (
        <div className="fact-info">
          <blockquote>"{data.text}"</blockquote>
        </div>
      ) : null}
    </DashboardCard>
  );
}
