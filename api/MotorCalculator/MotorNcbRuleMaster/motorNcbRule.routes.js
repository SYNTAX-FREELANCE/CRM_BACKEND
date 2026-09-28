const express = require("express");

const router = express.Router();

const MotorNcbRuleController = require("./motorNcbRule.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorNcbRuleController.createNcbRule
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorNcbRuleController.getAllNcbRules
);


// GET BY ID
router.get(
    "/getbyid/:id",
    verifyAccessToken,
    MotorNcbRuleController.getNcbRuleById
);


// UPDATE
router.put(
    "/update/:id",
    verifyAccessToken,
    MotorNcbRuleController.updateNcbRule
);


// DELETE
router.delete(
    "/delete/:id",
    verifyAccessToken,
    MotorNcbRuleController.deleteNcbRule
);


// GET ACTIVE
router.get(
    "/getactive",
    verifyAccessToken,
    MotorNcbRuleController.getActiveNcbRules
);


module.exports = router;