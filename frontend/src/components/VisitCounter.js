import React, { useState, useEffect } from 'react';
import './VisitCounter.css';

function VisitCounter() {
  const [visitCount, setVisitCount] = useState(0);
  const [isNewVisit, setIsNewVisit] = useState(false);

  useEffect(() => {
    // Get the current visit count from localStorage
    const storedCount = localStorage.getItem('wanderAI_visitCount');
    const lastVisit = localStorage.getItem('wanderAI_lastVisit');
    const now = new Date().getTime();
    
    // Consider it a new visit if more than 30 minutes have passed
    const thirtyMinutes = 30 * 60 * 1000;
    const isNewSession = !lastVisit || (now - parseInt(lastVisit)) > thirtyMinutes;
    
    if (isNewSession) {
      const newCount = storedCount ? parseInt(storedCount) + 1 : 1;
      localStorage.setItem('wanderAI_visitCount', newCount.toString());
      localStorage.setItem('wanderAI_lastVisit', now.toString());
      setVisitCount(newCount);
      setIsNewVisit(true);
      
      // Reset animation after it plays
      setTimeout(() => setIsNewVisit(false), 1000);
    } else {
      setVisitCount(storedCount ? parseInt(storedCount) : 1);
    }
  }, []);

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="visit-counter">
      <div className="counter-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </div>
      <div className="counter-content">
        <span className="counter-label">Total Visits</span>
        <span className={`counter-number ${isNewVisit ? 'animate' : ''}`}>
          {formatNumber(visitCount)}
        </span>
      </div>
    </div>
  );
}

export default VisitCounter;
