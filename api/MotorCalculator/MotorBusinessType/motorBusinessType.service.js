const pool = require("../../../dbconfig/dbconfig");

const MotorBusinessTypeService = {

    // CREATE
    createBusinessType: (data, callback) => {

        const query = `
            INSERT INTO motor_business_type_master
            (
                business_type_code,
                business_type_name,
                description
            )
            VALUES (?, ?, ?)
        `;

        const values = [
            data.business_type_code,
            data.business_type_name,
            data.description ?? null
        ];

        pool.query(query, values, callback);
    },


    // GET ALL
    getAllBusinessTypes: (callback) => {

        const query = `
            SELECT
                business_type_id,
                business_type_code,
                business_type_name,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_business_type_master
            ORDER BY business_type_name ASC, business_type_id ASC
        `;

        pool.query(query, callback);
    },


    // GET BY ID
    getBusinessTypeById: (businessTypeId, callback) => {

        const query = `
            SELECT
                business_type_id,
                business_type_code,
                business_type_name,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_business_type_master
            WHERE business_type_id = ?
        `;

        pool.query(query, [businessTypeId], callback);
    },


    // UPDATE
    updateBusinessType: (businessTypeId, data, callback) => {

        const query = `
            UPDATE motor_business_type_master
            SET
                business_type_code = ?,
                business_type_name = ?,
                description = ?
            WHERE business_type_id = ?
        `;

        const values = [
            data.business_type_code,
            data.business_type_name,
            data.description ?? null,
            businessTypeId
        ];

        pool.query(query, values, callback);
    },


    // DELETE
    deleteBusinessType: (businessTypeId, callback) => {

        const query = `
            UPDATE motor_business_type_master
            SET is_active = 0
            WHERE business_type_id = ?
        `;

        pool.query(query, [businessTypeId], callback);
    },


    // GET ACTIVE
    getActiveBusinessTypes: (callback) => {

        const query = `
            SELECT
                business_type_id,
                business_type_code,
                business_type_name,
                description,
                is_active
            FROM motor_business_type_master
            WHERE is_active = 1
            ORDER BY business_type_name ASC, business_type_id ASC
        `;

        pool.query(query, callback);
    }
};

module.exports = MotorBusinessTypeService;