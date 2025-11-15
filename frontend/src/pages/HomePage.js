// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css'; 

const HomePage = () => {
  const { isAuthenticated, logout, user } = useAuth(); 

  const handleLogout = () => {
    logout();
  };

  const AuthCorner = () => {
    if (isAuthenticated) {
      return (
        <button 
          onClick={handleLogout} 
          className="auth-corner-button log-out-button" 
        >
          LOG OUT
        </button>
      );
    } else {
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
  
  const WelcomeMessage = () => {
    if (isAuthenticated) { 
      return (
        <div className="welcome-message">
          WELCOME, {user?.fullName?.split(' ')[0]?.toUpperCase() || 'USER'}!
        </div>
      );
    }
    return null; 
  };

  return (
    <div className="home-container">
      <header className="main-header">
        <div className="logo-letters1"><span className="bouncing-emoji">🥯</span>🧀<span className="bouncing-emoji">🥞</span>🌭<span className="bouncing-emoji">🍔</span>🍟<span className="bouncing-emoji">🍕</span>🥪</div>
        <div className="logo">YumZone</div>
        <div className="logo-letters2"><span className="bouncing-emoji">🌮</span>🌯<span className="bouncing-emoji">🍣</span>🍝<span className="bouncing-emoji">🍔</span>🥧<span className="bouncing-emoji">🍩</span>🍪</div>
      </header>
      
      <div className="hero">
        <div className="top-ui-elements">
            <WelcomeMessage />
            <div className="auth-corner">
                <AuthCorner />
            </div>
        </div>

        <h1 className="headline">Your Crave, Accelerated.</h1>
        <h2 className="sub-headline">Freshness Meets Velocity. Every Time.</h2>

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

      <div className="features">
        
        {/* Velocity Card */}
        <div className="feature-card velocity">
          <div className="card-inner">
            <div className="card-front">
              <div className="icon-placeholder" style={{ color: 'var(--color-electric-blue)'}}>⚡</div>
              <h3>Lightning-Fast Service</h3>
              <p>Your order, crafted and delivered with unmatched speed. No waiting, just satisfaction.</p>
            </div>
            <div className="card-back velocity-back">
              <h3>⚡ Our Speed Promise</h3>
              <p>No waiting, no delays — just lightning-fast responses and on-time delivery every time.</p>
            </div>
          </div>
        </div>

        {/* Freshness Card */}
        <div className="feature-card freshness">
          <div className="card-inner">
            <div className="card-front">
              <div className="icon-placeholder" style={{ color: 'var(--color-hot-pink)'}}>🌱</div>
              <h3>Peak Freshness, Always</h3>
              <p>We source only the finest, freshest elements to fuel your day. Quality you can taste.</p>
            </div>
            <div className="card-back freshness-back">
              <h3>🌱 Quality Sourcing</h3>
              <p>We handpick every ingredient from trusted sources to ensure unmatched freshness and flavor.</p>
            </div>
          </div>
        </div>

        {/* Atmosphere Card */}
        <div className="feature-card atmosphere">
          <div className="card-inner">
            <div className="card-front">
              <div className="icon-placeholder" style={{ color: 'var(--color-zesty-lime)'}}>✨</div>
              <h3>Your Energy Hub</h3>
              <p>More than a meal—it's an experience. Come for the speed, stay for the vibrant atmosphere.</p>
            </div>
            <div className="card-back atmosphere-back">
              <h3>✨ Vibrant Experience</h3>
              <p>Feel the buzz — every moment here is designed to recharge your mind and spark your energy.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;