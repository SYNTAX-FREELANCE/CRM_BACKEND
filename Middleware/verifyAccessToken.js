// // middleware/verifyAccessToken.js
// const jwt = require('jsonwebtoken');
// const authService = require('../api/UserContorller/usercontroller.service');

// const verifyAccessToken = (req, res, next) => {
//     // Get token from header (your axios sends it as accessToken header)
//     const accessToken = req.cookies.accessToken;

//     if (!accessToken) {
//         return res.status(401).json({ 
//             success: 0,
//             message: 'Access token required' 
//         });
//     }

//     // Verify access token (callback-based)
//     jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ 
//                 success: 0,
//                 message: 'Invalid or expired access token' 
//             });
//         }

//         // Get user data from database (callback-based)
//         authService.getUserByIdForValidation(decoded.userId, (err, user) => {
//             if (err || !user) {
//                 return res.status(401).json({ 
//                     success: 0,
//                     message: 'User not found' 
//                 });
//             }

//             // Attach user info to request
//             req.user = {
//                 id: user.id,
//                 user_id: user.user_id,
//                 username: user.username,
//                 role: user.role,
//                 role_name: user.role_name,
//             };

//             // Call next
//             next();
//         });
//     });
// };

// module.exports = verifyAccessToken;



// middleware/verifyAccessToken.js

const jwt = require("jsonwebtoken");
const authService = require("../api/UserContorller/usercontroller.service");

const verifyAccessToken = (req, res, next) => {

    /*
    =========================================================
    GET ACCESS TOKEN

    WEB:
        Cookie -> accessToken

    MOBILE:
        Authorization: Bearer <accessToken>
    =========================================================
    */

    let accessToken = null;

    // 1. Existing WEB authentication
    if (req.cookies?.accessToken) {
        accessToken = req.cookies.accessToken;
    }

    // 2. MOBILE authentication
    if (!accessToken) {

        const authHeader =
            req.headers.authorization;

        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {
            accessToken =
                authHeader.split(" ")[1];
        }
    }


    /*
    =========================================================
    TOKEN REQUIRED
    =========================================================
    */

    if (!accessToken) {

        return res.status(401).json({
            success: 0,
            message: "Access token required",
        });

    }


    /*
    =========================================================
    VERIFY ACCESS TOKEN
    =========================================================
    */

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {

            if (err) {

                return res.status(401).json({
                    success: 0,
                    message:
                        "Invalid or expired access token",
                });

            }


            /*
            =================================================
            GET USER FROM DATABASE
            =================================================
            */

            authService.getUserByIdForValidation(
                decoded.userId,
                (err, user) => {

                    if (err || !user) {

                        return res.status(401).json({
                            success: 0,
                            message:
                                "User not found",
                        });

                    }


                    /*
                    =============================================
                    ATTACH USER
                    =============================================
                    */

                    req.user = {
                        id: user.id,
                        user_id: user.user_id,
                        username: user.username,
                        role: user.role,
                        role_name: user.role_name,
                    };


                    /*
                    =============================================
                    CONTINUE
                    =============================================
                    */

                    next();

                }
            );

        }
    );

};

module.exports = verifyAccessToken;