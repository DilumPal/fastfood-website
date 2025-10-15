<?php
// 1. MUST BE THE FIRST EXECUTABLE LINES: Set CORS headers.
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");

include 'db.php';

// 2. CHECK: Handle database connection failure without dying or echoing.
if ($conn->connect_error) {
    http_response_code(500); // Set status code to 500 (Internal Server Error)
    echo json_encode(["error" => "Database connection failed. Please check db.php and fastfood_db setup."]);
    exit(); // Stop script execution
}

// 3. SUCCESS PATH: Fetch and encode data
$result = $conn->query("SELECT * FROM menu_items");
$data = [];

if ($result) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    // Handle query error (e.g., if the 'menu_items' table doesn't exist)
    http_response_code(500);
    echo json_encode(["error" => "SQL query failed: " . $conn->error]);
    exit();
}

// Output the JSON data (HTTP 200 is default)
echo json_encode($data);

$conn->close();
?>