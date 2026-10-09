const MotorTpRateSlabService = require("./motorTpRateSlab.service");

const MotorTpRateSlabController = {

    // CREATE
    createTpRateSlab: (req, res) => {

        const {
            tp_rate_id,
            engine_cc_slab_id,
            gvw_slab_id,
            min_seating_capacity,
            max_seating_capacity,
            rate_value,
            description,
            is_active
        } = req.body;


        // TP RATE
        if (
            tp_rate_id === undefined ||
            tp_rate_id === null ||
            tp_rate_id === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "TP rate is required"
            });
        }

        if (isNaN(tp_rate_id) || Number(tp_rate_id) <= 0) {
            return res.status(200).json({
                success: 0,
                message: "TP rate must be a valid value"
            });
        }


        // OPTIONAL REFERENCES
        const optionalReferences = [
            {
                value: engine_cc_slab_id,
                name: "Engine CC slab"
            },
            {
                value: gvw_slab_id,
                name: "GVW slab"
            }
        ];

        for (const field of optionalReferences) {

            if (
                field.value !== undefined &&
                field.value !== null &&
                field.value !== ""
            ) {

                if (
                    isNaN(field.value) ||
                    Number(field.value) <= 0
                ) {
                    return res.status(200).json({
                        success: 0,
                        message: `${field.name} must be a valid value`
                    });
                }
            }
        }


        // SEATING CAPACITY
        if (
            min_seating_capacity !== undefined &&
            min_seating_capacity !== null &&
            min_seating_capacity !== ""
        ) {

            if (
                isNaN(min_seating_capacity) ||
                Number(min_seating_capacity) < 0
            ) {
                return res.status(200).json({
                    success: 0,
                    message: "Minimum seating capacity must be a valid non-negative number"
                });
            }
        }


        if (
            max_seating_capacity !== undefined &&
            max_seating_capacity !== null &&
            max_seating_capacity !== ""
        ) {

            if (
                isNaN(max_seating_capacity) ||
                Number(max_seating_capacity) < 0
            ) {
                return res.status(200).json({
                    success: 0,
                    message: "Maximum seating capacity must be a valid non-negative number"
                });
            }

            if (
                min_seating_capacity !== undefined &&
                min_seating_capacity !== null &&
                min_seating_capacity !== "" &&
                Number(max_seating_capacity) <
                Number(min_seating_capacity)
            ) {
                return res.status(200).json({
                    success: 0,
                    message: "Maximum seating capacity must be greater than or equal to minimum seating capacity"
                });
            }
        }


        // RATE VALUE
        if (
            rate_value === undefined ||
            rate_value === null ||
            rate_value === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "Rate value is required"
            });
        }

        if (isNaN(rate_value) || Number(rate_value) < 0) {
            return res.status(200).json({
                success: 0,
                message: "Rate value must be a valid non-negative number"
            });
        }


        // DESCRIPTION
        if (description && description.length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }


        const data = {

            tp_rate_id: Number(tp_rate_id),

            engine_cc_slab_id:
                engine_cc_slab_id === undefined ||
                    engine_cc_slab_id === null ||
                    engine_cc_slab_id === ""
                    ? null
                    : Number(engine_cc_slab_id),

            gvw_slab_id:
                gvw_slab_id === undefined ||
                    gvw_slab_id === null ||
                    gvw_slab_id === ""
                    ? null
                    : Number(gvw_slab_id),

            min_seating_capacity:
                min_seating_capacity === undefined ||
                    min_seating_capacity === null ||
                    min_seating_capacity === ""
                    ? null
                    : Number(min_seating_capacity),

            max_seating_capacity:
                max_seating_capacity === undefined ||
                    max_seating_capacity === null ||
                    max_seating_capacity === ""
                    ? null
                    : Number(max_seating_capacity),

            rate_value: Number(rate_value),

            description: description || null,
            is_active: is_active
        };


        MotorTpRateSlabService.createTpRateSlab(
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid reference. Please check the selected master values"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to create TP rate slab",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "TP rate slab created successfully",
                    data: result
                });
            }
        );
    },


    // GET ALL
    getAllTpRateSlabs: (req, res) => {

        MotorTpRateSlabService.getAllTpRateSlabs(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch TP rate slabs",
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
    getTpRateSlabById: (req, res) => {

        const { id } = req.params;

        MotorTpRateSlabService.getTpRateSlabById(
            id,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch TP rate slab",
                        error: err
                    });
                }

                if (result.length === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "TP rate slab not found"
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
    updateTpRateSlab: (req, res) => {

        const { id } = req.params;

        const {
            tp_rate_id,
            engine_cc_slab_id,
            gvw_slab_id,
            min_seating_capacity,
            max_seating_capacity,
            rate_value,
            description,
            is_active
        } = req.body;


        // TP RATE
        if (
            tp_rate_id === undefined ||
            tp_rate_id === null ||
            tp_rate_id === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "TP rate is required"
            });
        }

        if (isNaN(tp_rate_id) || Number(tp_rate_id) <= 0) {
            return res.status(200).json({
                success: 0,
                message: "TP rate must be a valid value"
            });
        }


        // OPTIONAL REFERENCES
        const optionalReferences = [
            {
                value: engine_cc_slab_id,
                name: "Engine CC slab"
            },
            {
                value: gvw_slab_id,
                name: "GVW slab"
            }
        ];

        for (const field of optionalReferences) {

            if (
                field.value !== undefined &&
                field.value !== null &&
                field.value !== ""
            ) {

                if (
                    isNaN(field.value) ||
                    Number(field.value) <= 0
                ) {
                    return res.status(200).json({
                        success: 0,
                        message: `${field.name} must be a valid value`
                    });
                }
            }
        }


        // SEATING CAPACITY
        if (
            min_seating_capacity !== undefined &&
            min_seating_capacity !== null &&
            min_seating_capacity !== ""
        ) {

            if (
                isNaN(min_seating_capacity) ||
                Number(min_seating_capacity) < 0
            ) {
                return res.status(200).json({
                    success: 0,
                    message: "Minimum seating capacity must be a valid non-negative number"
                });
            }
        }


        if (
            max_seating_capacity !== undefined &&
            max_seating_capacity !== null &&
            max_seating_capacity !== ""
        ) {

            if (
                isNaN(max_seating_capacity) ||
                Number(max_seating_capacity) < 0
            ) {
                return res.status(200).json({
                    success: 0,
                    message: "Maximum seating capacity must be a valid non-negative number"
                });
            }

            if (
                min_seating_capacity !== undefined &&
                min_seating_capacity !== null &&
                min_seating_capacity !== "" &&
                Number(max_seating_capacity) <
                Number(min_seating_capacity)
            ) {
                return res.status(200).json({
                    success: 0,
                    message: "Maximum seating capacity must be greater than or equal to minimum seating capacity"
                });
            }
        }


        // RATE VALUE
        if (
            rate_value === undefined ||
            rate_value === null ||
            rate_value === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "Rate value is required"
            });
        }

        if (isNaN(rate_value) || Number(rate_value) < 0) {
            return res.status(200).json({
                success: 0,
                message: "Rate value must be a valid non-negative number"
            });
        }


        // DESCRIPTION
        if (description && description.length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }


        const data = {

            tp_rate_id: Number(tp_rate_id),

            engine_cc_slab_id:
                engine_cc_slab_id === undefined ||
                    engine_cc_slab_id === null ||
                    engine_cc_slab_id === ""
                    ? null
                    : Number(engine_cc_slab_id),

            gvw_slab_id:
                gvw_slab_id === undefined ||
                    gvw_slab_id === null ||
                    gvw_slab_id === ""
                    ? null
                    : Number(gvw_slab_id),

            min_seating_capacity:
                min_seating_capacity === undefined ||
                    min_seating_capacity === null ||
                    min_seating_capacity === ""
                    ? null
                    : Number(min_seating_capacity),

            max_seating_capacity:
                max_seating_capacity === undefined ||
                    max_seating_capacity === null ||
                    max_seating_capacity === ""
                    ? null
                    : Number(max_seating_capacity),

            rate_value: Number(rate_value),

            description: description || null,
            is_active: is_active
        };


        MotorTpRateSlabService.updateTpRateSlab(
            id,
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        return res.status(200).json({
                            success: 0,
                            message: "Invalid reference. Please check the selected master values"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to update TP rate slab",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "TP rate slab updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteTpRateSlab: (req, res) => {

        const { id } = req.params;

        MotorTpRateSlabService.deleteTpRateSlab(
            id,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to delete TP rate slab",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "TP rate slab deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActiveTpRateSlabs: (req, res) => {

        MotorTpRateSlabService.getActiveTpRateSlabs(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to fetch active TP rate slabs",
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

module.exports = MotorTpRateSlabController;