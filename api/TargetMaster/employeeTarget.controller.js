const employeeTargetService = require("./employeeTarget.service");

module.exports = {

    // ==================== CREATE TARGET ====================
    createTarget: (req, res) => {
        try {

            const {
                employee_id,
                target_date,
                normal_target,
                renewal_target,
                assigned_by,
                remarks,
                is_active
            } = req.body;

            if (!employee_id || !target_date) {
                return res.status(400).json({
                    success: 0,
                    message: "Employee and target date are required."
                });
            }

            employeeTargetService.checkTargetExists(
                employee_id,
                target_date,
                (err, rows) => {

                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong."
                        });
                    }

                    if (rows.length > 0) {
                        return res.status(409).json({
                            success: 0,
                            message: "Target already exists for the selected employee and month."
                        });
                    }

                    const targetData = {
                        employee_id,
                        target_date,
                        normal_target: normal_target || 0,
                        renewal_target: renewal_target || 0,
                        assigned_by: assigned_by || null,
                        remarks: remarks || null,
                        is_active: is_active ?? 1
                    };

                    employeeTargetService.createTarget(
                        targetData,
                        (err, result) => {

                            if (err) {
                                console.error(err);

                                return res.status(500).json({
                                    success: 0,
                                    message: "Something went wrong while creating target."
                                });
                            }

                            return res.status(200).json({
                                success: 1,
                                message: "Employee target created successfully.",
                                data: {
                                    target_id: result.insertId
                                }
                            });

                        }
                    );

                }
            );

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                success: 0,
                message: "Something went wrong."
            });

        }
    },

    // ==================== GET ALL ====================

    getAllTargets: (req, res) => {

        employeeTargetService.getAllTargets((err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: 0,
                    message: "Something went wrong."
                });

            }

            return res.status(200).json({
                success: 1,
                data: result
            });

        });

    },

    // ==================== GET BY ID ====================

    getTargetById: (req, res) => {

        const { targetId } = req.params;

        employeeTargetService.getTargetById(targetId, (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: 0,
                    message: "Something went wrong."
                });

            }

            if (!result) {

                return res.status(404).json({
                    success: 0,
                    message: "Target not found."
                });

            }

            return res.status(200).json({
                success: 1,
                data: result
            });

        });

    },

    // ==================== UPDATE ====================

    updateTarget: (req, res) => {
        try {

            const { targetId } = req.params;

            employeeTargetService.updateTarget(
                targetId,
                req.body,
                (err, result) => {

                    if (err) {

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong while updating target."
                        });

                    }

                    return res.status(200).json({
                        success: 1,
                        message: "Employee target updated successfully."
                    });

                }
            );

        } catch (error) {

            return res.status(500).json({
                success: 0,
                message: "Something went wrong."
            });

        }

    },

    // ==================== DELETE ====================

    deleteTarget: (req, res) => {

        const { targetId } = req.params;

        employeeTargetService.deleteTarget(targetId, (err) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: 0,
                    message: "Something went wrong."
                });

            }

            return res.status(200).json({
                success: 1,
                message: "Target deleted successfully."
            });

        });

    },

    // ==================== ACTIVE ====================

    getActiveTargets: (req, res) => {

        employeeTargetService.getActiveTargets((err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: 0,
                    message: "Something went wrong."
                });

            }

            return res.status(200).json({
                success: 1,
                data: result
            });

        });

    },



    getCurrentEmployeeTarget: (req, res) => {

    try {
        const {empid} = req.params;
        employeeTargetService.getCurrentEmployeeTarget(
            empid,
            (err, result) => {
                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong."
                    });

                }
                return res.status(200).json({
                    success: 1,
                    message: "Current employee target fetched successfully.",
                    data: result || null
                });

            }
        );

    } catch (error) {
        return res.status(500).json({
            success: 0,
            message: "Something went wrong."
        });

    }

},

};