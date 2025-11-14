// AdminDashboard.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    // State variables for main data
    const [users, setUsers] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- STATE FOR MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState(null);

    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // 1. Security Check
    useEffect(() => {
        // You would typically check for user role ('admin') here
        // if (!isAuthenticated || user?.role !== 'admin') { /* ... */ }
    }, [isAuthenticated, user, navigate]);


    // 2. Data Fetching Function (General)
    const fetchData = async (endpoint) => {
        let setter;
        let endpointName = endpoint; 

        if (endpointName === 'users') { setter = setUsers; } 
        else if (endpointName === 'menu-items') { setter = setMenuItems; } 
        else if (endpointName === 'orders') { setter = setOrders; } 
        else { return; }

        try {
            // Assumes admin_users.php, admin_menu_items.php, admin_orders.php exist
            const apiUrl = `http://localhost/fastfood-website/api/admin_${endpointName.replace('-', '_')}.php`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
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


    // --- Order Details Fetch Function ---
    const handleOrderClick = async (orderId) => {
        setDetailsError(null);
        setIsDetailsLoading(true);
        setSelectedOrder(orderId);
        setIsModalOpen(true);
        setOrderDetails([]); // Clear previous details

        try {
            const apiUrl = `http://localhost/fastfood-website/api/admin_order_details.php?order_id=${orderId}`;

            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                // Catches the 500 status from the PHP file
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const jsonResponse = await response.json(); 

            if (jsonResponse.success && Array.isArray(jsonResponse.data)) {
                setOrderDetails(jsonResponse.data);
            } else {
                setDetailsError(jsonResponse.message || "Failed to load order items.");
            }

        } catch (error) {
            console.error(`Fetch error for order details:`, error);
            setDetailsError(`Failed to fetch order details. (${error.message}). Check PHP error log.`); 
        } finally {
            setIsDetailsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        setOrderDetails([]);
        setDetailsError(null);
    };


    // --- Order Details Modal Component (UPDATED to show Customizations) ---
    const OrderDetailsModal = () => {
        if (!isModalOpen) return null;

        const currentOrder = orders.find(o => o.id === selectedOrder);
        const modalTitle = currentOrder 
            ? `Order #${currentOrder.id} - Total: $${(parseFloat(currentOrder.total_amount) || 0).toFixed(2)}` 
            : `Order #${selectedOrder} Details`;

        return (
            <div className="modal-backdrop">
                <div className="modal-content">
                    <button className="modal-close" onClick={handleCloseModal}>&times;</button>
                    <h3 className="modal-title">{modalTitle}</h3>
                    
                    {isDetailsLoading && <p>Loading items...</p>}
                    {detailsError && <p style={{ color: 'red' }}>Error: {detailsError}</p>}
                    
                    {!isDetailsLoading && !detailsError && orderDetails.length > 0 && (
                        <>
                            <table className="order-items-table data-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Qty</th>
                                        <th>Price/Item</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetails.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td className="item-name">{item.item_name}</td>
                                                <td>{item.quantity}</td>
                                                <td>${parseFloat(item.price_at_time).toFixed(2)}</td>
                                                <td>${(item.quantity * parseFloat(item.price_at_time)).toFixed(2)}</td>
                                            </tr>
                                            {/* NEW: Row for Customization Details */}
                                            {item.customizations && item.customizations.length > 0 && (
                                                <tr className="customization-row">
                                                    <td colSpan="4">
                                                        <span className="custom-label">Customizations:</span> {item.customizations}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                    
                    {!isDetailsLoading && !detailsError && orderDetails.length === 0 && (
                        <p>No items found for this order.</p>
                    )}
                </div>
            </div>
        );
    };


    // --- Render Functions ---
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
                {/* Make ID clickable */}
                <td 
                    onClick={() => handleOrderClick(order.id)} 
                    style={{ cursor: 'pointer', color: 'var(--color-electric-blue)', fontWeight: 'bold' }}
                >
                    #{order.id} 
                </td> 
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>{order.customer_name} ({order.user_email || 'Guest'})</td>
                <td>${(parseFloat(order.total_amount) || 0).toFixed(2)}</td>
                <td>{order.status}</td> 
                <td>{order.customer_address}</td>
            </tr>
        ));
    };


    // 5. Main Render
    return (
        <div className="admin-container"> 
            
            <h1 className="admin-title">Admin Dashboard</h1> 
            <p className="admin-subtitle">Manage Users, Menu, and Orders</p> 
            
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            
            <div className="data-display">
            
                {/* Users Table */}
                <section style={{ marginBottom: '50px' }}>
                    <h2 className="section-title">User Management ({users.length})</h2>
                    <table className="data-table"> 
                        <thead>
                            <tr className="table-header-row"> 
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
                    <h2 className="section-title">Menu Item Inventory ({menuItems.length})</h2>
                    <table className="data-table">
                        <thead>
                            <tr className="table-header-row">
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
                    <h2 className="section-title">Recent Orders ({orders.length})</h2>
                    <table className="data-table">
                        <thead>
                            <tr className="table-header-row">
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
            
            {/* RENDER THE MODAL */}
            <OrderDetailsModal />
        </div>
    );
};

export default AdminDashboard;