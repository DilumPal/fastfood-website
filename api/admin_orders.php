<?php
// admin_orders.php - Fetches all orders with customer/user details.
// FIX: Using correct column names: order_time and total.

ob_start(); 
error_reporting(0); 

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); 
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // --- 1. Database Connection ---
    $servername = "localhost";
    $username = "root"; 
    $password = ""; 
    $dbname = "fastfood_db";
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // --- 2. CORRECTED SQL Query (Using o.order_time and o.total, and REMOVING o.status) ---
    $sql = "
        SELECT 
            o.id, 
            o.order_time,          /* CORRECTED */
            o.total,               /* CORRECTED */
            o.customer_name, 
            o.customer_phone,
            o.customer_address,
            u.email AS user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.order_time DESC
    ";
            
    $result = $conn->query($sql);

    if ($result === false) {
        throw new Exception("SQL Query failed: " . $conn->error);
    }
    
    // --- 3. Process Data ---
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        // Format total amount for consistent display
        $row['total_amount'] = number_format((float)$row['total'], 2, '.', '');
        // Rename order_time back to order_date for consistency with the JavaScript frontend
        $row['order_date'] = $row['order_time'];
        unset($row['order_time']); 
        // We removed 'status' from the SQL, so we can hardcode a status if needed for display, or omit it.
        $row['status'] = 'Completed (No Status Column)';
        
        $orders[] = $row;
    }

    $conn->close();
    
    // --- 4. Success Response ---
    ob_clean();
    echo json_encode(['success' => true, 'data' => $orders]);
    exit;

} catch (Exception $e) {
    // --- 5. Error Response (Guaranteed clean JSON output, fixing the 500 error) ---
    http_response_code(500); 
    ob_clean();
    error_log("admin_orders.php error: " . $e->getMessage()); 
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage(), 'data' => []]);
    exit;
}
?>