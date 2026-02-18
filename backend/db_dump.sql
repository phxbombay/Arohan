-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: arohan_health_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `log_id` varchar(36) NOT NULL,
  `actor_user_id` varchar(36) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `target_record_id` varchar(36) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `actor_user_id` (`actor_user_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `excerpt` text,
  `featured_image` varchar(500) DEFAULT NULL,
  `category` varchar(50) DEFAULT 'Healthcare',
  `tags` json DEFAULT NULL,
  `author_name` varchar(100) DEFAULT 'Arohan Team',
  `status` varchar(20) DEFAULT 'draft',
  `view_count` int DEFAULT '0',
  `publish_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_blogs_slug` (`slug`),
  KEY `idx_blogs_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `product_id` varchar(100) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `description` text,
  `price` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `image_url` varchar(500) DEFAULT NULL,
  `features` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `message` text NOT NULL,
  `status` varchar(20) DEFAULT 'unread',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `device_id` varchar(36) NOT NULL,
  `serial_number` varchar(50) NOT NULL,
  `model_version` varchar(20) DEFAULT NULL,
  `firmware_version` varchar(20) DEFAULT NULL,
  `manufactured_date` date DEFAULT NULL,
  `status` enum('inventory','active','inactive','maintenance') DEFAULT NULL,
  PRIMARY KEY (`device_id`),
  UNIQUE KEY `serial_number` (`serial_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `early_access_leads`
--

DROP TABLE IF EXISTS `early_access_leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `early_access_leads` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `use_case` text,
  `status` varchar(20) DEFAULT 'new',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_early_access_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `early_access_leads`
--

LOCK TABLES `early_access_leads` WRITE;
/*!40000 ALTER TABLE `early_access_leads` DISABLE KEYS */;
/*!40000 ALTER TABLE `early_access_leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_alerts`
--

DROP TABLE IF EXISTS `emergency_alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergency_alerts` (
  `alert_id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `type` enum('fall_detected','cardiac_arrest','manual_sos','abnormal_vitals') DEFAULT NULL,
  `status` enum('triggered','acknowledged','resolved','false_alarm') DEFAULT 'triggered',
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `triggered_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` datetime DEFAULT NULL,
  PRIMARY KEY (`alert_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `emergency_alerts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_alerts`
--

LOCK TABLES `emergency_alerts` WRITE;
/*!40000 ALTER TABLE `emergency_alerts` DISABLE KEYS */;
/*!40000 ALTER TABLE `emergency_alerts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_contacts`
--

DROP TABLE IF EXISTS `emergency_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergency_contacts` (
  `contact_id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `relation` varchar(50) DEFAULT NULL,
  `priority` int DEFAULT '1',
  PRIMARY KEY (`contact_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `emergency_contacts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_contacts`
--

LOCK TABLES `emergency_contacts` WRITE;
/*!40000 ALTER TABLE `emergency_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `emergency_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_simulations`
--

DROP TABLE IF EXISTS `health_simulations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `health_simulations` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `snapshot_data` json NOT NULL,
  `analysis_data` json NOT NULL,
  `recorded_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `health_simulations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_simulations`
--

LOCK TABLES `health_simulations` WRITE;
/*!40000 ALTER TABLE `health_simulations` DISABLE KEYS */;
/*!40000 ALTER TABLE `health_simulations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_vitals`
--

DROP TABLE IF EXISTS `health_vitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `health_vitals` (
  `record_id` varchar(36) DEFAULT NULL,
  `user_id` varchar(36) NOT NULL,
  `device_id` varchar(36) DEFAULT NULL,
  `recorded_at` datetime NOT NULL,
  `heart_rate` int DEFAULT NULL,
  `steps` int DEFAULT NULL,
  `oxygen_level` int DEFAULT NULL,
  `body_temp` decimal(4,1) DEFAULT NULL,
  `battery_level` int DEFAULT NULL,
  `raw_data` json DEFAULT NULL,
  PRIMARY KEY (`user_id`,`recorded_at`),
  KEY `device_id` (`device_id`),
  CONSTRAINT `health_vitals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `health_vitals_ibfk_2` FOREIGN KEY (`device_id`) REFERENCES `devices` (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_vitals`
--

LOCK TABLES `health_vitals` WRITE;
/*!40000 ALTER TABLE `health_vitals` DISABLE KEYS */;
/*!40000 ALTER TABLE `health_vitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `invoice_id` varchar(36) NOT NULL,
  `order_id` varchar(50) DEFAULT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `customer_details` json DEFAULT NULL,
  `items` json DEFAULT NULL,
  `pricing` json DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'issued',
  `pdf_path` varchar(500) DEFAULT NULL,
  `notes` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`invoice_id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` varchar(50) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `amount` int NOT NULL,
  `currency` varchar(10) DEFAULT 'INR',
  `receipt` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'start',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` varchar(50) NOT NULL,
  `order_id` varchar(50) DEFAULT NULL,
  `signature` varchar(255) DEFAULT NULL,
  `amount` int NOT NULL,
  `method` varchar(50) DEFAULT NULL,
  `transaction_fee` int DEFAULT NULL,
  `tax` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `push_subscriptions`
--

DROP TABLE IF EXISTS `push_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `push_subscriptions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `endpoint` varchar(512) NOT NULL,
  `p256dh` varchar(255) NOT NULL,
  `auth` varchar(255) NOT NULL,
  `user_agent` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_endpoint` (`user_id`,`endpoint`),
  KEY `idx_push_user` (`user_id`),
  CONSTRAINT `push_subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `push_subscriptions`
--

LOCK TABLES `push_subscriptions` WRITE;
/*!40000 ALTER TABLE `push_subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `push_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `revoked_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `idx_refresh_token_hash` (`token_hash`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES ('065997fa-046e-4622-bfe0-529c21b9b056','e96ca025-a9ca-4e34-91ec-c3317669f18d','2a2321dbc029d1d371f6af33ef3cacd5404e97d242a831da7127d461850540a4','2026-02-15 17:59:07','2026-02-08 18:18:57','2026-02-08 17:59:07'),('0d6a949d-8832-4375-90a8-a9323bb25b27','830e2241-61d6-4a41-af44-4cf6ca7588a9','25eccf12610d01cff18c522d29618a4aa15fcf77394d127ce419f2d812f6d5d5','2026-02-15 17:02:49','2026-02-08 17:03:45','2026-02-08 17:02:49'),('1499c743-9885-48c2-a162-824200510c79','e96ca025-a9ca-4e34-91ec-c3317669f18d','598ab05e36cca892adbe97375e4f4d244ee78e5cdebe5a938acce29edd4201f0','2026-02-15 18:34:45',NULL,'2026-02-08 18:34:45'),('25667e9a-414d-4c1e-99ff-1590c8648b7e','d4686ca9-563d-49fa-bc02-efb51708f060','4424f9a91380e15fb5f0185edee5f9a0b402d1f2dff4d6cbba6baf7e26473b3d','2026-02-15 16:19:35','2026-02-08 16:20:05','2026-02-08 16:19:35'),('57131da8-abc9-41bb-b717-e5c90d7b078d','6aee95c3-fb54-4d2c-b0fe-4362e0e1bfa3','fa74a4e51fef306e2c0096cc8c9a956e678864c81421e8d5edcd53ac94e78908','2026-02-15 17:04:09',NULL,'2026-02-08 17:04:09'),('601029d7-c7f2-4e5c-aa65-3d1c2742deb8','82a6220a-3fd4-4ba1-bf9e-d63d8eb24dbf','c114051e4b8f842b1c9523b77bf690a037042dc501e8d8e34360c231c20b0f58','2026-02-15 17:01:26','2026-02-08 17:01:38','2026-02-08 17:01:26'),('84abd570-b8fa-489e-981c-ae42492f97af','e96ca025-a9ca-4e34-91ec-c3317669f18d','5bab24a5ff50c1e8544aa956cdb02b1153bbc4f8a45630fc48acaeeda7e0231a','2026-02-15 16:21:29','2026-02-08 16:21:31','2026-02-08 16:21:29'),('8cd307b6-a1f5-4724-a539-0adeec65597c','e96ca025-a9ca-4e34-91ec-c3317669f18d','cf9b40e19d180b04d248cfc62de87cd081d0af32891f52201929ddcf57a14d17','2026-02-15 16:21:14','2026-02-08 16:21:19','2026-02-08 16:21:14'),('ba9723cc-be6f-47cf-b1b0-b38e38b0ba31','2eca2b12-ed90-4181-b26a-40a24ddef325','b82bb91fc70dfab9197f5fc6d70e3fb9ad1073e2eefd8b1abf772bd0834451c0','2026-02-15 17:02:10','2026-02-08 17:02:26','2026-02-08 17:02:10');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_devices`
--

DROP TABLE IF EXISTS `user_devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_devices` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `device_id` varchar(36) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '1',
  `paired_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `device_id` (`device_id`),
  CONSTRAINT `user_devices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_devices_ibfk_2` FOREIGN KEY (`device_id`) REFERENCES `devices` (`device_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_devices`
--

LOCK TABLES `user_devices` WRITE;
/*!40000 ALTER TABLE `user_devices` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_otps`
--

DROP TABLE IF EXISTS `user_otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_otps` (
  `otp_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `purpose` enum('registration','password_reset','mfa') DEFAULT 'registration',
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_used` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`otp_id`),
  KEY `idx_user_otp_user` (`user_id`),
  KEY `idx_user_otp_code` (`otp_code`),
  CONSTRAINT `user_otps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_otps`
--

LOCK TABLES `user_otps` WRITE;
/*!40000 ALTER TABLE `user_otps` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` enum('patient','caregiver','doctor','admin','physician','hospital_admin','partner') NOT NULL,
  `mfa_enabled` tinyint(1) DEFAULT '0',
  `mfa_secret` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `phone_number` varchar(20) DEFAULT NULL,
  `address` text,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `permissions` json DEFAULT NULL,
  `account_locked_until` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('2eca2b12-ed90-4181-b26a-40a24ddef325','hospital@arohanhealth.com','$2b$10$vr7L3fn2q.YijN09Nql2ceunpgE6kUb5kKgZwmx94clSU4UnN9/QC','Hospital Administrator','hospital_admin',0,NULL,'2026-02-08 16:38:07','2026-02-08 16:38:07',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('6aee95c3-fb54-4d2c-b0fe-4362e0e1bfa3','admin@arohanhealth.com','$2b$10$tuoS2gJKLRiwMcZHygZjjuG87115YpPmuQg5kxysvaJc2PwHyK6Ze','System Admin','admin',0,NULL,'2026-02-08 16:33:35','2026-02-08 17:14:24',1,NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-08 17:14:24'),('82a6220a-3fd4-4ba1-bf9e-d63d8eb24dbf','doctor@arohanhealth.com','$2b$10$dB71gVGc8Nh43/u.DmKaROiVqy9MKRFJmM2rXuuRpQOM5DX9c2ryC','Dr. Smith','physician',0,NULL,'2026-02-08 16:38:06','2026-02-08 17:01:27',1,NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-08 17:01:27'),('830e2241-61d6-4a41-af44-4cf6ca7588a9','patient@test.com','$2b$10$cD6iFmo5CXn0kxRgHMTtnOV.EQLula/Io5n549AWCNhvdojwSMPby','Jane Patient','patient',0,NULL,'2026-02-08 16:38:07','2026-02-08 16:38:07',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('d4686ca9-563d-49fa-bc02-efb51708f060','admin@arohan.com','$2b$10$4a13Yvj3wzDncArZe45NueNA0a..m72oLYXYLaXuIDdph3/GLJrz6','System Admin','admin',0,NULL,'2026-02-08 16:12:38','2026-02-08 16:20:02',1,NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-08 16:20:02'),('e96ca025-a9ca-4e34-91ec-c3317669f18d','prachethsingh@gmail.com','$2b$10$EcrnSRDrPSfghnzg6VQLrOHcT/H1wMYv2ypfUjCgHZH/7lCbEGO5.','Pracheth Singh','patient',0,NULL,'2026-02-08 16:21:14','2026-02-08 16:21:14',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `webhook_logs`
--

DROP TABLE IF EXISTS `webhook_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `webhook_logs` (
  `id` varchar(36) NOT NULL,
  `event_id` varchar(50) DEFAULT NULL,
  `event_type` varchar(50) DEFAULT NULL,
  `payload` json DEFAULT NULL,
  `processed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_webhook_event_id` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `webhook_logs`
--

LOCK TABLES `webhook_logs` WRITE;
/*!40000 ALTER TABLE `webhook_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `webhook_logs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-08 18:57:58
