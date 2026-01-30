-- =====================================================
-- Educational Data Analytics System - Database Schema
-- MySQL Database Script
-- =====================================================

CREATE DATABASE IF NOT EXISTS educational_analytics;
USE educational_analytics;

-- =====================================================
-- USERS TABLE (for authentication)
-- =====================================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'faculty', 'student', 'placement_officer') NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    profile_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- =====================================================
-- DEPARTMENTS TABLE
-- =====================================================
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(10) UNIQUE NOT NULL,
    hod_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SEMESTERS TABLE
-- =====================================================
CREATE TABLE semesters (
    semester_id INT PRIMARY KEY AUTO_INCREMENT,
    semester_name VARCHAR(50) NOT NULL,
    semester_number INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    INDEX idx_academic_year (academic_year)
);

-- =====================================================
-- COURSES TABLE
-- =====================================================
CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    department_id INT,
    duration_years INT DEFAULT 4,
    total_semesters INT DEFAULT 8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

-- =====================================================
-- STUDENTS TABLE
-- =====================================================
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    enrollment_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    course_id INT,
    current_semester INT DEFAULT 1,
    admission_year YEAR,
    batch VARCHAR(20),
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL,
    INDEX idx_enrollment (enrollment_number),
    INDEX idx_course (course_id),
    INDEX idx_semester (current_semester)
);

-- =====================================================
-- FACULTY TABLE
-- =====================================================
CREATE TABLE faculty (
    faculty_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    department_id INT,
    designation VARCHAR(50),
    qualification VARCHAR(100),
    specialization VARCHAR(100),
    joining_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    INDEX idx_employee_id (employee_id),
    INDEX idx_department (department_id)
);

-- =====================================================
-- SUBJECTS TABLE
-- =====================================================
CREATE TABLE subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    course_id INT,
    semester_number INT NOT NULL,
    credits INT DEFAULT 3,
    subject_type ENUM('theory', 'practical', 'project') DEFAULT 'theory',
    max_marks INT DEFAULT 100,
    passing_marks INT DEFAULT 40,
    faculty_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE SET NULL,
    INDEX idx_course_semester (course_id, semester_number)
);

-- =====================================================
-- ATTENDANCE TABLE
-- =====================================================
CREATE TABLE attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') DEFAULT 'present',
    marked_by INT,
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES faculty(faculty_id) ON DELETE SET NULL,
    INDEX idx_student_subject (student_id, subject_id),
    INDEX idx_date (attendance_date),
    UNIQUE KEY unique_attendance (student_id, subject_id, attendance_date)
);

-- =====================================================
-- MARKS TABLE
-- =====================================================
CREATE TABLE marks (
    marks_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester_id INT NOT NULL,
    exam_type ENUM('internal1', 'internal2', 'internal3', 'midterm', 'final', 'practical', 'assignment') NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) DEFAULT 100,
    exam_date DATE,
    entered_by INT,
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE,
    FOREIGN KEY (entered_by) REFERENCES faculty(faculty_id) ON DELETE SET NULL,
    INDEX idx_student_subject (student_id, subject_id),
    INDEX idx_exam_type (exam_type)
);

-- =====================================================
-- PLACEMENTS TABLE
-- =====================================================
CREATE TABLE placements (
    placement_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    job_role VARCHAR(100),
    package_lpa DECIMAL(10,2),
    placement_date DATE,
    offer_type ENUM('on_campus', 'off_campus', 'pool_campus') DEFAULT 'on_campus',
    placement_status ENUM('offered', 'accepted', 'rejected', 'pending') DEFAULT 'offered',
    location VARCHAR(100),
    is_internship BOOLEAN DEFAULT FALSE,
    internship_duration_months INT,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    INDEX idx_company (company_name),
    INDEX idx_status (placement_status),
    INDEX idx_package (package_lpa)
);

