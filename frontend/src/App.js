import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// CRITICAL: Import the AuthProvider you are creating
import { AuthProvider } from './context/AuthContext'; 

// Import your page components
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
// import other pages (e.g., Menu, Order, About)

function App() {
  return (
    // CRITICAL: Wrap the entire Router with AuthProvider
    <AuthProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;