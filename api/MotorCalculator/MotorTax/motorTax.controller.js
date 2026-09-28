const MotorTaxService = require("./motorTax.service");

const MotorTaxController = {

    // CREATE
    createTax: (req, res) => {

        const {
            tax_code,
            tax_name,
            tax_type,
            tax_percentage,
            effective_from,
            effective_to,
            description
        } = req.body;


        // TAX CODE
        if (!tax_code || typeof tax_code !== "string") {
            return res.status(200).json({
                success: 0,
                message: "Tax code is required"
            });
        }

        if (tax_code.length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Tax code cannot exceed 50 characters"
            });
        }


        // TAX NAME
        if (!tax_name || typeof tax_name !== "string") {
            return res.status(200).json({
                success: 0,
                message: "Tax name is required"
            });
        }

        if (tax_name.length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Tax name cannot exceed 150 characters"
            });
        }


        // TAX TYPE
        if (!["PERCENTAGE", "FIXED"].includes(tax_type)) {
            return res.status(200).json({
                success: 0,
                message: "Tax type must be PERCENTAGE or FIXED"
            });
        }


        // TAX VALUE
        if (
            tax_percentage === undefined ||
            tax_percentage === null ||
            tax_percentage === "" ||
            isNaN(tax_percentage)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Tax value is required"
            });
        }

        if (Number(tax_percentage) < 0) {
            return res.status(200).json({
                success: 0,
                message: "Tax value cannot be negative"
            });
        }

        if (
            tax_type === "PERCENTAGE" &&
            Number(tax_percentage) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "Tax percentage cannot exceed 100"
            });
        }


        // EFFECTIVE FROM
        if (!effective_from) {
            return res.status(200).json({
                success: 0,
                message: "Effective from date is required"
            });
        }


        // EFFECTIVE TO
        if (effective_to && effective_to < effective_from) {
            return res.status(200).json({
                success: 0,
                message: "Effective to date cannot be before effective from date"
            });
        }


        // DESCRIPTION
        if (description && description.length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }


        const data = {
            tax_code: tax_code.trim(),
            tax_name: tax_name.trim(),
            tax_type,
            tax_percentage: Number(tax_percentage),
            effective_from,
            effective_to: effective_to || null,
            description: description ? description.trim() : null
        };


        MotorTaxService.createTax(data, (error, result) => {

            if (error) {

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(200).json({
                        success: 0,
                        message: "Tax code already exists"
                    });
                }

                return res.status(500).json({
                    success: 0,
                    message: "Failed to create tax",
                    error
                });
            }

            return res.status(200).json({
                success: 1,
                message: result.message,
                tax_id: result.tax_id
            });
        });
    },


    // GET ALL
    getAllTaxes: (req, res) => {

        MotorTaxService.getAllTaxes((error, results) => {

            if (error) {
                return res.status(500).json({
                    success: 0,
                    message: "Failed to fetch taxes",
                    error
                });
            }

            return res.status(200).json({
                success: 1,
                data: results
            });
        });
    },


    // GET BY ID
    getTaxById: (req, res) => {

        const { tax_id } = req.params;

        if (!tax_id || isNaN(tax_id) || Number(tax_id) <= 0) {
            return res.status(200).json({
                success: 0,
                message: "Valid tax ID is required"
            });
        }

        MotorTaxService.getTaxById(tax_id, (error, result) => {

            if (error) {
                return res.status(500).json({
                    success: 0,
                    message: "Failed to fetch tax",
                    error
                });
            }

            if (!result) {
                return res.status(200).json({
                    success: 0,
                    message: "Tax not found"
                });
            }

            return res.status(200).json({
                success: 1,
                data: result
            });
        });
    },


    // UPDATE
    updateTax: (req, res) => {

        const { tax_id } = req.params;

        if (!tax_id || isNaN(tax_id) || Number(tax_id) <= 0) {
            return res.status(200).json({
                success: 0,
                message: "Valid tax ID is required"
            });
        }


        const {
            tax_code,
            tax_name,
            tax_type,
            tax_percentage,
            effective_from,
            effective_to,
            description
        } = req.body;


        // TAX CODE
        if (!tax_code || typeof tax_code !== "string") {
            return res.status(200).json({
                success: 0,
                message: "Tax code is required"
            });
        }

        if (tax_code.length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Tax code cannot exceed 50 characters"
            });
        }


        // TAX NAME
        if (!tax_name || typeof tax_name !== "string") {
            return res.status(200).json({
                success: 0,
                message: "Tax name is required"
            });
        }

        if (tax_name.length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Tax name cannot exceed 150 characters"
            });
        }


        // TAX TYPE
        if (!["PERCENTAGE", "FIXED"].includes(tax_type)) {
            return res.status(200).json({
                success: 0,
                message: "Tax type must be PERCENTAGE or FIXED"
            });
        }


        // TAX VALUE
        if (
            tax_percentage === undefined ||
            tax_percentage === null ||
            tax_percentage === "" ||
            isNaN(tax_percentage)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Tax value is required"
            });
        }

        if (Number(tax_percentage) < 0) {
            return res.status(200).json({
                success: 0,
                message: "Tax value cannot be negative"
            });
        }

        if (
            tax_type === "PERCENTAGE" &&
            Number(tax_percentage) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "Tax percentage cannot exceed 100"
            });
        }


        // EFFECTIVE FROM
        if (!effective_from) {
            return res.status(200).json({
                success: 0,
                message: "Effective from date is required"
            });
        }


        // EFFECTIVE TO
        if (effective_to && effective_to < effective_from) {
            return res.status(200).json({
                success: 0,
                message: "Effective to date cannot be before effective from date"
            });
        }


        // DESCRIPTION
        if (description && description.length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }


        const data = {
            tax_code: tax_code.trim(),
            tax_name: tax_name.trim(),
            tax_type,
            tax_percentage: Number(tax_percentage),
            effective_from,
            effective_to: effective_to || null,
            description: description ? description.trim() : null
        };


        MotorTaxService.updateTax(
            tax_id,
            data,
            (error, result) => {

                if (error) {

                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "Tax code already exists"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to update tax",
                        error
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "Tax not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: result.message
                });
            }
        );
    },


    // DELETE
    deleteTax: (req, res) => {

        const { tax_id } = req.params;

        if (!tax_id || isNaN(tax_id) || Number(tax_id) <= 0) {
            return res.status(200).json({
                success: 0,
                message: "Valid tax ID is required"
            });
        }

        MotorTaxService.deleteTax(tax_id, (error, result) => {

            if (error) {
                return res.status(500).json({
                    success: 0,
                    message: "Failed to delete tax",
                    error
                });
            }

            if (result.affectedRows === 0) {
                return res.status(200).json({
                    success: 0,
                    message: "Tax not found"
                });
            }

            return res.status(200).json({
                success: 1,
                message: result.message
            });
        });
    },


    // GET ACTIVE
    getActiveTaxes: (req, res) => {

        MotorTaxService.getActiveTaxes((error, results) => {

            if (error) {
                return res.status(500).json({
                    success: 0,
                    message: "Failed to fetch active taxes",
                    error
                });
            }

            return res.status(200).json({
                success: 1,
                data: results
            });
        });
    }
};

module.exports = MotorTaxController;