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
      WHERE lead_id = ?
      ORDER BY call_started_at DESC`,
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
};