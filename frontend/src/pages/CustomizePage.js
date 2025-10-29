import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/OrderContext'; 
import { useAuth } from '../context/AuthContext';
// ⚠️ NEW IMPORT: Ensure this file is in the same directory and contains the config data
import { customizationConfig, allIngredients } from './customizationData'; 
import './CustomizePage.css'; // ⚠️ NEW IMPORT: Using the dedicated CSS file

// Helper to get ingredient price string
const getIngredientPrice = (price) => price > 0 ? `+ $${(price / 100).toFixed(2)}` : "Free";

// Helper to group ingredients by its sub-category (e.g., Toppings, Sauces) for display
const groupIngredients = (ingredients) => {
    return ingredients.reduce((acc, ingredient) => {
        const subCategory = ingredient.category;
        if (!acc[subCategory]) {
            acc[subCategory] = [];
        }
        acc[subCategory].push(ingredient);
        return acc;
    }, {});
};


const CustomizePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const baseItem = location.state?.item;
    // Determine category and use 'Default' as fallback for items with no customization defined
    const itemCategory = baseItem?.category || 'Default';
    
    // Dynamically load configuration based on item category
    const config = customizationConfig[itemCategory] || customizationConfig['Default'];
    
    // --- State Initialization ---
    // Initialize state dynamically based on the configuration sections
    const initialCustomizations = useMemo(() => {
        return config.sections.reduce((acc, section) => {
            if (section.type === 'multi_select') {
                acc[section.key] = [...(section.defaultSelected || [])]; // Clone array for state
            } else if (section.type === 'single_select') {
                acc[section.key] = section.default || '';
            }
            return acc;
        }, {});
    }, [config.sections]);
    
    const [customizations, setCustomizations] = useState(initialCustomizations);
    const [quantity, setQuantity] = useState(baseItem?.quantity || 1);


    // Redirect and State Reset on Item Change
    useEffect(() => {
        if (!baseItem) {
            alert("No item selected for customization. Redirecting to menu.");
            navigate('/menu');
        } else {
             // Reset customizations state if the base item or category changes
             setCustomizations(initialCustomizations);
             setQuantity(baseItem.quantity || 1);
        }
    }, [baseItem, navigate, initialCustomizations]);
    
    
    // --- Customization Handlers ---
    
    // Handler for Multi-Select (Toppings, Sauces, Dips)
    const toggleMultiSelect = (key, itemId) => {
        const currentSelections = customizations[key];
        
        if (currentSelections.includes(itemId)) {
            // Remove item
            setCustomizations(prev => ({
                ...prev,
                [key]: prev[key].filter(id => id !== itemId)
            }));
        } else {
            // Add item
            setCustomizations(prev => ({
                ...prev,
                [key]: [...prev[key], itemId]
            }));
        }
    };
    
    // Handler for Single-Select (Combo Size, Crust Type)
    const handleSingleSelect = (key, itemId) => {
        setCustomizations(prev => ({ ...prev, [key]: itemId }));
    };


    // --- Price Calculation ---
    const calculateTotal = useMemo(() => {
        if (!baseItem) return 0;
        let basePrice = baseItem.price;
        let totalMultiplier = 1;
        let addedPrice = 0;
        
        // Loop through all dynamic sections to calculate price adjustments
        config.sections.forEach(section => {
            const selectedId = customizations[section.key];
            
            if (section.type === 'single_select') {
                const option = section.options.find(o => o.id === selectedId);
                totalMultiplier *= (option?.multiplier || 1);
            } 
            
            else if (section.type === 'multi_select') {
                // Calculate price from selected ingredients
                (selectedId || []).forEach(id => {
                    const ingredient = allIngredients.find(i => i.id === id);
                    addedPrice += (ingredient?.price || 0);
                });
            }
        });

        // Final total calculation: (Base Price + Added Ingredient Price) * Multiplier * Quantity
        // Note: Base price is in dollars, Added Price is in cents, so addedPrice / 100
        return (basePrice + (addedPrice / 100)) * totalMultiplier * quantity; 
    }, [baseItem, customizations, quantity, config.sections]);


    // --- Add To Cart Logic ---
    const handleAddToCart = () => {
        if (!isAuthenticated) {
            alert("Please login to add items to your order 😊");
            navigate('/login');
            return;
        }

        if (!baseItem) return;

        // Build a detailed string of customizations for the cart item name
        let fullName = baseItem.name;
        let addedItemsList = [];
        let removedItemsList = [];

        config.sections.forEach(section => {
            const selectedId = customizations[section.key];
            
            if (section.type === 'single_select') {
                const option = section.options.find(o => o.id === selectedId);
                if (option && option.id !== section.default) {
                    fullName += ` (${option.name})`;
                }
            } 
            
            else if (section.type === 'multi_select') {
                const defaultItems = section.defaultSelected || [];
                
                selectedId.forEach(id => {
                    if (!defaultItems.includes(id)) {
                        addedItemsList.push(allIngredients.find(i => i.id === id)?.name);
                    }
                });

                defaultItems.forEach(id => {
                    if (!selectedId.includes(id)) {
                        removedItemsList.push(allIngredients.find(i => i.id === id)?.name);
                    }
                });
            }
        });

        if (addedItemsList.length > 0) {
            fullName += ` (+${addedItemsList.join(', ')})`;
        }
        if (removedItemsList.length > 0) {
            fullName += ` (No ${removedItemsList.join(', ')})`;
        }
        
        // Add the customized item to the cart
        addToCart({
            id: baseItem.id + Date.now(), // Unique ID for customized item
            name: fullName,
            price: calculateTotal / quantity, // Calculate unit price
            quantity: quantity,
            customizations: customizations
        });

        alert(`Added ${quantity}x ${baseItem.name} to order for $${calculateTotal.toFixed(2)}!`);
        navigate("/menu"); // Navigate back to menu after adding
    };
    
    
    // --- Conditional Rendering Function for Options ---
    const renderCustomizationOptions = () => {
        // If the config has no sections, show a minimal customization message
        if (config.sections.length === 0) {
            return (
                <div className="custom-card">
                    <h3 className="card-header-title">No Customization Available</h3>
                    <p className="card-header-subtitle">This item can be added directly to the order.</p>
                </div>
            );
        }

        return config.sections.map((section) => {
            const selectedValue = customizations[section.key];
            
            // --- Single Select (e.g., Combo Size, Crust) ---
            if (section.type === 'single_select') {
                return (
                    <div key={section.key} className="custom-card combo-selector-card">
                        <h3 className="card-header-title">{section.title}</h3>
                        <p className="card-header-subtitle">{section.subtitle}</p>
                        <div className="combo-grid">
                            {section.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSingleSelect(section.key, option.id)}
                                    className={`combo-option ${selectedValue === option.id ? 'selected' : ''}`}
                                >
                                    <div className="combo-info">
                                        <span className="combo-name">{option.name}</span>
                                        {selectedValue === option.id && <span className="check-mark">✓</span>}
                                    </div>
                                    <p className="combo-description">{option.description}</p>
                                    {option.multiplier > 1 && (
                                        <span className="combo-badge">{((option.multiplier - 1) * 100).toFixed(0)}% more</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            }
            
            // --- Multi Select (e.g., Toppings, Ingredients) ---
            if (section.type === 'multi_select') {
                const grouped = groupIngredients(section.ingredients);
                
                return (
                    <div key={section.key} className="ingredient-section-group">
                         <h3 className="card-header-title">{section.title}</h3>
                         <p className="card-header-subtitle">{section.subtitle}</p>
                        {Object.entries(grouped).map(([subCategory, items]) => (
                             <div key={subCategory} className="custom-card ingredient-card">
                                {/* Use simple category name for display */}
                                <h4 className="card-header-title" style={{color: '#444', fontSize: '1.2rem'}}>{subCategory}</h4>
                                <div className="ingredient-grid">
                                    {items.map((ingredient) => {
                                        const isSelected = selectedValue.includes(ingredient.id);
                                        return (
                                            <button
                                                key={ingredient.id}
                                                onClick={() => toggleMultiSelect(section.key, ingredient.id)}
                                                className={`ingredient-option ${isSelected ? 'selected' : 'unselected'}`}
                                            >
                                                <span className="ingredient-emoji">{ingredient.emoji}</span>
                                                <div className="ingredient-details">
                                                    <div className="ingredient-name">{ingredient.name}</div>
                                                    <div className="ingredient-price">{getIngredientPrice(ingredient.price)}</div>
                                                </div>
                                                {isSelected && <span className="check-mark">✓</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            }
            return null;
        });
    };
    

    if (!baseItem) return <div className="customize-page-container">Loading...</div>;

    return (
        <div className="customize-page-container">
            
            {/* Header & Navigation */}
            <button className="customize-nav-btn" onClick={() => navigate(-1)} style={{ left: '25px' }}>
                &larr; Back
            </button>
            <button className="customize-nav-btn" onClick={() => navigate('/order')} style={{ right: '25px' }}>
                View Order
            </button>
            
            <h1 className="menu-page-title" style={{ marginTop: '50px' }}>Customize: {baseItem.name}</h1>
            <p className="menu-page-subtitle">Build your perfect {itemCategory.toLowerCase()} meal from scratch.</p>

            <div className="customize-grid">
                
                {/* Left Column - Dynamic Customization Options */}
                <div className="customize-options-container">
                    
                    {/* Item Preview Card */}
                    <div className="custom-card item-preview-card">
                        <div className="preview-image-container">
                             <img src={baseItem.image_url || '/placeholder.jpg'} alt={baseItem.name} className="preview-image"/>
                        </div>
                        <div className="preview-content">
                            <h2 className="preview-title">{baseItem.name}</h2>
                            <p className="preview-description">{baseItem.description}</p>
                            <span className="base-price">Base Price: ${baseItem.price.toFixed(2)}</span>
                        </div>
                    </div>

                    {renderCustomizationOptions()}

                </div>

                {/* Right Column - Order Summary (Sticky) */}
                <div className="customize-summary-container">
                    <div className="custom-card summary-card sticky-summary">
                        <h3 className="summary-title">Order Summary</h3>
                        <div className="summary-section">
                            {/* Price Breakdown (Simplified for summary) */}
                            <div className="summary-row">
                                <span className="summary-label">Base Price</span>
                                <span>${baseItem.price.toFixed(2)}</span>
                            </div>
                            
                            {/* Dynamic Price Adjustments */}
                            {config.sections.map(section => {
                                const selectedId = customizations[section.key];
                                if (section.type === 'single_select') {
                                     const option = section.options.find(o => o.id === selectedId);
                                     if(option && option.multiplier > 1) {
                                        return (
                                            <div key={section.key} className="summary-row">
                                                <span className="summary-label">{section.title} ({option.name})</span>
                                                <span>x{option.multiplier.toFixed(1)}</span>
                                            </div>
                                        );
                                     }
                                }
                                return null;
                            })}

                            <hr className="summary-separator" />
                            
                            {/* Quantity Selector */}
                            <div className="summary-row quantity-control-row">
                                <span className="summary-label font-bold">Quantity</span>
                                <div className="quantity-control small-control">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                    <span className="quantity-display">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)}>+</button>
                                </div>
                            </div>
                            
                            <hr className="summary-separator" />

                            {/* Total */}
                            <div className="summary-row total-row">
                                <span className="summary-label total-label">Total</span>
                                <span className="total-price">${calculateTotal.toFixed(2)}</span>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                className="add-to-cart-btn"
                            >
                                ADD {quantity} ITEM(S) TO ORDER
                            </button>
                        </div>
                        
                        {/* Dynamic Customizations Summary */}
                        <div className="summary-customizations">
                            {config.sections.map(section => {
                                const selectedId = customizations[section.key];
                                if (section.type === 'multi_select') {
                                    const defaultItems = section.defaultSelected || [];
                                    const added = selectedId.filter(id => !defaultItems.includes(id)).map(id => allIngredients.find(i => i.id === id));
                                    const removed = defaultItems.filter(id => !selectedId.includes(id)).map(id => allIngredients.find(i => i.id === id));

                                    return (
                                        <React.Fragment key={section.key}>
                                            {/* Added Ingredients */}
                                            {added.length > 0 && (
                                                <div className="customization-list">
                                                    <h4 className="list-title added">Added {section.title}:</h4>
                                                    <div className="badge-group">
                                                        {added.map((ing) => (
                                                            <span key={ing.id} className="custom-badge added-badge">
                                                                {ing?.emoji} {ing?.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Removed Ingredients */}
                                            {removed.length > 0 && (
                                                <div className="customization-list">
                                                    <h4 className="list-title removed">Removed {section.title}:</h4>
                                                    <div className="badge-group">
                                                        {removed.map((ing) => (
                                                            <span key={ing.id} className="custom-badge removed-badge">
                                                                No {ing?.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomizePage;