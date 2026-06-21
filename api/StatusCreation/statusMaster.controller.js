// controllers/statusMaster.controller.js
const statusMasterService = require("./statusMaster.service");

module.exports = {
    // ==================== CREATE STATUS ====================
    createStatus: (req, res) => {
        try {
            const { status_name, alias, isActive } = req.body;

            // Validation
            if (!status_name || status_name.trim() === "") {
                return res.status(400).json({
                    success: 0,
                    message: "Status name is required"
                });
            }

            // Prepare status data
            const statusData = {
                status_name: status_name.trim(),
                alias: alias || null,
                is_active: isActive
            };

            // Step 1: Create status in status_master table
            statusMasterService.createStatus(statusData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while creating status"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Status created successfully",
                    data: {
                        status_id: result.insertId,
                        status_name: statusData.status_name,
                        status_description: statusData.status_description
                    }
                });
            });
        } catch (error) {
            console.error("createStatus error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ALL STATUSES ====================
    getAllStatuses: (req, res) => {
        try {
            statusMasterService.getAllStatuses((err, statuses) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Statuses retrieved successfully",
                    data: statuses
                });
            });
        } catch (error) {
            console.error("getAllStatuses error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET STATUS BY ID ====================
    getStatusById: (req, res) => {
        try {
            const { statusId } = req.params;

            statusMasterService.getStatusById(statusId, (err, status) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                if (!status) {
                    return res.status(404).json({
                        success: 0,
                        message: "Status not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Status retrieved successfully",
                    data: status
                });
            });
        } catch (error) {
            console.error("getStatusById error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== UPDATE STATUS ====================
    updateStatus: (req, res) => {
        try {
            const { statusId } = req.params;
            const { status_name, alias, isActive } = req.body;

            // Validation
            if (!status_name || status_name.trim() === "") {
                return res.status(400).json({
                    success: 0,
                    message: "Status name is required"
                });
            }

            const statusData = {
                status_name: status_name.trim(),
                alias: alias || null,
                is_active: isActive
            };
            statusMasterService.updateStatus(statusId, statusData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while updating status"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Status updated successfully",
                    data: { status_id: statusId }
                });
            });
        } catch (error) {
            console.error("updateStatus error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== DELETE STATUS (SOFT DELETE) ====================
    deleteStatus: (req, res) => {
        try {
            const { statusId } = req.params;

            statusMasterService.deleteStatus(statusId, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while deleting status"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Status deleted successfully"
                });
            });
        } catch (error) {
            console.error("deleteStatus error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ACTIVE STATUSES ONLY ====================
    getActiveStatuses: (req, res) => {
        try {
            statusMasterService.getActiveStatuses((err, statuses) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Active statuses retrieved successfully",
                    data: statuses
                });
            });
        } catch (error) {
            console.error("getActiveStatuses error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    }
};