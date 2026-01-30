-- =====================================================
-- EDUCATIONAL DATA ANALYTICS SYSTEM
-- Professional Presentation Data
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing demo data
TRUNCATE TABLE feedback;
TRUNCATE TABLE placements;
TRUNCATE TABLE marks;
TRUNCATE TABLE attendance;
TRUNCATE TABLE subjects;
TRUNCATE TABLE students;
TRUNCATE TABLE faculty;
TRUNCATE TABLE semesters;
TRUNCATE TABLE courses;
TRUNCATE TABLE departments;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- DEPARTMENTS
-- =====================================================
INSERT INTO departments (department_id, department_name, department_code, hod_name) VALUES
(1, 'Computer Science & Engineering', 'CSE', 'Dr. Rajesh Kumar'),
(2, 'Information Technology', 'IT', 'Dr. Priya Sharma'),
(3, 'Electronics & Communication', 'ECE', 'Dr. Suresh Reddy'),
(4, 'Business Administration', 'BBA', 'Dr. Anita Gupta');

-- =====================================================
-- COURSES
-- =====================================================
INSERT INTO courses (course_id, course_name, course_code, department_id, duration_years, total_semesters) VALUES
(1, 'B.Tech Computer Science', 'BTCS', 1, 4, 8),
(2, 'B.Tech Information Technology', 'BTIT', 2, 4, 8),
(3, 'BCA', 'BCA', 1, 3, 6),
(4, 'BCA (Honours)', 'BCAH', 1, 4, 8),
(5, 'MCA', 'MCA', 1, 2, 4),
(6, 'MBA', 'MBA', 4, 2, 4);

-- =====================================================
-- SEMESTERS
-- =====================================================
INSERT INTO semesters (semester_id, semester_name, semester_number, academic_year, start_date, end_date, is_current) VALUES
(1, 'Semester 1', 1, '2024-25', '2024-08-01', '2024-12-15', FALSE),
(2, 'Semester 2', 2, '2024-25', '2025-01-10', '2025-05-30', TRUE),
(3, 'Semester 3', 3, '2024-25', '2024-08-01', '2024-12-15', FALSE),
(4, 'Semester 4', 4, '2024-25', '2025-01-10', '2025-05-30', FALSE),
(5, 'Semester 5', 5, '2024-25', '2024-08-01', '2024-12-15', FALSE),
(6, 'Semester 6', 6, '2024-25', '2025-01-10', '2025-05-30', FALSE);

