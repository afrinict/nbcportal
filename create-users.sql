-- Create users with bcrypt hashed passwords
-- Password: password123 (bcrypt hash with salt rounds 10)

INSERT INTO users (username, email, password, full_name, phone, role, department_id, unit_id, subunit_id, is_active, created_at) VALUES
('testuser', 'testuser@example.com', '$2b$10$BXx2SpfukBdzoplGKK8ECO426WbtC.UsIkxpS86t3bdIUr.nq8NHq', 'Test User', '+2348012345678', 'applicant', NULL, NULL, NULL, true, NOW()),
('staff', 'staff@nbc.gov.ng', '$2b$10$BXx2SpfukBdzoplGKK8ECO426WbtC.UsIkxpS86t3bdIUr.nq8NHq', 'NBC Staff', '+2348012345679', 'staff', NULL, NULL, NULL, true, NOW()),
('admin', 'admin@nbc.gov.ng', '$2b$10$BXx2SpfukBdzoplGKK8ECO426WbtC.UsIkxpS86t3bdIUr.nq8NHq', 'NBC Administrator', '+2348012345680', 'admin', NULL, NULL, NULL, true, NOW())
ON CONFLICT (email) DO NOTHING; 