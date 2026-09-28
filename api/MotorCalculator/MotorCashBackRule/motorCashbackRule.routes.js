const express = require("express");

const router = express.Router();

const MotorCashbackRuleController = require("./motorCashbackRule.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorCashbackRuleController.createCashbackRule
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorCashbackRuleController.getAllCashbackRules
);

// GET BY ID
router.get(
  "/getbyid/:cashback_rule_id",
  verifyAccessToken,
  MotorCashbackRuleController.getCashbackRuleById
);

// UPDATE
router.put(
  "/update/:cashback_rule_id",
  verifyAccessToken,
  MotorCashbackRuleController.updateCashbackRule
);

// DELETE
router.delete(
  "/delete/:cashback_rule_id",
  verifyAccessToken,
  MotorCashbackRuleController.deleteCashbackRule
);

// GET ACTIVE
router.get(
  "/getactive",
  verifyAccessToken,
  MotorCashbackRuleController.getActiveCashbackRules
);

module.exports = router;