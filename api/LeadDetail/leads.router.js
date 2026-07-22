// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const leacontroller = require("./leads.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");
// const validateTokenController = require('../controllers/validateToken.controller');

// Public routes
router.get(
    "/get-fresh-lead/:empid",
    verifyAccessToken,
    leacontroller.getLeadFreshCalls,
);
router.get(
    "/get-active-batch/:empid/:statusId",
    verifyAccessToken,
    leacontroller.getActiveBatch,
);

router.get(
    "/get-active-batch/:empid",
    verifyAccessToken,
    leacontroller.getEmployeeActiveBatch,
);

router.post(
    "/update-status",
    verifyAccessToken,
    leacontroller.updateLeadStatus,
);

router.get(
    "/get-lead-history/:leadid",
    verifyAccessToken,
    leacontroller.getLeadHistory,
);
router.get(
    "/get-call-followup/:leadid/:statusId",
    verifyAccessToken,
    leacontroller.getFollowUpDetail,
);

router.get(
    "/get-dashboard-count/:empid",
    verifyAccessToken,
    leacontroller.getDashboardCount,
);

router.get(
    "/dashboard-reminders/:empid",
    verifyAccessToken,
    leacontroller.getDashboardReminders,
);

// Global Search
router.get("/search", verifyAccessToken, leacontroller.searchCRM);

// Customer Complete Details
router.get(
    "/customer/:customerId/details",
    verifyAccessToken,
    leacontroller.getCustomerDetails,
);

router.post(
    "/admin-count",
    verifyAccessToken,
    leacontroller.getAdminDashboardCounts,
);

router.get(
    "/employee-recent-activity",
    verifyAccessToken,
    leacontroller.getEmployeeRecentAcivity,
);

router.get("/active-batches", verifyAccessToken, leacontroller.getActiveEmployees);

router.get("/employee-batch/:empid", verifyAccessToken, leacontroller.getEmployeeBatchDetail);

router.get('/employee/assigndtl/:empid', verifyAccessToken, leacontroller.getAssignEmployeeDtl)


router.post('/update-reallocation', verifyAccessToken, leacontroller.updateReallocation);

router.post('/release-block', verifyAccessToken, leacontroller.releaseBatchLock);


router.get('/top-employee', verifyAccessToken, leacontroller.getTopEmployees);


router.post('/update-expiry', verifyAccessToken, leacontroller.updateExpiryDetails);


router.post('/update-fetchStatus', verifyAccessToken, leacontroller.UpdateFetchStatus);

router.get(
    "/employee-recent-activity/:empId",
    verifyAccessToken,
    leacontroller.getSingleEmployeeRecentActivity,
);

module.exports = router;
