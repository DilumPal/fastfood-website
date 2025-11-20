// OrdersPage.js
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/OrderContext'; 
import { useAuth } from '../context/AuthContext'; 
import './MenuPage.css'; 

const renderCustomization = (details) => {
    if (!details || (details.added?.length === 0 && details.removed?.length === 0 && details.options?.length === 0)) return null;
    const optionsList = details.options?.map(o => `${o.title}: ${o.name}`).join('; ');
    
    return (
        <div style={{ marginTop: '5px', fontSize: '0.9rem', color: '#666' }}>
            {details.added?.length > 0 && (
                <p style={{ margin: '0' }}>
                    **Added:** {details.added.join(', ')}
                </p>
            )}
            {details.removed?.length > 0 && (
                <p style={{ margin: '0' }}>
                    **Removed:** {details.removed.join(', ')}
                </p>
            )}
            {details.options?.length > 0 && (
                <p style={{ margin: '0' }}>
                    **Options:** {optionsList}
                </p>
            )}
        </div>
    );
};


const OrderItemRow = ({ item, removeFromCart, updateQuantity }) => {
    const maxQuantity = 99;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '15px 0', borderBottom: '1px dashed #ccc' }}>
            
            <div style={{ flex: 3 }}>
                <h4 style={{ margin: '0', fontSize: '1.2rem' }}>{item.name}</h4>
                <p style={{ margin: '0', color: '#666' }}>Unit Price: ${item.price.toFixed(2)}</p>
                {item.customizationDetails && renderCustomization(item.customizationDetails)}
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
                
                <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-primary, #0A0A0A)' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                </span>
            </div>

            <button 
                onClick={() => removeFromCart(item.id)} 
                style={{ background: 'rgba(255, 0, 0, 1)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginLeft: '20px', fontWeight: '700' }}
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

    const handleCheckout = () => { 
        if (cartItems.length === 0) {
            alert("Your cart is empty! Please add items from the menu.");
            return;
        }

        const orderData = {
            user_id: user?.id || null, 
            customer_name: user?.fullName || "Guest Customer", 
            customer_phone: user?.phone || null, 
            customer_address: user?.address || null, 
            total: orderTotal.toFixed(2),
            items: cartItems.map(item => ({
                menu_item_id: item.menu_item_id || item.id, 
                quantity: item.quantity,
                customization_details: item.customizationDetails ? JSON.stringify(item.customizationDetails) : null, 
                final_unit_price: item.price, 
                item_name: item.name, 
            }))
        };
        
        navigate('/payment', { 
            state: { 
                orderData: orderData,
            } 
        });
    };

    return (
        <div className="menu-container"> 
            <Link to="/" className="home-button" style={{ top: '25px', left: '25px', backgroundColor: 'rgb(255, 136, 0)' }}>
                &larr; Back to Home
            </Link>
            
            <Link to="/menu" className="home-button" style={{ top: '25px', right: '25px', left: 'unset', backgroundColor: 'rgb(255, 136, 0)' }}>
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
                    
                    {cartItems.map(item => (
                        <OrderItemRow 
                            key={item.id} 
                            item={item} 
                            removeFromCart={removeFromCart} 
                            updateQuantity={updateQuantity} 
                        />
                    ))}
                    
                    <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
                        <h3 style={{ fontSize: '1.8rem', margin: '0' }}>
                            Order Total: <span style={{ color: 'var(--color-primary)' }}>${orderTotal.toFixed(2)}</span>
                        </h3>
                        
                        <button 
                            onClick={handleCheckout} 
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
                                background: 'linear-gradient(45deg, var(--color-hot-pink), var(--color-zesty-lime))', 
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                transition: 'transform 0.2s ease-in-out',
                                color: 'black'
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