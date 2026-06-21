// controllers/moduleMaster.controller.js
const moduleMasterService = require("./moduleMaster.service");

module.exports = {
    // ==================== CREATE MODULE ====================
    createModule: (req, res) => {
        try {
            const { module_name, moduleName, isActive, is_active } = req.body;
            const finalModuleName = module_name || moduleName;
            const finalIsActive = (isActive !== undefined) ? isActive : is_active;

            // Validation
            if (!finalModuleName || finalModuleName.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Module name is required"
                });
            }

            // Prepare module data
            const moduleData = {
                module_name: finalModuleName.trim(),
                is_active: finalIsActive !== undefined ? finalIsActive : 1, // default to active if not specified
                created_user: req.user ? req.user.id : null
            };

            moduleMasterService.createModule(moduleData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while creating module"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Module created successfully",
                    data: {
                        module_id: result.insertId,
                        module_name: moduleData.module_name
                    }
                });
            });
        } catch (error) {
            console.error("createModule error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ALL MODULES ====================
    getAllModules: (req, res) => {
        try {
            moduleMasterService.getAllModules((err, modules) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Modules retrieved successfully",
                    data: modules
                });
            });
        } catch (error) {
            console.error("getAllModules error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET MODULE BY ID ====================
    getModuleById: (req, res) => {
        try {
            const { moduleId } = req.params;

            moduleMasterService.getModuleById(moduleId, (err, module) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                if (!module) {
                    return res.status(200).json({
                        success: 0,
                        message: "Module not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Module retrieved successfully",
                    data: module
                });
            });
        } catch (error) {
            console.error("getModuleById error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== UPDATE MODULE ====================
    updateModule: (req, res) => {
        try {
            const { moduleId } = req.params;
            const { module_name, moduleName, isActive, is_active } = req.body;
            const finalModuleName = module_name || moduleName;
            const finalIsActive = (isActive !== undefined) ? isActive : is_active;

            // Validation
            if (!finalModuleName || finalModuleName.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Module name is required"
                });
            }

            const moduleData = {
                module_name: finalModuleName.trim(),
                is_active: finalIsActive !== undefined ? finalIsActive : 1,
                edited_user: req.user ? req.user.id : null
            };

            moduleMasterService.updateModule(moduleId, moduleData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while updating module"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Module updated successfully",
                    data: { module_id: moduleId }
                });
            });
        } catch (error) {
            console.error("updateModule error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== DELETE MODULE (SOFT DELETE) ====================
    deleteModule: (req, res) => {
        try {
            const { moduleId } = req.params;

            moduleMasterService.deleteModule(moduleId, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while deleting module"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Module deleted successfully"
                });
            });
        } catch (error) {
            console.error("deleteModule error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ACTIVE MODULES ONLY ====================
    getActiveModules: (req, res) => {
        try {
            moduleMasterService.getActiveModules((err, modules) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Active modules retrieved successfully",
                    data: modules
                });
            });
        } catch (error) {
            console.error("getActiveModules error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    }
};
