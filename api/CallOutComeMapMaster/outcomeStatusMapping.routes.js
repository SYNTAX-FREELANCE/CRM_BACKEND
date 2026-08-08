const express = require("express");

const router = express.Router();

const outcomeStatusMappingController = require("./outcomeStatusMapping.controller");

const verifyAccessToken = require("../../Middleware/verifyAccessToken");


// ==================== OUTCOME STATUS MAPPING MASTER ROUTES ====================


// Create Outcome Status Mapping

router.post(
    "/create",
    verifyAccessToken,
    outcomeStatusMappingController.createOutcomeStatusMapping
);


// Get all Outcome Status Mappings

router.get(
    "/getall",
    verifyAccessToken,
    outcomeStatusMappingController.getAllOutcomeStatusMappings
);


// Get Outcome Status Mapping by ID

router.get(
    "/getbyid/:mappingId",
    verifyAccessToken,
    outcomeStatusMappingController.getOutcomeStatusMappingById
);


// Update Outcome Status Mapping

router.patch(
    "/update/:mappingId",
    verifyAccessToken,
    outcomeStatusMappingController.updateOutcomeStatusMapping
);


router.get(
    "/get-by-status/:status_id",
    verifyAccessToken,
    outcomeStatusMappingController.getOutcomeByStatusId
);

module.exports = router;