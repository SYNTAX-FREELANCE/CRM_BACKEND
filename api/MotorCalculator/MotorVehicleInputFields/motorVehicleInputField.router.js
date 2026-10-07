const express = require("express");

const router = express.Router();

const MotorVehicleInputFieldController = require("./motorVehicleInputField.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE

router.post(
  "/create",
  verifyAccessToken,
  MotorVehicleInputFieldController.createInputField,
);

// GET ALL

router.get(
  "/getall",
  verifyAccessToken,
  MotorVehicleInputFieldController.getAllInputFields,
);
// GET BY ID
router.get(
  "/getbyid/:vehicle_input_field_id",
  verifyAccessToken,
  MotorVehicleInputFieldController.getInputFieldById,
);

// UPDATE

router.put(
  "/update/:vehicle_input_field_id",
  verifyAccessToken,
  MotorVehicleInputFieldController.updateInputField,
);

// DELETE

router.delete(
  "/delete/:vehicle_input_field_id",

  verifyAccessToken,

  MotorVehicleInputFieldController.deleteInputField,
);

// GET ACTIVE

router.get(
  "/getactive",

  verifyAccessToken,

  MotorVehicleInputFieldController.getActiveInputFields,
);

// GET BY CATEGORY

router.get(
  "/getbycategory/:vehicle_category_id",
  verifyAccessToken,
  MotorVehicleInputFieldController.getInputFieldsByCategory,
);

module.exports = router;
