import React from 'react';
import { Link } from 'react-router-dom';
// IMPORT THE SEPARATE CSS FILE HERE
import './HomePage.css'; 


const HomePage = () => {
  return (
    // 1. Replaced style={styles.container} with className="home-container"
    <div className="home-container">
      
      {/* 2. Replaced style={styles.hero} with className="hero" */}
      <div className="hero">
        <h1 className="headline">Your Crave, Accelerated.</h1>
        <h2 className="sub-headline">Freshness Meets Velocity. Every Time.</h2>

        <div className="button-group">
          
          {/* 3. Applied class names to links */}
          <Link 
            to="/menu" 
            className="menu-button"
          >
            OUR MENU
          </Link>
          
          <Link 
            to="/order" 
            className="order-button"
          >
            PLACE ORDER
          </Link>
          
          <Link 
            to="/about" 
            className="about-button"
          >
            ABOUT US
          </Link>
        </div>
      </div>

      {/* 4. Feature Zones */}
      <div className="features">
        
        {/* Added class names for card and specific border style */}
        <div className="feature-card velocity">
          <div className="icon-placeholder" style={{ color: 'var(--color-electric-blue)'}}>⚡</div>
          <h3>Lightning-Fast Service</h3>
          <p>Your order, crafted and delivered with unmatched speed. No waiting, just satisfaction.</p>
        </div>

        <div className="feature-card freshness">
          <div className="icon-placeholder" style={{ color: 'var(--color-hot-pink)'}}>🌱</div>
          <h3>Peak Freshness, Always</h3>
          <p>We source only the finest, freshest elements to fuel your day. Quality you can taste.</p>
        </div>

        <div className="feature-card atmosphere">
          <div className="icon-placeholder" style={{ color: 'var(--color-zesty-lime)'}}>✨</div>
          <h3>Your Energy Hub</h3>
          <p>More than a meal—it's an experience. Come for the speed, stay for the vibrant atmosphere.</p>
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;