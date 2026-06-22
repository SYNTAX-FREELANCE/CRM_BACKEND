// routes/moduleMaster.router.js
const express = require("express");
const router = express.Router();
const moduleMasterController = require("./moduleMaster.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// ==================== MODULE MASTER ROUTES ====================

// Create module
router.post("/create", verifyAccessToken, moduleMasterController.createModule);

// Get all modules
router.get("/getall", verifyAccessToken, moduleMasterController.getAllModules);

// Get module by ID
router.get("/getbyid/:moduleId", verifyAccessToken, moduleMasterController.getModuleById);

// Update module
router.patch("/update/:moduleId", verifyAccessToken, moduleMasterController.updateModule);

// Delete module (soft delete)
router.delete("/delete/:moduleId", verifyAccessToken, moduleMasterController.deleteModule);

// Get active modules only
router.get("/get-active", verifyAccessToken, moduleMasterController.getActiveModules);

module.exports = router;
