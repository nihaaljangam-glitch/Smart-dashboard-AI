import { useState } from 'react';
import './App.css';
import WeatherWidget from './components/WeatherWidget';
import CurrencyWidget from './components/CurrencyWidget';
import CitizenWidget from './components/CitizenWidget';
import FactWidget from './components/FactWidget';
import Chatbot from './components/Chatbot';

function App() {
  const [liveData, setLiveData] = useState({
    weather: null,
    currency: null,
    citizen: null,
    fact: null
  });

  const handleDataReady = (key, data) => {
    setLiveData(prev => ({ ...prev, [key]: data }));
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>SmartCity Dashboard</h1>
        <p>Real-time civic intelligence and live API insights at a glance.</p>
      </header>

      <main className="dashboard-grid">
        <WeatherWidget onDataReady={(data) => handleDataReady('weather', data)} />
        <CurrencyWidget onDataReady={(data) => handleDataReady('currency', data)} />
        <CitizenWidget onDataReady={(data) => handleDataReady('citizen', data)} />
        <FactWidget onDataReady={(data) => handleDataReady('fact', data)} />
      </main>

      <Chatbot liveData={liveData} />
    </div>
  );
}

export default App;
