-- =====================================================
-- Educational Data Analytics System - Seed Data
-- Sample Data for Testing
-- =====================================================

USE educational_analytics;

-- =====================================================
-- INSERT DEPARTMENTS
-- =====================================================
INSERT INTO departments (department_name, department_code, hod_name) VALUES
('Computer Science & Engineering', 'CSE', 'Dr. Rajesh Kumar'),
('Electronics & Communication', 'ECE', 'Dr. Priya Sharma'),
('Mechanical Engineering', 'ME', 'Dr. Amit Patel'),
('Civil Engineering', 'CE', 'Dr. Sunita Verma'),
('Information Technology', 'IT', 'Dr. Vikram Singh');

-- =====================================================
-- INSERT SEMESTERS
-- =====================================================
INSERT INTO semesters (semester_name, semester_number, academic_year, start_date, end_date, is_current) VALUES
('Semester 1', 1, '2024-25', '2024-07-15', '2024-12-15', FALSE),
('Semester 2', 2, '2024-25', '2025-01-10', '2025-05-30', TRUE),
('Semester 3', 3, '2023-24', '2023-07-15', '2023-12-15', FALSE),
('Semester 4', 4, '2023-24', '2024-01-10', '2024-05-30', FALSE),
('Semester 5', 5, '2022-23', '2022-07-15', '2022-12-15', FALSE),
('Semester 6', 6, '2022-23', '2023-01-10', '2023-05-30', FALSE),
('Semester 7', 7, '2021-22', '2021-07-15', '2021-12-15', FALSE),
('Semester 8', 8, '2021-22', '2022-01-10', '2022-05-30', FALSE);

-- =====================================================
-- INSERT COURSES
-- =====================================================
INSERT INTO courses (course_name, course_code, department_id, duration_years, total_semesters) VALUES
('B.Tech Computer Science', 'BTCS', 1, 4, 8),
('B.Tech Electronics', 'BTEC', 2, 4, 8),
('B.Tech Mechanical', 'BTME', 3, 4, 8),
('B.Tech Civil', 'BTCE', 4, 4, 8),
('B.Tech Information Technology', 'BTIT', 5, 4, 8),
('MCA', 'MCA', 1, 2, 4),
('MBA', 'MBA', 1, 2, 4);

-- =====================================================
-- INSERT USERS (Admin, Faculty, Placement Officer)
-- =====================================================
INSERT INTO users (email, password_hash, role, full_name, phone) VALUES
('admin@eduanalytics.com', SHA2('admin123', 256), 'admin', 'System Administrator', '9876543210'),
('placement@eduanalytics.com', SHA2('placement123', 256), 'placement_officer', 'Mr. Ramesh Gupta', '9876543211'),
('rajesh.kumar@eduanalytics.com', SHA2('faculty123', 256), 'faculty', 'Dr. Rajesh Kumar', '9876543212'),
('priya.sharma@eduanalytics.com', SHA2('faculty123', 256), 'faculty', 'Dr. Priya Sharma', '9876543213'),
('amit.verma@eduanalytics.com', SHA2('faculty123', 256), 'faculty', 'Prof. Amit Verma', '9876543214'),
('neha.singh@eduanalytics.com', SHA2('faculty123', 256), 'faculty', 'Prof. Neha Singh', '9876543215'),
('suresh.patel@eduanalytics.com', SHA2('faculty123', 256), 'faculty', 'Dr. Suresh Patel', '9876543216');

