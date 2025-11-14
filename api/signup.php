<?php
// Make sure this file has NO extra spaces or lines before <?php !

// --- 1. Headers & Config ---
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

// --- 2. Database Connection ---
$servername = "localhost";
$username = "root"; // adjust if needed
$password = "";     // adjust if needed
$dbname = "fastfood_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// --- 3. Read JSON Input ---
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'No JSON data received.']);
    exit;
}

$fullName = trim($data['fullName'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// --- 4. Validation ---
if (empty($fullName) || empty($email) || empty($password)) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

// --- 5. Check if Email Already Exists ---
$stmt_check = $conn->prepare("SELECT id FROM users WHERE email = ?");
if ($stmt_check === false) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}
$stmt_check->bind_param("s", $email);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    $stmt_check->close();
    $conn->close();
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'An account with this email already exists.']);
    exit;
}
$stmt_check->close();

// --- 6. Insert New User (Default role is 'customer') ---
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$role = 'customer'; // ⚠️ CRITICAL: Set the default role

// ⚠️ MODIFIED: Inserting the 'role' column now
$stmt_insert = $conn->prepare("INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)");
if ($stmt_insert === false) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Failed to prepare insert statement: ' . $conn->error]);
    exit;
}

// ⚠️ MODIFIED: Binding $role as the fourth string parameter
$stmt_insert->bind_param("ssss", $fullName, $email, $hashed_password, $role);

if ($stmt_insert->execute()) {
    $stmt_insert->close();
    $conn->close();
    ob_clean();
    echo json_encode(['success' => true, 'message' => 'Registration successful! Please log in.']);
} else {
    $stmt_insert->close();
    $conn->close();
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $conn->error]);
}
?>