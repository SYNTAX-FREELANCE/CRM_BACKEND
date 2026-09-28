const express = require("express");

const router = express.Router();

const ZdRateController = require("./motorZdRate.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");


// CREATE
router.post(
    "/create",
    verifyAccessToken,
    ZdRateController.createZdRate
);


// GET ALL
router.get(
    "/getall",
    verifyAccessToken,
    ZdRateController.getAllZdRates
);


// GET BY ID
router.get(
    "/getbyid/:id",
    verifyAccessToken,
    ZdRateController.getZdRateById
);


// UPDATE
router.put(
    "/update/:id",
    verifyAccessToken,
    ZdRateController.updateZdRate
);


// DELETE
router.delete(
    "/delete/:id",
    verifyAccessToken,
    ZdRateController.deleteZdRate
);


// GET ACTIVE
router.get(
    "/getactive",
    verifyAccessToken,
    ZdRateController.getActiveZdRates
);


module.exports = router;