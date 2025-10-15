import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // CRITICAL: Import useAuth (Adjust path if needed)
import './HomePage.css'; 

const HomePage = () => {
  // CRITICAL: Get the authentication state and functions from context
  const { isAuthenticated, logout, user } = useAuth(); 

  const handleLogout = () => {
    logout();
  };

  const AuthButtons = () => {
    // If the user is authenticated (logged in)
    if (isAuthenticated) {
      // Show Profile/Welcome and Log Out
      return (
        <>
          <Link 
            to="/profile" 
            className="order-button"
            // Display first name or generic "USER" 
            style={{ minWidth: '150px' }} 
          >
            WELCOME, {user?.fullName?.split(' ')[0]?.toUpperCase() || 'USER'}
          </Link>
          
          <button 
            onClick={handleLogout} 
            className="about-button" 
          >
            LOG OUT
          </button>
        </>
      );
    } else {
      // If the user is not authenticated (logged out)
      // Show Log In and Sign Up
      return (
        <>
          <Link 
            to="/login" 
            className="order-button"
          >
            LOG IN
          </Link>
          <Link 
            to="/signup" 
            className="menu-button" 
          >
            SIGN UP
          </Link>
        </>
      );
    }
  };

  return (
    <div className="home-container">
      <header className="main-header">
        <div className="logo-letters1">🥯🧀🥞🌭🍔🍟🍕🥪</div>
        <div className="logo">YumZone</div>
        <div className="logo-letters2">🌮🌯🍣🍝🍜🥧🍩🍪</div>
      </header>
      <div className="hero">
        <h1 className="headline">Your Crave, Accelerated.</h1>
        <h2 className="sub-headline">Freshness Meets Velocity. Every Time.</h2>

        <div className="button-group">
          
          {/* Static Buttons (Always Visible) */}
          <Link to="/menu" className="menu-button">
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

          {/* Conditional Authentication Buttons */}
          <AuthButtons />
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