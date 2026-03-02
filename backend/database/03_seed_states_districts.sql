-- ============================================
-- Seed data for states and districts
-- This adds state/district combinations to master_locations
-- for dropdown population (without villages)
-- ============================================

-- Insert Andhra Pradesh districts (without villages - for state/district dropdowns)
INSERT INTO master_locations (state, district, mandal, village, created_at) VALUES
('Andhra Pradesh', 'Alluri Sitharama Raju', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Anakapalli', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Ananthapuramu', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Annamayya', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Bapatla', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Chittoor', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Dr. B.R. Ambedkar Konaseema', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'East Godavari', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Guntur', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Kakinada', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Krishna', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Kurnool', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Nandyal', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'NTR', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Palnadu', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Parvathipuram Manyam', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Prakasam', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'SPSR Nellore', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Sri Sathya Sai', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Srikakulam', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Tirupati', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Visakhapatnam', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'Vizianagaram', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'West Godavari', '', '', CURRENT_TIMESTAMP),
('Andhra Pradesh', 'YSR', '', '', CURRENT_TIMESTAMP);

-- Insert Telangana districts (without villages - for state/district dropdowns)
INSERT INTO master_locations (state, district, mandal, village, created_at) VALUES
('Telangana', 'Adilabad', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Bhadradri Kothagudem', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Hyderabad', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Jagtial', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Jangaon', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Jayashankar Bhupalpally', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Jogulamba Gadwal', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Kamareddy', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Karimnagar', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Khammam', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Komaram Bheem', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Mahabubabad', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Mahbubnagar', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Mancherial', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Medak', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Medchal-Malkajgiri', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Mulugu', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Nagarkurnool', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Nalgonda', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Narayanpet', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Nirmal', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Nizamabad', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Peddapalli', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Rajanna Sircilla', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Rangareddy', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Sangareddy', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Siddipet', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Suryapet', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Vikarabad', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Wanaparthy', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Warangal Rural', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Warangal Urban', '', '', CURRENT_TIMESTAMP),
('Telangana', 'Yadadri Bhuvanagiri', '', '', CURRENT_TIMESTAMP);
