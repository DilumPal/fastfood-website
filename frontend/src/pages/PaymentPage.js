// PaymentPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/OrderContext'; 
import './MenuPage.css'; 

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state?.orderData; 
    const { clearCart } = useCart(); 
    const [customerPhone, setCustomerPhone] = useState(orderData.customer_phone || ''); 
    const [customerAddress, setCustomerAddress] = useState(orderData.customer_address || ''); 
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focus, setFocus] = useState(''); 
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
    
    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '').substring(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

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

        if (customerPhone.trim() === '') {
             setError('Phone Number is required.');
             setIsProcessing(false);
             return;
        }
        if (customerAddress.trim() === '') {
             setError('Delivery Address is required.');
             setIsProcessing(false);
             return;
        }
        
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
        
        const submissionData = {
            customer_phone: customerPhone,
            customer_address: customerAddress,
            
            ...orderData,
            
            payment_details: {
                last_four_digits: cardNumber.replace(/\s/g, '').slice(-4),
                payment_method: 'Credit Card',
                card_holder_name: cardName
            }
        };

        try {
            const response = await fetch('http://localhost/fastfood-website/api/submit_order.php', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(submissionData),
            });
            
            if (!response.ok) {
                 const errorBody = await response.text();
                 throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorBody.substring(0, 100)}...`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                alert(`🎉 Payment Successful! Your order ID is: ${result.order_id}. You will be redirected to the home page.`);
                
                clearCart(); 
                
                navigate('/'); 
            } else {
                setError('Failed to process payment: ' + (result.error || 'Unknown error.'));
            }
        } catch (error) {
            console.error('Error submitting order and payment:', error);
            setError('An error occurred during payment. Please check your console for details.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="menu-container" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <Link to="/order" className="home-button" style={{ top: '25px', left: '25px', backgroundColor: 'rgb(255, 136, 0)' }}>
                &larr; Back to Order Summary
            </Link>

            <h1 className="menu-page-title" style={{ marginTop: '50px' }}>Secure Checkout</h1>
            <p className="menu-page-subtitle">Pay for your final order total of **${orderData.total}**.</p>

            <div style={{ maxWidth: '600px', width: '100%', margin: '20px 0', padding: '40px', backgroundColor: 'var(--color-secondary, #F8F8F8)', borderRadius: '15px', color: 'var(--color-primary, #0A0A0A)', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>

                <form onSubmit={handlePaymentSubmit} style={{ marginTop: '20px', display: 'grid', gap: '15px' }}>
                    
                    {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
                    
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number for Contact"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                        disabled={isProcessing}
                        style={inputStyle}
                    />

                    <input
                        type="text"
                        name="address"
                        placeholder="Delivery Address"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        required
                        disabled={isProcessing}
                        style={inputStyle}
                    />

                    <hr style={{ borderTop: '1px dashed #ccc', margin: '15px 0' }} />

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
                        maxLength="19"
                    />

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
                            maxLength="5" 
                        />

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
    background: 'linear-gradient(45deg, var(--color-hot-pink), var(--color-zesty-lime))', 
    color: 'white'
};


export default PaymentPage;