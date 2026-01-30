// =====================================================
// Authentication Routes
// =====================================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { query, transaction } = require('../config/db');
const { generateToken, authenticateToken } = require('../middleware/auth');

// =====================================================
// GET /api/auth/courses - Get all courses for registration
// =====================================================
router.get('/courses', async (req, res) => {
    try {
        const courses = await query('SELECT course_id, course_name, course_code FROM courses ORDER BY course_name');
        res.json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch courses' });
    }
});

// =====================================================
// GET /api/auth/departments - Get all departments for registration
// =====================================================
router.get('/departments', async (req, res) => {
    try {
        const departments = await query('SELECT department_id, department_name, department_code FROM departments ORDER BY department_name');
        res.json({ success: true, data: departments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch departments' });
    }
});

// =====================================================
// POST /api/auth/register - User Registration
// =====================================================
router.post('/register', async (req, res) => {
    try {
        const { 
            role, firstName, lastName, email, phone, password,
            // Student fields
            enrollmentNumber, dateOfBirth, gender, courseId, currentSemester, admissionYear, guardianName, guardianPhone,
            // Faculty fields
            employeeId, departmentId, designation, qualification, specialization
        } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }
        
        // Check if email already exists
        const existingUser = await query('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }
        
        // Hash password using SHA256 (to match existing system)
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        const fullName = `${firstName} ${lastName}`;
        
        if (role === 'student') {
            // Validate student-specific fields
            if (!courseId) {
                return res.status(400).json({
                    success: false,
                    message: 'Course is required for students'
                });
            }
            
            // Auto-generate enrollment number if not provided
            let finalEnrollmentNumber = enrollmentNumber;
            if (!finalEnrollmentNumber) {
                const year = admissionYear || new Date().getFullYear();
                const lastStudent = await query(
                    'SELECT enrollment_number FROM students WHERE enrollment_number LIKE ? ORDER BY enrollment_number DESC LIMIT 1',
                    [`EN${year}%`]
                );
                if (lastStudent.length > 0) {
                    const lastNum = parseInt(lastStudent[0].enrollment_number.slice(-3)) + 1;
                    finalEnrollmentNumber = `EN${year}${String(lastNum).padStart(3, '0')}`;
                } else {
                    finalEnrollmentNumber = `EN${year}001`;
                }
            } else {
                // Check if provided enrollment number exists
                const existingEnrollment = await query('SELECT student_id FROM students WHERE enrollment_number = ?', [finalEnrollmentNumber]);
                if (existingEnrollment.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'This enrollment number is already registered'
                    });
                }
            }
            
            // Create user account
            const userResult = await query(
                'INSERT INTO users (email, password_hash, role, full_name, phone) VALUES (?, ?, ?, ?, ?)',
                [email, passwordHash, 'student', fullName, phone]
            );
            
            const userId = userResult.insertId;
            const year = admissionYear || new Date().getFullYear();
            const batch = `${year}-${parseInt(year) + 4}`;
            
            // Create student record
            await query(`
                INSERT INTO students (
                    user_id, enrollment_number, first_name, last_name, email, phone,
                    date_of_birth, gender, course_id, current_semester, admission_year, batch,
                    guardian_name, guardian_phone
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                userId, finalEnrollmentNumber, firstName, lastName, email, phone,
                dateOfBirth || null, gender || null, courseId, currentSemester || 1, admissionYear || new Date().getFullYear(), batch,
                guardianName || null, guardianPhone || null
            ]);
            
            res.status(201).json({
                success: true,
                message: `Student account created successfully. Your enrollment number is: ${finalEnrollmentNumber}`
            });
            
        } else if (role === 'faculty') {
            // Validate faculty-specific fields
            if (!departmentId || !designation) {
                return res.status(400).json({
                    success: false,
                    message: 'Department and designation are required for faculty'
                });
            }
            
            // Auto-generate employee ID if not provided
            let finalEmployeeId = employeeId;
            if (!finalEmployeeId) {
                const lastFaculty = await query(
                    'SELECT employee_id FROM faculty WHERE employee_id LIKE ? ORDER BY employee_id DESC LIMIT 1',
                    ['FAC%']
                );
                if (lastFaculty.length > 0) {
                    const lastNum = parseInt(lastFaculty[0].employee_id.slice(3)) + 1;
                    finalEmployeeId = `FAC${String(lastNum).padStart(3, '0')}`;
                } else {
                    finalEmployeeId = 'FAC001';
                }
            } else {
                // Check if provided employee ID exists
                const existingEmployee = await query('SELECT faculty_id FROM faculty WHERE employee_id = ?', [finalEmployeeId]);
                if (existingEmployee.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'This employee ID is already registered'
                    });
                }
            }
            
            // Create user account
            const userResult = await query(
                'INSERT INTO users (email, password_hash, role, full_name, phone) VALUES (?, ?, ?, ?, ?)',
                [email, passwordHash, 'faculty', fullName, phone]
            );
            
            const userId = userResult.insertId;
            
            // Create faculty record
            await query(`
                INSERT INTO faculty (
                    user_id, employee_id, first_name, last_name, email, phone,
                    department_id, designation, qualification, specialization, joining_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
            `, [
                userId, finalEmployeeId, firstName, lastName, email, phone,
                departmentId, designation, qualification || null, specialization || null
            ]);
            
            res.status(201).json({
                success: true,
                message: `Faculty account created successfully. Your Employee ID is: ${finalEmployeeId}`
            });
            
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Please select Student or Faculty.'
            });
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: error.message
        });
    }
});

// =====================================================
// POST /api/auth/forgot-password - Request Password Reset
// =====================================================
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        
        // Check if user exists
        const users = await query('SELECT user_id, full_name FROM users WHERE email = ? AND is_active = TRUE', [email]);
        
        if (users.length === 0) {
            // Don't reveal if email exists or not for security
            return res.json({
                success: true,
                message: 'If an account with that email exists, you will receive password reset instructions.'
            });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpiry = new Date(Date.now() + 3600000); // 1 hour from now
        
        // Store reset token (you'd typically store this in DB)
        await query(
            'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?',
            [resetToken, resetExpiry, users[0].user_id]
        );
        
        // In production, send email here
        // For now, just return success
        console.log(`Password reset token for ${email}: ${resetToken}`);
        
        res.json({
            success: true,
            message: 'If an account with that email exists, you will receive password reset instructions.'
        });
        
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process request'
        });
    }
});

// =====================================================
// POST /api/auth/reset-password - Reset Password with Token
// =====================================================
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            });
        }
        
        // Find user with valid reset token
        const users = await query(
            'SELECT user_id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW() AND is_active = TRUE',
            [token]
        );
        
        if (users.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }
        
        // Update password and clear reset token
        const passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex');
        await query(
            'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?',
            [passwordHash, users[0].user_id]
        );
        
        res.json({
            success: true,
            message: 'Password has been reset successfully'
        });
        
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password'
        });
    }
});

// =====================================================
// POST /api/auth/login - User Login
// =====================================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        
        // Find user by email
        const users = await query(
            'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        const user = users[0];
        
        // Verify password (using SHA2 hash as stored in DB)
        const crypto = require('crypto');
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        
        if (hashedPassword !== user.password_hash) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        // Generate token
        const token = generateToken(user);
        
        // Set session
        req.session.user = {
            userId: user.user_id,
            email: user.email,
            role: user.role,
            fullName: user.full_name
        };
        
        // Get additional info based on role
        let additionalInfo = {};
        
        if (user.role === 'student') {
            const studentInfo = await query(
                'SELECT * FROM students WHERE user_id = ?',
                [user.user_id]
            );
            if (studentInfo.length > 0) {
                additionalInfo = {
                    studentId: studentInfo[0].student_id,
                    enrollmentNumber: studentInfo[0].enrollment_number,
                    currentSemester: studentInfo[0].current_semester
                };
            }
        } else if (user.role === 'faculty') {
            const facultyInfo = await query(
                'SELECT f.*, d.department_name FROM faculty f LEFT JOIN departments d ON f.department_id = d.department_id WHERE f.user_id = ?',
                [user.user_id]
            );
            if (facultyInfo.length > 0) {
                additionalInfo = {
                    facultyId: facultyInfo[0].faculty_id,
                    employeeId: facultyInfo[0].employee_id,
                    department: facultyInfo[0].department_name
                };
            }
        }
        
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    userId: user.user_id,
                    email: user.email,
                    role: user.role,
                    fullName: user.full_name,
                    ...additionalInfo
                }
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// =====================================================
// POST /api/auth/logout - User Logout
// =====================================================
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout failed'
            });
        }
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    });
});

// =====================================================
// GET /api/auth/me - Get Current User
// =====================================================
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const users = await query(
            'SELECT user_id, email, role, full_name, phone, profile_image FROM users WHERE user_id = ?',
            [req.user.userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.json({
            success: true,
            data: users[0]
        });
        
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user info'
        });
    }
});

// =====================================================
// PUT /api/auth/password - Change Password
// =====================================================
router.put('/password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current and new password are required'
            });
        }
        
        // Verify current password
        const users = await query(
            'SELECT password_hash FROM users WHERE user_id = ?',
            [req.user.userId]
        );
        
        const crypto = require('crypto');
        const hashedCurrent = crypto.createHash('sha256').update(currentPassword).digest('hex');
        
        if (hashedCurrent !== users[0].password_hash) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        // Update password
        const hashedNew = crypto.createHash('sha256').update(newPassword).digest('hex');
        await query(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [hashedNew, req.user.userId]
        );
        
        res.json({
            success: true,
            message: 'Password updated successfully'
        });
        
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password'
        });
    }
});

module.exports = router;
