const express = require("express");

const router = express.Router();

const MotorPolicyTypeController = require("./motorPolicyType.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE

router.post(
    "/create",
    verifyAccessToken,
    MotorPolicyTypeController.createPolicyType
);


// GET ALL

router.get(
    "/getall",
    verifyAccessToken,
    MotorPolicyTypeController.getAllPolicyTypes
);


// GET BY ID

router.get(
    "/getbyid/:policyTypeId",
    verifyAccessToken,
    MotorPolicyTypeController.getPolicyTypeById
);


// UPDATE

router.put(
    "/update/:policyTypeId",
    verifyAccessToken,
    MotorPolicyTypeController.updatePolicyType
);


// DELETE

router.delete(
    "/delete/:policyTypeId",
    verifyAccessToken,
    MotorPolicyTypeController.deletePolicyType
);


// GET ACTIVE

router.get(
    "/get-active",
    verifyAccessToken,
    MotorPolicyTypeController.getActivePolicyTypes
);


module.exports = router;