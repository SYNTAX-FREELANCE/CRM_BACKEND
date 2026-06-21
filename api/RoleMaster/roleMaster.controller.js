// controllers/roleMaster.controller.js
const roleMasterService = require("../RoleMaster/roleMaster.service");

module.exports = {
    // ==================== CREATE ROLE ====================
    createRole: (req, res) => {
        try {
            const { role_name, role_description, is_default,alias ,isActive} = req.body;

            // Validation
            if (!role_name || role_name.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Role name is required"
                });
            }

            // Prepare role data
            const roleData = {
                role_name: role_name.trim(),
                role_description: role_description || null,
                alias: alias ,
                is_active: isActive
            };

            // Step 1: Create role in role_master table
            roleMasterService.createRole(roleData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while creating role"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Role created successfully",
                    data: {
                        role_id: result.insertId,
                        role_name: roleData.role_name,
                        role_description: roleData.role_description
                    }
                });
            });
        } catch (error) {
            console.error("createRole error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ALL ROLES ====================
    getAllRoles: (req, res) => {
        try {
            roleMasterService.getAllRoles((err, roles) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Roles retrieved successfully",
                    data: roles
                });
            });
        } catch (error) {
            console.error("getAllRoles error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ROLE BY ID ====================
    getRoleById: (req, res) => {
        try {
            const { roleId } = req.params;

            roleMasterService.getRoleById(roleId, (err, role) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                if (!role) {
                    return res.status(200).json({
                        success: 0,
                        message: "Role not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Role retrieved successfully",
                    data: role
                });
            });
        } catch (error) {
            console.error("getRoleById error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== UPDATE ROLE ====================
    updateRole: (req, res) => {
        try {
            const { roleId } = req.params;
            const { role_name, role_description, alias ,isActive} = req.body;

            // Validation
            if (!role_name || role_name.trim() === "") {
                return res.status(400).json({
                    success: 0,
                    message: "Role name is required"
                });
            }

            const roleData = {
                role_name: role_name.trim(),
                role_description: role_description || null,
                alias: alias ,
                is_active: isActive
            };

            roleMasterService.updateRole(roleId, roleData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while updating role"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Role updated successfully",
                    data: { role_id: roleId }
                });
            });
        } catch (error) {
            console.error("updateRole error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== DELETE ROLE (SOFT DELETE) ====================
    deleteRole: (req, res) => {
        try {
            const { roleId } = req.params;

            roleMasterService.deleteRole(roleId, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while deleting role"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Role deleted successfully"
                });
            });
        } catch (error) {
            console.error("deleteRole error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ACTIVE ROLES ONLY ====================
    getActiveRoles: (req, res) => {
        try {
            roleMasterService.getActiveRoles((err, roles) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Active roles retrieved successfully",
                    data: roles
                });
            });
        } catch (error) {
            console.error("getActiveRoles error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    }
};