-- =====================================================
-- USERS (Password: demo123 for all - SHA256 hashed)
-- =====================================================
INSERT INTO users (user_id, full_name, email, password_hash, role) VALUES
-- Admin
(1, 'Administrator', 'admin@eduanalytics.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'admin'),

-- Faculty Users
(2, 'Dr. Rajesh Sharma', 'sharma@eduanalytics.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'faculty'),
(3, 'Dr. Priya Patel', 'patel@eduanalytics.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'faculty'),
(4, 'Prof. Harpreet Singh', 'singh@eduanalytics.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'faculty'),
(5, 'Prof. Ankit Verma', 'verma@eduanalytics.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'faculty'),
(6, 'Prof. Meenakshi Gupta', 'gupta@eduanalytics.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'faculty'),

-- Student Users (20 students)
(10, 'Rahul Sharma', 'rahul.sharma@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(11, 'Priya Patel', 'priya.patel@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(12, 'Amit Kumar', 'amit.kumar@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(13, 'Sneha Gupta', 'sneha.gupta@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(14, 'Vikram Singh', 'vikram.singh@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(15, 'Neha Reddy', 'neha.reddy@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(16, 'Arjun Das', 'arjun.das@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(17, 'Kavya Nair', 'kavya.nair@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(18, 'Rohit Jain', 'rohit.jain@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(19, 'Ananya Mishra', 'ananya.mishra@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(20, 'Karan Mehta', 'karan.mehta@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(21, 'Divya Kapoor', 'divya.kapoor@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(22, 'Aditya Rao', 'aditya.rao@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(23, 'Pooja Shah', 'pooja.shah@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(24, 'Varun Malhotra', 'varun.malhotra@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(25, 'Isha Bansal', 'isha.bansal@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(26, 'Siddharth Verma', 'siddharth.verma@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(27, 'Riya Agarwal', 'riya.agarwal@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(28, 'Nikhil Saxena', 'nikhil.saxena@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student'),
(29, 'Tanvi Bhatia', 'tanvi.bhatia@student.edu', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'student');

-- =====================================================
-- FACULTY
-- =====================================================
INSERT INTO faculty (faculty_id, user_id, employee_id, first_name, last_name, email, phone, department_id, designation, qualification, specialization, joining_date) VALUES
(1, 2, 'FAC001', 'Rajesh', 'Sharma', 'sharma@eduanalytics.edu', '9876543001', 1, 'Professor', 'Ph.D. in Computer Science', 'Machine Learning & AI', '2015-06-15'),
(2, 3, 'FAC002', 'Priya', 'Patel', 'patel@eduanalytics.edu', '9876543002', 1, 'Associate Professor', 'Ph.D. in Software Engineering', 'Software Architecture', '2017-08-01'),
(3, 4, 'FAC003', 'Harpreet', 'Singh', 'singh@eduanalytics.edu', '9876543003', 2, 'Assistant Professor', 'M.Tech in IT', 'Cybersecurity', '2019-01-10'),
(4, 5, 'FAC004', 'Ankit', 'Verma', 'verma@eduanalytics.edu', '9876543004', 1, 'Assistant Professor', 'M.Tech in CSE', 'Web Technologies', '2020-07-01'),
(5, 6, 'FAC005', 'Meenakshi', 'Gupta', 'gupta@eduanalytics.edu', '9876543005', 1, 'Assistant Professor', 'MCA', 'Database Systems', '2021-01-15');

-- =====================================================
-- SUBJECTS (For BCA & B.Tech CS)
-- =====================================================
INSERT INTO subjects (subject_id, subject_code, subject_name, credits, course_id, semester_number, faculty_id) VALUES
-- Semester 1 subjects
(1, 'CS101', 'Programming Fundamentals (C)', 4, 1, 1, 4),
(2, 'CS102', 'Computer Fundamentals', 3, 1, 1, 5),
(3, 'MA101', 'Mathematics I', 4, 1, 1, NULL),

-- Semester 2 subjects
(4, 'CS201', 'Object Oriented Programming (C++)', 4, 1, 2, 4),
(5, 'CS202', 'Data Structures', 4, 1, 2, 2),
(6, 'CS203', 'Database Management Systems', 4, 1, 2, 5),

-- Semester 3 subjects
(7, 'CS301', 'Operating Systems', 4, 1, 3, 3),
(8, 'CS302', 'Computer Networks', 4, 1, 3, 3),
(9, 'CS303', 'Web Technologies', 4, 1, 3, 4),

-- Semester 4 subjects
(10, 'CS401', 'Software Engineering', 4, 1, 4, 2),
(11, 'CS402', 'Java Programming', 4, 1, 4, 4),
(12, 'CS403', 'Python Programming', 4, 1, 4, 1),

-- Semester 5 subjects
(13, 'CS501', 'Machine Learning', 4, 1, 5, 1),
(14, 'CS502', 'Cloud Computing', 4, 1, 5, 3),
(15, 'CS503', 'Mobile App Development', 4, 1, 5, 4),

-- Semester 6 subjects
(16, 'CS601', 'Artificial Intelligence', 4, 1, 6, 1),
(17, 'CS602', 'Big Data Analytics', 4, 1, 6, 2),
(18, 'CS603', 'Cybersecurity', 4, 1, 6, 3),

-- BCA Subjects
(19, 'BCA101', 'Introduction to Programming', 4, 3, 1, 4),
(20, 'BCA102', 'Digital Electronics', 3, 3, 1, NULL),
(21, 'BCA201', 'Data Structures using C', 4, 3, 2, 2),
(22, 'BCA202', 'DBMS', 4, 3, 2, 5);

-- =====================================================
-- STUDENTS (20 students across courses)
-- =====================================================
INSERT INTO students (student_id, user_id, enrollment_number, first_name, last_name, email, phone, date_of_birth, gender, course_id, current_semester, admission_year, batch, guardian_name, guardian_phone) VALUES
-- B.Tech CS Students (Semester 5)
(1, 10, 'EN2023001', 'Rahul', 'Sharma', 'rahul.sharma@student.edu', '9876540001', '2005-03-15', 'male', 1, 5, 2023, '2023-27', 'Mr. Suresh Sharma', '9876550001'),
(2, 11, 'EN2023002', 'Priya', 'Patel', 'priya.patel@student.edu', '9876540002', '2005-07-22', 'female', 1, 5, 2023, '2023-27', 'Mr. Ramesh Patel', '9876550002'),
(3, 12, 'EN2023003', 'Amit', 'Kumar', 'amit.kumar@student.edu', '9876540003', '2005-01-10', 'male', 1, 5, 2023, '2023-27', 'Mr. Vijay Kumar', '9876550003'),
(4, 13, 'EN2023004', 'Sneha', 'Gupta', 'sneha.gupta@student.edu', '9876540004', '2005-11-30', 'female', 1, 5, 2023, '2023-27', 'Mr. Anil Gupta', '9876550004'),
(5, 14, 'EN2023005', 'Vikram', 'Singh', 'vikram.singh@student.edu', '9876540005', '2005-05-18', 'male', 1, 5, 2023, '2023-27', 'Mr. Harpal Singh', '9876550005'),
(6, 15, 'EN2023006', 'Neha', 'Reddy', 'neha.reddy@student.edu', '9876540006', '2005-09-25', 'female', 1, 5, 2023, '2023-27', 'Mr. Krishna Reddy', '9876550006'),
(7, 16, 'EN2023007', 'Arjun', 'Das', 'arjun.das@student.edu', '9876540007', '2005-02-14', 'male', 1, 5, 2023, '2023-27', 'Mr. Pranab Das', '9876550007'),
(8, 17, 'EN2023008', 'Kavya', 'Nair', 'kavya.nair@student.edu', '9876540008', '2005-06-08', 'female', 1, 5, 2023, '2023-27', 'Mr. Gopalan Nair', '9876550008'),

-- B.Tech CS Students (Semester 3)
(9, 18, 'EN2024001', 'Rohit', 'Jain', 'rohit.jain@student.edu', '9876540009', '2006-04-12', 'male', 1, 3, 2024, '2024-28', 'Mr. Mahesh Jain', '9876550009'),
(10, 19, 'EN2024002', 'Ananya', 'Mishra', 'ananya.mishra@student.edu', '9876540010', '2006-08-20', 'female', 1, 3, 2024, '2024-28', 'Mr. Ravi Mishra', '9876550010'),
(11, 20, 'EN2024003', 'Karan', 'Mehta', 'karan.mehta@student.edu', '9876540011', '2006-12-05', 'male', 1, 3, 2024, '2024-28', 'Mr. Sanjay Mehta', '9876550011'),
(12, 21, 'EN2024004', 'Divya', 'Kapoor', 'divya.kapoor@student.edu', '9876540012', '2006-03-18', 'female', 1, 3, 2024, '2024-28', 'Mr. Ashok Kapoor', '9876550012'),

-- BCA Students (Semester 2)
(13, 22, 'BCA2024001', 'Aditya', 'Rao', 'aditya.rao@student.edu', '9876540013', '2006-07-25', 'male', 3, 2, 2024, '2024-27', 'Mr. Venkat Rao', '9876550013'),
(14, 23, 'BCA2024002', 'Pooja', 'Shah', 'pooja.shah@student.edu', '9876540014', '2006-10-30', 'female', 3, 2, 2024, '2024-27', 'Mr. Deepak Shah', '9876550014'),
(15, 24, 'BCA2024003', 'Varun', 'Malhotra', 'varun.malhotra@student.edu', '9876540015', '2006-01-28', 'male', 3, 2, 2024, '2024-27', 'Mr. Rakesh Malhotra', '9876550015'),
(16, 25, 'BCA2024004', 'Isha', 'Bansal', 'isha.bansal@student.edu', '9876540016', '2006-05-15', 'female', 3, 2, 2024, '2024-27', 'Mr. Vinod Bansal', '9876550016'),

-- B.Tech IT Students (Semester 5)
(17, 26, 'IT2023001', 'Siddharth', 'Verma', 'siddharth.verma@student.edu', '9876540017', '2005-08-10', 'male', 2, 5, 2023, '2023-27', 'Mr. Rakesh Verma', '9876550017'),
(18, 27, 'IT2023002', 'Riya', 'Agarwal', 'riya.agarwal@student.edu', '9876540018', '2005-11-22', 'female', 2, 5, 2023, '2023-27', 'Mr. Pawan Agarwal', '9876550018'),
(19, 28, 'IT2023003', 'Nikhil', 'Saxena', 'nikhil.saxena@student.edu', '9876540019', '2005-02-08', 'male', 2, 5, 2023, '2023-27', 'Mr. Arun Saxena', '9876550019'),
(20, 29, 'IT2023004', 'Tanvi', 'Bhatia', 'tanvi.bhatia@student.edu', '9876540020', '2005-06-16', 'female', 2, 5, 2023, '2023-27', 'Mr. Naveen Bhatia', '9876550020');

-- =====================================================
-- MARKS DATA (Comprehensive academic records)
-- =====================================================
-- Semester 5 Students - Machine Learning (CS501)
INSERT INTO marks (student_id, subject_id, semester_id, exam_type, marks_obtained, max_marks, exam_date) VALUES
-- Rahul Sharma - Top performer
(1, 13, 5, 'internal1', 23, 25, '2025-09-15'),
(1, 13, 5, 'internal2', 24, 25, '2025-10-15'),
(1, 13, 5, 'midterm', 42, 50, '2025-10-30'),
(1, 13, 5, 'final', 88, 100, '2025-12-10'),

-- Priya Patel - Good performer
(2, 13, 5, 'internal1', 22, 25, '2025-09-15'),
(2, 13, 5, 'internal2', 21, 25, '2025-10-15'),
(2, 13, 5, 'midterm', 40, 50, '2025-10-30'),
(2, 13, 5, 'final', 82, 100, '2025-12-10'),

-- Amit Kumar - Average performer (AT RISK - low attendance)
(3, 13, 5, 'internal1', 15, 25, '2025-09-15'),
(3, 13, 5, 'internal2', 16, 25, '2025-10-15'),
(3, 13, 5, 'midterm', 28, 50, '2025-10-30'),
(3, 13, 5, 'final', 52, 100, '2025-12-10'),

-- Sneha Gupta - Good performer
(4, 13, 5, 'internal1', 20, 25, '2025-09-15'),
(4, 13, 5, 'internal2', 22, 25, '2025-10-15'),
(4, 13, 5, 'midterm', 38, 50, '2025-10-30'),
(4, 13, 5, 'final', 78, 100, '2025-12-10'),

-- Vikram Singh - AT RISK - Poor marks
(5, 13, 5, 'internal1', 12, 25, '2025-09-15'),
(5, 13, 5, 'internal2', 14, 25, '2025-10-15'),
(5, 13, 5, 'midterm', 22, 50, '2025-10-30'),
(5, 13, 5, 'final', 38, 100, '2025-12-10'),

-- Neha Reddy - Excellent
(6, 13, 5, 'internal1', 24, 25, '2025-09-15'),
(6, 13, 5, 'internal2', 25, 25, '2025-10-15'),
(6, 13, 5, 'midterm', 46, 50, '2025-10-30'),
(6, 13, 5, 'final', 92, 100, '2025-12-10'),

-- Arjun Das - Good
(7, 13, 5, 'internal1', 19, 25, '2025-09-15'),
(7, 13, 5, 'internal2', 20, 25, '2025-10-15'),
(7, 13, 5, 'midterm', 36, 50, '2025-10-30'),
(7, 13, 5, 'final', 74, 100, '2025-12-10'),

-- Kavya Nair - Good
(8, 13, 5, 'internal1', 21, 25, '2025-09-15'),
(8, 13, 5, 'internal2', 22, 25, '2025-10-15'),
(8, 13, 5, 'midterm', 39, 50, '2025-10-30'),
(8, 13, 5, 'final', 80, 100, '2025-12-10');

-- Cloud Computing (CS502) marks
INSERT INTO marks (student_id, subject_id, semester_id, exam_type, marks_obtained, max_marks, exam_date) VALUES
(1, 14, 5, 'internal1', 22, 25, '2025-09-16'),
(1, 14, 5, 'final', 85, 100, '2025-12-11'),
(2, 14, 5, 'internal1', 20, 25, '2025-09-16'),
(2, 14, 5, 'final', 78, 100, '2025-12-11'),
(3, 14, 5, 'internal1', 14, 25, '2025-09-16'),
(3, 14, 5, 'final', 48, 100, '2025-12-11'),
(4, 14, 5, 'internal1', 21, 25, '2025-09-16'),
(4, 14, 5, 'final', 82, 100, '2025-12-11'),
(5, 14, 5, 'internal1', 13, 25, '2025-09-16'),
(5, 14, 5, 'final', 42, 100, '2025-12-11'),
(6, 14, 5, 'internal1', 24, 25, '2025-09-16'),
(6, 14, 5, 'final', 90, 100, '2025-12-11'),
(7, 14, 5, 'internal1', 18, 25, '2025-09-16'),
(7, 14, 5, 'final', 72, 100, '2025-12-11'),
(8, 14, 5, 'internal1', 20, 25, '2025-09-16'),
(8, 14, 5, 'final', 76, 100, '2025-12-11');

-- Mobile App Development (CS503) marks
INSERT INTO marks (student_id, subject_id, semester_id, exam_type, marks_obtained, max_marks, exam_date) VALUES
(1, 15, 5, 'internal1', 24, 25, '2025-09-17'),
(1, 15, 5, 'final', 90, 100, '2025-12-12'),
(2, 15, 5, 'internal1', 23, 25, '2025-09-17'),
(2, 15, 5, 'final', 86, 100, '2025-12-12'),
(3, 15, 5, 'internal1', 16, 25, '2025-09-17'),
(3, 15, 5, 'final', 55, 100, '2025-12-12'),
(4, 15, 5, 'internal1', 22, 25, '2025-09-17'),
(4, 15, 5, 'final', 84, 100, '2025-12-12'),
(5, 15, 5, 'internal1', 15, 25, '2025-09-17'),
(5, 15, 5, 'final', 45, 100, '2025-12-12'),
(6, 15, 5, 'internal1', 25, 25, '2025-09-17'),
(6, 15, 5, 'final', 95, 100, '2025-12-12'),
(7, 15, 5, 'internal1', 20, 25, '2025-09-17'),
(7, 15, 5, 'final', 78, 100, '2025-12-12'),
(8, 15, 5, 'internal1', 21, 25, '2025-09-17'),
(8, 15, 5, 'final', 82, 100, '2025-12-12');

-- Semester 3 students marks - Operating Systems (CS301)
INSERT INTO marks (student_id, subject_id, semester_id, exam_type, marks_obtained, max_marks, exam_date) VALUES
(9, 7, 3, 'internal1', 20, 25, '2025-09-15'),
(9, 7, 3, 'final', 75, 100, '2025-12-10'),
(10, 7, 3, 'internal1', 23, 25, '2025-09-15'),
(10, 7, 3, 'final', 88, 100, '2025-12-10'),
(11, 7, 3, 'internal1', 18, 25, '2025-09-15'),
(11, 7, 3, 'final', 68, 100, '2025-12-10'),
(12, 7, 3, 'internal1', 22, 25, '2025-09-15'),
(12, 7, 3, 'final', 85, 100, '2025-12-10');

-- Web Technologies (CS303)
INSERT INTO marks (student_id, subject_id, semester_id, exam_type, marks_obtained, max_marks, exam_date) VALUES
(9, 9, 3, 'internal1', 22, 25, '2025-09-16'),
(9, 9, 3, 'final', 80, 100, '2025-12-11'),
(10, 9, 3, 'internal1', 24, 25, '2025-09-16'),
(10, 9, 3, 'final', 92, 100, '2025-12-11'),
(11, 9, 3, 'internal1', 19, 25, '2025-09-16'),
(11, 9, 3, 'final', 72, 100, '2025-12-11'),
(12, 9, 3, 'internal1', 21, 25, '2025-09-16'),
(12, 9, 3, 'final', 82, 100, '2025-12-11');

-- BCA Students - DBMS (BCA202)
INSERT INTO marks (student_id, subject_id, semester_id, exam_type, marks_obtained, max_marks, exam_date) VALUES
(13, 22, 2, 'internal1', 21, 25, '2025-09-15'),
(13, 22, 2, 'final', 78, 100, '2025-12-10'),
(14, 22, 2, 'internal1', 23, 25, '2025-09-15'),
(14, 22, 2, 'final', 86, 100, '2025-12-10'),
(15, 22, 2, 'internal1', 17, 25, '2025-09-15'),
(15, 22, 2, 'final', 62, 100, '2025-12-10'),
(16, 22, 2, 'internal1', 24, 25, '2025-09-15'),
(16, 22, 2, 'final', 90, 100, '2025-12-10');

-- Data Structures (BCA201)
INSERT INTO marks (student_id, subject_id, semester_id, exam_type, marks_obtained, max_marks, exam_date) VALUES
(13, 21, 2, 'internal1', 19, 25, '2025-09-16'),
(13, 21, 2, 'final', 74, 100, '2025-12-11'),
(14, 21, 2, 'internal1', 22, 25, '2025-09-16'),
(14, 21, 2, 'final', 82, 100, '2025-12-11'),
(15, 21, 2, 'internal1', 15, 25, '2025-09-16'),
(15, 21, 2, 'final', 58, 100, '2025-12-11'),
(16, 21, 2, 'internal1', 23, 25, '2025-09-16'),
(16, 21, 2, 'final', 88, 100, '2025-12-11');

-- =====================================================
-- ATTENDANCE DATA (Realistic patterns)
-- =====================================================
-- Generate attendance for Machine Learning (CS501) - Last 30 class days
INSERT INTO attendance (student_id, subject_id, semester_id, attendance_date, status) VALUES
-- Rahul Sharma - 90% attendance
(1, 13, 5, '2025-01-02', 'present'), (1, 13, 5, '2025-01-03', 'present'), (1, 13, 5, '2025-01-06', 'present'),
(1, 13, 5, '2025-01-07', 'present'), (1, 13, 5, '2025-01-08', 'absent'), (1, 13, 5, '2025-01-09', 'present'),
(1, 13, 5, '2025-01-10', 'present'), (1, 13, 5, '2025-01-13', 'present'), (1, 13, 5, '2025-01-14', 'present'),
(1, 13, 5, '2025-01-15', 'present'), (1, 13, 5, '2025-01-16', 'present'), (1, 13, 5, '2025-01-17', 'present'),
(1, 13, 5, '2025-01-20', 'present'), (1, 13, 5, '2025-01-21', 'present'), (1, 13, 5, '2025-01-22', 'present'),
(1, 13, 5, '2025-01-23', 'absent'), (1, 13, 5, '2025-01-24', 'present'), (1, 13, 5, '2025-01-27', 'present'),
(1, 13, 5, '2025-01-28', 'present'), (1, 13, 5, '2025-01-29', 'present'),

-- Priya Patel - 85% attendance
(2, 13, 5, '2025-01-02', 'present'), (2, 13, 5, '2025-01-03', 'present'), (2, 13, 5, '2025-01-06', 'present'),
(2, 13, 5, '2025-01-07', 'absent'), (2, 13, 5, '2025-01-08', 'present'), (2, 13, 5, '2025-01-09', 'present'),
(2, 13, 5, '2025-01-10', 'present'), (2, 13, 5, '2025-01-13', 'present'), (2, 13, 5, '2025-01-14', 'absent'),
(2, 13, 5, '2025-01-15', 'present'), (2, 13, 5, '2025-01-16', 'present'), (2, 13, 5, '2025-01-17', 'present'),
(2, 13, 5, '2025-01-20', 'present'), (2, 13, 5, '2025-01-21', 'absent'), (2, 13, 5, '2025-01-22', 'present'),
(2, 13, 5, '2025-01-23', 'present'), (2, 13, 5, '2025-01-24', 'present'), (2, 13, 5, '2025-01-27', 'present'),
(2, 13, 5, '2025-01-28', 'present'), (2, 13, 5, '2025-01-29', 'present'),

-- Amit Kumar - 55% attendance (AT RISK)
(3, 13, 5, '2025-01-02', 'absent'), (3, 13, 5, '2025-01-03', 'present'), (3, 13, 5, '2025-01-06', 'absent'),
(3, 13, 5, '2025-01-07', 'absent'), (3, 13, 5, '2025-01-08', 'present'), (3, 13, 5, '2025-01-09', 'absent'),
(3, 13, 5, '2025-01-10', 'present'), (3, 13, 5, '2025-01-13', 'absent'), (3, 13, 5, '2025-01-14', 'present'),
(3, 13, 5, '2025-01-15', 'absent'), (3, 13, 5, '2025-01-16', 'present'), (3, 13, 5, '2025-01-17', 'absent'),
(3, 13, 5, '2025-01-20', 'present'), (3, 13, 5, '2025-01-21', 'absent'), (3, 13, 5, '2025-01-22', 'present'),
(3, 13, 5, '2025-01-23', 'absent'), (3, 13, 5, '2025-01-24', 'present'), (3, 13, 5, '2025-01-27', 'present'),
(3, 13, 5, '2025-01-28', 'absent'), (3, 13, 5, '2025-01-29', 'present'),

-- Sneha Gupta - 80% attendance
(4, 13, 5, '2025-01-02', 'present'), (4, 13, 5, '2025-01-03', 'present'), (4, 13, 5, '2025-01-06', 'present'),
(4, 13, 5, '2025-01-07', 'present'), (4, 13, 5, '2025-01-08', 'absent'), (4, 13, 5, '2025-01-09', 'present'),
(4, 13, 5, '2025-01-10', 'absent'), (4, 13, 5, '2025-01-13', 'present'), (4, 13, 5, '2025-01-14', 'present'),
(4, 13, 5, '2025-01-15', 'present'), (4, 13, 5, '2025-01-16', 'absent'), (4, 13, 5, '2025-01-17', 'present'),
(4, 13, 5, '2025-01-20', 'present'), (4, 13, 5, '2025-01-21', 'present'), (4, 13, 5, '2025-01-22', 'absent'),
(4, 13, 5, '2025-01-23', 'present'), (4, 13, 5, '2025-01-24', 'present'), (4, 13, 5, '2025-01-27', 'present'),
(4, 13, 5, '2025-01-28', 'present'), (4, 13, 5, '2025-01-29', 'present'),

-- Vikram Singh - 60% attendance (AT RISK)
(5, 13, 5, '2025-01-02', 'absent'), (5, 13, 5, '2025-01-03', 'present'), (5, 13, 5, '2025-01-06', 'absent'),
(5, 13, 5, '2025-01-07', 'present'), (5, 13, 5, '2025-01-08', 'absent'), (5, 13, 5, '2025-01-09', 'present'),
(5, 13, 5, '2025-01-10', 'absent'), (5, 13, 5, '2025-01-13', 'present'), (5, 13, 5, '2025-01-14', 'absent'),
(5, 13, 5, '2025-01-15', 'present'), (5, 13, 5, '2025-01-16', 'absent'), (5, 13, 5, '2025-01-17', 'present'),
(5, 13, 5, '2025-01-20', 'absent'), (5, 13, 5, '2025-01-21', 'present'), (5, 13, 5, '2025-01-22', 'present'),
(5, 13, 5, '2025-01-23', 'absent'), (5, 13, 5, '2025-01-24', 'present'), (5, 13, 5, '2025-01-27', 'present'),
(5, 13, 5, '2025-01-28', 'absent'), (5, 13, 5, '2025-01-29', 'present'),

-- Neha Reddy - 95% attendance (Top performer)
(6, 13, 5, '2025-01-02', 'present'), (6, 13, 5, '2025-01-03', 'present'), (6, 13, 5, '2025-01-06', 'present'),
(6, 13, 5, '2025-01-07', 'present'), (6, 13, 5, '2025-01-08', 'present'), (6, 13, 5, '2025-01-09', 'present'),
(6, 13, 5, '2025-01-10', 'present'), (6, 13, 5, '2025-01-13', 'present'), (6, 13, 5, '2025-01-14', 'present'),
(6, 13, 5, '2025-01-15', 'present'), (6, 13, 5, '2025-01-16', 'present'), (6, 13, 5, '2025-01-17', 'absent'),
(6, 13, 5, '2025-01-20', 'present'), (6, 13, 5, '2025-01-21', 'present'), (6, 13, 5, '2025-01-22', 'present'),
(6, 13, 5, '2025-01-23', 'present'), (6, 13, 5, '2025-01-24', 'present'), (6, 13, 5, '2025-01-27', 'present'),
(6, 13, 5, '2025-01-28', 'present'), (6, 13, 5, '2025-01-29', 'present'),

-- Arjun Das - 75% attendance
(7, 13, 5, '2025-01-02', 'present'), (7, 13, 5, '2025-01-03', 'absent'), (7, 13, 5, '2025-01-06', 'present'),
(7, 13, 5, '2025-01-07', 'present'), (7, 13, 5, '2025-01-08', 'absent'), (7, 13, 5, '2025-01-09', 'present'),
(7, 13, 5, '2025-01-10', 'present'), (7, 13, 5, '2025-01-13', 'absent'), (7, 13, 5, '2025-01-14', 'present'),
(7, 13, 5, '2025-01-15', 'absent'), (7, 13, 5, '2025-01-16', 'present'), (7, 13, 5, '2025-01-17', 'present'),
(7, 13, 5, '2025-01-20', 'absent'), (7, 13, 5, '2025-01-21', 'present'), (7, 13, 5, '2025-01-22', 'present'),
(7, 13, 5, '2025-01-23', 'present'), (7, 13, 5, '2025-01-24', 'present'), (7, 13, 5, '2025-01-27', 'present'),
(7, 13, 5, '2025-01-28', 'present'), (7, 13, 5, '2025-01-29', 'present'),

-- Kavya Nair - 85% attendance
(8, 13, 5, '2025-01-02', 'present'), (8, 13, 5, '2025-01-03', 'present'), (8, 13, 5, '2025-01-06', 'present'),
(8, 13, 5, '2025-01-07', 'present'), (8, 13, 5, '2025-01-08', 'absent'), (8, 13, 5, '2025-01-09', 'present'),
(8, 13, 5, '2025-01-10', 'present'), (8, 13, 5, '2025-01-13', 'present'), (8, 13, 5, '2025-01-14', 'absent'),
(8, 13, 5, '2025-01-15', 'present'), (8, 13, 5, '2025-01-16', 'present'), (8, 13, 5, '2025-01-17', 'absent'),
(8, 13, 5, '2025-01-20', 'present'), (8, 13, 5, '2025-01-21', 'present'), (8, 13, 5, '2025-01-22', 'present'),
(8, 13, 5, '2025-01-23', 'present'), (8, 13, 5, '2025-01-24', 'present'), (8, 13, 5, '2025-01-27', 'present'),
(8, 13, 5, '2025-01-28', 'present'), (8, 13, 5, '2025-01-29', 'present');

-- Cloud Computing (CS502) attendance
INSERT INTO attendance (student_id, subject_id, semester_id, attendance_date, status) VALUES
(1, 14, 5, '2025-01-02', 'present'), (1, 14, 5, '2025-01-06', 'present'), (1, 14, 5, '2025-01-09', 'present'),
(1, 14, 5, '2025-01-13', 'present'), (1, 14, 5, '2025-01-16', 'present'), (1, 14, 5, '2025-01-20', 'present'),
(1, 14, 5, '2025-01-23', 'absent'), (1, 14, 5, '2025-01-27', 'present'),
(2, 14, 5, '2025-01-02', 'present'), (2, 14, 5, '2025-01-06', 'present'), (2, 14, 5, '2025-01-09', 'absent'),
(2, 14, 5, '2025-01-13', 'present'), (2, 14, 5, '2025-01-16', 'present'), (2, 14, 5, '2025-01-20', 'present'),
(2, 14, 5, '2025-01-23', 'present'), (2, 14, 5, '2025-01-27', 'present'),
(3, 14, 5, '2025-01-02', 'absent'), (3, 14, 5, '2025-01-06', 'present'), (3, 14, 5, '2025-01-09', 'absent'),
(3, 14, 5, '2025-01-13', 'present'), (3, 14, 5, '2025-01-16', 'absent'), (3, 14, 5, '2025-01-20', 'present'),
(3, 14, 5, '2025-01-23', 'absent'), (3, 14, 5, '2025-01-27', 'present'),
(4, 14, 5, '2025-01-02', 'present'), (4, 14, 5, '2025-01-06', 'present'), (4, 14, 5, '2025-01-09', 'present'),
(4, 14, 5, '2025-01-13', 'absent'), (4, 14, 5, '2025-01-16', 'present'), (4, 14, 5, '2025-01-20', 'present'),
(4, 14, 5, '2025-01-23', 'present'), (4, 14, 5, '2025-01-27', 'present'),
(5, 14, 5, '2025-01-02', 'absent'), (5, 14, 5, '2025-01-06', 'present'), (5, 14, 5, '2025-01-09', 'absent'),
(5, 14, 5, '2025-01-13', 'absent'), (5, 14, 5, '2025-01-16', 'present'), (5, 14, 5, '2025-01-20', 'present'),
(5, 14, 5, '2025-01-23', 'absent'), (5, 14, 5, '2025-01-27', 'present'),
(6, 14, 5, '2025-01-02', 'present'), (6, 14, 5, '2025-01-06', 'present'), (6, 14, 5, '2025-01-09', 'present'),
(6, 14, 5, '2025-01-13', 'present'), (6, 14, 5, '2025-01-16', 'present'), (6, 14, 5, '2025-01-20', 'present'),
(6, 14, 5, '2025-01-23', 'present'), (6, 14, 5, '2025-01-27', 'present'),
(7, 14, 5, '2025-01-02', 'present'), (7, 14, 5, '2025-01-06', 'absent'), (7, 14, 5, '2025-01-09', 'present'),
(7, 14, 5, '2025-01-13', 'present'), (7, 14, 5, '2025-01-16', 'absent'), (7, 14, 5, '2025-01-20', 'present'),
(7, 14, 5, '2025-01-23', 'present'), (7, 14, 5, '2025-01-27', 'present'),
(8, 14, 5, '2025-01-02', 'present'), (8, 14, 5, '2025-01-06', 'present'), (8, 14, 5, '2025-01-09', 'present'),
(8, 14, 5, '2025-01-13', 'present'), (8, 14, 5, '2025-01-16', 'absent'), (8, 14, 5, '2025-01-20', 'present'),
(8, 14, 5, '2025-01-23', 'present'), (8, 14, 5, '2025-01-27', 'present');

-- BCA Students attendance for DBMS
INSERT INTO attendance (student_id, subject_id, semester_id, attendance_date, status) VALUES
(13, 22, 2, '2025-01-02', 'present'), (13, 22, 2, '2025-01-06', 'present'), (13, 22, 2, '2025-01-09', 'present'),
(13, 22, 2, '2025-01-13', 'present'), (13, 22, 2, '2025-01-16', 'absent'), (13, 22, 2, '2025-01-20', 'present'),
(13, 22, 2, '2025-01-23', 'present'), (13, 22, 2, '2025-01-27', 'present'),
(14, 22, 2, '2025-01-02', 'present'), (14, 22, 2, '2025-01-06', 'present'), (14, 22, 2, '2025-01-09', 'present'),
(14, 22, 2, '2025-01-13', 'present'), (14, 22, 2, '2025-01-16', 'present'), (14, 22, 2, '2025-01-20', 'present'),
(14, 22, 2, '2025-01-23', 'present'), (14, 22, 2, '2025-01-27', 'absent'),
(15, 22, 2, '2025-01-02', 'absent'), (15, 22, 2, '2025-01-06', 'present'), (15, 22, 2, '2025-01-09', 'absent'),
(15, 22, 2, '2025-01-13', 'present'), (15, 22, 2, '2025-01-16', 'absent'), (15, 22, 2, '2025-01-20', 'present'),
(15, 22, 2, '2025-01-23', 'present'), (15, 22, 2, '2025-01-27', 'absent'),
(16, 22, 2, '2025-01-02', 'present'), (16, 22, 2, '2025-01-06', 'present'), (16, 22, 2, '2025-01-09', 'present'),
(16, 22, 2, '2025-01-13', 'present'), (16, 22, 2, '2025-01-16', 'present'), (16, 22, 2, '2025-01-20', 'present'),
(16, 22, 2, '2025-01-23', 'present'), (16, 22, 2, '2025-01-27', 'present');

-- =====================================================
-- PLACEMENTS DATA
-- =====================================================
INSERT INTO placements (student_id, company_name, job_role, package_lpa, placement_date, placement_status, location, offer_type) VALUES
-- Top performers placed
(1, 'Google India', 'Software Engineer', 28.5, '2025-11-15', 'accepted', 'Bangalore', 'on_campus'),
(2, 'Microsoft', 'SDE-1', 24.0, '2025-11-18', 'accepted', 'Hyderabad', 'on_campus'),
(6, 'Amazon', 'Software Development Engineer', 32.0, '2025-11-10', 'accepted', 'Bangalore', 'on_campus'),
(4, 'TCS Digital', 'System Engineer', 7.5, '2025-12-01', 'accepted', 'Mumbai', 'on_campus'),
(7, 'Infosys', 'Software Engineer', 6.5, '2025-12-05', 'accepted', 'Pune', 'on_campus'),
(8, 'Wipro', 'Project Engineer', 5.5, '2025-12-08', 'accepted', 'Chennai', 'on_campus'),
(17, 'Cognizant', 'Programmer Analyst', 6.0, '2025-12-10', 'accepted', 'Hyderabad', 'on_campus'),
(18, 'Accenture', 'Application Developer', 7.0, '2025-12-12', 'accepted', 'Bangalore', 'on_campus'),

-- Pending offers
(19, 'Tech Mahindra', 'Software Developer', 5.8, '2025-12-15', 'offered', 'Noida', 'on_campus'),

-- Multiple offers scenario
(6, 'Flipkart', 'SDE-1', 26.0, '2025-11-12', 'rejected', 'Bangalore', 'on_campus');

-- =====================================================
-- FEEDBACK DATA
-- =====================================================
INSERT INTO feedback (student_id, subject_id, semester_id, faculty_id, teaching_quality, course_content, practical_knowledge, overall_rating, comments) VALUES
(1, 13, 5, 1, 5, 5, 5, 5, 'Excellent teaching methodology. Dr. Sharma explains complex ML concepts very clearly.'),
(2, 13, 5, 1, 5, 4, 5, 5, 'Great practical sessions. More real-world projects would be beneficial.'),
(4, 13, 5, 1, 4, 5, 4, 4, 'Good course structure. Theory and practical balance is well maintained.'),
(6, 13, 5, 1, 5, 5, 5, 5, 'Best faculty for Machine Learning. Very approachable and helpful.'),
(7, 13, 5, 1, 4, 4, 4, 4, 'Good teaching, could include more industry case studies.'),
(8, 13, 5, 1, 5, 4, 5, 5, 'Loved the hands-on projects. Very engaging lectures.'),

-- Web Technologies feedback
(9, 9, 3, 4, 5, 5, 5, 5, 'Excellent practical sessions. Prof. Verma is very knowledgeable.'),
(10, 9, 3, 4, 5, 5, 5, 5, 'Best subject this semester. Very relevant to industry.'),
(11, 9, 3, 4, 4, 4, 5, 4, 'Good teaching style. Projects were challenging and fun.'),
(12, 9, 3, 4, 5, 5, 4, 5, 'Great learning experience. Would recommend this course.');

-- =====================================================
-- Update at-risk flags based on data
-- =====================================================
UPDATE students SET is_active = TRUE;

SELECT 'Presentation data loaded successfully!' as Status;
SELECT COUNT(*) as 'Total Users' FROM users;
SELECT COUNT(*) as 'Total Faculty' FROM faculty;
SELECT COUNT(*) as 'Total Students' FROM students;
SELECT COUNT(*) as 'Total Subjects' FROM subjects;
SELECT COUNT(*) as 'Total Marks Records' FROM marks;
SELECT COUNT(*) as 'Total Attendance Records' FROM attendance;
SELECT COUNT(*) as 'Total Placements' FROM placements;
