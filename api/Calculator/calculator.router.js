const express = require("express");
const router = express.Router();

const MotorCalculationController = require("./calculator.controller");
const verifyAccessToken = require("../../middleware/verifyAccessToken");

router.post(
    "/get-data",
    verifyAccessToken,
    MotorCalculationController.getCalculationData
);

module.exports = router;