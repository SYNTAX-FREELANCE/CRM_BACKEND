const customerPayTypeService = require("./customerPayType.service");

module.exports = {

    // ==================== CREATE CUSTOMER PAY TYPE ====================

    createCustomerPayType: (req, res) => {

        try {

            const {
                pay_type_name,
                description,
                isActive
            } = req.body;


            // ==================== VALIDATION ====================

            if (
                !pay_type_name ||
                pay_type_name.trim() === ""
            ) {

                return res.status(200).json({
                    success: 0,
                    message: "Pay type name is required"
                });

            }


            if (pay_type_name.trim().length > 100) {

                return res.status(200).json({
                    success: 0,
                    message:
                        "Pay type name must not exceed 100 characters"
                });

            }


            if (
                description &&
                description.trim().length > 255
            ) {

                return res.status(200).json({
                    success: 0,
                    message:
                        "Description must not exceed 255 characters"
                });

            }


            // ==================== PREPARE DATA ====================

            const customerPayTypeData = {

                pay_type_name:
                    pay_type_name.trim(),

                description:
                    description &&
                    description.trim() !== ""
                        ? description.trim()
                        : null,

                is_active:
                    isActive === undefined
                        ? 1
                        : isActive

            };


            // ==================== CREATE ====================

            customerPayTypeService.createCustomerPayType(
                customerPayTypeData,

                (err, result) => {

                    if (err) {

                        console.error(
                            "createCustomerPayType error:",
                            err
                        );


                        if (err.code === "ER_DUP_ENTRY") {

                            return res.status(200).json({
                                success: 0,
                                message:
                                    "Customer pay type already exists"
                            });

                        }


                        return res.status(500).json({
                            success: 0,
                            message:
                                "Something went wrong while creating customer pay type"
                        });

                    }


                    return res.status(200).json({

                        success: 1,

                        message:
                            "Customer pay type created successfully",

                        data: {

                            customer_pay_type_id:
                                result.insertId,

                            pay_type_name:
                                customerPayTypeData.pay_type_name,

                            description:
                                customerPayTypeData.description

                        }

                    });

                }
            );

        } catch (error) {

            console.error(
                "createCustomerPayType error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET ALL CUSTOMER PAY TYPES ====================

    getAllCustomerPayTypes: (req, res) => {

        try {

            customerPayTypeService.getAllCustomerPayTypes(
                (err, payTypes) => {

                    if (err) {

                        console.error(
                            "getAllCustomerPayTypes error:",
                            err
                        );

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong"
                        });

                    }


                    return res.status(200).json({

                        success: 1,

                        message:
                            "Customer pay types retrieved successfully",

                        data: payTypes

                    });

                }
            );

        } catch (error) {

            console.error(
                "getAllCustomerPayTypes error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET CUSTOMER PAY TYPE BY ID ====================

    getCustomerPayTypeById: (req, res) => {

        try {

            const {
                customerPayTypeId
            } = req.params;


            customerPayTypeService.getCustomerPayTypeById(
                customerPayTypeId,

                (err, payType) => {

                    if (err) {

                        console.error(
                            "getCustomerPayTypeById error:",
                            err
                        );

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong"
                        });

                    }


                    if (!payType) {

                        return res.status(200).json({
                            success: 0,
                            message:
                                "Customer pay type not found"
                        });

                    }


                    return res.status(200).json({

                        success: 1,

                        message:
                            "Customer pay type retrieved successfully",

                        data: payType

                    });

                }
            );

        } catch (error) {

            console.error(
                "getCustomerPayTypeById error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== UPDATE CUSTOMER PAY TYPE ====================

    updateCustomerPayType: (req, res) => {

        try {

            const {
                customerPayTypeId
            } = req.params;

            const {
                pay_type_name,
                description,
                isActive
            } = req.body;


            // ==================== VALIDATION ====================

            if (
                !pay_type_name ||
                pay_type_name.trim() === ""
            ) {

                return res.status(400).json({
                    success: 0,
                    message: "Pay type name is required"
                });

            }


            if (pay_type_name.trim().length > 100) {

                return res.status(400).json({
                    success: 0,
                    message:
                        "Pay type name must not exceed 100 characters"
                });

            }


            if (
                description &&
                description.trim().length > 255
            ) {

                return res.status(400).json({
                    success: 0,
                    message:
                        "Description must not exceed 255 characters"
                });

            }


            const customerPayTypeData = {

                pay_type_name:
                    pay_type_name.trim(),

                description:
                    description &&
                    description.trim() !== ""
                        ? description.trim()
                        : null,

                is_active:
                    isActive === undefined
                        ? 1
                        : isActive

            };


            // ==================== UPDATE ====================

            customerPayTypeService.updateCustomerPayType(
                customerPayTypeId,
                customerPayTypeData,

                (err, result) => {

                    if (err) {

                        console.error(
                            "updateCustomerPayType error:",
                            err
                        );


                        if (err.code === "ER_DUP_ENTRY") {

                            return res.status(200).json({
                                success: 0,
                                message:
                                    "Customer pay type already exists"
                            });

                        }


                        return res.status(500).json({
                            success: 0,
                            message:
                                "Something went wrong while updating customer pay type"
                        });

                    }


                    return res.status(200).json({

                        success: 1,

                        message:
                            "Customer pay type updated successfully",

                        data: {

                            customer_pay_type_id:
                                customerPayTypeId

                        }

                    });

                }
            );

        } catch (error) {

            console.error(
                "updateCustomerPayType error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== DELETE CUSTOMER PAY TYPE ====================

    deleteCustomerPayType: (req, res) => {

        try {

            const {
                customerPayTypeId
            } = req.params;


            customerPayTypeService.deleteCustomerPayType(
                customerPayTypeId,

                (err, result) => {

                    if (err) {

                        console.error(
                            "deleteCustomerPayType error:",
                            err
                        );

                        return res.status(500).json({
                            success: 0,
                            message:
                                "Something went wrong while deleting customer pay type"
                        });

                    }


                    return res.status(200).json({

                        success: 1,

                        message:
                            "Customer pay type deleted successfully"

                    });

                }
            );

        } catch (error) {

            console.error(
                "deleteCustomerPayType error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET ACTIVE CUSTOMER PAY TYPES ====================

    getActiveCustomerPayTypes: (req, res) => {

        try {

            customerPayTypeService.getActiveCustomerPayTypes(
                (err, payTypes) => {

                    if (err) {

                        console.error(
                            "getActiveCustomerPayTypes error:",
                            err
                        );

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong"
                        });

                    }


                    return res.status(200).json({

                        success: 1,

                        message:
                            "Active customer pay types retrieved successfully",

                        data: payTypes

                    });

                }
            );

        } catch (error) {

            console.error(
                "getActiveCustomerPayTypes error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    }

};