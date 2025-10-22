import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// CRITICAL: Import the AuthProvider you are creating
import { AuthProvider } from './context/AuthContext'; 
import { OrderProvider } from './context/OrderContext';

// Import your page components
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import PaymentPage from './pages/PaymentPage';
// import other pages (e.g., Menu, Order, About)

function App() {
  return (
    // CRITICAL: Wrap the entire Router with AuthProvider
    <AuthProvider>
      <OrderProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/order" element={<OrdersPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;