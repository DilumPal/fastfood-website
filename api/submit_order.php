<?php
// submit_order.php (FULL FIX: Handles CORS preflight, Payments, and Database Fields)
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); // ⚠️ Added OPTIONS
header("Access-Control-Max-Age: 3600"); // Cache preflight response for 1 hour
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// **FIX:** Handle the CORS preflight request
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

// Basic validation for both order and payment data
if (!isset($data['total']) || !isset($data['customer_name']) || !isset($data['items']) || !is_array($data['items']) || !isset($data['payment_details'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid order or payment data provided."]);
    exit();
}

// Order details
$user_id = $data['user_id'] ?? null; 
$customer_name = $data['customer_name'];
$customer_phone = $data['customer_phone'] ?? null; // Added phone
$customer_address = $data['customer_address'] ?? null; // Added address
$total = (float)$data['total'];
$items = $data['items'];

// Payment details
$last_four = $data['payment_details']['last_four_digits'];
$method = $data['payment_details']['payment_method'];
$status = "Successful"; // Always successful for this fake payment

// Start Transaction
$conn->begin_transaction();
$order_id = null;

try {
    // 1. Insert into the 'orders' table
    // NOTE: We MUST include customer_phone and customer_address in the query now.
    $sql_order = "INSERT INTO orders (customer_name, customer_phone, customer_address, total) VALUES (?, ?, ?, ?)";
    
    // **User ID handling is more complex due to being null. We'll stick to fields available in current DB.**
    // If you apply the SQL updates from the initial response, you should include user_id here.
    
    $stmt_order = $conn->prepare($sql_order);
    $stmt_order->bind_param("sssd", $customer_name, $customer_phone, $customer_address, $total); // 's' for string, 'd' for decimal
    
    if (!$stmt_order->execute()) {
        throw new Exception("Error inserting into orders: " . $stmt_order->error);
    }
    
    $order_id = $conn->insert_id; // Get the ID of the newly created order
    $stmt_order->close();
    
    // 2. Insert into the 'order_items' table
    $stmt_items = $conn->prepare("INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES (?, ?, ?)");
    $stmt_items->bind_param("iii", $order_id_ref, $menu_item_id, $quantity); 

    foreach ($items as $item) {
        $order_id_ref = $order_id;
        $menu_item_id = $item['menu_item_id'];
        $quantity = $item['quantity'];
        
        if (!$stmt_items->execute()) {
            throw new Exception("Error inserting item " . $menu_item_id . ": " . $stmt_items->error);
        }
    }
    
    $stmt_items->close();

    // 3. Insert into the 'payments' table ⚠️ NEW LOGIC
    $stmt_payment = $conn->prepare("INSERT INTO payments (order_id, payment_method, last_four_digits, transaction_status) VALUES (?, ?, ?, ?)");
    $stmt_payment->bind_param("isss", $order_id, $method, $last_four, $status);
    
    if (!$stmt_payment->execute()) {
        throw new Exception("Error inserting into payments: " . $stmt_payment->error);
    }
    
    $stmt_payment->close();

    // Commit transaction
    $conn->commit();

    echo json_encode(["success" => true, "order_id" => $order_id]);

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Transaction failed. " . $e->getMessage()]);
}

session_start();

if(!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(["message" => "Unauthorized"]);
  exit();
}


$conn->close();
?>