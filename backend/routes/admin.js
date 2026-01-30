// =====================================================
// Admin Routes - Admin Management API
// =====================================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { query, transaction } = require('../config/db');
const { authenticateToken, authorize } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.xml', '.csv', '.xlsx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only XML, CSV, and Excel files are allowed'));
        }
    }
});

// =====================================================
// GET /api/admin/students - Get All Students
// =====================================================
router.get('/students', authenticateToken, authorize('admin', 'faculty'), async (req, res) => {
    try {
        const { courseId, semester, batch, search } = req.query;
        
        let queryStr = `
            SELECT 
                s.*,
                c.course_name,
                c.course_code
            FROM students s
            LEFT JOIN courses c ON s.course_id = c.course_id
            WHERE s.is_active = TRUE
        `;
        
        const params = [];
        
        if (courseId) {
            queryStr += ' AND s.course_id = ?';
            params.push(courseId);
        }
        if (semester) {
            queryStr += ' AND s.current_semester = ?';
            params.push(semester);
        }
        if (batch) {
            queryStr += ' AND s.batch = ?';
            params.push(batch);
        }
        if (search) {
            queryStr += ' AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.enrollment_number LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        
        queryStr += ' ORDER BY s.enrollment_number';
        
        const students = await query(queryStr, params);
        
        res.json({
            success: true,
            data: students,
            count: students.length
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
// POST /api/admin/students - Add New Student
// =====================================================
router.post('/students', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const {
            enrollmentNumber, firstName, lastName, email, phone,
            dateOfBirth, gender, courseId, currentSemester,
            admissionYear, batch, guardianName, guardianPhone
        } = req.body;
        
        // Check if enrollment number already exists
        const existing = await query(
            'SELECT student_id FROM students WHERE enrollment_number = ?',
            [enrollmentNumber]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Enrollment number already exists'
            });
        }
        
        const result = await query(`
            INSERT INTO students (
                enrollment_number, first_name, last_name, email, phone,
                date_of_birth, gender, course_id, current_semester,
                admission_year, batch, guardian_name, guardian_phone
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            enrollmentNumber, firstName, lastName, email, phone,
            dateOfBirth, gender, courseId, currentSemester,
            admissionYear, batch, guardianName, guardianPhone
        ]);
        
        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            data: { studentId: result.insertId }
        });
        
    } catch (error) {
        console.error('Add student error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add student'
        });
    }
});

// =====================================================
// PUT /api/admin/students/:id - Update Student
// =====================================================
router.put('/students/:id', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Build dynamic update query
        const fields = [];
        const values = [];
        
        const allowedFields = [
            'first_name', 'last_name', 'email', 'phone', 'date_of_birth',
            'gender', 'course_id', 'current_semester', 'batch',
            'guardian_name', 'guardian_phone', 'is_active'
        ];
        
        Object.keys(updates).forEach(key => {
            const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            if (allowedFields.includes(snakeKey)) {
                fields.push(`${snakeKey} = ?`);
                values.push(updates[key]);
            }
        });
        
        if (fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }
        
        values.push(id);
        
        await query(
            `UPDATE students SET ${fields.join(', ')} WHERE student_id = ?`,
            values
        );
        
        res.json({
            success: true,
            message: 'Student updated successfully'
        });
        
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update student'
        });
    }
});

// =====================================================
// DELETE /api/admin/students/:id - Delete Student
// =====================================================
router.delete('/students/:id', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        
        // Soft delete
        await query(
            'UPDATE students SET is_active = FALSE WHERE student_id = ?',
            [id]
        );
        
        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete student'
        });
    }
});

// =====================================================
// GET /api/admin/faculty - Get All Faculty
// =====================================================
router.get('/faculty', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const faculty = await query(`
            SELECT 
                f.*,
                d.department_name
            FROM faculty f
            LEFT JOIN departments d ON f.department_id = d.department_id
            WHERE f.is_active = TRUE
            ORDER BY f.first_name
        `);
        
        res.json({
            success: true,
            data: faculty
        });
        
    } catch (error) {
        console.error('Get faculty error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch faculty'
        });
    }
});

// =====================================================
// GET /api/admin/courses - Get All Courses
// =====================================================
router.get('/courses', authenticateToken, async (req, res) => {
    try {
        const courses = await query(`
            SELECT 
                c.*,
                d.department_name,
                (SELECT COUNT(*) FROM students WHERE course_id = c.course_id AND is_active = TRUE) as student_count
            FROM courses c
            LEFT JOIN departments d ON c.department_id = d.department_id
            ORDER BY c.course_name
        `);
        
        res.json({
            success: true,
            data: courses
        });
        
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses'
        });
    }
});

// =====================================================
// GET /api/admin/subjects - Get All Subjects
// =====================================================
router.get('/subjects', authenticateToken, async (req, res) => {
    try {
        const { courseId, semester } = req.query;
        
        let queryStr = `
            SELECT 
                sub.*,
                c.course_name,
                CONCAT(f.first_name, ' ', f.last_name) as faculty_name
            FROM subjects sub
            LEFT JOIN courses c ON sub.course_id = c.course_id
            LEFT JOIN faculty f ON sub.faculty_id = f.faculty_id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (courseId) {
            queryStr += ' AND sub.course_id = ?';
            params.push(courseId);
        }
        if (semester) {
            queryStr += ' AND sub.semester_number = ?';
            params.push(semester);
        }
        
        queryStr += ' ORDER BY sub.semester_number, sub.subject_name';
        
        const subjects = await query(queryStr, params);
        
        res.json({
            success: true,
            data: subjects
        });
        
    } catch (error) {
        console.error('Get subjects error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subjects'
        });
    }
});

// =====================================================
// GET /api/admin/departments - Get All Departments
// =====================================================
router.get('/departments', authenticateToken, async (req, res) => {
    try {
        const departments = await query('SELECT * FROM departments ORDER BY department_name');
        
        res.json({
            success: true,
            data: departments
        });
        
    } catch (error) {
        console.error('Get departments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch departments'
        });
    }
});

// =====================================================
// GET /api/admin/semesters - Get All Semesters
// =====================================================
router.get('/semesters', authenticateToken, async (req, res) => {
    try {
        const semesters = await query('SELECT * FROM semesters ORDER BY semester_number');
        
        res.json({
            success: true,
            data: semesters
        });
        
    } catch (error) {
        console.error('Get semesters error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch semesters'
        });
    }
});

