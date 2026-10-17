CREATE DATABASE IF NOT EXISTS homefix_db;
USE homefix_db;

CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(120) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_phone (phone)
);

CREATE TABLE user_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_role (user_id, role_id)
);

CREATE TABLE customer_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    profile_photo_url VARCHAR(255),
    preferred_service_area VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE saved_addresses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    label VARCHAR(100),
    address_line_1 VARCHAR(255) NOT NULL,
    locality VARCHAR(120),
    city VARCHAR(120) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_address_customer FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE CASCADE,
    INDEX idx_saved_address_city (city)
);

CREATE TABLE service_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE technician_profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    technician_id VARCHAR(50) NOT NULL UNIQUE,
    profile_photo_url VARCHAR(255),
    experience_years INT DEFAULT 0,
    bio TEXT,
    visiting_charge DECIMAL(10,2) DEFAULT 0.00,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    is_publicly_bookable BOOLEAN DEFAULT FALSE,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_technician_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_technician_verification (verification_status),
    INDEX idx_technician_bookable (is_publicly_bookable)
);

CREATE TABLE technician_skills (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    technician_id BIGINT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_technician_skill FOREIGN KEY (technician_id) REFERENCES technician_profiles(id) ON DELETE CASCADE,
    UNIQUE KEY uq_technician_skill (technician_id, skill_name)
);

CREATE TABLE technician_service_areas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    technician_id BIGINT NOT NULL,
    city VARCHAR(120) NOT NULL,
    locality VARCHAR(120),
    postal_code VARCHAR(20),
    radius_km INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_technician_service_area FOREIGN KEY (technician_id) REFERENCES technician_profiles(id) ON DELETE CASCADE,
    INDEX idx_service_area_city (city)
);

CREATE TABLE technician_availability (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    technician_id BIGINT NOT NULL,
    available_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_technician_availability FOREIGN KEY (technician_id) REFERENCES technician_profiles(id) ON DELETE CASCADE,
    UNIQUE KEY uq_slot (technician_id, available_date, start_time, end_time)
);

CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    technician_id BIGINT NOT NULL,
    service_category_id BIGINT NOT NULL,
    problem_description TEXT NOT NULL,
    preferred_datetime DATETIME NOT NULL,
    booking_status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    visiting_charge DECIMAL(10,2) DEFAULT 0.00,
    labor_charge DECIMAL(10,2) DEFAULT 0.00,
    material_charge DECIMAL(10,2) DEFAULT 0.00,
    total_customer_amount DECIMAL(10,2) DEFAULT 0.00,
    platform_commission DECIMAL(10,2) DEFAULT 0.00,
    technician_payout DECIMAL(10,2) DEFAULT 0.00,
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    cancellation_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_technician FOREIGN KEY (technician_id) REFERENCES technician_profiles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_booking_category FOREIGN KEY (service_category_id) REFERENCES service_categories(id) ON DELETE RESTRICT,
    INDEX idx_booking_status (booking_status),
    INDEX idx_booking_datetime (preferred_datetime),
    INDEX idx_booking_customer (customer_id),
    INDEX idx_booking_technician (technician_id)
);

CREATE TABLE booking_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by BIGINT,
    changed_by_role VARCHAR(30),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_status_history FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking_history_booking (booking_id)
);

CREATE TABLE booking_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_image FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL UNIQUE,
    payment_method VARCHAR(50) DEFAULT 'MOCK',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    platform_fee DECIMAL(10,2) DEFAULT 0.00,
    technician_earning DECIMAL(10,2) DEFAULT 0.00,
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    transaction_reference VARCHAR(100),
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    technician_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_customer FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_review_technician FOREIGN KEY (technician_id) REFERENCES technician_profiles(id) ON DELETE RESTRICT,
    INDEX idx_review_technician (technician_id)
);

CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notification_user (user_id)
);

CREATE TABLE admin_audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_user_id BIGINT NOT NULL,
    action_type VARCHAR(80) NOT NULL,
    entity_type VARCHAR(80),
    entity_id BIGINT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_audit_admin FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_admin_audit_action (action_type)
);

CREATE TABLE booking_price_change_requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    technician_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    original_visiting_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    original_labor_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    original_material_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    original_customer_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    proposed_visiting_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    proposed_labor_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    proposed_material_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    proposed_customer_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    proposed_platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    proposed_technician_payout DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    technician_reason TEXT NOT NULL,
    customer_rejection_reason TEXT,
    status VARCHAR(40) NOT NULL DEFAULT 'PENDING_CUSTOMER_APPROVAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    decided_at TIMESTAMP NULL,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_bpcr_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_bpcr_technician FOREIGN KEY (technician_id) REFERENCES technician_profiles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bpcr_customer FOREIGN KEY (customer_id) REFERENCES customer_profiles(id) ON DELETE RESTRICT,
    INDEX idx_bpcr_booking (booking_id),
    INDEX idx_bpcr_status (status),
    INDEX idx_bpcr_customer (customer_id),
    INDEX idx_bpcr_technician (technician_id)
);