-- =====================================================
-- FEEDBACK TABLE
-- =====================================================
CREATE TABLE feedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester_id INT NOT NULL,
    faculty_id INT,
    teaching_quality INT CHECK (teaching_quality BETWEEN 1 AND 5),
    course_content INT CHECK (course_content BETWEEN 1 AND 5),
    practical_knowledge INT CHECK (practical_knowledge BETWEEN 1 AND 5),
    overall_rating INT CHECK (overall_rating BETWEEN 1 AND 5),
    comments TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE SET NULL,
    UNIQUE KEY unique_feedback (student_id, subject_id, semester_id)
);

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- Student Performance Analytics View
CREATE VIEW student_performance_view AS
SELECT 
    s.student_id,
    s.enrollment_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    s.email,
    c.course_name,
    s.current_semester,
    s.batch,
    COALESCE(AVG(m.marks_obtained), 0) AS average_marks,
    COALESCE(MAX(m.marks_obtained), 0) AS highest_marks,
    COALESCE(MIN(m.marks_obtained), 0) AS lowest_marks,
    COUNT(DISTINCT m.subject_id) AS subjects_count
FROM students s
LEFT JOIN courses c ON s.course_id = c.course_id
LEFT JOIN marks m ON s.student_id = m.student_id
WHERE s.is_active = TRUE
GROUP BY s.student_id, s.enrollment_number, s.first_name, s.last_name, s.email, 
         c.course_name, s.current_semester, s.batch;

-- Attendance Summary View
CREATE VIEW attendance_summary_view AS
SELECT 
    s.student_id,
    s.enrollment_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    sub.subject_id,
    sub.subject_name,
    sem.semester_name,
    COUNT(a.attendance_id) AS total_classes,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS classes_attended,
    ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(a.attendance_id)) * 100, 2) AS attendance_percentage
FROM students s
JOIN attendance a ON s.student_id = a.student_id
JOIN subjects sub ON a.subject_id = sub.subject_id
JOIN semesters sem ON a.semester_id = sem.semester_id
GROUP BY s.student_id, s.enrollment_number, s.first_name, s.last_name, 
         sub.subject_id, sub.subject_name, sem.semester_name;

-- At-Risk Students View
CREATE VIEW at_risk_students_view AS
SELECT 
    s.student_id,
    s.enrollment_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    s.email,
    c.course_name,
    s.current_semester,
    COALESCE(perf.average_marks, 0) AS average_marks,
    COALESCE(att.overall_attendance, 0) AS overall_attendance,
    CASE 
        WHEN COALESCE(perf.average_marks, 0) < 35 AND COALESCE(att.overall_attendance, 0) < 60 THEN 'High'
        WHEN COALESCE(perf.average_marks, 0) < 45 OR COALESCE(att.overall_attendance, 0) < 75 THEN 'Medium'
        ELSE 'Low'
    END AS risk_level
FROM students s
LEFT JOIN courses c ON s.course_id = c.course_id
LEFT JOIN (
    SELECT student_id, AVG(marks_obtained) AS average_marks
    FROM marks
    GROUP BY student_id
) perf ON s.student_id = perf.student_id
LEFT JOIN (
    SELECT student_id, 
           ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS overall_attendance
    FROM attendance
    GROUP BY student_id
) att ON s.student_id = att.student_id
WHERE s.is_active = TRUE
HAVING risk_level IN ('High', 'Medium');

-- Placement Statistics View
CREATE VIEW placement_stats_view AS
SELECT 
    c.course_name,
    s.batch,
    COUNT(DISTINCT s.student_id) AS total_students,
    COUNT(DISTINCT CASE WHEN p.placement_status = 'accepted' THEN s.student_id END) AS placed_students,
    ROUND((COUNT(DISTINCT CASE WHEN p.placement_status = 'accepted' THEN s.student_id END) / COUNT(DISTINCT s.student_id)) * 100, 2) AS placement_percentage,
    COALESCE(AVG(CASE WHEN p.placement_status = 'accepted' THEN p.package_lpa END), 0) AS average_package,
    COALESCE(MAX(CASE WHEN p.placement_status = 'accepted' THEN p.package_lpa END), 0) AS highest_package,
    COALESCE(MIN(CASE WHEN p.placement_status = 'accepted' THEN p.package_lpa END), 0) AS lowest_package
