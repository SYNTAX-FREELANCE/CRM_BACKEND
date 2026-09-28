const express = require("express");

const router = express.Router();

const MotorCommissionRuleController = require("./motorCommissionRule.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorCommissionRuleController.createCommissionRule
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorCommissionRuleController.getAllCommissionRules
);

// GET BY ID
router.get(
  "/getbyid/:commission_rule_id",
  verifyAccessToken,
  MotorCommissionRuleController.getCommissionRuleById
);

// UPDATE
router.put(
  "/update/:commission_rule_id",
  verifyAccessToken,
  MotorCommissionRuleController.updateCommissionRule
);

// DELETE
router.delete(
  "/delete/:commission_rule_id",
  verifyAccessToken,
  MotorCommissionRuleController.deleteCommissionRule
);

// GET ACTIVE
router.get(
  "/getactive",
  verifyAccessToken,
  MotorCommissionRuleController.getActiveCommissionRules
);

module.exports = router;