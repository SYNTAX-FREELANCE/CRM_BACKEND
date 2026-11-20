const pool = require("../../dbconfig/dbconfig");

module.exports = {

    // ==================== CREATE CLAIM STATUS ====================
    createClaimStatus: (statusData, callback) => {

        pool.query(
            `INSERT INTO policy_claim_status_master
            (
                claim_status_name,
                claim_status_code,
                claim_status_description,
                claim_status_color,
                sequence_no,
                is_initial,
                is_final,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                statusData.claim_status_name,
                statusData.claim_status_code,
                statusData.claim_status_description,
                statusData.claim_status_color,
                statusData.sequence_no,
                statusData.is_initial,
                statusData.is_final,
                statusData.is_active
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }

                callback(null, result);
            }
        );
    },


    // ==================== GET ALL CLAIM STATUSES ====================
    getAllClaimStatuses: (callback) => {

        pool.query(
            `SELECT
                claim_status_id,
                claim_status_name,
                claim_status_code,
                claim_status_description,
                claim_status_color,
                sequence_no,
                is_initial,
                is_final,
                is_active,
                created_by,
                created_at,
                updated_by,
                updated_at
            FROM policy_claim_status_master
            ORDER BY sequence_no ASC`,
            [],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }

                callback(null, result);
            }
        );
    },


    // ==================== GET CLAIM STATUS BY ID ====================
    getClaimStatusById: (claimStatusId, callback) => {

        pool.query(
            `SELECT
                claim_status_id,
                claim_status_name,
                claim_status_code,
                claim_status_description,
                claim_status_color,
                sequence_no,
                is_initial,
                is_final,
                is_active,
                created_by,
                created_at,
                updated_by,
                updated_at
            FROM policy_claim_status_master
            WHERE claim_status_id = ?`,
            [claimStatusId],
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


    // ==================== UPDATE CLAIM STATUS ====================
    updateClaimStatus: (claimStatusId, statusData, callback) => {

        pool.query(
            `UPDATE policy_claim_status_master
            SET
                claim_status_name = ?,
                claim_status_code = ?,
                claim_status_description = ?,
                claim_status_color = ?,
                sequence_no = ?,
                is_initial = ?,
                is_final = ?,
                is_active = ?
            WHERE claim_status_id = ?`,
            [
                statusData.claim_status_name,
                statusData.claim_status_code,
                statusData.claim_status_description,
                statusData.claim_status_color,
                statusData.sequence_no,
                statusData.is_initial,
                statusData.is_final,
                statusData.is_active,
                claimStatusId
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }

                if (result.affectedRows === 0) {
                    return pool.query(
                        `SELECT claim_status_id
                         FROM policy_claim_status_master
                         WHERE claim_status_id = ?`,
                        [claimStatusId],
                        (checkErr, rows) => {
                            if (checkErr) {
                                return callback(checkErr, null);
                            }

                            if (!rows || rows.length === 0) {
                                return callback(null, {
                                    affectedRows: 0
                                });
                            }

                            // Record exists, but values were unchanged.
                            callback(null, {
                                affectedRows: 1,
                                changedRows: 0
                            });
                        }
                    );
                }

                callback(null, result);
            }
        );
    }

};