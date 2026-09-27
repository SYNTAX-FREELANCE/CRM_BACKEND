const express = require("express");

const router = express.Router();

const MotorOdAgeSlabController = require("./motorOdAgeSlab.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    MotorOdAgeSlabController.createOdAgeSlab
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    MotorOdAgeSlabController.getAllOdAgeSlabs
);


// GET BY ID
router.get(
    "/getbyid/:id",
    verifyAccessToken,
    MotorOdAgeSlabController.getOdAgeSlabById
);


// UPDATE
router.put(
    "/update/:id",
    verifyAccessToken,
    MotorOdAgeSlabController.updateOdAgeSlab
);


// DELETE
router.delete(
    "/delete/:id",
    verifyAccessToken,
    MotorOdAgeSlabController.deleteOdAgeSlab
);


// GET ACTIVE
router.get(
    "/getactive",
    verifyAccessToken,
    MotorOdAgeSlabController.getActiveOdAgeSlabs
);


module.exports = router;