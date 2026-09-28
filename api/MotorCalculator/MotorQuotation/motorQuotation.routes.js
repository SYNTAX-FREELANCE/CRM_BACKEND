const express = require("express");

const router = express.Router();

const MotorQuotationController = require("./motorQuotation.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorQuotationController.createQuotation
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorQuotationController.getAllQuotations
);


// GET BY ID
router.get(
    "/getbyid/:motor_quotation_id",
    verifyAccessToken,
    MotorQuotationController.getQuotationById
);


// UPDATE
router.put(
    "/update/:motor_quotation_id",
    verifyAccessToken,
    MotorQuotationController.updateQuotation
);


// DELETE
router.delete(
    "/delete/:motor_quotation_id",
    verifyAccessToken,
    MotorQuotationController.deleteQuotation
);


// GET BY CUSTOMER
router.get(
    "/getbycustomer/:customer_id",
    verifyAccessToken,
    MotorQuotationController.getQuotationsByCustomer
);


// GET BY VEHICLE
router.get(
    "/getbyvehicle/:vehicle_id",
    verifyAccessToken,
    MotorQuotationController.getQuotationsByVehicle
);


module.exports = router;