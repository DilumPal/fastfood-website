import React, { useState, useEffect, useMemo } from 'react';
import './MenuPage.css';

// Component for a single menu item card (UNCHANGED)
const MenuItemCard = ({ item }) => {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        console.log(`Added ${quantity} x ${item.name} to order.`);
        alert(`Added ${quantity} x ${item.name} to the order!`);
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
                    onClick={handleAddToCart}
                >
                    ADD TO ORDER
                </button>
            </div>
        </div>
    );
};


// Main Menu Page Component
const MenuPage = () => {
    const [menu, setMenu] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Search state is now the direct driver of the filter
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

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

    // Filter categories for the suggestions dropdown
    const filteredSuggestions = useMemo(() => {
        if (searchTerm.length < 2) return [];
        const term = searchTerm.toLowerCase();
        return allCategories.filter(cat => cat.toLowerCase().includes(term));
    }, [searchTerm, allCategories]);

    // --- SEARCH / FILTER HANDLERS ---
    
    // This is primarily used by the suggestions to quickly set the search term to a category
    const handleSuggestionClick = (category) => {
        setSearchTerm(category);
        setShowSuggestions(false); // Hide suggestions after selection
    };

    // Filter the entire menu structure based on the current 'searchTerm' state
    const filteredMenu = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return menu;
        
        const filtered = {};

        // Iterate through all categories
        Object.entries(menu).forEach(([category, items]) => {
            // Check if the search term matches a category name exactly
            if (category.toLowerCase() === term) {
                 // If it's an exact category match, return only that category
                 filtered[category] = items;
                 return; 
            }
            
            // ITEM FILTERING LOGIC: Match item name that INCLUDES the term
            const matchingItems = items.filter(item => 
                // *** KEY CHANGE: Using includes() instead of startsWith() ***
                item.name.toLowerCase().includes(term)
            );

            // Keep the category section if any items match
            if (matchingItems.length > 0) {
                filtered[category] = matchingItems;
            }
        });
        
        // If an exact category match was found, return it immediately
        // (This handles the case where a user types a full category name like 'Burgers')
        if (Object.keys(filtered).length === 1 && filtered[Object.keys(filtered)[0]] === menu[Object.keys(filtered)[0]]) {
            return filtered;
        }

        return filtered;
    }, [menu, searchTerm]); // Filter depends directly on the searchTerm state

    // Convert filtered categories object to an array of [categoryName, itemsArray] pairs
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
            <h1 className="menu-page-title">The YumZone Menu</h1>
            <p className="menu-page-subtitle">Freshness delivered with velocity.</p>

            {/* --- SEARCH BAR JSX --- */}
            <div className="search-container">
                <div className="search-input-group">
                    <input
                        type="text"
                        placeholder="Type to filter items or search categories..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => {
                            // Live Filtering: Update searchTerm on every keystroke
                            setSearchTerm(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') setShowSuggestions(false);
                        }}
                    />
                    {/* The GO button is now mainly for formalizing a suggestion/category search */}
                    <button className="search-go-btn" onClick={() => setShowSuggestions(false)}>
                        GO
                    </button>

                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="suggestions-dropdown">
                            {filteredSuggestions.map(suggestion => (
                                <div 
                                    key={suggestion}
                                    className="suggestion-item"
                                    onMouseDown={(e) => { 
                                        // Use onMouseDown to prevent onBlur from firing before click
                                        e.preventDefault(); 
                                        handleSuggestionClick(suggestion);
                                    }}
                                >
                                    {suggestion} (Category)
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* --- END SEARCH BAR JSX --- */}
            
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
                                <MenuItemCard key={item.id} item={{ ...item, category: category }} /> 
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