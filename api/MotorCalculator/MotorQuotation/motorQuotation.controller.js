const MotorQuotationService = require("./motorQuotation.service");

const MotorQuotationController = {

    // CREATE
    createQuotation: (req, res) => {

        const {
            quotation_number,
            lead_id,
            customer_id,
            vehicle_id,
            quotation_date,
            valid_until,
            status,
            created_by
        } = req.body;


        // QUOTATION NUMBER
        if (
            !quotation_number ||
            typeof quotation_number !== "string"
        ) {
            return res.status(200).json({
                success: 0,
                message: "Quotation number is required"
            });
        }

        if (quotation_number.length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Quotation number cannot exceed 50 characters"
            });
        }


        // LEAD ID - OPTIONAL
        if (
            lead_id !== undefined &&
            lead_id !== null &&
            lead_id !== "" &&
            (isNaN(lead_id) || Number(lead_id) <= 0)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid lead ID is required"
            });
        }


        // CUSTOMER ID
        if (
            customer_id === undefined ||
            customer_id === null ||
            customer_id === "" ||
            isNaN(customer_id) ||
            Number(customer_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid customer ID is required"
            });
        }


        // VEHICLE ID
        if (
            vehicle_id === undefined ||
            vehicle_id === null ||
            vehicle_id === "" ||
            isNaN(vehicle_id) ||
            Number(vehicle_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid vehicle ID is required"
            });
        }


        // STATUS
        const validStatuses = [
            "DRAFT",
            "CALCULATED",
            "SENT",
            "ACCEPTED",
            "REJECTED",
            "EXPIRED",
            "CANCELLED"
        ];

        if (
            status !== undefined &&
            !validStatuses.includes(status)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Invalid quotation status"
            });
        }


        // CREATED BY
        if (
            created_by === undefined ||
            created_by === null ||
            created_by === "" ||
            isNaN(created_by) ||
            Number(created_by) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid created by user ID is required"
            });
        }


        // VALID UNTIL
        if (
            quotation_date &&
            valid_until &&
            new Date(valid_until) < new Date(quotation_date)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid until date cannot be before quotation date"
            });
        }


        const data = {
            quotation_number: quotation_number.trim(),
            lead_id: lead_id || null,
            customer_id: Number(customer_id),
            vehicle_id: Number(vehicle_id),
            quotation_date: quotation_date || null,
            valid_until: valid_until || null,
            status: status || "DRAFT",
            created_by: Number(created_by)
        };


        MotorQuotationService.createQuotation(
            data,
            (error, result) => {

                if (error) {

                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "Quotation number already exists"
                        });
                    }

                    if (error.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid customer, vehicle, lead or user reference"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to create quotation",
                        error
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: result.message,
                    motor_quotation_id: result.motor_quotation_id
                });
            }
        );
    },


    // GET ALL
    getAllQuotations: (req, res) => {

        MotorQuotationService.getAllQuotations(
            (error, results) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotations",
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
    getQuotationById: (req, res) => {

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


        MotorQuotationService.getQuotationById(
            motor_quotation_id,
            (error, result) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch quotation",
                        error
                    });
                }


                if (!result) {
                    return res.status(200).json({
                        success: 0,
                        message: "Quotation not found"
                    });
                }


                return res.status(200).json({
                    success: 1,
                    data: result
                });
            }
        );
    },


    // UPDATE
    updateQuotation: (req, res) => {

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


        const {
            quotation_number,
            lead_id,
            customer_id,
            vehicle_id,
            quotation_date,
            valid_until,
            status
        } = req.body;


        // QUOTATION NUMBER
        if (
            !quotation_number ||
            typeof quotation_number !== "string"
        ) {
            return res.status(200).json({
                success: 0,
                message: "Quotation number is required"
            });
        }

        if (quotation_number.length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Quotation number cannot exceed 50 characters"
            });
        }


        // LEAD ID
        if (
            lead_id !== undefined &&
            lead_id !== null &&
            lead_id !== "" &&
            (isNaN(lead_id) || Number(lead_id) <= 0)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid lead ID is required"
            });
        }


        // CUSTOMER ID
        if (
            customer_id === undefined ||
            customer_id === null ||
            customer_id === "" ||
            isNaN(customer_id) ||
            Number(customer_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid customer ID is required"
            });
        }


        // VEHICLE ID
        if (
            vehicle_id === undefined ||
            vehicle_id === null ||
            vehicle_id === "" ||
            isNaN(vehicle_id) ||
            Number(vehicle_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid vehicle ID is required"
            });
        }


        // STATUS
        const validStatuses = [
            "DRAFT",
            "CALCULATED",
            "SENT",
            "ACCEPTED",
            "REJECTED",
            "EXPIRED",
            "CANCELLED"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(200).json({
                success: 0,
                message: "Invalid quotation status"
            });
        }


        // DATE VALIDATION
        if (
            quotation_date &&
            valid_until &&
            new Date(valid_until) < new Date(quotation_date)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid until date cannot be before quotation date"
            });
        }


        const data = {
            quotation_number: quotation_number.trim(),
            lead_id: lead_id || null,
            customer_id: Number(customer_id),
            vehicle_id: Number(vehicle_id),
            quotation_date,
            valid_until: valid_until || null,
            status
        };


        MotorQuotationService.updateQuotation(
            motor_quotation_id,
            data,
            (error, result) => {

                if (error) {

                    if (error.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "Quotation number already exists"
                        });
                    }

                    if (error.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid customer, vehicle or lead reference"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to update quotation",
                        error
                    });
                }


                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "Quotation not found"
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
    deleteQuotation: (req, res) => {

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


        MotorQuotationService.deleteQuotation(
            motor_quotation_id,
            (error, result) => {

                if (error) {

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to delete quotation",
                        error
                    });
                }


                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "Quotation not found"
                    });
                }


                return res.status(200).json({
                    success: 1,
                    message: result.message
                });
            }
        );
    },


    // GET BY CUSTOMER
    getQuotationsByCustomer: (req, res) => {

        const { customer_id } = req.params;

        if (
            !customer_id ||
            isNaN(customer_id) ||
            Number(customer_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid customer ID is required"
            });
        }


        MotorQuotationService.getQuotationsByCustomer(
            customer_id,
            (error, results) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch customer quotations",
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


    // GET BY VEHICLE
    getQuotationsByVehicle: (req, res) => {

        const { vehicle_id } = req.params;

        if (
            !vehicle_id ||
            isNaN(vehicle_id) ||
            Number(vehicle_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid vehicle ID is required"
            });
        }


        MotorQuotationService.getQuotationsByVehicle(
            vehicle_id,
            (error, results) => {

                if (error) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch vehicle quotations",
                        error
                    });
                }


                return res.status(200).json({
                    success: 1,
                    data: results
                });
            }
        );
    }
};

module.exports = MotorQuotationController;