const outcomeStatusMappingService = require("./outcomeStatusMapping.service");


module.exports = {

    // ==================== CREATE OUTCOME STATUS MAPPING ====================

    createOutcomeStatusMapping: (req, res) => {
        try {
            const {
                outcome_id,
                status_id,
                is_active
            } = req.body;
            // Validation

            if (
                outcome_id === undefined ||
                outcome_id === null ||
                outcome_id === ""
            ) {

                return res.status(200).json({
                    success: 0,
                    message: "Outcome is required"
                });

            }


            if (
                status_id === undefined ||
                status_id === null ||
                status_id === ""
            ) {

                return res.status(200).json({
                    success: 0,
                    message: "Status is required"
                });

            }


            // Prepare mapping data

            const mappingData = {
                outcome_id: Number(outcome_id),
                status_id: Number(status_id),
                is_active:
                    is_active !== undefined
                        ? is_active
                        : 1
            };

            outcomeStatusMappingService.createOutcomeStatusMapping(
                mappingData,
                (err, result) => {

                    if (err) {
                        if (err.code === "ER_DUP_ENTRY") {
                            return res.status(200).json({
                                success: 0,
                                message: "This outcome is already mapped to a status"
                            });
                        }
                        return res.status(500).json({
                            success: 0,
                            message:
                                "Something went wrong while creating outcome status mapping"
                        });

                    }


                    return res.status(200).json({
                        success: 1,
                        message: "Outcome status mapping created successfully",
                        data: {
                            mapping_id:
                                result.insertId,

                            outcome_id:
                                mappingData.outcome_id,

                            status_id:
                                mappingData.status_id,

                            is_active:
                                mappingData.is_active

                        }

                    });

                }
            );

        } catch (error) {

            console.error(
                "createOutcomeStatusMapping controller error:",
                error
            );


            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET ALL OUTCOME STATUS MAPPINGS ====================

    getAllOutcomeStatusMappings: (req, res) => {

        try {

            outcomeStatusMappingService.getAllOutcomeStatusMappings(
                (err, mappings) => {

                    if (err) {

                        console.error(
                            "getAllOutcomeStatusMappings DB error:",
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
                            "Outcome status mappings retrieved successfully",

                        data: mappings

                    });

                }
            );

        } catch (error) {

            console.error(
                "getAllOutcomeStatusMappings controller error:",
                error
            );


            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== GET OUTCOME STATUS MAPPING BY ID ====================

    getOutcomeStatusMappingById: (req, res) => {

        try {

            const {
                mappingId
            } = req.params;


            if (!mappingId) {

                return res.status(200).json({
                    success: 0,
                    message: "Mapping ID is required"
                });

            }


            outcomeStatusMappingService.getOutcomeStatusMappingById(
                mappingId,
                (err, mapping) => {

                    if (err) {

                        console.error(
                            "getOutcomeStatusMappingById DB error:",
                            err
                        );


                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong"
                        });

                    }


                    if (!mapping) {

                        return res.status(200).json({
                            success: 0,
                            message:
                                "Outcome status mapping not found"
                        });

                    }


                    return res.status(200).json({

                        success: 1,

                        message:
                            "Outcome status mapping retrieved successfully",

                        data: mapping

                    });

                }
            );

        } catch (error) {

            console.error(
                "getOutcomeStatusMappingById controller error:",
                error
            );


            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },


    // ==================== UPDATE OUTCOME STATUS MAPPING ====================

    updateOutcomeStatusMapping: (req, res) => {

        try {

            const {
                mappingId
            } = req.params;


            const {
                outcome_id,
                status_id,
                is_active
            } = req.body;


            // Validation

            if (!mappingId) {

                return res.status(200).json({
                    success: 0,
                    message: "Mapping ID is required"
                });

            }


            if (
                outcome_id === undefined ||
                outcome_id === null ||
                outcome_id === ""
            ) {

                return res.status(200).json({
                    success: 0,
                    message: "Outcome is required"
                });

            }


            if (
                status_id === undefined ||
                status_id === null ||
                status_id === ""
            ) {

                return res.status(200).json({
                    success: 0,
                    message: "Status is required"
                });

            }


            const mappingData = {

                outcome_id:
                    Number(outcome_id),

                status_id:
                    Number(status_id),

                is_active:
                    is_active !== undefined
                        ? is_active
                        : 1

            };


            outcomeStatusMappingService.updateOutcomeStatusMapping(
                mappingId,
                mappingData,
                (err, result) => {

                    if (err) {

                        console.error(
                            "updateOutcomeStatusMapping DB error:",
                            err
                        );


                        if (err.code === "ER_DUP_ENTRY") {

                            return res.status(200).json({
                                success: 0,
                                message:
                                    "This outcome is already mapped to another status"
                            });

                        }


                        return res.status(500).json({
                            success: 0,
                            message:
                                "Something went wrong while updating outcome status mapping"
                        });

                    }


                    return res.status(200).json({

                        success: 1,

                        message:
                            "Outcome status mapping updated successfully",

                        data: {

                            mapping_id:
                                mappingId

                        }

                    });

                }
            );

        } catch (error) {

            console.error(
                "updateOutcomeStatusMapping controller error:",
                error
            );


            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },

    getOutcomeByStatusId: (
        req,
        res
    ) => {

        const { status_id } = req.params;

        if (!status_id) {

            return res.status(200).json({
                success: 0,
                message: "Status ID is required",
            });

        }


        if (
            !Number.isInteger(
                Number(status_id)
            )
        ) {

            return res.status(200).json({
                success: 0,
                message: "Invalid Status ID",
            });

        }


        outcomeStatusMappingService.getOutcomeByStatusIdService(
            Number(status_id),
            (err, result) => {

                if (err) {

                    console.error(
                        "getOutcomeByStatusId controller error:",
                        err
                    );
                    return res.status(500).json({
                        success: 0,
                        message:
                            "Failed to fetch outcome",
                        error: err.message,
                    });

                }


                return res.status(200).json({
                    success: 1,
                    message:
                        result.length > 0
                            ? "Outcome fetched successfully"
                            : "No outcome found for this status",
                    data: result,
                });

            }
        );
    }

};