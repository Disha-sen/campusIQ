// =====================================================
// Student Routes - Student Dashboard API
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { authenticateToken, authorize } = require('../middleware/auth');

// =====================================================
// GET /api/student/profile - Get Student Profile
// =====================================================
router.get('/profile', authenticateToken, authorize('student'), async (req, res) => {
    try {
        const studentInfo = await query(`
            SELECT 
                s.*,
                c.course_name,
                c.course_code,
                d.department_name
            FROM students s
            LEFT JOIN courses c ON s.course_id = c.course_id
            LEFT JOIN departments d ON c.department_id = d.department_id
            WHERE s.user_id = ?
        `, [req.user.userId]);
        
        if (studentInfo.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }
        
        res.json({
            success: true,
            data: studentInfo[0]
        });
        
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
});

// =====================================================
// GET /api/student/performance - Get Performance Summary
// =====================================================
router.get('/performance', authenticateToken, authorize('student'), async (req, res) => {
    try {
        // Get student ID
        const studentInfo = await query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [req.user.userId]
        );
        
        if (studentInfo.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        const studentId = studentInfo[0].student_id;
        
        // Overall performance
        const overall = await query(`
            SELECT 
                ROUND(AVG(marks_obtained), 2) as overall_average,
                MAX(marks_obtained) as highest_marks,
                MIN(marks_obtained) as lowest_marks,
                COUNT(DISTINCT subject_id) as subjects_count
            FROM marks
            WHERE student_id = ? AND exam_type = 'final'
        `, [studentId]);
        
        // Subject-wise performance
        const subjectWise = await query(`
            SELECT 
                sub.subject_id,
                sub.subject_code,
                sub.subject_name,
                sub.semester_number,
                m.exam_type,
                m.marks_obtained,
                m.max_marks,
                ROUND((m.marks_obtained / m.max_marks) * 100, 2) as percentage
            FROM marks m
            JOIN subjects sub ON m.subject_id = sub.subject_id
            WHERE m.student_id = ?
            ORDER BY sub.semester_number, sub.subject_name, m.exam_date
        `, [studentId]);
        
        // Semester-wise trend
        const semesterTrend = await query(`
            SELECT 
                sem.semester_number,
                sem.semester_name,
                ROUND(AVG(m.marks_obtained), 2) as average_marks,
                COUNT(DISTINCT m.subject_id) as subjects
            FROM marks m
            JOIN semesters sem ON m.semester_id = sem.semester_id
            WHERE m.student_id = ? AND m.exam_type = 'final'
            GROUP BY sem.semester_id, sem.semester_number, sem.semester_name
            ORDER BY sem.semester_number
        `, [studentId]);
        
        // Rank among peers (using student_rank instead of rank which is reserved in MySQL 8)
        const ranking = await query(`
            SELECT 
                COUNT(*) + 1 as student_rank
            FROM (
                SELECT student_id, AVG(marks_obtained) as avg
                FROM marks
                WHERE exam_type = 'final'
                GROUP BY student_id
            ) peers
            WHERE peers.avg > (
                SELECT AVG(marks_obtained)
                FROM marks
                WHERE student_id = ? AND exam_type = 'final'
            )
        `, [studentId]);
        
        res.json({
            success: true,
            data: {
                overall: overall[0],
                subjectWise,
                semesterTrend,
                rank: ranking[0].student_rank
            }
        });
        
    } catch (error) {
        console.error('Get performance error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch performance'
        });
    }
});

// =====================================================
// GET /api/student/attendance - Get Attendance Summary
// =====================================================
router.get('/attendance', authenticateToken, authorize('student'), async (req, res) => {
    try {
        // Get student ID
        const studentInfo = await query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [req.user.userId]
        );
        
        const studentId = studentInfo[0].student_id;
        
        // Overall attendance
        const overall = await query(`
            SELECT 
                COUNT(*) as total_classes,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as attended,
                ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as percentage
            FROM attendance
            WHERE student_id = ?
        `, [studentId]);
        
        // Subject-wise attendance
        const subjectWise = await query(`
            SELECT 
                sub.subject_id,
                sub.subject_code,
                sub.subject_name,
                COUNT(*) as total_classes,
                SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as attended,
                ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as percentage
            FROM attendance a
            JOIN subjects sub ON a.subject_id = sub.subject_id
            WHERE a.student_id = ?
            GROUP BY sub.subject_id, sub.subject_code, sub.subject_name
            ORDER BY percentage ASC
        `, [studentId]);
        
        // Monthly attendance trend
        const monthlyTrend = await query(`
            SELECT 
                DATE_FORMAT(attendance_date, '%Y-%m') as month,
                COUNT(*) as total,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as attended,
                ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as percentage
            FROM attendance
            WHERE student_id = ?
            GROUP BY DATE_FORMAT(attendance_date, '%Y-%m')
            ORDER BY month
        `, [studentId]);
        
        res.json({
            success: true,
            data: {
                overall: overall[0],
                subjectWise,
                monthlyTrend
            }
        });
        
    } catch (error) {
        console.error('Get attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch attendance'
        });
    }
});

// =====================================================
// GET /api/student/placement - Get Placement Status
// =====================================================
router.get('/placement', authenticateToken, authorize('student'), async (req, res) => {
    try {
        // Get student ID
        const studentInfo = await query(
            'SELECT student_id, current_semester FROM students WHERE user_id = ?',
            [req.user.userId]
        );
        
        const studentId = studentInfo[0].student_id;
        
        // Get placement offers
        const placements = await query(`
            SELECT *
            FROM placements
            WHERE student_id = ?
            ORDER BY placement_date DESC
        `, [studentId]);
        
        res.json({
            success: true,
            data: {
                currentSemester: studentInfo[0].current_semester,
                placements
            }
        });
        
    } catch (error) {
        console.error('Get placement error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch placement info'
        });
    }
});

