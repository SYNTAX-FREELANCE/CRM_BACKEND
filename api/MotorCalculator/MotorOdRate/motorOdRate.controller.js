const MotorOdRateService = require("./motorOdRate.service");

const MotorOdRateController = {

    // CREATE
    createOdRate: (req, res) => {

        const {
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
            description,
            isactive
        } = req.body;


        // PRODUCT
        if (
            product_id === undefined ||
            product_id === null ||
            product_id === "" ||
            isNaN(product_id)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Product is required"
            });
        }


        // POLICY TYPE
        if (
            policy_type_id === undefined ||
            policy_type_id === null ||
            policy_type_id === "" ||
            isNaN(policy_type_id)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Policy type is required"
            });
        }


        // OPTIONAL FOREIGN KEYS
        const optionalIds = [
            {
                value: insurance_company_id,
                message: "Insurance company"
            },
            {
                value: vehicle_category_id,
                message: "Vehicle category"
            },
            {
                value: vehicle_class_id,
                message: "Vehicle class"
            },
            {
                value: fuel_type_id,
                message: "Fuel type"
            },
            {
                value: usage_id,
                message: "Usage"
            }
        ];

        for (const item of optionalIds) {

            if (
                item.value !== undefined &&
                item.value !== null &&
                item.value !== "" &&
                isNaN(item.value)
            ) {
                return res.status(200).json({
                    success: 0,
                    message: `${item.message} must be numeric`
                });
            }
        }


        // RATE TYPE
        const allowedRateTypes = [
            "PERCENTAGE",
            "FIXED"
        ];

        const finalRateType = rate_type || "PERCENTAGE";

        if (!allowedRateTypes.includes(finalRateType)) {
            return res.status(200).json({
                success: 0,
                message: "Rate type must be PERCENTAGE or FIXED"
            });
        }


        // RATE VALUE
        if (
            rate_value === undefined ||
            rate_value === null ||
            rate_value === "" ||
            isNaN(rate_value)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Rate value is required and must be numeric"
            });
        }

        if (Number(rate_value) < 0) {
            return res.status(200).json({
                success: 0,
                message: "Rate value cannot be negative"
            });
        }


        // PERCENTAGE VALIDATION
        if (
            finalRateType === "PERCENTAGE" &&
            Number(rate_value) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "Percentage rate cannot exceed 100"
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
        if (
            effective_to &&
            new Date(effective_to) < new Date(effective_from)
        ) {
            return res.status(200).json({
                success: 0,
                message:
                    "Effective to date cannot be before effective from date"
            });
        }


        // DESCRIPTION
        if (
            description &&
            description.trim().length > 500
        ) {
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

            fuel_type_id:
                fuel_type_id === undefined ||
                    fuel_type_id === null ||
                    fuel_type_id === ""
                    ? null
                    : Number(fuel_type_id),

            usage_id:
                usage_id === undefined ||
                    usage_id === null ||
                    usage_id === ""
                    ? null
                    : Number(usage_id),

            rate_type: finalRateType,

            rate_value: Number(rate_value),

            effective_from,

            effective_to:
                effective_to || null,

            description:
                description && description.trim()
                    ? description.trim()
                    : null,
            isactive
        };


        MotorOdRateService.createOdRate(
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message:
                                "Invalid reference. Please check the selected master values"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "OD rate created successfully",
                    data: result
                });
            }
        );
    },


    // GET ALL
    getAllOdRates: (req, res) => {

        MotorOdRateService.getAllOdRates(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "OD rates fetched successfully",
                    data: result
                });
            }
        );
    },


    // GET BY ID
    getOdRateById: (req, res) => {

        const { odRateId } = req.params;

        MotorOdRateService.getOdRateById(
            odRateId,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }

                if (!result || result.length === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "OD rate not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "OD rate fetched successfully",
                    data: result[0]
                });
            }
        );
    },


    // UPDATE
    updateOdRate: (req, res) => {

        const { odRateId } = req.params;

        const {
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
            description,
            isactive
        } = req.body;


        // PRODUCT
        if (
            product_id === undefined ||
            product_id === null ||
            product_id === "" ||
            isNaN(product_id)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Product is required"
            });
        }


        // POLICY TYPE
        if (
            policy_type_id === undefined ||
            policy_type_id === null ||
            policy_type_id === "" ||
            isNaN(policy_type_id)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Policy type is required"
            });
        }


        // OPTIONAL FOREIGN KEYS
        const optionalIds = [
            {
                value: insurance_company_id,
                message: "Insurance company"
            },
            {
                value: vehicle_category_id,
                message: "Vehicle category"
            },
            {
                value: vehicle_class_id,
                message: "Vehicle class"
            },
            {
                value: fuel_type_id,
                message: "Fuel type"
            },
            {
                value: usage_id,
                message: "Usage"
            }
        ];

        for (const item of optionalIds) {

            if (
                item.value !== undefined &&
                item.value !== null &&
                item.value !== "" &&
                isNaN(item.value)
            ) {
                return res.status(200).json({
                    success: 0,
                    message: `${item.message} must be numeric`
                });
            }
        }


        // RATE TYPE
        const allowedRateTypes = [
            "PERCENTAGE",
            "FIXED"
        ];

        const finalRateType = rate_type || "PERCENTAGE";

        if (!allowedRateTypes.includes(finalRateType)) {
            return res.status(200).json({
                success: 0,
                message: "Rate type must be PERCENTAGE or FIXED"
            });
        }


        // RATE VALUE
        if (
            rate_value === undefined ||
            rate_value === null ||
            rate_value === "" ||
            isNaN(rate_value)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Rate value is required and must be numeric"
            });
        }

        if (Number(rate_value) < 0) {
            return res.status(200).json({
                success: 0,
                message: "Rate value cannot be negative"
            });
        }


        // PERCENTAGE VALIDATION
        if (
            finalRateType === "PERCENTAGE" &&
            Number(rate_value) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "Percentage rate cannot exceed 100"
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
        if (
            effective_to &&
            new Date(effective_to) < new Date(effective_from)
        ) {
            return res.status(200).json({
                success: 0,
                message:
                    "Effective to date cannot be before effective from date"
            });
        }


        // DESCRIPTION
        if (
            description &&
            description.trim().length > 500
        ) {
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

            fuel_type_id:
                fuel_type_id === undefined ||
                    fuel_type_id === null ||
                    fuel_type_id === ""
                    ? null
                    : Number(fuel_type_id),

            usage_id:
                usage_id === undefined ||
                    usage_id === null ||
                    usage_id === ""
                    ? null
                    : Number(usage_id),

            rate_type: finalRateType,

            rate_value: Number(rate_value),

            effective_from,

            effective_to:
                effective_to || null,

            description:
                description && description.trim()
                    ? description.trim()
                    : null,
            isactive: isactive
        };


        MotorOdRateService.updateOdRate(
            odRateId,
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message:
                                "Invalid reference. Please check the selected master values"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "OD rate not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "OD rate updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteOdRate: (req, res) => {

        const { odRateId } = req.params;

        MotorOdRateService.deleteOdRate(
            odRateId,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "OD rate not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "OD rate deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActiveOdRates: (req, res) => {

        MotorOdRateService.getActiveOdRates(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Active OD rates fetched successfully",
                    data: result
                });
            }
        );
    }
};

module.exports = MotorOdRateController;