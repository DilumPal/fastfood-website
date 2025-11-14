<?php
// admin_order_details.php - Fetches items and customizations for a specific order ID.

ob_start(); 
error_reporting(0); // Prevents PHP errors from breaking JSON output

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); 
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- 1. Database Configuration ---
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "fastfood_db";

try {
    // --- 2. Validate Input ---
    if (!isset($_GET['order_id']) || !is_numeric($_GET['order_id'])) {
        http_response_code(400);
        throw new Exception("Invalid or missing order ID.");
    }
    $orderId = (int)$_GET['order_id'];

    // --- 3. Database Connection ---
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    // --- 4. CORRECTED SQL Query (Using LEFT JOIN for stability and fetching customizations) ---
    $sql = "
        SELECT 
            oi.quantity,
            oi.final_unit_price, 
            oi.customizations,     
            mi.name AS item_name   /* Will be NULL if the original menu item was deleted */
        FROM order_items oi
        LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE oi.order_id = ?
    ";
    
    $stmt = $conn->prepare($sql);
    
    if ($stmt === false) {
        throw new Exception("SQL Prepare failed: Check table/column names. Error: " . $conn->error);
    }
    
    $stmt->bind_param("i", $orderId);
    
    if (!$stmt->execute()) {
        throw new Exception("SQL Execute failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();

    // --- 5. Process Data ---
    $items = [];
    while ($row = $result->fetch_assoc()) {
        // Rename for frontend compatibility
        $row['price_at_time'] = (float)$row['final_unit_price']; 
        unset($row['final_unit_price']);
        
        $row['quantity'] = (int)$row['quantity'];
        
        // Handle case where menu_item name might be NULL due to LEFT JOIN
        $row['item_name'] = $row['item_name'] ?? 'Unknown Item (ID:' . $row['menu_item_id'] . ')';

        // Ensure customizations is a string, or null if empty
        $row['customizations'] = $row['customizations'] ? trim($row['customizations']) : null;
        
        $items[] = $row;
    }

    $stmt->close();
    $conn->close();
    
    // --- 6. Success Response ---
    ob_clean();
    echo json_encode(['success' => true, 'data' => $items, 'order_id' => $orderId]);
    exit;

} catch (Exception $e) {
    // --- 7. Error Response ---
    if (http_response_code() === 200) {
        http_response_code(500); 
    }
    ob_clean();
    error_log("admin_order_details.php error: " . $e->getMessage()); 
    
    echo json_encode(['success' => false, 'message' => 'Internal Server Error. Please check your server logs. Details: ' . $e->getMessage(), 'data' => []]);
    exit;
}
?>