FROM students s
LEFT JOIN courses c ON s.course_id = c.course_id
LEFT JOIN placements p ON s.student_id = p.student_id
WHERE s.is_active = TRUE
GROUP BY c.course_name, s.batch;

-- Subject Analytics View
CREATE VIEW subject_analytics_view AS
SELECT 
    sub.subject_id,
    sub.subject_code,
    sub.subject_name,
    c.course_name,
    sub.semester_number,
    CONCAT(f.first_name, ' ', f.last_name) AS faculty_name,
    COUNT(DISTINCT m.student_id) AS total_students,
    ROUND(AVG(m.marks_obtained), 2) AS average_marks,
    ROUND(STDDEV(m.marks_obtained), 2) AS marks_std_dev,
    SUM(CASE WHEN m.marks_obtained >= sub.passing_marks THEN 1 ELSE 0 END) AS passed_count,
    SUM(CASE WHEN m.marks_obtained < sub.passing_marks THEN 1 ELSE 0 END) AS failed_count,
    ROUND((SUM(CASE WHEN m.marks_obtained >= sub.passing_marks THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS pass_percentage
FROM subjects sub
LEFT JOIN courses c ON sub.course_id = c.course_id
LEFT JOIN faculty f ON sub.faculty_id = f.faculty_id
LEFT JOIN marks m ON sub.subject_id = m.subject_id AND m.exam_type = 'final'
GROUP BY sub.subject_id, sub.subject_code, sub.subject_name, c.course_name, 
         sub.semester_number, f.first_name, f.last_name;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Get Complete Student Performance
CREATE PROCEDURE GetStudentPerformance(IN p_student_id INT)
BEGIN
    -- Student basic info with overall performance
    SELECT 
        s.student_id,
        s.enrollment_number,
        CONCAT(s.first_name, ' ', s.last_name) AS student_name,
        s.email,
        c.course_name,
        s.current_semester,
        s.batch,
        COALESCE(AVG(m.marks_obtained), 0) AS overall_average,
        (SELECT ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2)
         FROM attendance WHERE student_id = p_student_id) AS overall_attendance
    FROM students s
    LEFT JOIN courses c ON s.course_id = c.course_id
    LEFT JOIN marks m ON s.student_id = m.student_id
    WHERE s.student_id = p_student_id
    GROUP BY s.student_id;
    
    -- Subject-wise marks
    SELECT 
        sub.subject_name,
        sub.subject_code,
        m.exam_type,
        m.marks_obtained,
        m.max_marks,
        ROUND((m.marks_obtained / m.max_marks) * 100, 2) AS percentage,
        m.exam_date
    FROM marks m
    JOIN subjects sub ON m.subject_id = sub.subject_id
    WHERE m.student_id = p_student_id
    ORDER BY sub.subject_name, m.exam_date;
    
    -- Semester-wise performance trend
    SELECT 
        sem.semester_name,
        sem.semester_number,
        ROUND(AVG(m.marks_obtained), 2) AS semester_average,
        COUNT(DISTINCT m.subject_id) AS subjects_count
    FROM marks m
    JOIN semesters sem ON m.semester_id = sem.semester_id
    WHERE m.student_id = p_student_id
    GROUP BY sem.semester_id, sem.semester_name, sem.semester_number
    ORDER BY sem.semester_number;
END //

-- Get At-Risk Students with Details
CREATE PROCEDURE GetAtRiskStudents(IN p_risk_level VARCHAR(10))
BEGIN
    SELECT 
        s.student_id,
        s.enrollment_number,
        CONCAT(s.first_name, ' ', s.last_name) AS student_name,
        s.email,
        s.phone,
        c.course_name,
        s.current_semester,
        COALESCE(perf.average_marks, 0) AS average_marks,
        COALESCE(att.overall_attendance, 0) AS overall_attendance,
        s.guardian_name,
        s.guardian_phone,
        CASE 
            WHEN COALESCE(perf.average_marks, 0) < 35 AND COALESCE(att.overall_attendance, 0) < 60 THEN 'High'
            WHEN COALESCE(perf.average_marks, 0) < 45 OR COALESCE(att.overall_attendance, 0) < 75 THEN 'Medium'
            ELSE 'Low'
        END AS risk_level
    FROM students s
    LEFT JOIN courses c ON s.course_id = c.course_id
    LEFT JOIN (
        SELECT student_id, AVG(marks_obtained) AS average_marks
        FROM marks GROUP BY student_id
    ) perf ON s.student_id = perf.student_id
    LEFT JOIN (
        SELECT student_id, 
               ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS overall_attendance
        FROM attendance GROUP BY student_id
    ) att ON s.student_id = att.student_id
    WHERE s.is_active = TRUE
    HAVING risk_level = p_risk_level OR p_risk_level IS NULL
    ORDER BY risk_level DESC, average_marks ASC;
END //

-- Get Placement Statistics
CREATE PROCEDURE GetPlacementStats(IN p_batch VARCHAR(20), IN p_course_id INT)
BEGIN
    -- Overall placement summary
    SELECT 
        COUNT(DISTINCT s.student_id) AS total_students,
        COUNT(DISTINCT CASE WHEN p.placement_status = 'accepted' THEN s.student_id END) AS placed_students,
        COUNT(DISTINCT CASE WHEN p.placement_status = 'accepted' AND p.is_internship = FALSE THEN s.student_id END) AS full_time_placed,
        COUNT(DISTINCT CASE WHEN p.placement_status = 'accepted' AND p.is_internship = TRUE THEN s.student_id END) AS internship_placed,
        ROUND(AVG(CASE WHEN p.placement_status = 'accepted' THEN p.package_lpa END), 2) AS average_package,
        MAX(CASE WHEN p.placement_status = 'accepted' THEN p.package_lpa END) AS highest_package,
        MIN(CASE WHEN p.placement_status = 'accepted' THEN p.package_lpa END) AS lowest_package
    FROM students s
    LEFT JOIN placements p ON s.student_id = p.student_id
    WHERE (p_batch IS NULL OR s.batch = p_batch)
      AND (p_course_id IS NULL OR s.course_id = p_course_id);
    
    -- Company-wise placement data
    SELECT 
        p.company_name,
        COUNT(*) AS students_placed,
        AVG(p.package_lpa) AS average_package,
        MAX(p.package_lpa) AS max_package,
        GROUP_CONCAT(DISTINCT p.job_role) AS job_roles
    FROM placements p
    JOIN students s ON p.student_id = s.student_id
    WHERE p.placement_status = 'accepted'
      AND (p_batch IS NULL OR s.batch = p_batch)
      AND (p_course_id IS NULL OR s.course_id = p_course_id)
    GROUP BY p.company_name
    ORDER BY students_placed DESC;
    
    -- Package distribution
    SELECT 
        CASE 
            WHEN p.package_lpa < 5 THEN '0-5 LPA'
            WHEN p.package_lpa BETWEEN 5 AND 10 THEN '5-10 LPA'
            WHEN p.package_lpa BETWEEN 10 AND 15 THEN '10-15 LPA'
            WHEN p.package_lpa BETWEEN 15 AND 25 THEN '15-25 LPA'
            ELSE '25+ LPA'
        END AS package_range,
        COUNT(*) AS student_count
    FROM placements p
    JOIN students s ON p.student_id = s.student_id
    WHERE p.placement_status = 'accepted'
      AND (p_batch IS NULL OR s.batch = p_batch)
    GROUP BY package_range
    ORDER BY MIN(p.package_lpa);
END //

-- Calculate Subject Difficulty
CREATE PROCEDURE GetSubjectDifficulty(IN p_course_id INT)
BEGIN
    SELECT 
        sub.subject_id,
        sub.subject_code,
        sub.subject_name,
        sub.semester_number,
        ROUND(AVG(m.marks_obtained), 2) AS average_marks,
        ROUND(STDDEV(m.marks_obtained), 2) AS std_deviation,
        ROUND((SUM(CASE WHEN m.marks_obtained < sub.passing_marks THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS fail_rate,
        CASE 
            WHEN AVG(m.marks_obtained) < 45 THEN 'Hard'
            WHEN AVG(m.marks_obtained) < 60 THEN 'Medium'
            ELSE 'Easy'
        END AS difficulty_level
    FROM subjects sub
    JOIN marks m ON sub.subject_id = m.subject_id
    WHERE m.exam_type = 'final'
      AND (p_course_id IS NULL OR sub.course_id = p_course_id)
    GROUP BY sub.subject_id, sub.subject_code, sub.subject_name, sub.semester_number, sub.passing_marks
    ORDER BY fail_rate DESC;
END //

-- Get Attendance vs Performance Correlation
CREATE PROCEDURE GetAttendancePerformanceCorrelation(IN p_subject_id INT)
BEGIN
    SELECT 
        s.student_id,
        CONCAT(s.first_name, ' ', s.last_name) AS student_name,
        ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(a.attendance_id)) * 100, 2) AS attendance_percentage,
        AVG(m.marks_obtained) AS average_marks,
        CASE 
            WHEN (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(a.attendance_id)) * 100 >= 75 THEN 'Good Attendance'
            ELSE 'Poor Attendance'
        END AS attendance_category
    FROM students s
    JOIN attendance a ON s.student_id = a.student_id
    LEFT JOIN marks m ON s.student_id = m.student_id AND m.subject_id = a.subject_id
    WHERE (p_subject_id IS NULL OR a.subject_id = p_subject_id)
    GROUP BY s.student_id, s.first_name, s.last_name
    ORDER BY attendance_percentage DESC;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

DELIMITER //

-- Trigger: Auto-create user account when student is added
CREATE TRIGGER after_student_insert
AFTER INSERT ON students
FOR EACH ROW
BEGIN
    IF NEW.user_id IS NULL THEN
        INSERT INTO users (email, password_hash, role, full_name, phone)
        VALUES (NEW.email, SHA2(CONCAT(NEW.enrollment_number, '@student'), 256), 'student', 
                CONCAT(NEW.first_name, ' ', NEW.last_name), NEW.phone);
        
        UPDATE students SET user_id = LAST_INSERT_ID() WHERE student_id = NEW.student_id;
    END IF;
END //

-- Trigger: Log low attendance alert
CREATE TABLE IF NOT EXISTS attendance_alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    subject_id INT,
    attendance_percentage DECIMAL(5,2),
    alert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_resolved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
);

CREATE TRIGGER check_low_attendance
AFTER INSERT ON attendance
FOR EACH ROW
BEGIN
    DECLARE att_percent DECIMAL(5,2);
    
    SELECT ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2)
    INTO att_percent
    FROM attendance
    WHERE student_id = NEW.student_id AND subject_id = NEW.subject_id;
    
    IF att_percent < 75 THEN
        INSERT INTO attendance_alerts (student_id, subject_id, attendance_percentage)
        VALUES (NEW.student_id, NEW.subject_id, att_percent)
        ON DUPLICATE KEY UPDATE attendance_percentage = att_percent, alert_date = NOW();
    END IF;
END //

DELIMITER ;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_marks_student_exam ON marks(student_id, exam_type);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, attendance_date);
CREATE INDEX idx_placements_batch ON placements(placement_date);
