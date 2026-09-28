const express = require("express");

const router = express.Router();

const MotorOdRateController = require("./motorOdRate.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE

router.post(
    "/create",
    verifyAccessToken,
    MotorOdRateController.createOdRate
);


// GET ALL

router.get(
    "/getall",
    verifyAccessToken,
    MotorOdRateController.getAllOdRates
);


// GET BY ID

router.get(
    "/getbyid/:odRateId",
    verifyAccessToken,
    MotorOdRateController.getOdRateById
);


// UPDATE

router.put(
    "/update/:odRateId",
    verifyAccessToken,
    MotorOdRateController.updateOdRate
);


// DELETE

router.delete(
    "/delete/:odRateId",
    verifyAccessToken,
    MotorOdRateController.deleteOdRate
);


// GET ACTIVE

router.get(
    "/get-active",
    verifyAccessToken,
    MotorOdRateController.getActiveOdRates
);


module.exports = router;