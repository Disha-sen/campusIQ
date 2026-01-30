// =====================================================
// Analytics Routes - Core Analytics API
// =====================================================

const express = require('express');
const router = express.Router();
const { query, pool } = require('../config/db');
const { authenticateToken, authorize } = require('../middleware/auth');

// =====================================================
// GET /api/analytics/dashboard - Dashboard Summary
// =====================================================
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const role = req.user.role;
        let dashboardData = {};
        
        if (role === 'admin') {
            // Total counts
            const [students] = await pool.execute('SELECT COUNT(*) as count FROM students WHERE is_active = TRUE');
            const [faculty] = await pool.execute('SELECT COUNT(*) as count FROM faculty WHERE is_active = TRUE');
            const [courses] = await pool.execute('SELECT COUNT(*) as count FROM courses');
            const [placements] = await pool.execute("SELECT COUNT(DISTINCT student_id) as count FROM placements WHERE placement_status = 'accepted'");
            
            // At-risk students count
            const atRisk = await query(`
                SELECT COUNT(*) as count FROM (
                    SELECT s.student_id
                    FROM students s
                    LEFT JOIN (SELECT student_id, AVG(marks_obtained) as avg_marks FROM marks GROUP BY student_id) m ON s.student_id = m.student_id
                    LEFT JOIN (SELECT student_id, ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as att FROM attendance GROUP BY student_id) a ON s.student_id = a.student_id
                    WHERE s.is_active = TRUE AND (COALESCE(m.avg_marks, 0) < 45 OR COALESCE(a.att, 0) < 75)
                ) as risk_students
            `);
            
            dashboardData = {
                totalStudents: students[0].count,
                totalFaculty: faculty[0].count,
                totalCourses: courses[0].count,
                placedStudents: placements[0].count,
                atRiskStudents: atRisk[0].count
            };
        }
        
        res.json({
            success: true,
            data: dashboardData
        });
        
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load dashboard data'
        });
    }
});

// =====================================================
// GET /api/analytics/academic - Academic Analytics
// =====================================================
router.get('/academic', authenticateToken, async (req, res) => {
    try {
        const { courseId, semesterId, subjectId } = req.query;
        
        // Average marks per subject
        let subjectMarksQuery = `
            SELECT 
                sub.subject_id,
                sub.subject_code,
                sub.subject_name,
                ROUND(AVG(m.marks_obtained), 2) as average_marks,
                COUNT(DISTINCT m.student_id) as total_students,
                ROUND((SUM(CASE WHEN m.marks_obtained >= sub.passing_marks THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as pass_percentage
            FROM subjects sub
            LEFT JOIN marks m ON sub.subject_id = m.subject_id AND m.exam_type = 'final'
            WHERE 1=1
        `;
        
        const params = [];
        if (courseId) {
            subjectMarksQuery += ' AND sub.course_id = ?';
            params.push(courseId);
        }
        
        subjectMarksQuery += ' GROUP BY sub.subject_id, sub.subject_code, sub.subject_name, sub.passing_marks ORDER BY average_marks DESC';
        
        const subjectMarks = await query(subjectMarksQuery, params);
        
        // Top performers
        const topPerformers = await query(`
            SELECT 
                s.student_id,
                s.enrollment_number,
                CONCAT(s.first_name, ' ', s.last_name) as student_name,
                c.course_name,
                s.current_semester,
                ROUND(AVG(m.marks_obtained), 2) as average_marks
            FROM students s
            JOIN courses c ON s.course_id = c.course_id
            JOIN marks m ON s.student_id = m.student_id
            WHERE s.is_active = TRUE AND m.exam_type = 'final'
            GROUP BY s.student_id
            ORDER BY average_marks DESC
            LIMIT 10
        `);
        
        // Semester-wise performance trend
        const semesterTrend = await query(`
            SELECT 
                sem.semester_number,
                sem.semester_name,
                ROUND(AVG(m.marks_obtained), 2) as average_marks,
                COUNT(DISTINCT m.student_id) as students_count
            FROM semesters sem
            JOIN marks m ON sem.semester_id = m.semester_id
            WHERE m.exam_type = 'final'
            GROUP BY sem.semester_id, sem.semester_number, sem.semester_name
            ORDER BY sem.semester_number
        `);
        
        // Pass/fail distribution
        const passFailStats = await query(`
            SELECT 
                sub.subject_name,
                SUM(CASE WHEN m.marks_obtained >= sub.passing_marks THEN 1 ELSE 0 END) as passed,
                SUM(CASE WHEN m.marks_obtained < sub.passing_marks THEN 1 ELSE 0 END) as failed
            FROM marks m
            JOIN subjects sub ON m.subject_id = sub.subject_id
            WHERE m.exam_type = 'final'
            GROUP BY sub.subject_id, sub.subject_name
        `);
        
        res.json({
            success: true,
            data: {
                subjectMarks,
                topPerformers,
                semesterTrend,
                passFailStats
            }
        });
        
    } catch (error) {
        console.error('Academic analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load academic analytics'
        });
    }
});

