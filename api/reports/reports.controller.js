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

        // Map data to match the UI table columns
        const mappedData = results.map(row => ({
          "Customer Name": row.customer_name || "N/A",
          "Vehicle ID": row.vehicle_id || "N/A",
          "Status Name": row.status_name || "N/A",
          "Assigned To": row.assigned_to || "Unassigned",
          "Assigned Date": row.assigned_date ? new Date(row.assigned_date).toLocaleDateString() : "N/A",
          "Remarks": row.remarks || ""
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

      reportsService.getEmployeePerformanceData(
        employeeId,
        fromDate,
        toDate,
        (err, results) => {
          if (err) {
            console.error(
              "exportEmployeePerformanceExcel error:",
              err
            );

            return res.status(500).send(
              "Something went wrong while generating the report"
            );
          }

          /* =========================================
             NO DATA
             ========================================= */

          if (!results || results.length === 0) {
            return res.status(404).send(
              "No performance data found for the selected employee and date range"
            );
          }

          /*
           * getEmployeePerformanceData returns
           * one aggregated row for the employee.
           */

          const row = results[0];

          const totalCalls = Number(row.total_calls || 0);
          const callbackCount = Number(row.callback_count || 0);
          const quoteCount = Number(row.quote_count || 0);
          const appointmentCount = Number(row.appointment_count || 0);
          const capturedCount = Number(row.captured_count || 0);
          const lostCount = Number(row.lost_count || 0);

          const employeeName = row.employee_name || "N/A";
          const employeeCode = row.employee_id || employeeId;

          /* =========================================
             EXCEL SUMMARY
             ========================================= */

          const summaryRows = [
            ["EMPLOYEE PERFORMANCE REPORT"],

            [`Employee: ${employeeName}`],

            [`Employee ID: ${employeeCode}`],

            [
              fromDate && toDate
                ? `Period: ${fromDate} to ${toDate}`
                : "Period: All Time"
            ],

            [],

            ["PERFORMANCE SUMMARY"],

            ["Metric", "Count"],

            ["Total Calls", totalCalls],

            ["Captured", capturedCount],

            ["Appointment", appointmentCount],

            ["Quote", quoteCount],

            ["Callback", callbackCount],

            ["Lost", lostCount],

            [],

            [
              "Total Status Outcomes",
              capturedCount +
              appointmentCount +
              quoteCount +
              callbackCount +
              lostCount
            ]
          ];

          /* =========================================
             CREATE WORKBOOK
             ========================================= */

          const workbook = xlsx.utils.book_new();

          const worksheet = xlsx.utils.aoa_to_sheet(summaryRows);

          worksheet["!cols"] = [
            { wch: 30 },
            { wch: 20 }
          ];

          xlsx.utils.book_append_sheet(
            workbook,
            worksheet,
            "Employee Performance"
          );

          /* =========================================
             GENERATE EXCEL
             ========================================= */

          const buffer = xlsx.write(workbook, {
            type: "buffer",
            bookType: "xlsx"
          });

          res.setHeader(
            "Content-Disposition",
            `attachment; filename="employee_performance_${employeeCode}.xlsx"`
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
        "exportEmployeePerformanceExcel controller error:",
        error
      );

      return res.status(500).send("Internal server error");
    }
  },

  getAllEmployeePerformance: (req, res) => {
    try {
      const { fromDate, toDate } = req.query;

      reportsService.getAllEmployeePerformanceData(fromDate, toDate, (err, results) => {
        if (err) {
          console.error("getAllEmployeePerformance error:", err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong while retrieving performance report data"
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Performance report retrieved successfully",
          data: results
        });
      });
    } catch (error) {
      console.error("getAllEmployeePerformance controller error:", error);
      return res.status(500).json({
        success: 0,
        message: "Internal server error"
      });
    }
  },

  exportAllEmployeePerformanceExcel: (req, res) => {
    try {
      const { fromDate, toDate } = req.query;

      reportsService.getAllEmployeePerformanceData(
        fromDate,
        toDate,
        (err, results) => {
          if (err) {
            console.error(
              "exportAllEmployeePerformanceExcel error:",
              err
            );

            return res.status(500).send(
              "Something went wrong while generating the report"
            );
          }

          /* =========================================
             GRAND TOTALS
             ========================================= */

          let grandTotalCalls = 0;
          let grandCallback = 0;
          let grandQuote = 0;
          let grandAppointment = 0;
          let grandCaptured = 0;
          let grandLost = 0;

          results.forEach((row) => {
            grandTotalCalls += Number(row.total_calls || 0);
            grandCallback += Number(row.callback_count || 0);
            grandQuote += Number(row.quote_count || 0);
            grandAppointment += Number(row.appointment_count || 0);
            grandCaptured += Number(row.captured_count || 0);
            grandLost += Number(row.lost_count || 0);
          });

          /* =========================================
             EMPLOYEE SUMMARY
             ========================================= */

          const empSummaryRows = results.map((row) => [
            row.employee_name
              ? `${row.employee_name} (${row.employee_id})`
              : row.employee_id || "Unknown",

            Number(row.total_calls || 0),
            Number(row.captured_count || 0),
            Number(row.appointment_count || 0),
            Number(row.quote_count || 0),
            Number(row.callback_count || 0),
            Number(row.lost_count || 0)
          ]);

          /* =========================================
             SUMMARY
             ========================================= */

          const summaryRows = [
            ["ALL EMPLOYEE PERFORMANCE REPORT"],

            [
              fromDate && toDate
                ? `Period: ${fromDate} to ${toDate}`
                : "Period: All Time"
            ],

            [],

            ["EMPLOYEE PERFORMANCE SUMMARY"],

            [
              "Employee",
              "Total Calls",
              "Captured",
              "Appointment",
              "Quote",
              "Callback",
              "Lost"
            ],

            ...empSummaryRows,

            [
              "TOTAL",
              grandTotalCalls,
              grandCaptured,
              grandAppointment,
              grandQuote,
              grandCallback,
              grandLost
            ],

            []
          ];


          const workbook = xlsx.utils.book_new();

          const worksheet = xlsx.utils.aoa_to_sheet([
            ...summaryRows,
          ]);

          /* =========================================
             COLUMN WIDTHS
             ========================================= */

          worksheet["!cols"] = [
            { wch: 30 },
            { wch: 18 },
            { wch: 18 },
            { wch: 18 },
            { wch: 18 },
            { wch: 18 },
            { wch: 18 }
          ];

          xlsx.utils.book_append_sheet(
            workbook,
            worksheet,
            "Employee Performance"
          );

          /* =========================================
             WRITE FILE
             ========================================= */

          const buffer = xlsx.write(workbook, {
            type: "buffer",
            bookType: "xlsx"
          });

          res.setHeader(
            "Content-Disposition",
            `attachment; filename="all_employee_performance.xlsx"`
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
        "exportAllEmployeePerformanceExcel controller error:",
        error
      );

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

        const formatDateTime = (dateStr) => {
          if (!dateStr) return "N/A";
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return "N/A";
          return date.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
          });
        };

        const formatProductivityHours = (val) => {
          if (!val || isNaN(val)) return "0 hrs 0 mins";
          const totalMinutes = Math.round(parseFloat(val) * 60);
          const hrs = Math.floor(totalMinutes / 60);
          const mins = totalMinutes % 60;
          return `${hrs} hrs ${mins} mins`;
        };

        const mappedData = results.map(row => ({
          "Employee ID": row.username,
          "Employee Name": row.employee_name || "N/A",
          "Login Time": formatDateTime(row.login_time),
          "Logout Time": formatDateTime(row.logout_time),
          "Productivity Hours": formatProductivityHours(row.productivity_hours),
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
  },

  getDetailedEmployeeAttendance: (req, res) => {
    try {
      const { employeeId, fromDate, toDate } = req.query;

      if (!employeeId || !fromDate || !toDate) {
        return res.status(200).json({
          success: 0,
          message: "employeeId, fromDate and toDate parameters are required"
        });
      }

      reportsService.getDetailedEmployeeAttendanceData(employeeId, fromDate, toDate, (err, results) => {
        if (err) {
          console.error("getDetailedEmployeeAttendance error:", err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong while retrieving detailed attendance report data"
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Detailed employee attendance report retrieved successfully",
          data: results
        });
      });
    } catch (error) {
      console.error("getDetailedEmployeeAttendance controller error:", error);
      return res.status(500).json({
        success: 0,
        message: "Internal server error"
      });
    }
  },

  exportDetailedEmployeeAttendanceExcel: (req, res) => {
    try {
      const { employeeId, fromDate, toDate } = req.query;

      if (!employeeId || !fromDate || !toDate) {
        return res.status(400).send("employeeId, fromDate and toDate parameters are required");
      }

      reportsService.getDetailedEmployeeAttendanceData(employeeId, fromDate, toDate, (err, results) => {
        if (err) {
          console.error("exportDetailedEmployeeAttendanceExcel error:", err);
          return res.status(500).send("Something went wrong while generating the report");
        }

        const formatDateTime = (dateStr) => {
          if (!dateStr) return "N/A";
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return "N/A";
          return date.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
          });
        };

        const formatProductivityHours = (val) => {
          if (!val || isNaN(val)) return "0 hrs 0 mins";
          const totalMinutes = Math.round(parseFloat(val) * 60);
          const hrs = Math.floor(totalMinutes / 60);
          const mins = totalMinutes % 60;
          return `${hrs} hrs ${mins} mins`;
        };

        const mappedData = results.map(row => ({
          "Employee ID": row.username,
          "Employee Name": row.employee_name || "N/A",
          "Login Time": formatDateTime(row.login_time),
          "Logout Time": formatDateTime(row.logout_time),
          "Productivity Hours": formatProductivityHours(row.productivity_hours),
          "System IP": row.system_ip || ""
        }));

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(mappedData);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Detailed Attendance Report");

        const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", `attachment; filename="detailed_attendance_report_${employeeId}_${fromDate}_to_${toDate}.xlsx"`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
      });
    } catch (error) {
      console.error("exportDetailedEmployeeAttendanceExcel controller error:", error);
      return res.status(500).send("Internal server error");
    }
  }
};
