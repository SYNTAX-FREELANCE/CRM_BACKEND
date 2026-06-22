// controllers/menuMaster.controller.js
const menuMasterService = require("./menuMaster.service");

module.exports = {
    // ==================== CREATE MENU ====================
    createMenu: (req, res) => {
        try {
            const { menu_name, menuName, module_id, moduleId, submodule_id, submoduleId, isActive, is_active } = req.body;
            const finalMenuName = menu_name || menuName;
            const finalModuleId = module_id || moduleId;
            const finalSubmoduleId = submodule_id || submoduleId;
            const finalIsActive = (isActive !== undefined) ? isActive : is_active;

            // Validation
            if (!finalMenuName || finalMenuName.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Menu name is required"
                });
            }

            if (!finalModuleId) {
                return res.status(200).json({
                    success: 0,
                    message: "Module is required"
                });
            }

            // Prepare menu data
            const menuData = {
                menu_name: finalMenuName.trim(),
                module_id: finalModuleId,
                submodule_id: finalSubmoduleId || null,
                is_active: finalIsActive !== undefined ? finalIsActive : 1,
                created_user: req.user ? req.user.id : null
            };

            menuMasterService.createMenu(menuData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while creating menu"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Menu created successfully",
                    data: {
                        menu_id: result.insertId,
                        menu_name: menuData.menu_name
                    }
                });
            });
        } catch (error) {
            console.error("createMenu error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ALL MENUS ====================
    getAllMenus: (req, res) => {
        try {
            menuMasterService.getAllMenus((err, menus) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Menus retrieved successfully",
                    data: menus
                });
            });
        } catch (error) {
            console.error("getAllMenus error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET MENU BY ID ====================
    getMenuById: (req, res) => {
        try {
            const { menuId } = req.params;

            menuMasterService.getMenuById(menuId, (err, menu) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                if (!menu) {
                    return res.status(200).json({
                        success: 0,
                        message: "Menu not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Menu retrieved successfully",
                    data: menu
                });
            });
        } catch (error) {
            console.error("getMenuById error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== UPDATE MENU ====================
    updateMenu: (req, res) => {
        try {
            const { menuId } = req.params;
            const { menu_name, menuName, module_id, moduleId, submodule_id, submoduleId, isActive, is_active } = req.body;
            const finalMenuName = menu_name || menuName;
            const finalModuleId = module_id || moduleId;
            const finalSubmoduleId = submodule_id || submoduleId;
            const finalIsActive = (isActive !== undefined) ? isActive : is_active;

            // Validation
            if (!finalMenuName || finalMenuName.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Menu name is required"
                });
            }

            if (!finalModuleId) {
                return res.status(200).json({
                    success: 0,
                    message: "Module is required"
                });
            }

            const menuData = {
                menu_name: finalMenuName.trim(),
                module_id: finalModuleId,
                submodule_id: finalSubmoduleId || null,
                is_active: finalIsActive !== undefined ? finalIsActive : 1,
                updated_user: req.user ? req.user.id : null
            };

            menuMasterService.updateMenu(menuId, menuData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while updating menu"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Menu updated successfully",
                    data: { menu_id: menuId }
                });
            });
        } catch (error) {
            console.error("updateMenu error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== DELETE MENU (SOFT DELETE) ====================
    deleteMenu: (req, res) => {
        try {
            const { menuId } = req.params;

            menuMasterService.deleteMenu(menuId, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while deleting menu"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Menu deleted successfully"
                });
            });
        } catch (error) {
            console.error("deleteMenu error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ACTIVE MENUS ONLY ====================
    getActiveMenus: (req, res) => {
        try {
            menuMasterService.getActiveMenus((err, menus) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Active menus retrieved successfully",
                    data: menus
                });
            });
        } catch (error) {
            console.error("getActiveMenus error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    }
};
