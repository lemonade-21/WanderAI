import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItineraryResult from '../components/ItineraryResult';
import './ItineraryBuilder.css';
import { triggerConfetti, showToast, validateInput, showProgress, hideProgress } from '../utils/animations';

// --- THIS BLOCK IS UPDATED ---
// Use the deployed backend URL in production, or localhost for development
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://wanderai-backend-evy3.onrender.com' // Your live backend
  : 'http://127.0.0.1:8000'; // Your local backend

const API_URL = `${BASE_URL}/generate-itinerary`;
const WEATHER_API_URL = `${BASE_URL}/get-weather`;
// --- END OF UPDATE ---

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
          // --- THIS BLOCK IS UPDATED ---
        setError(`No response from server. Please ensure the backend is running at ${BASE_URL}`);
      } else {
        // Something happened in setting up the request
        setError('Failed to generate itinerary. Please check your connection and try again.');
      }
      showToast('Failed to generate itinerary. Please try again.', 'error');
      setLoading(false);
    }
  };

  // --- Weather Fetcher (BONUS) ---
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
      }
  }

  // ... (rest of your file, including useEffect and return statement, is unchanged) ...
  // ... (I'm omitting the rest of your file to be concise, just apply the changes at the top) ...

}

export default ItineraryBuilder;
