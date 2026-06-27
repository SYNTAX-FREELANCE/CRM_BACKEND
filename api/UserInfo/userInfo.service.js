// services/userInfo.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
  // Fetch all employees with optional filters
  getAllEmployees: (filters, callback) => {
    let query = `
      SELECT 
        um.user_id, 
        um.employee_id, 
        um.name, 
        um.age, 
        um.date_of_join, 
        um.experience, 
        um.mobile_number_1, 
        um.is_active, 
        um.company_id,
        um.role_id,
        c.company_name, 
        r.role_name
      FROM users_master um
      LEFT JOIN companies c ON um.company_id = c.company_id
      LEFT JOIN roles r ON um.role_id = r.role_id
      WHERE um.is_active = 1
    `;
    const params = [];

    if (filters.emp_id) {
      query += ` AND um.employee_id LIKE ?`;
      params.push(`%${filters.emp_id}%`);
    }
    if (filters.name) {
      query += ` AND um.name LIKE ?`;
      params.push(`%${filters.name}%`);
    }
    if (filters.company_id) {
      query += ` AND um.company_id = ?`;
      params.push(filters.company_id);
    }

    query += ` ORDER BY um.name ASC`;

    pool.query(query, params, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  // Retrieve mock employee performance statistics dynamically
  getEmployeePerformance: (employeeId, range, options, callback) => {
    // Generate realistic seeds based on employee ID hash
    const seed = parseInt(employeeId) || 1000;
    
    const randomVal = (min, max, offset = 0) => {
      const x = Math.sin(seed + offset) * 10000;
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };

    if (range === "datewise") {
      const fromDate = options.fromDate || new Date().toISOString().split("T")[0];
      const toDate = options.toDate || fromDate;

      // Determine date range span
      const dayDiff = Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24));
      const dayCount = Math.max(1, dayDiff + 1);

      // Scale statistics dynamically based on day count range
      const totalCalls = randomVal(30, 55, 1) * dayCount;
      const totalAppointments = randomVal(1, 4, 2) * dayCount;
      const totalCallbacks = randomVal(2, 5, 3) * dayCount;

      const appointments = [
        { date: fromDate, time: "10:30 AM", client: "Google DeepMind Inc", purpose: "API Demo & Pricing Plan", status: "Completed" },
        { date: toDate, time: "02:15 PM", client: "Microsoft India Ltd", purpose: "Lead Follow-up Meeting", status: "Scheduled" },
        { date: fromDate, time: "04:30 PM", client: "Meta Technologies", purpose: "Contract Negotiation", status: "Cancelled" }
      ];

      const callbacks = [
        { date: fromDate, time: "11:45 AM", client: "Amazon Web Services", phone: "+91 9876543210", notes: "Call back after lunch to schedule demo" },
        { date: toDate, time: "03:30 PM", client: "Oracle Solutions Ltd", phone: "+91 8765432109", notes: "Client requested technical specifications sheet" }
      ];

      return callback(null, {
        summary: {
          calls: totalCalls,
          appointments: totalAppointments,
          callbacks: totalCallbacks
        },
        appointments,
        callbacks,
        fromDate,
        toDate
      });
    }

    if (range === "weekly") {
      // Weekly breakdown of calls/appointments
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const chartData = days.map((day, idx) => {
        return {
          label: day,
          calls: randomVal(35, 60, idx * 3),
          appointments: randomVal(1, 5, idx * 5),
          callbacks: randomVal(2, 7, idx * 7)
        };
      });

      return callback(null, {
        range: "weekly",
        chartData
      });
    }

    // Monthly breakdown (Monthwise / weekly progress)
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const chartData = weeks.map((week, idx) => {
      return {
        label: week,
        calls: randomVal(180, 260, idx * 11),
        appointments: randomVal(12, 25, idx * 13),
        callbacks: randomVal(15, 30, idx * 17)
      };
    });

    return callback(null, {
      range: "monthly",
      chartData
    });
  }
};
