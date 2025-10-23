// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useCart } from "./OrderContext";


// Create the Context object
const AuthContext = createContext();

// Create the Provider component
export const AuthProvider = ({ children }) => {
  // Check localStorage for persisted login status on load
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  
  // State to hold user info (optional, but good practice)
  const [user, setUser] = useState(null);
  const { clearCart } = useCart();

  // Effect to sync state with localStorage whenever isAuthenticated changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isAuthenticated);
  }, [isAuthenticated]);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData); // {id: 1, name: "John Doe"}
  };

  const logout = () => {
  setIsAuthenticated(false);
  setUser(null);
  localStorage.removeItem("isLoggedIn");
  clearCart(); // ✅ clear cart
};


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};