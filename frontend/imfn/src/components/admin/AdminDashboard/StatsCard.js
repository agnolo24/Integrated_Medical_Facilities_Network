import React from 'react';

const StatsCard = ({ icon, title, value, color }) => {
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${color}20`, color: color }}>
                <i className={`fas ${icon}`}></i>
            </div>
            <div className="stat-info">
                <h3>{value}</h3>
                <p>{title}</p>
            </div>
        </div>
    );
};

export default StatsCard;
