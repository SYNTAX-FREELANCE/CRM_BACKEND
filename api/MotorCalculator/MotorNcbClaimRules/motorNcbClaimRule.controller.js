const MotorNcbClaimRuleService = require("./motorNcbClaimRule.service");

const MotorNcbClaimRuleController = {

    // CREATE
    createNcbClaimRule: (req, res) => {

        const {
            ncb_rule_id,
            claim_count,
            ncb_percentage,
            description
        } = req.body;


        // NCB Rule
        if (
            ncb_rule_id === undefined ||
            ncb_rule_id === null ||
            ncb_rule_id === "" ||
            isNaN(ncb_rule_id) ||
            Number(ncb_rule_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid ncb_rule_id is required"
            });
        }


        // Claim Count
        if (
            claim_count === undefined ||
            claim_count === null ||
            claim_count === "" ||
            isNaN(claim_count) ||
            Number(claim_count) < 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid claim_count is required"
            });
        }


        // NCB Percentage
        if (
            ncb_percentage === undefined ||
            ncb_percentage === null ||
            ncb_percentage === "" ||
            isNaN(ncb_percentage) ||
            Number(ncb_percentage) < 0 ||
            Number(ncb_percentage) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "ncb_percentage must be between 0 and 100"
            });
        }


        // Description
        if (
            description &&
            description.length > 500
        ) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }


        const data = {
            ncb_rule_id: Number(ncb_rule_id),
            claim_count: Number(claim_count),
            ncb_percentage: Number(ncb_percentage),
            description: description || null
        };


        MotorNcbClaimRuleService.createNcbClaimRule(
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message:
                                "Invalid NCB rule reference"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }


                return res.status(200).json({
                    success: 1,
                    message: "NCB claim rule created successfully",
                    data: result
                });
            }
        );
    },


    // GET ALL
    getAllNcbClaimRules: (req, res) => {

        MotorNcbClaimRuleService.getAllNcbClaimRules(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    data: result
                });
            }
        );
    },


    // GET BY ID
    getNcbClaimRuleById: (req, res) => {

        const { id } = req.params;

        MotorNcbClaimRuleService.getNcbClaimRuleById(
            id,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }


                if (!result || result.length === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "NCB claim rule not found"
                    });
                }


                return res.status(200).json({
                    success: 1,
                    data: result[0]
                });
            }
        );
    },


    // UPDATE
    updateNcbClaimRule: (req, res) => {

        const { id } = req.params;

        const {
            ncb_rule_id,
            claim_count,
            ncb_percentage,
            description
        } = req.body;


        // NCB Rule
        if (
            ncb_rule_id === undefined ||
            ncb_rule_id === null ||
            ncb_rule_id === "" ||
            isNaN(ncb_rule_id) ||
            Number(ncb_rule_id) <= 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid ncb_rule_id is required"
            });
        }


        // Claim Count
        if (
            claim_count === undefined ||
            claim_count === null ||
            claim_count === "" ||
            isNaN(claim_count) ||
            Number(claim_count) < 0
        ) {
            return res.status(200).json({
                success: 0,
                message: "Valid claim_count is required"
            });
        }


        // NCB Percentage
        if (
            ncb_percentage === undefined ||
            ncb_percentage === null ||
            ncb_percentage === "" ||
            isNaN(ncb_percentage) ||
            Number(ncb_percentage) < 0 ||
            Number(ncb_percentage) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "ncb_percentage must be between 0 and 100"
            });
        }


        // Description
        if (
            description &&
            description.length > 500
        ) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }


        const data = {
            ncb_rule_id: Number(ncb_rule_id),
            claim_count: Number(claim_count),
            ncb_percentage: Number(ncb_percentage),
            description: description || null
        };


        MotorNcbClaimRuleService.updateNcbClaimRule(
            id,
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message:
                                "Invalid NCB rule reference"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }


                return res.status(200).json({
                    success: 1,
                    message: "NCB claim rule updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteNcbClaimRule: (req, res) => {

        const { id } = req.params;

        MotorNcbClaimRuleService.deleteNcbClaimRule(
            id,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "NCB claim rule deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActiveNcbClaimRules: (req, res) => {

        MotorNcbClaimRuleService.getActiveNcbClaimRules(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    data: result
                });
            }
        );
    }

};

module.exports = MotorNcbClaimRuleController;