
// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("./usercontroller.controller");
const verifyAccessToken = require("../../middleware/verifyAccessToken");
// const validateTokenController = require('../controllers/validateToken.controller');

// Public routes
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
// Protected routes (need access token)
router.post("/logout", verifyAccessToken, authController.logout);
router.post("/change-password", verifyAccessToken, authController.changePassword);
// Forgot Password routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);


router.post(
    "/mobile/login",
    authController.mobileLogin
);
router.post(
    "/mobile/refresh-token",
    authController.mobileRefreshToken
);
// ================================
// MOBILE PROTECTED
// ================================

router.post(
    "/mobile/logout",
    verifyAccessToken,
    authController.mobileLogout
);

router.post(
    "/mobile/change-password",
    verifyAccessToken,
    authController.changePassword
);



module.exports = router;
