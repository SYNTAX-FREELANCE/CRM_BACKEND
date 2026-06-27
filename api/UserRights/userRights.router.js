// routes/userRights.router.js
const express = require("express");
const router = express.Router();
const userRightsController = require("./userRights.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// 1. Get menus by module ID
router.get("/menus/:moduleId", verifyAccessToken, userRightsController.getMenusByModule);

// 2. Get existing rights for role ID + module ID
router.get("/existing/:roleId/:moduleId", verifyAccessToken, userRightsController.getExistingRights);

// 3. Save / Update rights
router.post("/save", verifyAccessToken, userRightsController.saveRights);

// 4. Get allowed menus for logged-in employee based on role ID
router.get("/allowed/:roleId", verifyAccessToken, userRightsController.getAllowedMenus);

module.exports = router;

