-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 15, 2025 at 06:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fastfood_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(6,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'Main'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `name`, `description`, `price`, `image_url`, `category`) VALUES
(1, 'Cheeseburger', 'A juicy beef burger with cheese and lettuce', 5.99, 'images/burger.jpg', 'Burgers'),
(2, 'French Fries', 'Crispy golden fries', 2.99, 'images/fries.jpg', 'Sides'),
(3, 'Cola', 'Chilled soft drink', 1.50, 'images/cola.jpg', 'Drinks'),
(4, 'Chicken Wrap', 'Grilled chicken wrap with sauce', 4.99, 'images/wrap.jpg', 'Wraps'),
(5, 'Spicy Chicken Sandwich', 'Crispy chicken fillet with fiery sauce and pickles on a toasted bun.', 6.99, 'images/spicy_chicken.jpg', 'Burgers'),
(6, 'Veggie Burger', 'Black bean patty topped with avocado and tomato.', 5.49, 'images/veggie_burger.jpg', 'Burgers'),
(7, 'Onion Rings', 'Thick-cut, battered onion rings served with dipping sauce.', 3.49, 'images/onion_rings.jpg', 'Sides'),
(8, 'Sweet Potato Fries', 'Healthier alternative, lightly salted and sweet.', 3.99, 'images/sweet_fries.jpg', 'Sides'),
(9, 'Milkshake (Chocolate)', 'Thick, creamy chocolate milkshake topped with whipped cream.', 4.50, 'images/choc_shake.jpg', 'Drinks'),
(10, 'Lemonade', 'Freshly squeezed and naturally sweetened.', 2.00, 'images/lemonade.jpg', 'Drinks'),
(11, 'BBQ Pulled Pork Wrap', 'Slow-cooked pork with tangy BBQ sauce and coleslaw.', 5.75, 'images/bbq_wrap.jpg', 'Wraps'),
(12, 'Fish Tacos (2pc)', 'Crispy fried fish with cabbage slaw and chipotle cream.', 7.99, 'images/fish_tacos.jpg', 'Specials'),
(13, 'Kids Chicken Nuggets (4pc)', 'White meat chicken nuggets, perfect for kids.', 4.25, 'images/nuggets.jpg', 'Kids Meal'),
(14, 'House Salad', 'Mixed greens, cucumber, tomatoes, and balsamic dressing.', 4.99, 'images/salad.jpg', 'Salads'),
(15, 'Ice Cream Sundae', 'Vanilla ice cream with hot fudge and nuts.', 3.50, 'images/sundae.jpg', 'Desserts'),
(16, 'Bacon Cheddar Burger', 'A classic beef patty topped with crispy bacon and sharp cheddar cheese.', 7.49, 'images/bacon_cheddar_burger.jpg', 'Burgers'),
(17, 'Double Deluxe Burger', 'Two juicy patties, secret sauce, lettuce, and pickles.', 8.99, 'images/double_deluxe_burger.jpg', 'Burgers'),
(18, 'Garlic Parmesan Fries', 'Fries tossed in garlic butter and grated Parmesan.', 4.50, 'images/garlic_parm_fries.jpg', 'Sides'),
(19, 'Chili Cheese Fries', 'Fries smothered in house-made chili and warm cheese sauce.', 5.25, 'images/chili_cheese_fries.jpg', 'Sides'),
(20, 'Orange Soda', 'Zesty, bubbly orange-flavored soft drink.', 1.50, 'images/orange_soda.jpg', 'Drinks'),
(21, 'Bottled Water', 'Premium spring water.', 1.00, 'images/bottled_water.jpg', 'Drinks'),
(22, 'Grilled Veggie Wrap', 'Assorted seasonal vegetables grilled and tossed with balsamic vinaigrette.', 4.75, 'images/grilled_veggie_wrap.jpg', 'Wraps'),
(23, 'Breakfast Burrito Wrap', 'Scrambled eggs, sausage, potatoes, and cheese in a warm tortilla.', 5.99, 'images/breakfast_burrito_wrap.jpg', 'Wraps'),
(24, 'Turkey Club Wrap', 'Turkey breast, bacon, lettuce, tomato, and mayo.', 6.25, 'images/turkey_club_wrap.jpg', 'Wraps'),
(25, 'Gourmet Mac & Cheese', 'Creamy baked mac and cheese with a crispy topping.', 7.25, 'images/gourmet_mac_cheese.jpg', 'Specials'),
(26, 'Firecracker Shrimp', 'Spicy popcorn shrimp served with a zesty dipping sauce.', 8.99, 'images/firecracker_shrimp.jpg', 'Specials'),
(27, 'Pulled Pork Sandwich', 'Slow-smoked pulled pork with BBQ sauce and pickles on a bun.', 7.50, 'images/pulled_pork_sandwich.jpg', 'Specials'),
(28, 'Daily Soup', 'A warm bowl of our chef’s fresh soup of the day.', 3.99, 'images/daily_soup.jpg', 'Specials'),
(29, 'Mini Hot Dogs (2pc)', 'Two small hot dogs on soft buns.', 3.75, 'images/mini_hot_dogs.jpg', 'Kids Meal'),
(30, 'Fruit Cup', 'Seasonal fresh fruit mix.', 2.50, 'images/fruit_cup.jpg', 'Kids Meal'),
(31, 'Kids Grilled Cheese', 'Classic melted cheese sandwich.', 4.00, 'images/kids_grilled_cheese.jpg', 'Kids Meal'),
(32, 'Apple Slices', 'A side of crisp apple slices.', 1.50, 'images/apple_slices.jpg', 'Kids Meal'),
(33, 'Caesar Salad (Chicken)', 'Crisp romaine, Parmesan, croutons, and grilled chicken.', 7.99, 'images/caesar_salad.jpg', 'Salads'),
(34, 'Southwest Salad', 'Black beans, corn, tortilla strips, and chipotle dressing.', 8.25, 'images/southwest_salad.jpg', 'Salads'),
(35, 'Cobb Salad', 'Chicken, bacon, egg, avocado, and blue cheese crumbles.', 8.50, 'images/cobb_salad.jpg', 'Salads'),
(36, 'Garden Side Salad', 'A small mixed green salad perfect as a side.', 3.99, 'images/garden_side_salad.jpg', 'Salads'),
(37, 'Lava Cake', 'Warm chocolate cake with a molten center.', 4.50, 'images/lava_cake.jpg', 'Desserts'),
(38, 'Apple Pie Turnover', 'Warm, flaky crust filled with spiced apples.', 2.99, 'images/apple_pie_turnover.jpg', 'Desserts'),
(39, 'Cookies (3pc)', 'Three freshly baked chocolate chip cookies.', 2.50, 'images/cookies.jpg', 'Desserts'),
(40, 'Brownie Bite', 'Small, rich chocolate brownie square.', 1.99, 'images/brownie_bite.jpg', 'Desserts');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `customer_address` varchar(255) DEFAULT NULL,
  `total` decimal(8,2) NOT NULL,
  `order_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `customer_name`, `customer_phone`, `customer_address`, `total`, `order_time`) VALUES
(1, NULL, 'Guest Customer', NULL, NULL, 15.98, '2025-10-22 18:02:40'),
(2, NULL, 'Saman Rathnayake', NULL, NULL, 13.48, '2025-10-22 18:05:12'),
(3, NULL, 'uditha', NULL, NULL, 31.73, '2025-10-23 12:44:04'),
(4, NULL, 'uditha', NULL, NULL, 31.73, '2025-10-23 12:45:08'),
(5, NULL, 'Kamal Gunarathne', NULL, NULL, 32.47, '2025-10-23 12:52:22'),
(6, NULL, 'Kamal Gunarathne', NULL, NULL, 27.98, '2025-10-23 13:10:04'),
(7, NULL, 'Guest Customer', NULL, NULL, 6.48, '2025-10-25 12:56:37'),
(8, NULL, 'Wikum Ruchithra', NULL, NULL, 29.96, '2025-10-26 13:20:03'),
(10, NULL, 'Dilum Palawaththa', NULL, NULL, 14.06, '2025-10-30 08:56:46'),
(11, 7, 'Dilum Palawaththa', NULL, NULL, 36.12, '2025-11-07 11:28:27'),
(12, 7, 'Dilum Palawaththa', NULL, NULL, 21.98, '2025-11-07 16:29:43'),
(13, 7, 'Dilum Palawaththa', NULL, NULL, 15.13, '2025-11-07 17:01:14'),
(14, 7, 'Dilum Palawaththa', NULL, NULL, 18.96, '2025-11-07 17:25:41'),
(15, 7, 'Dilum Palawaththa', NULL, NULL, 14.03, '2025-11-07 17:31:40'),
(16, 7, 'Dilum Palawaththa', NULL, NULL, 13.38, '2025-11-07 17:58:36'),
(17, 8, 'Upul Perera', NULL, NULL, 19.87, '2025-11-08 05:56:35'),
(18, 7, 'Dilum Palawaththa', NULL, NULL, 22.71, '2025-11-13 13:15:31'),
(19, NULL, 'Dilum Palawaththa', NULL, NULL, 36.52, '2025-11-14 11:08:31'),
(20, NULL, 'Dilum Palawaththa', NULL, NULL, 25.45, '2025-11-14 16:37:55');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `menu_item_id` int(11) NOT NULL,
  `customization_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`customization_details`)),
  `final_unit_price` decimal(6,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `menu_item_id`, `customization_details`, `final_unit_price`, `quantity`) VALUES
