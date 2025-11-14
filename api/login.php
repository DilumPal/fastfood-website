<?php
// CRITICAL FIX 1: Start Output Buffering to catch and suppress any unwanted output
ob_start();

// FIX: Suppress warnings/notices that might contaminate the JSON response
error_reporting(0); 

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- 1. Database Configuration ---
$servername = "localhost";
$username = "root"; 
$password = ""; // ADJUST THIS IF YOUR MYSQL PASSWORD IS NOT EMPTY
$dbname = "fastfood_db";

// --- 2. Establish Database Connection ---
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    ob_clean(); // Clean buffer before sending
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

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// --- 4. Basic Validation ---
if (empty($email) || empty($password)) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Please fill in both email and password.']);
    exit;
}

// --- 5. Retrieve Hashed Password and ROLE ---
// ⚠️ MODIFIED: Selecting the 'role' column now
$stmt = $conn->prepare("SELECT id, password_hash, full_name, role FROM users WHERE email = ?");

if ($stmt === false) {
    ob_clean(); // Clean buffer before sending
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement. SQL Error: ' . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

// --- 6. Verify User and Password ---
if ($stmt->num_rows === 1) {
    // ⚠️ MODIFIED: Binding the 'role' variable
    $stmt->bind_result($user_id, $hashed_password, $full_name, $role);
    $stmt->fetch();
    
    if (password_verify($password, $hashed_password)) {
        // Login successful - return user data (userId, fullName, and ROLE are critical)
        $stmt->close();
        $conn->close();
        ob_clean();
        echo json_encode([
            'success' => true, 
            'message' => 'Login successful. Welcome ' . $full_name . '!', 
            'userId' => $user_id,
            'fullName' => $full_name,
            'role' => $role // ⚠️ CRITICAL: Return the user's role
        ]);
        exit;
    }
}

// Login failed (no user or wrong password)
$stmt->close();
$conn->close();
ob_clean();
echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
exit;
?>