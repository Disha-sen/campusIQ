// =====================================================
// XML Routes - XML Import/Export with XSD Validation
// =====================================================

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');
const { query } = require('../config/db');
const { authenticateToken, authorize } = require('../middleware/auth');

// Configure multer for XML uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/xml');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() === '.xml') {
            cb(null, true);
        } else {
            cb(new Error('Only XML files are allowed'));
        }
    }
});

// XSD Validation Function
const validateXML = (xmlContent, schemaType) => {
    const schemas = {
        student: {
            requiredFields: ['StudentID', 'Name', 'Email'],
            optionalFields: ['Phone', 'Semester', 'Branch', 'DateOfBirth']
        },
        report: {
            requiredFields: ['StudentID', 'Name', 'Attendance', 'AverageMarks'],
            optionalFields: ['RiskLevel', 'Semester']
        }
    };

    const schema = schemas[schemaType];
    if (!schema) return { valid: false, errors: ['Unknown schema type'] };

    const errors = [];
    schema.requiredFields.forEach(field => {
        if (!xmlContent[field]) {
            errors.push(`Missing required field: ${field}`);
        }
    });

    return { valid: errors.length === 0, errors };
};

// POST /api/xml/import/students - Import Students from XML
router.post('/import/students', authenticateToken, authorize('admin'), upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const xmlContent = fs.readFileSync(req.file.path, 'utf-8');
        const parser = new xml2js.Parser({ explicitArray: false });
        
        const result = await parser.parseStringPromise(xmlContent);
        
        let students = result.StudentData?.Student || result.Students?.Student;
        if (!students) {
            return res.status(400).json({ success: false, message: 'Invalid XML structure' });
        }

        if (!Array.isArray(students)) students = [students];

        const imported = [];
        const errors = [];

        for (const student of students) {
            const validation = validateXML(student, 'student');
            if (!validation.valid) {
                errors.push({ student: student.Name || 'Unknown', errors: validation.errors });
                continue;
            }

            try {
                await query(`
                    INSERT INTO students (enrollment_number, first_name, last_name, email, phone, current_semester)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE email = VALUES(email)
                `, [
                    student.StudentID,
                    student.Name?.split(' ')[0] || student.FirstName,
                    student.Name?.split(' ')[1] || student.LastName || '',
                    student.Email,
                    student.Phone || null,
                    student.Semester || 1
                ]);
                imported.push(student.Name || student.StudentID);
            } catch (err) {
                errors.push({ student: student.Name, error: err.message });
            }
        }

        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: `Imported ${imported.length} students`,
            data: { imported, errors }
        });

    } catch (error) {
        console.error('XML import error:', error);
        res.status(500).json({ success: false, message: 'Failed to import XML' });
    }
});

// GET /api/xml/export/students - Export Students as XML
router.get('/export/students', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const students = await query(`
            SELECT student_id, enrollment_number, first_name, last_name, email, phone, current_semester
            FROM students WHERE is_active = TRUE
        `);

        const builder = new xml2js.Builder({ rootName: 'StudentData', headless: false });
        const xmlData = {
            Student: students.map(s => ({
                StudentID: s.enrollment_number,
                Name: `${s.first_name} ${s.last_name}`,
                Email: s.email,
                Phone: s.phone || '',
                Semester: s.current_semester
            }))
        };

        const xml = builder.buildObject(xmlData);

        res.set('Content-Type', 'application/xml');
        res.set('Content-Disposition', 'attachment; filename=students_export.xml');
        res.send(xml);

    } catch (error) {
        console.error('XML export error:', error);
        res.status(500).json({ success: false, message: 'Failed to export XML' });
    }
});

// GET /api/xml/export/analytics-report - Export Analytics Report as XML
router.get('/export/analytics-report', authenticateToken, async (req, res) => {
    try {
        const report = await query(`
            SELECT 
                s.enrollment_number as StudentID,
                CONCAT(s.first_name, ' ', s.last_name) as Name,
                COALESCE(att.attendance, 0) as Attendance,
                COALESCE(mrk.avg_marks, 0) as AverageMarks,
                CASE 
                    WHEN COALESCE(mrk.avg_marks, 0) < 35 AND COALESCE(att.attendance, 0) < 60 THEN 'High'
                    WHEN COALESCE(mrk.avg_marks, 0) < 45 OR COALESCE(att.attendance, 0) < 75 THEN 'Medium'
                    ELSE 'Low'
                END as RiskLevel
            FROM students s
            LEFT JOIN (
                SELECT student_id, ROUND((SUM(CASE WHEN status='present' THEN 1 ELSE 0 END)/COUNT(*))*100, 2) as attendance
                FROM attendance GROUP BY student_id
            ) att ON s.student_id = att.student_id
            LEFT JOIN (
                SELECT student_id, ROUND(AVG(marks_obtained), 2) as avg_marks
                FROM marks WHERE exam_type = 'final' GROUP BY student_id
            ) mrk ON s.student_id = mrk.student_id
            WHERE s.is_active = TRUE
        `);

        const builder = new xml2js.Builder({ rootName: 'StudentAnalyticsReport', headless: false });
        const xmlData = { Student: report };
        const xml = builder.buildObject(xmlData);

        res.set('Content-Type', 'application/xml');
        res.set('Content-Disposition', 'attachment; filename=analytics_report.xml');
        res.send(xml);

    } catch (error) {
        console.error('Report export error:', error);
        res.status(500).json({ success: false, message: 'Failed to export report' });
    }
});

// POST /api/xml/validate - Validate XML against schema
router.post('/validate', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { schemaType } = req.body;
        const xmlContent = fs.readFileSync(req.file.path, 'utf-8');
        const parser = new xml2js.Parser({ explicitArray: false });
        
        const result = await parser.parseStringPromise(xmlContent);
        const data = result.StudentData?.Student || result.Students?.Student;

        if (!data) {
            fs.unlinkSync(req.file.path);
            return res.json({ success: false, valid: false, errors: ['Invalid XML root structure'] });
        }

        const records = Array.isArray(data) ? data : [data];
        const allErrors = [];

        records.forEach((record, index) => {
            const validation = validateXML(record, schemaType || 'student');
            if (!validation.valid) {
                allErrors.push({ record: index + 1, errors: validation.errors });
            }
        });

        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            valid: allErrors.length === 0,
            totalRecords: records.length,
            errors: allErrors
        });

    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ success: false, message: 'Validation failed' });
    }
});

module.exports = router;
