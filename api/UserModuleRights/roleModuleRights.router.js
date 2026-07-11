const express = require("express");
const router = express.Router();

const roleModuleRightsController = require("./roleModuleRights.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// Get existing module rights for a role
router.get(
    "/:roleId",
    verifyAccessToken,
    roleModuleRightsController.getRoleModuleRights
);

router.get(
    "/active/:roleId",
    verifyAccessToken,
    roleModuleRightsController.getActiveRoleModuleRights
);


// Save module rights
router.post(
    "/save",
    verifyAccessToken,
    roleModuleRightsController.saveRoleModuleRights
);

module.exports = router;