-- =====================================================
-- INSERT FACULTY
-- =====================================================
INSERT INTO faculty (user_id, employee_id, first_name, last_name, email, phone, department_id, designation, qualification, specialization, joining_date) VALUES
(3, 'FAC001', 'Rajesh', 'Kumar', 'rajesh.kumar@eduanalytics.com', '9876543212', 1, 'Professor', 'Ph.D. Computer Science', 'Machine Learning', '2015-06-01'),
(4, 'FAC002', 'Priya', 'Sharma', 'priya.sharma@eduanalytics.com', '9876543213', 2, 'Associate Professor', 'Ph.D. Electronics', 'VLSI Design', '2016-08-15'),
(5, 'FAC003', 'Amit', 'Verma', 'amit.verma@eduanalytics.com', '9876543214', 1, 'Assistant Professor', 'M.Tech', 'Data Structures', '2018-01-10'),
(6, 'FAC004', 'Neha', 'Singh', 'neha.singh@eduanalytics.com', '9876543215', 1, 'Assistant Professor', 'M.Tech', 'Database Systems', '2019-07-01'),
(7, 'FAC005', 'Suresh', 'Patel', 'suresh.patel@eduanalytics.com', '9876543216', 5, 'Professor', 'Ph.D. IT', 'Cyber Security', '2014-03-20');

-- =====================================================
-- INSERT SUBJECTS
-- =====================================================
INSERT INTO subjects (subject_name, subject_code, course_id, semester_number, credits, subject_type, max_marks, passing_marks, faculty_id) VALUES
-- CSE Subjects
('Programming Fundamentals', 'CS101', 1, 1, 4, 'theory', 100, 40, 3),
('Data Structures', 'CS201', 1, 3, 4, 'theory', 100, 40, 5),
('Database Management Systems', 'CS301', 1, 5, 4, 'theory', 100, 40, 6),
('Operating Systems', 'CS302', 1, 5, 4, 'theory', 100, 40, 3),
('Computer Networks', 'CS401', 1, 7, 4, 'theory', 100, 40, 7),
('Machine Learning', 'CS402', 1, 7, 4, 'theory', 100, 40, 3),
('Web Development Lab', 'CS351', 1, 5, 2, 'practical', 100, 40, 5),
('DBMS Lab', 'CS352', 1, 5, 2, 'practical', 100, 40, 6),
-- ECE Subjects
('Basic Electronics', 'EC101', 2, 1, 4, 'theory', 100, 40, 4),
('Digital Electronics', 'EC201', 2, 3, 4, 'theory', 100, 40, 4),
-- IT Subjects
('Information Security', 'IT401', 5, 7, 4, 'theory', 100, 40, 7),
('Cloud Computing', 'IT402', 5, 7, 4, 'theory', 100, 40, 7);

-- =====================================================
-- INSERT STUDENTS
-- =====================================================
INSERT INTO users (email, password_hash, role, full_name, phone) VALUES
('rahul.sharma@student.edu', SHA2('student123', 256), 'student', 'Rahul Sharma', '9988776601'),
('priya.patel@student.edu', SHA2('student123', 256), 'student', 'Priya Patel', '9988776602'),
('amit.kumar@student.edu', SHA2('student123', 256), 'student', 'Amit Kumar', '9988776603'),
('sneha.gupta@student.edu', SHA2('student123', 256), 'student', 'Sneha Gupta', '9988776604'),
('vikram.singh@student.edu', SHA2('student123', 256), 'student', 'Vikram Singh', '9988776605'),
('anjali.verma@student.edu', SHA2('student123', 256), 'student', 'Anjali Verma', '9988776606'),
('rohit.jain@student.edu', SHA2('student123', 256), 'student', 'Rohit Jain', '9988776607'),
('pooja.sharma@student.edu', SHA2('student123', 256), 'student', 'Pooja Sharma', '9988776608'),
('arjun.reddy@student.edu', SHA2('student123', 256), 'student', 'Arjun Reddy', '9988776609'),
('kavita.mishra@student.edu', SHA2('student123', 256), 'student', 'Kavita Mishra', '9988776610'),
('deepak.yadav@student.edu', SHA2('student123', 256), 'student', 'Deepak Yadav', '9988776611'),
('neha.agarwal@student.edu', SHA2('student123', 256), 'student', 'Neha Agarwal', '9988776612'),
('sanjay.mehta@student.edu', SHA2('student123', 256), 'student', 'Sanjay Mehta', '9988776613'),
('ritu.sharma@student.edu', SHA2('student123', 256), 'student', 'Ritu Sharma', '9988776614'),
('karan.kapoor@student.edu', SHA2('student123', 256), 'student', 'Karan Kapoor', '9988776615');

