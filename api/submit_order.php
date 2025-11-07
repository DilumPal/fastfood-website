<?php
// submit_order.php (FULL FIX: Robust Payment Insertion)
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Max-Age: 3600"); 
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle the CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// CRITICAL: Replace with your actual database credentials
$servername = "localhost";
$username = "root";       // Your MySQL user
$password = "";           // Your MySQL password
$dbname = "fastfood_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Get the JSON data from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Basic validation 
if (!isset($data['total']) || !isset($data['items']) || !isset($data['payment_details'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required order or payment data."]);
    exit();
}

$user_id = $data['user_id'] ?? null;
$customer_name = $data['customer_name'] ?? 'Guest';
// Data retrieval is correct:
$customer_phone = $data['customer_phone'] ?? null;
$customer_address = $data['customer_address'] ?? null;

$total = (double)($data['total'] ?? 0.00); // Safely convert total
$items = $data['items'];
$payment = $data['payment_details'];

// ⚠️ FIX: Use the null-coalescing operator (??) to safely pull payment data
$method = $payment['payment_method'] ?? 'Credit Card';
$last_four = $payment['last_four_digits'] ?? 'XXXX';
$status = $payment['status'] ?? "completed"; 

// Start transaction
$conn->begin_transaction();

try {
    // 1. Insert into 'orders' table
    // The INSERT statement is correct and includes the new columns:
    $stmt_order = $conn->prepare("INSERT INTO orders (user_id, customer_name, customer_phone, customer_address, total, order_time) VALUES (?, ?, ?, ?, ?, NOW())");
    
    // Binding parameters is correct:
    $stmt_order->bind_param("isssd", $user_id, $customer_name, $customer_phone, $customer_address, $total);
    
    if (!$stmt_order->execute()) {
        throw new Exception("Error inserting order: " . $stmt_order->error);
    }
    
    $order_id = $conn->insert_id;
    $stmt_order->close();
    
    // 2. Insert order items into 'order_items'
    $stmt_items = $conn->prepare("INSERT INTO order_items (order_id, menu_item_id, quantity, customization_details, final_unit_price) VALUES (?, ?, ?, ?, ?)");
    $stmt_items->bind_param("iiisd", $order_id_ref, $menu_item_id, $quantity, $customization_details, $final_unit_price); 

    foreach ($items as $item) {
        $order_id_ref = $order_id;
        $menu_item_id = $item['menu_item_id'];
        $quantity = $item['quantity'];
        
        $customization_details = $item['customization_details'] ?? null; 
        $final_unit_price = (double)($item['final_unit_price'] ?? 0.00);

        if ($customization_details === 'null') {
             $customization_details = null;
        }

        if (!$stmt_items->execute()) {
            throw new Exception("Error inserting item " . $menu_item_id . ": " . $stmt_items->error);
        }
    }
    
    $stmt_items->close();

    // 3. Insert into the 'payments' table ⚠️ CHECK TABLE SCHEMA!
    // Assumes payments table has: order_id (int), payment_method (string), last_four_digits (string), transaction_status (string)
    $stmt_payment = $conn->prepare("INSERT INTO payments (order_id, payment_method, last_four_digits, transaction_status) VALUES (?, ?, ?, ?)");
    $stmt_payment->bind_param("isss", $order_id, $method, $last_four, $status);
    
    if (!$stmt_payment->execute()) {
        // This is the most likely source of the error.
        throw new Exception("Database Error inserting into payments: " . $stmt_payment->error);
    }
    
    $stmt_payment->close();

    // Commit transaction
    $conn->commit();

    echo json_encode(["success" => true, "order_id" => $order_id]);
    exit();

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    
    http_response_code(500);
    error_log("Order submission error: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Transaction failed. Please contact support. Details: " . $e->getMessage()]);
    exit();
}

$conn->close();
?>