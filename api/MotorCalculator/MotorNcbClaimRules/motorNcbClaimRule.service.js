const pool = require("../../../dbconfig/dbconfig");

const MotorNcbClaimRuleService = {

    // CREATE
    createNcbClaimRule: (data, callback) => {

        const query = `
            INSERT INTO motor_ncb_claim_rule (
                ncb_rule_id,
                claim_count,
                ncb_percentage,
                description
            )
            VALUES (?, ?, ?, ?)
        `;

        const values = [
            data.ncb_rule_id,
            data.claim_count,
            data.ncb_percentage,
            data.description || null
        ];

        pool.query(query, values, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // GET ALL
    getAllNcbClaimRules: (callback) => {

        const query = `
            SELECT
                cr.ncb_claim_rule_id,

                cr.ncb_rule_id,

                nr.product_id,
                p.product_name,

                nr.policy_type_id,
                pt.policy_type_name,

                nr.min_policy_years,
                nr.max_policy_years,

                nr.claim_free_required,

                cr.claim_count,
                cr.ncb_percentage,

                cr.description,
                cr.is_active,
                cr.created_at,
                cr.updated_at

            FROM motor_ncb_claim_rule cr

            INNER JOIN motor_ncb_rule_master nr
                ON nr.ncb_rule_id = cr.ncb_rule_id

            INNER JOIN motor_product_master p
                ON p.product_id = nr.product_id

            LEFT JOIN motor_policy_type_master pt
                ON pt.policy_type_id = nr.policy_type_id

            ORDER BY
                cr.ncb_rule_id ASC,
                cr.claim_count ASC,
                cr.ncb_claim_rule_id ASC
        `;

        pool.query(query, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // GET BY ID
    getNcbClaimRuleById: (id, callback) => {

        const query = `
            SELECT
                cr.ncb_claim_rule_id,

                cr.ncb_rule_id,

                nr.product_id,
                p.product_name,

                nr.policy_type_id,
                pt.policy_type_name,

                nr.min_policy_years,
                nr.max_policy_years,

                nr.claim_free_required,

                cr.claim_count,
                cr.ncb_percentage,

                cr.description,
                cr.is_active,
                cr.created_at,
                cr.updated_at

            FROM motor_ncb_claim_rule cr

            INNER JOIN motor_ncb_rule_master nr
                ON nr.ncb_rule_id = cr.ncb_rule_id

            INNER JOIN motor_product_master p
                ON p.product_id = nr.product_id

            LEFT JOIN motor_policy_type_master pt
                ON pt.policy_type_id = nr.policy_type_id

            WHERE cr.ncb_claim_rule_id = ?
        `;

        pool.query(query, [id], (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // UPDATE
    updateNcbClaimRule: (id, data, callback) => {

        const query = `
            UPDATE motor_ncb_claim_rule
            SET
                ncb_rule_id = ?,
                claim_count = ?,
                ncb_percentage = ?,
                description = ?
            WHERE ncb_claim_rule_id = ?
        `;

        const values = [
            data.ncb_rule_id,
            data.claim_count,
            data.ncb_percentage,
            data.description || null,
            id
        ];

        pool.query(query, values, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // DELETE
    deleteNcbClaimRule: (id, callback) => {

        const query = `
            UPDATE motor_ncb_claim_rule
            SET is_active = 0
            WHERE ncb_claim_rule_id = ?
        `;

        pool.query(query, [id], (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    },


    // GET ACTIVE
    getActiveNcbClaimRules: (callback) => {

        const query = `
            SELECT
                cr.ncb_claim_rule_id,

                cr.ncb_rule_id,

                nr.product_id,
                p.product_name,

                nr.policy_type_id,
                pt.policy_type_name,

                nr.min_policy_years,
                nr.max_policy_years,

                nr.claim_free_required,

                cr.claim_count,
                cr.ncb_percentage,

                cr.description,
                cr.is_active,
                cr.created_at,
                cr.updated_at

            FROM motor_ncb_claim_rule cr

            INNER JOIN motor_ncb_rule_master nr
                ON nr.ncb_rule_id = cr.ncb_rule_id

            INNER JOIN motor_product_master p
                ON p.product_id = nr.product_id

            LEFT JOIN motor_policy_type_master pt
                ON pt.policy_type_id = nr.policy_type_id

            WHERE cr.is_active = 1

            ORDER BY
                cr.ncb_rule_id ASC,
                cr.claim_count ASC,
                cr.ncb_claim_rule_id ASC
        `;

        pool.query(query, (err, result) => {
            if (err) return callback(err, null);

            callback(null, result);
        });
    }

};

module.exports = MotorNcbClaimRuleService;