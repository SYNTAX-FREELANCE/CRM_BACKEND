// controllers/employeeLevel.controller.js

const employeeLevelService = require("./employeeLevel.service");

module.exports = {

    // ==================== CREATE EMPLOYEE LEVEL ====================

    createEmployeeLevel: (req, res) => {

        try {

            const {
                level_name,
                description,
                isActive
            } = req.body;

            // Validation

            if (!level_name || level_name.trim() === "") {

                return res.status(200).json({
                    success: 0,
                    message: "Level name is required"
                });

            }

            if (level_name.trim().length > 100) {

                return res.status(200).json({
                    success: 0,
                    message: "Level name must not exceed 100 characters"
                });

            }

            if (description && description.trim().length > 255) {

                return res.status(200).json({
                    success: 0,
                    message: "Description must not exceed 255 characters"
                });

            }

            // Prepare employee level data

            const employeeLevelData = {

                level_name: level_name.trim(),

                description:
                    description && description.trim() !== ""
                        ? description.trim()
                        : null,

                is_active:
                    isActive === undefined
                        ? 1
                        : isActive

            };

            employeeLevelService.createEmployeeLevel(
                employeeLevelData,
                (err, result) => {

                    if (err) {

                        console.error(
                            "createEmployeeLevel error:",
                            err
                        );

                        // Duplicate level name

                        if (err.code === "ER_DUP_ENTRY") {

                            return res.status(200).json({
                                success: 0,
                                message: "Employee level already exists"
                            });

                        }

                        return res.status(500).json({
                            success: 0,
                            message:
                                "Something went wrong while creating employee level"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message:
                            "Employee level created successfully",

                        data: {

                            employee_level_id:
                                result.insertId,

                            level_name:
                                employeeLevelData.level_name,

                            description:
                                employeeLevelData.description

                        }

                    });

                }
            );

        } catch (error) {

            console.error(
                "createEmployeeLevel error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET ALL EMPLOYEE LEVELS ====================

    getAllEmployeeLevels: (req, res) => {

        try {

            employeeLevelService.getAllEmployeeLevels(
                (err, levels) => {

                    if (err) {

                        console.error(
                            "getAllEmployeeLevels error:",
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
                            "Employee levels retrieved successfully",

                        data: levels

                    });

                }
            );

        } catch (error) {

            console.error(
                "getAllEmployeeLevels error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET EMPLOYEE LEVEL BY ID ====================

    getEmployeeLevelById: (req, res) => {

        try {

            const {
                employeeLevelId
            } = req.params;

            employeeLevelService.getEmployeeLevelById(
                employeeLevelId,
                (err, level) => {

                    if (err) {

                        console.error(
                            "getEmployeeLevelById error:",
                            err
                        );

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong"
                        });

                    }

                    if (!level) {

                        return res.status(200).json({
                            success: 0,
                            message: "Employee level not found"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message:
                            "Employee level retrieved successfully",

                        data: level

                    });

                }
            );

        } catch (error) {

            console.error(
                "getEmployeeLevelById error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== UPDATE EMPLOYEE LEVEL ====================

    updateEmployeeLevel: (req, res) => {

        try {

            const {
                employeeLevelId
            } = req.params;

            const {
                level_name,
                description,
                isActive
            } = req.body;

            // Validation

            if (!level_name || level_name.trim() === "") {

                return res.status(400).json({
                    success: 0,
                    message: "Level name is required"
                });

            }

            if (level_name.trim().length > 100) {

                return res.status(400).json({
                    success: 0,
                    message: "Level name must not exceed 100 characters"
                });

            }

            if (description && description.trim().length > 255) {

                return res.status(400).json({
                    success: 0,
                    message: "Description must not exceed 255 characters"
                });

            }

            const employeeLevelData = {

                level_name:
                    level_name.trim(),

                description:
                    description && description.trim() !== ""
                        ? description.trim()
                        : null,

                is_active:
                    isActive === undefined
                        ? 1
                        : isActive

            };

            employeeLevelService.updateEmployeeLevel(
                employeeLevelId,
                employeeLevelData,
                (err, result) => {

                    if (err) {

                        console.error(
                            "updateEmployeeLevel error:",
                            err
                        );

                        if (err.code === "ER_DUP_ENTRY") {

                            return res.status(200).json({
                                success: 0,
                                message:
                                    "Employee level already exists"
                            });

                        }

                        return res.status(500).json({
                            success: 0,
                            message:
                                "Something went wrong while updating employee level"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message:
                            "Employee level updated successfully",

                        data: {
                            employee_level_id:
                                employeeLevelId
                        }

                    });

                }
            );

        } catch (error) {

            console.error(
                "updateEmployeeLevel error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== DELETE EMPLOYEE LEVEL ====================

    deleteEmployeeLevel: (req, res) => {

        try {

            const {
                employeeLevelId
            } = req.params;

            employeeLevelService.deleteEmployeeLevel(
                employeeLevelId,
                (err, result) => {

                    if (err) {

                        console.error(
                            "deleteEmployeeLevel error:",
                            err
                        );

                        return res.status(500).json({
                            success: 0,
                            message:
                                "Something went wrong while deleting employee level"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message:
                            "Employee level deleted successfully"

                    });

                }
            );

        } catch (error) {

            console.error(
                "deleteEmployeeLevel error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET ACTIVE EMPLOYEE LEVELS ====================

    getActiveEmployeeLevels: (req, res) => {

        try {

            employeeLevelService.getActiveEmployeeLevels(
                (err, levels) => {

                    if (err) {

                        console.error(
                            "getActiveEmployeeLevels error:",
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
                            "Active employee levels retrieved successfully",

                        data: levels

                    });

                }
            );

        } catch (error) {

            console.error(
                "getActiveEmployeeLevels error:",
                error
            );

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    }

};