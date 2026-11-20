// controllers/leadCallLogs.controller.js
const leadCallLogsService = require("./leadcall.service");
const xlsx = require("xlsx");

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

  getDailyEmployeeProductivity: (req, res) => {
    const { fromDate, toDate } = req.query;

    if (
      !fromDate ||
      !toDate ||
      !/^\d{4}-\d{2}-\d{2}$/.test(fromDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(toDate)
    ) {
      return res.status(400).json({
        success: 0,
        message: "Valid fromDate and toDate are required (YYYY-MM-DD)",
      });
    }

    if (fromDate > toDate) {
      return res.status(400).json({
        success: 0,
        message: "From date cannot be greater than to date",
      });
    }

    leadCallLogsService.getDailyEmployeeProductivity(
      fromDate,
      toDate,
      (err, result) => {
        if (err) {
          console.error("DAILY EMPLOYEE PRODUCTIVITY ERROR:", err);

          return res.status(500).json({
            success: 0,
            message: "Failed to fetch employee productivity report",
            error: err.message,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Employee productivity report fetched successfully",
          data: result,
        });
      }
    );
  },

  // ==================== EMPLOYEE CALL DETAIL REPORT ====================

  getEmployeeCallDetails: (req, res) => {
    const { userId, fromDate, toDate } = req.query;

    if (!userId || !fromDate || !toDate) {
      return res.status(400).json({
        success: 0,
        message: "User ID, from date and to date are required",
      });
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(fromDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(toDate)
    ) {
      return res.status(400).json({
        success: 0,
        message: "Date format must be YYYY-MM-DD",
      });
    }

    if (fromDate > toDate) {
      return res.status(400).json({
        success: 0,
        message: "From date cannot be greater than to date",
      });
    }

    leadCallLogsService.getEmployeeCallDetails(
      userId,
      fromDate,
      toDate,
      (err, result) => {
        if (err) {
          console.error("EMPLOYEE CALL DETAIL ERROR:", err);

          return res.status(500).json({
            success: 0,
            message: "Failed to fetch employee call details",
            error: err.message,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Employee call details fetched successfully",
          data: result,
        });
      }
    );
  },

  // ==================== EXPORT EMPLOYEE CALL DETAILS EXCEL ====================
  exportEmployeeCallDetailsExcel: (req, res) => {
    try {
      const { userId, fromDate, toDate } = req.query;

      if (!userId || !fromDate || !toDate) {
        return res.status(400).send(
          "userId, fromDate and toDate parameters are required"
        );
      }

      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(fromDate) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(toDate) ||
        fromDate > toDate
      ) {
        return res.status(400).send("Invalid date range");
      }

      leadCallLogsService.getEmployeeCallDetails(
        userId,
        fromDate,
        toDate,
        (err, results) => {
          if (err) {
            console.error(
              "exportEmployeeCallDetailsExcel error:",
              err
            );

            return res.status(500).send(
              "Something went wrong while generating the report"
            );
          }

          const formatDateTime = (dateStr) => {
            if (!dateStr) return "N/A";

            const date = new Date(dateStr);

            if (isNaN(date.getTime())) return "N/A";

            return date.toLocaleString("en-IN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });
          };

          const mappedData = results.map((row) => ({
            "Call Log ID": row.call_log_id,
            "Lead ID": row.lead_id || "",
            "Customer ID": row.customer_id || "",
            "Customer Name": row.customer_name || "N/A",
            "Phone Number": row.phone_number || "",
            "Call Started At": formatDateTime(row.call_started_at),
            "Call Ended At": formatDateTime(row.call_ended_at),
            "Duration (Seconds)": row.duration_seconds || 0,
            "Talking Duration": row.talking_duration || "00:00:00",
            "Call Status": row.call_status || "N/A",
            "Call Result": row.call_result || "N/A",
            "Source": row.source || "",
          }));

          const workbook = xlsx.utils.book_new();
          const worksheet = xlsx.utils.json_to_sheet(mappedData);

          xlsx.utils.book_append_sheet(
            workbook,
            worksheet,
            "Employee Call Details"
          );

          const buffer = xlsx.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
          });

          res.setHeader(
            "Content-Disposition",
            `attachment; filename="employee_call_details_${userId}_${fromDate}_to_${toDate}.xlsx"`
          );

          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );

          return res.send(buffer);
        }
      );
    } catch (error) {
      console.error(
        "exportEmployeeCallDetailsExcel controller error:",
        error
      );

      return res.status(500).send("Internal server error");
    }
  },

  // ==================== EXPORT DAILY EMPLOYEE PRODUCTIVITY EXCEL ====================
  exportDailyEmployeeProductivityExcel: (req, res) => {
    try {
      const { fromDate, toDate } = req.query;

      if (!fromDate || !toDate) {
        return res.status(400).send(
          "fromDate and toDate parameters are required"
        );
      }

      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(fromDate) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(toDate) ||
        fromDate > toDate
      ) {
        return res.status(400).send("Invalid date range");
      }

      leadCallLogsService.getDailyEmployeeProductivity(
        fromDate,
        toDate,
        (err, results) => {
          if (err) {
            console.error(
              "exportDailyEmployeeProductivityExcel error:",
              err
            );

            return res.status(500).send(
              "Something went wrong while generating the report"
            );
          }

          const mappedData = results.map((row) => ({
            "Employee ID": row.employee_id || "",
            "Employee Name": row.employee_name || "N/A",
            "First Login": row.first_login || "N/A",
            "Last Logout": row.last_logout || "N/A",
            "Total Login Sessions": row.total_login_sessions || 0,
            "Total Working Duration": row.total_working_duration || "00:00:00",
            "Total Calls": row.total_calls || 0,
            "Answered Calls": row.answered_calls || 0,
            "Unanswered Calls": row.unanswered_calls || 0,
            "Total Talking Duration": row.total_talking_duration || "00:00:00",
            "Talking Hours": row.talking_hours || 0,
          }));

          const workbook = xlsx.utils.book_new();
          const worksheet = xlsx.utils.json_to_sheet(mappedData);

          xlsx.utils.book_append_sheet(
            workbook,
            worksheet,
            "Employee Productivity"
          );

          const buffer = xlsx.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
          });

          res.setHeader(
            "Content-Disposition",
            `attachment; filename="employee_productivity_${fromDate}_to_${toDate}.xlsx"`
          );

          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );

          return res.send(buffer);
        }
      );
    } catch (error) {
      console.error(
        "exportDailyEmployeeProductivityExcel controller error:",
        error
      );

      return res.status(500).send("Internal server error");
    }
  },

};