INSERT INTO students (user_id, enrollment_number, first_name, last_name, email, phone, date_of_birth, gender, course_id, current_semester, admission_year, batch, guardian_name, guardian_phone) VALUES
(8, 'EN2021001', 'Rahul', 'Sharma', 'rahul.sharma@student.edu', '9988776601', '2003-05-15', 'male', 1, 5, 2021, '2021-25', 'Mr. Suresh Sharma', '9876501234'),
(9, 'EN2021002', 'Priya', 'Patel', 'priya.patel@student.edu', '9988776602', '2003-08-22', 'female', 1, 5, 2021, '2021-25', 'Mr. Ramesh Patel', '9876501235'),
(10, 'EN2021003', 'Amit', 'Kumar', 'amit.kumar@student.edu', '9988776603', '2003-02-10', 'male', 1, 5, 2021, '2021-25', 'Mr. Vijay Kumar', '9876501236'),
(11, 'EN2021004', 'Sneha', 'Gupta', 'sneha.gupta@student.edu', '9988776604', '2003-11-30', 'female', 1, 5, 2021, '2021-25', 'Mr. Anil Gupta', '9876501237'),
(12, 'EN2021005', 'Vikram', 'Singh', 'vikram.singh@student.edu', '9988776605', '2003-07-18', 'male', 1, 5, 2021, '2021-25', 'Mr. Harpal Singh', '9876501238'),
(13, 'EN2021006', 'Anjali', 'Verma', 'anjali.verma@student.edu', '9988776606', '2003-04-25', 'female', 2, 5, 2021, '2021-25', 'Mr. Prakash Verma', '9876501239'),
(14, 'EN2021007', 'Rohit', 'Jain', 'rohit.jain@student.edu', '9988776607', '2003-09-12', 'male', 2, 5, 2021, '2021-25', 'Mr. Mahesh Jain', '9876501240'),
(15, 'EN2022001', 'Pooja', 'Sharma', 'pooja.sharma@student.edu', '9988776608', '2004-01-05', 'female', 1, 3, 2022, '2022-26', 'Mr. Dinesh Sharma', '9876501241'),
(16, 'EN2022002', 'Arjun', 'Reddy', 'arjun.reddy@student.edu', '9988776609', '2004-06-28', 'male', 1, 3, 2022, '2022-26', 'Mr. Venkat Reddy', '9876501242'),
(17, 'EN2022003', 'Kavita', 'Mishra', 'kavita.mishra@student.edu', '9988776610', '2004-03-14', 'female', 5, 3, 2022, '2022-26', 'Mr. Rajendra Mishra', '9876501243'),
(18, 'EN2020001', 'Deepak', 'Yadav', 'deepak.yadav@student.edu', '9988776611', '2002-12-08', 'male', 1, 7, 2020, '2020-24', 'Mr. Shyam Yadav', '9876501244'),
(19, 'EN2020002', 'Neha', 'Agarwal', 'neha.agarwal@student.edu', '9988776612', '2002-10-20', 'female', 1, 7, 2020, '2020-24', 'Mr. Rakesh Agarwal', '9876501245'),
(20, 'EN2020003', 'Sanjay', 'Mehta', 'sanjay.mehta@student.edu', '9988776613', '2002-08-03', 'male', 5, 7, 2020, '2020-24', 'Mr. Govind Mehta', '9876501246'),
(21, 'EN2020004', 'Ritu', 'Sharma', 'ritu.sharma@student.edu', '9988776614', '2002-05-17', 'female', 2, 7, 2020, '2020-24', 'Mr. Mohan Sharma', '9876501247'),
(22, 'EN2020005', 'Karan', 'Kapoor', 'karan.kapoor@student.edu', '9988776615', '2002-02-28', 'male', 1, 7, 2020, '2020-24', 'Mr. Raj Kapoor', '9876501248');

