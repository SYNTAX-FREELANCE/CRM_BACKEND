const MotorQuotationOptionCoverService = require("./motor_quotation_option_cover.service");

const MotorQuotationOptionCoverController = {

    // CREATE
    createQuotationOptionCover: (req, res) => {

        const {
            quotation_option_id,
            cover_id,
            quantity,
            rate,
            amount
        } = req.body;

        if (!quotation_option_id) {
            return res.status(200).json({
                success: 0,
                message: "Quotation option ID is required"
            });
        }

        if (!cover_id) {
            return res.status(200).json({
                success: 0,
                message: "Cover ID is required"
            });
        }

        if (
            quantity !== undefined &&
            quantity !== null &&
            quantity < 1
        ) {
            return res.status(200).json({
                success: 0,
                message: "Quantity must be at least 1"
            });
        }

        if (
            rate !== undefined &&
            rate !== null &&
            rate < 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Rate cannot be negative"
            });
        }

        if (
            amount !== undefined &&
            amount !== null &&
            amount < 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Amount cannot be negative"
            });
        }

        MotorQuotationOptionCoverService.createQuotationOptionCover(
            {
                quotation_option_id,
                cover_id,
                quantity,
                rate,
                amount
            },
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "This cover is already added to this quotation option"
                        });
                    }

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid quotation option ID or cover ID"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to create quotation option cover",
                        error: err.message
                    });
                }

                res.status(200).json({
                    success: 1,
                    message: "Quotation option cover created successfully",
                    data: result
                });
            }
        );
    },


    // GET ALL
    getAllQuotationOptionCovers: (req, res) => {

        MotorQuotationOptionCoverService.getAllQuotationOptionCovers(
            (err, results) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotation option covers",
                        error: err.message
                    });
                }

                res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        );
    },


    // GET BY ID
    getQuotationOptionCoverById: (req, res) => {

        const {
            quotation_option_cover_id
        } = req.params;

        MotorQuotationOptionCoverService.getQuotationOptionCoverById(
            quotation_option_cover_id,
            (err, results) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotation option cover",
                        error: err.message
                    });
                }

                if (!results.length) {
                    return res.status(200).json({
                        success: 0,
                        message: "Quotation option cover not found"
                    });
                }

                res.status(200).json({
                    success: 1,
                    data: results[0]
                });
            }
        );
    },


    // GET BY QUOTATION OPTION
    getQuotationOptionCoversByOption: (req, res) => {

        const {
            quotation_option_id
        } = req.params;

        if (!quotation_option_id) {
            return res.status(200).json({
                success: 0,
                message: "Quotation option ID is required"
            });
        }

        MotorQuotationOptionCoverService.getQuotationOptionCoversByOption(
            quotation_option_id,
            (err, results) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotation option covers",
                        error: err.message
                    });
                }

                res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        );
    },


    // UPDATE
    updateQuotationOptionCover: (req, res) => {

        const {
            quotation_option_cover_id
        } = req.params;

        const {
            quotation_option_id,
            cover_id,
            quantity,
            rate,
            amount
        } = req.body;

        if (!quotation_option_id) {
            return res.status(200).json({
                success: 0,
                message: "Quotation option ID is required"
            });
        }

        if (!cover_id) {
            return res.status(200).json({
                success: 0,
                message: "Cover ID is required"
            });
        }

        if (
            quantity !== undefined &&
            quantity !== null &&
            quantity < 1
        ) {
            return res.status(200).json({
                success: 0,
                message: "Quantity must be at least 1"
            });
        }

        if (
            rate !== undefined &&
            rate !== null &&
            rate < 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Rate cannot be negative"
            });
        }

        if (
            amount !== undefined &&
            amount !== null &&
            amount < 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Amount cannot be negative"
            });
        }

        MotorQuotationOptionCoverService.updateQuotationOptionCover(
            quotation_option_cover_id,
            {
                quotation_option_id,
                cover_id,
                quantity,
                rate,
                amount
            },
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "This cover is already added to this quotation option"
                        });
                    }

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid quotation option ID or cover ID"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to update quotation option cover",
                        error: err.message
                    });
                }

                res.status(200).json({
                    success: 1,
                    message: "Quotation option cover updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteQuotationOptionCover: (req, res) => {

        const {
            quotation_option_cover_id
        } = req.params;

        MotorQuotationOptionCoverService.deleteQuotationOptionCover(
            quotation_option_cover_id,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to delete quotation option cover",
                        error: err.message
                    });
                }

                res.status(200).json({
                    success: 1,
                    message: "Quotation option cover deleted successfully",
                    data: result
                });
            }
        );
    }
};

module.exports = MotorQuotationOptionCoverController;