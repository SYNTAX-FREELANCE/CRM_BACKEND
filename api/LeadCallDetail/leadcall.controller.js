// controllers/leadCallLogs.controller.js
const leadCallLogsService = require("./leadcall.service");

module.exports = {
  // ==================== CREATE CALL LOG ====================
  createCallLog: (req, res) => {
    const callData = {
      lead_id: req.body.lead_id,
      customer_id: req.body.customer_id,
      created_by: req.body.created_by,
      phone_number: req.body.phone_number,
      call_started_at: req.body.call_started_at,
      call_ended_at: req.body.call_ended_at,
      duration_seconds: req.body.duration_seconds,
      call_status: req.body.call_status,
      answered: req.body.answered,
      source: req.body.source,
    };

    leadCallLogsService.createCallLog(
      callData,
      (err, result) => {
        if (err) {
          console.error(
            "CREATE CALL LOG ERROR:",
            err,
          );

          return res.status(500).json({
            success: 0,
            message: "Failed to create call log",
            error: err.message,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Call log created successfully",
          call_log_id: result.insertId,
        });
      },
    );
  },

  // ==================== GET ALL CALL LOGS ====================
  getAllCallLogs: (req, res) => {
    leadCallLogsService.getAllCallLogs(
      (err, result) => {
        if (err) {
          console.error(
            "GET ALL CALL LOGS ERROR:",
            err,
          );

          return res.status(500).json({
            success: 0,
            message: "Failed to get call logs",
            error: err.message,
          });
        }

        return res.status(200).json({
          success: 1,
          data: result,
        });
      },
    );
  },

  // ==================== GET CALL LOGS BY LEAD ====================
  getCallLogsByLead: (req, res) => {
    const { leadId } = req.params;

    leadCallLogsService.getCallLogsByLead(
      leadId,
      (err, result) => {
        if (err) {
          console.error(
            "GET CALL LOGS BY LEAD ERROR:",
            err,
          );

          return res.status(500).json({
            success: 0,
            message: "Failed to get lead call logs",
            error: err.message,
          });
        }

        return res.status(200).json({
          success: 1,
          data: result,
        });
      },
    );
  },

  // ==================== GET CALL LOG BY ID ====================
  getCallLogById: (req, res) => {
    const { callLogId } = req.params;

    leadCallLogsService.getCallLogById(
      callLogId,
      (err, result) => {
        if (err) {
          console.error(
            "GET CALL LOG BY ID ERROR:",
            err,
          );

          return res.status(500).json({
            success: 0,
            message: "Failed to get call log",
            error: err.message,
          });
        }

        if (!result) {
          return res.status(404).json({
            success: 0,
            message: "Call log not found",
          });
        }

        return res.status(200).json({
          success: 1,
          data: result,
        });
      },
    );
  },

  // ==================== UPDATE CALL LOG ====================
  updateCallLog: (req, res) => {
    const { callLogId } = req.params;

    const callData = {
      call_ended_at: req.body.call_ended_at,
      duration_seconds: req.body.duration_seconds,
      call_status: req.body.call_status,
      answered: req.body.answered,
    };

    leadCallLogsService.updateCallLog(
      callLogId,
      callData,
      (err, result) => {
        if (err) {
          console.error(
            "UPDATE CALL LOG ERROR:",
            err,
          );

          return res.status(500).json({
            success: 0,
            message: "Failed to update call log",
            error: err.message,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Call log updated successfully",
        });
      },
    );
  },
};