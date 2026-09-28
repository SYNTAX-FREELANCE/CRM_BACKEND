const pool = require("../../../dbconfig/dbconfig");

const MotorPolicyTypeService = {

    // CREATE
    createPolicyType: (data, callback) => {

        const query = `
            INSERT INTO motor_policy_type_master
            (
                policy_type_code,
                policy_type_name,
                description,
                is_od_applicable,
                is_tp_applicable
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            data.policy_type_code,
            data.policy_type_name,
            data.description ?? null,
            data.is_od_applicable ?? 0,
            data.is_tp_applicable ?? 0
        ];

        pool.query(query, values, callback);
    },


    // GET ALL
    getAllPolicyTypes: (callback) => {

        const query = `
            SELECT
                policy_type_id,
                policy_type_code,
                policy_type_name,
                description,
                is_od_applicable,
                is_tp_applicable,
                is_active,
                created_at,
                updated_at
            FROM motor_policy_type_master
            ORDER BY policy_type_name ASC, policy_type_id ASC
        `;

        pool.query(query, callback);
    },


    // GET BY ID
    getPolicyTypeById: (policyTypeId, callback) => {

        const query = `
            SELECT
                policy_type_id,
                policy_type_code,
                policy_type_name,
                description,
                is_od_applicable,
                is_tp_applicable,
                is_active,
                created_at,
                updated_at
            FROM motor_policy_type_master
            WHERE policy_type_id = ?
        `;

        pool.query(query, [policyTypeId], callback);
    },


    // UPDATE
    updatePolicyType: (policyTypeId, data, callback) => {

        const query = `
            UPDATE motor_policy_type_master
            SET
                policy_type_code = ?,
                policy_type_name = ?,
                description = ?,
                is_od_applicable = ?,
                is_tp_applicable = ?
            WHERE policy_type_id = ?
        `;

        const values = [
            data.policy_type_code,
            data.policy_type_name,
            data.description ?? null,
            data.is_od_applicable ?? 0,
            data.is_tp_applicable ?? 0,
            policyTypeId
        ];

        pool.query(query, values, callback);
    },


    // DELETE
    deletePolicyType: (policyTypeId, callback) => {

        const query = `
            UPDATE motor_policy_type_master
            SET is_active = 0
            WHERE policy_type_id = ?
        `;

        pool.query(query, [policyTypeId], callback);
    },


    // GET ACTIVE
    getActivePolicyTypes: (callback) => {

        const query = `
            SELECT
                policy_type_id,
                policy_type_code,
                policy_type_name,
                description,
                is_od_applicable,
                is_tp_applicable,
                is_active
            FROM motor_policy_type_master
            WHERE is_active = 1
            ORDER BY policy_type_name ASC, policy_type_id ASC
        `;

        pool.query(query, callback);
    }
};

module.exports = MotorPolicyTypeService;