const express = require("express");

const router = express.Router();

const MotorAddonRuleController = require("./motorAddonRule.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorAddonRuleController.createAddonRule
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorAddonRuleController.getAllAddonRules
);

// GET BY ID
router.get(
  "/getbyid/:addon_rule_id",
  verifyAccessToken,
  MotorAddonRuleController.getAddonRuleById
);

// UPDATE
router.put(
  "/update/:addon_rule_id",
  verifyAccessToken,
  MotorAddonRuleController.updateAddonRule
);

// DELETE / SOFT DELETE
router.delete(
  "/delete/:addon_rule_id",
  verifyAccessToken,
  MotorAddonRuleController.deleteAddonRule
);

// GET ACTIVE
router.get(
  "/getactive",
  verifyAccessToken,
  MotorAddonRuleController.getActiveAddonRules
);

module.exports = router;