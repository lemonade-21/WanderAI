import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItineraryResult from '../components/ItineraryResult';
import './ItineraryBuilder.css';
import { triggerConfetti, showToast, validateInput, showProgress, hideProgress } from '../utils/animations';

function ItineraryBuilder() {
  const [formData, setFormData] = useState({
    destination: '',
    duration: 3, 
    interests: '',
  });

  // Stores the final object: { itinerary: [...], weather: {...}, prompt_used: "..." }
  const [itineraryData, setItineraryData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const API_URL = 'http://127.0.0.1:8000/generate-itinerary';
  const WEATHER_API_URL = 'http://127.0.0.1:8000/get-weather';


  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'duration' ? parseInt(value) : value, 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setItineraryData(null); // Clear previous results
    setError(null);

    try {
      // 1. Send form data to the FastAPI endpoint (Non-Streaming, Stable)
      const response = await axios.post(API_URL, formData);
      
      // Parse the JSON string received from the backend with error handling
      let aiItinerary;
      try {
        aiItinerary = JSON.parse(response.data.data_from_ai);
        // Validate that the parsed data has the expected structure
        if (!aiItinerary || !aiItinerary.itinerary || !Array.isArray(aiItinerary.itinerary)) {
          throw new Error("Invalid itinerary structure received from AI");
        }
      } catch (parseErr) {
        console.error("JSON Parsing Error:", parseErr);
        setError('The AI response could not be parsed. The backend may have returned invalid JSON.');
        setLoading(false);
        return;
      }
      
      const promptUsed = response.data.prompt_used; 
      
      // 2. TEMPORARY FIX: Call the weather API in the background. 
      // We set the result immediately so the UI doesn't block, 
      // and we update the state later if the weather succeeds.
      
      // Set the core itinerary data immediately so the successful AI result is shown
      setItineraryData({ ...aiItinerary, prompt_used: promptUsed }); 
      setLoading(false); // Stop loading immediately after showing itinerary
      
      // Celebrate success!
      triggerConfetti();
      showToast('Your itinerary is ready! 🎉', 'success');
      
      // Run the weather fetch as a background task (non-blocking)
      fetchWeather(formData.destination, aiItinerary, promptUsed);

    } catch (err) {
      console.error("AI Generation Error:", err);
      // Handle different types of errors with more specific messages
      if (err.response) {
        // The request was made and the server responded with a status code outside 2xx
        setError(`Server error: ${err.response.data?.detail || err.response.statusText || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please ensure the backend is running on http://127.0.0.1:8000');
      } else {
        // Something happened in setting up the request
        setError('Failed to generate itinerary. Please check your connection and try again.');
      }
      showToast('Failed to generate itinerary. Please try again.', 'error');
      setLoading(false);
    }
  };

  // --- Weather Fetcher (BONUS) ---
  // This function is no longer blocking the main thread from displaying results.
  // Note: Loading state is already set to false in handleSubmit, so we don't need to set it here
  const fetchWeather = async (city, aiItinerary, promptUsed) => {
      try {
          const weatherResponse = await axios.get(`${WEATHER_API_URL}?city=${city}`);
          
          // If successful, update the state to include the weather data
          setItineraryData({
              ...aiItinerary,
              weather: weatherResponse.data,
              prompt_used: promptUsed
          });

      } catch (weatherErr) {
          // Silently fail - weather is a bonus feature, itinerary is already displayed
          console.warn("Weather data could not be retrieved. Proceeding with itinerary.", weatherErr);
          // No need to update loading state or show error - itinerary is already displayed
      }
  }


  // Scroll to results when they appear on mobile
  useEffect(() => {
    if (itineraryData && window.innerWidth < 1024) {
      const resultsElement = document.getElementById('itinerary-results');
      if (resultsElement) {
        setTimeout(() => {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [itineraryData]);

  return (
    <div className="itinerary-builder">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">★</span>
            <span>AI-Powered Travel Planning</span>
          </div>
          <h1 className="hero-title">
            Plan Your Perfect
            <span className="hero-title-accent"> Adventure</span>
          </h1>
          <p className="hero-subtitle">
            Intelligent travel planning powered by AI. Personalized itineraries designed for extraordinary journeys.
          </p>
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Custom Itineraries</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Instant Planning</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">◉</span>
              <span>Weather Forecast</span>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll Down</span>
          <span className="scroll-arrow">↓</span>
        </div>
      </div>
      
      <div className="builder-container">
        <div className="form-section">
          <div className="form-card">
            <div className="form-header">
              <p className="form-subtitle">Tell us about your dream destination</p>
            </div>
            <form onSubmit={handleSubmit} className="itinerary-form">
              <div className="form-group">
                <label htmlFor="destination" className="form-label">
                  <span className="label-icon">📍</span>
                  Where do you want to go?
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Paris, Tokyo, New York, Bali..."
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="duration" className="form-label">
                  <span className="label-icon">📅</span>
                  How many days?
                </label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    max="7"
                    required
                    className="form-input"
                  />
                  <span className="input-hint">1-7 days</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="interests" className="form-label">
                  <span className="label-icon">❤️</span>
                  What are you interested in?
                </label>
                <div className="input-wrapper">
                  <textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="e.g., museums, local cuisine, hiking, art galleries, beaches, nightlife..."
                    className="form-input form-textarea"
                  ></textarea>
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-button">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Creating Your Itinerary...</span>
                  </>
                ) : (
                  <span>Generate My Itinerary</span>
                )}
              </button>
            </form>
            
            {/* --- Display Status --- */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            {loading && (
              <div className="loading-message">
                <div className="loading-spinner"></div>
                <p>Our AI is crafting your perfect itinerary... this may take a moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- Display Result --- */}
        <div className="results-section" id="itinerary-results">
          {itineraryData && (
            <div className="fade-in">
              <ItineraryResult data={itineraryData} destination={formData.destination} />
            </div>
          )}
          {!itineraryData && !loading && (
            <div className="results-placeholder">
              <div className="placeholder-icon-wrapper">
                <span className="placeholder-icon">🗺️</span>
              </div>
              <h3>Your Itinerary Awaits</h3>
              <p>Fill out the form to the left and we'll create a personalized travel plan just for you.</p>
              <div className="placeholder-features">
                <div className="placeholder-feature">
                  <span>✓</span>
                  <span>Day-by-day schedule</span>
                </div>
                <div className="placeholder-feature">
                  <span>✓</span>
                  <span>Activity recommendations</span>
                </div>
                <div className="placeholder-feature">
                  <span>✓</span>
                  <span>Weather information</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItineraryBuilder;
