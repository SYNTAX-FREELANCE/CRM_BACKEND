const pool = require("../../dbconfig/dbconfig");

module.exports = {

    // ==================== CREATE CUSTOMER PAY TYPE ====================

    createCustomerPayType: (customerPayTypeData, callback) => {

        pool.query(

            `INSERT INTO customer_pay_type_master
            (
                pay_type_name,
                description,
                is_active,
                created_at
            )
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,

            [
                customerPayTypeData.pay_type_name,
                customerPayTypeData.description,
                customerPayTypeData.is_active
            ],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== GET ALL CUSTOMER PAY TYPES ====================

    getAllCustomerPayTypes: (callback) => {

        pool.query(

            `SELECT
                *
             FROM customer_pay_type_master
             ORDER BY created_at DESC`,

            [],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== GET CUSTOMER PAY TYPE BY ID ====================

    getCustomerPayTypeById: (
        customerPayTypeId,
        callback
    ) => {

        pool.query(

            `SELECT
                *
             FROM customer_pay_type_master
             WHERE customer_pay_type_id = ?`,

            [customerPayTypeId],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                if (!result || result.length === 0) {
                    return callback(null, null);
                }

                callback(null, result[0]);

            }

        );

    },


    // ==================== UPDATE CUSTOMER PAY TYPE ====================

    updateCustomerPayType: (
        customerPayTypeId,
        customerPayTypeData,
        callback
    ) => {

        pool.query(

            `UPDATE customer_pay_type_master
             SET
                pay_type_name = ?,
                description = ?,
                is_active = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE customer_pay_type_id = ?`,

            [
                customerPayTypeData.pay_type_name,
                customerPayTypeData.description,
                customerPayTypeData.is_active,
                customerPayTypeId
            ],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== DELETE CUSTOMER PAY TYPE ====================

    deleteCustomerPayType: (
        customerPayTypeId,
        callback
    ) => {

        pool.query(

            `UPDATE customer_pay_type_master
             SET
                is_active = 0,
                updated_at = CURRENT_TIMESTAMP
             WHERE customer_pay_type_id = ?`,

            [customerPayTypeId],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== GET ACTIVE CUSTOMER PAY TYPES ====================

    getActiveCustomerPayTypes: (callback) => {

        pool.query(

            `SELECT
                *
             FROM customer_pay_type_master
             WHERE is_active = 1
             ORDER BY pay_type_name ASC`,

            [],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    }

};