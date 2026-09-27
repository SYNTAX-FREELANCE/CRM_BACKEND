const MotorOdDepreciationService = require("./motorOdDepreciation.service");

const MotorOdDepreciationController = {

    // CREATE
    createOdDepreciation: (req, res) => {

        const {
            product_id,
            policy_type_id,
            min_age_months,
            max_age_months,
            depreciation_percentage,
            effective_from,
            effective_to,
            description
        } = req.body;


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


        if (
            policy_type_id !== undefined &&
            policy_type_id !== null &&
            policy_type_id !== ""
        ) {
            if (
                isNaN(policy_type_id) ||
                Number(policy_type_id) <= 0
            ) {
                return res.status(200).json({
                    success: 0,
                    message: "Policy type must be a valid value"
                });
            }
        }


        if (
            min_age_months === undefined ||
            min_age_months === null ||
            min_age_months === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "Minimum age in months is required"
            });
        }

        if (
            isNaN(min_age_months) ||
            Number(min_age_months) < 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Minimum age must be a valid non-negative number"
            });
        }


        if (
            max_age_months !== undefined &&
            max_age_months !== null &&
            max_age_months !== ""
        ) {

            if (
                isNaN(max_age_months) ||
                Number(max_age_months) < Number(min_age_months)
            ) {
                return res.status(200).json({
                    success: 0,
                    message: "Maximum age must be greater than or equal to minimum age"
                });
            }
        }


        if (
            depreciation_percentage === undefined ||
            depreciation_percentage === null ||
            depreciation_percentage === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "Depreciation percentage is required"
            });
        }

        if (
            isNaN(depreciation_percentage) ||
            Number(depreciation_percentage) < 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Depreciation percentage must be a valid non-negative number"
            });
        }

        if (Number(depreciation_percentage) > 100) {
            return res.status(200).json({
                success: 0,
                message: "Depreciation percentage cannot exceed 100"
            });
        }


        if (!effective_from) {
            return res.status(200).json({
                success: 0,
                message: "Effective from date is required"
            });
        }


        if (effective_to && effective_to < effective_from) {
            return res.status(200).json({
                success: 0,
                message: "Effective to date cannot be before effective from date"
            });
        }


        if (description && description.length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }


        const data = {
            product_id: Number(product_id),

            policy_type_id:
                policy_type_id === undefined ||
                policy_type_id === null ||
                policy_type_id === ""
                    ? null
                    : Number(policy_type_id),

            min_age_months: Number(min_age_months),

            max_age_months:
                max_age_months === undefined ||
                max_age_months === null ||
                max_age_months === ""
                    ? null
                    : Number(max_age_months),

            depreciation_percentage:
                Number(depreciation_percentage),

            effective_from,

            effective_to:
                effective_to || null,

            description:
                description || null
        };


        MotorOdDepreciationService.createOdDepreciation(
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
                        message: "Failed to create OD depreciation",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "OD depreciation created successfully",
                    data: result
                });
            }
        );
    },


    // GET ALL
    getAllOdDepreciations: (req, res) => {

        MotorOdDepreciationService.getAllOdDepreciations(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch OD depreciations",
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
    getOdDepreciationById: (req, res) => {

        const { id } = req.params;

        MotorOdDepreciationService.getOdDepreciationById(
            id,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch OD depreciation",
                        error: err
                    });
                }

                if (result.length === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "OD depreciation not found"
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
    updateOdDepreciation: (req, res) => {

        const { id } = req.params;

        const {
            product_id,
            policy_type_id,
            min_age_months,
            max_age_months,
            depreciation_percentage,
            effective_from,
            effective_to,
            description
        } = req.body;


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


        if (
            policy_type_id !== undefined &&
            policy_type_id !== null &&
            policy_type_id !== ""
        ) {
            if (
                isNaN(policy_type_id) ||
                Number(policy_type_id) <= 0
            ) {
                return res.status(200).json({
                    success: 0,
                    message: "Policy type must be a valid value"
                });
            }
        }


        if (
            min_age_months === undefined ||
            min_age_months === null ||
            min_age_months === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "Minimum age in months is required"
            });
        }

        if (
            isNaN(min_age_months) ||
            Number(min_age_months) < 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Minimum age must be a valid non-negative number"
            });
        }


        if (
            max_age_months !== undefined &&
            max_age_months !== null &&
            max_age_months !== ""
        ) {

            if (
                isNaN(max_age_months) ||
                Number(max_age_months) < Number(min_age_months)
            ) {
                return res.status(200).json({
                    success: 0,
                    message: "Maximum age must be greater than or equal to minimum age"
                });
            }
        }


        if (
            depreciation_percentage === undefined ||
            depreciation_percentage === null ||
            depreciation_percentage === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "Depreciation percentage is required"
            });
        }

        if (
            isNaN(depreciation_percentage) ||
            Number(depreciation_percentage) < 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Depreciation percentage must be a valid non-negative number"
            });
        }

        if (Number(depreciation_percentage) > 100) {
            return res.status(200).json({
                success: 0,
                message: "Depreciation percentage cannot exceed 100"
            });
        }


        if (!effective_from) {
            return res.status(200).json({
                success: 0,
                message: "Effective from date is required"
            });
        }


        if (effective_to && effective_to < effective_from) {
            return res.status(200).json({
                success: 0,
                message: "Effective to date cannot be before effective from date"
            });
        }


        if (description && description.length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }


        const data = {
            product_id: Number(product_id),

            policy_type_id:
                policy_type_id === undefined ||
                policy_type_id === null ||
                policy_type_id === ""
                    ? null
                    : Number(policy_type_id),

            min_age_months: Number(min_age_months),

            max_age_months:
                max_age_months === undefined ||
                max_age_months === null ||
                max_age_months === ""
                    ? null
                    : Number(max_age_months),

            depreciation_percentage:
                Number(depreciation_percentage),

            effective_from,

            effective_to:
                effective_to || null,

            description:
                description || null
        };


        MotorOdDepreciationService.updateOdDepreciation(
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
                        message: "Failed to update OD depreciation",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "OD depreciation updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteOdDepreciation: (req, res) => {

        const { id } = req.params;

        MotorOdDepreciationService.deleteOdDepreciation(
            id,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to delete OD depreciation",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "OD depreciation deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActiveOdDepreciations: (req, res) => {

        MotorOdDepreciationService.getActiveOdDepreciations(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch active OD depreciations",
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

module.exports = MotorOdDepreciationController;