// =====================================================
// GET /api/analytics/attendance - Attendance Analytics
// =====================================================
router.get('/attendance', authenticateToken, async (req, res) => {
    try {
        const { subjectId, studentId } = req.query;
        
        // Overall attendance summary
        const attendanceSummary = await query(`
            SELECT 
                s.student_id,
                CONCAT(s.first_name, ' ', s.last_name) as student_name,
                s.enrollment_number,
                COUNT(a.attendance_id) as total_classes,
                SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as attended,
                ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as percentage
            FROM students s
            JOIN attendance a ON s.student_id = a.student_id
            WHERE s.is_active = TRUE
            GROUP BY s.student_id, s.first_name, s.last_name, s.enrollment_number
            ORDER BY percentage DESC
        `);
        
        // Low attendance alerts (below 75%)
        const lowAttendance = await query(`
            SELECT 
                s.student_id,
                CONCAT(s.first_name, ' ', s.last_name) as student_name,
                s.email,
                sub.subject_name,
                ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as percentage
            FROM students s
            JOIN attendance a ON s.student_id = a.student_id
            JOIN subjects sub ON a.subject_id = sub.subject_id
            WHERE s.is_active = TRUE
            GROUP BY s.student_id, s.first_name, s.last_name, s.email, sub.subject_id, sub.subject_name
            HAVING percentage < 75
            ORDER BY percentage ASC
        `);
        
        // Attendance vs Marks correlation
        const correlation = await query(`
            SELECT 
                s.student_id,
                CONCAT(s.first_name, ' ', s.last_name) as student_name,
                ROUND((SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) / COUNT(DISTINCT a.attendance_id)) * 100, 2) as attendance_percentage,
                ROUND(AVG(m.marks_obtained), 2) as average_marks
            FROM students s
            LEFT JOIN attendance a ON s.student_id = a.student_id
            LEFT JOIN marks m ON s.student_id = m.student_id AND m.exam_type = 'final'
            WHERE s.is_active = TRUE
            GROUP BY s.student_id, s.first_name, s.last_name
            HAVING attendance_percentage IS NOT NULL AND average_marks IS NOT NULL
            ORDER BY attendance_percentage DESC
        `);
        
        // Subject-wise attendance distribution
        const subjectAttendance = await query(`
            SELECT 
                sub.subject_name,
                COUNT(DISTINCT a.student_id) as total_students,
                ROUND(AVG(CASE WHEN a.status = 'present' THEN 100 ELSE 0 END), 2) as avg_attendance
            FROM subjects sub
            JOIN attendance a ON sub.subject_id = a.subject_id
            GROUP BY sub.subject_id, sub.subject_name
            ORDER BY avg_attendance DESC
        `);
        
        res.json({
            success: true,
            data: {
                attendanceSummary,
                lowAttendance,
                correlation,
                subjectAttendance
            }
        });
        
    } catch (error) {
        console.error('Attendance analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load attendance analytics'
        });
    }
});

