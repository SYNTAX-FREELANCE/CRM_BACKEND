// services/Upload.js
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const createUpload = require("../../Middleware/multer");

// C Drive Upload Paths
const AADHAR_UPLOAD_DIR = "C:/uploads/users/aadhar";
const BIODATA_UPLOAD_DIR = "C:/uploads/users/biodata";
const BANK_UPLOAD_DIR = "C:/uploads/users/bank";

// Create upload instances
const uploadAadhar = createUpload(AADHAR_UPLOAD_DIR, ["image/jpeg", "image/png", "application/pdf"], 5);
const uploadBiodata = createUpload(BIODATA_UPLOAD_DIR, ["image/jpeg", "image/png", "application/pdf"], 5);
const uploadBank = createUpload(BANK_UPLOAD_DIR, ["image/jpeg", "image/png", "application/pdf"], 5);

// New Dynamic Storage for C:/CRM/EmployeeDetails/<user_id>/<file_type>/<filename>
const dynamicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { user_id, file_type } = req.query;
        let docFolder = file_type || "others";
        if (docFolder === "bankDetails") docFolder = "bank";
        if (docFolder === "otherUploads") docFolder = "others";

        const dir = `C:/CRM/EmployeeDetails/${user_id || "unknown"}/${docFolder}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Dynamic upload middleware up to 25MB
const uploadDocumentMiddleware = multer({
    storage: dynamicStorage,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25 MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only JPEG, PNG, and PDF files are allowed."), false);
        }
    }
});


/**
 * UPLOAD USER FILES TO C DRIVE
 * Returns file paths - NO DATABASE QUERY HERE
 */
const uploadUserFiles = (req, res) => {
    try {
        const { user_id } = req.body;
        const files = req.files; // { aadhar_files: [...], biodata_files: [...], bank_files: [...] }

        // Validation
        if (!user_id) {
            return res.status(400).json({
                success: 0,
                message: "user_id is required"
            });
        }

        if (!files || (!files.aadhar_files && !files.biodata_files && !files.bank_files)) {
            return res.status(400).json({
                success: 0,
                message: "No files uploaded"
            });
        }

        const uploadedFiles = [];

        // Process Aadhar files
        if (files.aadhar_files) {
            files.aadhar_files.forEach((file) => {
                if (!file.mimetype.startsWith("image/") && file.mimetype !== "application/pdf") return;

                uploadedFiles.push({
                    file_type: "aadhar",
                    file_name: file.originalname,
                    file_path: file.path,
                    file_size: file.size,
                    mime_type: file.mimetype
                });
            });
        }

        // Process Biodata files
        if (files.biodata_files) {
            files.biodata_files.forEach((file) => {
                if (!file.mimetype.startsWith("image/") && file.mimetype !== "application/pdf") return;

                uploadedFiles.push({
                    file_type: "biodata",
                    file_name: file.originalname,
                    file_path: file.path,
                    file_size: file.size,
                    mime_type: file.mimetype
                });
            });
        }

        // Process Bank files
        if (files.bank_files) {
            files.bank_files.forEach((file) => {
                if (!file.mimetype.startsWith("image/") && file.mimetype !== "application/pdf") return;

                uploadedFiles.push({
                    file_type: "bank",
                    file_name: file.originalname,
                    file_path: file.path,
                    file_size: file.size,
                    mime_type: file.mimetype
                });
            });
        }

        return res.status(200).json({
            success: 1,
            message: "Files uploaded successfully",
            count: uploadedFiles.length,
            data: uploadedFiles
        });
    } catch (error) {
        console.error("uploadUserFiles error:", error);
        return res.status(500).json({
            success: 0,
            message: "Something went wrong"
        });
    }
};

/**
 * GET EXISTING FILES FROM C DRIVE
 */
const getExistingFiles = (req, res) => {
    try {
        const { upload_dir } = req.params; // 'aadhar', 'biodata', or 'bank'

        const dirMap = {
            aadhar: AADHAR_UPLOAD_DIR,
            biodata: BIODATA_UPLOAD_DIR,
            bank: BANK_UPLOAD_DIR
        };

        const uploadDir = dirMap[upload_dir];

        if (!uploadDir) {
            return res.status(400).json({
                success: 0,
                message: "Invalid upload_dir. Must be: aadhar, biodata, or bank"
            });
        }

        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                return res.status(500).json({
                    success: 0,
                    message: "Unable to read upload directory"
                });
            }

            const imageFiles = files
                .filter((file) => file.toLowerCase().endsWith(".jpg") ||
                    file.toLowerCase().endsWith(".png") ||
                    file.toLowerCase().endsWith(".pdf"))
                .map((file, index) => ({
                    id: index + 1,
                    name: file,
                    filename: file
                }));

            if (imageFiles.length === 0) {
                return res.status(200).json({
                    success: 2,
                    message: "No files found",
                    data: []
                });
            }

            return res.status(200).json({
                success: 1,
                message: "Files fetched successfully",
                data: imageFiles
            });
        });
    } catch (error) {
        console.error("getExistingFiles error:", error);
        return res.status(500).json({
            success: 0,
            message: "Something went wrong"
        });
    }
};

/**
 * DELETE FILE FROM C DRIVE
 */
const deleteUploadFile = (req, res) => {
    try {
        const { file_path } = req.body;

        if (!file_path) {
            return res.status(400).json({
                success: 0,
                message: "file_path is required"
            });
        }

        // Prevent path traversal attack
        const filePath = path.join(path.dirname(file_path), path.basename(file_path));

        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(404).json({
                    success: 0,
                    message: "File not found"
                });
            }

            res.status(200).json({
                success: 1,
                message: "File deleted successfully"
            });
        });
    } catch (error) {
        console.error("deleteUploadFile error:", error);
        return res.status(500).json({
            success: 0,
            message: "Something went wrong"
        });
    }
};

/**
 * DELETE ALL USER FILES FROM C DRIVE
 */
const deleteAllUserFiles = (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: 0,
                message: "user_id is required"
            });
        }

        let deletedCount = 0;
        const dirs = [AADHAR_UPLOAD_DIR, BIODATA_UPLOAD_DIR, BANK_UPLOAD_DIR];

        dirs.forEach((dir) => {
            fs.readdir(dir, (err, files) => {
                if (err) return;

                files.forEach((file) => {
                    const filePath = path.join(dir, file);
                    fs.unlink(filePath, (err) => {
                        if (!err) deletedCount++;
                    });
                });
            });
        });

        return res.status(200).json({
            success: 1,
            message: "Files deleted from C drive",
            count: deletedCount
        });
    } catch (error) {
        console.error("deleteAllUserFiles error:", error);
        return res.status(500).json({
            success: 0,
            message: "Something went wrong"
        });
    }
};

module.exports = {
    uploadUserFiles,
    getExistingFiles,
    deleteUploadFile,
    deleteAllUserFiles,
    uploadAadhar,
    uploadBiodata,
    uploadBank,
    uploadDocumentMiddleware
};