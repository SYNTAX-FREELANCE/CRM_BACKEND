// routes/userInfo.router.js
const express = require("express");
const router = express.Router();
const userInfoController = require("./userInfo.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// 1. Fetch employee list (Admin and Team Lead use cases)
router.get("/employees", verifyAccessToken, userInfoController.getEmployees);

router.get("/employees/:empid", verifyAccessToken, userInfoController.getEmployeesDetailsById);

// 2. Fetch selected employee's performance (calls, appointments, callbacks)
router.get("/performance/:employeeId", verifyAccessToken, userInfoController.getEmployeePerformance);

// 2b. Fetch selected employee's call center performance analytics
router.get("/callcenter-performance/:employeeId", verifyAccessToken, userInfoController.getCallCenterPerformance);

// 3. Fetch attendance check in/out times by user ID and date
router.get("/attendance", verifyAccessToken, userInfoController.getAttendanceByDate);

module.exports = router;
