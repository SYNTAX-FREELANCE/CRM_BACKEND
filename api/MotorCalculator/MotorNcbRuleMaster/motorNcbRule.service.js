const pool = require("../../../dbconfig/dbconfig");

const MotorNcbRuleService = {

    // CREATE
    createNcbRule: (data, callback) => {

        const query = `
            INSERT INTO motor_ncb_rule_master (
                product_id,
                policy_type_id,
                min_policy_years,
                max_policy_years,
                claim_free_required,
                ncb_percentage,
                effective_from,
                effective_to,
                description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.product_id,
            data.policy_type_id || null,
            data.min_policy_years || null,
            data.max_policy_years || null,
            data.claim_free_required !== undefined
                ? data.claim_free_required
                : 1,
            data.ncb_percentage,
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
    getAllNcbRules: (callback) => {

        const query = `
            SELECT
                n.ncb_rule_id,

                n.product_id,
                p.product_name,

                n.policy_type_id,
                pt.policy_type_name,

                n.min_policy_years,
                n.max_policy_years,

                n.claim_free_required,
                n.ncb_percentage,

                n.effective_from,
                n.effective_to,

                n.description,
                n.is_active,
                n.created_at,
                n.updated_at

            FROM motor_ncb_rule_master n

            INNER JOIN motor_product_master p
                ON p.product_id = n.product_id

            LEFT JOIN motor_policy_type_master pt
                ON pt.policy_type_id = n.policy_type_id

            ORDER BY
                n.effective_from DESC,
                n.min_policy_years ASC,
                n.ncb_rule_id DESC
        `;

        pool.query(query, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // GET BY ID
    getNcbRuleById: (id, callback) => {

        const query = `
            SELECT
                n.ncb_rule_id,

                n.product_id,
                p.product_name,

                n.policy_type_id,
                pt.policy_type_name,

                n.min_policy_years,
                n.max_policy_years,

                n.claim_free_required,
                n.ncb_percentage,

                n.effective_from,
                n.effective_to,

                n.description,
                n.is_active,
                n.created_at,
                n.updated_at

            FROM motor_ncb_rule_master n

            INNER JOIN motor_product_master p
                ON p.product_id = n.product_id

            LEFT JOIN motor_policy_type_master pt
                ON pt.policy_type_id = n.policy_type_id

            WHERE n.ncb_rule_id = ?
        `;

        pool.query(query, [id], (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // UPDATE
    updateNcbRule: (id, data, callback) => {

        const query = `
            UPDATE motor_ncb_rule_master
            SET
                product_id = ?,
                policy_type_id = ?,
                min_policy_years = ?,
                max_policy_years = ?,
                claim_free_required = ?,
                ncb_percentage = ?,
                effective_from = ?,
                effective_to = ?,
                description = ?
            WHERE ncb_rule_id = ?
        `;

        const values = [
            data.product_id,
            data.policy_type_id || null,
            data.min_policy_years || null,
            data.max_policy_years || null,
            data.claim_free_required !== undefined
                ? data.claim_free_required
                : 1,
            data.ncb_percentage,
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
    deleteNcbRule: (id, callback) => {

        const query = `
            UPDATE motor_ncb_rule_master
            SET is_active = 0
            WHERE ncb_rule_id = ?
        `;

        pool.query(query, [id], (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // GET ACTIVE
    getActiveNcbRules: (callback) => {

        const query = `
            SELECT
                n.ncb_rule_id,

                n.product_id,
                p.product_name,

                n.policy_type_id,
                pt.policy_type_name,

                n.min_policy_years,
                n.max_policy_years,

                n.claim_free_required,
                n.ncb_percentage,

                n.effective_from,
                n.effective_to,

                n.description,
                n.is_active,
                n.created_at,
                n.updated_at

            FROM motor_ncb_rule_master n

            INNER JOIN motor_product_master p
                ON p.product_id = n.product_id

            LEFT JOIN motor_policy_type_master pt
                ON pt.policy_type_id = n.policy_type_id

            WHERE n.is_active = 1

            ORDER BY
                n.effective_from DESC,
                n.min_policy_years ASC,
                n.ncb_rule_id DESC
        `;

        pool.query(query, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    }

};

module.exports = MotorNcbRuleService;