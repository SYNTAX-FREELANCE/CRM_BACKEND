// controllers/userInfo.controller.js
const userInfoService = require("./userInfo.service");

module.exports = {
  // Fetch employees list
  getEmployees: (req, res) => {
    const filters = {
      emp_id: req.query.emp_id || null,
      name: req.query.name || null,
      company_id: req.query.company_id ? parseInt(req.query.company_id) : null
    };

    userInfoService.getAllEmployees(filters, (err, results) => {
      if (err) {
        console.error("getEmployees error:", err);
        return res.status(500).json({
          success: 0,
          message: "Failed to retrieve employee list"
        });
      }
      return res.status(200).json({
        success: 1,
        data: results
      });
    });
  },

  getEmployeesDetailsById: (req, res) => {
    const { empid } = req.params;
    userInfoService.getSingleEmployeeDetails(empid, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to retrieve Employee Details"
        });
      }
      return res.status(200).json({
        success: 1,
        data: results
      });
    });
  },


  // Fetch performance metrics for employee
  getEmployeePerformance: (req, res) => {
    const { employeeId } = req.params;
    if (!employeeId) {
      return res.status(400).json({
        success: 0,
        message: "Employee ID is required"
      });
    }

    userInfoService.getEmployeePerformance(employeeId, (err, results) => {
      if (err) {
        console.error("getEmployeePerformance error:", err);
        return res.status(500).json({
          success: 0,
          message: "Failed to retrieve performance metrics"
        });
      }
      return res.status(200).json({
        success: 1,
        data: results
      });
    });
  },

  // Fetch call center performance metrics (leads, appointments, callbacks, sold) for employee
  getCallCenterPerformance: (req, res) => {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    if (!employeeId) {
      return res.status(400).json({
        success: 0,
        message: "Employee ID is required"
      });
    }

    const start = startDate || new Date().toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];

    userInfoService.getCallCenterPerformance(employeeId, start, end, (err, results) => {
      if (err) {
        console.error("getCallCenterPerformance error:", err);
        return res.status(500).json({
          success: 0,
          message: "Failed to retrieve call center performance metrics"
        });
      }
      return res.status(200).json({
        success: 1,
        data: results
      });
    });
  },

  // Fetch check-in/out and productivity hours for employee
  getAttendanceByDate: (req, res) => {
    const { userId, date } = req.query;
    if (!userId || !date) {
      return res.status(400).json({
        success: 0,
        message: "User ID and Date are required"
      });
    }

    userInfoService.getAttendanceByDate(userId, date, (err, result) => {
      if (err) {
        console.error("getAttendanceByDate error:", err);
        return res.status(500).json({
          success: 0,
          message: "Failed to retrieve attendance details"
        });
      }
      return res.status(200).json({
        success: 1,
        data: result
      });
    });
  }
};
