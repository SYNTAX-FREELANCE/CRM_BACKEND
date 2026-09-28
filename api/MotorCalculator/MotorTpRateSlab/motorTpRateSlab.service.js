const pool = require("../../../dbconfig/dbconfig");

const MotorTpRateSlabService = {

    // CREATE
    createTpRateSlab: (data, callback) => {

        const query = `
            INSERT INTO motor_tp_rate_slab (
                tp_rate_id,
                engine_cc_slab_id,
                gvw_slab_id,
                min_seating_capacity,
                max_seating_capacity,
                rate_value,
                description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.tp_rate_id,
            data.engine_cc_slab_id || null,
            data.gvw_slab_id || null,
            data.min_seating_capacity || null,
            data.max_seating_capacity || null,
            data.rate_value,
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
    getAllTpRateSlabs: (callback) => {

        const query = `
            SELECT
                s.tp_rate_slab_id,

                s.tp_rate_id,

                s.engine_cc_slab_id,
                ecs.slab_name AS engine_cc_slab_name,

                s.gvw_slab_id,
                gs.slab_name AS gvw_slab_name,

                s.min_seating_capacity,
                s.max_seating_capacity,

                s.rate_value,

                s.description,

                s.is_active,
                s.created_at,
                s.updated_at

            FROM motor_tp_rate_slab s

            INNER JOIN motor_tp_rate_master tr
                ON tr.tp_rate_id = s.tp_rate_id

            LEFT JOIN motor_engine_cc_slabs ecs
                ON ecs.engine_cc_slab_id = s.engine_cc_slab_id

            LEFT JOIN motor_gvw_slabs gs
                ON gs.gvw_slab_id = s.gvw_slab_id

            ORDER BY
                s.tp_rate_id ASC,
                s.tp_rate_slab_id ASC
        `;

        pool.query(query, (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // GET BY ID
    getTpRateSlabById: (id, callback) => {

        const query = `
            SELECT
                s.tp_rate_slab_id,

                s.tp_rate_id,

                s.engine_cc_slab_id,
                ecs.slab_name AS engine_cc_slab_name,

                s.gvw_slab_id,
                gs.slab_name AS gvw_slab_name,

                s.min_seating_capacity,
                s.max_seating_capacity,

                s.rate_value,

                s.description,

                s.is_active,
                s.created_at,
                s.updated_at

            FROM motor_tp_rate_slab s

            INNER JOIN motor_tp_rate_master tr
                ON tr.tp_rate_id = s.tp_rate_id

            LEFT JOIN motor_engine_cc_slabs ecs
                ON ecs.engine_cc_slab_id = s.engine_cc_slab_id

            LEFT JOIN motor_gvw_slabs gs
                ON gs.gvw_slab_id = s.gvw_slab_id

            WHERE s.tp_rate_slab_id = ?
        `;

        pool.query(query, [id], (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // UPDATE
    updateTpRateSlab: (id, data, callback) => {

        const query = `
            UPDATE motor_tp_rate_slab
            SET
                tp_rate_id = ?,
                engine_cc_slab_id = ?,
                gvw_slab_id = ?,
                min_seating_capacity = ?,
                max_seating_capacity = ?,
                rate_value = ?,
                description = ?

            WHERE tp_rate_slab_id = ?
        `;

        const values = [
            data.tp_rate_id,
            data.engine_cc_slab_id || null,
            data.gvw_slab_id || null,
            data.min_seating_capacity || null,
            data.max_seating_capacity || null,
            data.rate_value,
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
    deleteTpRateSlab: (id, callback) => {

        const query = `
            UPDATE motor_tp_rate_slab
            SET is_active = 0
            WHERE tp_rate_slab_id = ?
        `;

        pool.query(query, [id], (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // GET ACTIVE
    getActiveTpRateSlabs: (callback) => {

        const query = `
            SELECT
                s.tp_rate_slab_id,

                s.tp_rate_id,

                s.engine_cc_slab_id,
                ecs.slab_name AS engine_cc_slab_name,

                s.gvw_slab_id,
                gs.slab_name AS gvw_slab_name,

                s.min_seating_capacity,
                s.max_seating_capacity,

                s.rate_value,

                s.description,

                s.is_active,
                s.created_at,
                s.updated_at

            FROM motor_tp_rate_slab s

            INNER JOIN motor_tp_rate_master tr
                ON tr.tp_rate_id = s.tp_rate_id

            LEFT JOIN motor_engine_cc_slabs ecs
                ON ecs.engine_cc_slab_id = s.engine_cc_slab_id

            LEFT JOIN motor_gvw_slabs gs
                ON gs.gvw_slab_id = s.gvw_slab_id

            WHERE s.is_active = 1

            ORDER BY
                s.tp_rate_id ASC,
                s.tp_rate_slab_id ASC
        `;

        pool.query(query, (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    }
};

module.exports = MotorTpRateSlabService;