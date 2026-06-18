// Validate/validateToken.js
const jwt = require('jsonwebtoken');
const authService = require('../api/UserContorller/usercontroller.service');

// Validate token route handler (callback-based)
const validateToken = (req, res) => {
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
        return res.status(401).json({ 
            success: 0,
            message: 'Access token required' 
        });
    }
    
    // Verify access token (callback-based)
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                success: 0,
                message: 'Invalid or expired access token' 
            });
        }
        
        // Get user data from database (callback-based)
        authService.getUserByIdForValidation(decoded.userId, (err, user) => {
            if (err || !user) {
                return res.status(401).json({ 
                    success: 0,
                    message: 'User not found' 
                });
            }
            
            // Return success
            res.status(200).json({
                success: 1,
                message: "Token is valid",
                valid: true,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                },
            });
        });
    });
};

module.exports = validateToken;