// CustomizePage.js
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/OrderContext'; 
import { useAuth } from '../context/AuthContext';
import { customizationConfig, allIngredients } from './customizationData'; 
import './CustomizePage.css';

const getIngredientPrice = (price) => price > 0 ? `+ $${(price / 100).toFixed(2)}` : "Free";

const groupIngredients = (ingredients) => {
    return ingredients.reduce((acc, ingredient) => {
        const subCategory = ingredient.category || 'Other';
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
    const itemCategory = baseItem?.category || 'Default';
    
    const config = customizationConfig[itemCategory] || customizationConfig['Default'];
    
    const initialCustomizations = useMemo(() => {
        return config.sections.reduce((acc, section) => {
            if (section.type === 'multi_select') {
                acc[section.key] = [...(section.defaultSelected || [])];
            } else if (section.type === 'single_select') {
                acc[section.key] = section.default || (section.options.length > 0 ? section.options[0].id : '');
            }
            return acc;
        }, {});
    }, [config.sections]);
    
    const [customizations, setCustomizations] = useState(initialCustomizations);
    const [quantity, setQuantity] = useState(baseItem?.quantity || 1);

    const [notification, setNotification] = useState({
        message: '',
        type: '',
        show: false,
        action: null 
    });

    const showNotification = useCallback((message, type = 'success', action = null, duration = 3000) => {
        setNotification({ message, type, show: true, action });
        
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
            if (action) {
                action(); 
            }
        }, duration);
    }, []); 

    useEffect(() => {
        if (!baseItem) {
            showNotification("No item selected for customization. Redirecting to menu.", 'error', () => navigate('/menu'), 5000);
            return;
        }
        setCustomizations(initialCustomizations);
        setQuantity(baseItem?.quantity || 1);
    }, [baseItem, navigate, initialCustomizations, showNotification]);
    
    const toggleMultiSelect = (key, itemId) => {
        setCustomizations(prev => {
            const currentSelections = prev[key];
            return {
                ...prev,
                [key]: currentSelections.includes(itemId)
                    ? currentSelections.filter(id => id !== itemId) 
                    : [...currentSelections, itemId] 
            };
        });
    };
    
    const handleSingleSelect = (key, itemId) => {
        setCustomizations(prev => ({ ...prev, [key]: itemId }));
    };

    const { calculateUnitAdjustedPrice, displayCustomizationDetails } = useMemo(() => {
        if (!baseItem) return { calculateUnitAdjustedPrice: 0, displayCustomizationDetails: null };
        
        let basePrice = baseItem.price; 
        let totalMultiplier = 1;
        let addedPriceCents = 0; 
        
        const details = {
            added: [], 
            removed: [], 
            options: [] 
        };

        config.sections.forEach(section => {
            const selectedId = customizations[section.key];
            
            if (section.type === 'single_select') {
                const option = section.options.find(o => o.id === selectedId);
                if (option) {
                    totalMultiplier *= (option.multiplier || 1); 
                    
                    details.options.push({
                        title: section.title,
                        name: option.name,
                        multiplier: option.multiplier
                    });
                }
            } 
            
            else if (section.type === 'multi_select') {
                const defaultItems = section.defaultSelected || [];

                (allIngredients || []).forEach(ingredient => {
                    const isSelected = (selectedId || []).includes(ingredient.id);
                    const isDefault = defaultItems.includes(ingredient.id);

                    if (isSelected && !isDefault) {
                        addedPriceCents += (ingredient.price || 0);
                        details.added.push(`${ingredient.name}${ingredient.price > 0 ? ` (+ $${(ingredient.price / 100).toFixed(2)})` : ''}`);
                    } else if (!isSelected && isDefault) {
                        details.removed.push(ingredient.name);
                    }
                });
            }
        });
        const finalUnitPrice = (basePrice + (addedPriceCents / 100)) * totalMultiplier; 
        
        return {
            calculateUnitAdjustedPrice: finalUnitPrice,
            displayCustomizationDetails: details
        };
    }, [baseItem, customizations, config.sections, allIngredients]);


    const calculateTotal = useMemo(() => {
        return calculateUnitAdjustedPrice * quantity;
    }, [calculateUnitAdjustedPrice, quantity]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            showNotification("Please login to add items to your order 😊", 'error', () => navigate('/login'));
            return;
        }

        if (!baseItem) return;

        addToCart({
            id: Date.now(), 
            menu_item_id: baseItem.id, 
            name: `${baseItem.name} (Customized)`,
            price: parseFloat(calculateUnitAdjustedPrice.toFixed(2)), 
            quantity: quantity,
            customizationDetails: displayCustomizationDetails 
        });
        showNotification(`Added ${quantity}x ${baseItem.name} (Customized) to your order!`, 'success', () => navigate("/order"));
    };
    
    const renderCustomizationOptions = () => {
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
            
            if (section.type === 'multi_select') {
                const grouped = groupIngredients(section.ingredients || []);
                
                return (
                    <div key={section.key} className="ingredient-section-group">
                         <h3 className="card-header-title">{section.title}</h3>
                         <p className="card-header-subtitle">{section.subtitle}</p>
                        {Object.entries(grouped).map(([subCategory, items]) => (
                             <div key={subCategory} className="custom-card ingredient-card">
                                <h4 className="card-header-title" style={{color: '#444', fontSize: '1.2rem'}}>{subCategory}</h4>
                                <div className="ingredient-grid">
                                    {items.map((ingredient) => {
                                        const isSelected = (customizations[section.key] || []).includes(ingredient.id);
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
            <div 
                className={`notification ${notification.show ? 'show' : ''} ${notification.type}`}
            >
                {notification.message}
            </div>
            
            <button className="customize-nav-btn" onClick={() => navigate(-1)} style={{ left: '25px' }}>
                &larr; Back
            </button>
            <button className="customize-nav-btn" onClick={() => navigate('/order')} style={{ right: '25px' }}>
                View Order
            </button>
            
            <h1 className="menu-page-title" style={{ marginTop: '50px' }}>Customize: {baseItem.name}</h1>
            <p className="menu-page-subtitle">Build your perfect {itemCategory.toLowerCase()} meal from scratch.</p>

            <div className="customize-grid">
                
                <div className="customize-options-container">
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

                <div className="customize-summary-container">
                    <div className="custom-card summary-card sticky-summary">
                        <h3 className="summary-title">Order Summary</h3>
                        <div className="summary-section">
                            <div className="summary-row">
                                <span className="summary-label">Unit Price (Base)</span>
                                <span>${baseItem.price.toFixed(2)}</span>
                            </div>
                            
                            {displayCustomizationDetails?.options.map((option, index) => {
                                if(option.multiplier !== 1) {
                                    return (
                                        <div key={index} className="summary-row">
                                            <span className="summary-label">{option.title} ({option.name})</span>
                                            <span>x{option.multiplier.toFixed(1)}</span>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                            
                            {displayCustomizationDetails?.added.length > 0 && (
                                <div className="summary-row">
                                    <span className="summary-label">Ingredient Adjustments</span>
                                    <span>Added</span>
                                </div>
                            )}

                            <hr className="summary-separator" />
                            
                            <div className="summary-row">
                                <span className="summary-label font-bold">Unit Price (Final)</span>
                                <span>${calculateUnitAdjustedPrice.toFixed(2)}</span>
                            </div>

                            <div className="summary-row quantity-control-row">
                                <span className="summary-label font-bold">Quantity</span>
                                <div className="quantity-control small-control">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                    <span className="quantity-display">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)}>+</button>
                                </div>
                            </div>
                            
                            <hr className="summary-separator" />

                            <div className="summary-row total-row">
                                <span className="summary-label total-label">Total</span>
                                <span className="total-price">${calculateTotal.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="add-to-cart-btn"
                            >
                                ADD {quantity} ITEM(S) TO ORDER
                            </button>
                        </div>
                        
                        <div className="summary-customizations">
                           {displayCustomizationDetails && (
                                <React.Fragment>
                                    {displayCustomizationDetails.added.length > 0 && (
                                        <div className="customization-list">
                                            <h4 className="list-title added">Added:</h4>
                                            <div className="badge-group">
                                                {displayCustomizationDetails.added.map((name, index) => (
                                                    <span key={index} className="custom-badge added-badge">
                                                        + {name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {displayCustomizationDetails.removed.length > 0 && (
                                        <div className="customization-list">
                                            <h4 className="list-title removed">Removed:</h4>
                                            <div className="badge-group">
                                                {displayCustomizationDetails.removed.map((name, index) => (
                                                    <span key={index} className="custom-badge removed-badge">
                                                        No {name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomizePage;