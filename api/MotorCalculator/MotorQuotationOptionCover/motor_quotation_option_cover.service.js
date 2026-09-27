const pool = require("../../../dbconfig/dbconfig");

const MotorQuotationOptionCoverService = {

    // CREATE
    createQuotationOptionCover: (data, callback) => {

        const {
            quotation_option_id,
            cover_id,
            quantity,
            rate,
            amount
        } = data;

        const query = `
            INSERT INTO motor_quotation_option_covers (
                quotation_option_id,
                cover_id,
                quantity,
                rate,
                amount
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        pool.query(
            query,
            [
                quotation_option_id,
                cover_id,
                quantity || 1,
                rate || 0,
                amount || 0
            ],
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, {
                    quotation_option_cover_id: result.insertId
                });
            }
        );
    },


    // GET ALL
    getAllQuotationOptionCovers: (callback) => {

        const query = `
            SELECT
                qoc.quotation_option_cover_id,
                qoc.quotation_option_id,
                qoc.cover_id,

                mc.cover_code,
                mc.cover_name,
                mc.cover_type,

                qoc.quantity,
                qoc.rate,
                qoc.amount,

                qoc.created_at,
                qoc.updated_at

            FROM motor_quotation_option_covers qoc

            INNER JOIN motor_cover_master mc
                ON mc.cover_id = qoc.cover_id

            ORDER BY qoc.quotation_option_cover_id DESC
        `;

        pool.query(query, (err, results) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, results);
        });
    },


    // GET BY ID
    getQuotationOptionCoverById: (
        quotation_option_cover_id,
        callback
    ) => {

        const query = `
            SELECT
                qoc.quotation_option_cover_id,
                qoc.quotation_option_id,
                qoc.cover_id,

                mc.cover_code,
                mc.cover_name,
                mc.cover_type,

                qoc.quantity,
                qoc.rate,
                qoc.amount,

                qoc.created_at,
                qoc.updated_at

            FROM motor_quotation_option_covers qoc

            INNER JOIN motor_cover_master mc
                ON mc.cover_id = qoc.cover_id

            WHERE qoc.quotation_option_cover_id = ?
        `;

        pool.query(
            query,
            [quotation_option_cover_id],
            (err, results) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, results);
            }
        );
    },


    // GET BY QUOTATION OPTION
    getQuotationOptionCoversByOption: (
        quotation_option_id,
        callback
    ) => {

        const query = `
            SELECT
                qoc.quotation_option_cover_id,
                qoc.quotation_option_id,
                qoc.cover_id,

                mc.cover_code,
                mc.cover_name,
                mc.cover_type,

                qoc.quantity,
                qoc.rate,
                qoc.amount,

                qoc.created_at,
                qoc.updated_at

            FROM motor_quotation_option_covers qoc

            INNER JOIN motor_cover_master mc
                ON mc.cover_id = qoc.cover_id

            WHERE qoc.quotation_option_id = ?

            ORDER BY qoc.quotation_option_cover_id DESC
        `;

        pool.query(
            query,
            [quotation_option_id],
            (err, results) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, results);
            }
        );
    },


    // UPDATE
    updateQuotationOptionCover: (
        quotation_option_cover_id,
        data,
        callback
    ) => {

        const {
            quotation_option_id,
            cover_id,
            quantity,
            rate,
            amount
        } = data;

        const query = `
            UPDATE motor_quotation_option_covers
            SET
                quotation_option_id = ?,
                cover_id = ?,
                quantity = ?,
                rate = ?,
                amount = ?
            WHERE quotation_option_cover_id = ?
        `;

        pool.query(
            query,
            [
                quotation_option_id,
                cover_id,
                quantity || 1,
                rate || 0,
                amount || 0,
                quotation_option_cover_id
            ],
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);
            }
        );
    },


    // DELETE
    deleteQuotationOptionCover: (
        quotation_option_cover_id,
        callback
    ) => {

        const query = `
            DELETE FROM motor_quotation_option_covers
            WHERE quotation_option_cover_id = ?
        `;

        pool.query(
            query,
            [quotation_option_cover_id],
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);
            }
        );
    }
};

module.exports = MotorQuotationOptionCoverService;