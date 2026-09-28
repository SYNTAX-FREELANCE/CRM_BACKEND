const pool = require("../../../dbconfig/dbconfig");

const MotorOdDepreciationService = {

    // CREATE
    createOdDepreciation: (data, callback) => {

        const query = `
            INSERT INTO motor_od_depreciation_master (
                product_id,
                policy_type_id,
                min_age_months,
                max_age_months,
                depreciation_percentage,
                effective_from,
                effective_to,
                description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.product_id,
            data.policy_type_id || null,
            data.min_age_months,
            data.max_age_months || null,
            data.depreciation_percentage,
            data.effective_from,
            data.effective_to || null,
            data.description || null
        ];

        pool.query(query, values, (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // GET ALL
    getAllOdDepreciations: (callback) => {

        const query = `
            SELECT
                d.depreciation_id,

                d.product_id,
                p.product_name,

                d.policy_type_id,
                pt.policy_type_name,

                d.min_age_months,
                d.max_age_months,

                d.depreciation_percentage,

                d.effective_from,
                d.effective_to,

                d.description,
                d.is_active,
                d.created_at,
                d.updated_at

            FROM motor_od_depreciation_master d

            INNER JOIN motor_product_master p
                ON p.product_id = d.product_id

            LEFT JOIN motor_policy_type_master pt
                ON pt.policy_type_id = d.policy_type_id

            ORDER BY
                d.effective_from DESC,
                d.min_age_months ASC,
                d.depreciation_id DESC
        `;

        pool.query(query, (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // GET BY ID
    getOdDepreciationById: (id, callback) => {

        const query = `
            SELECT
                d.depreciation_id,

                d.product_id,
                p.product_name,

                d.policy_type_id,
                pt.policy_type_name,

                d.min_age_months,
                d.max_age_months,

                d.depreciation_percentage,

                d.effective_from,
                d.effective_to,

                d.description,
                d.is_active,
                d.created_at,
                d.updated_at

            FROM motor_od_depreciation_master d

            INNER JOIN motor_product_master p
                ON p.product_id = d.product_id

            LEFT JOIN motor_policy_type_master pt
                ON pt.policy_type_id = d.policy_type_id

            WHERE d.depreciation_id = ?
        `;

        pool.query(query, [id], (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // UPDATE
    updateOdDepreciation: (id, data, callback) => {

        const query = `
            UPDATE motor_od_depreciation_master
            SET
                product_id = ?,
                policy_type_id = ?,
                min_age_months = ?,
                max_age_months = ?,
                depreciation_percentage = ?,
                effective_from = ?,
                effective_to = ?,
                description = ?

            WHERE depreciation_id = ?
        `;

        const values = [
            data.product_id,
            data.policy_type_id || null,
            data.min_age_months,
            data.max_age_months || null,
            data.depreciation_percentage,
            data.effective_from,
            data.effective_to || null,
            data.description || null,
            id
        ];

        pool.query(query, values, (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // DELETE
    deleteOdDepreciation: (id, callback) => {

        const query = `
            UPDATE motor_od_depreciation_master
            SET is_active = 0
            WHERE depreciation_id = ?
        `;

        pool.query(query, [id], (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // GET ACTIVE
    getActiveOdDepreciations: (callback) => {

        const query = `
            SELECT
                d.depreciation_id,

                d.product_id,
                p.product_name,

                d.policy_type_id,
                pt.policy_type_name,

                d.min_age_months,
                d.max_age_months,

                d.depreciation_percentage,

                d.effective_from,
                d.effective_to,

                d.description,
                d.is_active,
                d.created_at,
                d.updated_at

            FROM motor_od_depreciation_master d

            INNER JOIN motor_product_master p
                ON p.product_id = d.product_id

            LEFT JOIN motor_policy_type_master pt
                ON pt.policy_type_id = d.policy_type_id

            WHERE d.is_active = 1

            ORDER BY
                d.effective_from DESC,
                d.min_age_months ASC,
                d.depreciation_id DESC
        `;

        pool.query(query, (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    }
};

module.exports = MotorOdDepreciationService;