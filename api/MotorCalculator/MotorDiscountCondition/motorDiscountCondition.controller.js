const MotorDiscountConditionService = require("./motorDiscountCondition.service");

const MotorDiscountConditionController = {

    // CREATE
    createDiscountCondition: (req, res) => {

        const {
            discount_rule_id,
            condition_type,
            condition_operator,
            condition_value,
            description
        } = req.body;


        // Discount Rule
        if (
            discount_rule_id === undefined ||
            discount_rule_id === null ||
            discount_rule_id === "" ||
            isNaN(discount_rule_id) ||
            Number(discount_rule_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid discount_rule_id is required"
            });
        }


        // Condition Type
        if (
            !condition_type ||
            typeof condition_type !== "string"
        ) {
            return res.status(200).json({
                success: 0,
                message: "condition_type is required"
            });
        }

        if (condition_type.length > 50) {
            return res.status(200).json({
                success: 0,
                message: "condition_type cannot exceed 50 characters"
            });
        }


        // Condition Operator
        if (
            !condition_operator ||
            typeof condition_operator !== "string"
        ) {
            return res.status(200).json({
                success: 0,
                message: "condition_operator is required"
            });
        }

        if (condition_operator.length > 20) {
            return res.status(200).json({
                success: 0,
                message:
                    "condition_operator cannot exceed 20 characters"
            });
        }


        // Condition Value
        if (
            condition_value === undefined ||
            condition_value === null ||
            condition_value === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "condition_value is required"
            });
        }

        if (
            String(condition_value).length > 100
        ) {
            return res.status(200).json({
                success: 0,
                message:
                    "condition_value cannot exceed 100 characters"
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
            discount_rule_id: Number(discount_rule_id),
            condition_type: condition_type.trim(),
            condition_operator: condition_operator.trim(),
            condition_value: String(condition_value).trim(),
            description: description || null
        };


        MotorDiscountConditionService.createDiscountCondition(
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message:
                                "Invalid discount rule reference"
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
                        "Discount condition created successfully",
                    data: result
                });
            }
        );
    },


    // GET ALL
    getAllDiscountConditions: (req, res) => {

        MotorDiscountConditionService.getAllDiscountConditions(
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
    getDiscountConditionById: (req, res) => {

        const { id } = req.params;

        MotorDiscountConditionService.getDiscountConditionById(
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
                        message: "Discount condition not found"
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
    updateDiscountCondition: (req, res) => {

        const { id } = req.params;

        const {
            discount_rule_id,
            condition_type,
            condition_operator,
            condition_value,
            description
        } = req.body;


        // Discount Rule
        if (
            discount_rule_id === undefined ||
            discount_rule_id === null ||
            discount_rule_id === "" ||
            isNaN(discount_rule_id) ||
            Number(discount_rule_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid discount_rule_id is required"
            });
        }


        // Condition Type
        if (
            !condition_type ||
            typeof condition_type !== "string"
        ) {
            return res.status(200).json({
                success: 0,
                message: "condition_type is required"
            });
        }

        if (condition_type.length > 50) {
            return res.status(200).json({
                success: 0,
                message:
                    "condition_type cannot exceed 50 characters"
            });
        }


        // Condition Operator
        if (
            !condition_operator ||
            typeof condition_operator !== "string"
        ) {
            return res.status(200).json({
                success: 0,
                message: "condition_operator is required"
            });
        }

        if (condition_operator.length > 20) {
            return res.status(200).json({
                success: 0,
                message:
                    "condition_operator cannot exceed 20 characters"
            });
        }


        // Condition Value
        if (
            condition_value === undefined ||
            condition_value === null ||
            condition_value === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "condition_value is required"
            });
        }

        if (
            String(condition_value).length > 100
        ) {
            return res.status(200).json({
                success: 0,
                message:
                    "condition_value cannot exceed 100 characters"
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
            discount_rule_id: Number(discount_rule_id),
            condition_type: condition_type.trim(),
            condition_operator: condition_operator.trim(),
            condition_value: String(condition_value).trim(),
            description: description || null
        };


        MotorDiscountConditionService.updateDiscountCondition(
            id,
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message:
                                "Invalid discount rule reference"
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
                        "Discount condition updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteDiscountCondition: (req, res) => {

        const { id } = req.params;

        MotorDiscountConditionService.deleteDiscountCondition(
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
                        "Discount condition deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActiveDiscountConditions: (req, res) => {

        MotorDiscountConditionService.getActiveDiscountConditions(
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

module.exports = MotorDiscountConditionController;