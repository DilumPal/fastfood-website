import React, { useState, useEffect } from 'react';
import './MenuPage.css';

// Component for a single menu item card
const MenuItemCard = ({ item }) => {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        // In a real application, this would dispatch an action to an order context or API
        console.log(`Added ${quantity} x ${item.name} to order.`);
        alert(`Added ${quantity} x ${item.name} to the order!`);
    };

    return (
        <div className="menu-card">
            <div className="card-image-container">
                <img 
                    // IMPORTANT: Adjust this path based on where your images are relative to the React public folder
                    src={item.image_url} 
                    alt={item.name} 
                    className="item-image"
                    // Placeholder for missing images
                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg' }} 
                />
                {/* Example of a dynamic badge */}
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

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // *** UPDATED FETCH URL FOR PHP BACKEND ***
                // Assumes your PHP script is accessible at this URL (e.g., XAMPP/WAMP default setup)
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

    if (loading) {
        return <div className="menu-container loading">Loading delicious items...</div>;
    }

    if (error) {
        return <div className="menu-container error">{error}</div>;
    }
    
    // Convert categories object to an array of [categoryName, itemsArray] pairs
    const categories = Object.entries(menu);

    return (
        <div className="menu-container">
            <h1 className="menu-page-title">The YumZone Menu</h1>
            <p className="menu-page-subtitle">Freshness delivered with velocity.</p>

            {categories.length > 0 ? (
                categories.map(([category, items]) => (
                    <section key={category} className="menu-category">
                        <h2 className="category-title">{category}</h2>
                        <div className="category-items-grid">
                            {items.map(item => (
                                // PHP backend doesn't return 'category' in the item object, so we pass it manually
                                <MenuItemCard key={item.id} item={{ ...item, category: category }} /> 
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                <div className="empty-menu">No menu items available at the moment.</div>
            )}
        </div>
    );
};

export default MenuPage;