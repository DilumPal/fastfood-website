// OrdersPage.js
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/OrderContext'; 
import { useAuth } from '../context/AuthContext'; 
import './MenuPage.css'; // Re-use styles

// Component for a single item in the order list (Copied from previous response)
const OrderItemRow = ({ item, removeFromCart, updateQuantity }) => {
    const maxQuantity = 99;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px dashed #ccc' }}>
            
            <div style={{ flex: 3 }}>
                <h4 style={{ margin: '0', fontSize: '1.2rem' }}>{item.name}</h4>
                <p style={{ margin: '0', color: '#666' }}>Unit Price: ${item.price.toFixed(2)}</p>
            </div>
            
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px', minWidth: '250px' }}>
                <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <input 
                        type="number" 
                        min="1" 
                        max={maxQuantity}
                        value={item.quantity} 
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)} 
                        style={{ width: '40px'}}
                    />
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
    );
};


const OrdersPage = () => {
    const { cartItems, orderTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth(); 
    
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    // The handleCheckout function MUST NOT be async, and MUST NOT include functions in state
    const handleCheckout = () => { 
        if (cartItems.length === 0) {
            alert("Your cart is empty! Please add items from the menu.");
            return;
        }

        const orderData = {
            // Include user_id if logged in (assuming user object has an 'id' property)
            user_id: user?.id || null, 
            customer_name: user?.fullName || "Guest Customer", 
            customer_phone: user?.phone || null, 
            customer_address: user?.address || null, 
            total: orderTotal.toFixed(2),
            items: cartItems.map(item => ({
                menu_item_id: item.id,
                quantity: item.quantity
            }))
        };
        
        // **FIX:** Only pass the serializable `orderData` object.
        navigate('/payment', { 
            state: { 
                orderData: orderData,
            } 
        });
    };

    return (
        <div className="menu-container"> 
            {/* Link back to Home */}
            <Link to="/" className="home-button" style={{ top: '25px', left: '25px', backgroundColor: 'var(--color-hot-pink)' }}>
                &larr; Back to Home
            </Link>
            
            {/* Link to Menu */}
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
                        <OrderItemRow 
                            key={item.id} 
                            item={item} 
                            removeFromCart={removeFromCart} 
                            updateQuantity={updateQuantity} 
                        />
                    ))}
                    
                    {/* Order Summary and Checkout Button */}
                    <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
                        <h3 style={{ fontSize: '1.8rem', margin: '0' }}>
                            Order Total: <span style={{ color: 'var(--color-electric-blue)' }}>${orderTotal.toFixed(2)}</span>
                        </h3>
                        
                        {/* PLACE ORDER BUTTON */}
                        <button 
                            onClick={handleCheckout} // Now calls the non-async navigator
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            style={{ 
                                marginTop: '20px', 
                                padding: '15px 30px',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                background: 'linear-gradient(45deg, var(--color-electric-blue, #4d88ff), var(--color-hot-pink, #ff007f))', 
                                color: 'white',
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                transition: 'transform 0.2s ease-in-out'
                            }}
                        >
                            PROCEED TO PAYMENT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;