const pool = require("../../dbconfig/dbconfig");


module.exports = {


    // ==================== CREATE OUTCOME STATUS MAPPING ====================
    createOutcomeStatusMapping: (mappingData, callback) => {

        pool.query(
            `
        INSERT INTO crm_outcome_status_mapping
        (
            outcome_id,
            status_id,
            is_active
        )
        VALUES (?, ?, ?)
        `,
            [
                mappingData.outcome_id,
                mappingData.status_id,
                mappingData.is_active
            ],
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                return callback(null, result);
            }
        );

    },

    // ==================== GET ALL OUTCOME STATUS MAPPINGS ====================

    getAllOutcomeStatusMappings: (
        callback
    ) => {

        pool.query(

            `
            SELECT

                m.mapping_id,

                m.outcome_id,

                o.outcome_key,

                o.outcome_label,

                o.icon_key,

                m.status_id,

                s.status_name,

                m.is_active,

                m.created_at,

                m.updated_at

            FROM crm_outcome_status_mapping m

            INNER JOIN crm_outcome_master o
                ON o.outcome_id = m.outcome_id

            INNER JOIN lead_status_master s
                ON s.status_id = m.status_id

            ORDER BY
                o.display_order ASC,
                m.mapping_id DESC
            `,

            [],

            (err, result) => {

                if (err) {

                    return callback(
                        err,
                        null
                    );

                }


                callback(
                    null,
                    result
                );

            }

        );

    },


    // ==================== GET OUTCOME STATUS MAPPING BY ID ====================

    getOutcomeStatusMappingById: (
        mappingId,
        callback
    ) => {

        pool.query(

            `
            SELECT

                m.mapping_id,

                m.outcome_id,

                o.outcome_key,

                o.outcome_label,

                o.icon_key,

                m.status_id,

                s.status_name,

                m.is_active,

                m.created_at,

                m.updated_at

            FROM crm_outcome_status_mapping m

            INNER JOIN crm_outcome_master o
                ON o.outcome_id = m.outcome_id

            INNER JOIN lead_status_master s
                ON s.status_id = m.status_id

            WHERE
                m.mapping_id = ?
            `,

            [
                mappingId
            ],

            (err, result) => {

                if (err) {

                    return callback(
                        err,
                        null
                    );

                }


                if (
                    !result ||
                    result.length === 0
                ) {

                    return callback(
                        null,
                        null
                    );

                }


                callback(
                    null,
                    result[0]
                );

            }

        );

    },


    // ==================== UPDATE OUTCOME STATUS MAPPING ====================

    updateOutcomeStatusMapping: (
        mappingId,
        mappingData,
        callback
    ) => {

        pool.query(

            `
            UPDATE crm_outcome_status_mapping

            SET

                outcome_id = ?,

                status_id = ?,

                is_active = ?

            WHERE
                mapping_id = ?
            `,

            [

                mappingData.outcome_id,

                mappingData.status_id,

                mappingData.is_active,

                mappingId

            ],

            (err, result) => {

                if (err) {
                    return callback(
                        err,
                        null
                    );

                }
                callback(
                    null,
                    result
                );

            }

        );

    },
    getOutcomeByStatusIdService: (
        status_id,
        callback
    ) => {

        const sql = `
        SELECT
            m.mapping_id,
            m.outcome_id,
            o.outcome_key,
            o.outcome_label,
            o.icon_key,
            o.display_order,
            m.status_id,
            s.status_name,
            m.is_active

        FROM crm_outcome_status_mapping m

        INNER JOIN crm_outcome_master o
            ON o.outcome_id = m.outcome_id

        INNER JOIN lead_status_master s
            ON s.status_id = m.status_id

        WHERE m.status_id = ?
        AND m.is_active = 1
        AND o.is_active = 1
        AND s.is_active = 1

        ORDER BY o.display_order ASC
    `;
        pool.query(
            sql,
            [status_id],
            (err, result) => {
                if (err) {
                    console.error("getOutcomeByStatusIdService error:", err);
                    return callback(err);
                }
                return callback(
                    null,
                    result
                );
            }
        );
    }
};