const express = require("express");

const router = express.Router();

const MotorOdDepreciationController = require("./motorOdDepreciation.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorOdDepreciationController.createOdDepreciation
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorOdDepreciationController.getAllOdDepreciations
);


// GET BY ID
router.get(
    "/getbyid/:id",
    verifyAccessToken,
    MotorOdDepreciationController.getOdDepreciationById
);


// UPDATE
router.put(
    "/update/:id",
    verifyAccessToken,
    MotorOdDepreciationController.updateOdDepreciation
);


// DELETE
router.delete(
    "/delete/:id",
    verifyAccessToken,
    MotorOdDepreciationController.deleteOdDepreciation
);


// GET ACTIVE
router.get(
    "/getactive",
    verifyAccessToken,
    MotorOdDepreciationController.getActiveOdDepreciations
);


module.exports = router;