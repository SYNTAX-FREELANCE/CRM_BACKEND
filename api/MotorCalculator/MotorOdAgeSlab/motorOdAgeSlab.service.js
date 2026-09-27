const pool = require("../../../dbconfig/dbconfig");

const MotorOdAgeSlabService = {

    // CREATE
    createOdAgeSlab: (data, callback) => {

        const query = `
            INSERT INTO motor_od_age_slab (
                slab_code,
                slab_name,
                min_age_months,
                max_age_months,
                od_rate_adjustment_type,
                od_rate_adjustment,
                description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.slab_code,
            data.slab_name,
            data.min_age_months,
            data.max_age_months || null,
            data.od_rate_adjustment_type || "NONE",
            data.od_rate_adjustment || 0,
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
    getAllOdAgeSlabs: (callback) => {

        const query = `
            SELECT
                od_age_slab_id,
                slab_code,
                slab_name,
                min_age_months,
                max_age_months,
                od_rate_adjustment_type,
                od_rate_adjustment,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_od_age_slab
            ORDER BY min_age_months ASC, od_age_slab_id ASC
        `;

        pool.query(query, (err, result) => {
            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // GET BY ID
    getOdAgeSlabById: (id, callback) => {

        const query = `
            SELECT
                od_age_slab_id,
                slab_code,
                slab_name,
                min_age_months,
                max_age_months,
                od_rate_adjustment_type,
                od_rate_adjustment,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_od_age_slab
            WHERE od_age_slab_id = ?
        `;

        pool.query(query, [id], (err, result) => {
            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // UPDATE
    updateOdAgeSlab: (id, data, callback) => {

        const query = `
            UPDATE motor_od_age_slab
            SET
                slab_code = ?,
                slab_name = ?,
                min_age_months = ?,
                max_age_months = ?,
                od_rate_adjustment_type = ?,
                od_rate_adjustment = ?,
                description = ?
            WHERE od_age_slab_id = ?
        `;

        const values = [
            data.slab_code,
            data.slab_name,
            data.min_age_months,
            data.max_age_months || null,
            data.od_rate_adjustment_type || "NONE",
            data.od_rate_adjustment || 0,
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
    deleteOdAgeSlab: (id, callback) => {

        const query = `
            UPDATE motor_od_age_slab
            SET is_active = 0
            WHERE od_age_slab_id = ?
        `;

        pool.query(query, [id], (err, result) => {
            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // GET ACTIVE
    getActiveOdAgeSlabs: (callback) => {

        const query = `
            SELECT
                od_age_slab_id,
                slab_code,
                slab_name,
                min_age_months,
                max_age_months,
                od_rate_adjustment_type,
                od_rate_adjustment,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_od_age_slab
            WHERE is_active = 1
            ORDER BY min_age_months ASC, od_age_slab_id ASC
        `;

        pool.query(query, (err, result) => {
            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    }
};

module.exports = MotorOdAgeSlabService;