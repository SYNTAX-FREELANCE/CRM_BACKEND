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
                description,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.tp_rate_id,
            data.engine_cc_slab_id || null,
            data.gvw_slab_id || null,
            data.min_seating_capacity || null,
            data.max_seating_capacity || null,
            data.rate_value,
            data.description || null,
            data.is_active
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
        -- TP rate master
        tr.tp_rate_id,
        tr.insurance_company_id,
        ic.company_name,
        tr.product_id,
        p.product_name,
        p.product_code,
        tr.policy_type_id,
        pt.policy_type_name,
        pt.policy_type_code,
        tr.policy_term_id,
        ptr.term_name,
        tr.vehicle_category_id,
        vc.category_name AS vehicle_category_name,
        vc.category_code,
        tr.vehicle_class_id,
        vcl.class_code,
        vcl.class_name AS vehicle_class_name,
        tr.usage_id,
        u.usage_name,

        tr.is_active AS master_is_active,
        tr.effective_from,
        tr.effective_to,

        -- TP rate slab
        s.tp_rate_slab_id,
        s.engine_cc_slab_id,
        ecs.slab_name AS engine_cc_slab_name,
        ecs.min_cc,
        ecs.max_cc,

        s.gvw_slab_id,
        gs.slab_name AS gvw_slab_name,
        gs.min_gvw,
        gs.max_gvw,

        s.min_seating_capacity,
        s.max_seating_capacity,
        s.rate_value,
        s.description AS slab_description,
        s.is_active AS slab_is_active,
        s.created_at AS slab_created_at,
        s.updated_at AS slab_updated_at

    FROM motor_tp_rate_slab s

    INNER JOIN motor_tp_rate_master tr
        ON tr.tp_rate_id = s.tp_rate_id

    LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = tr.insurance_company_id

    LEFT JOIN motor_product_master p
        ON p.product_id = tr.product_id

    LEFT JOIN motor_policy_type_master pt
        ON pt.policy_type_id = tr.policy_type_id

    LEFT JOIN motor_policy_term_master ptr
        ON ptr.policy_term_id = tr.policy_term_id

    LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = tr.vehicle_category_id

    LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = tr.vehicle_class_id

    LEFT JOIN motor_vehicle_usages u
        ON u.usage_id = tr.usage_id

    LEFT JOIN motor_engine_cc_slabs ecs
        ON ecs.engine_cc_slab_id = s.engine_cc_slab_id

    LEFT JOIN motor_gvw_slabs gs
        ON gs.gvw_slab_id = s.gvw_slab_id

    ORDER BY
        tr.tp_rate_id ASC,
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
                description = ?,
                is_active = ?

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
            data.is_active,
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