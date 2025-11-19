// AdminAnalytics.js 

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminAnalytics.css';

import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';

const formatDayLabel = (dayString) => {
    if (!dayString) return '';
    const [year, month, day] = dayString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleString('en-US', { day: 'numeric', month: 'short' });
};


const AdminAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        
        const apiUrl = `http://localhost/fastfood-website/api/admin_analytics.php`;
        
        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const jsonResponse = await response.json();
            
            if (jsonResponse.success) {
                const data = jsonResponse.data;
                
                const formattedTrends = (data.order_trends || []).map(trend => ({
                    ...trend,
                    dayLabel: formatDayLabel(trend.day), 
                }));

                setAnalyticsData({
                    monthlySales: data.metrics.monthly_sales || 0,
                    totalRevenue: data.metrics.total_revenue || 0,
                    netProfit: data.metrics.net_profit || 0,
                    customerFrequency: data.metrics.customer_frequency || 'N/A',
                    topSelling: data.top_selling_items || [],
                    leastSelling: data.least_selling_items || [],
                    orderTrends: formattedTrends, 
                });
            } else {
                setError(jsonResponse.message || "Failed to load analytics data.");
            }

        } catch (err) {
            console.error("Analytics Fetch Error:", err);
            setError("Failed to fetch analytics data. Check server logs. (URL: " + apiUrl + ")");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); 
            return;
        }
        fetchData();
    }, [isAuthenticated, navigate]);

    const navigateToDashboard = () => {
        navigate('/admin');
    };

    const renderMetricCard = (title, value, isCurrency = true) => (
        <div className="metric-card">
            <p className="card-title">{title}</p>
            <h2 className="card-value">{isCurrency ? `$${(value || 0).toFixed(2)}` : value}</h2>
        </div>
    );

    if (isLoading) return <div className="admin-analytics-container"><p className="loading-message">Loading Analytics...</p></div>;
    if (error) return <div className="admin-analytics-container"><p className="error-message" style={{ color: 'red' }}>Error: {error}</p></div>;
    if (!analyticsData) return null;

    return (
        <div className="admin-analytics-container">
            <div className="admin-analytics-header">
                <h1 className="admin-analytics-title">📊 Analytics Dashboard</h1>
                <button 
                    className="nav-button dashboard-button" 
                    onClick={navigateToDashboard}
                >
                    Go to Admin Operations &rarr;
                </button>
            </div>
            <p className="admin-analytics-subtitle">Key Performance Indicators and Sales Trends</p>

            <div className="metrics-grid">
                {renderMetricCard('Monthly Sales (Current)', analyticsData.monthlySales)}
                {renderMetricCard('Total Revenue (YTD)', analyticsData.totalRevenue)}
                {renderMetricCard('Net Profit (Revenue – COGS)', analyticsData.netProfit)}
                {renderMetricCard('Customer Order Frequency', analyticsData.customerFrequency, false)}
            </div>

            <div className="data-sections-grid">
                
                <section className="item-performance-section">
                    <h2 className="section-title">🥇 Top-Selling Items</h2>
                    <table className="analytics-table">
                        <thead>
                            <tr><th>Item Name</th><th>Units Sold</th><th>Revenue</th></tr>
                        </thead>
                        <tbody>
                            {analyticsData.topSelling.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.total_sold}</td>
                                    <td>${(item.total_revenue || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="item-performance-section">
                    <h2 className="section-title">📉 Least-Selling Items</h2>
                    <table className="analytics-table">
                        <thead>
                            <tr><th>Item Name</th><th>Units Sold</th><th>Revenue</th></tr>
                        </thead>
                        <tbody>
                            {analyticsData.leastSelling.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.total_sold}</td>
                                    <td>${(item.total_revenue || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            <section className="chart-section">
                <h2 className="section-title">📈 Order Trends (Last 7 Days)</h2> {/* UPDATED TITLE */}
                {analyticsData.orderTrends.length > 0 ? (
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={analyticsData.orderTrends}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                
                                <XAxis dataKey="dayLabel" stroke="#F8F8F8" /> 
                                
                                <YAxis 
                                    yAxisId="left" 
                                    orientation="left" 
                                    stroke="#00F0FF" 
                                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                                />
                                
                                <YAxis 
                                    yAxisId="right" 
                                    orientation="right" 
                                    stroke="#FF007F" 
                                    allowDecimals={false}
                                />
                                
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00F0FF' }}
                                    formatter={(value, name) => {
                                        if (name === 'Total Revenue') return [`$${value.toFixed(2)}`, name];
                                        if (name === 'Total Orders') return [value, name];
                                        return [value, name];
                                    }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                
                                <Bar yAxisId="left" dataKey="totalRevenue" fill="#00F0FF" name="Total Revenue" /> 
                                
                                <Bar yAxisId="right" dataKey="totalOrders" fill="#FF007F" name="Total Orders" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="chart-placeholder" style={{ height: '300px' }}>
                        <p>No order data available for the last 7 days to display a trend chart.</p>
                        <p>If you have recent orders, please verify data in your `orders` table.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminAnalytics;