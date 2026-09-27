const express = require("express");

const router = express.Router();

const MotorTpRateController = require("./motorTpRate.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorTpRateController.createTpRate
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorTpRateController.getAllTpRates
);


// GET BY ID
router.get(
    "/getbyid/:id",
    verifyAccessToken,
    MotorTpRateController.getTpRateById
);


// UPDATE
router.put(
    "/update/:id",
    verifyAccessToken,
    MotorTpRateController.updateTpRate
);


// DELETE
router.delete(
    "/delete/:id",
    verifyAccessToken,
    MotorTpRateController.deleteTpRate
);


// GET ACTIVE
router.get(
    "/getactive",
    verifyAccessToken,
    MotorTpRateController.getActiveTpRates
);


module.exports = router;