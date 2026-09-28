const pool = require("../../../dbconfig/dbconfig");

const MotorGvwSlabService = {

    // CREATE
    createGvwSlab: (data, callback) => {

        const query = `
            INSERT INTO motor_gvw_slabs
            (
                slab_code,
                slab_name,
                min_gvw,
                max_gvw,
                description
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            data.slab_code,
            data.slab_name,
            data.min_gvw,
            data.max_gvw ?? null,
            data.description ?? null
        ];

        pool.query(query, values, callback);
    },


    // GET ALL
    getAllGvwSlabs: (callback) => {

        const query = `
            SELECT
                gvw_slab_id,
                slab_code,
                slab_name,
                min_gvw,
                max_gvw,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_gvw_slabs
            ORDER BY min_gvw ASC, gvw_slab_id ASC
        `;

        pool.query(query, callback);
    },


    // GET BY ID
    getGvwSlabById: (gvwSlabId, callback) => {

        const query = `
            SELECT
                gvw_slab_id,
                slab_code,
                slab_name,
                min_gvw,
                max_gvw,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_gvw_slabs
            WHERE gvw_slab_id = ?
        `;

        pool.query(query, [gvwSlabId], callback);
    },


    // UPDATE
    updateGvwSlab: (gvwSlabId, data, callback) => {

        const query = `
            UPDATE motor_gvw_slabs
            SET
                slab_code = ?,
                slab_name = ?,
                min_gvw = ?,
                max_gvw = ?,
                description = ?
            WHERE gvw_slab_id = ?
        `;

        const values = [
            data.slab_code,
            data.slab_name,
            data.min_gvw,
            data.max_gvw ?? null,
            data.description ?? null,
            gvwSlabId
        ];

        pool.query(query, values, callback);
    },


    // DELETE
    deleteGvwSlab: (gvwSlabId, callback) => {

        const query = `
            UPDATE motor_gvw_slabs
            SET is_active = 0
            WHERE gvw_slab_id = ?
        `;

        pool.query(query, [gvwSlabId], callback);
    },


    // GET ACTIVE
    getActiveGvwSlabs: (callback) => {

        const query = `
            SELECT
                gvw_slab_id,
                slab_code,
                slab_name,
                min_gvw,
                max_gvw,
                description,
                is_active
            FROM motor_gvw_slabs
            WHERE is_active = 1
            ORDER BY min_gvw ASC, gvw_slab_id ASC
        `;

        pool.query(query, callback);
    }
};

module.exports = MotorGvwSlabService;