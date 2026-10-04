const MotorVehicleInputFieldService = require("./motorVehicleInputField.service");

const MotorVehicleInputFieldController = {

    // CREATE
    createInputField: (req, res) => {

        const {
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
        } = req.body;


        // VEHICLE CATEGORY
        if (
            vehicle_category_id === undefined ||
            vehicle_category_id === null ||
            vehicle_category_id === "" ||
            isNaN(vehicle_category_id) ||
            Number(vehicle_category_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid vehicle category is required"
            });
        }


        // VEHICLE CLASS
        if (
            vehicle_class_id !== undefined &&
            vehicle_class_id !== null &&
            vehicle_class_id !== "" &&
            (isNaN(vehicle_class_id) || Number(vehicle_class_id) <= 0)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid vehicle class is required"
            });
        }


        // FIELD CODE
        if (!field_code || typeof field_code !== "string") {
            return res.status(200).json({
                success: 0,
                message: "Field code is required"
            });
        }

        if (field_code.length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Field code cannot exceed 50 characters"
            });
        }


        // FIELD LABEL
        if (!field_label || typeof field_label !== "string") {
            return res.status(200).json({
                success: 0,
                message: "Field label is required"
            });
        }

        if (field_label.length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Field label cannot exceed 150 characters"
            });
        }


        // FIELD TYPE
        const allowedFieldTypes = [
            "TEXT",
            "NUMBER",
            "DATE",
            "SELECT",
            "DECIMAL",
            "BOOLEAN"
        ];

        if (!allowedFieldTypes.includes(field_type)) {
            return res.status(200).json({
                success: 0,
                message: "Invalid field type"
            });
        }


        // REQUIRED
        if (
            is_required !== undefined &&
            is_required !== null &&
            ![0, 1, "0", "1", true, false].includes(is_required)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid required value"
            });
        }


        // VISIBLE
        if (
            is_visible !== undefined &&
            is_visible !== null &&
            ![0, 1, "0", "1", true, false].includes(is_visible)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid visible value"
            });
        }


        // DISPLAY ORDER
        if (
            display_order === undefined ||
            display_order === null ||
            display_order === "" ||
            isNaN(display_order)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Display order is required"
            });
        }

        if (Number(display_order) < 0) {
            return res.status(200).json({
                success: 0,
                message: "Display order cannot be negative"
            });
        }


        // MIN VALUE
        if (
            min_value !== undefined &&
            min_value !== null &&
            min_value !== "" &&
            isNaN(min_value)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Minimum value must be a valid number"
            });
        }


        // MAX VALUE
        if (
            max_value !== undefined &&
            max_value !== null &&
            max_value !== "" &&
            isNaN(max_value)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Maximum value must be a valid number"
            });
        }


        // MIN / MAX VALIDATION
        if (
            min_value !== undefined &&
            min_value !== null &&
            min_value !== "" &&
            max_value !== undefined &&
            max_value !== null &&
            max_value !== "" &&
            Number(min_value) > Number(max_value)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Minimum value cannot be greater than maximum value"
            });
        }


        // PLACEHOLDER
        if (placeholder && typeof placeholder !== "string") {
            return res.status(200).json({
                success: 0,
                message: "Placeholder must be a string"
            });
        }

        if (placeholder && placeholder.length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Placeholder cannot exceed 150 characters"
            });
        }


        const data = {

            vehicle_category_id: Number(vehicle_category_id),

            vehicle_class_id:
                vehicle_class_id !== undefined &&
                vehicle_class_id !== null &&
                vehicle_class_id !== ""
                    ? Number(vehicle_class_id)
                    : null,

            field_code: field_code.trim(),

            field_label: field_label.trim(),

            field_type,

            is_required:
                is_required !== undefined &&
                is_required !== null
                    ? Number(is_required)
                    : 1,

            is_visible:
                is_visible !== undefined &&
                is_visible !== null
                    ? Number(is_visible)
                    : 1,

            display_order: Number(display_order),

            min_value:
                min_value !== undefined &&
                min_value !== null &&
                min_value !== ""
                    ? Number(min_value)
                    : null,

            max_value:
                max_value !== undefined &&
                max_value !== null &&
                max_value !== ""
                    ? Number(max_value)
                    : null,

            placeholder:
                placeholder
                    ? placeholder.trim()
                    : null,

            is_active:
                is_active !== undefined &&
                is_active !== null
                    ? Number(is_active)
                    : 1
        };


        MotorVehicleInputFieldService.createInputField(
            data,
            (error, result) => {

                if (error) {

                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "Input field already exists"
                        });
                    }

                    if (error.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid vehicle category or vehicle class"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to create input field",
                        error
                    });
                }


                return res.status(200).json({
                    success: 1,
                    message: result.message,
                    vehicle_input_field_id:
                        result.vehicle_input_field_id
                });

            }
        );
    },


    // GET ALL
    getAllInputFields: (req, res) => {

        MotorVehicleInputFieldService.getAllInputFields(
            (error, results) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch input fields",
                        error
                    });
                }

                return res.status(200).json({
                    success: 1,
                    data: results
                });

            }
        );
    },


    // GET BY ID
    getInputFieldById: (req, res) => {

        const {
            vehicle_input_field_id
        } = req.params;


        if (
            !vehicle_input_field_id ||
            isNaN(vehicle_input_field_id) ||
            Number(vehicle_input_field_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid input field ID is required"
            });
        }


        MotorVehicleInputFieldService.getInputFieldById(
            vehicle_input_field_id,
            (error, result) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch input field",
                        error
                    });
                }


                if (!result) {
                    return res.status(200).json({
                        success: 0,
                        message: "Input field not found"
                    });
                }


                return res.status(200).json({
                    success: 1,
                    data: result
                });

            }
        );
    },


    // UPDATE
    updateInputField: (req, res) => {

        const {
            vehicle_input_field_id
        } = req.params;


        if (
            !vehicle_input_field_id ||
            isNaN(vehicle_input_field_id) ||
            Number(vehicle_input_field_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid input field ID is required"
            });
        }


        const {
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
        } = req.body;


        // VEHICLE CATEGORY
        if (
            vehicle_category_id === undefined ||
            vehicle_category_id === null ||
            vehicle_category_id === "" ||
            isNaN(vehicle_category_id) ||
            Number(vehicle_category_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid vehicle category is required"
            });
        }


        // VEHICLE CLASS
        if (
            vehicle_class_id !== undefined &&
            vehicle_class_id !== null &&
            vehicle_class_id !== "" &&
            (isNaN(vehicle_class_id) || Number(vehicle_class_id) <= 0)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid vehicle class is required"
            });
        }


        // FIELD CODE
        if (!field_code || typeof field_code !== "string") {
            return res.status(200).json({
                success: 0,
                message: "Field code is required"
            });
        }

        if (field_code.length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Field code cannot exceed 50 characters"
            });
        }


        // FIELD LABEL
        if (!field_label || typeof field_label !== "string") {
            return res.status(200).json({
                success: 0,
                message: "Field label is required"
            });
        }

        if (field_label.length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Field label cannot exceed 150 characters"
            });
        }


        // FIELD TYPE
        const allowedFieldTypes = [
            "TEXT",
            "NUMBER",
            "DATE",
            "SELECT",
            "DECIMAL",
            "BOOLEAN"
        ];

        if (!allowedFieldTypes.includes(field_type)) {
            return res.status(200).json({
                success: 0,
                message: "Invalid field type"
            });
        }


        // DISPLAY ORDER
        if (
            display_order === undefined ||
            display_order === null ||
            display_order === "" ||
            isNaN(display_order)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Display order is required"
            });
        }

        if (Number(display_order) < 0) {
            return res.status(200).json({
                success: 0,
                message: "Display order cannot be negative"
            });
        }


        // MIN VALUE
        if (
            min_value !== undefined &&
            min_value !== null &&
            min_value !== "" &&
            isNaN(min_value)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Minimum value must be a valid number"
            });
        }


        // MAX VALUE
        if (
            max_value !== undefined &&
            max_value !== null &&
            max_value !== "" &&
            isNaN(max_value)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Maximum value must be a valid number"
            });
        }


        // MIN / MAX VALIDATION
        if (
            min_value !== undefined &&
            min_value !== null &&
            min_value !== "" &&
            max_value !== undefined &&
            max_value !== null &&
            max_value !== "" &&
            Number(min_value) > Number(max_value)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Minimum value cannot be greater than maximum value"
            });
        }


        // PLACEHOLDER
        if (placeholder && typeof placeholder !== "string") {
            return res.status(200).json({
                success: 0,
                message: "Placeholder must be a string"
            });
        }

        if (placeholder && placeholder.length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Placeholder cannot exceed 150 characters"
            });
        }


        const data = {

            vehicle_category_id: Number(vehicle_category_id),

            vehicle_class_id:
                vehicle_class_id !== undefined &&
                vehicle_class_id !== null &&
                vehicle_class_id !== ""
                    ? Number(vehicle_class_id)
                    : null,

            field_code: field_code.trim(),

            field_label: field_label.trim(),

            field_type,

            is_required:
                is_required !== undefined &&
                is_required !== null
                    ? Number(is_required)
                    : 1,

            is_visible:
                is_visible !== undefined &&
                is_visible !== null
                    ? Number(is_visible)
                    : 1,

            display_order: Number(display_order),

            min_value:
                min_value !== undefined &&
                min_value !== null &&
                min_value !== ""
                    ? Number(min_value)
                    : null,

            max_value:
                max_value !== undefined &&
                max_value !== null &&
                max_value !== ""
                    ? Number(max_value)
                    : null,

            placeholder:
                placeholder
                    ? placeholder.trim()
                    : null,

            is_active:
                is_active !== undefined &&
                is_active !== null
                    ? Number(is_active)
                    : 1
        };


        MotorVehicleInputFieldService.updateInputField(
            vehicle_input_field_id,
            data,
            (error, result) => {

                if (error) {

                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "Input field already exists"
                        });
                    }

                    if (error.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid vehicle category or vehicle class"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to update input field",
                        error
                    });
                }


                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "Input field not found"
                    });
                }


                return res.status(200).json({
                    success: 1,
                    message: result.message
                });

            }
        );
    },


    // DELETE / SOFT DELETE
    deleteInputField: (req, res) => {

        const {
            vehicle_input_field_id
        } = req.params;


        if (
            !vehicle_input_field_id ||
            isNaN(vehicle_input_field_id) ||
            Number(vehicle_input_field_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid input field ID is required"
            });
        }


        MotorVehicleInputFieldService.deleteInputField(
            vehicle_input_field_id,
            (error, result) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to delete input field",
                        error
                    });
                }


                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "Input field not found"
                    });
                }


                return res.status(200).json({
                    success: 1,
                    message: result.message
                });

            }
        );
    },


    // GET ACTIVE
    getActiveInputFields: (req, res) => {

        MotorVehicleInputFieldService.getActiveInputFields(
            (error, results) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch active input fields",
                        error
                    });
                }


                return res.status(200).json({
                    success: 1,
                    data: results
                });

            }
        );
    },


    // GET BY CATEGORY
    getInputFieldsByCategory: (req, res) => {

        const {
            vehicle_category_id
        } = req.params;


        if (
            !vehicle_category_id ||
            isNaN(vehicle_category_id) ||
            Number(vehicle_category_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid vehicle category ID is required"
            });
        }


        MotorVehicleInputFieldService.getInputFieldsByCategory(
            vehicle_category_id,
            (error, results) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch category input fields",
                        error
                    });
                }


                return res.status(200).json({
                    success: 1,
                    data: results
                });

            }
        );
    }

};


module.exports = MotorVehicleInputFieldController;