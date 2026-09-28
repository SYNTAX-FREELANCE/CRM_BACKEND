const express = require("express");

const router = express.Router();

const MotorEngineCcSlabController = require("./motorEngineCcSlab.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorEngineCcSlabController.createEngineCcSlab
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorEngineCcSlabController.getAllEngineCcSlabs
);

// GET BY ID
router.get(
  "/getbyid/:engineCcSlabId",
  verifyAccessToken,
  MotorEngineCcSlabController.getEngineCcSlabById
);

// UPDATE
router.patch(
  "/update/:engineCcSlabId",
  verifyAccessToken,
  MotorEngineCcSlabController.updateEngineCcSlab
);

// DELETE
router.delete(
  "/delete/:engineCcSlabId",
  verifyAccessToken,
  MotorEngineCcSlabController.deleteEngineCcSlab
);

// GET ACTIVE
router.get(
  "/get-active",
  verifyAccessToken,
  MotorEngineCcSlabController.getActiveEngineCcSlabs
);

module.exports = router;