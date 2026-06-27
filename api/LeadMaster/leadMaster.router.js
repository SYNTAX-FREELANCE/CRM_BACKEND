// routes/leadMaster.routes.js
const express = require("express");
const router = express.Router();
const leadMasterController = require("./leadMaster.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// ==================== LEAD MASTER ROUTES ====================

// Create Lead
router.post("/create", verifyAccessToken, leadMasterController.createLead);

// Get all Leads
router.get("/getall", verifyAccessToken, leadMasterController.getAllLeads);

// Get Lead by ID
router.get("/getbyid/:leadSlno", verifyAccessToken, leadMasterController.getLeadById);

// Update Lead
router.patch("/update/:leadSlno", verifyAccessToken, leadMasterController.updateLead);

module.exports = router;

