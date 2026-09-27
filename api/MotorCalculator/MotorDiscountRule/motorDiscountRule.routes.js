const express = require("express");

const router = express.Router();

const MotorDiscountRuleController = require("./motorDiscountRule.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorDiscountRuleController.createDiscountRule
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorDiscountRuleController.getAllDiscountRules
);


// GET BY ID
router.get(
    "/getbyid/:id",
    verifyAccessToken,
    MotorDiscountRuleController.getDiscountRuleById
);


// UPDATE
router.put(
    "/update/:id",
    verifyAccessToken,
    MotorDiscountRuleController.updateDiscountRule
);


// DELETE
router.delete(
    "/delete/:id",
    verifyAccessToken,
    MotorDiscountRuleController.deleteDiscountRule
);


// GET ACTIVE
router.get(
    "/getactive",
    verifyAccessToken,
    MotorDiscountRuleController.getActiveDiscountRules
);


module.exports = router;