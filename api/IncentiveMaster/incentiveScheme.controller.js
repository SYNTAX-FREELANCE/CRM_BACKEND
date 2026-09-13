const incentiveSchemeService = require("./incentiveScheme.service");

module.exports = {

    // ==================== CREATE INCENTIVE SCHEME ====================

    createIncentiveScheme: (req, res) => {

        try {

            const {
                scheme_name,
                employee_level_id,
                description,
                isActive
            } = req.body;

            // Validation

            if (!scheme_name || scheme_name.trim() === "") {

                return res.status(200).json({
                    success: 0,
                    message: "Scheme name is required"
                });

            }

            if (scheme_name.trim().length > 150) {

                return res.status(200).json({
                    success: 0,
                    message: "Scheme name must not exceed 150 characters"
                });

            }

            if (
                !employee_level_id ||
                employee_level_id === ""
            ) {

                return res.status(200).json({
                    success: 0,
                    message: "Employee level is required"
                });

            }

            if (description && description.trim().length > 255) {

                return res.status(200).json({
                    success: 0,
                    message: "Description must not exceed 255 characters"
                });

            }

            // Prepare scheme data

            const incentiveSchemeData = {

                scheme_name:
                    scheme_name.trim(),

                employee_level_id:
                    employee_level_id,

                description:
                    description && description.trim() !== ""
                        ? description.trim()
                        : null,

                is_active:
                    isActive === undefined
                        ? 1
                        : isActive

            };

            incentiveSchemeService.createIncentiveScheme(
                incentiveSchemeData,
                (err, result) => {

                    if (err) {

                        console.error(
                            "createIncentiveScheme error:",
                            err
                        );

                        if (err.code === "ER_DUP_ENTRY") {

                            return res.status(200).json({
                                success: 0,
                                message:
                                    "Incentive scheme already exists"
                            });

                        }

                        if (err.code === "ER_NO_REFERENCED_ROW_2") {

                            return res.status(200).json({
                                success: 0,
                                message:
                                    "Selected employee level does not exist"
                            });

                        }

                        return res.status(500).json({
                            success: 0,
                            message:
                                "Something went wrong while creating incentive scheme"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message:
                            "Incentive scheme created successfully",

                        data: {

                            incentive_scheme_id:
                                result.insertId,

                            scheme_name:
                                incentiveSchemeData.scheme_name,

                            employee_level_id:
                                incentiveSchemeData.employee_level_id,

                            description:
                                incentiveSchemeData.description

                        }

                    });

                }
            );

        } catch (error) {

            console.error(
                "createIncentiveScheme error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET ALL INCENTIVE SCHEMES ====================

    getAllIncentiveSchemes: (req, res) => {

        try {

            incentiveSchemeService.getAllIncentiveSchemes(
                (err, schemes) => {

                    if (err) {

                        console.error(
                            "getAllIncentiveSchemes error:",
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
                            "Incentive schemes retrieved successfully",

                        data: schemes

                    });

                }
            );

        } catch (error) {

            console.error(
                "getAllIncentiveSchemes error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET INCENTIVE SCHEME BY ID ====================

    getIncentiveSchemeById: (req, res) => {

        try {

            const {
                incentiveSchemeId
            } = req.params;

            incentiveSchemeService.getIncentiveSchemeById(
                incentiveSchemeId,
                (err, scheme) => {

                    if (err) {

                        console.error(
                            "getIncentiveSchemeById error:",
                            err
                        );

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong"
                        });

                    }

                    if (!scheme) {

                        return res.status(200).json({
                            success: 0,
                            message:
                                "Incentive scheme not found"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message:
                            "Incentive scheme retrieved successfully",

                        data: scheme

                    });

                }
            );

        } catch (error) {

            console.error(
                "getIncentiveSchemeById error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== UPDATE INCENTIVE SCHEME ====================

    updateIncentiveScheme: (req, res) => {

        try {

            const {
                incentiveSchemeId
            } = req.params;

            const {
                scheme_name,
                employee_level_id,
                description,
                isActive
            } = req.body;

            // Validation

            if (!scheme_name || scheme_name.trim() === "") {

                return res.status(400).json({
                    success: 0,
                    message: "Scheme name is required"
                });

            }

            if (scheme_name.trim().length > 150) {

                return res.status(400).json({
                    success: 0,
                    message:
                        "Scheme name must not exceed 150 characters"
                });

            }

            if (
                !employee_level_id ||
                employee_level_id === ""
            ) {

                return res.status(400).json({
                    success: 0,
                    message: "Employee level is required"
                });

            }

            if (description && description.trim().length > 255) {

                return res.status(400).json({
                    success: 0,
                    message:
                        "Description must not exceed 255 characters"
                });

            }

            const incentiveSchemeData = {

                scheme_name:
                    scheme_name.trim(),

                employee_level_id:
                    employee_level_id,

                description:
                    description && description.trim() !== ""
                        ? description.trim()
                        : null,

                is_active:
                    isActive === undefined
                        ? 1
                        : isActive

            };

            incentiveSchemeService.updateIncentiveScheme(
                incentiveSchemeId,
                incentiveSchemeData,
                (err, result) => {

                    if (err) {

                        console.error(
                            "updateIncentiveScheme error:",
                            err
                        );

                        if (err.code === "ER_DUP_ENTRY") {

                            return res.status(200).json({
                                success: 0,
                                message:
                                    "Incentive scheme already exists"
                            });

                        }

                        if (err.code === "ER_NO_REFERENCED_ROW_2") {

                            return res.status(200).json({
                                success: 0,
                                message:
                                    "Selected employee level does not exist"
                            });

                        }

                        return res.status(500).json({
                            success: 0,
                            message:
                                "Something went wrong while updating incentive scheme"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message:
                            "Incentive scheme updated successfully",

                        data: {
                            incentive_scheme_id:
                                incentiveSchemeId
                        }

                    });

                }
            );

        } catch (error) {

            console.error(
                "updateIncentiveScheme error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== DELETE INCENTIVE SCHEME ====================

    deleteIncentiveScheme: (req, res) => {

        try {

            const {
                incentiveSchemeId
            } = req.params;

            incentiveSchemeService.deleteIncentiveScheme(
                incentiveSchemeId,
                (err, result) => {

                    if (err) {

                        console.error(
                            "deleteIncentiveScheme error:",
                            err
                        );

                        return res.status(500).json({
                            success: 0,
                            message:
                                "Something went wrong while deleting incentive scheme"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message:
                            "Incentive scheme deleted successfully"

                    });

                }
            );

        } catch (error) {

            console.error(
                "deleteIncentiveScheme error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET ACTIVE INCENTIVE SCHEMES ====================

    getActiveIncentiveSchemes: (req, res) => {

        try {

            incentiveSchemeService.getActiveIncentiveSchemes(
                (err, schemes) => {

                    if (err) {

                        console.error(
                            "getActiveIncentiveSchemes error:",
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
                            "Active incentive schemes retrieved successfully",

                        data: schemes

                    });

                }
            );

        } catch (error) {

            console.error(
                "getActiveIncentiveSchemes error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    }

};