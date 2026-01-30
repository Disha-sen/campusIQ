// =====================================================
// Authentication Middleware
// =====================================================

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'edu_analytics_jwt_secret_2024';

// Verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    // Also check session
    if (!token && !req.session?.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired token'
                });
            }
            req.user = user;
            next();
        });
    } else if (req.session?.user) {
        req.user = req.session.user;
        next();
    }
};

// Role-based access control
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }
        
        next();
    };
};

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.user_id,
            email: user.email,
            role: user.role,
            fullName: user.full_name
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Validate input (SQL injection prevention)
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    // Remove potentially dangerous characters
    return input.replace(/[;'"\\]/g, '');
};

// Request validation middleware
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.details.map(d => d.message)
            });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorize,
    generateToken,
    sanitizeInput,
    validateRequest,
    JWT_SECRET
};
