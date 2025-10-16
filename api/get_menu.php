<?php
header("Content-Type: application/json; charset=UTF-8");
// CRITICAL: Allow CORS for your React app running on a different port (e.g., 3000)
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


// CRITICAL: Replace with your actual database credentials
$servername = "localhost";
$username = "root";       // Your MySQL user
$password = "";           // Your MySQL password
$dbname = "fastfood_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // Return a 500 status code with a JSON error message
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$sql = "SELECT id, name, description, price, image_url, category FROM menu_items ORDER BY category, name";
$result = $conn->query($sql);

$menu_data = [];

if ($result && $result->num_rows > 0) {
    // Process results into a categorized structure
    while($row = $result->fetch_assoc()) {
        $category = $row['category'];
        
        // Remove 'category' key from the item array before pushing
        unset($row['category']);
        
        // Ensure price is treated as a float
        $row['price'] = (float)$row['price']; 
        
        if (!isset($menu_data[$category])) {
            $menu_data[$category] = [];
        }
        $menu_data[$category][] = $row;
    }
    
    // Output the JSON
    echo json_encode($menu_data);
    
} else {
    // No results found
    echo json_encode([]);
}

$conn->close();
?>