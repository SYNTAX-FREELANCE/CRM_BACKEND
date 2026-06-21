const express = require("express");
const router = express.Router();

const qualificationMasterController = require("./qualification.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// Create Qualification
router.post(
    "/create",
    verifyAccessToken,
    qualificationMasterController.createQualification
);

// Get All Qualifications
router.get(
    "/getall",
    verifyAccessToken,
    qualificationMasterController.getAllQualifications
);

// Get Qualification By Id
router.get(
    "/getbyid/:qualificationId",
    verifyAccessToken,
    qualificationMasterController.getQualificationById
);

// Update Qualification
router.patch(
    "/update/:qualificationId",
    verifyAccessToken,
    qualificationMasterController.updateQualification
);

// Soft Delete Qualification
router.delete(
    "/delete/:qualificationId",
    verifyAccessToken,
    qualificationMasterController.deleteQualification
);

// Active Qualifications
router.get(
    "/get-active",
    verifyAccessToken,
    qualificationMasterController.getActiveQualifications
);

module.exports = router;