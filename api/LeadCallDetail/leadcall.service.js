// services/leadCallLogs.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
  // ==================== CREATE CALL LOG ====================
  createCallLog: (callData, callback) => {
    pool.query(
      `INSERT INTO lead_call_logs
        (
          lead_id,
          customer_id,
          created_by,
          phone_number,
          call_started_at,
          call_ended_at,
          duration_seconds,
          call_status,
          answered,
          source
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        callData.lead_id,
        callData.customer_id || null,
        callData.created_by || null,
        callData.phone_number,
        callData.call_started_at || null,
        callData.call_ended_at || null,
        callData.duration_seconds || 0,
        callData.call_status || "UNKNOWN",
        callData.answered ? 1 : 0,
        callData.source || "MOBILE_APP",
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      },
    );
  },

  // ==================== GET ALL CALL LOGS ====================
  getAllCallLogs: (callback) => {
    pool.query(
      `SELECT
        call_log_id,
        lead_id,
        customer_id,
        created_by,
        phone_number,
        call_started_at,
        call_ended_at,
        duration_seconds,
        call_status,
        answered,
        source,
        created_at,
        updated_at
      FROM lead_call_logs
      ORDER BY call_started_at DESC`,
      [],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      },
    );
  },

  // ==================== GET CALL LOGS BY LEAD ====================
  getCallLogsByLead: (leadId, callback) => {
    pool.query(
      `SELECT
    -- Call Log Details
    lcl.call_log_id,
    lcl.lead_id,
    lcl.customer_id,
    lcl.created_by,
    lcl.phone_number,
    lcl.call_started_at,
    lcl.call_ended_at,
    lcl.duration_seconds,
    lcl.call_status,
    lcl.answered,
    lcl.source,
    lcl.created_at AS call_created_at,
    lcl.updated_at AS call_updated_at,

    -- Lead Details
    l.status_id,
    l.assigned_to,
    l.assigned_date,
    l.is_assigned,
    l.work_status,
    l.remarks AS lead_remarks,
    l.created_at AS lead_created_at,

    -- Customer Details
    c.customer_name,
    c.mobile_number_1 AS customer_mobile,
    c.mobile_number_2 AS customer_alternate_mobile,
    c.email AS customer_email,
    c.address AS customer_address,
    c.city,
    c.district,
    c.state,
    c.pincode,

    -- Vehicle Details
    v.vehicle_id,
    v.registration_number,
    v.model AS vehicle_model,
    v.engine_number,
    v.chassis_number,
    v.rto,
    v.registration_date,
    v.known_policy_expiry_date,
    v.vehicle_maker,
    v.vehicle_class,
    v.vehicle_category,
    v.fuel_type,
    v.seat_capacity,

    -- Employee Details
    um.user_id AS employee_user_id,
    um.employee_id,
    um.name AS employee_name,
    um.mobile_number_1 AS employee_mobile,
    um.email AS employee_email,
    um.company_id,
    um.role_id,
    um.employee_level_id,
    um.user_status

FROM lead_call_logs lcl

LEFT JOIN leads l
    ON l.lead_id = lcl.lead_id

LEFT JOIN customers c
    ON c.customer_id = l.customer_id

LEFT JOIN vehicles v
    ON v.vehicle_id = l.vehicle_id

LEFT JOIN users_master um
    ON um.user_id = lcl.created_by

WHERE lcl.lead_id =?

ORDER BY lcl.call_started_at DESC;`,
      [leadId],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      },
    );
  },

  // ==================== GET CALL LOG BY ID ====================
  getCallLogById: (callLogId, callback) => {
    pool.query(
      `SELECT
        call_log_id,
        lead_id,
        customer_id,
        created_by,
        phone_number,
        call_started_at,
        call_ended_at,
        duration_seconds,
        call_status,
        answered,
        source,
        created_at,
        updated_at
      FROM lead_call_logs
      WHERE call_log_id = ?`,
      [callLogId],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        if (!result || result.length === 0) {
          return callback(null, null);
        }

        callback(null, result[0]);
      },
    );
  },

  // ==================== UPDATE CALL LOG ====================
  updateCallLog: (callLogId, callData, callback) => {
    pool.query(
      `UPDATE lead_call_logs
       SET
        call_ended_at = ?,
        duration_seconds = ?,
        call_status = ?,
        answered = ?
       WHERE call_log_id = ?`,
      [
        callData.call_ended_at || null,
        callData.duration_seconds || 0,
        callData.call_status || "UNKNOWN",
        callData.answered ? 1 : 0,
        callLogId,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      },
    );
  },


  // ==================== DAILY EMPLOYEE PRODUCTIVITY REPORT ====================

  getDailyEmployeeProductivity: (fromDate, toDate, callback) => {

    const query = `
        SELECT
            um.user_id,
            um.employee_id,
            um.name AS employee_name,

            /* Attendance Details */
            att.first_login,
            att.last_logout,
            att.total_login_sessions,
            att.total_working_duration,

            /* Call Details */
            COALESCE(cl.total_calls, 0) AS total_calls,
            COALESCE(cl.answered_calls, 0) AS answered_calls,
            COALESCE(cl.unanswered_calls, 0) AS unanswered_calls,

            /* Talking Duration */
            COALESCE(cl.total_talking_seconds, 0) AS total_talking_seconds,

            SEC_TO_TIME(
                COALESCE(cl.total_talking_seconds, 0)
            ) AS total_talking_duration,

            ROUND(
                COALESCE(cl.total_talking_seconds, 0) / 3600,
                2
            ) AS talking_hours

        FROM users_master um

        INNER JOIN (
            SELECT
                user_id,

                MIN(login_time) AS first_login,

                MAX(logout_time) AS last_logout,

                COUNT(DISTINCT id) AS total_login_sessions,

                SEC_TO_TIME(
                    TIMESTAMPDIFF(
                        SECOND,
                        MIN(login_time),
                        MAX(logout_time)
                    )
                ) AS total_working_duration

            FROM user_attendance

            WHERE login_time >= CONCAT(?, ' 00:00:00')
              AND login_time <= CONCAT(?, ' 23:59:59')

            GROUP BY user_id

        ) att ON att.user_id = um.user_id

        LEFT JOIN (
            SELECT
                created_by,

                COUNT(*) AS total_calls,

                SUM(answered = 1) AS answered_calls,

                SUM(answered = 0) AS unanswered_calls,

                SUM(
                    CASE
                        WHEN answered = 1
                        THEN duration_seconds
                        ELSE 0
                    END
                ) AS total_talking_seconds

            FROM lead_call_logs

            WHERE call_started_at >= CONCAT(?, ' 00:00:00')
              AND call_started_at <= CONCAT(?, ' 23:59:59')

            GROUP BY created_by

        ) cl ON cl.created_by = um.user_id

        ORDER BY total_talking_seconds DESC
    `;

    pool.query(
      query,
      [fromDate, toDate, fromDate, toDate],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      }
    );
  },

  // ==================== EMPLOYEE CALL DETAIL REPORT ====================

  getEmployeeCallDetails: (userId, fromDate, toDate, callback) => {

    const query = `
        SELECT
            lcl.call_log_id,

            lcl.created_by AS user_id,

            lcl.lead_id,

            COALESCE(
                lcl.customer_id,
                l.customer_id
            ) AS customer_id,

            c.customer_name,

            lcl.phone_number,

            lcl.call_started_at,
            lcl.call_ended_at,

            lcl.duration_seconds,

            SEC_TO_TIME(
                COALESCE(lcl.duration_seconds, 0)
            ) AS talking_duration,

            lcl.call_status,

            CASE
                WHEN lcl.answered = 1 THEN 'ANSWERED'
                ELSE 'UNANSWERED'
            END AS call_result,

            lcl.source

        FROM lead_call_logs lcl

        LEFT JOIN leads l
            ON l.lead_id = lcl.lead_id

        LEFT JOIN customers c
            ON c.customer_id = COALESCE(
                lcl.customer_id,
                l.customer_id
            )

        WHERE lcl.created_by = ?

          AND lcl.call_started_at >= CONCAT(?, ' 00:00:00')

          AND lcl.call_started_at <= CONCAT(?, ' 23:59:59')

        ORDER BY lcl.call_started_at DESC
    `;

    pool.query(
      query,
      [userId, fromDate, toDate],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      }
    );
  },
};