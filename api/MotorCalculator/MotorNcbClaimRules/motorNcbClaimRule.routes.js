const express = require("express");

const router = express.Router();

const MotorNcbClaimRuleController = require("./motorNcbClaimRule.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorNcbClaimRuleController.createNcbClaimRule
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorNcbClaimRuleController.getAllNcbClaimRules
);


// GET BY ID
router.get(
    "/getbyid/:id",
    verifyAccessToken,
    MotorNcbClaimRuleController.getNcbClaimRuleById
);


// UPDATE
router.put(
    "/update/:id",
    verifyAccessToken,
    MotorNcbClaimRuleController.updateNcbClaimRule
);


// DELETE
router.delete(
    "/delete/:id",
    verifyAccessToken,
    MotorNcbClaimRuleController.deleteNcbClaimRule
);


// GET ACTIVE
router.get(
    "/getactive",
    verifyAccessToken,
    MotorNcbClaimRuleController.getActiveNcbClaimRules
);


module.exports = router;