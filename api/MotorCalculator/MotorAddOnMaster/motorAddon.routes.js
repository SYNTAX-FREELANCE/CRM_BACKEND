const express = require("express");

const router = express.Router();

const MotorAddonController = require("./motorAddon.controller");

const verifyAccessToken = require("../../../middleware/verifyAccessToken");

// CREATE
router.post(
  "/create",
  verifyAccessToken,
  MotorAddonController.createAddon
);

// GET ALL
router.get(
  "/getall",
  verifyAccessToken,
  MotorAddonController.getAllAddons
);

// GET BY ID
router.get(
  "/getbyid/:addon_id",
  verifyAccessToken,
  MotorAddonController.getAddonById
);

// UPDATE
router.put(
  "/update/:addon_id",
  verifyAccessToken,
  MotorAddonController.updateAddon
);

// DELETE / SOFT DELETE
router.delete(
  "/delete/:addon_id",
  verifyAccessToken,
  MotorAddonController.deleteAddon
);

// GET ACTIVE
router.get(
  "/getactive",
  verifyAccessToken,
  MotorAddonController.getActiveAddons
);

module.exports = router;