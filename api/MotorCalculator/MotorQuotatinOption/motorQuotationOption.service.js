const pool = require("../../../dbconfig/dbconfig");

const MotorQuotationOptionService = {

    // CREATE
    createQuotationOption: (data, callback) => {

        const query = `
            INSERT INTO motor_quotation_options (
                motor_quotation_id,
                insurance_company_id,
                option_number,
                calculation_status,
                idv,
                basic_od,
                od_discount,
                ncb_percentage,
                ncb_amount,
                de_tariff_amount,
                net_od,
                tp_premium,
                zd_premium,
                addon_premium,
                cpa_premium,
                liability_premium,
                passenger_premium,
                subtotal,
                commission_amount,
                cashback_amount,
                taxable_amount,
                gst_amount,
                total_premium,
                final_premium,
                od_rate_id,
                tp_rate_id,
                ncb_rule_id,
                discount_rule_id,
                zd_rate_id,
                commission_rule_id,
                cashback_rule_id,
                tax_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.motor_quotation_id,
            data.insurance_company_id,
            data.option_number,
            data.calculation_status || "PENDING",

            data.idv || 0,

            data.basic_od || 0,
            data.od_discount || 0,

            data.ncb_percentage || 0,
            data.ncb_amount || 0,

            data.de_tariff_amount || 0,
            data.net_od || 0,

            data.tp_premium || 0,

            data.zd_premium || 0,
            data.addon_premium || 0,

            data.cpa_premium || 0,
            data.liability_premium || 0,
            data.passenger_premium || 0,

            data.subtotal || 0,

            data.commission_amount || 0,
            data.cashback_amount || 0,

            data.taxable_amount || 0,
            data.gst_amount || 0,

            data.total_premium || 0,
            data.final_premium || 0,

            data.od_rate_id || null,
            data.tp_rate_id || null,
            data.ncb_rule_id || null,
            data.discount_rule_id || null,
            data.zd_rate_id || null,
            data.commission_rule_id || null,
            data.cashback_rule_id || null,
            data.tax_id || null
        ];

        pool.query(query, values, (error, result) => {

            if (error) {
                return callback(error);
            }

            callback(null, {
                quotation_option_id: result.insertId,
                message: "Quotation option created successfully"
            });
        });
    },


    // GET ALL
    getAllQuotationOptions: (callback) => {

        const query = `
            SELECT
                qo.*,

                ic.insurance_company_name,

                mq.quotation_number

            FROM motor_quotation_options qo

            INNER JOIN insurance_companies ic
                ON ic.insurance_company_id = qo.insurance_company_id

            INNER JOIN motor_quotations mq
                ON mq.motor_quotation_id = qo.motor_quotation_id

            ORDER BY
                qo.motor_quotation_id DESC,
                qo.option_number ASC,
                qo.quotation_option_id ASC
        `;

        pool.query(query, (error, results) => {

            if (error) {
                return callback(error);
            }

            callback(null, results);
        });
    },


    // GET BY ID
    getQuotationOptionById: (quotation_option_id, callback) => {

        const query = `
            SELECT
                qo.*,

                ic.insurance_company_name,

                mq.quotation_number

            FROM motor_quotation_options qo

            INNER JOIN insurance_companies ic
                ON ic.insurance_company_id = qo.insurance_company_id

            INNER JOIN motor_quotations mq
                ON mq.motor_quotation_id = qo.motor_quotation_id

            WHERE qo.quotation_option_id = ?
        `;

        pool.query(
            query,
            [quotation_option_id],
            (error, results) => {

                if (error) {
                    return callback(error);
                }

                callback(null, results[0] || null);
            }
        );
    },


    // GET BY QUOTATION
    getQuotationOptionsByQuotation: (motor_quotation_id, callback) => {

        const query = `
            SELECT
                qo.*,

                ic.insurance_company_name,

                mq.quotation_number

            FROM motor_quotation_options qo

            INNER JOIN insurance_companies ic
                ON ic.insurance_company_id = qo.insurance_company_id

            INNER JOIN motor_quotations mq
                ON mq.motor_quotation_id = qo.motor_quotation_id

            WHERE qo.motor_quotation_id = ?

            ORDER BY
                qo.option_number ASC,
                qo.quotation_option_id ASC
        `;

        pool.query(
            query,
            [motor_quotation_id],
            (error, results) => {

                if (error) {
                    return callback(error);
                }

                callback(null, results);
            }
        );
    },


    // UPDATE
    updateQuotationOption: (
        quotation_option_id,
        data,
        callback
    ) => {

        const query = `
            UPDATE motor_quotation_options
            SET
                motor_quotation_id = ?,
                insurance_company_id = ?,
                option_number = ?,
                calculation_status = ?,

                idv = ?,

                basic_od = ?,
                od_discount = ?,

                ncb_percentage = ?,
                ncb_amount = ?,

                de_tariff_amount = ?,
                net_od = ?,

                tp_premium = ?,

                zd_premium = ?,
                addon_premium = ?,

                cpa_premium = ?,
                liability_premium = ?,
                passenger_premium = ?,

                subtotal = ?,

                commission_amount = ?,
                cashback_amount = ?,

                taxable_amount = ?,
                gst_amount = ?,

                total_premium = ?,
                final_premium = ?,

                od_rate_id = ?,
                tp_rate_id = ?,
                ncb_rule_id = ?,
                discount_rule_id = ?,
                zd_rate_id = ?,
                commission_rule_id = ?,
                cashback_rule_id = ?,
                tax_id = ?

            WHERE quotation_option_id = ?
        `;

        const values = [
            data.motor_quotation_id,
            data.insurance_company_id,
            data.option_number,
            data.calculation_status,

            data.idv || 0,

            data.basic_od || 0,
            data.od_discount || 0,

            data.ncb_percentage || 0,
            data.ncb_amount || 0,

            data.de_tariff_amount || 0,
            data.net_od || 0,

            data.tp_premium || 0,

            data.zd_premium || 0,
            data.addon_premium || 0,

            data.cpa_premium || 0,
            data.liability_premium || 0,
            data.passenger_premium || 0,

            data.subtotal || 0,

            data.commission_amount || 0,
            data.cashback_amount || 0,

            data.taxable_amount || 0,
            data.gst_amount || 0,

            data.total_premium || 0,
            data.final_premium || 0,

            data.od_rate_id || null,
            data.tp_rate_id || null,
            data.ncb_rule_id || null,
            data.discount_rule_id || null,
            data.zd_rate_id || null,
            data.commission_rule_id || null,
            data.cashback_rule_id || null,
            data.tax_id || null,

            quotation_option_id
        ];

        pool.query(query, values, (error, result) => {

            if (error) {
                return callback(error);
            }

            callback(null, {
                affectedRows: result.affectedRows,
                message: "Quotation option updated successfully"
            });
        });
    },


    // DELETE
    deleteQuotationOption: (quotation_option_id, callback) => {

        const query = `
            DELETE FROM motor_quotation_options
            WHERE quotation_option_id = ?
        `;

        pool.query(
            query,
            [quotation_option_id],
            (error, result) => {

                if (error) {
                    return callback(error);
                }

                callback(null, {
                    affectedRows: result.affectedRows,
                    message: "Quotation option deleted successfully"
                });
            }
        );
    }
};

module.exports = MotorQuotationOptionService;