// services/policySource.service.js

const pool = require("../../dbconfig/dbconfig");

module.exports = {
    // ==================== CREATE POLICY SOURCE ====================
    createPolicySource: (sourceData, callback) => {

        pool.query(

            `INSERT INTO policy_source_master
            (
                source_name,
                is_active,
                created_at
            )
            VALUES (?, ?, CURRENT_TIMESTAMP)`,

            [
                sourceData.source_name,
                sourceData.is_active
            ],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== GET ALL POLICY SOURCES ====================

    getAllPolicySources: (callback) => {

        pool.query(

            `SELECT *
             FROM policy_source_master
             ORDER BY created_at DESC`,

            [],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== GET POLICY SOURCE BY ID ====================

    getPolicySourceById: (sourceId, callback) => {

        pool.query(

            `SELECT *
             FROM policy_source_master
             WHERE source_id = ?`,

            [sourceId],

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


    // ==================== UPDATE POLICY SOURCE ====================

    updatePolicySource: (sourceId, sourceData, callback) => {

        pool.query(

            `UPDATE policy_source_master
             SET
                source_name = ?,
                is_active = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE source_id = ?`,

            [
                sourceData.source_name,
                sourceData.is_active,
                sourceId
            ],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== DELETE POLICY SOURCE ====================

    deletePolicySource: (sourceId, callback) => {

        pool.query(

            `UPDATE policy_source_master
             SET
                is_active = 0,
                updated_at = CURRENT_TIMESTAMP
             WHERE source_id = ?`,

            [sourceId],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== GET ACTIVE POLICY SOURCES ====================

    getActivePolicySources: (callback) => {

        pool.query(

            `SELECT *
             FROM policy_source_master
             WHERE is_active = 1
             ORDER BY source_name ASC`,

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
