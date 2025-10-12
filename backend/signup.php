<?php
header('Content-Type: application/json');
// Allow access from your React development server (important for development)
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// --- 1. Database Configuration ---
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "fastfood_db";

// --- 2. Get JSON Input ---
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Check if data is valid
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($data)) {
    echo json_encode(['success' => false, 'message' => 'Invalid request method or missing data.']);
    exit;
}

$fullName = $data['fullName'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Basic server-side validation
if (empty($fullName) || empty($email) || empty($password) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid or missing fields.']);
    exit;
}

// --- 3. Establish Database Connection ---
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// --- 4. Check if User Already Exists ---
$stmt_check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    $stmt_check->close();
    $conn->close();
    echo json_encode(['success' => false, 'message' => 'An account with this email already exists.']);
    exit;
}
$stmt_check->close();

// --- 5. Hash Password and Insert User ---
// IMPORTANT: Use password_hash() for security
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$stmt_insert = $conn->prepare("INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)");
$stmt_insert->bind_param("sss", $fullName, $email, $hashed_password);

if ($stmt_insert->execute()) {
    echo json_encode(['success' => true, 'message' => 'User registered successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error registering user: ' . $stmt_insert->error]);
}

// --- 6. Cleanup ---
$stmt_insert->close();
$conn->close();

?>