// =====================================================
// GET /api/admin/faculty - Get All Faculty
// =====================================================
router.get('/faculty', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const faculty = await query(`
            SELECT 
                f.*,
                d.department_name,
                u.email as user_email,
                (SELECT COUNT(*) FROM subjects WHERE faculty_id = f.faculty_id) as subjects_count
            FROM faculty f
            LEFT JOIN departments d ON f.department_id = d.department_id
            LEFT JOIN users u ON f.user_id = u.user_id
            WHERE f.is_active = TRUE
            ORDER BY f.first_name, f.last_name
        `);
        
        res.json({
            success: true,
            data: faculty
        });
    } catch (error) {
        console.error('Get faculty error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch faculty' });
    }
});

// =====================================================
// GET /api/admin/subjects - Get All Subjects
// =====================================================
router.get('/subjects', authenticateToken, async (req, res) => {
    try {
        const subjects = await query(`
            SELECT 
                s.*,
                c.course_name,
                CONCAT(f.first_name, ' ', f.last_name) as faculty_name
            FROM subjects s
            LEFT JOIN courses c ON s.course_id = c.course_id
            LEFT JOIN faculty f ON s.faculty_id = f.faculty_id
            ORDER BY c.course_name, s.semester_number, s.subject_name
        `);
        
        res.json({
            success: true,
            data: subjects
        });
    } catch (error) {
        console.error('Get subjects error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch subjects' });
    }
});

// =====================================================
// POST /api/admin/assign-subject - Assign Subject to Faculty
// =====================================================
router.post('/assign-subject', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const { facultyId, subjectId } = req.body;
        
        await query(
            'UPDATE subjects SET faculty_id = ? WHERE subject_id = ?',
            [facultyId, subjectId]
        );
        
        res.json({
            success: true,
            message: 'Subject assigned successfully'
        });
    } catch (error) {
        console.error('Assign subject error:', error);
        res.status(500).json({ success: false, message: 'Failed to assign subject' });
    }
});

// =====================================================
// POST /api/admin/subjects - Create New Subject
// =====================================================
router.post('/subjects', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const { subjectCode, subjectName, credits, courseId, semesterNumber, facultyId } = req.body;
        
        const result = await query(`
            INSERT INTO subjects (subject_code, subject_name, credits, course_id, semester_number, faculty_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [subjectCode, subjectName, credits, courseId, semesterNumber, facultyId || null]);
        
        res.json({
            success: true,
            message: 'Subject created successfully',
            data: { subjectId: result.insertId }
        });
    } catch (error) {
        console.error('Create subject error:', error);
        res.status(500).json({ success: false, message: 'Failed to create subject' });
    }
});

// =====================================================
// GET /api/admin/dashboard-stats - Admin Dashboard Statistics
// =====================================================
router.get('/dashboard-stats', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const [studentCount] = await query('SELECT COUNT(*) as count FROM students WHERE is_active = TRUE');
        const [facultyCount] = await query('SELECT COUNT(*) as count FROM faculty WHERE is_active = TRUE');
        const [courseCount] = await query('SELECT COUNT(*) as count FROM courses');
        const [subjectCount] = await query('SELECT COUNT(*) as count FROM subjects');
        
        const recentStudents = await query(`
            SELECT s.*, c.course_name 
            FROM students s 
            LEFT JOIN courses c ON s.course_id = c.course_id 
            ORDER BY s.created_at DESC LIMIT 5
        `);
        
        const recentFaculty = await query(`
            SELECT f.*, d.department_name 
            FROM faculty f 
            LEFT JOIN departments d ON f.department_id = d.department_id 
            ORDER BY f.created_at DESC LIMIT 5
        `);
        
        res.json({
            success: true,
            data: {
                counts: {
                    students: studentCount.count,
                    faculty: facultyCount.count,
                    courses: courseCount.count,
                    subjects: subjectCount.count
                },
                recentStudents,
                recentFaculty
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
});

// =====================================================
// POST /api/admin/upload - Upload Data File
// =====================================================
router.post('/upload', authenticateToken, authorize('admin'), upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        
        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size
            }
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload file'
        });
    }
});

module.exports = router;