// =====================================================
// GET /api/analytics/risk - At-Risk Students
// =====================================================
router.get('/risk', authenticateToken, async (req, res) => {
    try {
        const { riskLevel } = req.query;
        
        let riskQuery = `
            SELECT 
                s.student_id,
                s.enrollment_number,
                CONCAT(s.first_name, ' ', s.last_name) as student_name,
                s.email,
                s.phone,
                c.course_name,
                s.current_semester,
                s.guardian_name,
                s.guardian_phone,
                COALESCE(perf.average_marks, 0) as average_marks,
                COALESCE(att.attendance, 0) as attendance_percentage,
                CASE 
                    WHEN COALESCE(perf.average_marks, 0) < 35 AND COALESCE(att.attendance, 0) < 60 THEN 'High'
                    WHEN COALESCE(perf.average_marks, 0) < 45 OR COALESCE(att.attendance, 0) < 75 THEN 'Medium'
                    ELSE 'Low'
                END as risk_level
            FROM students s
            LEFT JOIN courses c ON s.course_id = c.course_id
            LEFT JOIN (
                SELECT student_id, ROUND(AVG(marks_obtained), 2) as average_marks
                FROM marks WHERE exam_type = 'final'
                GROUP BY student_id
            ) perf ON s.student_id = perf.student_id
            LEFT JOIN (
                SELECT student_id, 
                       ROUND((SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as attendance
                FROM attendance GROUP BY student_id
            ) att ON s.student_id = att.student_id
            WHERE s.is_active = TRUE
            HAVING risk_level IN ('High', 'Medium')
        `;
        
        if (riskLevel) {
            riskQuery += ` AND risk_level = '${riskLevel}'`;
        }
        
        riskQuery += ' ORDER BY FIELD(risk_level, "High", "Medium", "Low"), average_marks ASC';
        
        const atRiskStudents = await query(riskQuery);
        
        // Risk distribution summary
        const riskSummary = await query(`
            SELECT 
                CASE 
                    WHEN COALESCE(perf.average_marks, 0) < 35 AND COALESCE(att.attendance, 0) < 60 THEN 'High'
                    WHEN COALESCE(perf.average_marks, 0) < 45 OR COALESCE(att.attendance, 0) < 75 THEN 'Medium'
                    ELSE 'Low'
                END as risk_level,
                COUNT(*) as count
            FROM students s
            LEFT JOIN (
                SELECT student_id, AVG(marks_obtained) as average_marks
                FROM marks WHERE exam_type = 'final'
                GROUP BY student_id
            ) perf ON s.student_id = perf.student_id
            LEFT JOIN (
                SELECT student_id, 
                       (SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) / COUNT(*)) * 100 as attendance
                FROM attendance GROUP BY student_id
            ) att ON s.student_id = att.student_id
            WHERE s.is_active = TRUE
            GROUP BY risk_level
        `);
        
        res.json({
            success: true,
            data: {
                atRiskStudents,
                riskSummary
            }
        });
        
    } catch (error) {
        console.error('Risk analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load risk analytics'
        });
    }
});

