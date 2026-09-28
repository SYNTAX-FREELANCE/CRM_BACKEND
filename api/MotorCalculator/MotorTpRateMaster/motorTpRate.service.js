const pool = require("../../../dbconfig/dbconfig");

const MotorTpRateService = {

    // CREATE
    createTpRate: (data, callback) => {

        const query = `
            INSERT INTO motor_tp_rate_master (
                insurance_company_id,
                product_id,
                policy_type_id,
                policy_term_id,
                vehicle_category_id,
                vehicle_class_id,
                usage_id,
                rate_type,
                description,
                effective_from,
                effective_to
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.insurance_company_id || null,
            data.product_id,
            data.policy_type_id,
            data.policy_term_id || null,
            data.vehicle_category_id || null,
            data.vehicle_class_id || null,
            data.usage_id || null,
            data.rate_type || "FIXED",
            data.description || null,
            data.effective_from,
            data.effective_to || null
        ];

        pool.query(query, values, (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // GET ALL
    getAllTpRates: (callback) => {

        const query = `
            SELECT
                tr.tp_rate_id,

                tr.insurance_company_id,
                ic.insurance_company_name,

                tr.product_id,
                p.product_name,

                tr.policy_type_id,
                pt.policy_type_name,

                tr.policy_term_id,
                pterm.term_name,

                tr.vehicle_category_id,
                vc.category_name,

                tr.vehicle_class_id,
                vcl.class_name,

                tr.usage_id,
                vu.usage_name,

                tr.rate_type,

                tr.description,

                tr.effective_from,
                tr.effective_to,

                tr.is_active,
                tr.created_at,
                tr.updated_at

            FROM motor_tp_rate_master tr

            LEFT JOIN insurance_companies ic
                ON ic.insurance_company_id = tr.insurance_company_id

            INNER JOIN motor_product_master p
                ON p.product_id = tr.product_id

            INNER JOIN motor_policy_type_master pt
                ON pt.policy_type_id = tr.policy_type_id

            LEFT JOIN motor_policy_term_master pterm
                ON pterm.policy_term_id = tr.policy_term_id

            LEFT JOIN motor_vehicle_categories vc
                ON vc.vehicle_category_id = tr.vehicle_category_id

            LEFT JOIN motor_vehicle_classes vcl
                ON vcl.vehicle_class_id = tr.vehicle_class_id

            LEFT JOIN motor_vehicle_usages vu
                ON vu.usage_id = tr.usage_id

            ORDER BY
                tr.effective_from DESC,
                tr.tp_rate_id DESC
        `;

        pool.query(query, (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // GET BY ID
    getTpRateById: (id, callback) => {

        const query = `
            SELECT
                tr.tp_rate_id,

                tr.insurance_company_id,
                ic.insurance_company_name,

                tr.product_id,
                p.product_name,

                tr.policy_type_id,
                pt.policy_type_name,

                tr.policy_term_id,
                pterm.term_name,

                tr.vehicle_category_id,
                vc.category_name,

                tr.vehicle_class_id,
                vcl.class_name,

                tr.usage_id,
                vu.usage_name,

                tr.rate_type,

                tr.description,

                tr.effective_from,
                tr.effective_to,

                tr.is_active,
                tr.created_at,
                tr.updated_at

            FROM motor_tp_rate_master tr

            LEFT JOIN insurance_companies ic
                ON ic.insurance_company_id = tr.insurance_company_id

            INNER JOIN motor_product_master p
                ON p.product_id = tr.product_id

            INNER JOIN motor_policy_type_master pt
                ON pt.policy_type_id = tr.policy_type_id

            LEFT JOIN motor_policy_term_master pterm
                ON pterm.policy_term_id = tr.policy_term_id

            LEFT JOIN motor_vehicle_categories vc
                ON vc.vehicle_category_id = tr.vehicle_category_id

            LEFT JOIN motor_vehicle_classes vcl
                ON vcl.vehicle_class_id = tr.vehicle_class_id

            LEFT JOIN motor_vehicle_usages vu
                ON vu.usage_id = tr.usage_id

            WHERE tr.tp_rate_id = ?
        `;

        pool.query(query, [id], (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // UPDATE
    updateTpRate: (id, data, callback) => {

        const query = `
            UPDATE motor_tp_rate_master
            SET
                insurance_company_id = ?,
                product_id = ?,
                policy_type_id = ?,
                policy_term_id = ?,
                vehicle_category_id = ?,
                vehicle_class_id = ?,
                usage_id = ?,
                rate_type = ?,
                description = ?,
                effective_from = ?,
                effective_to = ?

            WHERE tp_rate_id = ?
        `;

        const values = [
            data.insurance_company_id || null,
            data.product_id,
            data.policy_type_id,
            data.policy_term_id || null,
            data.vehicle_category_id || null,
            data.vehicle_class_id || null,
            data.usage_id || null,
            data.rate_type || "FIXED",
            data.description || null,
            data.effective_from,
            data.effective_to || null,
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
    deleteTpRate: (id, callback) => {

        const query = `
            UPDATE motor_tp_rate_master
            SET is_active = 0
            WHERE tp_rate_id = ?
        `;

        pool.query(query, [id], (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // GET ACTIVE
    getActiveTpRates: (callback) => {

        const query = `
            SELECT
                tr.tp_rate_id,

                tr.insurance_company_id,
                ic.insurance_company_name,

                tr.product_id,
                p.product_name,

                tr.policy_type_id,
                pt.policy_type_name,

                tr.policy_term_id,
                pterm.term_name,

                tr.vehicle_category_id,
                vc.category_name,

                tr.vehicle_class_id,
                vcl.class_name,

                tr.usage_id,
                vu.usage_name,

                tr.rate_type,

                tr.description,

                tr.effective_from,
                tr.effective_to,

                tr.is_active,
                tr.created_at,
                tr.updated_at

            FROM motor_tp_rate_master tr

            LEFT JOIN insurance_companies ic
                ON ic.insurance_company_id = tr.insurance_company_id

            INNER JOIN motor_product_master p
                ON p.product_id = tr.product_id

            INNER JOIN motor_policy_type_master pt
                ON pt.policy_type_id = tr.policy_type_id

            LEFT JOIN motor_policy_term_master pterm
                ON pterm.policy_term_id = tr.policy_term_id

            LEFT JOIN motor_vehicle_categories vc
                ON vc.vehicle_category_id = tr.vehicle_category_id

            LEFT JOIN motor_vehicle_classes vcl
                ON vcl.vehicle_class_id = tr.vehicle_class_id

            LEFT JOIN motor_vehicle_usages vu
                ON vu.usage_id = tr.usage_id

            WHERE tr.is_active = 1

            ORDER BY
                tr.effective_from DESC,
                tr.tp_rate_id DESC
        `;

        pool.query(query, (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    }
};

module.exports = MotorTpRateService;