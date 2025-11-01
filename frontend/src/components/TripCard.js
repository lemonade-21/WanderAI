import React from 'react';
import './TripCard.css';

function TripCard({ trip }) {
  return (
    <div className="trip-card">
      <div className="trip-card-header" style={{
        backgroundImage: `url(${trip.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'})`,
      }}>
        <div className="trip-card-icon">
          {trip.country_flag ? (
            <img src={trip.country_flag} alt={trip.country_code} className="flag-image" />
          ) : (
            <span>✈️</span>
          )}
        </div>
        <h3 className="trip-destination">{trip.destination}</h3>
      </div>
      
      <div className="trip-card-content">
        <div className="trip-section">
          <div className="trip-section-header">
            <span className="section-icon">◆</span>
            <span className="section-label">Highlights</span>
          </div>
          <p className="trip-highlight-text">{trip.highlights}</p>
        </div>
        
        <div className="trip-section">
          <div className="trip-section-header">
            <span className="section-icon">◷</span>
            <span className="section-label">Best Time to Visit</span>
          </div>
          <p className="trip-time-text">{trip.best_time}</p>
        </div>
      </div>

      <div className="trip-card-footer">
        <a 
          href={trip.google_earth_url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="trip-explore-btn"
        >
          <span>Explore Destination</span>
          <span className="btn-arrow">→</span>
        </a>
      </div>
    </div>
  );
}

export default TripCard;
