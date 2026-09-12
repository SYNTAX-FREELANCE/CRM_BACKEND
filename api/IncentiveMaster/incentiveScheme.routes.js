const express = require("express");

const router = express.Router();

const incentiveSchemeController = require("./incentiveScheme.controller");

const verifyAccessToken = require("../../middleware/verifyAccessToken");

// ==================== INCENTIVE SCHEME MASTER ROUTES ====================

// Create incentive scheme

router.post(
    "/create",
    verifyAccessToken,
    incentiveSchemeController.createIncentiveScheme,
);

// Get all incentive schemes

router.get(
    "/getall",
    verifyAccessToken,
    incentiveSchemeController.getAllIncentiveSchemes,
);

// Get incentive scheme by ID

router.get(
    "/getbyid/:incentiveSchemeId",
    verifyAccessToken,
    incentiveSchemeController.getIncentiveSchemeById,
);

// Update incentive scheme

router.patch(
    "/update/:incentiveSchemeId",
    verifyAccessToken,
    incentiveSchemeController.updateIncentiveScheme,
);

// Delete incentive scheme (soft delete)

router.delete(
    "/delete/:incentiveSchemeId",
    verifyAccessToken,
    incentiveSchemeController.deleteIncentiveScheme,
);

// Get active incentive schemes only

router.get(
    "/get-active",
    verifyAccessToken,
    incentiveSchemeController.getActiveIncentiveSchemes,
);

module.exports = router;