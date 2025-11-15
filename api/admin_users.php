<?php
// admin_users.php 
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
    $servername = "localhost";
    $username = "root"; 
    $password = ""; 
    $dbname = "fastfood_db";
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT id, full_name, email, role, created_at FROM users ORDER BY id DESC";
    $result = $conn->query($sql);

    if ($result === false) {
        throw new Exception("SQL Query failed: " . $conn->error);
    }

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    $conn->close();
    
    ob_clean();
    echo json_encode(['success' => true, 'data' => $users]);
    exit;

} catch (Exception $e) {
    http_response_code(500); 
    ob_clean();
    error_log("admin_users.php error: " . $e->getMessage()); 
    echo json_encode(['success' => false, 'message' => 'Server Error: ' . $e->getMessage(), 'data' => []]);
    exit;
}
?>