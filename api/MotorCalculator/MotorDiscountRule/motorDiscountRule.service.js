const pool = require("../../../dbconfig/dbconfig");

const MotorDiscountRuleService = {

    // CREATE
    createDiscountRule: (data, callback) => {

        const query = `
            INSERT INTO motor_discount_rule_master (
                insurance_company_id,
                product_id,
                policy_type_id,
                vehicle_category_id,
                vehicle_class_id,
                usage_id,
                discount_type,
                discount_value,
                min_vehicle_age_months,
                max_vehicle_age_months,
                claim_free_required,
                effective_from,
                effective_to,
                description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.insurance_company_id || null,
            data.product_id,
            data.policy_type_id || null,
            data.vehicle_category_id || null,
            data.vehicle_class_id || null,
            data.usage_id || null,
            data.discount_type,
            data.discount_value,
            data.min_vehicle_age_months || null,
            data.max_vehicle_age_months || null,
            data.claim_free_required !== undefined
                ? data.claim_free_required
                : 0,
            data.effective_from,
            data.effective_to || null,
            data.description || null
        ];

        pool.query(query, values, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // GET ALL
    getAllDiscountRules: (callback) => {

        const query = `
            SELECT
                d.discount_rule_id,

                d.insurance_company_id,
                ic.insurance_company_name,

                d.product_id,
                p.product_name,

                d.policy_type_id,
                pt.policy_type_name,

                d.vehicle_category_id,
                vc.category_name,

                d.vehicle_class_id,
                vcl.class_name,

                d.usage_id,
                u.usage_name,

                d.discount_type,
                d.discount_value,

                d.min_vehicle_age_months,
                d.max_vehicle_age_months,

                d.claim_free_required,

                d.effective_from,
                d.effective_to,

                d.description,
                d.is_active,
                d.created_at,
                d.updated_at

            FROM motor_discount_rule_master d

            LEFT JOIN insurance_companies ic
                ON ic.insurance_company_id = d.insurance_company_id

            INNER JOIN motor_product_master p
                ON p.product_id = d.product_id

            LEFT JOIN motor_policy_type_master pt
                ON pt.policy_type_id = d.policy_type_id

            LEFT JOIN motor_vehicle_categories vc
                ON vc.vehicle_category_id = d.vehicle_category_id

            LEFT JOIN motor_vehicle_classes vcl
                ON vcl.vehicle_class_id = d.vehicle_class_id

            LEFT JOIN motor_vehicle_usages u
                ON u.usage_id = d.usage_id

            ORDER BY
                d.effective_from DESC,
                d.discount_rule_id DESC
        `;

        pool.query(query, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // GET BY ID
    getDiscountRuleById: (id, callback) => {

        const query = `
            SELECT
                d.discount_rule_id,

                d.insurance_company_id,
                ic.insurance_company_name,

                d.product_id,
                p.product_name,

                d.policy_type_id,
                pt.policy_type_name,

                d.vehicle_category_id,
                vc.category_name,

                d.vehicle_class_id,
                vcl.class_name,

                d.usage_id,
                u.usage_name,

                d.discount_type,
                d.discount_value,

                d.min_vehicle_age_months,
                d.max_vehicle_age_months,

                d.claim_free_required,

                d.effective_from,
                d.effective_to,

                d.description,
                d.is_active,
                d.created_at,
                d.updated_at

            FROM motor_discount_rule_master d

            LEFT JOIN insurance_companies ic
                ON ic.insurance_company_id = d.insurance_company_id

            INNER JOIN motor_product_master p
                ON p.product_id = d.product_id

            LEFT JOIN motor_policy_type_master pt
                ON pt.policy_type_id = d.policy_type_id

            LEFT JOIN motor_vehicle_categories vc
                ON vc.vehicle_category_id = d.vehicle_category_id

            LEFT JOIN motor_vehicle_classes vcl
                ON vcl.vehicle_class_id = d.vehicle_class_id

            LEFT JOIN motor_vehicle_usages u
                ON u.usage_id = d.usage_id

            WHERE d.discount_rule_id = ?
        `;

        pool.query(query, [id], (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // UPDATE
    updateDiscountRule: (id, data, callback) => {

        const query = `
            UPDATE motor_discount_rule_master
            SET
                insurance_company_id = ?,
                product_id = ?,
                policy_type_id = ?,
                vehicle_category_id = ?,
                vehicle_class_id = ?,
                usage_id = ?,
                discount_type = ?,
                discount_value = ?,
                min_vehicle_age_months = ?,
                max_vehicle_age_months = ?,
                claim_free_required = ?,
                effective_from = ?,
                effective_to = ?,
                description = ?
            WHERE discount_rule_id = ?
        `;

        const values = [
            data.insurance_company_id || null,
            data.product_id,
            data.policy_type_id || null,
            data.vehicle_category_id || null,
            data.vehicle_class_id || null,
            data.usage_id || null,
            data.discount_type,
            data.discount_value,
            data.min_vehicle_age_months || null,
            data.max_vehicle_age_months || null,
            data.claim_free_required !== undefined
                ? data.claim_free_required
                : 0,
            data.effective_from,
            data.effective_to || null,
            data.description || null,
            id
        ];

        pool.query(query, values, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // DELETE
    deleteDiscountRule: (id, callback) => {

        const query = `
            UPDATE motor_discount_rule_master
            SET is_active = 0
            WHERE discount_rule_id = ?
        `;

        pool.query(query, [id], (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // GET ACTIVE
    getActiveDiscountRules: (callback) => {

        const query = `
            SELECT
                d.discount_rule_id,

                d.insurance_company_id,
                ic.insurance_company_name,

                d.product_id,
                p.product_name,

                d.policy_type_id,
                pt.policy_type_name,

                d.vehicle_category_id,
                vc.category_name,

                d.vehicle_class_id,
                vcl.class_name,

                d.usage_id,
                u.usage_name,

                d.discount_type,
                d.discount_value,

                d.min_vehicle_age_months,
                d.max_vehicle_age_months,

                d.claim_free_required,

                d.effective_from,
                d.effective_to,

                d.description,
                d.is_active,
                d.created_at,
                d.updated_at

            FROM motor_discount_rule_master d

            LEFT JOIN insurance_companies ic
                ON ic.insurance_company_id = d.insurance_company_id

            INNER JOIN motor_product_master p
                ON p.product_id = d.product_id

            LEFT JOIN motor_policy_type_master pt
                ON pt.policy_type_id = d.policy_type_id

            LEFT JOIN motor_vehicle_categories vc
                ON vc.vehicle_category_id = d.vehicle_category_id

            LEFT JOIN motor_vehicle_classes vcl
                ON vcl.vehicle_class_id = d.vehicle_class_id

            LEFT JOIN motor_vehicle_usages u
                ON u.usage_id = d.usage_id

            WHERE d.is_active = 1

            ORDER BY
                d.effective_from DESC,
                d.discount_rule_id DESC
        `;

        pool.query(query, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    }

};

module.exports = MotorDiscountRuleService;