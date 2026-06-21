// routes/companyMaster.routes.js
const express = require("express");
const router = express.Router();
const companyMasterController = require("./companyMaster.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// ==================== COMPANY MASTER ROUTES ====================

// Create company
router.post("/create", verifyAccessToken, companyMasterController.createCompany);

// Get all companies
router.get("/getall", verifyAccessToken, companyMasterController.getAllCompanies);

// Get company by ID
router.get("/getbyid/:companyId", verifyAccessToken, companyMasterController.getCompanyById);

// Update company
router.patch("/update/:companyId", verifyAccessToken, companyMasterController.updateCompany);

// Delete company (soft delete)
router.delete("/delete/:companyId", verifyAccessToken, companyMasterController.deleteCompany);

// Get active companies only
router.get("/get-active", verifyAccessToken, companyMasterController.getActiveCompanies);

module.exports = router;