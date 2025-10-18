import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/OrderContext'; // ⚠️ NEW IMPORT
import './MenuPage.css';

// Component for a single menu item card (MODIFIED)
// ⚠️ Now accepts addToCart from parent
const MenuItemCard = ({ item, addToCart }) => { 
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        // Pass the item details and quantity to the context function
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: quantity
        });
        // Optional: Reset quantity to 1 after adding
        setQuantity(1); 
        console.log(`Added ${quantity} x ${item.name} to order.`);
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
                
                <button 
                    className="add-to-order-btn"
                    onClick={handleAddToCart} // Use the new handler
                >
                    ADD TO ORDER
                </button>
            </div>
        </div>
    );
};


// Main Menu Page Component (MODIFIED)
const MenuPage = () => {
    const [menu, setMenu] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Search state is now the direct driver of the filter
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // ⚠️ NEW: Get cart functions and total from context
    const { cartItems, orderTotal, addToCart } = useCart(); 

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
        setShowSuggestions(false); // Hide suggestions after selection
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
            {/* --- NEW: Home Button Link --- */}
            <a href="/" className="home-button">
                &larr; Back to Home
            </a>
            
            {/* ⚠️ NEW: Link to Orders Page */}
            <a href="/order" className="home-button" style={{ left: 'unset', right: '25px', backgroundColor: 'var(--color-electric-blue)'}}>
                🛒 ({cartItems.length}) - ${orderTotal.toFixed(2)}
            </a>
            
            <h1 className="menu-page-title">The YumZone Menu</h1>
            {/* ... (rest of the search bar and filter logic) */}
            
            {/* Show a reset button if the search term is active */}
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
                                    addToCart={addToCart} // ⚠️ Pass the context function
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