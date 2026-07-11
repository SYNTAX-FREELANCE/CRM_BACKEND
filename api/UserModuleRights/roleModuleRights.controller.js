const roleModuleRightsService = require("./roleModuleRights.service");

module.exports = {

    getRoleModuleRights: (req, res) => {
        const { roleId } = req.params;

        if (!roleId) {
            return res.status(200).json({
                success: 0,
                message: "Role Id Requiered"
            });
        }
        roleModuleRightsService.getRoleModuleRights(roleId, (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Database Error"
                });
            }
            return res.json({
                success: 1,
                data: results
            });

        });

    },

    getActiveRoleModuleRights: (req, res) => {
        const { roleId } = req.params;

        if (!roleId) {
            return res.status(200).json({
                success: 0,
                message: "Role Id Requiered"
            });
        }
        roleModuleRightsService.activeRoleModuleRights(roleId, (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Database Error"
                });
            }
            return res.json({
                success: 1,
                data: results
            });

        });

    },


    saveRoleModuleRights: (req, res) => {

        const { role_id, module_id, status, created_user } = req.body;

        if (!role_id || !module_id) {
            return res.status(200).json({
                success: 0,
                message: "Role and Module are required"
            });
        }

        roleModuleRightsService.saveRoleModuleRights(
            {
                role_id,
                module_id,
                status,
                created_user
            },
            (err, results) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Failed to save module rights"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Module right updated successfully"
                });

            }
        );

    },
};