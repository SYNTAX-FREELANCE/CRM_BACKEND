// services/leadMaster.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
    // ==================== CREATE LEAD STATUS ====================
    createLead: (leadData, callback) => {
        pool.query(
            `INSERT INTO lead_status_master 
            (status_name, display_order, is_active)
            VALUES (?, ?, ?)`,
            [
                leadData.status_name,
                leadData.display_order,
                leadData.is_active
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET ALL LEAD STATUSES ====================
    getAllLeads: (callback) => {
        pool.query(
            `SELECT status_id, status_name, display_order, is_active 
            FROM lead_status_master 
            ORDER BY display_order ASC`,
            [],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET LEAD STATUS BY ID ====================
    getLeadById: (statusId, callback) => {
        pool.query(
            `SELECT status_id, status_name, display_order, is_active 
            FROM lead_status_master 
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
            }
        );
    },

    // ==================== UPDATE LEAD STATUS ====================
    updateLead: (statusId, leadData, callback) => {
        pool.query(
            `UPDATE lead_status_master 
            SET status_name = ?, display_order = ?, is_active = ? 
            WHERE status_id = ?`,
            [
                leadData.status_name,
                leadData.display_order,
                leadData.is_active,
                statusId
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    }
};