// =====================================================
// POST /api/student/feedback - Submit Course Feedback
// =====================================================
router.post('/feedback', authenticateToken, authorize('student'), async (req, res) => {
    try {
        const { subjectId, semesterId, teachingQuality, courseContent, practicalKnowledge, overallRating, comments } = req.body;
        
        // Get student ID
        const studentInfo = await query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [req.user.userId]
        );
        
        const studentId = studentInfo[0].student_id;
        
        // Get faculty ID for the subject
        const subjectInfo = await query(
            'SELECT faculty_id FROM subjects WHERE subject_id = ?',
            [subjectId]
        );
        
        await query(`
            INSERT INTO feedback (student_id, subject_id, semester_id, faculty_id, teaching_quality, course_content, practical_knowledge, overall_rating, comments)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                teaching_quality = VALUES(teaching_quality),
                course_content = VALUES(course_content),
                practical_knowledge = VALUES(practical_knowledge),
                overall_rating = VALUES(overall_rating),
                comments = VALUES(comments)
        `, [studentId, subjectId, semesterId, subjectInfo[0]?.faculty_id, teachingQuality, courseContent, practicalKnowledge, overallRating, comments]);
        
        res.json({
            success: true,
            message: 'Feedback submitted successfully'
        });
        
    } catch (error) {
        console.error('Submit feedback error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback'
        });
    }
});

// =====================================================
// POST /api/student/setup-demo - Setup Demo Data for Student
// =====================================================
router.post('/setup-demo', authenticateToken, authorize('student'), async (req, res) => {
    try {
        // Get student info
        const studentInfo = await query(`
            SELECT s.*, c.course_id, c.course_name 
            FROM students s 
            LEFT JOIN courses c ON s.course_id = c.course_id 
            WHERE s.user_id = ?
        `, [req.user.userId]);
        
        if (studentInfo.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }
        
        const student = studentInfo[0];
        
        // Check if student already has data
        const existingMarks = await query(
            'SELECT COUNT(*) as count FROM marks WHERE student_id = ?',
            [student.student_id]
        );
        
        if (existingMarks[0].count > 0) {
            return res.json({
                success: true,
                message: 'You already have academic data'
            });
        }
        
        // Get subjects for this student's course and semester
        let subjects = await query(`
            SELECT subject_id FROM subjects 
            WHERE course_id = ? AND semester_number <= ?
        `, [student.course_id, student.current_semester || 1]);
        
        // If no subjects found, get any available subjects
        if (subjects.length === 0) {
            subjects = await query('SELECT subject_id FROM subjects LIMIT 5');
        }
        
        if (subjects.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No subjects available in the system'
            });
        }
        
        // Get semester ID
        let semesters = await query('SELECT semester_id FROM semesters LIMIT 1');
        let semesterId = semesters.length > 0 ? semesters[0].semester_id : 1;
        
        // Generate demo marks for each subject
        for (const sub of subjects) {
            // Generate random marks between 45-95
            const internalMarks = Math.floor(Math.random() * 30) + 15; // 15-45
            const midtermMarks = Math.floor(Math.random() * 35) + 40; // 40-75
            const finalMarks = Math.floor(Math.random() * 40) + 50; // 50-90
            
            // Insert marks
            await query(`
                INSERT INTO marks (student_id, subject_id, semester_id, exam_type, marks_obtained, max_marks, exam_date)
                VALUES (?, ?, ?, 'internal1', ?, 50, DATE_SUB(NOW(), INTERVAL 60 DAY))
                ON DUPLICATE KEY UPDATE marks_obtained = VALUES(marks_obtained)
            `, [student.student_id, sub.subject_id, semesterId, internalMarks]);
            
            await query(`
                INSERT INTO marks (student_id, subject_id, semester_id, exam_type, marks_obtained, max_marks, exam_date)
                VALUES (?, ?, ?, 'midterm', ?, 100, DATE_SUB(NOW(), INTERVAL 30 DAY))
                ON DUPLICATE KEY UPDATE marks_obtained = VALUES(marks_obtained)
            `, [student.student_id, sub.subject_id, semesterId, midtermMarks]);
            
            await query(`
                INSERT INTO marks (student_id, subject_id, semester_id, exam_type, marks_obtained, max_marks, exam_date)
                VALUES (?, ?, ?, 'final', ?, 100, NOW())
                ON DUPLICATE KEY UPDATE marks_obtained = VALUES(marks_obtained)
            `, [student.student_id, sub.subject_id, semesterId, finalMarks]);
            
            // Generate demo attendance (last 30 days)
            for (let i = 0; i < 20; i++) {
                const status = Math.random() > 0.2 ? 'present' : 'absent'; // 80% attendance
                const date = new Date();
                date.setDate(date.getDate() - i);
                
                await query(`
                    INSERT INTO attendance (student_id, subject_id, semester_id, attendance_date, status)
                    VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE status = VALUES(status)
                `, [student.student_id, sub.subject_id, semesterId, date.toISOString().split('T')[0], status]);
            }
        }
        
        res.json({
            success: true,
            message: 'Demo academic data created successfully!'
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
