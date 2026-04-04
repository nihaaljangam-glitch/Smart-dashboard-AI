import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';

export default function CurrencyWidget({ onDataReady }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrency = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const json = await res.json();
      
      // The API gives rates with respect to 1 USD.
      // json.rates.INR is how many INR for 1 USD.
      const inrRate = json.rates.INR;
      
      // Calculate how many USD, EUR, GBP for 1 INR
      const usdForOneInr = (1 / inrRate).toFixed(4);
      const eurForOneInr = (json.rates.EUR / inrRate).toFixed(4);
      const gbpForOneInr = (json.rates.GBP / inrRate).toFixed(4);

      const rates = { USD: usdForOneInr, EUR: eurForOneInr, GBP: gbpForOneInr };
      setData(rates);
      if (onDataReady) onDataReady(rates);
    } catch (e) {
      console.error(e);
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
      {data && (
        <div className="currency-list">
          <div className="currency-item">
            <span>1 INR =</span>
            <span className="currency-code">{data.USD} USD</span>
          </div>
          <div className="currency-item">
            <span>1 INR =</span>
            <span className="currency-code">{data.EUR} EUR</span>
          </div>
          <div className="currency-item">
            <span>1 INR =</span>
            <span className="currency-code">{data.GBP} GBP</span>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
