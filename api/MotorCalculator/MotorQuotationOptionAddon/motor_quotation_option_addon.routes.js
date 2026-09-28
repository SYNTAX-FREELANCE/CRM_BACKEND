const express = require("express");

const router = express.Router();

const MotorQuotationOptionAddonController = require("./motor_quotation_option_addon.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorQuotationOptionAddonController.createQuotationOptionAddon
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorQuotationOptionAddonController.getAllQuotationOptionAddons
);


// GET BY ID
router.get(
    "/getbyid/:quotation_option_addon_id",
    verifyAccessToken,
    MotorQuotationOptionAddonController.getQuotationOptionAddonById
);


// GET BY QUOTATION OPTION
router.get(
    "/getbyoption/:quotation_option_id",
    verifyAccessToken,
    MotorQuotationOptionAddonController.getQuotationOptionAddonsByOption
);


// UPDATE
router.put(
    "/update/:quotation_option_addon_id",
    verifyAccessToken,
    MotorQuotationOptionAddonController.updateQuotationOptionAddon
);


// DELETE
router.delete(
    "/delete/:quotation_option_addon_id",
    verifyAccessToken,
    MotorQuotationOptionAddonController.deleteQuotationOptionAddon
);


module.exports = router;