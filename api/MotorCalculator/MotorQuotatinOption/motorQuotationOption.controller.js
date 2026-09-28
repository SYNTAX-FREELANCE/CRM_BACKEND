const MotorQuotationOptionService = require("./motorQuotationOption.service");

const MotorQuotationOptionController = {

    // CREATE
    createQuotationOption: (req, res) => {

        const {
            motor_quotation_id,
            insurance_company_id,
            option_number,
            calculation_status,

            idv,

            basic_od,
            od_discount,

            ncb_percentage,
            ncb_amount,

            de_tariff_amount,
            net_od,

            tp_premium,

            zd_premium,
            addon_premium,

            cpa_premium,
            liability_premium,
            passenger_premium,

            subtotal,

            commission_amount,
            cashback_amount,

            taxable_amount,
            gst_amount,

            total_premium,
            final_premium,

            od_rate_id,
            tp_rate_id,
            ncb_rule_id,
            discount_rule_id,
            zd_rate_id,
            commission_rule_id,
            cashback_rule_id,
            tax_id
        } = req.body;


        // QUOTATION ID
        if (
            !motor_quotation_id ||
            isNaN(motor_quotation_id) ||
            Number(motor_quotation_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid quotation ID is required"
            });
        }


        // INSURANCE COMPANY
        if (
            !insurance_company_id ||
            isNaN(insurance_company_id) ||
            Number(insurance_company_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid insurance company ID is required"
            });
        }


        // OPTION NUMBER
        if (
            option_number === undefined ||
            option_number === null ||
            option_number === "" ||
            isNaN(option_number) ||
            Number(option_number) <= 0 ||
            !Number.isInteger(Number(option_number))
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid option number is required"
            });
        }


        // CALCULATION STATUS
        const validStatuses = [
            "PENDING",
            "CALCULATED",
            "FAILED"
        ];

        if (
            calculation_status !== undefined &&
            !validStatuses.includes(calculation_status)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid calculation status"
            });
        }


        // NUMERIC CALCULATION VALUES
        const numericFields = [
            { value: idv, name: "IDV" },
            { value: basic_od, name: "Basic OD" },
            { value: od_discount, name: "OD discount" },
            { value: ncb_percentage, name: "NCB percentage" },
            { value: ncb_amount, name: "NCB amount" },
            { value: de_tariff_amount, name: "De-tariff amount" },
            { value: net_od, name: "Net OD" },
            { value: tp_premium, name: "TP premium" },
            { value: zd_premium, name: "ZD premium" },
            { value: addon_premium, name: "Add-on premium" },
            { value: cpa_premium, name: "CPA premium" },
            { value: liability_premium, name: "Liability premium" },
            { value: passenger_premium, name: "Passenger premium" },
            { value: subtotal, name: "Subtotal" },
            { value: commission_amount, name: "Commission amount" },
            { value: cashback_amount, name: "Cashback amount" },
            { value: taxable_amount, name: "Taxable amount" },
            { value: gst_amount, name: "GST amount" },
            { value: total_premium, name: "Total premium" },
            { value: final_premium, name: "Final premium" }
        ];


        for (const field of numericFields) {

            if (
                field.value !== undefined &&
                field.value !== null &&
                field.value !== "" &&
                (
                    isNaN(field.value) ||
                    Number(field.value) < 0
                )
            ) {
                return res.status(200).json({
                    success: 0,
                    message: `${field.name} must be a valid non-negative value`
                });
            }
        }


        // NCB PERCENTAGE
        if (
            ncb_percentage !== undefined &&
            ncb_percentage !== null &&
            ncb_percentage !== "" &&
            Number(ncb_percentage) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "NCB percentage cannot exceed 100"
            });
        }


        // RULE IDS
        const ruleIds = [
            { value: od_rate_id, name: "OD rate ID" },
            { value: tp_rate_id, name: "TP rate ID" },
            { value: ncb_rule_id, name: "NCB rule ID" },
            { value: discount_rule_id, name: "Discount rule ID" },
            { value: zd_rate_id, name: "ZD rate ID" },
            { value: commission_rule_id, name: "Commission rule ID" },
            { value: cashback_rule_id, name: "Cashback rule ID" },
            { value: tax_id, name: "Tax ID" }
        ];


        for (const item of ruleIds) {

            if (
                item.value !== undefined &&
                item.value !== null &&
                item.value !== "" &&
                (
                    isNaN(item.value) ||
                    Number(item.value) <= 0
                )
            ) {
                return res.status(200).json({
                    success: 0,
                    message: `Valid ${item.name} is required`
                });
            }
        }


        const data = {
            motor_quotation_id: Number(motor_quotation_id),
            insurance_company_id: Number(insurance_company_id),
            option_number: Number(option_number),

            calculation_status:
                calculation_status || "PENDING",

            idv: idv || 0,

            basic_od: basic_od || 0,
            od_discount: od_discount || 0,

            ncb_percentage: ncb_percentage || 0,
            ncb_amount: ncb_amount || 0,

            de_tariff_amount: de_tariff_amount || 0,
            net_od: net_od || 0,

            tp_premium: tp_premium || 0,

            zd_premium: zd_premium || 0,
            addon_premium: addon_premium || 0,

            cpa_premium: cpa_premium || 0,
            liability_premium: liability_premium || 0,
            passenger_premium: passenger_premium || 0,

            subtotal: subtotal || 0,

            commission_amount: commission_amount || 0,
            cashback_amount: cashback_amount || 0,

            taxable_amount: taxable_amount || 0,
            gst_amount: gst_amount || 0,

            total_premium: total_premium || 0,
            final_premium: final_premium || 0,

            od_rate_id: od_rate_id || null,
            tp_rate_id: tp_rate_id || null,
            ncb_rule_id: ncb_rule_id || null,
            discount_rule_id: discount_rule_id || null,
            zd_rate_id: zd_rate_id || null,
            commission_rule_id: commission_rule_id || null,
            cashback_rule_id: cashback_rule_id || null,
            tax_id: tax_id || null
        };


        MotorQuotationOptionService.createQuotationOption(
            data,
            (error, result) => {

                if (error) {

                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message:
                                "This insurance company already exists for this quotation"
                        });
                    }

                    if (error.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message:
                                "Invalid quotation or insurance company reference"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to create quotation option",
                        error
                    });
                }


                return res.status(200).json({
                    success: 1,
                    message: result.message,
                    quotation_option_id:
                        result.quotation_option_id
                });
            }
        );
    },


    // GET ALL
    getAllQuotationOptions: (req, res) => {

        MotorQuotationOptionService.getAllQuotationOptions(
            (error, results) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotation options",
                        error
                    });
                }

                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        );
    },


    // GET BY ID
    getQuotationOptionById: (req, res) => {

        const { quotation_option_id } = req.params;

        if (
            !quotation_option_id ||
            isNaN(quotation_option_id) ||
            Number(quotation_option_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid quotation option ID is required"
            });
        }


        MotorQuotationOptionService.getQuotationOptionById(
            quotation_option_id,
            (error, result) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotation option",
                        error
                    });
                }


                if (!result) {
                    return res.status(200).json({
                        success: 0,
                        message: "Quotation option not found"
                    });
                }


                return res.status(200).json({
                    success: 1,
                    data: result
                });
            }
        );
    },


    // GET BY QUOTATION
    getQuotationOptionsByQuotation: (req, res) => {

        const { motor_quotation_id } = req.params;

        if (
            !motor_quotation_id ||
            isNaN(motor_quotation_id) ||
            Number(motor_quotation_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid quotation ID is required"
            });
        }


        MotorQuotationOptionService.getQuotationOptionsByQuotation(
            motor_quotation_id,
            (error, results) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message:
                            "Failed to fetch quotation options",
                        error
                    });
                }


                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        );
    },


    // UPDATE
    updateQuotationOption: (req, res) => {

        const { quotation_option_id } = req.params;

        if (
            !quotation_option_id ||
            isNaN(quotation_option_id) ||
            Number(quotation_option_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid quotation option ID is required"
            });
        }


        const {
            motor_quotation_id,
            insurance_company_id,
            option_number,
            calculation_status,

            idv,

            basic_od,
            od_discount,

            ncb_percentage,
            ncb_amount,

            de_tariff_amount,
            net_od,

            tp_premium,

            zd_premium,
            addon_premium,

            cpa_premium,
            liability_premium,
            passenger_premium,

            subtotal,

            commission_amount,
            cashback_amount,

            taxable_amount,
            gst_amount,

            total_premium,
            final_premium,

            od_rate_id,
            tp_rate_id,
            ncb_rule_id,
            discount_rule_id,
            zd_rate_id,
            commission_rule_id,
            cashback_rule_id,
            tax_id
        } = req.body;


        if (
            !motor_quotation_id ||
            isNaN(motor_quotation_id) ||
            Number(motor_quotation_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid quotation ID is required"
            });
        }


        if (
            !insurance_company_id ||
            isNaN(insurance_company_id) ||
            Number(insurance_company_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid insurance company ID is required"
            });
        }


        if (
            option_number === undefined ||
            option_number === null ||
            option_number === "" ||
            isNaN(option_number) ||
            Number(option_number) <= 0 ||
            !Number.isInteger(Number(option_number))
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid option number is required"
            });
        }


        const validStatuses = [
            "PENDING",
            "CALCULATED",
            "FAILED"
        ];

        if (!validStatuses.includes(calculation_status)) {
            return res.status(200).json({
                success: 0,
                message: "Invalid calculation status"
            });
        }


        const numericFields = [
            { value: idv, name: "IDV" },
            { value: basic_od, name: "Basic OD" },
            { value: od_discount, name: "OD discount" },
            { value: ncb_percentage, name: "NCB percentage" },
            { value: ncb_amount, name: "NCB amount" },
            { value: de_tariff_amount, name: "De-tariff amount" },
            { value: net_od, name: "Net OD" },
            { value: tp_premium, name: "TP premium" },
            { value: zd_premium, name: "ZD premium" },
            { value: addon_premium, name: "Add-on premium" },
            { value: cpa_premium, name: "CPA premium" },
            { value: liability_premium, name: "Liability premium" },
            { value: passenger_premium, name: "Passenger premium" },
            { value: subtotal, name: "Subtotal" },
            { value: commission_amount, name: "Commission amount" },
            { value: cashback_amount, name: "Cashback amount" },
            { value: taxable_amount, name: "Taxable amount" },
            { value: gst_amount, name: "GST amount" },
            { value: total_premium, name: "Total premium" },
            { value: final_premium, name: "Final premium" }
        ];


        for (const field of numericFields) {

            if (
                field.value !== undefined &&
                field.value !== null &&
                field.value !== "" &&
                (
                    isNaN(field.value) ||
                    Number(field.value) < 0
                )
            ) {
                return res.status(200).json({
                    success: 0,
                    message:
                        `${field.name} must be a valid non-negative value`
                });
            }
        }


        if (
            ncb_percentage !== undefined &&
            ncb_percentage !== null &&
            ncb_percentage !== "" &&
            Number(ncb_percentage) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "NCB percentage cannot exceed 100"
            });
        }


        const data = {
            motor_quotation_id: Number(motor_quotation_id),
            insurance_company_id: Number(insurance_company_id),
            option_number: Number(option_number),

            calculation_status,

            idv: idv || 0,

            basic_od: basic_od || 0,
            od_discount: od_discount || 0,

            ncb_percentage: ncb_percentage || 0,
            ncb_amount: ncb_amount || 0,

            de_tariff_amount: de_tariff_amount || 0,
            net_od: net_od || 0,

            tp_premium: tp_premium || 0,

            zd_premium: zd_premium || 0,
            addon_premium: addon_premium || 0,

            cpa_premium: cpa_premium || 0,
            liability_premium: liability_premium || 0,
            passenger_premium: passenger_premium || 0,

            subtotal: subtotal || 0,

            commission_amount: commission_amount || 0,
            cashback_amount: cashback_amount || 0,

            taxable_amount: taxable_amount || 0,
            gst_amount: gst_amount || 0,

            total_premium: total_premium || 0,
            final_premium: final_premium || 0,

            od_rate_id: od_rate_id || null,
            tp_rate_id: tp_rate_id || null,
            ncb_rule_id: ncb_rule_id || null,
            discount_rule_id: discount_rule_id || null,
            zd_rate_id: zd_rate_id || null,
            commission_rule_id: commission_rule_id || null,
            cashback_rule_id: cashback_rule_id || null,
            tax_id: tax_id || null
        };


        MotorQuotationOptionService.updateQuotationOption(
            quotation_option_id,
            data,
            (error, result) => {

                if (error) {

                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message:
                                "This insurance company already exists for this quotation"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message:
                            "Failed to update quotation option",
                        error
                    });
                }


                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "Quotation option not found"
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
    deleteQuotationOption: (req, res) => {

        const { quotation_option_id } = req.params;

        if (
            !quotation_option_id ||
            isNaN(quotation_option_id) ||
            Number(quotation_option_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid quotation option ID is required"
            });
        }


        MotorQuotationOptionService.deleteQuotationOption(
            quotation_option_id,
            (error, result) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message:
                            "Failed to delete quotation option",
                        error
                    });
                }


                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "Quotation option not found"
                    });
                }


                return res.status(200).json({
                    success: 1,
                    message: result.message
                });
            }
        );
    }
};

module.exports = MotorQuotationOptionController;