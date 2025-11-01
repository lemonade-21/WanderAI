import React, { useState } from 'react';
import './ItineraryResult.css';
import { generateItineraryPDF } from '../utils/pdfGenerator';

function ItineraryResult({ data, destination }) {
  // State for the Chain of Thought visibility
  const [showPrompt, setShowPrompt] = useState(false); 

  if (!data || !data.itinerary) {
    return (
      <div className="itinerary-result-empty">
        <p>No itinerary data available.</p>
      </div>
    );
  }

  // Generate Unsplash image URL based on destination
  const getDestinationImage = (dest) => {
    if (!dest) return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80';
    // Use Unsplash Source API to get a random image based on the destination
    const query = encodeURIComponent(dest);
    return `https://source.unsplash.com/1600x900/?${query},travel,city`;
  };

  const headerStyle = {
    backgroundImage: `url(${getDestinationImage(destination)})`
  };

  const handleDownloadPDF = () => {
    generateItineraryPDF(data, destination);
  };

  return (
    <div className="itinerary-result fade-in">
      <div className="result-header" style={headerStyle}>
        <div className="result-header-content">
          <div className="result-badge">
            <span className="result-badge-icon">✈️</span>
            <span>Your Personalized Itinerary</span>
          </div>
          <h3 className="result-title">
            Your Perfect Travel Plan
          </h3>
          <p className="result-subtitle">Crafted especially for you by our AI travel expert</p>
          <button onClick={handleDownloadPDF} className="download-pdf-btn">
            <span className="download-icon">⬇</span>
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Display Weather (BONUS FEATURE) */}
      {data.weather && data.weather.city && data.weather.description && (
        <div className="weather-card">
          <div className="weather-header">
            <span className="weather-icon">🌤️</span>
            <span className="weather-label">Current Weather</span>
          </div>
          <div className="weather-info">
            <div className="weather-location">
              <span className="weather-location-icon">📍</span>
              <span>{data.weather.city}</span>
            </div>
            <div className="weather-details">
              {data.weather.temperature !== undefined && (
                <div className="weather-temp-wrapper">
                  <span className="weather-temp">{Math.round(data.weather.temperature)}°C</span>
                  <span className="weather-desc">{data.weather.description}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Display Day-by-Day Itinerary */}
      <div className="itinerary-timeline">
        <div className="timeline-header">
          <h4 className="timeline-title">
            <span className="timeline-icon">📅</span>
            Day-by-Day Itinerary
          </h4>
        </div>
        <div className="itinerary-days">
          {data.itinerary.map((dayPlan, index) => (
            <div key={index} className="day-card">
              <div className="day-timeline-marker">
                <div className="day-marker-circle"></div>
                {index < data.itinerary.length - 1 && <div className="day-marker-line"></div>}
              </div>
              <div className="day-content">
                <div className="day-header">
                  <div className="day-number-badge">
                    <span className="day-number">{index + 1}</span>
                  </div>
                  <h4 className="day-title">{dayPlan.day || `Day ${index + 1}`}</h4>
                </div>
                <div className="activities-list">
                  {dayPlan.activities && Array.isArray(dayPlan.activities) ? (
                    dayPlan.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="activity-item">
                        <div className="activity-check">
                          <span className="activity-check-icon">✓</span>
                        </div>
                        <span className="activity-text">{activity}</span>
                      </div>
                    ))
                  ) : (
                    <div className="activity-item">
                      <span className="activity-text">No activities listed for this day.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="result-divider"></div>

      {/* Display Chain of Thought (Prompt) Bonus */}
      <div className="prompt-section">
        <button 
          onClick={() => setShowPrompt(!showPrompt)}
          className="prompt-toggle-button"
        >
          <span className="toggle-icon">{showPrompt ? '▼' : '▶'}</span>
          <span>{showPrompt ? 'Hide' : 'Show'} AI Details</span>
        </button>

        {showPrompt && (
          <div className="prompt-container fade-in">
            <div className="prompt-header">
              <span className="prompt-header-icon">🤖</span>
              <span className="prompt-header-label">AI Prompt Used</span>
            </div>
            <pre className="prompt-content">{data.prompt_used}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItineraryResult;
