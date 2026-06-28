// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const leacontroller = require("./leads.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");
// const validateTokenController = require('../controllers/validateToken.controller');

// Public routes
router.get("/get-fresh-lead/:empid", leacontroller.getLeadFreshCalls);
router.get("/get-active-batch/:empid/:statusId", leacontroller.getActiveBatch);
router.post("/update-status", leacontroller.updateLeadStatus);

module.exports = router;
