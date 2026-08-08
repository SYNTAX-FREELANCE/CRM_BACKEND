// controllers/callOutcome.controller.js

const callOutcomeService = require("./callOutcome.service");

module.exports = {
    createCallOutcome: (req, res) => {

        try {
            const {
                outcome_key,
                outcome_label,
                icon_key,
                display_order,
                is_active
            } = req.body;

            // Validation
            if (!outcome_key || outcome_key.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Outcome key is required"
                });
            }

            if (!outcome_label || outcome_label.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Outcome label is required"
                });
            }


            if (!icon_key || icon_key.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Icon key is required"
                });
            }

            // Prepare outcome data
            const outcomeData = {
                outcome_key: outcome_key.trim().toUpperCase(),
                outcome_label: outcome_label.trim(),
                icon_key: icon_key.trim(),
                display_order:
                    display_order !== undefined
                        ? display_order
                        : 0,
                is_active:
                    is_active !== undefined
                        ? is_active
                        : 1
            };


            callOutcomeService.createCallOutcome(
                outcomeData,
                (err, result) => {
                    if (err) {
                        // Duplicate outcome_key
                        if (err.code === "ER_DUP_ENTRY") {
                            return res.status(200).json({
                                success: 0,
                                message: "Outcome key already exists"
                            });

                        }
                        return res.status(500).json({
                            success: 0,
                            message:
                                "Something went wrong while creating call outcome"
                        });
                    }

                    return res.status(200).json({
                        success: 1,
                        message: "Call outcome created successfully",
                    });
                }
            );
        } catch (error) {
            console.error("createCallOutcome controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },


    // ==================== GET ALL CALL OUTCOMES ====================

    getAllCallOutcomes: (req, res) => {

        try {

            callOutcomeService.getAllCallOutcomes(
                (err, outcomes) => {

                    if (err) {

                        console.error(
                            "getAllCallOutcomes DB error:",
                            err
                        );

                        return res.status(500).json({

                            success: 0,

                            message:
                                "Something went wrong"

                        });

                    }


                    return res.status(200).json({

                        success: 1,

                        message:
                            "Call outcomes retrieved successfully",

                        data: outcomes

                    });

                }
            );

        } catch (error) {

            console.error(
                "getAllCallOutcomes controller error:",
                error
            );

            return res.status(500).json({

                success: 0,

                message: "Something went wrong"

            });

        }

    },


    // ==================== GET CALL OUTCOME BY ID ====================

    getCallOutcomeById: (req, res) => {

        try {

            const {
                outcomeId
            } = req.params;


            callOutcomeService.getCallOutcomeById(
                outcomeId,
                (err, outcome) => {

                    if (err) {

                        console.error(
                            "getCallOutcomeById DB error:",
                            err
                        );

                        return res.status(500).json({

                            success: 0,

                            message:
                                "Something went wrong"

                        });

                    }


                    if (!outcome) {

                        return res.status(200).json({

                            success: 0,

                            message:
                                "Call outcome not found"

                        });

                    }


                    return res.status(200).json({

                        success: 1,

                        message:
                            "Call outcome retrieved successfully",

                        data: outcome

                    });

                }
            );

        } catch (error) {

            console.error(
                "getCallOutcomeById controller error:",
                error
            );

            return res.status(500).json({

                success: 0,

                message: "Something went wrong"

            });

        }

    },


    // ==================== UPDATE CALL OUTCOME ====================

    updateCallOutcome: (req, res) => {

        try {

            const {
                outcomeId
            } = req.params;


            const {
                outcome_key,
                outcome_label,
                icon_key,
                display_order,
                is_active
            } = req.body;


            // Validation

            if (!outcome_key || outcome_key.trim() === "") {

                return res.status(200).json({

                    success: 0,

                    message:
                        "Outcome key is required"

                });

            }


            if (!outcome_label || outcome_label.trim() === "") {

                return res.status(200).json({

                    success: 0,

                    message:
                        "Outcome label is required"

                });

            }


            if (!icon_key || icon_key.trim() === "") {

                return res.status(200).json({

                    success: 0,

                    message:
                        "Icon key is required"

                });

            }


            const outcomeData = {

                outcome_key:
                    outcome_key.trim().toUpperCase(),

                outcome_label:
                    outcome_label.trim(),

                icon_key:
                    icon_key.trim(),

                display_order:
                    display_order !== undefined
                        ? display_order
                        : 0,

                is_active:
                    is_active !== undefined
                        ? is_active
                        : 1

            };


            callOutcomeService.updateCallOutcome(
                outcomeId,
                outcomeData,
                (err, result) => {

                    if (err) {

                        console.error(
                            "updateCallOutcome DB error:",
                            err
                        );

                        return res.status(500).json({

                            success: 0,

                            message:
                                "Something went wrong while updating call outcome"

                        });

                    }


                    return res.status(200).json({

                        success: 1,

                        message:
                            "Call outcome updated successfully",

                        data: {

                            outcome_id:
                                outcomeId

                        }

                    });

                }
            );

        } catch (error) {

            console.error(
                "updateCallOutcome controller error:",
                error
            );

            return res.status(500).json({

                success: 0,

                message: "Something went wrong"

            });

        }

    }

};