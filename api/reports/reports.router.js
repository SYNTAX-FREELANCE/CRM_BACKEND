const express = require("express");
const router = express.Router();
const reportsController = require("./reports.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// ==================== POLICY REPORT ROUTES ====================

// Get Policy Report JSON data
router.get("/policy", verifyAccessToken, reportsController.getPolicyReport);

// Export Policy Report to Excel
router.get("/policy/export", verifyAccessToken, reportsController.exportPolicyReportExcel);

// ==================== EMPLOYEE PERFORMANCE ROUTES ====================

// Get Employee Performance Report JSON data
router.get("/employee-performance", verifyAccessToken, reportsController.getEmployeePerformance);

// Export Employee Performance Report to Excel
router.get("/employee-performance/export", verifyAccessToken, reportsController.exportEmployeePerformanceExcel);

// ==================== EMPLOYEE ATTENDANCE ROUTES ====================

// Get Employee Attendance Report JSON data
router.get("/employee-attendance", verifyAccessToken, reportsController.getEmployeeAttendance);

// Export Employee Attendance Report to Excel
router.get("/employee-attendance/export", verifyAccessToken, reportsController.exportEmployeeAttendanceExcel);

module.exports = router;
