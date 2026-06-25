// controllers/leadMaster.controller.js
const leadMasterService = require("./leadMaster.service");

module.exports = {
    // ==================== CREATE LEAD STATUS ====================
    createLead: (req, res) => {
        try {
            const { status_name, display_order, is_active } = req.body;

            // Validation
            if (!status_name || status_name.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Status name is required"
                });
            }

            if (display_order === undefined || isNaN(parseInt(display_order, 10))) {
                return res.status(200).json({
                    success: 0,
                    message: "Display order is required and must be an integer"
                });
            }

            // Prepare lead status data
            const leadData = {
                status_name: status_name.trim(),
                display_order: parseInt(display_order, 10),
                is_active: is_active !== undefined ? is_active : 1
            };

            leadMasterService.createLead(leadData, (err, result) => {
                if (err) {
                    console.error("createLead DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while creating lead status"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Lead status created successfully",
                    data: {
                        status_id: result.insertId,
                        status_name: leadData.status_name,
                        display_order: leadData.display_order,
                        is_active: leadData.is_active
                    }
                });
            });
        } catch (error) {
            console.error("createLead controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ALL LEAD STATUSES ====================
    getAllLeads: (req, res) => {
        try {
            leadMasterService.getAllLeads((err, leads) => {
                if (err) {
                    console.error("getAllLeads DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Lead statuses retrieved successfully",
                    data: leads
                });
            });
        } catch (error) {
            console.error("getAllLeads controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET LEAD STATUS BY ID ====================
    getLeadById: (req, res) => {
        try {
            const { leadSlno } = req.params; // leadSlno maps to statusId

            leadMasterService.getLeadById(leadSlno, (err, lead) => {
                if (err) {
                    console.error("getLeadById DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                if (!lead) {
                    return res.status(200).json({
                        success: 0,
                        message: "Lead status not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Lead status retrieved successfully",
                    data: lead
                });
            });
        } catch (error) {
            console.error("getLeadById controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== UPDATE LEAD STATUS ====================
    updateLead: (req, res) => {
        try {
            const { leadSlno } = req.params; // leadSlno maps to statusId
            const { status_name, display_order, is_active } = req.body;

            // Validation
            if (!status_name || status_name.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Status name is required"
                });
            }

            if (display_order === undefined || isNaN(parseInt(display_order, 10))) {
                return res.status(200).json({
                    success: 0,
                    message: "Display order is required and must be an integer"
                });
            }

            const leadData = {
                status_name: status_name.trim(),
                display_order: parseInt(display_order, 10),
                is_active: is_active !== undefined ? is_active : 1
            };

            leadMasterService.updateLead(leadSlno, leadData, (err, result) => {
                if (err) {
                    console.error("updateLead DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while updating lead status"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Lead status updated successfully",
                    data: { status_id: leadSlno }
                });
            });
        } catch (error) {
            console.error("updateLead controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    }
};
