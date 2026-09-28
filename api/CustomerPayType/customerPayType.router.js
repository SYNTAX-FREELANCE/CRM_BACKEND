const express = require("express");

const router = express.Router();

const customerPayTypeController = require("./customerPayType.controller");

const verifyAccessToken = require("../../middleware/verifyAccessToken");

// ==================== CUSTOMER PAY TYPE MASTER ROUTES ====================

// Create customer pay type

router.post(
    "/create",
    verifyAccessToken,
    customerPayTypeController.createCustomerPayType,
);

// Get all customer pay types

router.get(
    "/getall",
    verifyAccessToken,
    customerPayTypeController.getAllCustomerPayTypes,
);

// Get customer pay type by ID

router.get(
    "/getbyid/:customerPayTypeId",
    verifyAccessToken,
    customerPayTypeController.getCustomerPayTypeById,
);

// Update customer pay type

router.patch(
    "/update/:customerPayTypeId",
    verifyAccessToken,
    customerPayTypeController.updateCustomerPayType,
);

// Delete customer pay type (soft delete)

router.delete(
    "/delete/:customerPayTypeId",
    verifyAccessToken,
    customerPayTypeController.deleteCustomerPayType,
);

// Get active customer pay types only

router.get(
    "/get-active",
    verifyAccessToken,
    customerPayTypeController.getActiveCustomerPayTypes,
);

module.exports = router;