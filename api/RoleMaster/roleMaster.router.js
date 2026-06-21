// routes/roleMaster.routes.js
const express = require("express");
const router = express.Router();
const roleMasterController = require("../RoleMaster/roleMaster.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// ==================== ROLE MASTER ROUTES ====================

// Create role
router.post("/create", verifyAccessToken, roleMasterController.createRole);

// Get all roles
router.get("/getall", verifyAccessToken, roleMasterController.getAllRoles);

// Get role by ID
router.get("/getbyid/:roleId", verifyAccessToken, roleMasterController.getRoleById);

// Update role
router.patch("/update/:roleId", verifyAccessToken, roleMasterController.updateRole);

// Delete role (soft delete)
router.delete("/delete/:roleId", verifyAccessToken, roleMasterController.deleteRole);

// Get active roles only
router.get("/get-active", verifyAccessToken, roleMasterController.getActiveRoles);

module.exports = router;