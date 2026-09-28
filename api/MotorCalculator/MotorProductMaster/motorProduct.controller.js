const MotorProductService = require("./motorProduct.service");

const MotorProductController = {

    // CREATE
    createProduct: (req, res) => {

        const {
            product_code,
            product_name,
            description
        } = req.body;

        if (!product_code || !product_code.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Product code is required"
            });
        }

        if (product_code.trim().length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Product code cannot exceed 50 characters"
            });
        }

        if (!product_name || !product_name.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Product name is required"
            });
        }

        if (product_name.trim().length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Product name cannot exceed 150 characters"
            });
        }

        if (description && description.trim().length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }

        const data = {
            product_code: product_code.trim(),
            product_name: product_name.trim(),
            description:
                description && description.trim()
                    ? description.trim()
                    : null
        };

        MotorProductService.createProduct(data, (err, result) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {

                    if (
                        err.sqlMessage &&
                        err.sqlMessage.includes("uq_motor_product_code")
                    ) {
                        return res.status(200).json({
                            success: 0,
                            message: "Product code already exists"
                        });
                    }

                    if (
                        err.sqlMessage &&
                        err.sqlMessage.includes("uq_motor_product_name")
                    ) {
                        return res.status(200).json({
                            success: 0,
                            message: "Product name already exists"
                        });
                    }

                    return res.status(200).json({
                        success: 0,
                        message: "Product code or product name already exists"
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
                message: "Product created successfully",
                data: result
            });
        });
    },


    // GET ALL
    getAllProducts: (req, res) => {

        MotorProductService.getAllProducts((err, result) => {

            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Database error",
                    error: err
                });
            }

            return res.status(200).json({
                success: 1,
                message: "Products fetched successfully",
                data: result
            });
        });
    },


    // GET BY ID
    getProductById: (req, res) => {

        const { productId } = req.params;

        MotorProductService.getProductById(
            productId,
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
                        message: "Product not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Product fetched successfully",
                    data: result[0]
                });
            }
        );
    },


    // UPDATE
    updateProduct: (req, res) => {

        const { productId } = req.params;

        const {
            product_code,
            product_name,
            description
        } = req.body;

        if (!product_code || !product_code.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Product code is required"
            });
        }

        if (product_code.trim().length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Product code cannot exceed 50 characters"
            });
        }

        if (!product_name || !product_name.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Product name is required"
            });
        }

        if (product_name.trim().length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Product name cannot exceed 150 characters"
            });
        }

        if (description && description.trim().length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }

        const data = {
            product_code: product_code.trim(),
            product_name: product_name.trim(),
            description:
                description && description.trim()
                    ? description.trim()
                    : null
        };

        MotorProductService.updateProduct(
            productId,
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {

                        if (
                            err.sqlMessage &&
                            err.sqlMessage.includes("uq_motor_product_code")
                        ) {
                            return res.status(200).json({
                                success: 0,
                                message: "Product code already exists"
                            });
                        }

                        if (
                            err.sqlMessage &&
                            err.sqlMessage.includes("uq_motor_product_name")
                        ) {
                            return res.status(200).json({
                                success: 0,
                                message: "Product name already exists"
                            });
                        }

                        return res.status(200).json({
                            success: 0,
                            message: "Product code or product name already exists"
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
                        message: "Product not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Product updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteProduct: (req, res) => {

        const { productId } = req.params;

        MotorProductService.deleteProduct(
            productId,
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
                        message: "Product not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Product deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActiveProducts: (req, res) => {

        MotorProductService.getActiveProducts((err, result) => {

            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Database error",
                    error: err
                });
            }

            return res.status(200).json({
                success: 1,
                message: "Active products fetched successfully",
                data: result
            });
        });
    }
};

module.exports = MotorProductController;