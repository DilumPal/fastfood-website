// CustomizePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you have this
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    // State variables for data
    const [users, setUsers] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // 1. Redirection/Security Check (Basic implementation)
    useEffect(() => {
        // You would typically check for user role ('admin') here
        if (!isAuthenticated || user?.role !== 'admin') {
            // navigate('/'); 
            // alert("Access Denied: Admin privileges required.");
        }
    }, [isAuthenticated, user, navigate]);


    // 2. Data Fetching Function (CRITICAL FIXES HERE)
    const fetchData = async (endpoint) => {
        let setter;
        let endpointName = endpoint; 

        if (endpointName === 'users') {
            setter = setUsers;
        } else if (endpointName === 'menu-items') {
            setter = setMenuItems;
        } else if (endpointName === 'orders') {
            setter = setOrders;
        } else {
            return; 
        }

        try {
            const apiUrl = `http://localhost/fastfood-website/api/admin_${endpointName.replace('-', '_')}.php`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // This catches the 500 error and displays a readable message
                throw new Error(`HTTP error! Status: ${response.status} for ${endpointName}`);
            }

            const jsonResponse = await response.json(); 

            if (jsonResponse.success && Array.isArray(jsonResponse.data)) {
                setter(jsonResponse.data);
            } else {
                console.warn(`Backend reported issue for ${endpointName}:`, jsonResponse.message);
                setter([]); 
            }

        } catch (error) {
            console.error(`Fetch error for ${endpointName}:`, error);
            setError(`Failed to fetch ${endpointName} data. Check PHP error logs for server details.`);
            setter([]); 
        }
    };

    // 3. Initial Data Fetch Hook
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);
            
            await Promise.all([
                fetchData('users'),
                fetchData('menu-items'),
                fetchData('orders')
            ]);
            
            setIsLoading(false);
        };

        if (isAuthenticated) { 
            fetchAllData();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]); 


    // --- 4. Render Functions (With Safeguards) ---

    const renderUsersTable = () => {
        if (isLoading) return <tr><td colSpan="4">Loading Users...</td></tr>;
        if (error && users.length === 0) return <tr><td colSpan="4" style={{ color: 'red' }}>Error loading users.</td></tr>;
        if (!Array.isArray(users) || users.length === 0) return <tr><td colSpan="4">No users found.</td></tr>;

        return users.map(user => (
            <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
            </tr>
        ));
    };

    const renderMenuItemsTable = () => {
        if (isLoading) return <tr><td colSpan="5">Loading Menu Items...</td></tr>;
        if (error && menuItems.length === 0) return <tr><td colSpan="5" style={{ color: 'red' }}>Error loading menu items.</td></tr>;
        if (!Array.isArray(menuItems) || menuItems.length === 0) return <tr><td colSpan="5">No menu items found.</td></tr>;

        return menuItems.map(item => (
            <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.category}</td>
                <td>{item.description.substring(0, 50)}...</td>
            </tr>
        ));
    };

    const renderOrdersTable = () => {
        if (isLoading) return <tr><td colSpan="6">Loading Orders...</td></tr>;
        if (error && orders.length === 0) return <tr><td colSpan="6" style={{ color: 'red' }}>Error loading orders.</td></tr>;
        if (!Array.isArray(orders) || orders.length === 0) return <tr><td colSpan="6">No orders found.</td></tr>;

        return orders.map(order => (
            <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>{order.customer_name} ({order.user_email || 'Guest'})</td>
                {/* ⚠️ FIX: Use the 'total_amount' key created in PHP, or fallback to a default if missing */}
                <td>${(parseFloat(order.total_amount) || 0).toFixed(2)}</td>
                {/* ⚠️ FIX: Use the 'status' key created in PHP, which is now a placeholder */}
                <td>{order.status}</td> 
                <td>{order.customer_address}</td>
            </tr>
        ));
    };
    
    // 5. Main Render
    return (
        <div style={{ padding: '20px', backgroundColor: '#0A0A0A', color: '#F8F8F8', minHeight: '100vh' }}>
            <h1 style={{ color: '#C7FF00', textAlign: 'center', marginBottom: '40px' }}>Admin Dashboard</h1>
            
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            
            {/* Users Table */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ color: '#00F0FF' }}>User Management ({users.length})</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1a1a1a' }}>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderUsersTable()}
                    </tbody>
                </table>
            </section>

            {/* Menu Items Table */}
            <section style={{ marginBottom: '50px' }}>
                <h2 style={{ color: '#FF007F' }}>Menu Item Inventory ({menuItems.length})</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1a1a1a' }}>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderMenuItemsTable()}
                    </tbody>
                </table>
            </section>

            {/* Orders Table */}
            <section>
                <h2 style={{ color: '#C7FF00' }}>Recent Orders ({orders.length})</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1a1a1a' }}>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderOrdersTable()}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default AdminDashboard;