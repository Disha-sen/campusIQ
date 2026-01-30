// =====================================================
// Faculty Routes - Faculty Dashboard API
// =====================================================

const express = require('express');
const router = express.Router();
const { query }  = require('../config/db');
const { authenticateToken, authorize } = require('../middleware/auth');

// =====================================================
// GET /api/faculty/classes - Get Faculty's Classes
// =====================================================
router.get('/classes', authenticateToken, authorize('faculty'), async (req, res) => {
    try {
        // Get faculty ID from user
        const facultyInfo = await query(
            'SELECT faculty_id FROM faculty WHERE user_id = ?',
            [req.user.userId]
        );
        
        if (facultyInfo.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Faculty profile not found'
            });
        }
        
        const facultyId = facultyInfo[0].faculty_id;
        
        // Get subjects taught by this faculty
        const subjects = await query(`
            SELECT 
                sub.*,
                c.course_name,
                (SELECT COUNT(DISTINCT student_id) FROM students WHERE course_id = sub.course_id AND current_semester = sub.semester_number) as student_count
            FROM subjects sub
            JOIN courses c ON sub.course_id = c.course_id
            WHERE sub.faculty_id = ?
            ORDER BY sub.semester_number, sub.subject_name
        `, [facultyId]);
        
        res.json({
            success: true,
            data: subjects
        });
        
    } catch (error) {
        console.error('Get classes error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch classes'
        });
    }
});

// =====================================================
// GET /api/faculty/students/:subjectId - Get Students for Subject
// =====================================================
router.get('/students/:subjectId', authenticateToken, authorize('faculty'), async (req, res) => {
    try {
        const { subjectId } = req.params;
        
        // Get subject info
        const subjectInfo = await query(
            'SELECT * FROM subjects WHERE subject_id = ?',
            [subjectId]
        );
        
        if (subjectInfo.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }
        
        const subject = subjectInfo[0];
        
        // Get students enrolled in this subject's course and semester
        const students = await query(`
            SELECT 
                s.*,
                COALESCE(att.attendance_percentage, 0) as attendance_percentage,
                COALESCE(mrk.average_marks, 0) as average_marks
            FROM students s
            LEFT JOIN (
                SELECT student_id, 
                       ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as attendance_percentage
                FROM attendance
                WHERE subject_id = ?
                GROUP BY student_id
            ) att ON s.student_id = att.student_id
            LEFT JOIN (
                SELECT student_id, ROUND(AVG(marks_obtained), 2) as average_marks
                FROM marks
                WHERE subject_id = ?
                GROUP BY student_id
            ) mrk ON s.student_id = mrk.student_id
            WHERE s.course_id = ? AND s.current_semester = ? AND s.is_active = TRUE
            ORDER BY s.enrollment_number
        `, [subjectId, subjectId, subject.course_id, subject.semester_number]);
        
        res.json({
            success: true,
            data: {
                subject: subject,
                students: students
            }
        });
        
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch students'
        });
    }
});

// =====================================================
// POST /api/faculty/attendance - Mark Attendance
// =====================================================
router.post('/attendance', authenticateToken, authorize('faculty'), async (req, res) => {
    try {
        const { subjectId, semesterId, date, attendance } = req.body;
        
        // Get faculty ID
        const facultyInfo = await query(
            'SELECT faculty_id FROM faculty WHERE user_id = ?',
            [req.user.userId]
        );
        
        const facultyId = facultyInfo[0].faculty_id;
        
        // Insert attendance records
        for (const record of attendance) {
            await query(`
                INSERT INTO attendance (student_id, subject_id, semester_id, attendance_date, status, marked_by)
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE status = VALUES(status), marked_by = VALUES(marked_by)
            `, [record.studentId, subjectId, semesterId, date, record.status, facultyId]);
        }
        
        res.json({
            success: true,
            message: 'Attendance marked successfully'
        });
        
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark attendance'
        });
    }
});

