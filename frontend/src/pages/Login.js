import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Import the new CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      // Confirmed URL structure: http://localhost/fastfood-website/api/login.php
      const response = await fetch('http://localhost/fastfood-website/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json(); 

      if (data.success) {
        setMessage(data.message);
        setIsError(false);
        // Navigate to the Home Page (/) upon successful login
        setTimeout(() => {
          navigate('/'); 
        }, 1500);
      } else {
        // This will display the specific error returned by PHP (e.g., 'Invalid email or password.')
        setMessage(data.message || 'Login failed. Please try again.'); 
        setIsError(true);
      }
    } catch (error) {
      console.error('Network Error:', error);
      // Fallback message if the network call fails completely (should be rare now)
      setMessage('A network error occurred. Check console for details. (Error Type: ' + error.name + ')');
      setIsError(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Log Into Your YumZone Account</h1>
        
        {/* Display response message */}
        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <p className="signup-prompt">
          Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;