const PaymentMethodService = require("./paymentMethod.service");

const PaymentMethodController = {

    // CREATE
    createPaymentMethod: (req, res) => {
        const {
            payment_method_name,
            payment_type,
            description,
            is_active
        } = req.body;

        if (!payment_method_name?.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Payment method name is required"
            });
        }

        if (!payment_type?.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Payment type is required"
            });
        }

        if (payment_method_name.trim().length > 100) {
            return res.status(200).json({
                success: 0,
                message: "Payment method name cannot exceed 100 characters"
            });
        }

        if (description && description.length > 255) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 255 characters"
            });
        }

        const data = {
            payment_method_name: payment_method_name.trim(),
            payment_type: payment_type.trim(),
            description: description?.trim() || null,
            is_active: is_active ?? 1
        };

        PaymentMethodService.createPaymentMethod(data, (err, result) => {

            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(200).json({
                        success: 0,
                        message: "Payment method already exists"
                    });
                }

                return res.status(500).json({
                    success: 0,
                    message: "Failed to create payment method",
                    error: err
                });
            }

            return res.status(200).json({
                success: 1,
                message: "Payment method created successfully",
                data: result
            });
        });
    },


    // GET ALL
    getAllPaymentMethods: (req, res) => {

        PaymentMethodService.getAllPaymentMethods((err, result) => {

            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Failed to fetch payment methods",
                    error: err
                });
            }

            return res.status(200).json({
                success: 1,
                message: "Payment methods fetched successfully",
                data: result
            });
        });
    },


    // GET BY ID
    getPaymentMethodById: (req, res) => {

        const { paymentMethodId } = req.params;

        if (!paymentMethodId) {
            return res.status(200).json({
                success: 0,
                message: "Payment method ID is required"
            });
        }

        PaymentMethodService.getPaymentMethodById(
            paymentMethodId,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch payment method",
                        error: err
                    });
                }

                if (result.length === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "Payment method not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Payment method fetched successfully",
                    data: result[0]
                });
            }
        );
    },


    // UPDATE
    updatePaymentMethod: (req, res) => {

        const { paymentMethodId } = req.params;

        const {
            payment_method_name,
            payment_type,
            description,
            is_active
        } = req.body;

        if (!paymentMethodId) {
            return res.status(200).json({
                success: 0,
                message: "Payment method ID is required"
            });
        }

        if (!payment_method_name?.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Payment method name is required"
            });
        }

        if (!payment_type?.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Payment type is required"
            });
        }

        if (payment_method_name.trim().length > 100) {
            return res.status(200).json({
                success: 0,
                message: "Payment method name cannot exceed 100 characters"
            });
        }

        if (description && description.length > 255) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 255 characters"
            });
        }

        const data = {
            payment_method_name: payment_method_name.trim(),
            payment_type: payment_type.trim(),
            description: description?.trim() || null,
            is_active: is_active ?? 1
        };

        PaymentMethodService.updatePaymentMethod(
            paymentMethodId,
            data,
            (err, result) => {

                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "Payment method already exists"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to update payment method",
                        error: err
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "Payment method not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Payment method updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deletePaymentMethod: (req, res) => {

        const { paymentMethodId } = req.params;

        if (!paymentMethodId) {
            return res.status(200).json({
                success: 0,
                message: "Payment method ID is required"
            });
        }

        PaymentMethodService.deletePaymentMethod(
            paymentMethodId,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to delete payment method",
                        error: err
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "Payment method not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Payment method deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActivePaymentMethods: (req, res) => {

        PaymentMethodService.getActivePaymentMethods(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch active payment methods",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Active payment methods fetched successfully",
                    data: result
                });
            }
        );
    }
};

module.exports = PaymentMethodController;