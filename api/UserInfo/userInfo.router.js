// routes/userInfo.router.js
const express = require("express");
const router = express.Router();
const userInfoController = require("./userInfo.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// 1. Fetch employee list (Admin and Team Lead use cases)
router.get("/employees", verifyAccessToken, userInfoController.getEmployees);

// 2. Fetch selected employee's performance (calls, appointments, callbacks)
router.get("/performance/:employeeId", verifyAccessToken, userInfoController.getEmployeePerformance);

module.exports = router;
