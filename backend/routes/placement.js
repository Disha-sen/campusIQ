// =====================================================
// Placement Routes - Placement Officer Dashboard API
// =====================================================

const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { authenticateToken, authorize } = require('../middleware/auth');

// GET /api/placement/stats
router.get('/stats', authenticateToken, authorize('placement_officer', 'admin'), async (req, res) => {
    try {
        const overall = await query(`
            SELECT 
                COUNT(DISTINCT s.student_id) as total_eligible,
                COUNT(DISTINCT CASE WHEN p.placement_status = 'accepted' THEN s.student_id END) as placed,
                ROUND(AVG(CASE WHEN p.placement_status = 'accepted' THEN p.package_lpa END), 2) as average_package,
                MAX(CASE WHEN p.placement_status = 'accepted' THEN p.package_lpa END) as highest_package
            FROM students s
            LEFT JOIN placements p ON s.student_id = p.student_id AND p.is_internship = FALSE
            WHERE s.current_semester >= 7 AND s.is_active = TRUE
        `);
        res.json({ success: true, data: overall[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
});

// GET /api/placement/companies
router.get('/companies', authenticateToken, authorize('placement_officer', 'admin'), async (req, res) => {
    try {
        const companies = await query(`
            SELECT company_name, COUNT(*) as total_offers,
                   ROUND(AVG(package_lpa), 2) as avg_package,
                   MAX(package_lpa) as max_package
            FROM placements WHERE is_internship = FALSE
            GROUP BY company_name ORDER BY total_offers DESC
        `);
        res.json({ success: true, data: companies });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch companies' });
    }
});

// GET /api/placement/students
router.get('/students', authenticateToken, authorize('placement_officer', 'admin'), async (req, res) => {
    try {
        const students = await query(`
            SELECT s.student_id, s.enrollment_number,
                   CONCAT(s.first_name, ' ', s.last_name) as student_name,
                   c.course_name, p.company_name, p.job_role, p.package_lpa, p.placement_status
            FROM students s
            LEFT JOIN courses c ON s.course_id = c.course_id
            LEFT JOIN placements p ON s.student_id = p.student_id
            WHERE s.current_semester >= 7 ORDER BY p.package_lpa DESC
        `);
        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch students' });
    }
});

// POST /api/placement/add
router.post('/add', authenticateToken, authorize('placement_officer', 'admin'), async (req, res) => {
    try {
        const { studentId, companyName, jobRole, packageLpa, placementDate, location } = req.body;
        const result = await query(`
            INSERT INTO placements (student_id, company_name, job_role, package_lpa, placement_date, location, placement_status)
            VALUES (?, ?, ?, ?, ?, ?, 'offered')
        `, [studentId, companyName, jobRole, packageLpa, placementDate, location]);
        res.status(201).json({ success: true, data: { placementId: result.insertId } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add placement' });
    }
});

// GET /api/placement/package-analysis
router.get('/package-analysis', authenticateToken, authorize('placement_officer', 'admin'), async (req, res) => {
    try {
        const distribution = await query(`
            SELECT 
                CASE WHEN package_lpa < 5 THEN '0-5 LPA'
                     WHEN package_lpa < 10 THEN '5-10 LPA'
                     WHEN package_lpa < 15 THEN '10-15 LPA'
                     ELSE '15+ LPA' END as range_label,
                COUNT(*) as count
            FROM placements WHERE placement_status = 'accepted'
            GROUP BY range_label ORDER BY MIN(package_lpa)
        `);
        res.json({ success: true, data: { distribution } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch analysis' });
    }
});

module.exports = router;
