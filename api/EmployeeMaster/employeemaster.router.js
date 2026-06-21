// routes/userCreation.routes.js
const express = require("express");
const router = express.Router();
const userCreationController = require("../EmployeeMaster/employeemaster.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");
const {
    uploadAadhar,
    uploadBiodata,
    uploadBank,
    uploadUserFiles,
    getExistingFiles,
    deleteUploadFile,
    deleteAllUserFiles
} = require("../EmployeeMaster/employeemaster.upload");

// ==================== USER CREATION ROUTES ====================

// Create user with files
router.post(
    "/create",
    verifyAccessToken,
    uploadAadhar.fields("aadhar_files"),
    uploadBiodata.fields("biodata_files"),
    uploadBank.fields("bank_files"),
    userCreationController.createUser
);

// Get all users
router.get("/getall", verifyAccessToken, userCreationController.getAllUsers);

// Get user by ID
router.get("/getbyid/:userId", verifyAccessToken, userCreationController.getUserById);

// Update user
router.patch(
    "/update/:userId",
    verifyAccessToken,
    uploadAadhar.fields("aadhar_files"),
    uploadBiodata.fields("biodata_files"),
    uploadBank.fields("bank_files"),
    userCreationController.updateUser
);

// Delete user (soft delete)
router.delete("/delete/:userId", verifyAccessToken, userCreationController.deleteUser);

// ==================== FILE UPLOAD ROUTES ====================

// Upload files separately (user already exists)
router.post(
    "/upload-files",
    verifyAccessToken,
    uploadAadhar.fields("aadhar_files"),
    uploadBiodata.fields("biodata_files"),
    uploadBank.fields("bank_files"),
    uploadUserFiles
);

// Get all user files from database
router.get("/get-files/:user_id", verifyAccessToken, userCreationController.getUserFiles);

// Get existing files from C drive (by type)
router.get("/existing-files/:upload_dir", verifyAccessToken, getExistingFiles);

// Delete single file (C drive + database)
router.delete("/delete-file", verifyAccessToken, deleteUploadFile);

// Delete all user files (C drive + database)
router.delete("/delete-all-files", verifyAccessToken, deleteAllUserFiles);

module.exports = router;