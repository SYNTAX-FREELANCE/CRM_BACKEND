// routes/menuMaster.router.js
const express = require("express");
const router = express.Router();
const menuMasterController = require("./menuMaster.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");


// ==================== MENU MASTER ROUTES ====================

// Create menu
router.post("/create", verifyAccessToken, menuMasterController.createMenu);

// Get all menus
router.get("/getall", verifyAccessToken, menuMasterController.getAllMenus);

// Get menu by ID
router.get("/getbyid/:menuId", verifyAccessToken, menuMasterController.getMenuById);

// Update menu
router.patch("/update/:menuId", verifyAccessToken, menuMasterController.updateMenu);

// Delete menu (soft delete)
router.delete("/delete/:menuId", verifyAccessToken, menuMasterController.deleteMenu);

// Get active menus only
router.get("/get-active", verifyAccessToken, menuMasterController.getActiveMenus);

module.exports = router;
