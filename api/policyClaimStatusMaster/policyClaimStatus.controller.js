const policyClaimStatusService = require("./policyClaimStatus.service");

module.exports = {

    // ==================== CREATE CLAIM STATUS ====================
    createClaimStatus: (req, res) => {
        try {
            const {
                claim_status_name,
                claim_status_code,
                claim_status_description,
                claim_status_color,
                sequence_no,
                is_initial,
                is_final,
                is_active
            } = req.body;

            if (!claim_status_name || !claim_status_name.trim()) {
                return res.status(200).json({
                    success: 0,
                    message: "Claim status name is required"
                });
            }

            if (!claim_status_code || !claim_status_code.trim()) {
                return res.status(200).json({
                    success: 0,
                    message: "Claim status code is required"
                });
            }

            if (sequence_no === undefined || !Number.isInteger(Number(sequence_no))) {
                return res.status(200).json({
                    success: 0,
                    message: "Sequence number is required and must be an integer"
                });
            }

            const flagFields = { is_initial, is_final, is_active };

            for (const [field, value] of Object.entries(flagFields)) {
                if (value !== undefined && ![0, 1, "0", "1"].includes(value)) {
                    return res.status(200).json({
                        success: 0,
                        message: `${field} must be either 0 or 1`
                    });
                }
            }

            const statusData = {
                claim_status_name: claim_status_name.trim(),
                claim_status_code: claim_status_code.trim().toUpperCase(),
                claim_status_description: claim_status_description?.trim() || null,
                claim_status_color: claim_status_color?.trim() || null,
                sequence_no: Number(sequence_no),
                is_initial: Number(is_initial ?? 0),
                is_final: Number(is_final ?? 0),
                is_active: Number(is_active ?? 1)
            };

            policyClaimStatusService.createClaimStatus(statusData, (err, result) => {
                if (err) {
                    console.error("createClaimStatus DB error:", err);

                    return res.status(err.code === "ER_DUP_ENTRY" ? 200 : 500).json({
                        success: 0,
                        message: err.code === "ER_DUP_ENTRY"
                            ? "Claim status code already exists"
                            : "Something went wrong while creating claim status"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Claim status created successfully",
                    data: {
                        claim_status_id: result.insertId,
                        ...statusData
                    }
                });
            });

        } catch (error) {
            console.error("createClaimStatus controller error:", error);

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },


    // ==================== GET ALL CLAIM STATUSES ====================
    getAllClaimStatuses: (req, res) => {
        try {
            policyClaimStatusService.getAllClaimStatuses((err, statuses) => {
                if (err) {
                    console.error("getAllClaimStatuses DB error:", err);

                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Claim statuses retrieved successfully",
                    data: statuses
                });
            });

        } catch (error) {
            console.error("getAllClaimStatuses controller error:", error);

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },


    // ==================== GET CLAIM STATUS BY ID ====================
    getClaimStatusById: (req, res) => {
        try {
            const { claimStatusId } = req.params;

            if (!Number.isInteger(Number(claimStatusId)) || Number(claimStatusId) <= 0) {
                return res.status(200).json({
                    success: 0,
                    message: "Valid claim status ID is required"
                });
            }

            policyClaimStatusService.getClaimStatusById(claimStatusId, (err, status) => {
                if (err) {
                    console.error("getClaimStatusById DB error:", err);

                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                if (!status) {
                    return res.status(200).json({
                        success: 0,
                        message: "Claim status not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Claim status retrieved successfully",
                    data: status
                });
            });

        } catch (error) {
            console.error("getClaimStatusById controller error:", error);

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },


    // ==================== UPDATE CLAIM STATUS ====================
    updateClaimStatus: (req, res) => {
        try {
            const { claimStatusId } = req.params;

            const {
                claim_status_name,
                claim_status_code,
                claim_status_description,
                claim_status_color,
                sequence_no,
                is_initial,
                is_final,
                is_active
            } = req.body;

            if (!Number.isInteger(Number(claimStatusId)) || Number(claimStatusId) <= 0) {
                return res.status(200).json({
                    success: 0,
                    message: "Valid claim status ID is required"
                });
            }

            if (!claim_status_name || !claim_status_name.trim()) {
                return res.status(200).json({
                    success: 0,
                    message: "Claim status name is required"
                });
            }

            if (!claim_status_code || !claim_status_code.trim()) {
                return res.status(200).json({
                    success: 0,
                    message: "Claim status code is required"
                });
            }

            if (sequence_no === undefined || !Number.isInteger(Number(sequence_no))) {
                return res.status(200).json({
                    success: 0,
                    message: "Sequence number is required and must be an integer"
                });
            }

            const flagFields = { is_initial, is_final, is_active };

            for (const [field, value] of Object.entries(flagFields)) {
                if (value !== undefined && ![0, 1, "0", "1"].includes(value)) {
                    return res.status(200).json({
                        success: 0,
                        message: `${field} must be either 0 or 1`
                    });
                }
            }

            const statusData = {
                claim_status_name: claim_status_name.trim(),
                claim_status_code: claim_status_code.trim().toUpperCase(),
                claim_status_description: claim_status_description?.trim() || null,
                claim_status_color: claim_status_color?.trim() || null,
                sequence_no: Number(sequence_no),
                is_initial: Number(is_initial ?? 0),
                is_final: Number(is_final ?? 0),
                is_active: Number(is_active ?? 1)
            };

            policyClaimStatusService.updateClaimStatus(
                claimStatusId,
                statusData,
                (err, result) => {
                    if (err) {
                        console.error("updateClaimStatus DB error:", err);

                        return res.status(err.code === "ER_DUP_ENTRY" ? 200 : 500).json({
                            success: 0,
                            message: err.code === "ER_DUP_ENTRY"
                                ? "Claim status code already exists"
                                : "Something went wrong while updating claim status"
                        });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(200).json({
                            success: 0,
                            message: "Claim status not found"
                        });
                    }

                    return res.status(200).json({
                        success: 1,
                        message: "Claim status updated successfully",
                        data: {
                            claim_status_id: Number(claimStatusId),
                            ...statusData
                        }
                    });
                }
            );

        } catch (error) {
            console.error("updateClaimStatus controller error:", error);

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    }

};