(1, 1, 17, NULL, 0.00, 1),
(2, 1, 5, NULL, 0.00, 1),
(3, 2, 1, NULL, 0.00, 1),
(4, 2, 16, NULL, 0.00, 1),
(5, 3, 17, NULL, 0.00, 1),
(6, 3, 9, NULL, 0.00, 1),
(7, 3, 35, NULL, 0.00, 1),
(8, 3, 7, NULL, 0.00, 1),
(9, 3, 24, NULL, 0.00, 1),
(10, 4, 17, NULL, 0.00, 1),
(11, 4, 9, NULL, 0.00, 1),
(12, 4, 35, NULL, 0.00, 1),
(13, 4, 7, NULL, 0.00, 1),
(14, 4, 24, NULL, 0.00, 1),
(15, 5, 1, NULL, 0.00, 1),
(16, 5, 15, NULL, 0.00, 1),
(17, 5, 9, NULL, 0.00, 1),
(18, 5, 31, NULL, 0.00, 1),
(19, 5, 35, NULL, 0.00, 1),
(20, 5, 2, NULL, 0.00, 2),
(21, 6, 1, NULL, 0.00, 1),
(22, 6, 38, NULL, 0.00, 1),
(23, 6, 10, NULL, 0.00, 1),
(24, 6, 13, NULL, 0.00, 4),
(25, 7, 40, NULL, 0.00, 2),
(26, 7, 39, NULL, 0.00, 1),
(27, 8, 17, NULL, 0.00, 1),
(28, 8, 1, NULL, 0.00, 1),
(29, 8, 16, NULL, 0.00, 2),
(31, 10, 5, NULL, 0.00, 1),
(32, 11, 17, '{\"added\":[\"Crispy Bacon (+ $1.50)\",\"Onion Rings (+ $0.50)\",\"BBQ Sauce (+ $0.30)\"],\"removed\":[],\"options\":[{\"title\":\"Combo Size\",\"name\":\"Large\",\"multiplier\":1.6}]}', 18.06, 2),
(33, 12, 33, '{\"added\":[\"Chipotle Ranch (+ $0.50)\",\"Fresh Avocado (+ $1.50)\",\"Hard Boiled Egg (+ $1.00)\"],\"removed\":[],\"options\":[]}', 10.99, 2),
(34, 13, 1, '{\"added\":[\"Extra Cheese (+ $1.00)\",\"Onion Rings (+ $0.50)\",\"BBQ Sauce (+ $0.30)\"],\"removed\":[],\"options\":[{\"title\":\"Combo Size\",\"name\":\"Medium\",\"multiplier\":1.3}]}', 10.13, 1),
(35, 13, 39, '{\"added\":[],\"removed\":[],\"options\":[]}', 2.50, 2),
(36, 14, 6, '{\"added\":[\"Extra Cheese (+ $1.00)\",\"Onion Rings (+ $0.50)\",\"Mayo\",\"BBQ Sauce (+ $0.30)\"],\"removed\":[],\"options\":[{\"title\":\"Combo Size\",\"name\":\"Medium\",\"multiplier\":1.3}]}', 9.48, 2),
(37, 15, 17, '{\"added\":[\"Extra Cheese (+ $1.00)\",\"Onion Rings (+ $0.50)\",\"Spicy Sauce (+ $0.30)\"],\"removed\":[],\"options\":[{\"title\":\"Combo Size\",\"name\":\"Medium\",\"multiplier\":1.3}]}', 14.03, 1),
(38, 16, 17, '{\"added\":[\"Extra Cheese (+ $1.00)\",\"Pickles\",\"Spicy Sauce (+ $0.30)\"],\"removed\":[],\"options\":[{\"title\":\"Combo Size\",\"name\":\"Medium\",\"multiplier\":1.3}]}', 13.38, 1),
(39, 17, 1, '{\"added\":[\"Extra Cheese (+ $1.00)\",\"BBQ Sauce (+ $0.30)\",\"Spicy Sauce (+ $0.30)\"],\"removed\":[],\"options\":[{\"title\":\"Combo Size\",\"name\":\"Medium\",\"multiplier\":1.3}]}', 9.87, 1),
(40, 17, 35, '{\"added\":[\"Chipotle Ranch (+ $0.50)\",\"Hard Boiled Egg (+ $1.00)\"],\"removed\":[],\"options\":[]}', 10.00, 1),
(41, 18, 17, '{\"added\":[\"Extra Cheese (+ $1.00)\",\"BBQ Sauce (+ $0.30)\"],\"removed\":[],\"options\":[{\"title\":\"Combo Size\",\"name\":\"Large\",\"multiplier\":1.6}]}', 16.46, 1),
(42, 18, 10, NULL, 2.00, 1),
(43, 18, 13, NULL, 4.25, 1),
(44, 19, 1, '{\"added\":[\"Crispy Bacon (+ $1.50)\",\"Onion Rings (+ $0.50)\",\"Mayo\",\"BBQ Sauce (+ $0.30)\"],\"removed\":[],\"options\":[{\"title\":\"Combo Size\",\"name\":\"Large\",\"multiplier\":1.6}]}', 13.26, 2),
(45, 19, 35, '{\"added\":[\"Chipotle Ranch (+ $0.50)\",\"Hard Boiled Egg (+ $1.00)\"],\"removed\":[],\"options\":[]}', 10.00, 1),
(46, 20, 17, NULL, 8.99, 1),
(47, 20, 17, '{\"added\":[\"Extra Cheese (+ $1.00)\",\"BBQ Sauce (+ $0.30)\"],\"removed\":[],\"options\":[{\"title\":\"Combo Size\",\"name\":\"Large\",\"multiplier\":1.6}]}', 16.46, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method` varchar(50) NOT NULL DEFAULT 'Credit Card',
  `last_four_digits` varchar(4) NOT NULL,
  `transaction_status` varchar(50) NOT NULL DEFAULT 'Successful',
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `payment_method`, `last_four_digits`, `transaction_status`, `payment_date`) VALUES
(1, 1, 'Credit Card', '3311', 'Successful', '2025-10-22 18:02:40'),
(2, 2, 'Credit Card', '5165', 'Successful', '2025-10-22 18:05:13'),
(3, 3, 'Credit Card', '2555', 'Successful', '2025-10-23 12:44:05'),
(4, 4, 'Credit Card', '2555', 'Successful', '2025-10-23 12:45:08'),
(5, 5, 'Credit Card', '8954', 'Successful', '2025-10-23 12:52:22'),
(6, 6, 'Credit Card', '2561', 'Successful', '2025-10-23 13:10:04'),
(7, 7, 'Credit Card', '6511', 'Successful', '2025-10-25 12:56:37'),
(8, 8, 'Credit Card', '1611', 'Successful', '2025-10-26 13:20:04'),
(9, 10, 'Credit Card', '6513', 'Successful', '2025-10-30 08:56:46'),
(10, 11, 'Credit Card', '1513', 'completed', '2025-11-07 11:28:27'),
(11, 12, 'Credit Card', '4684', 'completed', '2025-11-07 16:29:43'),
(12, 13, 'Credit Card', '4135', 'completed', '2025-11-07 17:01:14'),
(13, 14, 'Credit Card', '1151', 'completed', '2025-11-07 17:25:41'),
(14, 15, 'Credit Card', '5386', 'completed', '2025-11-07 17:31:40'),
(15, 16, 'Credit Card', '3518', 'completed', '2025-11-07 17:58:36'),
(16, 17, 'Credit Card', '1532', 'completed', '2025-11-08 05:56:35'),
(17, 18, 'Credit Card', '5651', 'completed', '2025-11-13 13:15:31'),
(18, 19, 'Credit Card', '4765', 'completed', '2025-11-14 11:08:31'),
(19, 20, 'Credit Card', '1531', 'completed', '2025-11-14 16:37:56');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer',
  `full_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `full_name`, `created_at`) VALUES
