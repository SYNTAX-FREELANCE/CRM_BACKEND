// routes/vehicleTypeMaster.routes.js
const express = require("express");
const router = express.Router();
const vehicleTypeMasterController = require("./vehicleTypeMaster.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// ==================== VEHICLE TYPE MASTER ROUTES ====================

// Create Vehicle Type
router.post("/create", verifyAccessToken, vehicleTypeMasterController.createVehicleType);

// Get all Vehicle Types
router.get("/getall", verifyAccessToken, vehicleTypeMasterController.getAllVehicleTypes);

// Get Vehicle Type by ID
router.get("/getbyid/:vehicleTypeSlno", verifyAccessToken, vehicleTypeMasterController.getVehicleTypeById);

// Update Vehicle Type
router.patch("/update/:vehicleTypeSlno", verifyAccessToken, vehicleTypeMasterController.updateVehicleType);

module.exports = router;
