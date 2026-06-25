// controllers/userRights.controller.js
const userRightsService = require("./userRights.service");

module.exports = {
  // 1. Get all active menus under a selected module
  getMenusByModule: (req, res) => {
    const { moduleId } = req.params;
    if (!moduleId) {
      return res.status(400).json({
        success: 0,
        message: "Module ID is required",
      });
    }

    userRightsService.getMenusByModule(moduleId, (err, results) => {
      if (err) {
        console.error("getMenusByModule error:", err);
        return res.status(500).json({
          success: 0,
          message: "Failed to retrieve menus",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

  // 2. Get existing rights for role + module
  getExistingRights: (req, res) => {
    const { roleId, moduleId } = req.params;
    if (!roleId || !moduleId) {
      return res.status(400).json({
        success: 0,
        message: "Role ID and Module ID are required",
      });
    }

    userRightsService.getExistingUserRights(roleId, moduleId, (err, results) => {
      if (err) {
        console.error("getExistingRights error:", err);
        return res.status(500).json({
          success: 0,
          message: "Failed to retrieve existing rights",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },

  // 3. Save selected rights for multiple menus
  saveRights: (req, res) => {
    const { role_slno, module_slno, rights } = req.body;
    const userId = req.user ? req.user.id : 0;

    if (!role_slno || !module_slno || !Array.isArray(rights)) {
      return res.status(400).json({
        success: 0,
        message: "role_slno, module_slno, and rights array are required",
      });
    }

    // Filter to keep only the selected (checked) menus
    const selectedMenus = rights.filter(r => parseInt(r.Active_status) === 1);

    userRightsService.saveUserRights(role_slno, module_slno, selectedMenus, userId, (err, result) => {
      if (err) {
        console.error("saveRights error:", err);
        return res.status(500).json({
          success: 0,
          message: "Something went wrong while saving user rights",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Rights configured successfully",
        data: result,
      });
    });
  },

  // 4. Get allowed menus for the logged-in user by roleId
  getAllowedMenus: (req, res) => {
    const { roleId } = req.params;

    if (!roleId) {
      return res.status(400).json({
        success: 0,
        message: "Role ID is required",
      });
    }

    userRightsService.getAllowedMenusForRole(roleId, (err, results) => {
      if (err) {
        console.error("getAllowedMenus error:", err);
        return res.status(500).json({
          success: 0,
          message: "Failed to retrieve allowed menus",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
};

