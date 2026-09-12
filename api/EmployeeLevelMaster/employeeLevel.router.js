// routes/employeeLevel.routes.js

const express = require("express");

const router = express.Router();

const employeeLevelController = require("./employeeLevel.controller");

const verifyAccessToken = require("../../middleware/verifyAccessToken");

// ==================== EMPLOYEE LEVEL MASTER ROUTES ====================

// Create employee level

router.post(
    "/create",
    verifyAccessToken,
    employeeLevelController.createEmployeeLevel,
);

// Get all employee levels

router.get(
    "/getall",
    verifyAccessToken,
    employeeLevelController.getAllEmployeeLevels,
);

// Get employee level by ID

router.get(
    "/getbyid/:employeeLevelId",
    verifyAccessToken,
    employeeLevelController.getEmployeeLevelById,
);

// Update employee level

router.patch(
    "/update/:employeeLevelId",
    verifyAccessToken,
    employeeLevelController.updateEmployeeLevel,
);

// Delete employee level (soft delete)

router.delete(
    "/delete/:employeeLevelId",
    verifyAccessToken,
    employeeLevelController.deleteEmployeeLevel,
);

// Get active employee levels only

router.get(
    "/get-active",
    verifyAccessToken,
    employeeLevelController.getActiveEmployeeLevels,
);

module.exports = router;