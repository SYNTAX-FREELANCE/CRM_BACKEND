const express = require("express");

const router = express.Router();

const PolicyClaimController = require("./policyClaim.controller");

const verifyAccessToken = require("../../middleware/verifyAccessToken");

// ======================================================
// CREATE CLAIM
// ======================================================

router.post(
  "/create",
  verifyAccessToken,
  PolicyClaimController.createPolicyClaim,
);

// ======================================================
// GET ALL CLAIMS
// ======================================================

router.get(
  "/getall",
  verifyAccessToken,
  PolicyClaimController.getAllPolicyClaims,
);

// ======================================================
// GET CLAIM BY ID
// ======================================================

router.get(
  "/getbyid/:claimId",
  verifyAccessToken,
  PolicyClaimController.getPolicyClaimById,
);

// ======================================================
// GET CLAIMS BY POLICY
// ======================================================

router.get(
  "/getbypolicy/:policyId",
  verifyAccessToken,
  PolicyClaimController.getPolicyClaimsByPolicy,
);

// ======================================================
// UPDATE CLAIM
// ======================================================

router.patch(
  "/update/:claimId",
  verifyAccessToken,
  PolicyClaimController.updatePolicyClaim,
);

// ======================================================
// DELETE / SOFT DELETE
// ======================================================

router.delete(
  "/delete/:claimId",
  verifyAccessToken,
  PolicyClaimController.deletePolicyClaim,
);

// ======================================================
// GET ACTIVE CLAIMS
// ======================================================

router.get(
  "/get-active",
  verifyAccessToken,
  PolicyClaimController.getActivePolicyClaims,
);

module.exports = router;
