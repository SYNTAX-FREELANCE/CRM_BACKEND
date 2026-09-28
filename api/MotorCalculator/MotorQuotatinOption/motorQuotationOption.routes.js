const express = require("express");

const router = express.Router();

const MotorQuotationOptionController =
    require("./motorQuotationOption.controller");

const verifyAccessToken =
    require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorQuotationOptionController.createQuotationOption
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorQuotationOptionController.getAllQuotationOptions
);


// GET BY ID
router.get(
    "/getbyid/:quotation_option_id",
    verifyAccessToken,
    MotorQuotationOptionController.getQuotationOptionById
);


// GET BY QUOTATION
router.get(
    "/getbyquotation/:motor_quotation_id",
    verifyAccessToken,
    MotorQuotationOptionController.getQuotationOptionsByQuotation
);


// UPDATE
router.put(
    "/update/:quotation_option_id",
    verifyAccessToken,
    MotorQuotationOptionController.updateQuotationOption
);


// DELETE
router.delete(
    "/delete/:quotation_option_id",
    verifyAccessToken,
    MotorQuotationOptionController.deleteQuotationOption
);


module.exports = router;