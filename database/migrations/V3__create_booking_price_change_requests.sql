-- Migration V3: Create Booking Price Change Requests table
USE homefix_db;

CREATE TABLE IF NOT EXISTS booking_price_change_requests (
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
