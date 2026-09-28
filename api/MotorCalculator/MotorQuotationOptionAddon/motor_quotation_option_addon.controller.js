const MotorQuotationOptionAddonService = require("./motor_quotation_option_addon.service");

const MotorQuotationOptionAddonController = {

    // CREATE
    createQuotationOptionAddon: (req, res) => {

        const {
            quotation_option_id,
            addon_id,
            rate,
            amount
        } = req.body;

        if (!quotation_option_id) {
            return res.status(200).json({
                success: 0,
                message: "Quotation option ID is required"
            });
        }

        if (!addon_id) {
            return res.status(200).json({
                success: 0,
                message: "Addon ID is required"
            });
        }

        if (rate !== undefined && rate !== null && rate < 0) {
            return res.status(200).json({
                success: 0,
                message: "Rate cannot be negative"
            });
        }

        if (amount !== undefined && amount !== null && amount < 0) {
            return res.status(200).json({
                success: 0,
                message: "Amount cannot be negative"
            });
        }

        MotorQuotationOptionAddonService.createQuotationOptionAddon(
            {
                quotation_option_id,
                addon_id,
                rate,
                amount
            },
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "This addon is already added to this quotation option"
                        });
                    }

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid quotation option ID or addon ID"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to create quotation option addon",
                        error: err.message
                    });
                }

                res.status(200).json({
                    success: 1,
                    message: "Quotation option addon created successfully",
                    data: result
                });
            }
        );
    },


    // GET ALL
    getAllQuotationOptionAddons: (req, res) => {

        MotorQuotationOptionAddonService.getAllQuotationOptionAddons(
            (err, results) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotation option addons",
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
    getQuotationOptionAddonById: (req, res) => {

        const {
            quotation_option_addon_id
        } = req.params;

        MotorQuotationOptionAddonService.getQuotationOptionAddonById(
            quotation_option_addon_id,
            (err, results) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotation option addon",
                        error: err.message
                    });
                }

                if (!results.length) {
                    return res.status(200).json({
                        success: 0,
                        message: "Quotation option addon not found"
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
    getQuotationOptionAddonsByOption: (req, res) => {

        const {
            quotation_option_id
        } = req.params;

        if (!quotation_option_id) {
            return res.status(200).json({
                success: 0,
                message: "Quotation option ID is required"
            });
        }

        MotorQuotationOptionAddonService.getQuotationOptionAddonsByOption(
            quotation_option_id,
            (err, results) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotation option addons",
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
    updateQuotationOptionAddon: (req, res) => {

        const {
            quotation_option_addon_id
        } = req.params;

        const {
            quotation_option_id,
            addon_id,
            rate,
            amount
        } = req.body;

        if (!quotation_option_id) {
            return res.status(200).json({
                success: 0,
                message: "Quotation option ID is required"
            });
        }

        if (!addon_id) {
            return res.status(200).json({
                success: 0,
                message: "Addon ID is required"
            });
        }

        if (rate !== undefined && rate !== null && rate < 0) {
            return res.status(200).json({
                success: 0,
                message: "Rate cannot be negative"
            });
        }

        if (amount !== undefined && amount !== null && amount < 0) {
            return res.status(200).json({
                success: 0,
                message: "Amount cannot be negative"
            });
        }

        MotorQuotationOptionAddonService.updateQuotationOptionAddon(
            quotation_option_addon_id,
            {
                quotation_option_id,
                addon_id,
                rate,
                amount
            },
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "This addon is already added to this quotation option"
                        });
                    }

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid quotation option ID or addon ID"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to update quotation option addon",
                        error: err.message
                    });
                }

                res.status(200).json({
                    success: 1,
                    message: "Quotation option addon updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteQuotationOptionAddon: (req, res) => {

        const {
            quotation_option_addon_id
        } = req.params;

        MotorQuotationOptionAddonService.deleteQuotationOptionAddon(
            quotation_option_addon_id,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to delete quotation option addon",
                        error: err.message
                    });
                }

                res.status(200).json({
                    success: 1,
                    message: "Quotation option addon deleted successfully",
                    data: result
                });
            }
        );
    }
};

module.exports = MotorQuotationOptionAddonController;