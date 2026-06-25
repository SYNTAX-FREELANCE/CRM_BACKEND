// api/CustomerMaster/customermaster.router.js
const express = require("express");
const router = express.Router();
const customerController = require("./customermaster.controller");
const { uploadCustomer } = require("./customermaster.upload");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// ==================== CUSTOMER MASTER ROUTES ====================

// Upload Excel or PDF customer file
router.post(
  "/upload",
  verifyAccessToken,
  uploadCustomer.single("file"),
  customerController.uploadCustomerFile
);

// Upload Excel vehicle file
router.post(
  "/upload-vehicles",
  verifyAccessToken,
  uploadCustomer.single("file"),
  customerController.uploadVehicleFile
);

// Get all customers
router.get("/getall", verifyAccessToken, customerController.getAllCustomers);

// Get all vehicles
router.get("/getall-vehicles", verifyAccessToken, customerController.getAllVehicles);

// Delete customer
router.delete("/delete/:customerId", verifyAccessToken, customerController.deleteCustomer);

// Delete vehicle
router.delete("/delete-vehicle/:vehicleId", verifyAccessToken, customerController.deleteVehicle);

// Get customer by ID
router.get("/getbyid/:customerId", verifyAccessToken, customerController.getCustomerById);

// Get vehicle by ID
router.get("/getbyid-vehicle/:vehicleId", verifyAccessToken, customerController.getVehicleById);

// Update customer
router.patch("/update/:customerId", verifyAccessToken, customerController.updateCustomer);

// Update vehicle
router.patch("/update-vehicle/:vehicleId", verifyAccessToken, customerController.updateVehicle);

module.exports = router;
