import React, { useState, useEffect, useRef } from 'react';

const OPENROUTER_API_KEY = "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";

export default function Chatbot({ liveData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your SmartCity Assistant. Ask me anything about the live data on screen!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const getSystemContext = () => {
    const { weather, currency, citizen, fact } = liveData;

    let context = `You are a helpful SmartCity assistant.\nAnswer only based on the following live data from the dashboard:\n\n`;

    if (weather) {
      context += `WEATHER: Temperature is ${weather.temperature}°C,\nWind speed is ${weather.windspeed} km/h\n\n`;
    }
    if (currency) {
      context += `CURRENCY: 1 INR = ${currency.USD} USD,\n1 INR = ${currency.EUR} EUR,\n1 INR = ${currency.GBP} GBP\n\n`;
    }
    if (citizen) {
      context += `CITIZEN ON SCREEN: ${citizen.name},\nfrom ${citizen.city},\nemail: ${citizen.email}\n\n`;
    }
    if (fact) {
      context += `CITY FACT: ${fact.text}\n\n`;
    }

    context += `If the user asks something not related to this data, politely say you only know about the dashboard data. Do not make up any other information. Keep answers conversational but brief.`;

    return context;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'SmartCity Dashboard',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-free',
          messages: [
            { role: 'system', content: getSystemContext() },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            userMessage
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: `Error connecting to AI: ${error.message}. Please verify the connection.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container animate-fade-in">
      <div className={`glass chat-window ${isOpen ? '' : 'hidden'}`}>
        <div className="chat-header">
          <h3>🤖 SmartCity AI</h3>
          <div className="status">
            <div className="status-dot"></div> Live Context
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`message ${m.role}`}>
              {m.content}
            </div>
          ))}
          {isLoading && (
            <div className="message assistant typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chat-input-area" onSubmit={sendMessage}>
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Ask about the city data..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-btn" 
            disabled={isLoading || !input.trim()}
          >
            ↑
          </button>
        </form>
      </div>

      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}
