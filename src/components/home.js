import React from 'react';
import './home.css';

const HomePage = () => {
  const handleClick = () => {
    window.location.href = '/about'; 
  };

  return (
    <div className="home-page">
      <div className="black-container">
        <h1>Welcome to NPS ExpressPass</h1>
        <div className="content-area">
          <button className="welcome-button" onClick={handleClick}>
            Welcome to NPS ExpressPass
          </button>
          <input type="text" placeholder="Enter some text..." />
          <textarea placeholder="Enter more text..."></textarea>
        </div>
        <div className="widget-area">
          <h3>Widget Area</h3>
          <p>This is a placeholder for widgets.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
