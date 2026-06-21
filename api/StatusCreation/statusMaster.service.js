// services/statusMaster.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
  // ==================== CREATE STATUS ====================
  createStatus: (statusData, callback) => {
    pool.query(
      `INSERT INTO statuses 
            (status_name,  alias,  is_active, created_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [statusData.status_name, statusData.alias, statusData.is_active],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== GET ALL STATUSES ====================
  getAllStatuses: (callback) => {
    pool.query(
      `SELECT * FROM statuses 
            ORDER BY created_at DESC`,
      [],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== GET STATUS BY ID ====================
  getStatusById: (statusId, callback) => {
    pool.query(
      `SELECT * FROM statuses 
            WHERE status_id = ?`,
      [statusId],
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

  // ==================== UPDATE STATUS ====================
  updateStatus: (statusId, statusData, callback) => {
    pool.query(
      `UPDATE statuses 
            SET status_name = ?, alias = ?,
                is_active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE status_id = ?`,
      [
        statusData.status_name,
        statusData.alias,
        statusData.is_active,
        statusId,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== DELETE STATUS (SOFT DELETE) ====================
  deleteStatus: (statusId, callback) => {
    pool.query(
      `UPDATE statuses 
            SET is_active = 0, updated_at = CURRENT_TIMESTAMP 
            WHERE status_id = ?`,
      [statusId],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== GET ACTIVE STATUSES ONLY ====================
  getActiveStatuses: (callback) => {
    pool.query(
      `SELECT * FROM status_master 
            WHERE is_active = 1
            ORDER BY status_name ASC`,
      [],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },
};
