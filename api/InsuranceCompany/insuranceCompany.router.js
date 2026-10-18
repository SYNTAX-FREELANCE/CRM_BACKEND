
// routes/insuranceCompany.routes.js
const express = require("express");
const router = express.Router();

const insuranceCompanyController = require("./insuranceCompany.controller");
const verifyAccessToken = require("../../middleware/verifyAccessToken");
const companyUpload = require("./Insurancecompany.upload"); // adjust path to your upload file

// Create Insurance Company
router.post(
    "/create",
    verifyAccessToken,
    companyUpload.single("insurance_compnay"),
    insuranceCompanyController.createInsuranceCompany
);

// Get all Insurance Companies
router.get(
    "/getall",
    verifyAccessToken,
    insuranceCompanyController.getAllInsuranceCompanies
);

// Get Insurance Company by ID
router.get(
    "/getbyid/:insuranceCompanyId",
    verifyAccessToken,
    insuranceCompanyController.getInsuranceCompanyById
);

// Update Insurance Company
router.patch(
    "/update/:insuranceCompanyId",
    verifyAccessToken,
    companyUpload.single("insurance_compnay"),
    insuranceCompanyController.updateInsuranceCompany
);

module.exports = router;
