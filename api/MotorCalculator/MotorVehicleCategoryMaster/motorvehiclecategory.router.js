const express = require("express");

const router = express.Router();

const MotorVehicleCategoryController = require("./motorvehiclecategory.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");
const motorVehicleCategoryUpload = require("./motorVehicleCategoryUpload");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  motorVehicleCategoryUpload.single("image"),
  MotorVehicleCategoryController.createVehicleCategory
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorVehicleCategoryController.getAllVehicleCategories,
);

// GET BY ID
router.get(
  "/getbyid/:vehicleCategoryId",
  verifyAccessToken,
  MotorVehicleCategoryController.getVehicleCategoryById,
);

// UPDATE
router.patch(
  "/update/:vehicleCategoryId",
  verifyAccessToken,
  motorVehicleCategoryUpload.single("image"),
  MotorVehicleCategoryController.updateVehicleCategory
);

// DELETE
router.delete(
  "/delete/:vehicleCategoryId",
  verifyAccessToken,
  MotorVehicleCategoryController.deleteVehicleCategory,
);

// GET ACTIVE
router.get(
  "/get-active",
  verifyAccessToken,
  MotorVehicleCategoryController.getActiveVehicleCategories,
);

module.exports = router;
