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

  // Fetch performance metrics for employee
  getEmployeePerformance: (req, res) => {
    const { employeeId } = req.params;
    const range = req.query.range || "monthly"; // weekly, monthly, datewise
    const options = {
      date: req.query.date || null,
      fromDate: req.query.fromDate || null,
      toDate: req.query.toDate || null
    };

    if (!employeeId) {
      return res.status(400).json({
        success: 0,
        message: "Employee ID is required"
      });
    }

    userInfoService.getEmployeePerformance(employeeId, range, options, (err, results) => {
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
  }
};
