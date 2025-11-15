<?php
// get_menu.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$servername = "localhost";
$username = "root";       
$password = "";           
$dbname = "fastfood_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$sql = "SELECT id, name, description, price, image_url, category FROM menu_items ORDER BY category, name";
$result = $conn->query($sql);

$menu_data = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $category = $row['category'];
        unset($row['category']);
        $row['price'] = (float)$row['price']; 
        
        if (!isset($menu_data[$category])) {
            $menu_data[$category] = [];
        }
        $menu_data[$category][] = $row;
    }
    
    echo json_encode($menu_data);
    
} else {
    echo json_encode([]);
}

$conn->close();
?>