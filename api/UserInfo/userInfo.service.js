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
    um.gender,
    um.age,
    um.mobile_number_1,
    um.date_of_join,
    um.experience,
    um.dob,
    um.email,
    um.address,
    um.is_admin,
    c.company_name,
    r.role_name,
    COUNT(l.lead_id) AS total_assigned,

    SUM(
        CASE
            WHEN l.work_status <> 'PENDING'
            THEN 1
            ELSE 0
        END
    ) AS total_fetched,

    SUM(
        CASE
            WHEN l.status_id = 5
            THEN 1
            ELSE 0
        END
    ) AS total_sold,

    SUM(
        CASE
            WHEN l.status_id = 6
            THEN 1
            ELSE 0
        END
    ) AS total_lost

FROM users_master um

LEFT JOIN companies c
    ON c.company_id = um.company_id

LEFT JOIN roles r
    ON r.role_id = um.role_id

LEFT JOIN leads l
    ON l.assigned_to = um.user_id

WHERE
    um.is_active = 1

GROUP BY
    um.user_id,
    um.employee_id,
    um.name,
    um.gender,
    um.age,
    um.mobile_number_1,
    um.date_of_join,
    um.experience,
       um.email,
    um.address,
    c.company_name,
    r.role_name

ORDER BY
    um.name`;
    // const params = [];

    // if (filters.emp_id) {
    //   query += ` AND um.employee_id LIKE ?`;
    //   params.push(`%${filters.emp_id}%`);
    // }
    // if (filters.name) {
    //   query += ` AND um.name LIKE ?`;
    //   params.push(`%${filters.name}%`);
    // }
    // if (filters.company_id) {
    //   query += ` AND um.company_id = ?`;
    //   params.push(filters.company_id);
    // }

    // query += ` ORDER BY um.name ASC`;

    pool.query(query, [], (err, results) => {
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

  // Fetch employee performance counts from leads table by user_id and date range
  getCallCenterPerformance: (employeeId, startDate, endDate, callback) => {
    const query = `
      SELECT 
          DATE(l.assigned_date) AS date,
          COUNT(l.lead_id) AS leads,
          COUNT(CASE WHEN UPPER(s.status_name) IN ('APPOINMENT', 'APPOINTMENT') THEN 1 END) AS appointments,
          COUNT(CASE WHEN UPPER(s.status_name) = 'CALLBACK' THEN 1 END) AS callbacks,
          COUNT(CASE WHEN UPPER(s.status_name) = 'SOLD' THEN 1 END) AS sold
      FROM leads l
      JOIN lead_status_master s ON l.status_id = s.status_id
      WHERE l.assigned_to = ? 
        AND DATE(l.assigned_date) BETWEEN ? AND ?
      GROUP BY DATE(l.assigned_date)
      ORDER BY DATE(l.assigned_date) ASC
    `;

    pool.query(query, [employeeId, startDate, endDate], (err, results) => {
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
