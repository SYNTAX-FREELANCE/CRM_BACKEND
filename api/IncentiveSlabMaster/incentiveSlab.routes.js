const express = require("express");

const router = express.Router();

const incentiveSlabController = require("./incentiveSlab.controller");

const verifyAccessToken = require("../../middleware/verifyAccessToken");

// ==================== INCENTIVE SLAB MASTER ROUTES ====================

// Create incentive slab

router.post(
  "/create",
  verifyAccessToken,
  incentiveSlabController.createIncentiveSlab,
);

// Get all incentive slabs

router.get(
  "/getall",
  verifyAccessToken,
  incentiveSlabController.getAllIncentiveSlabs,
);

// Get incentive slab by ID

router.get(
  "/getbyid/:incentiveSlabId",
  verifyAccessToken,
  incentiveSlabController.getIncentiveSlabById,
);

// Update incentive slab

router.patch(
  "/update/:incentiveSlabId",
  verifyAccessToken,
  incentiveSlabController.updateIncentiveSlab,
);

// Delete incentive slab

router.delete(
  "/delete/:incentiveSlabId",
  verifyAccessToken,
  incentiveSlabController.deleteIncentiveSlab,
);

router.get(
  "/get-by-employee/:employeeId",
  verifyAccessToken,
  incentiveSlabController.getIncentiveSlabsByEmployee,
);

// Calculate incentive
router.post(
  "/calculate",
  verifyAccessToken,
  incentiveSlabController.calculateIncentive,
);

module.exports = router;
