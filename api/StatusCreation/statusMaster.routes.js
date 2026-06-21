// routes/statusMaster.routes.js
const express = require("express");
const router = express.Router();
const statusMasterController = require("./statusMaster.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// ==================== STATUS MASTER ROUTES ====================

// Create status
router.post("/create", verifyAccessToken, statusMasterController.createStatus);

// Get all statuses
router.get("/getall", verifyAccessToken, statusMasterController.getAllStatuses);

// Get status by ID
router.get("/getbyid/:statusId", verifyAccessToken, statusMasterController.getStatusById);

// Update status
router.patch("/update/:statusId", verifyAccessToken, statusMasterController.updateStatus);

// Delete status (soft delete)
router.delete("/delete/:statusId", verifyAccessToken, statusMasterController.deleteStatus);

// Get active statuses only
router.get("/get-active", verifyAccessToken, statusMasterController.getActiveStatuses);

module.exports = router;