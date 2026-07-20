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
        ls.is_followup_date_required
      FROM leads l
      LEFT JOIN lead_status_master ls ON l.status_id = ls.status_id
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
        um.name AS employee_name
      FROM leads l
      LEFT JOIN lead_status_master ls ON l.status_id = ls.status_id
      INNER JOIN users_master um ON l.assigned_to = um.user_id
      WHERE um.employee_id = ?
    `;
    const params = [employeeId];

    if (fromDate && toDate) {
      query += ` AND DATE(l.created_at) BETWEEN ? AND ?`;
      params.push(fromDate, toDate);
    }

    query += ` ORDER BY l.created_at DESC`;

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
