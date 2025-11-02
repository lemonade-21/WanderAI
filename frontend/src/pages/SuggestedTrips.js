import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TripCard from '../components/TripCard';
import './SuggestedTrips.css';

// --- THIS BLOCK IS UPDATED ---
// Use the deployed backend URL in production, or localhost for development
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://wanderai-nyhb.onrender.com' // Your live backend
  : 'http://127.0.0.1:8000'; // Your local backend

const API_URL = `${BASE_URL}/suggested-trips`;
// --- END OF UPDATE ---


function SuggestedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect runs the data fetching when the component mounts
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(API_URL);
        setTrips(response.data); // Set the list of trips from the API response
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Failed to fetch suggested trips:", err);
        // --- THIS BLOCK IS UPDATED ---
        setError(`Could not load trips. Please ensure the backend is running at ${BASE_URL}`);
        setTrips([]); // Ensure trips list is empty on error
      } finally {
        setLoading(false); // Stop the loading state regardless of success/fail
      }
    };

    fetchTrips();
  }, []); // The empty array [] ensures this runs only once on mount

  return (
    <div className="suggested-trips">
      <div className="trips-hero">
        <div className="trips-hero-content">
          <div className="trips-badge">
            <span className="trips-badge-icon">◉</span>
            <span>Curated Destinations</span>
          </div>
          <h1 className="trips-title">
            Discover Your Next
            <span className="trips-title-accent"> Adventure</span>
          </h1>
          <p className="trips-subtitle">
            Explore handpicked destinations and find inspiration for your next journey. 
            Each destination is carefully selected to offer unique experiences and unforgettable memories.
          </p>
        </div>
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll Down</span>
          <span className="scroll-arrow">↓</span>
        </div>
      </div>

      <div className="trips-container">
        {loading && (
          <div className="trips-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="trip-card-skeleton">
                <div className="skeleton-header"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
                <div className="skeleton-button"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="trips-error">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="trips-grid">
            {trips.length > 0 ? (
              trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))
            ) : (
              <div className="trips-empty">
                <div className="empty-icon-wrapper">
                  <span className="empty-icon">🌎</span>
                </div>
                <h3>No destinations found</h3>
                <p>We're working on adding more amazing destinations. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SuggestedTrips;
