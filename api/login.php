<?php
// CRITICAL FIX 1: Start Output Buffering to catch and suppress any unwanted output
ob_start();

// FIX: Suppress warnings/notices that might contaminate the JSON response
error_reporting(0); 

header('Content-Type: application/json');
// Allow access from your React development server
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// --- 1. Database Configuration ---
$servername = "localhost";
$username = "root"; 
$password = ""; // Double-check your MySQL root password here!
$dbname = "fastfood_db"; // Double-check your database name!

// --- 2. Get JSON Input ---
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($data)) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Invalid request method or missing data.']);
    exit;
}

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Please fill in both email and password.']);
    exit;
}

// --- 3. Establish Database Connection ---
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    ob_clean(); // Clean buffer before sending
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// --- 4. Retrieve Hashed Password ---
$stmt = $conn->prepare("SELECT id, password_hash, full_name FROM users WHERE email = ?");

// CRITICAL FIX 2: Check for failure in preparing the statement
if ($stmt === false) {
    ob_clean(); // Clean buffer before sending
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement. SQL Error: ' . $conn->error]);
    $conn->close();
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

// --- 5. Verify User and Password ---
if ($stmt->num_rows === 1) {
    $stmt->bind_result($user_id, $hashed_password, $full_name);
    $stmt->fetch();
    
    // CRITICAL STEP: Use password_verify to check the submitted password against the hash
    if (password_verify($password, $hashed_password)) {
        // Login successful
        $stmt->close();
        $conn->close();
        ob_clean(); // Clean buffer before sending
        echo json_encode(['success' => true, 'message' => 'Login successful. Welcome ' . $full_name . '!', 'userId' => $user_id]);
        exit;
    }
}

// Login failed (either no user found or password was incorrect)
$stmt->close();
$conn->close();
ob_clean(); // Clean buffer before sending
echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
?>