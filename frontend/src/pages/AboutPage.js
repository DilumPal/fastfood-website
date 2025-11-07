// AboutPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './MenuPage.css'; // Reusing the container and button styles
import './HomePage.css'; // Importing for access to :root variables like colors

// --- Feature Card Component for Section 2 ---
const FeatureCard = ({ icon, title, description, className }) => (
    <div className={`feature-card ${className}`} style={{ width: 'unset', margin: '15px', maxWidth: '300px' }}>
        <div className="icon-placeholder" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{icon}</div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{title}</h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-primary)' }}>{description}</p>
    </div>
);

const AboutPage = () => {
    return (
        // Reusing the dark background container from MenuPage.css
        <div className="menu-container"> 
            
            {/* Back to Home Button */}
            <Link to="/" className="home-button" style={{ top: '25px', left: '25px', backgroundColor: 'var(--color-hot-pink)' }}>
                &larr; Back to Home
            </Link>

            {/* Title */}
            <h1 className="menu-page-title" style={{ marginTop: '50px' }}>About YumZone</h1>
            <h2 className="menu-page-subtitle">Our Story: Where Flavor Meets Fun!</h2>

            {/* --- 1. Catchy Intro / Brand Story --- */}
            <section style={{ maxWidth: '800px', margin: '40px auto 70px auto', textAlign: 'center' }}>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-secondary)' }}>
                    Welcome to **YumZone** — where flavor meets fun! <span className="bouncing-emoji">🍔</span> We started with one simple goal: 
                    to serve mouthwatering fast food that’s freshly made, full of bold flavor, and fits perfectly into your busy life. 
                    From juicy, handcrafted burgers to our signature crispy fries, every bite is made with care and a touch of genuine passion.
                </p>
            </section>

            {/* --- 2. What Makes You Special (Presented as Cards) --- */}
            <h2 className="category-title" style={{ maxWidth: '950px', margin: '0 auto 30px auto', borderBottomColor: 'var(--color-zesty-lime)' }}>
                The YumZone Difference
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '0 20px 80px 20px' }}>
                
                <FeatureCard 
                    icon="🔥" 
                    title="Freshness First" 
                    description="We never freeze our patties or pre-make our salads—everything is cooked and prepped fresh to order."
                    className="freshness"
                />
                <FeatureCard 
                    icon="🚀" 
                    title="Fast & Friendly" 
                    description="Quick bites that never compromise on taste. Experience our lightning-fast service with a genuine smile."
                    className="velocity"
                />
                <FeatureCard 
                    icon="💖" 
                    title="Made with Love" 
                    description="Every single meal is crafted by a dedicated team who truly care about good food and your satisfaction."
                    className="atmosphere"
                />
                <FeatureCard 
                    icon="♻️" 
                    title="Eco-Conscious" 
                    description="We believe in good food and a better planet, using recyclable packaging and sourcing our ingredients responsibly."
                    className="freshness"
                />
            </div>
            
            {/* --- 3. Our Mission --- */}
            <section style={{ 
                maxWidth: '800px', 
                margin: '0 auto 70px auto', 
                textAlign: 'center',
                padding: '30px',
                background: 'linear-gradient(90deg, #0A0A0A, rgba(0, 240, 255, 0.2), #0A0A0A)', // Subtle glow effect
                borderRadius: '10px'
            }}>
                <p style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: '900', 
                    color: 'var(--color-electric-blue)',
                    textShadow: '0 0 10px rgba(0, 240, 255, 0.5)'
                }}>
                    "Our mission is to bring smiles through delicious, freshly prepared fast food that fits your lifestyle."
                </p>
            </section>

            {/* --- 6. Customer Promise & Contact Info --- */}
            <section style={{ maxWidth: '800px', margin: '0 auto 50px auto', textAlign: 'center' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-zesty-lime)', marginBottom: '30px' }}>
                    Your satisfaction fuels our passion!
                </p>
                <p style={{ color: 'rgba(248, 248, 248, 0.8)', fontSize: '1rem' }}>
                    **Find Us:** 123 Main Street, Central City | **Call Us:** (555) 123-YUMZ | **We deliver island-wide!**
                </p>
            </section>

        </div>
    );
};

export default AboutPage;