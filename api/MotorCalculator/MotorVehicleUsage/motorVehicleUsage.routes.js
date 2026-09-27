const express = require("express");

const router = express.Router();

const MotorVehicleUsageController = require("./motorVehicleUsage.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorVehicleUsageController.createVehicleUsage
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorVehicleUsageController.getAllVehicleUsages
);

// GET BY ID
router.get(
  "/getbyid/:usageId",
  verifyAccessToken,
  MotorVehicleUsageController.getVehicleUsageById
);

// UPDATE
router.patch(
  "/update/:usageId",
  verifyAccessToken,
  MotorVehicleUsageController.updateVehicleUsage
);

// DELETE
router.delete(
  "/delete/:usageId",
  verifyAccessToken,
  MotorVehicleUsageController.deleteVehicleUsage
);

// GET ACTIVE
router.get(
  "/get-active",
  verifyAccessToken,
  MotorVehicleUsageController.getActiveVehicleUsages
);

module.exports = router;