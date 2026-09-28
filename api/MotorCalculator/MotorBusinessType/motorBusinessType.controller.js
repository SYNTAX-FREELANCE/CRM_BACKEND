const MotorBusinessTypeService = require("./motorBusinessType.service");

const MotorBusinessTypeController = {

    // CREATE
    createBusinessType: (req, res) => {

        const {
            business_type_code,
            business_type_name,
            description
        } = req.body;

        if (!business_type_code || !business_type_code.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Business type code is required"
            });
        }

        if (business_type_code.trim().length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Business type code cannot exceed 50 characters"
            });
        }

        if (!business_type_name || !business_type_name.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Business type name is required"
            });
        }

        if (business_type_name.trim().length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Business type name cannot exceed 150 characters"
            });
        }

        if (description && description.trim().length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }

        const data = {
            business_type_code: business_type_code.trim(),
            business_type_name: business_type_name.trim(),
            description:
                description && description.trim()
                    ? description.trim()
                    : null
        };

        MotorBusinessTypeService.createBusinessType(
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {

                        if (
                            err.sqlMessage &&
                            err.sqlMessage.includes(
                                "uq_motor_business_type_code"
                            )
                        ) {
                            return res.status(200).json({
                                success: 0,
                                message: "Business type code already exists"
                            });
                        }

                        if (
                            err.sqlMessage &&
                            err.sqlMessage.includes(
                                "uq_motor_business_type_name"
                            )
                        ) {
                            return res.status(200).json({
                                success: 0,
                                message: "Business type name already exists"
                            });
                        }

                        return res.status(200).json({
                            success: 0,
                            message:
                                "Business type code or business type name already exists"
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
                    message: "Business type created successfully",
                    data: result
                });
            }
        );
    },


    // GET ALL
    getAllBusinessTypes: (req, res) => {

        MotorBusinessTypeService.getAllBusinessTypes(
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
                    message: "Business types fetched successfully",
                    data: result
                });
            }
        );
    },


    // GET BY ID
    getBusinessTypeById: (req, res) => {

        const { businessTypeId } = req.params;

        MotorBusinessTypeService.getBusinessTypeById(
            businessTypeId,
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
                        message: "Business type not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Business type fetched successfully",
                    data: result[0]
                });
            }
        );
    },


    // UPDATE
    updateBusinessType: (req, res) => {

        const { businessTypeId } = req.params;

        const {
            business_type_code,
            business_type_name,
            description
        } = req.body;

        if (!business_type_code || !business_type_code.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Business type code is required"
            });
        }

        if (business_type_code.trim().length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Business type code cannot exceed 50 characters"
            });
        }

        if (!business_type_name || !business_type_name.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Business type name is required"
            });
        }

        if (business_type_name.trim().length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Business type name cannot exceed 150 characters"
            });
        }

        if (description && description.trim().length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }

        const data = {
            business_type_code: business_type_code.trim(),
            business_type_name: business_type_name.trim(),
            description:
                description && description.trim()
                    ? description.trim()
                    : null
        };

        MotorBusinessTypeService.updateBusinessType(
            businessTypeId,
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {

                        if (
                            err.sqlMessage &&
                            err.sqlMessage.includes(
                                "uq_motor_business_type_code"
                            )
                        ) {
                            return res.status(200).json({
                                success: 0,
                                message: "Business type code already exists"
                            });
                        }

                        if (
                            err.sqlMessage &&
                            err.sqlMessage.includes(
                                "uq_motor_business_type_name"
                            )
                        ) {
                            return res.status(200).json({
                                success: 0,
                                message: "Business type name already exists"
                            });
                        }

                        return res.status(200).json({
                            success: 0,
                            message:
                                "Business type code or business type name already exists"
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
                        message: "Business type not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Business type updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteBusinessType: (req, res) => {

        const { businessTypeId } = req.params;

        MotorBusinessTypeService.deleteBusinessType(
            businessTypeId,
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
                        message: "Business type not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Business type deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActiveBusinessTypes: (req, res) => {

        MotorBusinessTypeService.getActiveBusinessTypes(
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
                    message: "Active business types fetched successfully",
                    data: result
                });
            }
        );
    }
};

module.exports = MotorBusinessTypeController;