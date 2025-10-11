import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your new home page component
import HomePage from './pages/HomePage';

// Assuming you will create these page components later
// import MenuPage from './pages/MenuPage'; 
// import OrderPage from './pages/OrderPage';
// import AboutPage from './pages/AboutPage';

function App() {
  return (
    // 1. BrowserRouter allows the app to use routing
    <Router>
      <Routes>
        
        {/* 2. Set HomePage as the primary component for the root path ("/") */}
        <Route path="/" element={<HomePage />} />
        
        {/* 3. Placeholder Routes for your buttons (Menu, Order, About Us) */}
        {/* You will replace the <div>...</div> with the actual imported component later */}
        <Route path="/menu" element={<div>Menu Page Coming Soon!</div>} />
        <Route path="/order" element={<div>Order/Checkout Page</div>} />
        <Route path="/about" element={<div>About Us Page Content</div>} />
        
        {/* Optional: A route to catch any undefined path */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
        
      </Routes>
    </Router>
  );
}

export default App;