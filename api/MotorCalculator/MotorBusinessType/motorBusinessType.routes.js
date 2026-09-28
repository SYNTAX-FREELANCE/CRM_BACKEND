const express = require("express");

const router = express.Router();

const MotorBusinessTypeController = require("./motorBusinessType.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE

router.post(
    "/create",
    verifyAccessToken,
    MotorBusinessTypeController.createBusinessType
);


// GET ALL

router.get(
    "/getall",
    verifyAccessToken,
    MotorBusinessTypeController.getAllBusinessTypes
);


// GET BY ID

router.get(
    "/getbyid/:businessTypeId",
    verifyAccessToken,
    MotorBusinessTypeController.getBusinessTypeById
);


// UPDATE

router.put(
    "/update/:businessTypeId",
    verifyAccessToken,
    MotorBusinessTypeController.updateBusinessType
);


// DELETE

router.delete(
    "/delete/:businessTypeId",
    verifyAccessToken,
    MotorBusinessTypeController.deleteBusinessType
);


// GET ACTIVE

router.get(
    "/get-active",
    verifyAccessToken,
    MotorBusinessTypeController.getActiveBusinessTypes
);


module.exports = router;