<?php
// admin_analytics.php - Updated for Last 7 Days Trends

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

$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "fastfood_db";

$COGS_PERCENTAGE = 0.30; // Using 30% of revenue as the estimated Cost of Goods Sold

$response = [
    'success' => false,
    'message' => 'An unknown error occurred.',
    'data' => []
];

try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    // --- 1. Metric Aggregations (Revenue, COGS, Profit, Frequency) ---

    // Total Revenue, Total COGS (Estimated), and Total Orders/Users
    $sql_metrics = "
        SELECT 
            (SELECT SUM(total) FROM orders) AS total_revenue_all_time,
            (SELECT SUM(total) FROM orders WHERE MONTH(order_time) = MONTH(NOW()) AND YEAR(order_time) = YEAR(NOW())) AS monthly_sales,
            (SELECT COUNT(id) FROM orders) AS total_orders,
            (SELECT COUNT(DISTINCT user_id) FROM orders WHERE user_id IS NOT NULL) AS unique_users
    ";
    
    $result_metrics = $conn->query($sql_metrics);
    if ($result_metrics === false) {
        throw new Exception("SQL Query failed for core metrics: " . $conn->error);
    }
    $metrics = $result_metrics->fetch_assoc();
    
    // Calculate total COGS based on order_items (30% of final price)
    $sql_cogs = "
        SELECT 
            SUM(oi.quantity * oi.final_unit_price * {$COGS_PERCENTAGE}) AS total_estimated_cogs
        FROM order_items oi
    ";

    $result_cogs = $conn->query($sql_cogs);
    if ($result_cogs === false) {
        throw new Exception("SQL Query failed for COGS: " . $conn->error);
    }
    $cogs_data = $result_cogs->fetch_assoc();
    
    $total_revenue = (float)$metrics['total_revenue_all_time'];
    $total_cogs = (float)$cogs_data['total_estimated_cogs'];
    $net_profit = $total_revenue - $total_cogs;
    
    $total_orders = (int)$metrics['total_orders'];
    $unique_users = (int)$metrics['unique_users'];
    $customer_frequency = $unique_users > 0 ? $total_orders / $unique_users : 0;
    
    // Store core metrics
    $response['data']['metrics'] = [
        'monthly_sales' => (float)$metrics['monthly_sales'],
        'total_revenue' => $total_revenue,
        'net_profit' => $net_profit, // Revenue - Estimated COGS
        'customer_frequency' => number_format($customer_frequency, 2) . ' orders/user',
    ];


    // --- 2. Top/Least Selling Items ---
    $item_performance_sql = "
        SELECT 
            mi.name, 
            SUM(oi.quantity) AS total_sold, 
            SUM(oi.quantity * oi.final_unit_price) AS total_revenue
        FROM order_items oi
        INNER JOIN menu_items mi ON oi.menu_item_id = mi.id
        GROUP BY mi.id
        HAVING total_sold > 0
        ORDER BY total_sold
    ";
    
    $result_performance = $conn->query($item_performance_sql);
    if ($result_performance === false) {
        throw new Exception("SQL Query failed for item performance: " . $conn->error);
    }
    
    $all_items_performance = [];
    while ($row = $result_performance->fetch_assoc()) {
        $row['total_sold'] = (int)$row['total_sold'];
        $row['total_revenue'] = (float)$row['total_revenue'];
        $all_items_performance[] = $row;
    }
    
    // Separate into Top (DESC) and Least (ASC)
    usort($all_items_performance, function($a, $b) {
        return $b['total_sold'] - $a['total_sold']; // Sort Descending
    });
    $response['data']['top_selling_items'] = array_slice($all_items_performance, 0, 5);
    
    usort($all_items_performance, function($a, $b) {
        return $a['total_sold'] - $b['total_sold']; // Sort Ascending
    });
    $response['data']['least_selling_items'] = array_slice($all_items_performance, 0, 5);


    // --- 3. Order Trends (Last 7 Days) ---
    $sql_trends = "
        SELECT 
            DATE_FORMAT(order_time, '%Y-%m-%d') AS order_day, 
            SUM(total) AS total_revenue, 
            COUNT(id) AS total_orders 
        FROM orders
        WHERE order_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY order_day
        ORDER BY order_day ASC
    ";
    
    $result_trends = $conn->query($sql_trends);
    if ($result_trends === false) {
        throw new Exception("SQL Query failed for order trends: " . $conn->error);
    }
    
    $trends = [];
    while ($row = $result_trends->fetch_assoc()) {
        $trends[] = [
            'day' => $row['order_day'], // Changed key from 'month' to 'day'
            'totalOrders' => (int)$row['total_orders'],
            'totalRevenue' => (float)$row['total_revenue'],
        ];
    }
    $response['data']['order_trends'] = $trends;
    
    $response['success'] = true;
    $response['message'] = "Analytics data fetched successfully using estimated COGS (30% of revenue).";

} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = "Server error: " . $e->getMessage();
} finally {
    if (isset($conn)) {
        $conn->close();
    }
    ob_clean();
    echo json_encode($response);
}
?>