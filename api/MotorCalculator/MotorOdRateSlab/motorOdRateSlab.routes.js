const express = require("express");

const router = express.Router();

const MotorOdRateSlabController = require("./motorOdRateSlab.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorOdRateSlabController.createOdRateSlab
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorOdRateSlabController.getAllOdRateSlabs
);

// GET BY ID
router.get(
  "/getbyid/:od_rate_slab_id",
  verifyAccessToken,
  MotorOdRateSlabController.getOdRateSlabById
);

// UPDATE
router.put(
  "/update/:od_rate_slab_id",
  verifyAccessToken,
  MotorOdRateSlabController.updateOdRateSlab
);

// DELETE / SOFT DELETE
router.delete(
  "/delete/:od_rate_slab_id",
  verifyAccessToken,
  MotorOdRateSlabController.deleteOdRateSlab
);

// GET ACTIVE
router.get(
  "/getactive",
  verifyAccessToken,
  MotorOdRateSlabController.getActiveOdRateSlabs
);

module.exports = router;