const pool = require("../../../dbconfig/dbconfig");

const MotorOdRateService = {

    // CREATE
    createOdRate: (data, callback) => {

        const query = `
            INSERT INTO motor_od_rate_master
            (
                insurance_company_id,
                product_id,
                policy_type_id,
                vehicle_category_id,
                vehicle_class_id,
                fuel_type_id,
                usage_id,
                rate_type,
                rate_value,
                effective_from,
                effective_to,
                description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.insurance_company_id ?? null,
            data.product_id,
            data.policy_type_id,
            data.vehicle_category_id ?? null,
            data.vehicle_class_id ?? null,
            data.fuel_type_id ?? null,
            data.usage_id ?? null,
            data.rate_type,
            data.rate_value,
            data.effective_from,
            data.effective_to ?? null,
            data.description ?? null
        ];

        pool.query(query, values, callback);
    },


    // GET ALL
    getAllOdRates: (callback) => {

        const query = `
            SELECT
                odr.od_rate_id,

                odr.insurance_company_id,
                ic.insurance_company_name,

                odr.product_id,
                p.product_name,

                odr.policy_type_id,
                pt.policy_type_name,

                odr.vehicle_category_id,
                vc.category_name,

                odr.vehicle_class_id,
                vcl.class_name,

                odr.fuel_type_id,
                ft.fuel_name,

                odr.usage_id,
                vu.usage_name,

                odr.rate_type,
                odr.rate_value,

                odr.effective_from,
                odr.effective_to,

                odr.description,
                odr.is_active,

                odr.created_at,
                odr.updated_at

            FROM motor_od_rate_master odr

            LEFT JOIN insurance_companies ic
                ON ic.insurance_company_id = odr.insurance_company_id

            INNER JOIN motor_product_master p
                ON p.product_id = odr.product_id

            INNER JOIN motor_policy_type_master pt
                ON pt.policy_type_id = odr.policy_type_id

            LEFT JOIN motor_vehicle_categories vc
                ON vc.vehicle_category_id = odr.vehicle_category_id

            LEFT JOIN motor_vehicle_classes vcl
                ON vcl.vehicle_class_id = odr.vehicle_class_id

            LEFT JOIN motor_fuel_types ft
                ON ft.fuel_type_id = odr.fuel_type_id

            LEFT JOIN motor_vehicle_usages vu
                ON vu.usage_id = odr.usage_id

            ORDER BY
                odr.effective_from DESC,
                odr.od_rate_id DESC
        `;

        pool.query(query, callback);
    },


    // GET BY ID
    getOdRateById: (odRateId, callback) => {

        const query = `
            SELECT
                odr.od_rate_id,

                odr.insurance_company_id,
                ic.insurance_company_name,

                odr.product_id,
                p.product_name,

                odr.policy_type_id,
                pt.policy_type_name,

                odr.vehicle_category_id,
                vc.category_name,

                odr.vehicle_class_id,
                vcl.class_name,

                odr.fuel_type_id,
                ft.fuel_name,

                odr.usage_id,
                vu.usage_name,

                odr.rate_type,
                odr.rate_value,

                odr.effective_from,
                odr.effective_to,

                odr.description,
                odr.is_active,

                odr.created_at,
                odr.updated_at

            FROM motor_od_rate_master odr

            LEFT JOIN insurance_companies ic
                ON ic.insurance_company_id = odr.insurance_company_id

            INNER JOIN motor_product_master p
                ON p.product_id = odr.product_id

            INNER JOIN motor_policy_type_master pt
                ON pt.policy_type_id = odr.policy_type_id

            LEFT JOIN motor_vehicle_categories vc
                ON vc.vehicle_category_id = odr.vehicle_category_id

            LEFT JOIN motor_vehicle_classes vcl
                ON vcl.vehicle_class_id = odr.vehicle_class_id

            LEFT JOIN motor_fuel_types ft
                ON ft.fuel_type_id = odr.fuel_type_id

            LEFT JOIN motor_vehicle_usages vu
                ON vu.usage_id = odr.usage_id

            WHERE odr.od_rate_id = ?
        `;

        pool.query(query, [odRateId], callback);
    },


    // UPDATE
    updateOdRate: (odRateId, data, callback) => {

        const query = `
            UPDATE motor_od_rate_master
            SET
                insurance_company_id = ?,
                product_id = ?,
                policy_type_id = ?,
                vehicle_category_id = ?,
                vehicle_class_id = ?,
                fuel_type_id = ?,
                usage_id = ?,
                rate_type = ?,
                rate_value = ?,
                effective_from = ?,
                effective_to = ?,
                description = ?
            WHERE od_rate_id = ?
        `;

        const values = [
            data.insurance_company_id ?? null,
            data.product_id,
            data.policy_type_id,
            data.vehicle_category_id ?? null,
            data.vehicle_class_id ?? null,
            data.fuel_type_id ?? null,
            data.usage_id ?? null,
            data.rate_type,
            data.rate_value,
            data.effective_from,
            data.effective_to ?? null,
            data.description ?? null,
            odRateId
        ];

        pool.query(query, values, callback);
    },


    // DELETE
    deleteOdRate: (odRateId, callback) => {

        const query = `
            UPDATE motor_od_rate_master
            SET is_active = 0
            WHERE od_rate_id = ?
        `;

        pool.query(query, [odRateId], callback);
    },


    // GET ACTIVE
    getActiveOdRates: (callback) => {

        const query = `
            SELECT
                odr.od_rate_id,

                odr.insurance_company_id,
                ic.insurance_company_name,

                odr.product_id,
                p.product_name,

                odr.policy_type_id,
                pt.policy_type_name,

                odr.vehicle_category_id,
                vc.category_name,

                odr.vehicle_class_id,
                vcl.class_name,

                odr.fuel_type_id,
                ft.fuel_name,

                odr.usage_id,
                vu.usage_name,

                odr.rate_type,
                odr.rate_value,

                odr.effective_from,
                odr.effective_to,

                odr.description,
                odr.is_active

            FROM motor_od_rate_master odr

            LEFT JOIN insurance_companies ic
                ON ic.insurance_company_id = odr.insurance_company_id

            INNER JOIN motor_product_master p
                ON p.product_id = odr.product_id

            INNER JOIN motor_policy_type_master pt
                ON pt.policy_type_id = odr.policy_type_id

            LEFT JOIN motor_vehicle_categories vc
                ON vc.vehicle_category_id = odr.vehicle_category_id

            LEFT JOIN motor_vehicle_classes vcl
                ON vcl.vehicle_class_id = odr.vehicle_class_id

            LEFT JOIN motor_fuel_types ft
                ON ft.fuel_type_id = odr.fuel_type_id

            LEFT JOIN motor_vehicle_usages vu
                ON vu.usage_id = odr.usage_id

            WHERE odr.is_active = 1

            ORDER BY
                odr.effective_from DESC,
                odr.od_rate_id DESC
        `;

        pool.query(query, callback);
    }
};

module.exports = MotorOdRateService;