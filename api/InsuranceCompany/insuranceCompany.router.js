// routes/insuranceCompany.routes.js
const express = require("express");
const router = express.Router();
const insuranceCompanyController = require("./insuranceCompany.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// ==================== INSURANCE COMPANY MASTER ROUTES ====================

// Create Insurance Company
router.post("/create", verifyAccessToken, insuranceCompanyController.createInsuranceCompany);

// Get all Insurance Companies
router.get("/getall", verifyAccessToken, insuranceCompanyController.getAllInsuranceCompanies);

// Get Insurance Company by ID
router.get("/getbyid/:insuranceCompanyId", verifyAccessToken, insuranceCompanyController.getInsuranceCompanyById);

// Update Insurance Company
router.patch("/update/:insuranceCompanyId", verifyAccessToken, insuranceCompanyController.updateInsuranceCompany);

module.exports = router;
