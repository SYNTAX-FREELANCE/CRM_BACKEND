// services/callOutcome.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
    // ==================== CREATE CALL OUTCOME ====================
    createCallOutcome: (outcomeData, callback) => {
        pool.query(

            `INSERT INTO crm_outcome_master
            (
                outcome_key,
                outcome_label,
                icon_key,
                display_order,
                is_active
            )
            VALUES (?, ?, ?, ?, ?)`,

            [
                outcomeData.outcome_key,
                outcomeData.outcome_label,
                outcomeData.icon_key,
                outcomeData.display_order,
                outcomeData.is_active
            ],

            (err, result) => {

                if (err) {

                    return callback(err, null);

                }

                callback(null, result);

            }

        );

    },


    // ==================== GET ALL CALL OUTCOMES ====================

    getAllCallOutcomes: (callback) => {

        pool.query(

            `SELECT
                outcome_id,
                outcome_key,
                outcome_label,
                icon_key,
                display_order,
                is_active
            FROM crm_outcome_master
            ORDER BY display_order ASC, outcome_id ASC`,

            [],

            (err, result) => {

                if (err) {

                    return callback(err, null);

                }

                callback(null, result);

            }

        );

    },


    // ==================== GET CALL OUTCOME BY ID ====================

    getCallOutcomeById: (outcomeId, callback) => {

        pool.query(

            `SELECT
                outcome_id,
                outcome_key,
                outcome_label,
                icon_key,
                display_order,
                is_active
            FROM crm_outcome_master
            WHERE outcome_id = ?`,

            [outcomeId],

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


    // ==================== UPDATE CALL OUTCOME ====================

    updateCallOutcome: (
        outcomeId,
        outcomeData,
        callback
    ) => {

        pool.query(

            `UPDATE crm_outcome_master
            SET
                outcome_key = ?,
                outcome_label = ?,
                icon_key = ?,
                display_order = ?,
                is_active = ?
            WHERE outcome_id = ?`,

            [
                outcomeData.outcome_key,
                outcomeData.outcome_label,
                outcomeData.icon_key,
                outcomeData.display_order,
                outcomeData.is_active,
                outcomeId
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