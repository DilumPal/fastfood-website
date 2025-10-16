import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css'; 

const HomePage = () => {
  // CRITICAL: Get the authentication state and functions from context
  const { isAuthenticated, logout, user } = useAuth(); 

  const handleLogout = () => {
    logout();
  };

  // NEW: Component for the Top-Right Authentication Links/Buttons
  const AuthCorner = () => {
    if (isAuthenticated) {
      // Show Log Out
      return (
        <button 
          onClick={handleLogout} 
          className="auth-corner-button log-out-button" 
        >
          LOG OUT
        </button>
      );
    } else {
      // Show Log In and Sign Up
      return (
        <>
          <Link 
            to="/login" 
            className="auth-corner-button log-in-button"
          >
            LOG IN
          </Link>
          <Link 
            to="/signup" 
            className="auth-corner-button sign-up-button" 
          >
            SIGN UP
          </Link>
        </>
      );
    }
  };
  
  // NEW: Component for the Top-Middle Welcome Message
  const WelcomeMessage = () => {
    if (isAuthenticated) {
      // Display first name or generic "USER" 
      return (
        <div className="welcome-message">
          WELCOME, {user?.fullName?.split(' ')[0]?.toUpperCase() || 'USER'}!
        </div>
      );
    }
    return null; // Nothing to display if not logged in
  };

  return (
    <div className="home-container">
      <header className="main-header">
        <div className="logo-letters1">🥯🧀🥞🌭🍔🍟🍕🥪</div>
        <div className="logo">YumZone</div>
        <div className="logo-letters2">🌮🌯🍣🍝🍜🥧🍩🍪</div>
      </header>
      
      {/* NEW: Place AuthCorner and WelcomeMessage outside the main header and button group */}
      <div className="hero">
        <div className="top-ui-elements">
            <WelcomeMessage />
            <div className="auth-corner">
                <AuthCorner />
            </div>
        </div>

        <h1 className="headline">Your Crave, Accelerated.</h1>
        <h2 className="sub-headline">Freshness Meets Velocity. Every Time.</h2>

        {/* The main action buttons are now the only elements in this group */}
        <div className="button-group">
          
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