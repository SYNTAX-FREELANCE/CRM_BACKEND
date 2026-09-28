const MotorPolicyTermService = require("./motorPolicyTerm.service");

const MotorPolicyTermController = {

    // CREATE
    createPolicyTerm: (req, res) => {

        const {
            term_code,
            term_name,
            term_value,
            term_unit,
            description
        } = req.body;

        if (!term_code || !term_code.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Term code is required"
            });
        }

        if (term_code.trim().length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Term code cannot exceed 50 characters"
            });
        }

        if (!term_name || !term_name.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Term name is required"
            });
        }

        if (term_name.trim().length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Term name cannot exceed 150 characters"
            });
        }

        if (
            term_value === undefined ||
            term_value === null ||
            term_value === "" ||
            isNaN(term_value)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Term value is required and must be numeric"
            });
        }

        if (!Number.isInteger(Number(term_value)) || Number(term_value) <= 0) {
            return res.status(200).json({
                success: 0,
                message: "Term value must be a positive integer"
            });
        }

        if (!term_unit) {
            return res.status(200).json({
                success: 0,
                message: "Term unit is required"
            });
        }

        const allowedUnits = ["DAY", "MONTH", "YEAR"];

        if (!allowedUnits.includes(term_unit)) {
            return res.status(200).json({
                success: 0,
                message: "Term unit must be DAY, MONTH or YEAR"
            });
        }

        if (description && description.trim().length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }

        const data = {
            term_code: term_code.trim(),
            term_name: term_name.trim(),
            term_value: Number(term_value),
            term_unit,
            description:
                description && description.trim()
                    ? description.trim()
                    : null
        };

        MotorPolicyTermService.createPolicyTerm(
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {

                        if (
                            err.sqlMessage &&
                            err.sqlMessage.includes(
                                "uq_motor_policy_term_code"
                            )
                        ) {
                            return res.status(200).json({
                                success: 0,
                                message: "Term code already exists"
                            });
                        }

                        if (
                            err.sqlMessage &&
                            err.sqlMessage.includes(
                                "uq_motor_policy_term_name"
                            )
                        ) {
                            return res.status(200).json({
                                success: 0,
                                message: "Term name already exists"
                            });
                        }

                        return res.status(200).json({
                            success: 0,
                            message:
                                "Term code or term name already exists"
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
                    message: "Policy term created successfully",
                    data: result
                });
            }
        );
    },


    // GET ALL
    getAllPolicyTerms: (req, res) => {

        MotorPolicyTermService.getAllPolicyTerms(
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
                    message: "Policy terms fetched successfully",
                    data: result
                });
            }
        );
    },


    // GET BY ID
    getPolicyTermById: (req, res) => {

        const { policyTermId } = req.params;

        MotorPolicyTermService.getPolicyTermById(
            policyTermId,
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
                        message: "Policy term not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Policy term fetched successfully",
                    data: result[0]
                });
            }
        );
    },


    // UPDATE
    updatePolicyTerm: (req, res) => {

        const { policyTermId } = req.params;

        const {
            term_code,
            term_name,
            term_value,
            term_unit,
            description
        } = req.body;

        if (!term_code || !term_code.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Term code is required"
            });
        }

        if (term_code.trim().length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Term code cannot exceed 50 characters"
            });
        }

        if (!term_name || !term_name.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Term name is required"
            });
        }

        if (term_name.trim().length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Term name cannot exceed 150 characters"
            });
        }

        if (
            term_value === undefined ||
            term_value === null ||
            term_value === "" ||
            isNaN(term_value)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Term value is required and must be numeric"
            });
        }

        if (!Number.isInteger(Number(term_value)) || Number(term_value) <= 0) {
            return res.status(200).json({
                success: 0,
                message: "Term value must be a positive integer"
            });
        }

        if (!term_unit) {
            return res.status(200).json({
                success: 0,
                message: "Term unit is required"
            });
        }

        const allowedUnits = ["DAY", "MONTH", "YEAR"];

        if (!allowedUnits.includes(term_unit)) {
            return res.status(200).json({
                success: 0,
                message: "Term unit must be DAY, MONTH or YEAR"
            });
        }

        if (description && description.trim().length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }

        const data = {
            term_code: term_code.trim(),
            term_name: term_name.trim(),
            term_value: Number(term_value),
            term_unit,
            description:
                description && description.trim()
                    ? description.trim()
                    : null
        };

        MotorPolicyTermService.updatePolicyTerm(
            policyTermId,
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {

                        if (
                            err.sqlMessage &&
                            err.sqlMessage.includes(
                                "uq_motor_policy_term_code"
                            )
                        ) {
                            return res.status(200).json({
                                success: 0,
                                message: "Term code already exists"
                            });
                        }

                        if (
                            err.sqlMessage &&
                            err.sqlMessage.includes(
                                "uq_motor_policy_term_name"
                            )
                        ) {
                            return res.status(200).json({
                                success: 0,
                                message: "Term name already exists"
                            });
                        }

                        return res.status(200).json({
                            success: 0,
                            message:
                                "Term code or term name already exists"
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
                        message: "Policy term not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Policy term updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deletePolicyTerm: (req, res) => {

        const { policyTermId } = req.params;

        MotorPolicyTermService.deletePolicyTerm(
            policyTermId,
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
                        message: "Policy term not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Policy term deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActivePolicyTerms: (req, res) => {

        MotorPolicyTermService.getActivePolicyTerms(
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
                    message: "Active policy terms fetched successfully",
                    data: result
                });
            }
        );
    }
};

module.exports = MotorPolicyTermController;