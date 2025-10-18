// OrderContext.js
import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    // Cart items state: { id, name, price, quantity }
    const [cartItems, setCartItems] = useState([]);

    // Function to add or update an item in the cart
    const addToCart = (itemDetails) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === itemDetails.id);

            if (existingItem) {
                // If item exists, update its quantity
                return prevItems.map(i =>
                    i.id === itemDetails.id
                        ? { ...i, quantity: i.quantity + itemDetails.quantity }
                        : i
                );
            } else {
                // If it's a new item, add it to the cart
                return [...prevItems, itemDetails];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId, newQuantity) => {
        setCartItems(prev => 
            prev.map(item => 
                item.id === itemId 
                    ? { ...item, quantity: Math.max(1, newQuantity) } 
                    : item
            ).filter(item => item.quantity > 0) // Remove if quantity drops to 0 or less
        );
    };

    const clearCart = () => setCartItems([]);
    
    // Calculate total price for convenience
    const orderTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <OrderContext.Provider 
            value={{ 
                cartItems, 
                orderTotal, 
                addToCart, 
                removeFromCart, 
                updateQuantity, 
                clearCart 
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useCart = () => {
    return useContext(OrderContext);
};