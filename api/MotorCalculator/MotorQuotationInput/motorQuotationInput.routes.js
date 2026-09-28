const express = require("express");

const router = express.Router();

const MotorQuotationInputController = require("./motorQuotationInput.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorQuotationInputController.createQuotationInput
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorQuotationInputController.getAllQuotationInputs
);


// GET BY ID
router.get(
    "/getbyid/:quotation_input_id",
    verifyAccessToken,
    MotorQuotationInputController.getQuotationInputById
);


// GET BY QUOTATION
router.get(
    "/getbyquotation/:motor_quotation_id",
    verifyAccessToken,
    MotorQuotationInputController.getQuotationInputByQuotationId
);


// UPDATE
router.put(
    "/update/:quotation_input_id",
    verifyAccessToken,
    MotorQuotationInputController.updateQuotationInput
);


// DELETE
router.delete(
    "/delete/:quotation_input_id",
    verifyAccessToken,
    MotorQuotationInputController.deleteQuotationInput
);


module.exports = router;