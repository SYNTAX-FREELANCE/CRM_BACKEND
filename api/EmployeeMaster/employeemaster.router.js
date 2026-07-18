// routes/userCreation.routes.js
const express = require("express");
const router = express.Router();
const userCreationController = require("../EmployeeMaster/employeemaster.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");
const multer = require("multer");
const uploadMemory = multer({ storage: multer.memoryStorage() });
const {
    uploadAadhar,
    uploadBiodata,
    uploadBank,
    uploadUserFiles,
    getExistingFiles,
    deleteUploadFile,
    deleteAllUserFiles,
    uploadDocumentMiddleware
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

// Upload single or multiple documents (dynamic destination & size limits)
router.post(
    "/upload-document",
    verifyAccessToken,
    uploadDocumentMiddleware.array("files"),
    userCreationController.uploadDocument
);

// Delete file by fileId (C drive + database soft-delete)
router.delete("/delete-file/:fileId", verifyAccessToken, userCreationController.deleteUserFile);

// View file securely by fileId (Sends file directly)
router.get("/view-file/:fileId", verifyAccessToken, userCreationController.viewFile);

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

// Upload profile photo
router.post(
    "/upload-profile-photo",
    verifyAccessToken,
    uploadMemory.single("photo"),
    userCreationController.uploadProfilePhoto
);

// Get profile photo
router.get(
    "/profile-photo/:userId",
    verifyAccessToken,
    userCreationController.getProfilePhoto
);


module.exports = router;