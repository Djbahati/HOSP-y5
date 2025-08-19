-- Seed data for BAHATI Hospital

-- Insert sample patients
INSERT INTO patients (name, age, condition, status, room) VALUES
('John Smith', 45, 'Hypertension', 'stable', 'A101'),
('Maria Garcia', 32, 'Diabetes', 'critical', 'B205'),
('David Johnson', 67, 'Heart Disease', 'stable', 'C301'),
('Sarah Wilson', 28, 'Pregnancy', 'stable', 'D102'),
('Michael Brown', 55, 'Pneumonia', 'recovering', 'A203');

-- Insert sample treatments
INSERT INTO treatments (patient_id, treatment_type, medication, dosage, frequency, start_date, status) VALUES
(1, 'Medication', 'Lisinopril', '10mg', 'Daily', '2024-01-15', 'active'),
(2, 'Insulin Therapy', 'Insulin', '20 units', 'Twice daily', '2024-01-10', 'active'),
(3, 'Cardiac Monitoring', 'Metoprolol', '50mg', 'Twice daily', '2024-01-12', 'active'),
(4, 'Prenatal Care', 'Prenatal Vitamins', '1 tablet', 'Daily', '2024-01-08', 'active'),
(5, 'Antibiotic Treatment', 'Amoxicillin', '500mg', 'Three times daily', '2024-01-14', 'active');

-- Insert sample staff
INSERT INTO staff (name, role, department, shift, status, phone, email) VALUES
('Dr. Sarah Johnson', 'Doctor', 'Emergency', 'Morning', 'active', '555-0101', 'sarah.johnson@bahati.hospital'),
('Dr. Michael Brown', 'Doctor', 'Surgery', 'Afternoon', 'active', '555-0102', 'michael.brown@bahati.hospital'),
('Dr. Emily Chen', 'Doctor', 'Emergency', 'Night', 'active', '555-0103', 'emily.chen@bahati.hospital'),
('Nurse Mary Wilson', 'Nurse', 'ICU', 'Morning', 'active', '555-0201', 'mary.wilson@bahati.hospital'),
('Nurse John Davis', 'Nurse', 'Pediatrics', 'Afternoon', 'active', '555-0202', 'john.davis@bahati.hospital'),
('Nurse Lisa Garcia', 'Nurse', 'ICU', 'Night', 'active', '555-0203', 'lisa.garcia@bahati.hospital');

-- Insert sample beds
INSERT INTO beds (room, floor, status, patient, assigned) VALUES
('A101', 1, 'occupied', 'John Smith', 'Dr. Sarah Johnson'),
('A102', 1, 'available', NULL, NULL),
('A103', 1, 'maintenance', NULL, NULL),
('B201', 2, 'occupied', 'Maria Garcia', 'Dr. Michael Brown'),
('B202', 2, 'reserved', NULL, 'Dr. Emily Chen'),
('B203', 2, 'available', NULL, NULL),
('C301', 3, 'occupied', 'David Johnson', 'Dr. Sarah Johnson'),
('C302', 3, 'available', NULL, NULL),
('D101', 1, 'available', NULL, NULL),
('D102', 1, 'occupied', 'Sarah Wilson', 'Dr. Michael Brown');

-- Insert sample inventory
INSERT INTO inventory (name, category, stock, min_stock, unit, price, supplier) VALUES
('Paracetamol', 'Medication', 150, 50, 'tablets', 0.25, 'PharmaCorp'),
('Insulin', 'Medication', 25, 10, 'vials', 45.00, 'MediSupply'),
('Surgical Gloves', 'Medical Supplies', 500, 100, 'pairs', 0.75, 'MedEquip'),
('Syringes', 'Medical Supplies', 200, 50, 'pieces', 0.50, 'MedEquip'),
('Bandages', 'Medical Supplies', 75, 25, 'rolls', 2.50, 'HealthSupply'),
('Antibiotics', 'Medication', 80, 30, 'tablets', 1.25, 'PharmaCorp'),
('IV Bags', 'Medical Supplies', 40, 20, 'bags', 8.00, 'MediSupply'),
('Thermometers', 'Equipment', 15, 5, 'pieces', 25.00, 'MedTech'),
('Blood Pressure Monitors', 'Equipment', 8, 3, 'pieces', 150.00, 'MedTech'),
('Oxygen Masks', 'Medical Supplies', 60, 20, 'pieces', 5.00, 'HealthSupply');
