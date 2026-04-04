import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';

export default function FactWidget({ onDataReady }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFact = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
      const json = await res.json();
      
      const factData = { text: json.text };
      setData(factData);
      if (onDataReady) onDataReady(factData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  return (
    <DashboardCard 
      title="City Fact of the Day" 
      icon="💡" 
      loading={loading} 
      onRefresh={fetchFact}
    >
      {data && (
        <div className="fact-text">
          {data.text}
        </div>
      )}
    </DashboardCard>
  );
}