-- =====================================================
-- INSERT ATTENDANCE DATA
-- =====================================================
-- Generate attendance for students (sample data)
INSERT INTO attendance (student_id, subject_id, semester_id, attendance_date, status, marked_by) VALUES
-- Student 1 (Rahul) - Good attendance
(1, 3, 5, '2024-08-01', 'present', 6), (1, 3, 5, '2024-08-02', 'present', 6),
(1, 3, 5, '2024-08-05', 'present', 6), (1, 3, 5, '2024-08-06', 'present', 6),
(1, 3, 5, '2024-08-07', 'absent', 6), (1, 3, 5, '2024-08-08', 'present', 6),
(1, 3, 5, '2024-08-09', 'present', 6), (1, 3, 5, '2024-08-12', 'present', 6),
(1, 3, 5, '2024-08-13', 'present', 6), (1, 3, 5, '2024-08-14', 'present', 6),
(1, 4, 5, '2024-08-01', 'present', 3), (1, 4, 5, '2024-08-02', 'present', 3),
(1, 4, 5, '2024-08-05', 'present', 3), (1, 4, 5, '2024-08-06', 'present', 3),
(1, 4, 5, '2024-08-07', 'present', 3), (1, 4, 5, '2024-08-08', 'absent', 3),
(1, 4, 5, '2024-08-09', 'present', 3), (1, 4, 5, '2024-08-12', 'present', 3),

-- Student 2 (Priya) - Excellent attendance
(2, 3, 5, '2024-08-01', 'present', 6), (2, 3, 5, '2024-08-02', 'present', 6),
(2, 3, 5, '2024-08-05', 'present', 6), (2, 3, 5, '2024-08-06', 'present', 6),
(2, 3, 5, '2024-08-07', 'present', 6), (2, 3, 5, '2024-08-08', 'present', 6),
(2, 3, 5, '2024-08-09', 'present', 6), (2, 3, 5, '2024-08-12', 'present', 6),
(2, 3, 5, '2024-08-13', 'present', 6), (2, 3, 5, '2024-08-14', 'present', 6),

-- Student 3 (Amit) - Poor attendance (at-risk)
(3, 3, 5, '2024-08-01', 'absent', 6), (3, 3, 5, '2024-08-02', 'absent', 6),
(3, 3, 5, '2024-08-05', 'present', 6), (3, 3, 5, '2024-08-06', 'absent', 6),
(3, 3, 5, '2024-08-07', 'present', 6), (3, 3, 5, '2024-08-08', 'absent', 6),
(3, 3, 5, '2024-08-09', 'present', 6), (3, 3, 5, '2024-08-12', 'absent', 6),
(3, 3, 5, '2024-08-13', 'present', 6), (3, 3, 5, '2024-08-14', 'absent', 6),

-- Student 4 (Sneha) - Good attendance
(4, 3, 5, '2024-08-01', 'present', 6), (4, 3, 5, '2024-08-02', 'present', 6),
(4, 3, 5, '2024-08-05', 'present', 6), (4, 3, 5, '2024-08-06', 'present', 6),
(4, 3, 5, '2024-08-07', 'present', 6), (4, 3, 5, '2024-08-08', 'present', 6),
(4, 3, 5, '2024-08-09', 'absent', 6), (4, 3, 5, '2024-08-12', 'present', 6),

-- Student 5 (Vikram) - Medium attendance
(5, 3, 5, '2024-08-01', 'present', 6), (5, 3, 5, '2024-08-02', 'absent', 6),
(5, 3, 5, '2024-08-05', 'present', 6), (5, 3, 5, '2024-08-06', 'present', 6),
(5, 3, 5, '2024-08-07', 'absent', 6), (5, 3, 5, '2024-08-08', 'present', 6),
(5, 3, 5, '2024-08-09', 'present', 6), (5, 3, 5, '2024-08-12', 'absent', 6);

