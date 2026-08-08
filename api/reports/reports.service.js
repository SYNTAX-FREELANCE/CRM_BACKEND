const pool = require("../../dbconfig/dbconfig");

module.exports = {
  getPolicyReportData: (fromDate, toDate, callback) => {
    const query = `
      SELECT 
        l.lead_id, 
        l.customer_id, 
        l.vehicle_id, 
        l.policy_id, 
        l.status_id, 
        l.assigned_to, 
        l.assigned_date, 
        l.is_assigned, 
        l.remarks, 
        l.created_at, 
        l.is_locked, 
        l.work_status, 
        l.created_by, 
        l.edited_by,
        ls.status_name, 
        ls.display_order, 
        ls.is_active AS status_is_active, 
        ls.requires_followup, 
        ls.is_call_required, 
        ls.is_policy_required, 
        ls.is_followup_date_required,
        cs.customer_name
      FROM leads l
      LEFT JOIN lead_status_master ls ON l.status_id = ls.status_id
      LEFT JOIN customers cs ON l.customer_id = cs.customer_id
      WHERE DATE(l.created_at) BETWEEN ? AND ?
      ORDER BY l.created_at DESC
    `;

    pool.query(query, [fromDate, toDate], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  },

  getEmployeePerformanceData: (employeeId, fromDate, toDate, callback) => {
    let query = `
      SELECT 
        l.lead_id, 
        l.customer_id, 
        l.vehicle_id, 
        l.policy_id, 
        l.status_id, 
        l.assigned_to, 
        l.assigned_date, 
        l.is_assigned, 
        l.remarks, 
        l.created_at, 
        l.is_locked, 
        l.work_status, 
        l.created_by, 
        l.edited_by,
        ls.status_name, 
        ls.display_order, 
        ls.is_active AS status_is_active, 
        ls.requires_followup, 
        ls.is_call_required, 
        ls.is_policy_required, 
        ls.is_followup_date_required,
        um.employee_id,
        um.name AS employee_name,
        cs.customer_name,
        lf.call_outcome
      FROM leads l
      LEFT JOIN lead_status_master ls ON l.status_id = ls.status_id
      INNER JOIN users_master um ON l.assigned_to = um.user_id
      LEFT JOIN customers cs ON l.customer_id = cs.customer_id
      LEFT JOIN (
        SELECT lf1.*
        FROM lead_followups lf1
        INNER JOIN (
          SELECT lead_id, MAX(followup_id) AS max_followup_id
          FROM lead_followups
          GROUP BY lead_id
        ) lf2 ON lf1.followup_id = lf2.max_followup_id
      ) lf ON l.lead_id = lf.lead_id

      WHERE um.employee_id = ?
        AND l.status_id != 1
        AND (lf.call_outcome IS NULL OR lf.call_outcome NOT IN ('NO_ANSWER', 'SWITCHED_OFF', 'BUSY', 'WRONG NUMBER', 'WRONG_NUMBER', 'NOT INTERESTED', 'NOT_INTERESTED'))
    `;
    const params = [employeeId];

    if (fromDate && toDate) {
      query += ` AND DATE(l.status_changed_at) BETWEEN ? AND ?`;
      params.push(fromDate, toDate);
    }

    query += ` ORDER BY l.status_changed_at DESC`;

    pool.query(query, params, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  },

  getAllEmployeePerformanceData: (fromDate, toDate, filterEmployee, callback) => {
    // Handle overload if filterEmployee is omitted
    if (typeof filterEmployee === 'function') {
      callback = filterEmployee;
      filterEmployee = null;
    }

    let query = `
      SELECT 
        l.lead_id, 
        l.customer_id, 
        l.vehicle_id, 
        l.policy_id, 
        l.status_id, 
        l.assigned_to, 
        l.assigned_date, 
        l.is_assigned, 
        l.remarks, 
        l.created_at, 
        l.is_locked, 
        l.work_status, 
        l.created_by, 
        l.edited_by,
        ls.status_name, 
        ls.display_order, 
        ls.is_active AS status_is_active, 
        ls.requires_followup, 
        ls.is_call_required, 
        ls.is_policy_required, 
        ls.is_followup_date_required,
        um.employee_id,
        um.name AS employee_name,
        cs.customer_name,
        lf.call_outcome
      FROM leads l
      LEFT JOIN lead_status_master ls ON l.status_id = ls.status_id
      INNER JOIN users_master um ON l.assigned_to = um.user_id
      LEFT JOIN customers cs ON l.customer_id = cs.customer_id
      LEFT JOIN (
        SELECT lf1.*
        FROM lead_followups lf1
        INNER JOIN (
          SELECT lead_id, MAX(followup_id) AS max_followup_id
          FROM lead_followups
          GROUP BY lead_id
        ) lf2 ON lf1.followup_id = lf2.max_followup_id
      ) lf ON l.lead_id = lf.lead_id

      WHERE l.status_id != 1
        AND (lf.call_outcome IS NULL OR lf.call_outcome NOT IN ('NO_ANSWER', 'SWITCHED_OFF', 'BUSY', 'WRONG NUMBER', 'WRONG_NUMBER', 'NOT INTERESTED', 'NOT_INTERESTED'))
    `;
    const params = [];

    if (filterEmployee) {
      query += ` AND (um.employee_id = ? OR um.user_id = ?)`;
      params.push(filterEmployee, filterEmployee);
    }

    if (fromDate && toDate) {
      query += ` AND DATE(l.status_changed_at) BETWEEN ? AND ?`;
      params.push(fromDate, toDate);
    }

    query += ` ORDER BY l.status_changed_at DESC`;

    pool.query(query, params, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  },

  getEmployeeAttendanceData: (employeeId, fromDate, toDate, callback) => {
    const query = `
      SELECT 
        DATE(ua.login_time) AS attendance_date,
        MIN(ua.id) AS id, 
        ua.user_id, 
        ua.username, 
        um.name AS employee_name,
        MIN(ua.login_time) AS login_time, 
        MAX(ua.logout_time) AS logout_time, 
        MAX(ua.shift_status) AS shift_status, 
        ROUND(SUM(ua.productivity_hours), 2) AS productivity_hours, 
        MAX(ua.system_ip) AS system_ip
      FROM user_attendance ua
      LEFT JOIN users_master um ON ua.username = um.employee_id
      WHERE ua.username = ? AND DATE(ua.login_time) BETWEEN ? AND ?
      GROUP BY DATE(ua.login_time), ua.user_id, ua.username, um.name
      ORDER BY attendance_date DESC
    `;

    pool.query(query, [employeeId, fromDate, toDate], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  },

  getDetailedEmployeeAttendanceData: (employeeId, fromDate, toDate, callback) => {
    const query = `
      SELECT 
        ua.id, 
        ua.user_id, 
        ua.username, 
        ua.login_time, 
        ua.logout_time, 
        ua.shift_status, 
        ua.productivity_hours, 
        ua.system_ip,
        um.name AS employee_name
      FROM user_attendance ua
      LEFT JOIN users_master um ON ua.username = um.employee_id
      WHERE ua.username = ? AND DATE(ua.login_time) BETWEEN ? AND ?
      ORDER BY ua.login_time DESC
    `;

    pool.query(query, [employeeId, fromDate, toDate], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  }
};
