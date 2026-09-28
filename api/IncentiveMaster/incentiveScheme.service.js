const pool = require("../../dbconfig/dbconfig");

module.exports = {

    // ==================== CREATE INCENTIVE SCHEME ====================

    createIncentiveScheme: (incentiveSchemeData, callback) => {

        pool.query(

            `INSERT INTO incentive_scheme_master
            (
                scheme_name,
                employee_level_id,
                description,
                is_active,
                created_at
            )
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,

            [
                incentiveSchemeData.scheme_name,
                incentiveSchemeData.employee_level_id,
                incentiveSchemeData.description,
                incentiveSchemeData.is_active
            ],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== GET ALL INCENTIVE SCHEMES ====================

    getAllIncentiveSchemes: (callback) => {

        pool.query(

            `SELECT
                ism.*,
                elm.level_name AS employee_level_name
             FROM incentive_scheme_master ism
             LEFT JOIN employee_level_master elm
                ON ism.employee_level_id = elm.employee_level_id
             ORDER BY ism.created_at DESC`,

            [],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== GET INCENTIVE SCHEME BY ID ====================

    getIncentiveSchemeById: (
        incentiveSchemeId,
        callback
    ) => {

        pool.query(

            `SELECT
                ism.*,
                elm.level_name AS employee_level_name
             FROM incentive_scheme_master ism
             LEFT JOIN employee_level_master elm
                ON ism.employee_level_id = elm.employee_level_id
             WHERE ism.incentive_scheme_id = ?`,

            [incentiveSchemeId],

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


    // ==================== UPDATE INCENTIVE SCHEME ====================

    updateIncentiveScheme: (
        incentiveSchemeId,
        incentiveSchemeData,
        callback
    ) => {

        pool.query(

            `UPDATE incentive_scheme_master
             SET
                scheme_name = ?,
                employee_level_id = ?,
                description = ?,
                is_active = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE incentive_scheme_id = ?`,

            [
                incentiveSchemeData.scheme_name,
                incentiveSchemeData.employee_level_id,
                incentiveSchemeData.description,
                incentiveSchemeData.is_active,
                incentiveSchemeId
            ],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== DELETE INCENTIVE SCHEME ====================

    deleteIncentiveScheme: (
        incentiveSchemeId,
        callback
    ) => {

        pool.query(

            `UPDATE incentive_scheme_master
             SET
                is_active = 0,
                updated_at = CURRENT_TIMESTAMP
             WHERE incentive_scheme_id = ?`,

            [incentiveSchemeId],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== GET ACTIVE INCENTIVE SCHEMES ====================

    getActiveIncentiveSchemes: (callback) => {

        pool.query(

            `SELECT
                ism.*,
                elm.level_name AS employee_level_name
             FROM incentive_scheme_master ism
             LEFT JOIN employee_level_master elm
                ON ism.employee_level_id = elm.employee_level_id
             WHERE ism.is_active = 1
             ORDER BY ism.scheme_name ASC`,

            [],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    }

};