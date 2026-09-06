// routes/policySource.routes.js

const express = require("express");
const router = express.Router();

const policySourceController = require("./policySource.controller");
const verifyAccessToken = require("../../middleware/verifyAccessToken");

// ==================== POLICY SOURCE MASTER ROUTES ====================

// Create policy source
router.post(
  "/create",
  verifyAccessToken,
  policySourceController.createPolicySource,
);

// Get all policy sources
router.get(
  "/getall",
  verifyAccessToken,
  policySourceController.getAllPolicySources,
);

// Get policy source by ID
router.get(
  "/getbyid/:sourceId",
  verifyAccessToken,
  policySourceController.getPolicySourceById,
);

// Update policy source
router.patch(
  "/update/:sourceId",
  verifyAccessToken,
  policySourceController.updatePolicySource,
);

// Delete policy source (soft delete)
router.delete(
  "/delete/:sourceId",
  verifyAccessToken,
  policySourceController.deletePolicySource,
);

// Get active policy sources only
router.get(
  "/get-active",
  verifyAccessToken,
  policySourceController.getActivePolicySources,
);

module.exports = router;
