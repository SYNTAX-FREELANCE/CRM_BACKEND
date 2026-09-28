const express = require("express");

const router = express.Router();

const MotorCoverController = require("./motorCover.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorCoverController.createCover
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorCoverController.getAllCovers
);

// GET BY ID
router.get(
  "/getbyid/:cover_id",
  verifyAccessToken,
  MotorCoverController.getCoverById
);

// UPDATE
router.put(
  "/update/:cover_id",
  verifyAccessToken,
  MotorCoverController.updateCover
);

// DELETE / SOFT DELETE
router.delete(
  "/delete/:cover_id",
  verifyAccessToken,
  MotorCoverController.deleteCover
);

// GET ACTIVE
router.get(
  "/getactive",
  verifyAccessToken,
  MotorCoverController.getActiveCovers
);

module.exports = router;