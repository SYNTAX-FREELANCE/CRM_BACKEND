const express = require("express");

const router = express.Router();

const MotorCoverUnitRateController = require("./motorCoverUnitRate.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorCoverUnitRateController.createCoverUnitRate
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorCoverUnitRateController.getAllCoverUnitRates
);

// GET BY ID
router.get(
  "/getbyid/:cover_unit_rate_id",
  verifyAccessToken,
  MotorCoverUnitRateController.getCoverUnitRateById
);

// UPDATE
router.put(
  "/update/:cover_unit_rate_id",
  verifyAccessToken,
  MotorCoverUnitRateController.updateCoverUnitRate
);

// DELETE
router.delete(
  "/delete/:cover_unit_rate_id",
  verifyAccessToken,
  MotorCoverUnitRateController.deleteCoverUnitRate
);

// GET ACTIVE
router.get(
  "/getactive",
  verifyAccessToken,
  MotorCoverUnitRateController.getActiveCoverUnitRates
);

module.exports = router;