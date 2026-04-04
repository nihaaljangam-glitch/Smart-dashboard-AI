import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';

export default function CurrencyWidget({ onDataReady }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrency = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error(`Currency API failed with status ${res.status}`);
      const json = await res.json();
      if (json.result !== "success") throw new Error('API returned unsuccessful response');
      
      // The API gives rates with respect to 1 USD.
      // We want rates for 1 INR.
      const usdToInr = json.rates.INR;
      const inrToUsd = 1 / usdToInr;
      const inrToEur = json.rates.EUR / usdToInr;
      const inrToGbp = json.rates.GBP / usdToInr;

      const rates = {
        usd: inrToUsd.toFixed(4),
        eur: inrToEur.toFixed(4),
        gbp: inrToGbp.toFixed(4),
      };
      setData(rates);
      if (onDataReady) onDataReady(rates);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrency();
  }, []);

  return (
    <DashboardCard 
      title="Currency Rates" 
      icon="💱" 
      loading={loading} 
      onRefresh={fetchCurrency}
    >
      {error ? (
        <div style={{color: '#F87171', padding: '1rem', textAlign: 'center'}}>⚠️ API Error: {error}</div>
      ) : data ? (
        <div className="currency-info">
          <div className="currency-row">
            <span>1 INR = </span>
            <span>{data.usd} USD</span>
          </div>
          <div className="currency-row">
            <span>1 INR = </span>
            <span>{data.eur} EUR</span>
          </div>
          <div className="currency-row">
            <span>1 INR = </span>
            <span>{data.gbp} GBP</span>
          </div>
        </div>
      ) : null}
    </DashboardCard>
  );
}
