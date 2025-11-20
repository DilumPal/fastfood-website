//MenuPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/OrderContext'; 
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './MenuPage.css';
import { Link } from 'react-router-dom';

const MenuItemCard = ({ item, addToCart, isAuthenticated, navigate, showNotification }) => { 
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            showNotification("Please login to add items to your order 😊", 'error', () => navigate('/login'));
            return;
        }

        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: quantity
        });

        // Success notification for adding to cart
        showNotification(`Added ${quantity}x ${item.name} to your order!`, 'success');
        setQuantity(1);
    };

    const handleCustomize = () => {
        if (!isAuthenticated) {
            showNotification("Please login to customize items 😊", 'error', () => navigate('/login'));
            return;
        }

        navigate('/customize', { 
            state: { 
                item: { 
                    ...item, 
                    quantity: quantity
                } 
            } 
        });
    };


    return (
        <div className="menu-card">
            <div className="card-image-container">
                <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="item-image"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg' }} 
                />
                {item.category === 'Specials' && <span className="special-badge">HOT 🔥</span>}
            </div>
            
            <div className="card-content">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                
                <div className="card-footer">
                    <span className="item-price">${item.price.toFixed(2)}</span>
                    
                    <div className="quantity-control">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                        <input type="number" min="1" value={quantity} readOnly />
                        <button onClick={() => setQuantity(q => q + 1)}>+</button>
                    </div>
                </div>
                
                <div className="card-button-group">
                    <button 
                        className="menu-card-btn customize-btn" 
                        onClick={handleCustomize}
                    >
                        CUSTOMIZE
                    </button>
                    
                    <button 
                        className="menu-card-btn add-to-order-btn-small" 
                        onClick={handleAddToCart}
                    >
                        ADD
                    </button>
                </div>
            </div>
        </div>
    );
};

const BouncingBurger = () => (
    <div className="bouncing-menu-burger">
        <div className="lettuce"></div>
        <div className="cheese"></div>
        <div className="patty"></div>
        <div className="bun-bottom"></div>
        <div className="shadow"></div>
    </div>
);

const MenuPage = () => {
    const [menu, setMenu] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { cartItems, orderTotal, addToCart } = useCart(); 
    
    // New state for custom notifications
    const [notification, setNotification] = useState({
        message: '',
        type: '', // 'success' or 'error'
        show: false,
        action: null // Optional callback function for action after showing
    });

    const showNotification = (message, type = 'success', action = null, duration = 3000) => {
        setNotification({ message, type, show: true, action });
        
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
            // Execute action after notification fades out (e.g., redirect)
            if (action) {
                action(); 
            }
        }, duration);
    };


    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch('http://localhost/fastfood-website/api/get_menu.php'); 
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setMenu(data);
                setLoading(false);
            } catch (err) {
                console.error("Could not fetch menu:", err);
                setError('Failed to load menu. Please check the PHP server connection and CORS settings.');
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const allCategories = useMemo(() => Object.keys(menu), [menu]);

    const filteredSuggestions = useMemo(() => {
        if (searchTerm.length < 2) return [];
        const term = searchTerm.toLowerCase();
        return allCategories.filter(cat => cat.toLowerCase().includes(term));
    }, [searchTerm, allCategories]);

    const handleSuggestionClick = (category) => {
        setSearchTerm(category);
        setShowSuggestions(false); 
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setShowSuggestions(event.target.value.trim().length > 0); 
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault(); 
        setSearchTerm(searchTerm.trim()); 
        setShowSuggestions(false); 
    };

    const filteredMenu = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return menu;
        
        const filtered = {};

        Object.entries(menu).forEach(([category, items]) => {
            if (category.toLowerCase() === term) {
                 filtered[category] = items;
                 return; 
            }
            
            const matchingItems = items.filter(item => 
                item.name.toLowerCase().includes(term)
            );

            if (matchingItems.length > 0) {
                filtered[category] = matchingItems;
            }
        });
        
        if (Object.keys(filtered).length === 1 && filtered[Object.keys(filtered)[0]] === menu[Object.keys(filtered)[0]]) {
            return filtered;
        }

        return filtered;
    }, [menu, searchTerm]); 

    const categoriesToDisplay = Object.entries(filteredMenu);


    if (loading) {
        return <div className="menu-container loading">Loading delicious items...</div>;
    }

    if (error) {
        return <div className="menu-container error">{error}</div>;
    }
    
    return (
        <div className="menu-container">
            {/* Custom Notification Component */}
            <div 
                className={`notification ${notification.show ? 'show' : ''} ${notification.type}`}
            >
                {notification.message}
            </div>
            
            <Link to="/" className="home-button">
                &larr; Back to Home
            </Link>
            
            {isAuthenticated && (
                <Link
                    to="/order"
                    className="home-button"
                    style={{
                        left: 'unset',
                        right: '25px',
                        backgroundColor: 'rgb(255, 255, 0)'
                    }}
                >
                    🛒 ({cartItems.length}) - ${orderTotal.toFixed(2)}
                </Link>
            )}
            
            <div className="menu-header-flex">
                <BouncingBurger />
                <h1 className="menu-page-title">The YumZone Menu</h1>
                <BouncingBurger />
            </div>
            <p className="menu-page-subtitle">Your cravings, satisfied instantly.</p> 

            <div className="search-container">
                <form className="search-input-group" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search for items or categories (e.g., Burgers, Cola, Spicy)"
                        className="search-input"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => searchTerm && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} 
                    />
                    <button type="submit" className="search-go-btn">GO</button>

                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="suggestions-dropdown">
                            {filteredSuggestions.map((category) => (
                                <div 
                                    key={category}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(category)}
                                >
                                    Category: **{category}**
                                </div>
                            ))}
                        </div>
                    )}
                </form>
            </div>
            
            {searchTerm && (
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <p style={{ color: 'rgba(248, 248, 248, 0.7)' }}>
                        Showing results for: **"{searchTerm}"**. 
                        <button 
                            onClick={() => setSearchTerm('')} 
                            style={{ 
                                marginLeft: '10px', 
                                background: 'transparent', 
                                border: '1px solid #FF007F', 
                                color: '#FF007F', 
                                padding: '5px 10px', 
                                borderRadius: '5px', 
                                cursor: 'pointer' 
                            }}
                        >
                            Clear Search
                        </button>
                    </p>
                </div>
            )}

            {categoriesToDisplay.length > 0 ? (
                categoriesToDisplay.map(([category, items]) => (
                    <section key={category} className="menu-category">
                        <h2 className="category-title">{category}</h2>
                        <div className="category-items-grid">
                            {items.map(item => (
                                <MenuItemCard 
                                    key={item.id} 
                                    item={{ ...item, category: category }} 
                                    addToCart={addToCart} 
                                    isAuthenticated={isAuthenticated}
                                    navigate={navigate}
                                    showNotification={showNotification}
                                /> 
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                <div className="empty-menu" style={{ textAlign: 'center', fontSize: '1.5rem', color: '#ccc' }}>
                    No menu items or categories match your search.
                </div>
            )}
        </div>
    );
};

export default MenuPage;