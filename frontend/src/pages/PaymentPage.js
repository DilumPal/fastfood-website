// PaymentPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/OrderContext'; // ⚠️ NEW IMPORT: To clear cart on success
import './MenuPage.css'; // Re-use styles

// NOTE: If you installed react-credit-cards, uncomment the imports:
// import Cards from 'react-credit-cards';
// import 'react-credit-cards/es/styles-compiled.css'; 

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Retrieve order data passed from OrdersPage
    const orderData = location.state?.orderData; 
    
    // Get clearCart function from context
    const { clearCart } = useCart(); 

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focus, setFocus] = useState(''); // For card component focus
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!orderData) {
        return (
            <div className="menu-container" style={{ textAlign: 'center', paddingTop: '100px' }}>
                <h1>No Order Data Found</h1>
                <p>Please return to the <Link to="/menu">menu</Link> to place an order.</p>
            </div>
        );
    }
    
    // Helper function to format card number
    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '').substring(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    // Helper function to format expiry date
    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, '').substring(0, 4);
        if (digits.length > 2) {
            return digits.substring(0, 2) + '/' + digits.substring(2);
        }
        return digits;
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);

        // --- Front-End Validation (Fake Card Logic) ---
        if (cardNumber.replace(/\s/g, '').length !== 16) {
            setError('Card Number must be 16 digits.');
            setIsProcessing(false);
            return;
        }

        const [month, year] = expiry.split('/');
        if (!month || !year || month.length !== 2 || year.length !== 2 || isNaN(month) || isNaN(year) || parseInt(month) < 1 || parseInt(month) > 12) {
             setError('Expiry must be in valid MM/YY format.');
             setIsProcessing(false);
             return;
        }
        
        if (cvc.length !== 3 || isNaN(cvc)) {
            setError('CVV must be 3 digits.');
            setIsProcessing(false);
            return;
        }

        if (cardName.trim() === '') {
            setError('Name on Card is required.');
            setIsProcessing(false);
            return;
        }
        
        // --- Successful Front-End Validation ---
        
        // Prepare final data including payment details
        const submissionData = {
            ...orderData,
            payment_details: {
                last_four_digits: cardNumber.replace(/\s/g, '').slice(-4),
                payment_method: 'Credit Card',
                card_holder_name: cardName
            }
        };

        // 5. Call the modified backend API (submit_order.php)
        try {
            // ⚠️ Ensure this URL is correct for your local server setup
            const response = await fetch('http://localhost/fastfood-website/api/submit_order.php', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(submissionData),
            });
            
            // Check for HTTP errors (like 404 or 500)
            if (!response.ok) {
                 // Attempt to read error message from body if available
                 const errorBody = await response.text();
                 throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorBody.substring(0, 100)}...`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Payment and Order successful
                alert(`🎉 Payment Successful! Your order ID is: ${result.order_id}. You will be redirected to the home page.`);
                
                // **FIX:** Clear the cart using the context hook
                clearCart(); 
                
                navigate('/'); // Redirect to home page
            } else {
                // Backend application error (e.g., failed DB insertion)
                setError('Failed to process payment: ' + (result.error || 'Unknown error.'));
            }
        } catch (error) {
            console.error('Error submitting order and payment:', error);
            // Display a generic error message for security/simplicity
            setError('An error occurred during payment. Please check your console for details.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="menu-container" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <Link to="/order" className="home-button" style={{ top: '25px', left: '25px', backgroundColor: 'var(--color-hot-pink)' }}>
                &larr; Back to Order Summary
            </Link>

            <h1 className="menu-page-title" style={{ marginTop: '50px' }}>Secure Checkout</h1>
            <p className="menu-page-subtitle">Pay for your final order total of **${orderData.total}**.</p>

            <div style={{ maxWidth: '600px', width: '100%', margin: '20px 0', padding: '40px', backgroundColor: 'var(--color-secondary, #F8F8F8)', borderRadius: '15px', color: 'var(--color-primary, #0A0A0A)', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                
                {/* Optional: Card component display here */}
                {/* <Cards ... /> */}
                
                <form onSubmit={handlePaymentSubmit} style={{ marginTop: '20px', display: 'grid', gap: '15px' }}>
                    
                    {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
                    
                    {/* Card Number */}
                    <input
                        type="tel"
                        name="number"
                        placeholder="16 Digit Card Number"
                        value={formatCardNumber(cardNumber)}
                        onChange={(e) => setCardNumber(e.target.value)}
                        onFocus={(e) => setFocus(e.target.name)}
                        required
                        disabled={isProcessing}
                        style={inputStyle}
                        maxLength="19" // 16 digits + 3 spaces
                    />

                    {/* Name on Card */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Name on Card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        onFocus={(e) => setFocus(e.target.name)}
                        required
                        disabled={isProcessing}
                        style={inputStyle}
                    />

                    <div style={{ display: 'flex', gap: '15px' }}>
                        {/* Expiry Date */}
                        <input
                            type="tel"
                            name="expiry"
                            placeholder="MM/YY"
                            value={formatExpiry(expiry)}
                            onChange={(e) => setExpiry(e.target.value)}
                            onFocus={(e) => setFocus(e.target.name)}
                            required
                            disabled={isProcessing}
                            style={{ ...inputStyle, flex: 1 }}
                            maxLength="5" // MM/YY
                        />

                        {/* CVV */}
                        <input
                            type="password"
                            name="cvc"
                            placeholder="CVV (3 digits)"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                            onFocus={(e) => setFocus(e.target.name)}
                            required
                            disabled={isProcessing}
                            style={{ ...inputStyle, flex: 1 }}
                            maxLength="3"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={isProcessing}
                        style={buttonStyle}
                    >
                        {isProcessing ? 'PROCESSING...' : `PAY $${orderData.total}`}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Simple inline styles for the form
const inputStyle = {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box',
};

const buttonStyle = {
    marginTop: '25px', 
    padding: '15px 30px',
    fontSize: '1.2rem',
    fontWeight: '700',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    background: 'linear-gradient(45deg, var(--color-electric-blue, #4d88ff), var(--color-hot-pink, #ff007f))', 
    color: 'white'
};


export default PaymentPage;