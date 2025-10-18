// OrdersPage.js
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/OrderContext'; // ⚠️ Get cart logic
import { useAuth } from '../context/AuthContext'; // ⚠️ Get customer info
import './MenuPage.css'; // Re-use styles

const OrdersPage = () => {
    // Get cart state and functions
    const { cartItems, orderTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    // Get user state from AuthContext
    const { user, isAuthenticated } = useAuth(); 
    
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty! Please add items from the menu.");
            return;
        }

        // 1. Prepare data for the backend
        const orderData = {
            // Use logged-in user's name if available, otherwise use a placeholder
            customer_name: user?.fullName || "Guest Customer", 
            // NOTE: Add other customer fields if required (phone, address, etc.)
            total: orderTotal.toFixed(2),
            items: cartItems.map(item => ({
                menu_item_id: item.id,
                quantity: item.quantity
            }))
        };
        
        // 2. Call the backend API
        try {
            const response = await fetch('http://localhost/fastfood-website/api/submit_order.php', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(orderData),
            });
            
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const result = await response.json();
            
            if (result.success) {
                alert(`Order successfully placed! Order ID: ${result.order_id}.`);
                clearCart(); // Clear the client-side cart after successful submission
                navigate('/'); // Link to the home page through redirection
            } else {
                alert('Failed to place order: ' + result.error);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('An error occurred while placing your order. Please try again.');
        }
    };

    return (
        <div className="menu-container"> 
            <Link to="/" className="home-button" style={{ top: '25px', left: '25px', backgroundColor: 'var(--color-hot-pink)' }}>
                &larr; Back to Home
            </Link>
            
            <Link to="/menu" className="home-button" style={{ top: '25px', right: '25px', left: 'unset', backgroundColor: 'var(--color-zesty-lime)' }}>
                View Menu
            </Link>

            <h1 className="menu-page-title" style={{ marginTop: '50px' }}>Your Order Summary</h1>
            <p className="menu-page-subtitle">Ready to check out, {user?.fullName?.split(' ')[0] || "Guest"}?</p>
            

            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', fontSize: '1.5rem', color: '#ccc', padding: '100px 20px' }}>
                    Your cart is empty! <Link to="/menu" style={{ color: 'var(--color-zesty-lime)' }}>Start Ordering</Link>
                </div>
            ) : (
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', backgroundColor: 'var(--color-secondary, #F8F8F8)', borderRadius: '15px', color: 'var(--color-primary, #0A0A0A)', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                    
                    {/* List of Cart Items */}
                    {cartItems.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px dashed #ccc' }}>
                            
                            {/* Item Name and Price */}
                            <div style={{ flex: 3 }}>
                                <h4 style={{ margin: '0', fontSize: '1.2rem' }}>{item.name}</h4>
                                <p style={{ margin: '0', color: '#666' }}>Unit Price: ${item.price.toFixed(2)}</p>
                            </div>
                            
                            {/* Quantity Control and Subtotal */}
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px', minWidth: '250px' }}>
                                <div className="quantity-control">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                    <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)} style={{ width: '40px'}}/>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                </div>
                                
                                <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-electric-blue)' }}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>

                            <button 
                                onClick={() => removeFromCart(item.id)} 
                                style={{ background: 'var(--color-hot-pink, #FF007F)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginLeft: '20px', fontWeight: '700' }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                    
                    {/* Order Summary and Checkout Button */}
                    <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '2px solid var(--color-primary)', paddingTop: '20px' }}>
                        <h3 style={{ fontSize: '1.8rem', margin: '0' }}>
                            Order Total: <span style={{ color: 'var(--color-electric-blue)' }}>${orderTotal.toFixed(2)}</span>
                        </h3>
                        
                        {/* ⚠️ PLACE ORDER BUTTON */}
                        <button 
                            onClick={handleCheckout} 
                            style={{ 
                                marginTop: '20px', 
                                padding: '15px 30px',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                // Use the same gradient as the home page button
                                background: 'linear-gradient(45deg, var(--color-electric-blue), var(--color-hot-pink))', 
                                color: 'var(--color-primary)'
                            }}
                        >
                            PLACE ORDER
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;