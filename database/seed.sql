USE homefix_db;

INSERT INTO roles (name, description) VALUES
('CUSTOMER', 'Customer role'),
('TECHNICIAN', 'Technician role'),
('ADMIN', 'Platform administrator');

INSERT INTO users (email, password_hash, phone, full_name, is_active, email_verified, phone_verified) VALUES
('customer1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92FBu1QI4B8zS7jWm0w2e', '+919876543210', 'Aisha Sharma', TRUE, TRUE, TRUE),
('customer2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92FBu1QI4B8zS7jWm0w2e', '+919876543211', 'Rohit Verma', TRUE, TRUE, FALSE),
('technician1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92FBu1QI4B8zS7jWm0w2e', '+919876543220', 'Anil Kumar', TRUE, TRUE, TRUE),
('technician2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92FBu1QI4B8zS7jWm0w2e', '+919876543221', 'Neha Singh', TRUE, TRUE, TRUE),
('admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92FBu1QI4B8zS7jWm0w2e', '+919876543230', 'Admin User', TRUE, TRUE, TRUE);

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 2),
(5, 3);

INSERT INTO customer_profiles (user_id, profile_photo_url, preferred_service_area) VALUES
(1, 'https://example.com/profile/cust1.jpg', 'Indore'),
(2, 'https://example.com/profile/cust2.jpg', 'Bhopal');

INSERT INTO saved_addresses (customer_id, label, address_line_1, locality, city, postal_code) VALUES
(1, 'Home', '12 Rosewood Avenue', 'Vijay Nagar', 'Indore', '452010'),
(1, 'Office', '24 Business Park Road', 'Palasia', 'Indore', '452001'),
(2, 'Home', '8 Lake View Street', 'Hoshangabad Road', 'Bhopal', '462026');

INSERT INTO service_categories (name, description, image_url) VALUES
('Plumbing', 'Leakage, pipe fitting, tap replacement, bathroom repairs', 'https://example.com/cats/plumbing.jpg'),
('Electrical', 'Wiring, fuse repair, switchboard installation', 'https://example.com/cats/electrical.jpg'),
('Furniture Repair', 'Cracks, polishing, chair and cabinet repair', 'https://example.com/cats/furniture.jpg'),
('Carpentry', 'Woodwork, door repairs, custom fittings', 'https://example.com/cats/carpentry.jpg'),
('Painting', 'Interior and exterior wall painting', 'https://example.com/cats/painting.jpg'),
('Appliance Repair', 'Washing machine, fridge, AC, and appliance service', 'https://example.com/cats/appliance.jpg'),
('Cleaning', 'Deep cleaning, sanitation, and home cleaning', 'https://example.com/cats/cleaning.jpg');

INSERT INTO technician_profiles (user_id, technician_id, profile_photo_url, experience_years, bio, visiting_charge, verification_status, is_publicly_bookable, average_rating, total_reviews) VALUES
(3, 'HF-TECH-1001', 'https://example.com/tech/anil.jpg', 7, 'Experienced plumber and small repair specialist.', 249.00, 'VERIFIED', TRUE, 4.9, 28),
(4, 'HF-TECH-1002', 'https://example.com/tech/neha.jpg', 5, 'Electrical and appliance repair expert.', 299.00, 'VERIFIED', TRUE, 4.7, 18);

INSERT INTO technician_skills (technician_id, skill_name) VALUES
(1, 'Plumbing'),
(1, 'Leakage Repair'),
(1, 'Bathroom Fittings'),
(2, 'Electrical Wiring'),
(2, 'Appliance Repair'),
(2, 'Switchboard Fixing');

INSERT INTO technician_service_areas (technician_id, city, locality, postal_code, radius_km) VALUES
(1, 'Indore', 'Vijay Nagar', '452010', 8),
(1, 'Indore', 'Palasia', '452001', 6),
(2, 'Indore', 'Bhawarkuan', '452001', 10),
(2, 'Bhopal', 'Hoshangabad Road', '462026', 12);

INSERT INTO technician_availability (technician_id, available_date, start_time, end_time, is_booked) VALUES
(1, '2026-10-05', '09:00:00', '12:00:00', FALSE),
(1, '2026-10-05', '14:00:00', '17:00:00', FALSE),
(2, '2026-10-06', '10:00:00', '13:00:00', FALSE),
(2, '2026-10-06', '15:00:00', '18:00:00', FALSE);

INSERT INTO bookings (
    booking_number, customer_id, technician_id, service_category_id, problem_description,
    preferred_datetime, booking_status, payment_status, visiting_charge, labor_charge,
    material_charge, total_customer_amount, platform_commission, technician_payout, refund_amount
) VALUES
('HF-BK-1001', 1, 1, 1, 'Kitchen tap is leaking and pipe under sink needs fixing.', '2026-10-05 10:00:00', 'COMPLETED', 'PAID', 249.00, 1200.00, 150.00, 1599.00, 160.00, 1389.00, 0.00),
('HF-BK-1002', 2, 2, 6, 'Washing machine not starting and frequent power issues.', '2026-10-06 15:00:00', 'ACCEPTED', 'PENDING', 299.00, 0.00, 0.00, 299.00, 30.00, 269.00, 0.00);

INSERT INTO booking_status_history (booking_id, previous_status, new_status, changed_by, changed_by_role, notes) VALUES
(1, 'REQUESTED', 'ACCEPTED', 3, 'TECHNICIAN', 'Technician accepted the request'),
(1, 'ACCEPTED', 'COMPLETED', 3, 'TECHNICIAN', 'Job completed'),
(2, 'REQUESTED', 'ACCEPTED', 4, 'TECHNICIAN', 'Booking accepted and scheduled');

INSERT INTO booking_images (booking_id, image_url, original_file_name) VALUES
(1, 'https://example.com/uploads/kitchen-leak-1.jpg', 'kitchen-leak-1.jpg'),
(2, 'https://example.com/uploads/washing-machine-issue.jpg', 'washing-machine-issue.jpg');

INSERT INTO payments (booking_id, payment_method, payment_status, amount_paid, platform_fee, technician_earning, refund_amount, transaction_reference) VALUES
(1, 'MOCK', 'PAID', 1599.00, 160.00, 1389.00, 0.00, 'TXN-1001'),
(2, 'MOCK', 'PENDING', 0.00, 0.00, 0.00, 0.00, 'TXN-1002');

INSERT INTO reviews (booking_id, customer_id, technician_id, rating, comment) VALUES
(1, 1, 1, 5, 'Very professional and quick service. Fixed the leak properly.');

INSERT INTO notifications (user_id, title, message, type) VALUES
(3, 'New booking request', 'A customer has requested a plumbing service.', 'BOOKING'),
(1, 'Booking confirmed', 'Your booking has been accepted by the technician.', 'BOOKING'),
(5, 'Admin action', 'Technician verification was approved.', 'INFO');

INSERT INTO admin_audit_logs (admin_user_id, action_type, entity_type, entity_id, notes) VALUES
(5, 'TECHNICIAN_APPROVAL', 'TECHNICIAN_PROFILE', 1, 'Approved technician verification for Anil Kumar');