// =====================================================
// POST /api/faculty/marks - Enter Marks
// =====================================================
router.post('/marks', authenticateToken, authorize('faculty'), async (req, res) => {
    try {
        const { subjectId, semesterId, examType, maxMarks, marks } = req.body;
        
        // Get faculty ID
        const facultyInfo = await query(
            'SELECT faculty_id FROM faculty WHERE user_id = ?',
            [req.user.userId]
        );
        
        const facultyId = facultyInfo[0].faculty_id;
        
        // Insert marks records
        for (const record of marks) {
            await query(`
                INSERT INTO marks (student_id, subject_id, semester_id, exam_type, marks_obtained, max_marks, entered_by)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE marks_obtained = VALUES(marks_obtained), entered_by = VALUES(entered_by)
            `, [record.studentId, subjectId, semesterId, examType, record.marksObtained, maxMarks, facultyId]);
        }
        
        res.json({
            success: true,
            message: 'Marks entered successfully'
        });
        
    } catch (error) {
        console.error('Enter marks error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to enter marks'
        });
    }
});

// =====================================================
// GET /api/faculty/class-analytics/:subjectId - Class Analytics
// =====================================================
router.get('/class-analytics/:subjectId', authenticateToken, authorize('faculty'), async (req, res) => {
    try {
        const { subjectId } = req.params;
        
        // Average marks distribution
        const marksDistribution = await query(`
            SELECT 
                CASE 
                    WHEN marks_obtained >= 90 THEN 'A+ (90-100)'
                    WHEN marks_obtained >= 80 THEN 'A (80-89)'
                    WHEN marks_obtained >= 70 THEN 'B (70-79)'
                    WHEN marks_obtained >= 60 THEN 'C (60-69)'
                    WHEN marks_obtained >= 50 THEN 'D (50-59)'
                    WHEN marks_obtained >= 40 THEN 'E (40-49)'
                    ELSE 'F (Below 40)'
                END as grade,
                COUNT(*) as count
            FROM marks
            WHERE subject_id = ? AND exam_type = 'final'
            GROUP BY grade
            ORDER BY MIN(marks_obtained) DESC
        `, [subjectId]);
        
        // Attendance trend
        const attendanceTrend = await query(`
            SELECT 
                DATE_FORMAT(attendance_date, '%Y-%m-%d') as date,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent
            FROM attendance
            WHERE subject_id = ?
            GROUP BY attendance_date
            ORDER BY attendance_date
            LIMIT 30
        `, [subjectId]);
        
        // At-risk students in this class
        const atRiskStudents = await query(`
            SELECT 
                s.student_id,
                s.enrollment_number,
                CONCAT(s.first_name, ' ', s.last_name) as student_name,
                COALESCE(mrk.average_marks, 0) as average_marks,
                COALESCE(att.attendance, 0) as attendance_percentage
            FROM students s
            JOIN subjects sub ON s.course_id = sub.course_id AND s.current_semester = sub.semester_number
            LEFT JOIN (
                SELECT student_id, AVG(marks_obtained) as average_marks
                FROM marks WHERE subject_id = ?
                GROUP BY student_id
            ) mrk ON s.student_id = mrk.student_id
            LEFT JOIN (
                SELECT student_id, 
                       ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as attendance
                FROM attendance WHERE subject_id = ?
                GROUP BY student_id
            ) att ON s.student_id = att.student_id
            WHERE sub.subject_id = ? AND s.is_active = TRUE
              AND (COALESCE(mrk.average_marks, 0) < 45 OR COALESCE(att.attendance, 0) < 75)
            ORDER BY mrk.average_marks ASC
        `, [subjectId, subjectId, subjectId]);
        
        res.json({
            success: true,
            data: {
                marksDistribution,
                attendanceTrend,
                atRiskStudents
            }
        });
        
    } catch (error) {
        console.error('Class analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch class analytics'
        });
    }
});

