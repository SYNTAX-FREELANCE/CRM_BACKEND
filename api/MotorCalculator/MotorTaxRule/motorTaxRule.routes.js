
const express = require("express");

const router = express.Router();

const MotorTaxRuleController = require("./motorTaxRule.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorTaxRuleController.createTaxRule
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorTaxRuleController.getAllTaxRules
);

// GET BY ID
router.get(
  "/getbyid/:tax_rule_id",
  verifyAccessToken,
  MotorTaxRuleController.getTaxRuleById
);

// UPDATE
router.put(
  "/update/:tax_rule_id",
  verifyAccessToken,
  MotorTaxRuleController.updateTaxRule
);

// DELETE / SOFT DELETE
router.delete(
  "/delete/:tax_rule_id",
  verifyAccessToken,
  MotorTaxRuleController.deleteTaxRule
);

// GET ACTIVE
router.get(
  "/getactive",
  verifyAccessToken,
  MotorTaxRuleController.getActiveTaxRules
);

module.exports = router;