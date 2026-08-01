const express = require("express");
const router = express.Router();

const employeeTargetController = require("./employeeTarget.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

// Create
router.post(
    "/create",
    verifyAccessToken,
    employeeTargetController.createTarget
);

// Get All
router.get(
    "/getall",
    verifyAccessToken,
    employeeTargetController.getAllTargets
);

// Get By Id
router.get(
    "/getbyid/:targetId",
    verifyAccessToken,
    employeeTargetController.getTargetById
);

// Update
router.patch(
    "/update/:targetId",
    verifyAccessToken,
    employeeTargetController.updateTarget
);

// Delete
router.delete(
    "/delete/:targetId",
    verifyAccessToken,
    employeeTargetController.deleteTarget
);

// Active
router.get(
    "/get-active",
    verifyAccessToken,
    employeeTargetController.getActiveTargets
);

router.get(
    "/current/:empid",
    verifyAccessToken,
    employeeTargetController.getCurrentEmployeeTarget
);




module.exports = router;