// =====================================================
// GET /api/analytics/placement - Placement Analytics
// =====================================================
router.get('/placement', authenticateToken, async (req, res) => {
    try {
        const { batch, courseId } = req.query;
        
        // Overall placement stats
        let placementQuery = `
            SELECT 
                COUNT(DISTINCT s.student_id) as total_students,
                COUNT(DISTINCT CASE WHEN p.placement_status = 'accepted' THEN s.student_id END) as placed_students,
                ROUND((COUNT(DISTINCT CASE WHEN p.placement_status = 'accepted' THEN s.student_id END) / COUNT(DISTINCT s.student_id)) * 100, 2) as placement_percentage,
                ROUND(AVG(CASE WHEN p.placement_status = 'accepted' THEN p.package_lpa END), 2) as average_package,
                MAX(CASE WHEN p.placement_status = 'accepted' THEN p.package_lpa END) as highest_package,
                MIN(CASE WHEN p.placement_status = 'accepted' AND p.package_lpa > 0 THEN p.package_lpa END) as lowest_package
            FROM students s
            LEFT JOIN placements p ON s.student_id = p.student_id
            WHERE s.is_active = TRUE AND s.current_semester >= 7
        `;
        
        if (batch) placementQuery += ` AND s.batch = '${batch}'`;
        if (courseId) placementQuery += ` AND s.course_id = ${courseId}`;
        
        const overallStats = await query(placementQuery);
        
        // Company-wise placements
        const companyWise = await query(`
            SELECT 
                p.company_name,
                COUNT(*) as students_placed,
                ROUND(AVG(p.package_lpa), 2) as avg_package,
                MAX(p.package_lpa) as max_package,
                GROUP_CONCAT(DISTINCT p.job_role SEPARATOR ', ') as roles
            FROM placements p
            JOIN students s ON p.student_id = s.student_id
            WHERE p.placement_status = 'accepted' AND p.is_internship = FALSE
            GROUP BY p.company_name
            ORDER BY students_placed DESC
            LIMIT 15
        `);
        
        // Package distribution
        const packageDistribution = await query(`
            SELECT 
                CASE 
                    WHEN p.package_lpa < 5 THEN '0-5 LPA'
                    WHEN p.package_lpa BETWEEN 5 AND 10 THEN '5-10 LPA'
                    WHEN p.package_lpa BETWEEN 10 AND 15 THEN '10-15 LPA'
                    WHEN p.package_lpa BETWEEN 15 AND 25 THEN '15-25 LPA'
                    ELSE '25+ LPA'
                END as package_range,
                COUNT(*) as count
            FROM placements p
            WHERE p.placement_status = 'accepted' AND p.is_internship = FALSE AND p.package_lpa > 0
            GROUP BY package_range
            ORDER BY MIN(p.package_lpa)
        `);
        
        // Batch-wise placement trends
        const batchTrend = await query(`
            SELECT 
                s.batch,
                COUNT(DISTINCT s.student_id) as total,
                COUNT(DISTINCT CASE WHEN p.placement_status = 'accepted' THEN s.student_id END) as placed,
                ROUND(AVG(CASE WHEN p.placement_status = 'accepted' THEN p.package_lpa END), 2) as avg_package
            FROM students s
            LEFT JOIN placements p ON s.student_id = p.student_id
            WHERE s.is_active = TRUE AND s.current_semester >= 7
            GROUP BY s.batch
            ORDER BY s.batch DESC
        `);
        
        res.json({
            success: true,
            data: {
                overallStats: overallStats[0],
                companyWise,
                packageDistribution,
                batchTrend
            }
        });
        
    } catch (error) {
        console.error('Placement analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load placement analytics'
        });
    }
});

// =====================================================
// GET /api/analytics/subject-difficulty - Subject Analysis
// =====================================================
router.get('/subject-difficulty', authenticateToken, async (req, res) => {
    try {
        const difficulty = await query(`
            SELECT 
                sub.subject_id,
                sub.subject_code,
                sub.subject_name,
                sub.semester_number,
                ROUND(AVG(m.marks_obtained), 2) as average_marks,
                ROUND(STDDEV(m.marks_obtained), 2) as std_deviation,
                ROUND((SUM(CASE WHEN m.marks_obtained < sub.passing_marks THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as fail_rate,
                COUNT(DISTINCT m.student_id) as students_attempted,
                CASE 
                    WHEN AVG(m.marks_obtained) < 45 THEN 'Hard'
                    WHEN AVG(m.marks_obtained) < 60 THEN 'Medium'
                    ELSE 'Easy'
                END as difficulty_level
            FROM subjects sub
            JOIN marks m ON sub.subject_id = m.subject_id
            WHERE m.exam_type = 'final'
            GROUP BY sub.subject_id, sub.subject_code, sub.subject_name, sub.semester_number, sub.passing_marks
            ORDER BY fail_rate DESC
        `);
        
        res.json({
            success: true,
            data: difficulty
        });
        
    } catch (error) {
        console.error('Subject difficulty error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to load subject difficulty analysis'
        });
    }
});

module.exports = router;
