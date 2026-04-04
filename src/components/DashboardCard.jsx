import React from 'react';

export default function DashboardCard({ title, icon, onRefresh, loading, children }) {
  return (
    <div className="glass widget animate-fade-in">
      <div className="widget-header">
        <h3>
          <span>{icon}</span> {title}
        </h3>
        <button 
          className="refresh-btn" 
          onClick={onRefresh} 
          disabled={loading}
          title="Refresh Data"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className="widget-content">
        {loading ? (
          <div className="loader"></div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
