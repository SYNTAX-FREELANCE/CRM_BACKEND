const express = require("express");

const router = express.Router();

const MotorProfitController = require("./motorProfit.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorProfitController.createProfit
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorProfitController.getAllProfits
);

// GET BY ID
router.get(
  "/getbyid/:profit_id",
  verifyAccessToken,
  MotorProfitController.getProfitById
);

// UPDATE
router.put(
  "/update/:profit_id",
  verifyAccessToken,
  MotorProfitController.updateProfit
);

// DELETE / SOFT DELETE
router.delete(
  "/delete/:profit_id",
  verifyAccessToken,
  MotorProfitController.deleteProfit
);

// GET ACTIVE
router.get(
  "/getactive",
  verifyAccessToken,
  MotorProfitController.getActiveProfits
);

module.exports = router;