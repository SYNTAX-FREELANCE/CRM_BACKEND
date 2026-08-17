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
    const startDateTime = `${fromDate} 00:00:00`;
    const endDateTime = `${toDate} 23:59:59.999999`;
    const query = `
    SELECT
    user_id,
    employee_id,
    employee_name,

    SUM(total_calls) AS total_calls,
    SUM(callback_count) AS callback_count,
    SUM(quote_count) AS quote_count,
    SUM(appointment_count) AS appointment_count,
    SUM(captured_count) AS captured_count,
    SUM(lost_count) AS lost_count

FROM
(
    /* =========================================
       FOLLOW-UP / CALL ACTIVITY
       ========================================= */

    SELECT
        lf.created_by AS user_id,

        um.employee_id,
        um.name AS employee_name,

        COUNT(lf.followup_id) AS total_calls,

        SUM(
            CASE
                WHEN lf.status_id = 2 THEN 1
                ELSE 0
            END
        ) AS callback_count,

        SUM(
            CASE
                WHEN lf.status_id = 3 THEN 1
                ELSE 0
            END
        ) AS quote_count,

        SUM(
            CASE
                WHEN lf.status_id = 4 THEN 1
                ELSE 0
            END
        ) AS appointment_count,

        0 AS captured_count,
        0 AS lost_count

    FROM lead_followups lf

    INNER JOIN users_master um
        ON um.user_id = lf.created_by

    WHERE lf.created_by = ?

      AND lf.created_at >= ?
      AND lf.created_at <  ?

    GROUP BY
        lf.created_by,
        um.employee_id,
        um.name


    UNION ALL


    /* =========================================
       STATUS CHANGE ACTIVITY
       ========================================= */

    SELECT
        lsh.changed_by AS user_id,

        um.employee_id,
        um.name AS employee_name,

        0 AS total_calls,
        0 AS callback_count,
        0 AS quote_count,
        0 AS appointment_count,

        SUM(
            CASE
                WHEN lsh.new_status_id = 5 THEN 1
                ELSE 0
            END
        ) AS captured_count,

        SUM(
            CASE
                WHEN lsh.new_status_id = 6 THEN 1
                ELSE 0
            END
        ) AS lost_count

    FROM lead_status_history lsh

    INNER JOIN users_master um
        ON um.user_id = lsh.changed_by

    WHERE lsh.changed_by = ?

      AND lsh.changed_at >= ?
      AND lsh.changed_at <  ?

    GROUP BY
        lsh.changed_by,
        um.employee_id,
        um.name

) report

GROUP BY
    user_id,
    employee_id,
    employee_name
    `
    
    pool.query(query, [employeeId, startDateTime, endDateTime, employeeId, startDateTime, endDateTime], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  },

  getAllEmployeePerformanceData: (fromDate, toDate, callback) => {
    const startDateTime = `${fromDate} 00:00:00`;
    const endDateTime = `${toDate} 23:59:59.999999`;
    const query = `
    SELECT
    u.user_id,
    u.employee_id,
    u.name AS employee_name,

    COALESCE(a.total_calls, 0) AS total_calls,
    COALESCE(a.callback_count, 0) AS callback_count,
    COALESCE(a.quote_count, 0) AS quote_count,
    COALESCE(a.appointment_count, 0) AS appointment_count,
    COALESCE(a.captured_count, 0) AS captured_count,
    COALESCE(a.lost_count, 0) AS lost_count

FROM users_master u

LEFT JOIN
(
    SELECT
        user_id,

        SUM(total_calls) AS total_calls,
        SUM(callback_count) AS callback_count,
        SUM(quote_count) AS quote_count,
        SUM(appointment_count) AS appointment_count,
        SUM(captured_count) AS captured_count,
        SUM(lost_count) AS lost_count

    FROM
    (
        /* =========================================
           FOLLOW-UP / CALL ACTIVITY
           ========================================= */

        SELECT
            lf.created_by AS user_id,

            COUNT(lf.followup_id) AS total_calls,

            SUM(
                CASE
                    WHEN lf.status_id = 2 THEN 1
                    ELSE 0
                END
            ) AS callback_count,

            SUM(
                CASE
                    WHEN lf.status_id = 3 THEN 1
                    ELSE 0
                END
            ) AS quote_count,

            SUM(
                CASE
                    WHEN lf.status_id = 4 THEN 1
                    ELSE 0
                END
            ) AS appointment_count,

            0 AS captured_count,
            0 AS lost_count

        FROM lead_followups lf

        WHERE lf.created_at >= ?
          AND lf.created_at < ?

        GROUP BY
            lf.created_by


        UNION ALL


        /* =========================================
           STATUS CHANGE ACTIVITY
           ========================================= */

        SELECT
            lsh.changed_by AS user_id,

            0 AS total_calls,
            0 AS callback_count,
            0 AS quote_count,
            0 AS appointment_count,

            SUM(
                CASE
                    WHEN lsh.new_status_id = 5 THEN 1
                    ELSE 0
                END
            ) AS captured_count,

            SUM(
                CASE
                    WHEN lsh.new_status_id = 6 THEN 1
                    ELSE 0
                END
            ) AS lost_count

        FROM lead_status_history lsh

        WHERE lsh.changed_at >= ?
          AND lsh.changed_at <  ?

        GROUP BY
            lsh.changed_by

    ) activity

    GROUP BY
        user_id

) a
    ON a.user_id = u.user_id

WHERE u.is_active = 1
  AND u.role_id != 6

ORDER BY
    u.name
    `
    pool.query(query, [startDateTime, endDateTime, startDateTime, endDateTime], (err, results) => {
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
