// controllers/submoduleMaster.controller.js
const submoduleMasterService = require("./submoduleMaster.service");

module.exports = {
    // ==================== CREATE SUBMODULE ====================
    createSubmodule: (req, res) => {
        try {
            const { submodule_name, submoduleName, module_id, moduleId, isActive, is_active } = req.body;
            const finalSubmoduleName = submodule_name || submoduleName;
            const finalModuleId = module_id || moduleId;
            const finalIsActive = (isActive !== undefined) ? isActive : is_active;

            // Validation
            if (!finalSubmoduleName || finalSubmoduleName.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Submodule name is required"
                });
            }

            if (!finalModuleId) {
                return res.status(200).json({
                    success: 0,
                    message: "Module is required"
                });
            }

            // Prepare submodule data
            const submoduleData = {
                submodule_name: finalSubmoduleName.trim(),
                module_id: finalModuleId,
                is_active: finalIsActive !== undefined ? finalIsActive : 1,
                created_user: req.user ? req.user.id : null
            };

            submoduleMasterService.createSubmodule(submoduleData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while creating submodule"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Submodule created successfully",
                    data: {
                        submodule_id: result.insertId,
                        submodule_name: submoduleData.submodule_name
                    }
                });
            });
        } catch (error) {
            console.error("createSubmodule error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ALL SUBMODULES ====================
    getAllSubmodules: (req, res) => {
        try {
            submoduleMasterService.getAllSubmodules((err, submodules) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Submodules retrieved successfully",
                    data: submodules
                });
            });
        } catch (error) {
            console.error("getAllSubmodules error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET SUBMODULE BY ID ====================
    getSubmoduleById: (req, res) => {
        try {
            const { submoduleId } = req.params;

            submoduleMasterService.getSubmoduleById(submoduleId, (err, submodule) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                if (!submodule) {
                    return res.status(200).json({
                        success: 0,
                        message: "Submodule not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Submodule retrieved successfully",
                    data: submodule
                });
            });
        } catch (error) {
            console.error("getSubmoduleById error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== UPDATE SUBMODULE ====================
    updateSubmodule: (req, res) => {
        try {
            const { submoduleId } = req.params;
            const { submodule_name, submoduleName, module_id, moduleId, isActive, is_active } = req.body;
            const finalSubmoduleName = submodule_name || submoduleName;
            const finalModuleId = module_id || moduleId;
            const finalIsActive = (isActive !== undefined) ? isActive : is_active;

            // Validation
            if (!finalSubmoduleName || finalSubmoduleName.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Submodule name is required"
                });
            }

            if (!finalModuleId) {
                return res.status(200).json({
                    success: 0,
                    message: "Module is required"
                });
            }

            const submoduleData = {
                submodule_name: finalSubmoduleName.trim(),
                module_id: finalModuleId,
                is_active: finalIsActive !== undefined ? finalIsActive : 1,
                updated_user: req.user ? req.user.id : null
            };

            submoduleMasterService.updateSubmodule(submoduleId, submoduleData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while updating submodule"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Submodule updated successfully",
                    data: { submodule_id: submoduleId }
                });
            });
        } catch (error) {
            console.error("updateSubmodule error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== DELETE SUBMODULE (SOFT DELETE) ====================
    deleteSubmodule: (req, res) => {
        try {
            const { submoduleId } = req.params;

            submoduleMasterService.deleteSubmodule(submoduleId, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while deleting submodule"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Submodule deleted successfully"
                });
            });
        } catch (error) {
            console.error("deleteSubmodule error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ACTIVE SUBMODULES ONLY ====================
    getActiveSubmodules: (req, res) => {
        try {
            submoduleMasterService.getActiveSubmodules((err, submodules) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Active submodules retrieved successfully",
                    data: submodules
                });
            });
        } catch (error) {
            console.error("getActiveSubmodules error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    }
};
