const reportsService = require("./reports.service");
const xlsx = require("xlsx");

module.exports = {
  getPolicyReport: (req, res) => {
    try {
      const { fromDate, toDate } = req.query;
      
      if (!fromDate || !toDate) {
        return res.status(200).json({
          success: 0,
          message: "fromDate and toDate parameters are required"
        });
      }

      reportsService.getPolicyReportData(fromDate, toDate, (err, results) => {
        if (err) {
          console.error("getPolicyReport error:", err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong while retrieving report data"
          });
        }
        
        return res.status(200).json({
          success: 1,
          message: "Policy report retrieved successfully",
          data: results
        });
      });
    } catch (error) {
      console.error("getPolicyReport controller error:", error);
      return res.status(500).json({
        success: 0,
        message: "Internal server error"
      });
    }
  },

  exportPolicyReportExcel: (req, res) => {
    try {
      const { fromDate, toDate } = req.query;
      
      if (!fromDate || !toDate) {
        return res.status(400).send("fromDate and toDate parameters are required");
      }

      reportsService.getPolicyReportData(fromDate, toDate, (err, results) => {
        if (err) {
          console.error("exportPolicyReportExcel error:", err);
          return res.status(500).send("Something went wrong while generating the report");
        }

        // Map data to clean user-friendly Excel column headers
        const mappedData = results.map(row => ({
          "Lead ID": row.lead_id,
          "Customer ID": row.customer_id,
          "Vehicle ID": row.vehicle_id,
          "Policy ID": row.policy_id,
          "Status ID": row.status_id,
          "Status Name": row.status_name || "N/A",
          "Assigned To": row.assigned_to || "Unassigned",
          "Assigned Date": row.assigned_date ? new Date(row.assigned_date).toLocaleDateString() : "N/A",
          "Is Assigned": row.is_assigned === 1 ? "Yes" : "No",
          "Remarks": row.remarks || "",
          "Created At": row.created_at ? new Date(row.created_at).toLocaleString() : "N/A",
          "Is Locked": row.is_locked === 1 ? "Yes" : "No",
          "Work Status": row.work_status || "",
          "Created By": row.created_by || "",
          "Edited By": row.edited_by || "",
          "Status Display Order": row.display_order || "",
          "Status Active": row.status_is_active === 1 ? "Active" : "Inactive",
          "Requires Follow-up": row.requires_followup === 1 ? "Yes" : "No",
          "Is Call Required": row.is_call_required === 1 ? "Yes" : "No",
          "Is Policy Required": row.is_policy_required === 1 ? "Yes" : "No",
          "Is Follow-up Date Required": row.is_followup_date_required === 1 ? "Yes" : "No"
        }));

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(mappedData);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Policy Report");
        
        const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", `attachment; filename="policy_report_${fromDate}_to_${toDate}.xlsx"`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
      });
    } catch (error) {
      console.error("exportPolicyReportExcel controller error:", error);
      return res.status(500).send("Internal server error");
    }
  },

  getEmployeePerformance: (req, res) => {
    try {
      const { employeeId, fromDate, toDate } = req.query;
      
      if (!employeeId) {
        return res.status(200).json({
          success: 0,
          message: "employeeId parameter is required"
        });
      }

      reportsService.getEmployeePerformanceData(employeeId, fromDate, toDate, (err, results) => {
        if (err) {
          console.error("getEmployeePerformance error:", err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong while retrieving performance report data"
          });
        }
        
        return res.status(200).json({
          success: 1,
          message: "Employee performance report retrieved successfully",
          data: results
        });
      });
    } catch (error) {
      console.error("getEmployeePerformance controller error:", error);
      return res.status(500).json({
        success: 0,
        message: "Internal server error"
      });
    }
  },

  exportEmployeePerformanceExcel: (req, res) => {
    try {
      const { employeeId, fromDate, toDate } = req.query;
      
      if (!employeeId) {
        return res.status(400).send("employeeId parameter is required");
      }

      reportsService.getEmployeePerformanceData(employeeId, fromDate, toDate, (err, results) => {
        if (err) {
          console.error("exportEmployeePerformanceExcel error:", err);
          return res.status(500).send("Something went wrong while generating the report");
        }

        // Map data to clean user-friendly Excel column headers
        const mappedData = results.map(row => ({
          "Lead ID": row.lead_id,
          "Customer ID": row.customer_id,
          "Vehicle ID": row.vehicle_id,
          "Policy ID": row.policy_id,
          "Status ID": row.status_id,
          "Status Name": row.status_name || "N/A",
          "Assigned To": row.employee_name ? `${row.employee_name} (${row.employee_id})` : (row.assigned_to || "Unassigned"),
          "Assigned Date": row.assigned_date ? new Date(row.assigned_date).toLocaleDateString() : "N/A",
          "Is Assigned": row.is_assigned === 1 ? "Yes" : "No",
          "Remarks": row.remarks || "",
          "Created At": row.created_at ? new Date(row.created_at).toLocaleString() : "N/A",
          "Is Locked": row.is_locked === 1 ? "Yes" : "No",
          "Work Status": row.work_status || "",
          "Created By": row.created_by || "",
          "Edited By": row.edited_by || "",
          "Status Display Order": row.display_order || "",
          "Status Active": row.status_is_active === 1 ? "Active" : "Inactive",
          "Requires Follow-up": row.requires_followup === 1 ? "Yes" : "No",
          "Is Call Required": row.is_call_required === 1 ? "Yes" : "No",
          "Is Policy Required": row.is_policy_required === 1 ? "Yes" : "No",
          "Is Follow-up Date Required": row.is_followup_date_required === 1 ? "Yes" : "No"
        }));

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(mappedData);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Employee Performance");
        
        const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", `attachment; filename="employee_performance_${employeeId}.xlsx"`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
      });
    } catch (error) {
      console.error("exportEmployeePerformanceExcel controller error:", error);
      return res.status(500).send("Internal server error");
    }
  },

  getEmployeeAttendance: (req, res) => {
    try {
      const { employeeId, fromDate, toDate } = req.query;
      
      if (!employeeId || !fromDate || !toDate) {
        return res.status(200).json({
          success: 0,
          message: "employeeId, fromDate and toDate parameters are required"
        });
      }

      reportsService.getEmployeeAttendanceData(employeeId, fromDate, toDate, (err, results) => {
        if (err) {
          console.error("getEmployeeAttendance error:", err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong while retrieving attendance report data"
          });
        }
        
        return res.status(200).json({
          success: 1,
          message: "Employee attendance report retrieved successfully",
          data: results
        });
      });
    } catch (error) {
      console.error("getEmployeeAttendance controller error:", error);
      return res.status(500).json({
        success: 0,
        message: "Internal server error"
      });
    }
  },

  exportEmployeeAttendanceExcel: (req, res) => {
    try {
      const { employeeId, fromDate, toDate } = req.query;
      
      if (!employeeId || !fromDate || !toDate) {
        return res.status(400).send("employeeId, fromDate and toDate parameters are required");
      }

      reportsService.getEmployeeAttendanceData(employeeId, fromDate, toDate, (err, results) => {
        if (err) {
          console.error("exportEmployeeAttendanceExcel error:", err);
          return res.status(500).send("Something went wrong while generating the report");
        }

        const mappedData = results.map(row => ({
          "Log ID": row.id,
          "User ID": row.user_id,
          "Employee ID (Username)": row.username,
          "Employee Name": row.employee_name || "N/A",
          "Login Time": row.login_time ? new Date(row.login_time).toLocaleString() : "N/A",
          "Logout Time": row.logout_time ? new Date(row.logout_time).toLocaleString() : "N/A",
          "Shift Status": row.shift_status || "",
          "Productivity Hours": row.productivity_hours || "0",
          "System IP": row.system_ip || ""
        }));

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(mappedData);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
        
        const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", `attachment; filename="attendance_report_${employeeId}_${fromDate}_to_${toDate}.xlsx"`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
      });
    } catch (error) {
      console.error("exportEmployeeAttendanceExcel controller error:", error);
      return res.status(500).send("Internal server error");
    }
  }
};
