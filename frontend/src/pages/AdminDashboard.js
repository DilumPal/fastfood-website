// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext

import './AdminDashboard.css'; 

const AdminDashboard = () => {
    const navigate = useNavigate();
    // Assuming useAuth provides a 'user' object with a 'role' property, e.g., 'admin'
    const { isAuthenticated, user } = useAuth(); 

    // State for all data tables
    const [users, setUsers] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('orders'); // Default tab

    // Simple check: user must be authenticated AND have the role 'admin'
    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            alert("Access Denied: Only administrators can view this page.");
            navigate('/'); // Redirect to home page
        } else {
            // Fetch all data if authenticated as admin
            fetchData('users');
            fetchData('menu-items');
            fetchData('orders');
        }
    }, [isAuthenticated, user, navigate]);

    // General-purpose data fetching function
    const fetchData = async (endpoint) => {
        try {
            // ⚠️ CRITICAL: Replace with your actual backend URL/API base
            const response = await fetch(`/api/admin/${endpoint}`, {
                headers: {
                    // Assuming you use a token for authorization
                    'Authorization': `Bearer ${user.token}`, 
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch ${endpoint} data: ${response.statusText}`);
            }

            const data = await response.json();

            // Set state based on the endpoint
            switch (endpoint) {
                case 'users':
                    setUsers(data);
                    break;
                case 'menu-items':
                    setMenuItems(data);
                    break;
                case 'orders':
                    setOrders(data);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            // In a real app, you would show this error to the admin user
        }
    };

    // --- Render Functions for Tables ---
    const renderUsersTable = () => (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.first_name} {user.last_name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td className={`role-${user.role}`}>{user.role || 'customer'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderMenuItemsTable = () => (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {menuItems.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>${(item.price / 100).toFixed(2)}</td> {/* Assuming price is stored in cents */}
                        <td>{item.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderOrdersTable = () => (
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>User ID</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Customer Info</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order.id} className={`status-${order.status.toLowerCase()}`}>
                        <td>{order.id}</td>
                        <td>{new Date(order.order_date).toLocaleDateString()}</td>
                        <td>{order.user_id || 'Guest'}</td>
                        <td>${order.total_amount ? parseFloat(order.total_amount).toFixed(2) : 'N/A'}</td>
                        <td>{order.status}</td>
                        <td>
                            {order.customer_name}<br />
                            <small>{order.customer_phone}</small>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    // Render nothing if authentication is still pending or denied
    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="admin-container">
                <h1 className="admin-title">Admin Dashboard</h1>
                <p>Loading or Access Denied...</p>
            </div>
        ); 
    }

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Dashboard 🍔📊</h1>
            <p className="admin-subtitle">Welcome, {user.first_name}. Database overview:</p>

            <div className="tab-navigation">
                <button 
                    className={activeTab === 'orders' ? 'active' : ''} 
                    onClick={() => setActiveTab('orders')}
                >
                    Orders ({orders.length})
                </button>
                <button 
                    className={activeTab === 'menu-items' ? 'active' : ''} 
                    onClick={() => setActiveTab('menu-items')}
                >
                    Menu Items ({menuItems.length})
                </button>
                <button 
                    className={activeTab === 'users' ? 'active' : ''} 
                    onClick={() => setActiveTab('users')}
                >
                    Users ({users.length})
                </button>
            </div>

            <div className="data-display">
                {activeTab === 'orders' && renderOrdersTable()}
                {activeTab === 'menu-items' && renderMenuItemsTable()}
                {activeTab === 'users' && renderUsersTable()}
            </div>
        </div>
    );
};

export default AdminDashboard;

// ⚠️ Remember to update your main router (e.g., App.js) to include the new route:
// <Route path="/admin" element={<AdminDashboard />} />