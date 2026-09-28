const express = require("express");

const router = express.Router();

const MotorGvwSlabController = require("./motorGvwSlab.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE

router.post(
    "/create",
    verifyAccessToken,
    MotorGvwSlabController.createGvwSlab
);


// GET ALL

router.get(
    "/getall",
    verifyAccessToken,
    MotorGvwSlabController.getAllGvwSlabs
);


// GET BY ID

router.get(
    "/getbyid/:gvwSlabId",
    verifyAccessToken,
    MotorGvwSlabController.getGvwSlabById
);


// UPDATE

router.put(
    "/update/:gvwSlabId",
    verifyAccessToken,
    MotorGvwSlabController.updateGvwSlab
);


// DELETE

router.delete(
    "/delete/:gvwSlabId",
    verifyAccessToken,
    MotorGvwSlabController.deleteGvwSlab
);


// GET ACTIVE

router.get(
    "/get-active",
    verifyAccessToken,
    MotorGvwSlabController.getActiveGvwSlabs
);


module.exports = router;