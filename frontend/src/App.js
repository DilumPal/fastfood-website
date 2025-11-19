// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import { OrderProvider } from './context/OrderContext';

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import PaymentPage from './pages/PaymentPage';
import ProtectedRoute from "./components/ProtectedRoute";
import AboutPage from './pages/AboutPage';
import CustomizePage from './pages/CustomizePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';

function App() {
  return (
    <OrderProvider>
    <AuthProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/order" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/customize" element={<CustomizePage/>}/>
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/about" element={<AboutPage/>}/>
          <Route path="/admin-analytics" element={<AdminAnalytics />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
    </OrderProvider>
  );
}

export default App;