(1, 'rathnayakesaman@gmail.com', '$2y$10$XnRoSSwpeFq2rxMz8Ot0l.TcFu4JSD0192S9r6aQtM1offmvsJZiq', 'customer', 'Saman Rathnayake', '2025-10-15 09:59:59'),
(2, 'ruchithrawikum@gmail.com', '$2y$10$nMBrOeaSRGla1njTo7bEQedTon0pWrBbHid1.MwWB4tgLYTPOx9ma', 'customer', 'Wikum Ruchithra', '2025-10-17 14:36:55'),
(3, 'udi123@gmail.com', '$2y$10$xQC9qsMI6GoDqxZDJjc7ROwm33RQHWwaKKbSfbm5lMSF73s4Da/G.', 'customer', 'uditha', '2025-10-23 12:40:39'),
(4, 'gunarathnekamal@gmail.com', '$2y$10$a0op/vVCxqoVZJElKuGVNuWvyYoUjPB3Z/vQuxdmF8ZZEu81Ld3VK', 'customer', 'Kamal Gunarathne', '2025-10-23 12:50:19'),
(5, 'ohnp2003@gmail.com', '$2y$10$eHwqh/DnGmG9FGgVqR2jXeXpRGxHNShlDNRbo1VQS5cdXJ.fn..sq', 'customer', 'osanda', '2025-10-25 12:53:54'),
(6, 'pelawathwikum@gmail.com', '$2y$10$TLFsmIrlTs9IM4gFnX..gOvc6f9XmSi7Y0wE7ATZA9vd04yEGdLni', 'customer', 'Wikum Ruchithra', '2025-10-26 13:17:50'),
(7, 'palawaththadilum@gmail.com', '$2y$10$B71/LIJ12tAP7F/OAlvniueo8OF9faYYarDJ7imM4BeyIJB24bLVG', 'customer', 'Dilum Palawaththa', '2025-10-29 18:20:24'),
(8, 'pereraupul@gmail.com', '$2y$10$z/1NMmrO01X29FREZH5Sj.dzb1CbW3v6pNJzAczaC0Y/Z5ZvsfgZm', 'customer', 'Upul Perera', '2025-11-08 05:54:34'),
(9, 'pereraadamfastfood@gmail.com', '$2y$10$hN.R6v1zzIXp3NmYPGEVL.a3PSOby1301qXOu9tJ0y7OY.yR/FTta', 'admin', 'Adam Perera', '2025-11-14 11:04:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_ibfk_1` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `menu_item_id` (`menu_item_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
