const pool = require("../../../dbconfig/dbconfig");

const MotorDiscountConditionService = {

    // CREATE
    createDiscountCondition: (data, callback) => {

        const query = `
            INSERT INTO motor_discount_condition (
                discount_rule_id,
                condition_type,
                condition_operator,
                condition_value,
                description
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            data.discount_rule_id,
            data.condition_type,
            data.condition_operator,
            data.condition_value,
            data.description || null
        ];

        pool.query(query, values, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // GET ALL
    getAllDiscountConditions: (callback) => {

        const query = `
            SELECT
                c.discount_condition_id,

                c.discount_rule_id,

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

                c.condition_type,
                c.condition_operator,
                c.condition_value,

                c.description,
                c.is_active,
                c.created_at,
                c.updated_at

            FROM motor_discount_condition c

            INNER JOIN motor_discount_rule_master d
                ON d.discount_rule_id = c.discount_rule_id

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
                c.discount_rule_id ASC,
                c.discount_condition_id ASC
        `;

        pool.query(query, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // GET BY ID
    getDiscountConditionById: (id, callback) => {

        const query = `
            SELECT
                c.discount_condition_id,

                c.discount_rule_id,

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

                c.condition_type,
                c.condition_operator,
                c.condition_value,

                c.description,
                c.is_active,
                c.created_at,
                c.updated_at

            FROM motor_discount_condition c

            INNER JOIN motor_discount_rule_master d
                ON d.discount_rule_id = c.discount_rule_id

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

            WHERE c.discount_condition_id = ?
        `;

        pool.query(query, [id], (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // UPDATE
    updateDiscountCondition: (id, data, callback) => {

        const query = `
            UPDATE motor_discount_condition
            SET
                discount_rule_id = ?,
                condition_type = ?,
                condition_operator = ?,
                condition_value = ?,
                description = ?
            WHERE discount_condition_id = ?
        `;

        const values = [
            data.discount_rule_id,
            data.condition_type,
            data.condition_operator,
            data.condition_value,
            data.description || null,
            id
        ];

        pool.query(query, values, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // DELETE
    deleteDiscountCondition: (id, callback) => {

        const query = `
            UPDATE motor_discount_condition
            SET is_active = 0
            WHERE discount_condition_id = ?
        `;

        pool.query(query, [id], (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // GET ACTIVE
    getActiveDiscountConditions: (callback) => {

        const query = `
            SELECT
                c.discount_condition_id,

                c.discount_rule_id,

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

                c.condition_type,
                c.condition_operator,
                c.condition_value,

                c.description,
                c.is_active,
                c.created_at,
                c.updated_at

            FROM motor_discount_condition c

            INNER JOIN motor_discount_rule_master d
                ON d.discount_rule_id = c.discount_rule_id

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

            WHERE c.is_active = 1

            ORDER BY
                c.discount_rule_id ASC,
                c.discount_condition_id ASC
        `;

        pool.query(query, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    }

};

module.exports = MotorDiscountConditionService;