-- =====================================================
-- INSERT MARKS DATA
-- =====================================================
INSERT INTO marks (student_id, subject_id, semester_id, exam_type, marks_obtained, max_marks, exam_date, entered_by) VALUES
-- Student 1 (Rahul) - Good performer
(1, 3, 5, 'internal1', 18, 20, '2024-08-20', 6), (1, 3, 5, 'internal2', 17, 20, '2024-09-15', 6),
(1, 3, 5, 'midterm', 38, 50, '2024-10-01', 6), (1, 3, 5, 'final', 72, 100, '2024-12-10', 6),
(1, 4, 5, 'internal1', 16, 20, '2024-08-21', 3), (1, 4, 5, 'internal2', 18, 20, '2024-09-16', 3),
(1, 4, 5, 'midterm', 40, 50, '2024-10-02', 3), (1, 4, 5, 'final', 78, 100, '2024-12-11', 3),

-- Student 2 (Priya) - Top performer
(2, 3, 5, 'internal1', 20, 20, '2024-08-20', 6), (2, 3, 5, 'internal2', 19, 20, '2024-09-15', 6),
(2, 3, 5, 'midterm', 48, 50, '2024-10-01', 6), (2, 3, 5, 'final', 92, 100, '2024-12-10', 6),
(2, 4, 5, 'internal1', 19, 20, '2024-08-21', 3), (2, 4, 5, 'internal2', 20, 20, '2024-09-16', 3),
(2, 4, 5, 'midterm', 46, 50, '2024-10-02', 3), (2, 4, 5, 'final', 88, 100, '2024-12-11', 3),

-- Student 3 (Amit) - At-risk student (low marks)
(3, 3, 5, 'internal1', 8, 20, '2024-08-20', 6), (3, 3, 5, 'internal2', 10, 20, '2024-09-15', 6),
(3, 3, 5, 'midterm', 18, 50, '2024-10-01', 6), (3, 3, 5, 'final', 32, 100, '2024-12-10', 6),
(3, 4, 5, 'internal1', 9, 20, '2024-08-21', 3), (3, 4, 5, 'internal2', 7, 20, '2024-09-16', 3),
(3, 4, 5, 'midterm', 15, 50, '2024-10-02', 3), (3, 4, 5, 'final', 28, 100, '2024-12-11', 3),

-- Student 4 (Sneha) - Good performer
(4, 3, 5, 'internal1', 17, 20, '2024-08-20', 6), (4, 3, 5, 'internal2', 16, 20, '2024-09-15', 6),
(4, 3, 5, 'midterm', 35, 50, '2024-10-01', 6), (4, 3, 5, 'final', 68, 100, '2024-12-10', 6),
(4, 4, 5, 'internal1', 15, 20, '2024-08-21', 3), (4, 4, 5, 'internal2', 17, 20, '2024-09-16', 3),
(4, 4, 5, 'midterm', 36, 50, '2024-10-02', 3), (4, 4, 5, 'final', 71, 100, '2024-12-11', 3),

-- Student 5 (Vikram) - Medium performer
(5, 3, 5, 'internal1', 12, 20, '2024-08-20', 6), (5, 3, 5, 'internal2', 14, 20, '2024-09-15', 6),
(5, 3, 5, 'midterm', 28, 50, '2024-10-01', 6), (5, 3, 5, 'final', 55, 100, '2024-12-10', 6),
(5, 4, 5, 'internal1', 13, 20, '2024-08-21', 3), (5, 4, 5, 'internal2', 12, 20, '2024-09-16', 3),
(5, 4, 5, 'midterm', 25, 50, '2024-10-02', 3), (5, 4, 5, 'final', 48, 100, '2024-12-11', 3),

