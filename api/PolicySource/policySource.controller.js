// controllers/policySource.controller.js

const policySourceService = require("./policySource.service");

module.exports = {

    // ==================== CREATE POLICY SOURCE ====================

    createPolicySource: (req, res) => {

        try {

            const { source_name, isActive } = req.body;

            // Validation
            if (!source_name || source_name.trim() === "") {

                return res.status(200).json({
                    success: 0,
                    message: "Source name is required"
                });

            }

            // Prepare source data
            const sourceData = {
                source_name: source_name.trim(),
                is_active: isActive
            };

            policySourceService.createPolicySource(
                sourceData,
                (err, result) => {

                    if (err) {

                        console.error("createPolicySource error:", err);

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong while creating policy source"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message: "Policy source created successfully",

                        data: {
                            source_id: result.insertId,
                            source_name: sourceData.source_name
                        }

                    });

                }
            );

        } catch (error) {

            console.error("createPolicySource error:", error);

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET ALL POLICY SOURCES ====================

    getAllPolicySources: (req, res) => {

        try {

            policySourceService.getAllPolicySources(
                (err, sources) => {

                    if (err) {

                        console.error("getAllPolicySources error:", err);

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message: "Policy sources retrieved successfully",

                        data: sources

                    });

                }
            );

        } catch (error) {

            console.error("getAllPolicySources error:", error);

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET POLICY SOURCE BY ID ====================

    getPolicySourceById: (req, res) => {

        try {

            const { sourceId } = req.params;

            policySourceService.getPolicySourceById(
                sourceId,
                (err, source) => {

                    if (err) {

                        console.error("getPolicySourceById error:", err);

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong"
                        });

                    }

                    if (!source) {

                        return res.status(200).json({
                            success: 0,
                            message: "Policy source not found"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message: "Policy source retrieved successfully",

                        data: source

                    });

                }
            );

        } catch (error) {

            console.error("getPolicySourceById error:", error);

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== UPDATE POLICY SOURCE ====================

    updatePolicySource: (req, res) => {

        try {

            const { sourceId } = req.params;

            const { source_name, isActive } = req.body;

            // Validation
            if (!source_name || source_name.trim() === "") {

                return res.status(400).json({
                    success: 0,
                    message: "Source name is required"
                });

            }

            const sourceData = {
                source_name: source_name.trim(),
                is_active: isActive
            };

            policySourceService.updatePolicySource(
                sourceId,
                sourceData,
                (err, result) => {

                    if (err) {

                        console.error("updatePolicySource error:", err);

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong while updating policy source"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message: "Policy source updated successfully",

                        data: {
                            source_id: sourceId
                        }

                    });

                }
            );

        } catch (error) {

            console.error("updatePolicySource error:", error);

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== DELETE POLICY SOURCE ====================

    deletePolicySource: (req, res) => {

        try {

            const { sourceId } = req.params;

            policySourceService.deletePolicySource(
                sourceId,
                (err, result) => {

                    if (err) {

                        console.error("deletePolicySource error:", err);

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong while deleting policy source"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message: "Policy source deleted successfully"

                    });

                }
            );

        } catch (error) {

            console.error("deletePolicySource error:", error);

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET ACTIVE POLICY SOURCES ====================

    getActivePolicySources: (req, res) => {

        try {

            policySourceService.getActivePolicySources(
                (err, sources) => {

                    if (err) {

                        console.error("getActivePolicySources error:", err);

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong"
                        });

                    }

                    return res.status(200).json({

                        success: 1,

                        message: "Active policy sources retrieved successfully",

                        data: sources

                    });

                }
            );

        } catch (error) {

            console.error("getActivePolicySources error:", error);

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    }

};
