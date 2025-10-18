<?php
// submit_order.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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
if (!isset($data['total']) || !isset($data['customer_name']) || !isset($data['items']) || !is_array($data['items'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid order data provided."]);
    exit();
}

$customer_name = $data['customer_name'];
$total = (float)$data['total'];
$items = $data['items'];

// Start Transaction to ensure all data is inserted successfully or none at all
$conn->begin_transaction();
$order_id = null;

try {
    // 1. Insert into the 'orders' table
    // order_time uses the default CURRENT_TIMESTAMP
    $stmt_order = $conn->prepare("INSERT INTO orders (customer_name, total) VALUES (?, ?)");
    $stmt_order->bind_param("sd", $customer_name, $total); // 's' for string, 'd' for double/decimal
    
    if (!$stmt_order->execute()) {
        throw new Exception("Error inserting into orders: " . $stmt_order->error);
    }
    
    $order_id = $conn->insert_id; // Get the ID of the newly created order
    $stmt_order->close();
    
    // 2. Insert into the 'order_items' table
    // Note: We are ignoring the 'id' column as it's AUTO_INCREMENT
    $stmt_items = $conn->prepare("INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)");
    $stmt_items->bind_param("iii", $order_id_ref, $menu_item_id, $quantity); // 'i' for integer

    foreach ($items as $item) {
        $order_id_ref = $order_id;
        $menu_item_id = $item['menu_item_id'];
        $quantity = $item['quantity'];
        
        if (!$stmt_items->execute()) {
            throw new Exception("Error inserting item " . $menu_item_id . ": " . $stmt_items->error);
        }
    }
    
    $stmt_items->close();

    // Commit transaction
    $conn->commit();

    echo json_encode(["success" => true, "order_id" => $order_id]);

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Transaction failed. " . $e->getMessage()]);
}

$conn->close();
?>