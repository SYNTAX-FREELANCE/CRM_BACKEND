const express = require("express");

const router = express.Router();

const MotorAddonConditionController = require("./motorAddonCondition.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorAddonConditionController.createAddonCondition
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorAddonConditionController.getAllAddonConditions
);

// GET BY ID
router.get(
  "/getbyid/:addon_condition_id",
  verifyAccessToken,
  MotorAddonConditionController.getAddonConditionById
);

// UPDATE
router.put(
  "/update/:addon_condition_id",
  verifyAccessToken,
  MotorAddonConditionController.updateAddonCondition
);

// DELETE / SOFT DELETE
router.delete(
  "/delete/:addon_condition_id",
  verifyAccessToken,
  MotorAddonConditionController.deleteAddonCondition
);

// GET ACTIVE
router.get(
  "/getactive",
  verifyAccessToken,
  MotorAddonConditionController.getActiveAddonConditions
);

module.exports = router;