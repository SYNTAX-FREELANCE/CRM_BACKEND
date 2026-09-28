const express = require("express");

const router = express.Router();

const MotorDiscountConditionController = require("./motorDiscountCondition.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorDiscountConditionController.createDiscountCondition
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorDiscountConditionController.getAllDiscountConditions
);


// GET BY ID
router.get(
    "/getbyid/:id",
    verifyAccessToken,
    MotorDiscountConditionController.getDiscountConditionById
);


// UPDATE
router.put(
    "/update/:id",
    verifyAccessToken,
    MotorDiscountConditionController.updateDiscountCondition
);


// DELETE
router.delete(
    "/delete/:id",
    verifyAccessToken,
    MotorDiscountConditionController.deleteDiscountCondition
);


// GET ACTIVE
router.get(
    "/getactive",
    verifyAccessToken,
    MotorDiscountConditionController.getActiveDiscountConditions
);


module.exports = router;