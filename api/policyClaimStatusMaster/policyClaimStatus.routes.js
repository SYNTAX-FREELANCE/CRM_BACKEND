const express = require("express");
const router = express.Router();

const policyClaimStatusController = require("./policyClaimStatus.controller");
const verifyAccessToken = require("../../middleware/verifyAccessToken");

// ==================== POLICY CLAIM STATUS ROUTES ====================

// Create Claim Status
router.post("/create", verifyAccessToken, policyClaimStatusController.createClaimStatus);

// Get All Claim Statuses
router.get("/getall", verifyAccessToken, policyClaimStatusController.getAllClaimStatuses);

// Get Claim Status By ID
router.get("/getbyid/:claimStatusId", verifyAccessToken, policyClaimStatusController.getClaimStatusById);

// Update Claim Status
router.patch("/update/:claimStatusId", verifyAccessToken, policyClaimStatusController.updateClaimStatus);

module.exports = router;