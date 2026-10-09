const MotorTpRateService = require("./motorTpRate.service");

const MotorTpRateController = {

    // CREATE
    createTpRate: (req, res) => {

        const {
            insurance_company_id,
            product_id,
            policy_type_id,
            policy_term_id,
            vehicle_category_id,
            vehicle_class_id,
            usage_id,
            rate_type,
            description,
            effective_from,
            effective_to,
            is_active
        } = req.body;


        // PRODUCT
        if (
            product_id === undefined ||
            product_id === null ||
            product_id === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "Product is required"
            });
        }

        if (isNaN(product_id) || Number(product_id) <= 0) {
            return res.status(200).json({
                success: 0,
                message: "Product must be a valid value"
            });
        }


        // POLICY TYPE
        if (
            policy_type_id === undefined ||
            policy_type_id === null ||
            policy_type_id === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "Policy type is required"
            });
        }

        if (
            isNaN(policy_type_id) ||
            Number(policy_type_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Policy type must be a valid value"
            });
        }


        // OPTIONAL REFERENCES
        const optionalFields = [
            {
                value: insurance_company_id,
                name: "Insurance company"
            },
            {
                value: policy_term_id,
                name: "Policy term"
            },
            {
                value: vehicle_category_id,
                name: "Vehicle category"
            },
            {
                value: vehicle_class_id,
                name: "Vehicle class"
            },
            {
                value: usage_id,
                name: "Usage"
            }
        ];

        for (const field of optionalFields) {

            if (
                field.value !== undefined &&
                field.value !== null &&
                field.value !== ""
            ) {

                if (
                    isNaN(field.value) ||
                    Number(field.value) <= 0
                ) {
                    return res.status(200).json({
                        success: 0,
                        message: `${field.name} must be a valid value`
                    });
                }
            }
        }


        // RATE TYPE
        const rateType = rate_type || "FIXED";

        if (!["FIXED", "PER_UNIT"].includes(rateType)) {
            return res.status(200).json({
                success: 0,
                message: "Invalid rate type"
            });
        }


        // EFFECTIVE FROM
        if (!effective_from) {
            return res.status(200).json({
                success: 0,
                message: "Effective from date is required"
            });
        }


        // EFFECTIVE TO
        if (effective_to && effective_to < effective_from) {
            return res.status(200).json({
                success: 0,
                message: "Effective to date cannot be before effective from date"
            });
        }


        // DESCRIPTION
        if (description && description.length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }


        const data = {
            insurance_company_id:
                insurance_company_id === undefined ||
                    insurance_company_id === null ||
                    insurance_company_id === ""
                    ? null
                    : Number(insurance_company_id),

            product_id: Number(product_id),

            policy_type_id: Number(policy_type_id),

            policy_term_id:
                policy_term_id === undefined ||
                    policy_term_id === null ||
                    policy_term_id === ""
                    ? null
                    : Number(policy_term_id),

            vehicle_category_id:
                vehicle_category_id === undefined ||
                    vehicle_category_id === null ||
                    vehicle_category_id === ""
                    ? null
                    : Number(vehicle_category_id),

            vehicle_class_id:
                vehicle_class_id === undefined ||
                    vehicle_class_id === null ||
                    vehicle_class_id === ""
                    ? null
                    : Number(vehicle_class_id),

            usage_id:
                usage_id === undefined ||
                    usage_id === null ||
                    usage_id === ""
                    ? null
                    : Number(usage_id),

            rate_type: rateType,

            description: description || null,

            effective_from,

            effective_to: effective_to || null,
            is_active: is_active
        };


        MotorTpRateService.createTpRate(
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid reference. Please check the selected master values"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to create TP rate",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "TP rate created successfully",
                    data: result
                });
            }
        );
    },


    // GET ALL
    getAllTpRates: (req, res) => {

        MotorTpRateService.getAllTpRates(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch TP rates",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    data: result
                });
            }
        );
    },


    // GET BY ID
    getTpRateById: (req, res) => {

        const { id } = req.params;

        MotorTpRateService.getTpRateById(
            id,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch TP rate",
                        error: err
                    });
                }

                if (result.length === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "TP rate not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    data: result[0]
                });
            }
        );
    },


    // UPDATE
    updateTpRate: (req, res) => {

        const { id } = req.params;

        const {
            insurance_company_id,
            product_id,
            policy_type_id,
            policy_term_id,
            vehicle_category_id,
            vehicle_class_id,
            usage_id,
            rate_type,
            description,
            effective_from,
            effective_to,
            is_active
        } = req.body;


        // PRODUCT
        if (
            product_id === undefined ||
            product_id === null ||
            product_id === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "Product is required"
            });
        }

        if (isNaN(product_id) || Number(product_id) <= 0) {
            return res.status(200).json({
                success: 0,
                message: "Product must be a valid value"
            });
        }


        // POLICY TYPE
        if (
            policy_type_id === undefined ||
            policy_type_id === null ||
            policy_type_id === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "Policy type is required"
            });
        }

        if (
            isNaN(policy_type_id) ||
            Number(policy_type_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Policy type must be a valid value"
            });
        }


        // OPTIONAL REFERENCES
        const optionalFields = [
            {
                value: insurance_company_id,
                name: "Insurance company"
            },
            {
                value: policy_term_id,
                name: "Policy term"
            },
            {
                value: vehicle_category_id,
                name: "Vehicle category"
            },
            {
                value: vehicle_class_id,
                name: "Vehicle class"
            },
            {
                value: usage_id,
                name: "Usage"
            }
        ];

        for (const field of optionalFields) {

            if (
                field.value !== undefined &&
                field.value !== null &&
                field.value !== ""
            ) {

                if (
                    isNaN(field.value) ||
                    Number(field.value) <= 0
                ) {
                    return res.status(200).json({
                        success: 0,
                        message: `${field.name} must be a valid value`
                    });
                }
            }
        }


        // RATE TYPE
        const rateType = rate_type || "FIXED";

        if (!["FIXED", "PER_UNIT"].includes(rateType)) {
            return res.status(200).json({
                success: 0,
                message: "Invalid rate type"
            });
        }


        // EFFECTIVE FROM
        if (!effective_from) {
            return res.status(200).json({
                success: 0,
                message: "Effective from date is required"
            });
        }


        // EFFECTIVE TO
        if (effective_to && effective_to < effective_from) {
            return res.status(200).json({
                success: 0,
                message: "Effective to date cannot be before effective from date"
            });
        }


        // DESCRIPTION
        if (description && description.length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }


        const data = {
            insurance_company_id:
                insurance_company_id === undefined ||
                    insurance_company_id === null ||
                    insurance_company_id === ""
                    ? null
                    : Number(insurance_company_id),

            product_id: Number(product_id),

            policy_type_id: Number(policy_type_id),

            policy_term_id:
                policy_term_id === undefined ||
                    policy_term_id === null ||
                    policy_term_id === ""
                    ? null
                    : Number(policy_term_id),

            vehicle_category_id:
                vehicle_category_id === undefined ||
                    vehicle_category_id === null ||
                    vehicle_category_id === ""
                    ? null
                    : Number(vehicle_category_id),

            vehicle_class_id:
                vehicle_class_id === undefined ||
                    vehicle_class_id === null ||
                    vehicle_class_id === ""
                    ? null
                    : Number(vehicle_class_id),

            usage_id:
                usage_id === undefined ||
                    usage_id === null ||
                    usage_id === ""
                    ? null
                    : Number(usage_id),

            rate_type: rateType,

            description: description || null,

            effective_from,

            effective_to: effective_to || null,
            is_active: is_active
        };


        MotorTpRateService.updateTpRate(
            id,
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid reference. Please check the selected master values"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to update TP rate",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "TP rate updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteTpRate: (req, res) => {

        const { id } = req.params;

        MotorTpRateService.deleteTpRate(
            id,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to delete TP rate",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "TP rate deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActiveTpRates: (req, res) => {

        MotorTpRateService.getActiveTpRates(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch active TP rates",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    data: result
                });
            }
        );
    }
};

module.exports = MotorTpRateController;