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

      reportsService.getEmployeePerformanceData(employeeId, fromDate, toDate, (err, results) => {
        if (err) {
          console.error("exportEmployeePerformanceExcel error:", err);
          return res.status(500).send("Something went wrong while generating the report");
        }

        // Calculate status summary counts
        let totalCount = results.length;
        let soldCount = 0;
        let appointmentCount = 0;
        let quoteCount = 0;
        let callbackCount = 0;

        results.forEach((row) => {
          const name = (row.status_name || "").toUpperCase();
          if (name.includes("SOLD")) {
            soldCount++;
          } else if (name.includes("APPOINMENT") || name.includes("APPOINTMENT")) {
            appointmentCount++;
          } else if (name.includes("QUOTE")) {
            quoteCount++;
          } else if (name.includes("CALLBACK") || name.includes("CALL BACK")) {
            callbackCount++;
          }
        });

        // Header & Summary rows
        const summaryRows = [
          ["EMPLOYEE PERFORMANCE REPORT"],
          [`Employee ID: ${employeeId}`],
          [fromDate && toDate ? `Period: ${fromDate} to ${toDate}` : "Period: All Time"],
          [],
          ["SUMMARY METRICS"],
          ["Metric", "Count"],
          ["Total Data Count", totalCount],
          ["Capture Status Count", soldCount],
          ["Appointment Status Count", appointmentCount],
          ["Quote Status Count", quoteCount],
          ["Callback Status Count", callbackCount],
          [],
          ["DETAILED RECORDS"],
          ["Customer Name", "Status Name", "Assigned To", "Assigned Date", "Work Status", "Remarks"]
        ];

        // Detailed record rows
        const dataRows = results.map(row => [
          row.customer_name || "N/A",
          row.status_name || "N/A",
          row.employee_name ? `${row.employee_name} (${row.employee_id})` : (row.assigned_to || "Unassigned"),
          row.assigned_date ? new Date(row.assigned_date).toLocaleDateString() : "N/A",
          row.work_status || "N/A",
          row.remarks || ""
        ]);

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet([...summaryRows, ...dataRows]);
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

  getAllEmployeePerformance: (req, res) => {
    try {
      const { fromDate, toDate, employeeId } = req.query;
      const roleName = (req.user?.role_name || "").trim().toLowerCase();
      const roleId = String(req.user?.role || "").trim();
      const isEmployee = roleName === "employee" || roleId === "2";

      const filterEmployee = isEmployee ? (req.user?.username || req.user?.user_id || req.user?.id) : (employeeId || null);

      reportsService.getAllEmployeePerformanceData(fromDate, toDate, filterEmployee, (err, results) => {
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
      const { fromDate, toDate, employeeId } = req.query;
      const roleName = (req.user?.role_name || "").trim().toLowerCase();
      const roleId = String(req.user?.role || "").trim();
      const isEmployee = roleName === "employee" || roleId === "2";

      const filterEmployee = isEmployee ? (req.user?.username || req.user?.user_id || req.user?.id) : (employeeId || null);

      reportsService.getAllEmployeePerformanceData(fromDate, toDate, filterEmployee, (err, results) => {
        if (err) {
          console.error("exportAllEmployeePerformanceExcel error:", err);
          return res.status(500).send("Something went wrong while generating the report");
        }

        // Calculate per-employee summary counts & grand totals
        const empMap = {};
        let grandTotal = results.length;
        let grandSold = 0;
        let grandAppointment = 0;
        let grandQuote = 0;
        let grandCallback = 0;

        results.forEach((row) => {
          const empId = row.employee_id || row.assigned_to || "Unassigned";
          const empName = row.employee_name ? `${row.employee_name} (${empId})` : (row.assigned_to ? `ID: ${row.assigned_to}` : "Unassigned");
          const key = empId;

          if (!empMap[key]) {
            empMap[key] = {
              name: empName,
              totalCount: 0,
              soldCount: 0,
              appointmentCount: 0,
              quoteCount: 0,
              callbackCount: 0,
            };
          }

          empMap[key].totalCount++;

          const name = (row.status_name || "").toUpperCase();
          if (name.includes("SOLD")) {
            empMap[key].soldCount++;
            grandSold++;
          } else if (name.includes("APPOINMENT") || name.includes("APPOINTMENT")) {
            empMap[key].appointmentCount++;
            grandAppointment++;
          } else if (name.includes("QUOTE")) {
            empMap[key].quoteCount++;
            grandQuote++;
          } else if (name.includes("CALLBACK") || name.includes("CALL BACK")) {
            empMap[key].callbackCount++;
            grandCallback++;
          }
        });

        const empSummaryRows = Object.values(empMap).map(emp => [
          emp.name,
          emp.totalCount,
          emp.soldCount,
          emp.appointmentCount,
          emp.quoteCount,
          emp.callbackCount
        ]);

        // Header & Summary rows
        const summaryRows = [
          ["ALL EMPLOYEE PERFORMANCE REPORT"],
          [fromDate && toDate ? `Period: ${fromDate} to ${toDate}` : "Period: All Time"],
          [],
          ["EMPLOYEE PERFORMANCE SUMMARY"],
          ["Employee", "Total Data Count", "Capture Status", "Appointment Status", "Quote Status", "Callback Status"],
          ...empSummaryRows,
          ["Total / Summary", grandTotal, grandSold, grandAppointment, grandQuote, grandCallback],
          [],
          ["DETAILED RECORDS"],
          ["Customer Name", "Status Name", "Assigned To", "Assigned Date", "Work Status", "Remarks"]
        ];

        // Detailed record rows
        const dataRows = results.map(row => [
          row.customer_name || "N/A",
          row.status_name || "N/A",
          row.employee_name ? `${row.employee_name} (${row.employee_id})` : (row.assigned_to || "Unassigned"),
          row.assigned_date ? new Date(row.assigned_date).toLocaleDateString() : "N/A",
          row.work_status || "N/A",
          row.remarks || ""
        ]);

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.aoa_to_sheet([...summaryRows, ...dataRows]);
        xlsx.utils.book_append_sheet(workbook, worksheet, "All Employee Performance");

        const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", `attachment; filename="all_employee_performance.xlsx"`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
      });
    } catch (error) {
      console.error("exportAllEmployeePerformanceExcel controller error:", error);
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
