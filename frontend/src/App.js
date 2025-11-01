import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import ItineraryBuilder from './pages/ItineraryBuilder';
import SuggestedTrips from './pages/SuggestedTrips';
import './App.css';

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.App');
      if (scrollContainer && scrollContainer.scrollTop > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    const scrollContainer = document.querySelector('.App');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.querySelector('.App');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li className="nav-logo">
            <NavLink to="/" end className="logo-link">
              <span className="logo-icon">✈</span>
              <span className="logo-text">WanderAI</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/" end>
              Plan Your Trip
            </NavLink>
          </li>
          <li>
            <NavLink to="/trips">
              Discover Destinations
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="page-transition">
        <Routes>
          <Route path="/" element={<ItineraryBuilder />} />
          <Route path="/trips" element={<SuggestedTrips />} />
        </Routes>
      </div>

      {/* Theme Toggle Switch */}
      <div className="theme-toggle" onClick={toggleTheme}>
        <div className={`toggle-switch ${darkMode ? 'dark' : ''}`}>
          <div className="toggle-slider"></div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button 
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </div>
  );
}

export default App;