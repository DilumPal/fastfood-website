<?php
// admin_users.php - Fetches all users from the database.

ob_start(); 
error_reporting(0); // Suppress errors that might break JSON

header('Content-Type: application/json');
// CRITICAL: Ensure this matches your React app's URL
header('Access-Control-Allow-Origin: http://localhost:3000'); 
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle the CORS preflight request
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
        // This exception is caught by the final catch block
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // --- 2. SQL Query ---
    // Fetch users with their role, ordered by ID
    $sql = "SELECT id, full_name, email, role, created_at FROM users ORDER BY id DESC";
    $result = $conn->query($sql);

    // Check if the query itself failed (e.g., table doesn't exist)
    if ($result === false) {
        throw new Exception("SQL Query failed: " . $conn->error);
    }

    // --- 3. Process Data ---
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    $conn->close();
    
    // --- 4. Success Response ---
    ob_clean();
    echo json_encode(['success' => true, 'data' => $users]);
    exit;

} catch (Exception $e) {
    // --- 5. Error Response (Guaranteed clean JSON output) ---
    http_response_code(500); 
    ob_clean();
    // Log the error for server-side debugging
    error_log("admin_users.php error: " . $e->getMessage()); 
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage(), 'data' => []]);
    exit;
}
?>