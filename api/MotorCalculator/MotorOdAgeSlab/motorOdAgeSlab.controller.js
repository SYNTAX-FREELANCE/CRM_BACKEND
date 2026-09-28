const MotorOdAgeSlabService = require("./motorOdAgeSlab.service");

const MotorOdAgeSlabController = {

    // CREATE
    createOdAgeSlab: (req, res) => {

        const {
            slab_code,
            slab_name,
            min_age_months,
            max_age_months,
            od_rate_adjustment_type,
            od_rate_adjustment,
            description
        } = req.body;

        if (!slab_code || !slab_name) {
            return res.status(200).json({
                success: 0,
                message: "Slab code and slab name are required"
            });
        }

        if (
            min_age_months === undefined ||
            min_age_months === null ||
            min_age_months === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "Minimum age in months is required"
            });
        }

        if (isNaN(min_age_months) || Number(min_age_months) < 0) {
            return res.status(200).json({
                success: 0,
                message: "Minimum age in months must be a valid non-negative number"
            });
        }

        if (
            max_age_months !== undefined &&
            max_age_months !== null &&
            max_age_months !== ""
        ) {
            if (
                isNaN(max_age_months) ||
                Number(max_age_months) < Number(min_age_months)
            ) {
                return res.status(200).json({
                    success: 0,
                    message: "Maximum age must be greater than or equal to minimum age"
                });
            }
        }

        const adjustmentType = od_rate_adjustment_type || "NONE";

        if (!["NONE", "PERCENTAGE", "FIXED"].includes(adjustmentType)) {
            return res.status(200).json({
                success: 0,
                message: "Invalid OD rate adjustment type"
            });
        }

        const adjustment = od_rate_adjustment || 0;

        if (isNaN(adjustment) || Number(adjustment) < 0) {
            return res.status(200).json({
                success: 0,
                message: "OD rate adjustment must be a valid non-negative number"
            });
        }

        if (
            adjustmentType === "PERCENTAGE" &&
            Number(adjustment) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "Percentage adjustment cannot exceed 100"
            });
        }

        if (slab_code.length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Slab code cannot exceed 50 characters"
            });
        }

        if (slab_name.length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Slab name cannot exceed 150 characters"
            });
        }

        if (description && description.length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }

        const data = {
            slab_code,
            slab_name,
            min_age_months: Number(min_age_months),
            max_age_months:
                max_age_months === undefined ||
                max_age_months === null ||
                max_age_months === ""
                    ? null
                    : Number(max_age_months),
            od_rate_adjustment_type: adjustmentType,
            od_rate_adjustment: Number(adjustment),
            description: description || null
        };

        MotorOdAgeSlabService.createOdAgeSlab(data, (err, result) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(200).json({
                        success: 0,
                        message: "Slab code already exists"
                    });
                }

                return res.status(500).json({
                    success: 0,
                    message: "Failed to create OD age slab",
                    error: err
                });
            }

            return res.status(200).json({
                success: 1,
                message: "OD age slab created successfully",
                data: result
            });
        });
    },


    // GET ALL
    getAllOdAgeSlabs: (req, res) => {

        MotorOdAgeSlabService.getAllOdAgeSlabs((err, result) => {

            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Failed to fetch OD age slabs",
                    error: err
                });
            }

            return res.status(200).json({
                success: 1,
                data: result
            });
        });
    },


    // GET BY ID
    getOdAgeSlabById: (req, res) => {

        const { id } = req.params;

        MotorOdAgeSlabService.getOdAgeSlabById(id, (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Failed to fetch OD age slab",
                    error: err
                });
            }

            if (result.length === 0) {
                return res.status(200).json({
                    success: 0,
                    message: "OD age slab not found"
                });
            }

            return res.status(200).json({
                success: 1,
                data: result[0]
            });
        });
    },


    // UPDATE
    updateOdAgeSlab: (req, res) => {

        const { id } = req.params;

        const {
            slab_code,
            slab_name,
            min_age_months,
            max_age_months,
            od_rate_adjustment_type,
            od_rate_adjustment,
            description
        } = req.body;

        if (!slab_code || !slab_name) {
            return res.status(200).json({
                success: 0,
                message: "Slab code and slab name are required"
            });
        }

        if (
            min_age_months === undefined ||
            min_age_months === null ||
            min_age_months === ""
        ) {
            return res.status(200).json({
                success: 0,
                message: "Minimum age in months is required"
            });
        }

        if (isNaN(min_age_months) || Number(min_age_months) < 0) {
            return res.status(200).json({
                success: 0,
                message: "Minimum age in months must be a valid non-negative number"
            });
        }

        if (
            max_age_months !== undefined &&
            max_age_months !== null &&
            max_age_months !== ""
        ) {
            if (
                isNaN(max_age_months) ||
                Number(max_age_months) < Number(min_age_months)
            ) {
                return res.status(200).json({
                    success: 0,
                    message: "Maximum age must be greater than or equal to minimum age"
                });
            }
        }

        const adjustmentType = od_rate_adjustment_type || "NONE";

        if (!["NONE", "PERCENTAGE", "FIXED"].includes(adjustmentType)) {
            return res.status(200).json({
                success: 0,
                message: "Invalid OD rate adjustment type"
            });
        }

        const adjustment = od_rate_adjustment || 0;

        if (isNaN(adjustment) || Number(adjustment) < 0) {
            return res.status(200).json({
                success: 0,
                message: "OD rate adjustment must be a valid non-negative number"
            });
        }

        if (
            adjustmentType === "PERCENTAGE" &&
            Number(adjustment) > 100
        ) {
            return res.status(200).json({
                success: 0,
                message: "Percentage adjustment cannot exceed 100"
            });
        }

        if (slab_code.length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Slab code cannot exceed 50 characters"
            });
        }

        if (slab_name.length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Slab name cannot exceed 150 characters"
            });
        }

        if (description && description.length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }

        const data = {
            slab_code,
            slab_name,
            min_age_months: Number(min_age_months),
            max_age_months:
                max_age_months === undefined ||
                max_age_months === null ||
                max_age_months === ""
                    ? null
                    : Number(max_age_months),
            od_rate_adjustment_type: adjustmentType,
            od_rate_adjustment: Number(adjustment),
            description: description || null
        };

        MotorOdAgeSlabService.updateOdAgeSlab(
            id,
            data,
            (err, result) => {

                if (err) {

                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(200).json({
                            success: 0,
                            message: "Slab code already exists"
                        });
                    }

                    return res.status(500).json({
                        success: 0,
                        message: "Failed to update OD age slab",
                        error: err
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "OD age slab updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteOdAgeSlab: (req, res) => {

        const { id } = req.params;

        MotorOdAgeSlabService.deleteOdAgeSlab(id, (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Failed to delete OD age slab",
                    error: err
                });
            }

            return res.status(200).json({
                success: 1,
                message: "OD age slab deleted successfully",
                data: result
            });
        });
    },


    // GET ACTIVE
    getActiveOdAgeSlabs: (req, res) => {

        MotorOdAgeSlabService.getActiveOdAgeSlabs((err, result) => {

            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Failed to fetch active OD age slabs",
                    error: err
                });
            }

            return res.status(200).json({
                success: 1,
                data: result
            });
        });
    }
};

module.exports = MotorOdAgeSlabController;