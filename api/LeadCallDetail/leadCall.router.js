// routes/leadCallLogs.routes.js

const express = require("express");
const router = express.Router();

const leadCallLogsController = require("./leadcall.controller");

const verifyAccessToken = require("../../middleware/verifyAccessToken");

// ==================== CALL LOG ROUTES ====================

// Create Call Log
router.post(
  "/create",
  verifyAccessToken,
  leadCallLogsController.createCallLog,
);

// Get All Call Logs
router.get(
  "/getall",
  verifyAccessToken,
  leadCallLogsController.getAllCallLogs,
);

// Get Call Logs By Lead
router.get(
  "/getbylead/:leadId",
  verifyAccessToken,
  leadCallLogsController.getCallLogsByLead,
);

// Get Call Log By ID
router.get(
  "/getbyid/:callLogId",
  verifyAccessToken,
  leadCallLogsController.getCallLogById,
);

// Update Call Log
router.patch(
  "/update/:callLogId",
  verifyAccessToken,
  leadCallLogsController.updateCallLog,
);

router.get(
  "/daily-productivity",
  verifyAccessToken,
  leadCallLogsController.getDailyEmployeeProductivity
);

router.get(
  "/employee-call-details",
  verifyAccessToken,
  leadCallLogsController.getEmployeeCallDetails
);


router.get(
  "/export-daily-productivity-excel",
  verifyAccessToken,
  leadCallLogsController.exportDailyEmployeeProductivityExcel
);

router.get(
  "/export-employee-call-details-excel",
  verifyAccessToken,
  leadCallLogsController.exportEmployeeCallDetailsExcel
);
module.exports = router;