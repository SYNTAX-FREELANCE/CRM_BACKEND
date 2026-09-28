const express = require("express");

const router = express.Router();

const MotorTpRateSlabController = require("./motorTpRateSlab.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorTpRateSlabController.createTpRateSlab
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorTpRateSlabController.getAllTpRateSlabs
);


// GET BY ID
router.get(
    "/getbyid/:id",
    verifyAccessToken,
    MotorTpRateSlabController.getTpRateSlabById
);


// UPDATE
router.put(
    "/update/:id",
    verifyAccessToken,
    MotorTpRateSlabController.updateTpRateSlab
);


// DELETE
router.delete(
    "/delete/:id",
    verifyAccessToken,
    MotorTpRateSlabController.deleteTpRateSlab
);


// GET ACTIVE
router.get(
    "/getactive",
    verifyAccessToken,
    MotorTpRateSlabController.getActiveTpRateSlabs
);


module.exports = router;