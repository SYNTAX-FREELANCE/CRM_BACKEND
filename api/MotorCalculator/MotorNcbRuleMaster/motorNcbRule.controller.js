const MotorNcbRuleService = require("./motorNcbRule.service");

const MotorNcbRuleController = {

    // CREATE
    createNcbRule: (req, res) => {

        const {
            product_id,
            policy_type_id,
            min_policy_years,
            max_policy_years,
            claim_free_required,
            ncb_percentage,
            effective_from,
            effective_to,
            description
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


        // Policy Type - Optional
        if (
            policy_type_id !== undefined &&
            policy_type_id !== null &&
            policy_type_id !== "" &&
            (isNaN(policy_type_id) || Number(policy_type_id) <= 0)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid policy_type_id"
            });
        }


        // Minimum Policy Years - Optional
        if (
            min_policy_years !== undefined &&
            min_policy_years !== null &&
            min_policy_years !== "" &&
            (
                isNaN(min_policy_years) ||
                Number(min_policy_years) < 0
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid min_policy_years"
            });
        }


        // Maximum Policy Years - Optional
        if (
            max_policy_years !== undefined &&
            max_policy_years !== null &&
            max_policy_years !== "" &&
            (
                isNaN(max_policy_years) ||
                Number(max_policy_years) < 0
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid max_policy_years"
            });
        }


        // Min / Max comparison
        if (
            min_policy_years !== undefined &&
            min_policy_years !== null &&
            min_policy_years !== "" &&
            max_policy_years !== undefined &&
            max_policy_years !== null &&
            max_policy_years !== "" &&
            Number(max_policy_years) < Number(min_policy_years)
        ) {
            return res.status(200).json({
                success: 0,
                message: "max_policy_years cannot be less than min_policy_years"
            });
        }


        // Claim Free Required
        const claimFreeRequired =
            claim_free_required !== undefined &&
            claim_free_required !== null &&
            claim_free_required !== ""
                ? Number(claim_free_required)
                : 1;

        if (![0, 1].includes(claimFreeRequired)) {
            return res.status(200).json({
                success: 0,
                message: "claim_free_required must be 0 or 1"
            });
        }


        // NCB Percentage
        if (
            ncb_percentage === undefined ||
            ncb_percentage === null ||
            ncb_percentage === "" ||
            isNaN(ncb_percentage) ||
            Number(ncb_percentage) < 0 ||
            Number(ncb_percentage) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "ncb_percentage must be between 0 and 100"
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
                message: "effective_to cannot be before effective_from"
            });
        }


        // Description
        if (
            description &&
            description.length > 500
        ) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }


        const data = {
            product_id: Number(product_id),
            policy_type_id:
                policy_type_id !== undefined &&
                policy_type_id !== null &&
                policy_type_id !== ""
                    ? Number(policy_type_id)
                    : null,

            min_policy_years:
                min_policy_years !== undefined &&
                min_policy_years !== null &&
                min_policy_years !== ""
                    ? Number(min_policy_years)
                    : null,

            max_policy_years:
                max_policy_years !== undefined &&
                max_policy_years !== null &&
                max_policy_years !== ""
                    ? Number(max_policy_years)
                    : null,

            claim_free_required: claimFreeRequired,

            ncb_percentage: Number(ncb_percentage),

            effective_from,
            effective_to: effective_to || null,
            description: description || null
        };


        MotorNcbRuleService.createNcbRule(
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
                    message: "NCB rule created successfully",
                    data: result
                });
            }
        );
    },


    // GET ALL
    getAllNcbRules: (req, res) => {

        MotorNcbRuleService.getAllNcbRules(
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
    getNcbRuleById: (req, res) => {

        const { id } = req.params;

        MotorNcbRuleService.getNcbRuleById(
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
                        message: "NCB rule not found"
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
    updateNcbRule: (req, res) => {

        const { id } = req.params;

        const {
            product_id,
            policy_type_id,
            min_policy_years,
            max_policy_years,
            claim_free_required,
            ncb_percentage,
            effective_from,
            effective_to,
            description
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


        // Policy Type
        if (
            policy_type_id !== undefined &&
            policy_type_id !== null &&
            policy_type_id !== "" &&
            (isNaN(policy_type_id) || Number(policy_type_id) <= 0)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid policy_type_id"
            });
        }


        // Min Years
        if (
            min_policy_years !== undefined &&
            min_policy_years !== null &&
            min_policy_years !== "" &&
            (
                isNaN(min_policy_years) ||
                Number(min_policy_years) < 0
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid min_policy_years"
            });
        }


        // Max Years
        if (
            max_policy_years !== undefined &&
            max_policy_years !== null &&
            max_policy_years !== "" &&
            (
                isNaN(max_policy_years) ||
                Number(max_policy_years) < 0
            )
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid max_policy_years"
            });
        }


        // Min / Max comparison
        if (
            min_policy_years !== undefined &&
            min_policy_years !== null &&
            min_policy_years !== "" &&
            max_policy_years !== undefined &&
            max_policy_years !== null &&
            max_policy_years !== "" &&
            Number(max_policy_years) < Number(min_policy_years)
        ) {
            return res.status(200).json({
                success: 0,
                message: "max_policy_years cannot be less than min_policy_years"
            });
        }


        // Claim Free Required
        const claimFreeRequired =
            claim_free_required !== undefined &&
            claim_free_required !== null &&
            claim_free_required !== ""
                ? Number(claim_free_required)
                : 1;

        if (![0, 1].includes(claimFreeRequired)) {
            return res.status(200).json({
                success: 0,
                message: "claim_free_required must be 0 or 1"
            });
        }


        // NCB Percentage
        if (
            ncb_percentage === undefined ||
            ncb_percentage === null ||
            ncb_percentage === "" ||
            isNaN(ncb_percentage) ||
            Number(ncb_percentage) < 0 ||
            Number(ncb_percentage) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "ncb_percentage must be between 0 and 100"
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
                message: "effective_to cannot be before effective_from"
            });
        }


        // Description
        if (
            description &&
            description.length > 500
        ) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }


        const data = {
            product_id: Number(product_id),

            policy_type_id:
                policy_type_id !== undefined &&
                policy_type_id !== null &&
                policy_type_id !== ""
                    ? Number(policy_type_id)
                    : null,

            min_policy_years:
                min_policy_years !== undefined &&
                min_policy_years !== null &&
                min_policy_years !== ""
                    ? Number(min_policy_years)
                    : null,

            max_policy_years:
                max_policy_years !== undefined &&
                max_policy_years !== null &&
                max_policy_years !== ""
                    ? Number(max_policy_years)
                    : null,

            claim_free_required: claimFreeRequired,

            ncb_percentage: Number(ncb_percentage),

            effective_from,
            effective_to: effective_to || null,
            description: description || null
        };


        MotorNcbRuleService.updateNcbRule(
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
                    message: "NCB rule updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteNcbRule: (req, res) => {

        const { id } = req.params;

        MotorNcbRuleService.deleteNcbRule(
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
                    message: "NCB rule deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActiveNcbRules: (req, res) => {

        MotorNcbRuleService.getActiveNcbRules(
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

module.exports = MotorNcbRuleController;