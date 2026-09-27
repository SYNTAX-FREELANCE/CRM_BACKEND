const express = require("express");

const router = express.Router();

const MotorTaxController = require("./motorTax.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorTaxController.createTax
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorTaxController.getAllTaxes
);


// GET BY ID
router.get(
    "/getbyid/:tax_id",
    verifyAccessToken,
    MotorTaxController.getTaxById
);


// UPDATE
router.put(
    "/update/:tax_id",
    verifyAccessToken,
    MotorTaxController.updateTax
);


// DELETE
router.delete(
    "/delete/:tax_id",
    verifyAccessToken,
    MotorTaxController.deleteTax
);


// GET ACTIVE
router.get(
    "/getactive",
    verifyAccessToken,
    MotorTaxController.getActiveTaxes
);


module.exports = router;