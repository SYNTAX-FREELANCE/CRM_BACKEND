const express = require("express");

const router = express.Router();

const MotorFuelTypeController = require("./motorFuelType.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorFuelTypeController.createFuelType
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorFuelTypeController.getAllFuelTypes
);

// GET BY ID
router.get(
  "/getbyid/:fuelTypeId",
  verifyAccessToken,
  MotorFuelTypeController.getFuelTypeById
);

// UPDATE
router.patch(
  "/update/:fuelTypeId",
  verifyAccessToken,
  MotorFuelTypeController.updateFuelType
);

// DELETE
router.delete(
  "/delete/:fuelTypeId",
  verifyAccessToken,
  MotorFuelTypeController.deleteFuelType
);

// GET ACTIVE
router.get(
  "/get-active",
  verifyAccessToken,
  MotorFuelTypeController.getActiveFuelTypes
);

module.exports = router;