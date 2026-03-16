-- ============================================================
-- Push Notifications Setup
-- ============================================================

CREATE TABLE IF NOT EXISTS push_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    subscription TEXT NOT NULL,
    created_at DATETIME NULL,
    UNIQUE KEY (email, subscription(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
