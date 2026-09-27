const MotorQuotationInputService = require("./motorQuotationInput.service");

const MotorQuotationInputController = {

    // CREATE
    createQuotationInput: (req, res) => {

        const {
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
        } = req.body;


        // QUOTATION ID
        if (
            !motor_quotation_id ||
            isNaN(motor_quotation_id) ||
            Number(motor_quotation_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid quotation ID is required"
            });
        }


        // POLICY START DATE
        if (!policy_start_date) {
            return res.status(200).json({
                success: 0,
                message: "Policy start date is required"
            });
        }


        // POLICY END DATE
        if (
            policy_end_date &&
            new Date(policy_end_date) < new Date(policy_start_date)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Policy end date cannot be before policy start date"
            });
        }


        // OPTIONAL IDs
        const optionalIds = [
            {
                value: vehicle_type_id,
                name: "vehicle type ID"
            },
            {
                value: vehicle_category_id,
                name: "vehicle category ID"
            },
            {
                value: vehicle_class_id,
                name: "vehicle class ID"
            },
            {
                value: fuel_type_id,
                name: "fuel type ID"
            },
            {
                value: usage_id,
                name: "usage ID"
            },
            {
                value: previous_policy_id,
                name: "previous policy ID"
            },
            {
                value: previous_insurance_company_id,
                name: "previous insurance company ID"
            },
            {
                value: business_type_id,
                name: "business type ID"
            },
            {
                value: policy_term_id,
                name: "policy term ID"
            }
        ];


        for (const item of optionalIds) {

            if (
                item.value !== undefined &&
                item.value !== null &&
                item.value !== "" &&
                (
                    isNaN(item.value) ||
                    Number(item.value) <= 0
                )
            ) {
                return res.status(200).json({
                    success: 0,
                    message: `Valid ${item.name} is required`
                });
            }
        }


        // PRODUCT ID
        if (
            !product_id ||
            isNaN(product_id) ||
            Number(product_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid product ID is required"
            });
        }


        // POLICY TYPE ID
        if (
            !policy_type_id ||
            isNaN(policy_type_id) ||
            Number(policy_type_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid policy type ID is required"
            });
        }


        // ENGINE CC
        if (
            engine_cc !== undefined &&
            engine_cc !== null &&
            engine_cc !== "" &&
            (
                isNaN(engine_cc) ||
                Number(engine_cc) < 0
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Engine CC must be a valid positive value"
            });
        }


        // GVW
        if (
            gvw !== undefined &&
            gvw !== null &&
            gvw !== "" &&
            (
                isNaN(gvw) ||
                Number(gvw) < 0
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "GVW must be a valid positive value"
            });
        }


        // SEATING CAPACITY
        if (
            seating_capacity !== undefined &&
            seating_capacity !== null &&
            seating_capacity !== "" &&
            (
                isNaN(seating_capacity) ||
                Number(seating_capacity) < 0 ||
                !Number.isInteger(Number(seating_capacity))
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Seating capacity must be a valid integer"
            });
        }


        // VEHICLE AGE
        if (
            vehicle_age_months !== undefined &&
            vehicle_age_months !== null &&
            vehicle_age_months !== "" &&
            (
                isNaN(vehicle_age_months) ||
                Number(vehicle_age_months) < 0 ||
                !Number.isInteger(Number(vehicle_age_months))
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Vehicle age must be a valid number of months"
            });
        }


        // IDV
        if (
            idv !== undefined &&
            idv !== null &&
            idv !== "" &&
            (
                isNaN(idv) ||
                Number(idv) < 0
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "IDV must be a valid value"
            });
        }


        // NCB
        if (
            previous_ncb_percentage !== undefined &&
            previous_ncb_percentage !== null &&
            previous_ncb_percentage !== "" &&
            (
                isNaN(previous_ncb_percentage) ||
                Number(previous_ncb_percentage) < 0 ||
                Number(previous_ncb_percentage) > 100
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Previous NCB percentage must be between 0 and 100"
            });
        }


        // CLAIM STATUS
        if (
            claim_status !== undefined &&
            claim_status !== null &&
            !["NO_CLAIM", "CLAIM"].includes(claim_status)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Claim status must be NO_CLAIM or CLAIM"
            });
        }


        // CLAIM COUNT
        if (
            claim_count !== undefined &&
            claim_count !== null &&
            (
                isNaN(claim_count) ||
                Number(claim_count) < 0 ||
                !Number.isInteger(Number(claim_count))
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Claim count must be a valid integer"
            });
        }


        const data = {
            motor_quotation_id: Number(motor_quotation_id),
            registration_date: registration_date || null,
            policy_start_date,
            policy_end_date: policy_end_date || null,

            vehicle_type_id: vehicle_type_id || null,
            vehicle_category_id: vehicle_category_id || null,
            vehicle_class_id: vehicle_class_id || null,

            fuel_type_id: fuel_type_id || null,
            usage_id: usage_id || null,

            engine_cc: engine_cc || null,
            gvw: gvw || null,
            seating_capacity: seating_capacity || null,

            vehicle_age_months: vehicle_age_months || null,

            idv: idv || 0,

            previous_policy_id: previous_policy_id || null,
            previous_insurance_company_id:
                previous_insurance_company_id || null,

            previous_ncb_percentage:
                previous_ncb_percentage !== undefined &&
                previous_ncb_percentage !== null &&
                previous_ncb_percentage !== ""
                    ? Number(previous_ncb_percentage)
                    : null,

            claim_status: claim_status || "NO_CLAIM",
            claim_count: claim_count || 0,

            business_type_id: business_type_id || null,
            product_id: Number(product_id),
            policy_type_id: Number(policy_type_id),
            policy_term_id: policy_term_id || null
        };


        MotorQuotationInputService.createQuotationInput(
            data,
            (error, result) => {

                if (error) {

                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "Quotation input already exists for this quotation"
                        });
                    }

                    if (error.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid quotation or master reference"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to create quotation input",
                        error
                    });
                }


                return res.status(200).json({
                    success: 1,
                    message: result.message,
                    quotation_input_id: result.quotation_input_id
                });
            }
        );
    },


    // GET ALL
    getAllQuotationInputs: (req, res) => {

        MotorQuotationInputService.getAllQuotationInputs(
            (error, results) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotation inputs",
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
    getQuotationInputById: (req, res) => {

        const { quotation_input_id } = req.params;

        if (
            !quotation_input_id ||
            isNaN(quotation_input_id) ||
            Number(quotation_input_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid quotation input ID is required"
            });
        }


        MotorQuotationInputService.getQuotationInputById(
            quotation_input_id,
            (error, result) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotation input",
                        error
                    });
                }


                if (!result) {
                    return res.status(200).json({
                        success: 0,
                        message: "Quotation input not found"
                    });
                }


                return res.status(200).json({
                    success: 1,
                    data: result
                });
            }
        );
    },


    // GET BY QUOTATION
    getQuotationInputByQuotationId: (req, res) => {

        const { motor_quotation_id } = req.params;

        if (
            !motor_quotation_id ||
            isNaN(motor_quotation_id) ||
            Number(motor_quotation_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid quotation ID is required"
            });
        }


        MotorQuotationInputService.getQuotationInputByQuotationId(
            motor_quotation_id,
            (error, result) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotation input",
                        error
                    });
                }


                if (!result) {
                    return res.status(200).json({
                        success: 0,
                        message: "Quotation input not found"
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
    updateQuotationInput: (req, res) => {

        const { quotation_input_id } = req.params;

        if (
            !quotation_input_id ||
            isNaN(quotation_input_id) ||
            Number(quotation_input_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid quotation input ID is required"
            });
        }


        const {
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
        } = req.body;


        if (
            !motor_quotation_id ||
            isNaN(motor_quotation_id) ||
            Number(motor_quotation_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid quotation ID is required"
            });
        }


        if (!policy_start_date) {
            return res.status(200).json({
                success: 0,
                message: "Policy start date is required"
            });
        }


        if (
            policy_end_date &&
            new Date(policy_end_date) < new Date(policy_start_date)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Policy end date cannot be before policy start date"
            });
        }


        if (
            !product_id ||
            isNaN(product_id) ||
            Number(product_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid product ID is required"
            });
        }


        if (
            !policy_type_id ||
            isNaN(policy_type_id) ||
            Number(policy_type_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid policy type ID is required"
            });
        }


        if (
            claim_status !== undefined &&
            claim_status !== null &&
            !["NO_CLAIM", "CLAIM"].includes(claim_status)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Claim status must be NO_CLAIM or CLAIM"
            });
        }


        if (
            claim_count !== undefined &&
            claim_count !== null &&
            (
                isNaN(claim_count) ||
                Number(claim_count) < 0 ||
                !Number.isInteger(Number(claim_count))
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Claim count must be a valid integer"
            });
        }


        if (
            previous_ncb_percentage !== undefined &&
            previous_ncb_percentage !== null &&
            previous_ncb_percentage !== "" &&
            (
                isNaN(previous_ncb_percentage) ||
                Number(previous_ncb_percentage) < 0 ||
                Number(previous_ncb_percentage) > 100
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Previous NCB percentage must be between 0 and 100"
            });
        }


        const data = {
            motor_quotation_id: Number(motor_quotation_id),
            registration_date: registration_date || null,
            policy_start_date,
            policy_end_date: policy_end_date || null,

            vehicle_type_id: vehicle_type_id || null,
            vehicle_category_id: vehicle_category_id || null,
            vehicle_class_id: vehicle_class_id || null,

            fuel_type_id: fuel_type_id || null,
            usage_id: usage_id || null,

            engine_cc: engine_cc || null,
            gvw: gvw || null,
            seating_capacity: seating_capacity || null,

            vehicle_age_months: vehicle_age_months || null,

            idv: idv || 0,

            previous_policy_id: previous_policy_id || null,
            previous_insurance_company_id:
                previous_insurance_company_id || null,

            previous_ncb_percentage:
                previous_ncb_percentage !== undefined &&
                previous_ncb_percentage !== null &&
                previous_ncb_percentage !== ""
                    ? Number(previous_ncb_percentage)
                    : null,

            claim_status: claim_status || "NO_CLAIM",
            claim_count: claim_count || 0,

            business_type_id: business_type_id || null,
            product_id: Number(product_id),
            policy_type_id: Number(policy_type_id),
            policy_term_id: policy_term_id || null
        };


        MotorQuotationInputService.updateQuotationInput(
            quotation_input_id,
            data,
            (error, result) => {

                if (error) {

                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "Quotation input already exists for this quotation"
                        });
                    }

                    if (error.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid quotation or master reference"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to update quotation input",
                        error
                    });
                }


                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "Quotation input not found"
                    });
                }


                return res.status(200).json({
                    success: 1,
                    message: result.message
                });
            }
        );
    },


    // DELETE
    deleteQuotationInput: (req, res) => {

        const { quotation_input_id } = req.params;

        if (
            !quotation_input_id ||
            isNaN(quotation_input_id) ||
            Number(quotation_input_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid quotation input ID is required"
            });
        }


        MotorQuotationInputService.deleteQuotationInput(
            quotation_input_id,
            (error, result) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to delete quotation input",
                        error
                    });
                }


                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "Quotation input not found"
                    });
                }


                return res.status(200).json({
                    success: 1,
                    message: result.message
                });
            }
        );
    }
};

module.exports = MotorQuotationInputController;