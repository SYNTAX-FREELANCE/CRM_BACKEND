const express = require("express");

const router = express.Router();

const MotorVehicleClassController = require("./motorVehicleClass.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorVehicleClassController.createVehicleClass
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorVehicleClassController.getAllVehicleClasses
);

// GET BY ID
router.get(
  "/getbyid/:vehicleClassId",
  verifyAccessToken,
  MotorVehicleClassController.getVehicleClassById
);

// UPDATE
router.patch(
  "/update/:vehicleClassId",
  verifyAccessToken,
  MotorVehicleClassController.updateVehicleClass
);

// DELETE
router.delete(
  "/delete/:vehicleClassId",
  verifyAccessToken,
  MotorVehicleClassController.deleteVehicleClass
);

// GET ACTIVE
router.get(
  "/get-active",
  verifyAccessToken,
  MotorVehicleClassController.getActiveVehicleClasses
);

module.exports = router;