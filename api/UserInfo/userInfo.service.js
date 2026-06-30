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

  // Fetch employee details from users_master with given employeeId (user_id)
  getEmployeePerformance: (employeeId, callback) => {

    const query = `
     SELECT user_id, employee_id, name, age, gender, qualification_id, date_of_join, experience, mobile_number_1, mobile_number_2,
     aadhar_number, um.company_id, um.role_id, um.user_status, um.is_active,role_name,company_name
     FROM users_master as um
     left join roles ON roles.role_id=um.role_id
     left join companies ON companies.company_id=um.company_id
     where user_id=?
    `;

    pool.query(query, [employeeId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  // Fetch check in/out and productivity hours for employee
  getAttendanceByDate: (userId, date, callback) => {
    const query = `
      SELECT 
        user_id, 
        MIN(login_time) AS first_login, 
        MAX(logout_time) AS last_logout, 
        SUM(productivity_hours) AS total_productivity_hours 
      FROM user_attendance 
      WHERE user_id = ? 
        AND DATE(login_time) = ? 
      GROUP BY user_id
    `;

    pool.query(query, [userId, date], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result[0] || null);
    });
  }
};
