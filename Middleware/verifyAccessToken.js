// middleware/verifyAccessToken.js
const jwt = require('jsonwebtoken');
const authService = require('../api/UserContorller/usercontroller.service');

const verifyAccessToken = (req, res, next) => {
    // Get token from header (your axios sends it as accessToken header)
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
            
            // Attach user info to request
            req.user = {
                id: user.id,
                username: user.username,
                role: user.role,
            };
            
            // Call next
            next();
        });
    });
};

module.exports = verifyAccessToken;