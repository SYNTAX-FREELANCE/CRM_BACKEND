
// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("./usercontroller.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");
// const validateTokenController = require('../controllers/validateToken.controller');

// Public routes
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

// Protected routes (need access token)
router.post("/logout", verifyAccessToken, authController.logout);

// =======
// const {
//   loginUserDetail,
//   RegisterUser,
//   logoutUserSession,
// } = require("./usercontroller.controller");

// const authMiddleware = require("../../Middleware/auth.middleware");
// const router = require("express").Router();

// router.post("/login", loginUserDetail);
// router.post("/signin", RegisterUser);
// router.post("/logout", authMiddleware, logoutUserSession);
// >>>>>>> f9862138face5df8a5abf85f3019f569585a6a39

module.exports = router;
