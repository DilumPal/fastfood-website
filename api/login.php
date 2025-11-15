<?php
// login.php
ob_start();
error_reporting(0); 

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$servername = "localhost";
$username = "root"; 
$password = "";
$dbname = "fastfood_db";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    ob_clean(); 
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'No JSON data received.']);
    exit;
}

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Please fill in both email and password.']);
    exit;
}

$stmt = $conn->prepare("SELECT id, password_hash, full_name, role FROM users WHERE email = ?");

if ($stmt === false) {
    ob_clean(); 
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement. SQL Error: ' . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
    $stmt->bind_result($user_id, $hashed_password, $full_name, $role);
    $stmt->fetch();
    
    if (password_verify($password, $hashed_password)) {
        $stmt->close();
        $conn->close();
        ob_clean();
        echo json_encode([
            'success' => true, 
            'message' => 'Login successful. Welcome ' . $full_name . '!', 
            'userId' => $user_id,
            'fullName' => $full_name,
            'role' => $role 
        ]);
        exit;
    }
}

$stmt->close();
$conn->close();
ob_clean();
echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
exit;
?>