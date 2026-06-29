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


router.get('/get-lead-history/:leadid', leacontroller.getLeadHistory)
router.get("/get-call-followup/:leadid/:statusId", leacontroller.getFollowUpDetail);


router.get('/get-dashboard-count/:empid', leacontroller.getDashboardCount);

router.get(
    "/dashboard-reminders/:empid",
    leacontroller.getDashboardReminders
);

// Global Search
router.get("/search", leacontroller.searchCRM);

// Customer Complete Details
router.get("/customer/:customerId/details", leacontroller.getCustomerDetails);

module.exports = router;
