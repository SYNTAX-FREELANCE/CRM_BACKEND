const pool = require("../../../dbconfig/dbconfig");

const MotorQuotationOptionAddonService = {

    // CREATE
    createQuotationOptionAddon: (data, callback) => {

        const {
            quotation_option_id,
            addon_id,
            rate,
            amount
        } = data;

        const query = `
            INSERT INTO motor_quotation_option_addons (
                quotation_option_id,
                addon_id,
                rate,
                amount
            )
            VALUES (?, ?, ?, ?)
        `;

        pool.query(
            query,
            [
                quotation_option_id,
                addon_id,
                rate || 0,
                amount || 0
            ],
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, {
                    quotation_option_addon_id: result.insertId
                });
            }
        );
    },


    // GET ALL
    getAllQuotationOptionAddons: (callback) => {

        const query = `
            SELECT
                qoaa.quotation_option_addon_id,
                qoaa.quotation_option_id,
                qoaa.addon_id,
                ma.addon_code,
                ma.addon_name,
                qoaa.rate,
                qoaa.amount,
                qoaa.created_at,
                qoaa.updated_at

            FROM motor_quotation_option_addons qoaa

            INNER JOIN motor_addon_master ma
                ON ma.addon_id = qoaa.addon_id

            ORDER BY qoaa.quotation_option_addon_id DESC
        `;

        pool.query(query, (err, results) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, results);
        });
    },


    // GET BY ID
    getQuotationOptionAddonById: (
        quotation_option_addon_id,
        callback
    ) => {

        const query = `
            SELECT
                qoaa.quotation_option_addon_id,
                qoaa.quotation_option_id,
                qoaa.addon_id,
                ma.addon_code,
                ma.addon_name,
                qoaa.rate,
                qoaa.amount,
                qoaa.created_at,
                qoaa.updated_at

            FROM motor_quotation_option_addons qoaa

            INNER JOIN motor_addon_master ma
                ON ma.addon_id = qoaa.addon_id

            WHERE qoaa.quotation_option_addon_id = ?
        `;

        pool.query(
            query,
            [quotation_option_addon_id],
            (err, results) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, results);
            }
        );
    },


    // GET BY QUOTATION OPTION
    getQuotationOptionAddonsByOption: (
        quotation_option_id,
        callback
    ) => {

        const query = `
            SELECT
                qoaa.quotation_option_addon_id,
                qoaa.quotation_option_id,
                qoaa.addon_id,
                ma.addon_code,
                ma.addon_name,
                qoaa.rate,
                qoaa.amount,
                qoaa.created_at,
                qoaa.updated_at

            FROM motor_quotation_option_addons qoaa

            INNER JOIN motor_addon_master ma
                ON ma.addon_id = qoaa.addon_id

            WHERE qoaa.quotation_option_id = ?

            ORDER BY qoaa.quotation_option_addon_id DESC
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
    updateQuotationOptionAddon: (
        quotation_option_addon_id,
        data,
        callback
    ) => {

        const {
            quotation_option_id,
            addon_id,
            rate,
            amount
        } = data;

        const query = `
            UPDATE motor_quotation_option_addons
            SET
                quotation_option_id = ?,
                addon_id = ?,
                rate = ?,
                amount = ?
            WHERE quotation_option_addon_id = ?
        `;

        pool.query(
            query,
            [
                quotation_option_id,
                addon_id,
                rate || 0,
                amount || 0,
                quotation_option_addon_id
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
    deleteQuotationOptionAddon: (
        quotation_option_addon_id,
        callback
    ) => {

        const query = `
            DELETE FROM motor_quotation_option_addons
            WHERE quotation_option_addon_id = ?
        `;

        pool.query(
            query,
            [quotation_option_addon_id],
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);
            }
        );
    }
};

module.exports = MotorQuotationOptionAddonService;