const express = require("express");
const router = express.Router();

const MotorCalculationController = require("./calculator.controller");
const verifyAccessToken = require("../../middleware/verifyAccessToken");

router.post(
    "/get-data",
    verifyAccessToken,
    MotorCalculationController.getCalculationData
);

// CREATE MOTOR QUOTATION
router.post(
  "/create",
  verifyAccessToken,
  MotorCalculationController.createQuotation
);


router.get(
    "/getbylead/:lead_id",
    verifyAccessToken,
    MotorCalculationController.getQuotationByLeadId
);

module.exports = router;