-- Final year students marks
(11, 5, 7, 'final', 85, 100, '2024-12-10', 7), (11, 6, 7, 'final', 88, 100, '2024-12-11', 3),
(12, 5, 7, 'final', 78, 100, '2024-12-10', 7), (12, 6, 7, 'final', 82, 100, '2024-12-11', 3),
(13, 11, 7, 'final', 72, 100, '2024-12-10', 7), (13, 12, 7, 'final', 75, 100, '2024-12-11', 7),
(14, 5, 7, 'final', 65, 100, '2024-12-10', 7), (14, 6, 7, 'final', 70, 100, '2024-12-11', 3),
(15, 5, 7, 'final', 91, 100, '2024-12-10', 7), (15, 6, 7, 'final', 94, 100, '2024-12-11', 3);

-- =====================================================
-- INSERT PLACEMENT DATA
-- =====================================================
INSERT INTO placements (student_id, company_name, job_role, package_lpa, placement_date, offer_type, placement_status, location, is_internship) VALUES
(11, 'Google', 'Software Engineer', 25.00, '2024-01-15', 'on_campus', 'accepted', 'Bangalore', FALSE),
(12, 'Microsoft', 'Software Developer', 18.50, '2024-01-20', 'on_campus', 'accepted', 'Hyderabad', FALSE),
(13, 'Amazon', 'Cloud Engineer', 22.00, '2024-02-01', 'on_campus', 'accepted', 'Bangalore', FALSE),
(14, 'TCS', 'System Engineer', 4.50, '2024-02-10', 'on_campus', 'accepted', 'Mumbai', FALSE),
(15, 'Infosys', 'Software Developer', 5.00, '2024-02-15', 'on_campus', 'accepted', 'Pune', FALSE),
(11, 'Meta', 'Software Engineer Intern', 0, '2023-06-01', 'on_campus', 'accepted', 'Remote', TRUE),
(12, 'Flipkart', 'Backend Developer', 16.00, '2024-01-25', 'on_campus', 'rejected', 'Bangalore', FALSE),
(15, 'Google', 'Software Engineer', 28.00, '2024-01-18', 'on_campus', 'offered', 'Bangalore', FALSE);

-- Additional placements for more data
INSERT INTO placements (student_id, company_name, job_role, package_lpa, placement_date, offer_type, placement_status, location, is_internship) VALUES
(1, 'Wipro', 'Junior Developer', 4.00, '2025-02-01', 'on_campus', 'offered', 'Chennai', FALSE),
(2, 'Accenture', 'Associate Software Engineer', 4.50, '2025-02-05', 'on_campus', 'accepted', 'Bangalore', FALSE),
(4, 'Cognizant', 'Programmer Analyst', 4.25, '2025-02-08', 'on_campus', 'accepted', 'Hyderabad', FALSE);

-- =====================================================
-- INSERT FEEDBACK DATA
-- =====================================================
INSERT INTO feedback (student_id, subject_id, semester_id, faculty_id, teaching_quality, course_content, practical_knowledge, overall_rating, comments) VALUES
(1, 3, 5, 6, 4, 5, 4, 4, 'Excellent teaching methodology. Very helpful for understanding concepts.'),
(2, 3, 5, 6, 5, 5, 5, 5, 'Best faculty for DBMS. Explains complex topics with ease.'),
(3, 3, 5, 6, 3, 4, 3, 3, 'Good content but need more practical examples.'),
(4, 3, 5, 6, 4, 4, 4, 4, 'Very knowledgeable professor. Enjoyed the course.'),
(5, 3, 5, 6, 4, 4, 3, 4, 'Good course coverage. Would like more hands-on sessions.'),
(1, 4, 5, 3, 5, 4, 5, 5, 'Brilliant teaching on Operating Systems!'),
(2, 4, 5, 3, 5, 5, 4, 5, 'Very detailed explanations of complex algorithms.');
