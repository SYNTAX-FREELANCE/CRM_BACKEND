const express = require("express");

const router = express.Router();

const MotorPolicyTermController = require("./motorPolicyTerm.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE

router.post(
    "/create",
    verifyAccessToken,
    MotorPolicyTermController.createPolicyTerm
);


// GET ALL

router.get(
    "/getall",
    verifyAccessToken,
    MotorPolicyTermController.getAllPolicyTerms
);


// GET BY ID

router.get(
    "/getbyid/:policyTermId",
    verifyAccessToken,
    MotorPolicyTermController.getPolicyTermById
);


// UPDATE

router.put(
    "/update/:policyTermId",
    verifyAccessToken,
    MotorPolicyTermController.updatePolicyTerm
);


// DELETE

router.delete(
    "/delete/:policyTermId",
    verifyAccessToken,
    MotorPolicyTermController.deletePolicyTerm
);


// GET ACTIVE

router.get(
    "/get-active",
    verifyAccessToken,
    MotorPolicyTermController.getActivePolicyTerms
);


module.exports = router;