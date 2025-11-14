import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  // Get the login function from context
  const { login } = useAuth(); 

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
      // Ensure path is correct, e.g., 'http://localhost/fastfood-website/api/login.php'
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
        
        // ⚠️ CRITICAL: Pass the new 'role' to the login context function
        login({ 
            userId: data.userId, 
            fullName: data.fullName, 
            role: data.role, // <-- NEW: Pass the user's role
            token: 'dummy-token' 
        }); 

        // ⚠️ NEW: Admin redirection logic
        if (data.role === 'admin') {
            navigate('/admin'); // Redirect to AdminDashboard
        } else {
            navigate('/'); // Redirect customer to home page
        }
        
      } else {
        setMessage(data.message);
        setIsError(true);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setMessage('An error occurred during login. Check console for details. (Error Type: ' + error.name + ')');
      setIsError(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Log Into Your YumZone Account</h1>
        
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