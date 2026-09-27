const pool = require("../../../dbconfig/dbconfig");

const MotorQuotationInputService = {

    // CREATE
    createQuotationInput: (data, callback) => {

        const query = `
            INSERT INTO motor_quotation_input (
                motor_quotation_id,
                registration_date,
                policy_start_date,
                policy_end_date,
                vehicle_type_id,
                vehicle_category_id,
                vehicle_class_id,
                fuel_type_id,
                usage_id,
                engine_cc,
                gvw,
                seating_capacity,
                vehicle_age_months,
                idv,
                previous_policy_id,
                previous_insurance_company_id,
                previous_ncb_percentage,
                claim_status,
                claim_count,
                business_type_id,
                product_id,
                policy_type_id,
                policy_term_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.motor_quotation_id,
            data.registration_date || null,
            data.policy_start_date,
            data.policy_end_date || null,
            data.vehicle_type_id || null,
            data.vehicle_category_id || null,
            data.vehicle_class_id || null,
            data.fuel_type_id || null,
            data.usage_id || null,
            data.engine_cc || null,
            data.gvw || null,
            data.seating_capacity || null,
            data.vehicle_age_months || null,
            data.idv || 0,
            data.previous_policy_id || null,
            data.previous_insurance_company_id || null,
            data.previous_ncb_percentage || null,
            data.claim_status || "NO_CLAIM",
            data.claim_count || 0,
            data.business_type_id || null,
            data.product_id,
            data.policy_type_id,
            data.policy_term_id || null
        ];

        pool.query(query, values, (error, result) => {

            if (error) {
                return callback(error);
            }

            callback(null, {
                quotation_input_id: result.insertId,
                message: "Quotation input created successfully"
            });
        });
    },


    // GET ALL
    getAllQuotationInputs: (callback) => {

        const query = `
            SELECT
                qi.quotation_input_id,
                qi.motor_quotation_id,

                qi.registration_date,
                qi.policy_start_date,
                qi.policy_end_date,

                qi.vehicle_type_id,
                vt.vehicle_type_name,

                qi.vehicle_category_id,
                mvc.category_name AS vehicle_category_name,

                qi.vehicle_class_id,
                mvc2.class_name AS vehicle_class_name,

                qi.fuel_type_id,
                mft.fuel_name,

                qi.usage_id,
                mvu.usage_name,

                qi.engine_cc,
                qi.gvw,
                qi.seating_capacity,
                qi.vehicle_age_months,
                qi.idv,

                qi.previous_policy_id,
                qi.previous_insurance_company_id,
                ic.insurance_company_name AS previous_insurance_company_name,

                qi.previous_ncb_percentage,

                qi.claim_status,
                qi.claim_count,

                qi.business_type_id,
                mbtm.business_type_name,

                qi.product_id,
                mpm.product_name,

                qi.policy_type_id,
                mptm.policy_type_name,

                qi.policy_term_id,
                mptm2.term_name AS policy_term_name,

                qi.created_at,
                qi.updated_at

            FROM motor_quotation_input qi

            LEFT JOIN vehicle_types vt
                ON vt.vehicle_type_id = qi.vehicle_type_id

            LEFT JOIN motor_vehicle_categories mvc
                ON mvc.vehicle_category_id = qi.vehicle_category_id

            LEFT JOIN motor_vehicle_classes mvc2
                ON mvc2.vehicle_class_id = qi.vehicle_class_id

            LEFT JOIN motor_fuel_types mft
                ON mft.fuel_type_id = qi.fuel_type_id

            LEFT JOIN motor_vehicle_usages mvu
                ON mvu.usage_id = qi.usage_id

            LEFT JOIN insurance_companies ic
                ON ic.insurance_company_id = qi.previous_insurance_company_id

            LEFT JOIN motor_business_type_master mbtm
                ON mbtm.business_type_id = qi.business_type_id

            INNER JOIN motor_product_master mpm
                ON mpm.product_id = qi.product_id

            INNER JOIN motor_policy_type_master mptm
                ON mptm.policy_type_id = qi.policy_type_id

            LEFT JOIN motor_policy_term_master mptm2
                ON mptm2.policy_term_id = qi.policy_term_id

            ORDER BY qi.created_at DESC,
                     qi.quotation_input_id DESC
        `;

        pool.query(query, (error, results) => {

            if (error) {
                return callback(error);
            }

            callback(null, results);
        });
    },


    // GET BY ID
    getQuotationInputById: (quotation_input_id, callback) => {

        const query = `
            SELECT
                qi.quotation_input_id,
                qi.motor_quotation_id,

                qi.registration_date,
                qi.policy_start_date,
                qi.policy_end_date,

                qi.vehicle_type_id,
                vt.vehicle_type_name,

                qi.vehicle_category_id,
                mvc.category_name AS vehicle_category_name,

                qi.vehicle_class_id,
                mvc2.class_name AS vehicle_class_name,

                qi.fuel_type_id,
                mft.fuel_name,

                qi.usage_id,
                mvu.usage_name,

                qi.engine_cc,
                qi.gvw,
                qi.seating_capacity,
                qi.vehicle_age_months,
                qi.idv,

                qi.previous_policy_id,
                qi.previous_insurance_company_id,
                ic.insurance_company_name AS previous_insurance_company_name,

                qi.previous_ncb_percentage,

                qi.claim_status,
                qi.claim_count,

                qi.business_type_id,
                mbtm.business_type_name,

                qi.product_id,
                mpm.product_name,

                qi.policy_type_id,
                mptm.policy_type_name,

                qi.policy_term_id,
                mptm2.term_name AS policy_term_name,

                qi.created_at,
                qi.updated_at

            FROM motor_quotation_input qi

            LEFT JOIN vehicle_types vt
                ON vt.vehicle_type_id = qi.vehicle_type_id

            LEFT JOIN motor_vehicle_categories mvc
                ON mvc.vehicle_category_id = qi.vehicle_category_id

            LEFT JOIN motor_vehicle_classes mvc2
                ON mvc2.vehicle_class_id = qi.vehicle_class_id

            LEFT JOIN motor_fuel_types mft
                ON mft.fuel_type_id = qi.fuel_type_id

            LEFT JOIN motor_vehicle_usages mvu
                ON mvu.usage_id = qi.usage_id

            LEFT JOIN insurance_companies ic
                ON ic.insurance_company_id = qi.previous_insurance_company_id

            LEFT JOIN motor_business_type_master mbtm
                ON mbtm.business_type_id = qi.business_type_id

            INNER JOIN motor_product_master mpm
                ON mpm.product_id = qi.product_id

            INNER JOIN motor_policy_type_master mptm
                ON mptm.policy_type_id = qi.policy_type_id

            LEFT JOIN motor_policy_term_master mptm2
                ON mptm2.policy_term_id = qi.policy_term_id

            WHERE qi.quotation_input_id = ?
        `;

        pool.query(
            query,
            [quotation_input_id],
            (error, results) => {

                if (error) {
                    return callback(error);
                }

                callback(null, results[0] || null);
            }
        );
    },


    // GET BY QUOTATION
    getQuotationInputByQuotationId: (motor_quotation_id, callback) => {

        const query = `
            SELECT
                qi.quotation_input_id,
                qi.motor_quotation_id,

                qi.registration_date,
                qi.policy_start_date,
                qi.policy_end_date,

                qi.vehicle_type_id,
                qi.vehicle_category_id,
                qi.vehicle_class_id,
                qi.fuel_type_id,
                qi.usage_id,

                qi.engine_cc,
                qi.gvw,
                qi.seating_capacity,
                qi.vehicle_age_months,
                qi.idv,

                qi.previous_policy_id,
                qi.previous_insurance_company_id,
                qi.previous_ncb_percentage,

                qi.claim_status,
                qi.claim_count,

                qi.business_type_id,
                qi.product_id,
                qi.policy_type_id,
                qi.policy_term_id,

                qi.created_at,
                qi.updated_at

            FROM motor_quotation_input qi

            WHERE qi.motor_quotation_id = ?
        `;

        pool.query(
            query,
            [motor_quotation_id],
            (error, results) => {

                if (error) {
                    return callback(error);
                }

                callback(null, results[0] || null);
            }
        );
    },


    // UPDATE
    updateQuotationInput: (quotation_input_id, data, callback) => {

        const query = `
            UPDATE motor_quotation_input
            SET
                motor_quotation_id = ?,
                registration_date = ?,
                policy_start_date = ?,
                policy_end_date = ?,
                vehicle_type_id = ?,
                vehicle_category_id = ?,
                vehicle_class_id = ?,
                fuel_type_id = ?,
                usage_id = ?,
                engine_cc = ?,
                gvw = ?,
                seating_capacity = ?,
                vehicle_age_months = ?,
                idv = ?,
                previous_policy_id = ?,
                previous_insurance_company_id = ?,
                previous_ncb_percentage = ?,
                claim_status = ?,
                claim_count = ?,
                business_type_id = ?,
                product_id = ?,
                policy_type_id = ?,
                policy_term_id = ?
            WHERE quotation_input_id = ?
        `;

        const values = [
            data.motor_quotation_id,
            data.registration_date || null,
            data.policy_start_date,
            data.policy_end_date || null,
            data.vehicle_type_id || null,
            data.vehicle_category_id || null,
            data.vehicle_class_id || null,
            data.fuel_type_id || null,
            data.usage_id || null,
            data.engine_cc || null,
            data.gvw || null,
            data.seating_capacity || null,
            data.vehicle_age_months || null,
            data.idv || 0,
            data.previous_policy_id || null,
            data.previous_insurance_company_id || null,
            data.previous_ncb_percentage || null,
            data.claim_status || "NO_CLAIM",
            data.claim_count || 0,
            data.business_type_id || null,
            data.product_id,
            data.policy_type_id,
            data.policy_term_id || null,
            quotation_input_id
        ];

        pool.query(query, values, (error, result) => {

            if (error) {
                return callback(error);
            }

            callback(null, {
                affectedRows: result.affectedRows,
                message: "Quotation input updated successfully"
            });
        });
    },


    // DELETE
    deleteQuotationInput: (quotation_input_id, callback) => {

        const query = `
            DELETE FROM motor_quotation_input
            WHERE quotation_input_id = ?
        `;

        pool.query(
            query,
            [quotation_input_id],
            (error, result) => {

                if (error) {
                    return callback(error);
                }

                callback(null, {
                    affectedRows: result.affectedRows,
                    message: "Quotation input deleted successfully"
                });
            }
        );
    }
};

module.exports = MotorQuotationInputService;