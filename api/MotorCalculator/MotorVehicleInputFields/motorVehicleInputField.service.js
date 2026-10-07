const pool = require("../../../dbconfig/dbconfig");

const MotorVehicleInputFieldService = {


    // CREATE
    createInputField: (data, callback) => {

        const query = `
            INSERT INTO motor_vehicle_input_fields (
                vehicle_category_id,
                vehicle_class_id,
                field_code,
                field_label,
                field_type,
                is_required,
                is_visible,
                display_order,
                min_value,
                max_value,
                placeholder,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;


        const values = [

            data.vehicle_category_id,

            data.vehicle_class_id || null,

            data.field_code,

            data.field_label,

            data.field_type,

            data.is_required,

            data.is_visible,

            data.display_order,

            data.min_value !== undefined
                ? data.min_value
                : null,

            data.max_value !== undefined
                ? data.max_value
                : null,

            data.placeholder || null,

            data.is_active

        ];


        pool.query(query, values, (error, result) => {

            if (error) {
                return callback(error);
            }


            callback(null, {

                vehicle_input_field_id:
                    result.insertId,

                message:
                    "Vehicle input field created successfully"

            });

        });
    },


    // GET ALL
    getAllInputFields: (callback) => {

        const query = `
            SELECT
                vif.vehicle_input_field_id,

                vif.vehicle_category_id,

                mvc.category_code,
                mvc.category_name,

                vif.vehicle_class_id,

                mvc2.class_code,
                mvc2.class_name,

                vif.field_code,
                vif.field_label,
                vif.field_type,

                vif.is_required,
                vif.is_visible,

                vif.display_order,

                vif.min_value,
                vif.max_value,

                vif.placeholder,

                vif.is_active,

                vif.created_at,
                vif.updated_at

            FROM motor_vehicle_input_fields vif

            INNER JOIN motor_vehicle_categories mvc
                ON vif.vehicle_category_id =
                   mvc.vehicle_category_id

            LEFT JOIN motor_vehicle_classes mvc2
                ON vif.vehicle_class_id =
                   mvc2.vehicle_class_id

            ORDER BY
                mvc.category_name ASC,
                mvc2.class_name ASC,
                vif.display_order ASC,
                vif.vehicle_input_field_id ASC
        `;


        pool.query(query, (error, results) => {

            if (error) {
                return callback(error);
            }


            callback(null, results);

        });
    },


    // GET BY ID
    getInputFieldById: (
        vehicle_input_field_id,
        callback
    ) => {

        const query = `
            SELECT
                vif.vehicle_input_field_id,

                vif.vehicle_category_id,

                mvc.category_code,
                mvc.category_name,

                vif.vehicle_class_id,

                mvc2.class_code,
                mvc2.class_name,

                vif.field_code,
                vif.field_label,
                vif.field_type,

                vif.is_required,
                vif.is_visible,

                vif.display_order,

                vif.min_value,
                vif.max_value,

                vif.placeholder,

                vif.is_active,

                vif.created_at,
                vif.updated_at

            FROM motor_vehicle_input_fields vif

            INNER JOIN motor_vehicle_categories mvc
                ON vif.vehicle_category_id =
                   mvc.vehicle_category_id

            LEFT JOIN motor_vehicle_classes mvc2
                ON vif.vehicle_class_id =
                   mvc2.vehicle_class_id

            WHERE vif.vehicle_input_field_id = ?
        `;


        pool.query(
            query,
            [vehicle_input_field_id],
            (error, results) => {

                if (error) {
                    return callback(error);
                }


                callback(
                    null,
                    results[0] || null
                );

            }
        );
    },


    // UPDATE
    updateInputField: (
        vehicle_input_field_id,
        data,
        callback
    ) => {

        const query = `
            UPDATE motor_vehicle_input_fields
            SET

                vehicle_category_id = ?,

                vehicle_class_id = ?,

                field_code = ?,

                field_label = ?,

                field_type = ?,

                is_required = ?,

                is_visible = ?,

                display_order = ?,

                min_value = ?,

                max_value = ?,

                placeholder = ?,

                is_active = ?

            WHERE vehicle_input_field_id = ?
        `;


        const values = [

            data.vehicle_category_id,

            data.vehicle_class_id || null,

            data.field_code,

            data.field_label,

            data.field_type,

            data.is_required,

            data.is_visible,

            data.display_order,

            data.min_value !== undefined
                ? data.min_value
                : null,

            data.max_value !== undefined
                ? data.max_value
                : null,

            data.placeholder || null,

            data.is_active,

            vehicle_input_field_id

        ];


        pool.query(
            query,
            values,
            (error, result) => {

                if (error) {
                    return callback(error);
                }


                callback(null, {

                    affectedRows:
                        result.affectedRows,

                    message:
                        "Vehicle input field updated successfully"

                });

            }
        );
    },


    // DELETE / SOFT DELETE
    deleteInputField: (
        vehicle_input_field_id,
        callback
    ) => {

        const query = `
            UPDATE motor_vehicle_input_fields

            SET is_active = 0

            WHERE vehicle_input_field_id = ?
        `;


        pool.query(
            query,
            [vehicle_input_field_id],
            (error, result) => {

                if (error) {
                    return callback(error);
                }


                callback(null, {

                    affectedRows:
                        result.affectedRows,

                    message:
                        "Vehicle input field deleted successfully"

                });

            }
        );
    },


    // GET ACTIVE
    getActiveInputFields: (callback) => {

        const query = `
            SELECT
                vif.vehicle_input_field_id,

                vif.vehicle_category_id,

                mvc.category_code,
                mvc.category_name,

                vif.vehicle_class_id,

                mvc2.class_code,
                mvc2.class_name,

                vif.field_code,
                vif.field_label,
                vif.field_type,

                vif.is_required,
                vif.is_visible,

                vif.display_order,

                vif.min_value,
                vif.max_value,

                vif.placeholder

            FROM motor_vehicle_input_fields vif

            INNER JOIN motor_vehicle_categories mvc
                ON vif.vehicle_category_id =
                   mvc.vehicle_category_id

            LEFT JOIN motor_vehicle_classes mvc2
                ON vif.vehicle_class_id =
                   mvc2.vehicle_class_id

            WHERE vif.is_active = 1

            ORDER BY
                mvc.category_name ASC,
                mvc2.class_name ASC,
                vif.display_order ASC,
                vif.vehicle_input_field_id ASC
        `;


        pool.query(query, (error, results) => {

            if (error) {
                return callback(error);
            }


            callback(null, results);

        });
    },


    // GET BY CATEGORY
    getInputFieldsByCategory: (
        vehicle_category_id,
        callback
    ) => {
console.log({
    vehicle_category_id
});

        const query = `
            SELECT
                vif.vehicle_input_field_id,

                vif.vehicle_category_id,

                mvc.category_code,
                mvc.category_name,

                vif.vehicle_class_id,

                mvc2.class_code,
                mvc2.class_name,

                vif.field_code,
                vif.field_label,
                vif.field_type,

                vif.is_required,
                vif.is_visible,

                vif.display_order,

                vif.min_value,
                vif.max_value,

                vif.placeholder

            FROM motor_vehicle_input_fields vif

            INNER JOIN motor_vehicle_categories mvc
                ON vif.vehicle_category_id =
                   mvc.vehicle_category_id

            LEFT JOIN motor_vehicle_classes mvc2
                ON vif.vehicle_class_id =
                   mvc2.vehicle_class_id

            WHERE
                vif.vehicle_category_id = ?

                AND vif.is_active = 1

                AND vif.is_visible = 1

            ORDER BY
                vif.display_order ASC,
                vif.vehicle_input_field_id ASC
        `;          


        pool.query(
            query,
            [vehicle_category_id],
            (error, results) => {

                if (error) {
                    return callback(error);
                }


                callback(null, results);

            }
        );
    }

};


module.exports = MotorVehicleInputFieldService;