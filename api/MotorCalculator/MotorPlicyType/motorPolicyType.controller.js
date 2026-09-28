const MotorPolicyTypeService = require("./motorPolicyType.service");

const MotorPolicyTypeController = {

    // CREATE
    createPolicyType: (req, res) => {

        const {
            policy_type_code,
            policy_type_name,
            description,
            is_od_applicable,
            is_tp_applicable
        } = req.body;

        if (!policy_type_code || !policy_type_code.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Policy type code is required"
            });
        }

        if (policy_type_code.trim().length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Policy type code cannot exceed 50 characters"
            });
        }

        if (!policy_type_name || !policy_type_name.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Policy type name is required"
            });
        }

        if (policy_type_name.trim().length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Policy type name cannot exceed 150 characters"
            });
        }

        if (
            is_od_applicable !== undefined &&
            is_od_applicable !== null &&
            ![0, 1, "0", "1"].includes(is_od_applicable)
        ) {
            return res.status(200).json({
                success: 0,
                message: "is_od_applicable must be 0 or 1"
            });
        }

        if (
            is_tp_applicable !== undefined &&
            is_tp_applicable !== null &&
            ![0, 1, "0", "1"].includes(is_tp_applicable)
        ) {
            return res.status(200).json({
                success: 0,
                message: "is_tp_applicable must be 0 or 1"
            });
        }

        if (description && description.trim().length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }

        const data = {
            policy_type_code: policy_type_code.trim(),
            policy_type_name: policy_type_name.trim(),
            description:
                description && description.trim()
                    ? description.trim()
                    : null,
            is_od_applicable:
                is_od_applicable === undefined ||
                is_od_applicable === null
                    ? 0
                    : Number(is_od_applicable),
            is_tp_applicable:
                is_tp_applicable === undefined ||
                is_tp_applicable === null
                    ? 0
                    : Number(is_tp_applicable)
        };

        MotorPolicyTypeService.createPolicyType(data, (err, result) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {

                    if (
                        err.sqlMessage &&
                        err.sqlMessage.includes(
                            "uq_motor_policy_type_code"
                        )
                    ) {
                        return res.status(200).json({
                            success: 0,
                            message: "Policy type code already exists"
                        });
                    }

                    if (
                        err.sqlMessage &&
                        err.sqlMessage.includes(
                            "uq_motor_policy_type_name"
                        )
                    ) {
                        return res.status(200).json({
                            success: 0,
                            message: "Policy type name already exists"
                        });
                    }

                    return res.status(200).json({
                        success: 0,
                        message:
                            "Policy type code or policy type name already exists"
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
                message: "Policy type created successfully",
                data: result
            });
        });
    },


    // GET ALL
    getAllPolicyTypes: (req, res) => {

        MotorPolicyTypeService.getAllPolicyTypes((err, result) => {

            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Database error",
                    error: err
                });
            }

            return res.status(200).json({
                success: 1,
                message: "Policy types fetched successfully",
                data: result
            });
        });
    },


    // GET BY ID
    getPolicyTypeById: (req, res) => {

        const { policyTypeId } = req.params;

        MotorPolicyTypeService.getPolicyTypeById(
            policyTypeId,
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
                        message: "Policy type not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Policy type fetched successfully",
                    data: result[0]
                });
            }
        );
    },


    // UPDATE
    updatePolicyType: (req, res) => {

        const { policyTypeId } = req.params;

        const {
            policy_type_code,
            policy_type_name,
            description,
            is_od_applicable,
            is_tp_applicable
        } = req.body;

        if (!policy_type_code || !policy_type_code.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Policy type code is required"
            });
        }

        if (policy_type_code.trim().length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Policy type code cannot exceed 50 characters"
            });
        }

        if (!policy_type_name || !policy_type_name.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Policy type name is required"
            });
        }

        if (policy_type_name.trim().length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Policy type name cannot exceed 150 characters"
            });
        }

        if (
            is_od_applicable !== undefined &&
            is_od_applicable !== null &&
            ![0, 1, "0", "1"].includes(is_od_applicable)
        ) {
            return res.status(200).json({
                success: 0,
                message: "is_od_applicable must be 0 or 1"
            });
        }

        if (
            is_tp_applicable !== undefined &&
            is_tp_applicable !== null &&
            ![0, 1, "0", "1"].includes(is_tp_applicable)
        ) {
            return res.status(200).json({
                success: 0,
                message: "is_tp_applicable must be 0 or 1"
            });
        }

        if (description && description.trim().length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }

        const data = {
            policy_type_code: policy_type_code.trim(),
            policy_type_name: policy_type_name.trim(),
            description:
                description && description.trim()
                    ? description.trim()
                    : null,
            is_od_applicable:
                is_od_applicable === undefined ||
                is_od_applicable === null
                    ? 0
                    : Number(is_od_applicable),
            is_tp_applicable:
                is_tp_applicable === undefined ||
                is_tp_applicable === null
                    ? 0
                    : Number(is_tp_applicable)
        };

        MotorPolicyTypeService.updatePolicyType(
            policyTypeId,
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {

                        if (
                            err.sqlMessage &&
                            err.sqlMessage.includes(
                                "uq_motor_policy_type_code"
                            )
                        ) {
                            return res.status(200).json({
                                success: 0,
                                message: "Policy type code already exists"
                            });
                        }

                        if (
                            err.sqlMessage &&
                            err.sqlMessage.includes(
                                "uq_motor_policy_type_name"
                            )
                        ) {
                            return res.status(200).json({
                                success: 0,
                                message: "Policy type name already exists"
                            });
                        }

                        return res.status(200).json({
                            success: 0,
                            message:
                                "Policy type code or policy type name already exists"
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
                        message: "Policy type not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Policy type updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deletePolicyType: (req, res) => {

        const { policyTypeId } = req.params;

        MotorPolicyTypeService.deletePolicyType(
            policyTypeId,
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
                        message: "Policy type not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Policy type deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActivePolicyTypes: (req, res) => {

        MotorPolicyTypeService.getActivePolicyTypes((err, result) => {

            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Database error",
                    error: err
                });
            }

            return res.status(200).json({
                success: 1,
                message: "Active policy types fetched successfully",
                data: result
            });
        });
    }
};

module.exports = MotorPolicyTypeController;