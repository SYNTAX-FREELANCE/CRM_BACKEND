const pool = require("../../../dbconfig/dbconfig");

const MotorPolicyTermService = {

    // CREATE
    createPolicyTerm: (data, callback) => {

        const query = `
            INSERT INTO motor_policy_term_master
            (
                term_code,
                term_name,
                term_value,
                term_unit,
                description
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            data.term_code,
            data.term_name,
            data.term_value,
            data.term_unit,
            data.description ?? null
        ];

        pool.query(query, values, callback);
    },


    // GET ALL
    getAllPolicyTerms: (callback) => {

        const query = `
            SELECT
                policy_term_id,
                term_code,
                term_name,
                term_value,
                term_unit,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_policy_term_master
            ORDER BY term_value ASC, term_unit ASC, policy_term_id ASC
        `;

        pool.query(query, callback);
    },


    // GET BY ID
    getPolicyTermById: (policyTermId, callback) => {

        const query = `
            SELECT
                policy_term_id,
                term_code,
                term_name,
                term_value,
                term_unit,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_policy_term_master
            WHERE policy_term_id = ?
        `;

        pool.query(query, [policyTermId], callback);
    },


    // UPDATE
    updatePolicyTerm: (policyTermId, data, callback) => {

        const query = `
            UPDATE motor_policy_term_master
            SET
                term_code = ?,
                term_name = ?,
                term_value = ?,
                term_unit = ?,
                description = ?
            WHERE policy_term_id = ?
        `;

        const values = [
            data.term_code,
            data.term_name,
            data.term_value,
            data.term_unit,
            data.description ?? null,
            policyTermId
        ];

        pool.query(query, values, callback);
    },


    // DELETE
    deletePolicyTerm: (policyTermId, callback) => {

        const query = `
            UPDATE motor_policy_term_master
            SET is_active = 0
            WHERE policy_term_id = ?
        `;

        pool.query(query, [policyTermId], callback);
    },


    // GET ACTIVE
    getActivePolicyTerms: (callback) => {

        const query = `
            SELECT
                policy_term_id,
                term_code,
                term_name,
                term_value,
                term_unit,
                description,
                is_active
            FROM motor_policy_term_master
            WHERE is_active = 1
            ORDER BY term_value ASC, term_unit ASC, policy_term_id ASC
        `;

        pool.query(query, callback);
    }
};

module.exports = MotorPolicyTermService;