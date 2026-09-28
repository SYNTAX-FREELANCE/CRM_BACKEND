const express = require("express");

const router = express.Router();

const MotorCoverRateController = require("./motorCoverRate.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorCoverRateController.createCoverRate
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorCoverRateController.getAllCoverRates
);

// GET BY ID
router.get(
  "/getbyid/:cover_rate_id",
  verifyAccessToken,
  MotorCoverRateController.getCoverRateById
);

// UPDATE
router.put(
  "/update/:cover_rate_id",
  verifyAccessToken,
  MotorCoverRateController.updateCoverRate
);

// DELETE
router.delete(
  "/delete/:cover_rate_id",
  verifyAccessToken,
  MotorCoverRateController.deleteCoverRate
);

// GET ACTIVE
router.get(
  "/getactive",
  verifyAccessToken,
  MotorCoverRateController.getActiveCoverRates
);

module.exports = router;