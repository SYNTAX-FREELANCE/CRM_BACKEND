// routes/submoduleMaster.router.js
const express = require("express");
const router = express.Router();
const submoduleMasterController = require("./submoduleMaster.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// ==================== SUBMODULE MASTER ROUTES ====================

// Create submodule
router.post("/create", verifyAccessToken, submoduleMasterController.createSubmodule);

// Get all submodules
router.get("/getall", verifyAccessToken, submoduleMasterController.getAllSubmodules);

// Get submodule by ID
router.get("/getbyid/:submoduleId", verifyAccessToken, submoduleMasterController.getSubmoduleById);

// Update submodule
router.patch("/update/:submoduleId", verifyAccessToken, submoduleMasterController.updateSubmodule);

// Delete submodule (soft delete)
router.delete("/delete/:submoduleId", verifyAccessToken, submoduleMasterController.deleteSubmodule);

// Get active submodules only
router.get("/get-active", verifyAccessToken, submoduleMasterController.getActiveSubmodules);

module.exports = router;