// =====================================================
// POST /api/faculty/setup-demo - Setup Demo Data for Faculty
// =====================================================
router.post('/setup-demo', authenticateToken, authorize('faculty'), async (req, res) => {
    try {
        // Get faculty info
        const facultyInfo = await query(
            'SELECT f.*, u.email FROM faculty f JOIN users u ON f.user_id = u.user_id WHERE f.user_id = ?',
            [req.user.userId]
        );
        
        if (facultyInfo.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Faculty profile not found'
            });
        }
        
        const faculty = facultyInfo[0];
        
        // Check if faculty already has subjects
        const existingSubjects = await query(
            'SELECT COUNT(*) as count FROM subjects WHERE faculty_id = ?',
            [faculty.faculty_id]
        );
        
        if (existingSubjects[0].count > 0) {
            return res.json({
                success: true,
                message: 'You already have subjects assigned'
            });
        }
        
        // Assign 2-3 available subjects to this faculty
        // First, get subjects without faculty assigned
        const availableSubjects = await query(`
            SELECT subject_id, course_id, semester_number 
            FROM subjects 
            WHERE faculty_id IS NULL 
            LIMIT 3
        `);
        
        if (availableSubjects.length === 0) {
            // If all subjects are assigned, create new subjects for this faculty
            // Get a course for BCA
            const courses = await query('SELECT course_id FROM courses LIMIT 1');
            if (courses.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No courses found in the system'
                });
            }
            
            const courseId = courses[0].course_id;
            
            // Create demo subjects
            const demoSubjects = [
                { code: 'DEMO101', name: 'Introduction to Programming', credits: 4, semester: 1 },
                { code: 'DEMO102', name: 'Database Management', credits: 4, semester: 2 },
                { code: 'DEMO103', name: 'Web Development', credits: 4, semester: 3 }
            ];
            
            for (const sub of demoSubjects) {
                await query(`
                    INSERT INTO subjects (subject_code, subject_name, credits, course_id, semester_number, faculty_id)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [sub.code, sub.name, sub.credits, courseId, sub.semester, faculty.faculty_id]);
            }
        } else {
            // Assign existing unassigned subjects
            for (const sub of availableSubjects) {
                await query(
                    'UPDATE subjects SET faculty_id = ? WHERE subject_id = ?',
                    [faculty.faculty_id, sub.subject_id]
                );
            }
        }
        
        // Create demo students if none exist
        const studentCount = await query('SELECT COUNT(*) as count FROM students');
        
        if (studentCount[0].count === 0) {
            // Get courses to assign students
            const courses = await query('SELECT course_id FROM courses LIMIT 1');
            if (courses.length > 0) {
                const courseId = courses[0].course_id;
                const demoStudents = [
                    { enrollment: 'STU2024001', first: 'Rahul', last: 'Sharma', email: 'rahul@demo.edu' },
                    { enrollment: 'STU2024002', first: 'Priya', last: 'Patel', email: 'priya@demo.edu' },
                    { enrollment: 'STU2024003', first: 'Amit', last: 'Kumar', email: 'amit@demo.edu' },
                    { enrollment: 'STU2024004', first: 'Sneha', last: 'Singh', email: 'sneha@demo.edu' },
                    { enrollment: 'STU2024005', first: 'Vikram', last: 'Reddy', email: 'vikram@demo.edu' }
                ];
                
                for (const stu of demoStudents) {
                    // Create user
                    const crypto = require('crypto');
                    const passHash = crypto.createHash('sha256').update('demo123').digest('hex');
                    
                    const userResult = await query(`
                        INSERT INTO users (username, email, password_hash, role)
                        VALUES (?, ?, ?, 'student')
                        ON DUPLICATE KEY UPDATE user_id = LAST_INSERT_ID(user_id)
                    `, [stu.email.split('@')[0], stu.email, passHash]);
                    
                    const userId = userResult.insertId;
                    
                    // Create student
                    await query(`
                        INSERT INTO students (enrollment_number, first_name, last_name, email, course_id, current_semester, batch, admission_year, user_id)
                        VALUES (?, ?, ?, ?, ?, 1, '2024', 2024, ?)
                        ON DUPLICATE KEY UPDATE student_id = student_id
                    `, [stu.enrollment, stu.first, stu.last, stu.email, courseId, userId]);
                }
            }
        }
        
        res.json({
            success: true,
            message: 'Demo data setup successful! You can now view your classes.'
        });
        
    } catch (error) {
        console.error('Setup demo error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to setup demo data: ' + error.message
        });
    }
});

module.exports = router;
