import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      setIsError(true);
      return;
    }

    try {
      const response = await fetch('../backend/signup.php', { // Replace with your actual PHP path
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send only necessary data to the backend
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Sign-up successful! Redirecting to login...');
        setIsError(false);
        // Navigate or redirect the user after a brief delay
        setTimeout(() => {
          // Navigate to the Home Page (/) upon successful registration
          navigate('/'); 
        }, 1500);
      } else {
        setMessage(data.message || 'Sign-up failed. Please try again.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Network Error:', error);
      setMessage('A network error occurred. Please check your connection.');
      setIsError(true);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">Create Your YumZone Account</h1>
        
        {/* Display response message */}
        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

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
              minLength="8"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        <p className="login-prompt">
          Already have an account? <Link to="/login" className="login-link">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;