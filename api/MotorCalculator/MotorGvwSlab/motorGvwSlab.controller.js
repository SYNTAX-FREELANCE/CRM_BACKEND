const MotorGvwSlabService = require("./motorGvwSlab.service");

const MotorGvwSlabController = {

    // CREATE
    createGvwSlab: (req, res) => {

        const {
            slab_code,
            slab_name,
            min_gvw,
            max_gvw,
            description
        } = req.body;

        if (!slab_code || !slab_code.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Slab code is required"
            });
        }

        if (slab_code.trim().length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Slab code cannot exceed 50 characters"
            });
        }

        if (!slab_name || !slab_name.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Slab name is required"
            });
        }

        if (slab_name.trim().length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Slab name cannot exceed 150 characters"
            });
        }

        if (
            min_gvw === undefined ||
            min_gvw === null ||
            min_gvw === "" ||
            isNaN(min_gvw)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Minimum GVW is required and must be numeric"
            });
        }

        if (Number(min_gvw) < 0) {
            return res.status(200).json({
                success: 0,
                message: "Minimum GVW cannot be negative"
            });
        }

        if (
            max_gvw !== undefined &&
            max_gvw !== null &&
            max_gvw !== "" &&
            isNaN(max_gvw)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Maximum GVW must be numeric"
            });
        }

        if (
            max_gvw !== undefined &&
            max_gvw !== null &&
            max_gvw !== "" &&
            Number(max_gvw) < Number(min_gvw)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Maximum GVW cannot be less than minimum GVW"
            });
        }

        if (description && description.trim().length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }

        const data = {
            slab_code: slab_code.trim(),
            slab_name: slab_name.trim(),
            min_gvw: Number(min_gvw),
            max_gvw:
                max_gvw === undefined ||
                max_gvw === null ||
                max_gvw === ""
                    ? null
                    : Number(max_gvw),
            description:
                description && description.trim()
                    ? description.trim()
                    : null
        };

        MotorGvwSlabService.createGvwSlab(data, (err, result) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(200).json({
                        success: 0,
                        message: "Slab code already exists"
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
                message: "GVW slab created successfully",
                data: result
            });
        });
    },


    // GET ALL
    getAllGvwSlabs: (req, res) => {

        MotorGvwSlabService.getAllGvwSlabs((err, result) => {

            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Database error",
                    error: err
                });
            }

            return res.status(200).json({
                success: 1,
                message: "GVW slabs fetched successfully",
                data: result
            });
        });
    },


    // GET BY ID
    getGvwSlabById: (req, res) => {

        const { gvwSlabId } = req.params;

        MotorGvwSlabService.getGvwSlabById(gvwSlabId, (err, result) => {

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
                    message: "GVW slab not found"
                });
            }

            return res.status(200).json({
                success: 1,
                message: "GVW slab fetched successfully",
                data: result[0]
            });
        });
    },


    // UPDATE
    updateGvwSlab: (req, res) => {

        const { gvwSlabId } = req.params;

        const {
            slab_code,
            slab_name,
            min_gvw,
            max_gvw,
            description
        } = req.body;

        if (!slab_code || !slab_code.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Slab code is required"
            });
        }

        if (slab_code.trim().length > 50) {
            return res.status(200).json({
                success: 0,
                message: "Slab code cannot exceed 50 characters"
            });
        }

        if (!slab_name || !slab_name.trim()) {
            return res.status(200).json({
                success: 0,
                message: "Slab name is required"
            });
        }

        if (slab_name.trim().length > 150) {
            return res.status(200).json({
                success: 0,
                message: "Slab name cannot exceed 150 characters"
            });
        }

        if (
            min_gvw === undefined ||
            min_gvw === null ||
            min_gvw === "" ||
            isNaN(min_gvw)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Minimum GVW is required and must be numeric"
            });
        }

        if (Number(min_gvw) < 0) {
            return res.status(200).json({
                success: 0,
                message: "Minimum GVW cannot be negative"
            });
        }

        if (
            max_gvw !== undefined &&
            max_gvw !== null &&
            max_gvw !== "" &&
            isNaN(max_gvw)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Maximum GVW must be numeric"
            });
        }

        if (
            max_gvw !== undefined &&
            max_gvw !== null &&
            max_gvw !== "" &&
            Number(max_gvw) < Number(min_gvw)
        ) {
            return res.status(200).json({
                success: 0,
                message: "Maximum GVW cannot be less than minimum GVW"
            });
        }

        if (description && description.trim().length > 500) {
            return res.status(200).json({
                success: 0,
                message: "Description cannot exceed 500 characters"
            });
        }

        const data = {
            slab_code: slab_code.trim(),
            slab_name: slab_name.trim(),
            min_gvw: Number(min_gvw),
            max_gvw:
                max_gvw === undefined ||
                max_gvw === null ||
                max_gvw === ""
                    ? null
                    : Number(max_gvw),
            description:
                description && description.trim()
                    ? description.trim()
                    : null
        };

        MotorGvwSlabService.updateGvwSlab(
            gvwSlabId,
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
                        message: "Database error",
                        error: err
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "GVW slab not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "GVW slab updated successfully",
                    data: result
                });
            }
        );
    },


    // DELETE
    deleteGvwSlab: (req, res) => {

        const { gvwSlabId } = req.params;

        MotorGvwSlabService.deleteGvwSlab(
            gvwSlabId,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Database error",
                        error: err
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(200).json({
                        success: 0,
                        message: "GVW slab not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "GVW slab deleted successfully",
                    data: result
                });
            }
        );
    },


    // GET ACTIVE
    getActiveGvwSlabs: (req, res) => {

        MotorGvwSlabService.getActiveGvwSlabs((err, result) => {

            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Database error",
                    error: err
                });
            }

            return res.status(200).json({
                success: 1,
                message: "Active GVW slabs fetched successfully",
                data: result
            });
        });
    }
};

module.exports = MotorGvwSlabController;