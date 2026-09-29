const MotorDiscountRuleService = require("./motorDiscountRule.service");

const MotorDiscountRuleController = {

    // CREATE
    createDiscountRule: (req, res) => {

        const {
            insurance_company_id,
            product_id,
            policy_type_id,
            vehicle_category_id,
            vehicle_class_id,
            usage_id,
            discount_type,
            discount_value,
            min_vehicle_age_months,
            max_vehicle_age_months,
            claim_free_required,
            effective_from,
            effective_to,
            description,
            isActive
        } = req.body;


        // Product
        if (
            product_id === undefined ||
            product_id === null ||
            product_id === "" ||
            isNaN(product_id) ||
            Number(product_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid product_id is required"
            });
        }


        // Optional references
        const optionalReferences = [
            {
                value: insurance_company_id,
                field: "insurance_company_id"
            },
            {
                value: policy_type_id,
                field: "policy_type_id"
            },
            {
                value: vehicle_category_id,
                field: "vehicle_category_id"
            },
            {
                value: vehicle_class_id,
                field: "vehicle_class_id"
            },
            {
                value: usage_id,
                field: "usage_id"
            }
        ];

        for (const item of optionalReferences) {

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
                    message: `Invalid ${item.field}`
                });
            }
        }


        // Discount Type
        if (
            !["PERCENTAGE", "FIXED"].includes(discount_type)
        ) {
            return res.status(200).json({
                success: 0,
                message: "discount_type must be PERCENTAGE or FIXED"
            });
        }


        // Discount Value
        if (
            discount_value === undefined ||
            discount_value === null ||
            discount_value === "" ||
            isNaN(discount_value) ||
            Number(discount_value) < 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid discount_value is required"
            });
        }


        if (
            discount_type === "PERCENTAGE" &&
            Number(discount_value) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "Percentage discount cannot exceed 100"
            });
        }


        // Minimum Vehicle Age
        if (
            min_vehicle_age_months !== undefined &&
            min_vehicle_age_months !== null &&
            min_vehicle_age_months !== "" &&
            (
                isNaN(min_vehicle_age_months) ||
                Number(min_vehicle_age_months) < 0
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid min_vehicle_age_months"
            });
        }


        // Maximum Vehicle Age
        if (
            max_vehicle_age_months !== undefined &&
            max_vehicle_age_months !== null &&
            max_vehicle_age_months !== "" &&
            (
                isNaN(max_vehicle_age_months) ||
                Number(max_vehicle_age_months) < 0
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid max_vehicle_age_months"
            });
        }


        // Age comparison
        if (
            min_vehicle_age_months !== undefined &&
            min_vehicle_age_months !== null &&
            min_vehicle_age_months !== "" &&
            max_vehicle_age_months !== undefined &&
            max_vehicle_age_months !== null &&
            max_vehicle_age_months !== "" &&
            Number(max_vehicle_age_months) <
                Number(min_vehicle_age_months)
        ) {
            return res.status(200).json({
                success: 0,
                message:
                    "max_vehicle_age_months cannot be less than min_vehicle_age_months"
            });
        }


        // Claim Free Required
        const claimFreeRequired =
            claim_free_required !== undefined &&
            claim_free_required !== null &&
            claim_free_required !== ""
                ? Number(claim_free_required)
                : 0;

        if (![0, 1].includes(claimFreeRequired)) {
            return res.status(200).json({
                success: 0,
                message: "claim_free_required must be 0 or 1"
            });
        }


        // Effective From
        if (!effective_from) {
            return res.status(200).json({
                success: 0,
                message: "effective_from is required"
            });
        }


        // Effective To
        if (
            effective_to &&
            new Date(effective_to) < new Date(effective_from)
        ) {
            return res.status(200).json({
                success: 0,
                message:
                    "effective_to cannot be before effective_from"
            });
        }


        // Description
        if (
            description &&
            description.length > 500
        ) {
            return res.status(200).json({
                success: 0,
                message:
                    "Description cannot exceed 500 characters"
            });
        }


        const data = {
            insurance_company_id:
                insurance_company_id !== undefined &&
                insurance_company_id !== null &&
                insurance_company_id !== ""
                    ? Number(insurance_company_id)
                    : null,

            product_id: Number(product_id),

            policy_type_id:
                policy_type_id !== undefined &&
                policy_type_id !== null &&
                policy_type_id !== ""
                    ? Number(policy_type_id)
                    : null,

            vehicle_category_id:
                vehicle_category_id !== undefined &&
                vehicle_category_id !== null &&
                vehicle_category_id !== ""
                    ? Number(vehicle_category_id)
                    : null,

            vehicle_class_id:
                vehicle_class_id !== undefined &&
                vehicle_class_id !== null &&
                vehicle_class_id !== ""
                    ? Number(vehicle_class_id)
                    : null,

            usage_id:
                usage_id !== undefined &&
                usage_id !== null &&
                usage_id !== ""
                    ? Number(usage_id)
                    : null,

            discount_type,

            discount_value: Number(discount_value),

            min_vehicle_age_months:
                min_vehicle_age_months !== undefined &&
                min_vehicle_age_months !== null &&
                min_vehicle_age_months !== ""
                    ? Number(min_vehicle_age_months)
                    : null,

            max_vehicle_age_months:
                max_vehicle_age_months !== undefined &&
                max_vehicle_age_months !== null &&
                max_vehicle_age_months !== ""
                    ? Number(max_vehicle_age_months)
                    : null,

            claim_free_required: claimFreeRequired,

            effective_from,

            effective_to: effective_to || null,

            description: description || null,
            is_active:isActive
        };


        MotorDiscountRuleService.createDiscountRule(
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
                    message:
                        "Discount rule created successfully",
                    data: result
                });
            }
        );
    },


    // GET ALL
    getAllDiscountRules: (req, res) => {

        MotorDiscountRuleService.getAllDiscountRules(
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
                    data: result
                });
            }
        );
    },


    // GET BY ID
    getDiscountRuleById: (req, res) => {

        const { id } = req.params;

        MotorDiscountRuleService.getDiscountRuleById(
            id,
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
                        message: "Discount rule not found"
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
    updateDiscountRule: (req, res) => {

        const { id } = req.params;

        const {
            insurance_company_id,
            product_id,
            policy_type_id,
            vehicle_category_id,
            vehicle_class_id,
            usage_id,
            discount_type,
            discount_value,
            min_vehicle_age_months,
            max_vehicle_age_months,
            claim_free_required,
            effective_from,
            effective_to,
            description,
            isActive
        } = req.body;


        // Product
        if (
            product_id === undefined ||
            product_id === null ||
            product_id === "" ||
            isNaN(product_id) ||
            Number(product_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid product_id is required"
            });
        }


        // Optional references
        const optionalReferences = [
            {
                value: insurance_company_id,
                field: "insurance_company_id"
            },
            {
                value: policy_type_id,
                field: "policy_type_id"
            },
            {
                value: vehicle_category_id,
                field: "vehicle_category_id"
            },
            {
                value: vehicle_class_id,
                field: "vehicle_class_id"
            },
            {
                value: usage_id,
                field: "usage_id"
            }
        ];

        for (const item of optionalReferences) {

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
                    message: `Invalid ${item.field}`
                });
            }
        }


        // Discount Type
        if (
            !["PERCENTAGE", "FIXED"].includes(discount_type)
        ) {
            return res.status(200).json({
                success: 0,
                message: "discount_type must be PERCENTAGE or FIXED"
            });
        }


        // Discount Value
        if (
            discount_value === undefined ||
            discount_value === null ||
            discount_value === "" ||
            isNaN(discount_value) ||
            Number(discount_value) < 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid discount_value is required"
            });
        }


        if (
            discount_type === "PERCENTAGE" &&
            Number(discount_value) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "Percentage discount cannot exceed 100"
            });
        }


        // Minimum Vehicle Age
        if (
            min_vehicle_age_months !== undefined &&
            min_vehicle_age_months !== null &&
            min_vehicle_age_months !== "" &&
            (
                isNaN(min_vehicle_age_months) ||
                Number(min_vehicle_age_months) < 0
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid min_vehicle_age_months"
            });
        }


        // Maximum Vehicle Age
        if (
            max_vehicle_age_months !== undefined &&
            max_vehicle_age_months !== null &&
            max_vehicle_age_months !== "" &&
            (
                isNaN(max_vehicle_age_months) ||
                Number(max_vehicle_age_months) < 0
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid max_vehicle_age_months"
            });
        }


        // Age comparison
        if (
            min_vehicle_age_months !== undefined &&
            min_vehicle_age_months !== null &&
            min_vehicle_age_months !== "" &&
            max_vehicle_age_months !== undefined &&
            max_vehicle_age_months !== null &&
            max_vehicle_age_months !== "" &&
            Number(max_vehicle_age_months) <
                Number(min_vehicle_age_months)
        ) {
            return res.status(200).json({
                success: 0,
                message:
                    "max_vehicle_age_months cannot be less than min_vehicle_age_months"
            });
        }


        // Claim Free Required
        const claimFreeRequired =
            claim_free_required !== undefined &&
            claim_free_required !== null &&
            claim_free_required !== ""
                ? Number(claim_free_required)
                : 0;

        if (![0, 1].includes(claimFreeRequired)) {
            return res.status(200).json({
                success: 0,
                message: "claim_free_required must be 0 or 1"
            });
        }


        // Effective From
        if (!effective_from) {
            return res.status(200).json({
                success: 0,
                message: "effective_from is required"
            });
        }


        // Effective To
        if (
            effective_to &&
            new Date(effective_to) < new Date(effective_from)
        ) {
            return res.status(200).json({
                success: 0,
                message:
                    "effective_to cannot be before effective_from"
            });
        }


        // Description
        if (
            description &&
            description.length > 500
        ) {
            return res.status(200).json({
                success: 0,
                message:
                    "Description cannot exceed 500 characters"
            });
        }


        const data = {
            insurance_company_id:
                insurance_company_id !== undefined &&
                insurance_company_id !== null &&
                insurance_company_id !== ""
                    ? Number(insurance_company_id)
                    : null,

            product_id: Number(product_id),

            policy_type_id:
                policy_type_id !== undefined &&
                policy_type_id !== null &&
                policy_type_id !== ""
                    ? Number(policy_type_id)
                    : null,

            vehicle_category_id:
                vehicle_category_id !== undefined &&
                vehicle_category_id !== null &&
                vehicle_category_id !== ""
                    ? Number(vehicle_category_id)
                    : null,

            vehicle_class_id:
                vehicle_class_id !== undefined &&
                vehicle_class_id !== null &&
                vehicle_class_id !== ""
                    ? Number(vehicle_class_id)
                    : null,

            usage_id:
                usage_id !== undefined &&
                usage_id !== null &&
                usage_id !== ""
                    ? Number(usage_id)
                    : null,

            discount_type,

            discount_value: Number(discount_value),

            min_vehicle_age_months:
                min_vehicle_age_months !== undefined &&
                min_vehicle_age_months !== null &&
                min_vehicle_age_months !== ""
                    ? Number(min_vehicle_age_months)
                    : null,

            max_vehicle_age_months:
                max_vehicle_age_months !== undefined &&
                max_vehicle_age_months !== null &&
                max_vehicle_age_months !== ""
                    ? Number(max_vehicle_age_months)
                    : null,

            claim_free_required: claimFreeRequired,

            effective_from,

            effective_to: effective_to || null,

            description: description || null,

            is_active:isActive
        };


        MotorDiscountRuleService.updateDiscountRule(
            id,
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
                    message:
                        "Discount rule updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteDiscountRule: (req, res) => {

        const { id } = req.params;

        MotorDiscountRuleService.deleteDiscountRule(
            id,
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
                    message:
                        "Discount rule deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActiveDiscountRules: (req, res) => {

        MotorDiscountRuleService.getActiveDiscountRules(
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
                    data: result
                });
            }
        );
    }

};

module.exports = MotorDiscountRuleController;