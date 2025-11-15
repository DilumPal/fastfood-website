FastFood Website 🍔
A full‑stack fast food ordering platform built with PHP, MySQL, HTML/CSS, and JavaScript. This system allows customers to browse menu items, customize orders, and complete purchases, while storing order and payment data in a backend database.

🚀 Features
🛒 Customer Features
Browse food categories (Burgers, Sides, Drinks, Wraps, etc.)
View item descriptions, images, and prices
Add items to cart
Submit orders with customer details
Automatic order total calculation
🧾 Order & Payment Handling
Orders stored in MySQL database
Supports item customizations (JSON-based)
Payment records stored with method & status
🔐 User System
Users table storing:

Email
Password hash (bcrypt)
Role (customer/admin)
Admin can view or track user orders

🧰 Tech Stack
Frontend: HTML, CSS, JavaScript Backend: PHP (Procedural / Custom API endpoints) Database: MySQL Environment: XAMPP

📁 Project Structure
fastfood-website/
├─ api/               # PHP backend scripts (menu, orders, payments, etc.)
├─ frontend/          # UI pages, CSS, JS
├─ database/          # SQL file 
└─ README.md          # Project documentation
🗄️ Database Setup
Your project requires a MySQL database. To set it up:

Create a database (example name):

CREATE DATABASE fastfood_db;
Import the SQL file:

Open phpMyAdmin → Select your database
Go to the Import tab
Upload fastfood_db.sql (or your cleaned version)
Update your backend config file (api/ folder) with:

$dbHost = "localhost";
$dbUser = "root";        
$dbPass = "";            
$dbName = "fastfood_db";
🖥️ How to Run the Project Locally
✔ Using XAMPP (Recommended)
Install XAMPP

Copy the project folder into:

C:/xampp/htdocs/fastfood-website
Start Apache and MySQL in XAMPP Control Panel

Navigate to:

http://localhost/fastfood-website/frontend/
Your backend APIs will run under:

http://localhost/fastfood-website/api/
👨‍💻 Author
Dilum Palawaththa Creator & developer of the full project.
