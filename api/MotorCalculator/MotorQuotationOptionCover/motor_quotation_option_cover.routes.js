const express = require("express");

const router = express.Router();

const MotorQuotationOptionCoverController = require("./motor_quotation_option_cover.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorQuotationOptionCoverController.createQuotationOptionCover
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorQuotationOptionCoverController.getAllQuotationOptionCovers
);


// GET BY ID
router.get(
    "/getbyid/:quotation_option_cover_id",
    verifyAccessToken,
    MotorQuotationOptionCoverController.getQuotationOptionCoverById
);


// GET BY QUOTATION OPTION
router.get(
    "/getbyoption/:quotation_option_id",
    verifyAccessToken,
    MotorQuotationOptionCoverController.getQuotationOptionCoversByOption
);


// UPDATE
router.put(
    "/update/:quotation_option_cover_id",
    verifyAccessToken,
    MotorQuotationOptionCoverController.updateQuotationOptionCover
);


// DELETE
router.delete(
    "/delete/:quotation_option_cover_id",
    verifyAccessToken,
    MotorQuotationOptionCoverController.deleteQuotationOptionCover
);


module.exports = router;