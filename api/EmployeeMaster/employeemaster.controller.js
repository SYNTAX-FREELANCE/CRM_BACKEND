// controllers/userCreation.controller.js
const fs = require("fs");
const path = require("path");
const userCreationService = require("../EmployeeMaster/employeemaster.service");
const {
  uploadUserFiles,
  deleteUploadFile,
  deleteAllUserFiles,
} = require("../EmployeeMaster/employeemaster.upload");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateTokens,
  generateAccessToken,
} = require("../../Middleware/generateTokens");

module.exports = {
  // ==================== CREATE USER WITH FILES ====================
  createUser: (req, res) => {
    try {
      const {
        name,
        age,
        gender,
        qualification_id,
        date_of_join,
        experience,
        mobile_number_1,
        mobile_number_2,
        aadhar_number,
        company_id,
        role_id,
        user_status,
        is_active,
        dob,
        email,
        address,
      } = req.body;

      // Validation
      if (!name || !mobile_number_1) {
        return res.status(400).json({
          success: 0,
          message: "Name and Mobile Number are required",
        });
      }

      // Prepare user data
      const userData = {
        name: name,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        qualification_id: qualification_id,
        date_of_join: date_of_join || null,
        experience: experience || null,
        mobile_number_1: mobile_number_1,
        mobile_number_2: mobile_number_2 || null,
        aadhar_number: aadhar_number || null,
        company_id: company_id,
        role_id: role_id,
        user_status: user_status,
        is_active: is_active,
        dob: dob || null,
        email: email ? email.trim() : null,
        address: address ? address.trim() : null,
      };

      // Step 1: Create user in users_master + users table (creates auth account)
      userCreationService.createUserWithAuth(userData, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong while creating user",
          });
        }

        const userId = result.insertId;

        // Step 2: Get uploaded files (Multer already saved to C drive)
        const files = req.files;
        const uploadedFileData = [];

        // Process Aadhar files
        if (files?.aadhar_files) {
          files.aadhar_files.forEach((file) => {
            uploadedFileData.push({
              user_id: userId,
              file_type: "aadhar",
              file_name: file.originalname,
              file_path: file.path,
              file_size: file.size,
              mime_type: file.mimetype,
            });
          });
        }

        // Process Biodata files
        if (files?.biodata_files) {
          files.biodata_files.forEach((file) => {
            uploadedFileData.push({
              user_id: userId,
              file_type: "biodata",
              file_name: file.originalname,
              file_path: file.path,
              file_size: file.size,
              mime_type: file.mimetype,
            });
          });
        }

        // Process Bank files
        if (files?.bank_files) {
          files.bank_files.forEach((file) => {
            uploadedFileData.push({
              user_id: userId,
              file_type: "bank",
              file_name: file.originalname,
              file_path: file.path,
              file_size: file.size,
              mime_type: file.mimetype,
            });
          });
        }

        // Step 3: Insert file data into user_files table
        if (uploadedFileData?.length > 0) {
          userCreationService.insertUserFiles(
            uploadedFileData,
            (err, fileResult) => {
              if (err) {
                console.error("File insert error:", err);
              }
            },
          );
        }

        //  Step 4: Return user info (NO TOKENS - employee will login separately)
        // Password is auto-generated as username (lowercase)
        return res.status(200).json({
          success: 1,
          message:
            "User created successfully. Employee can login with username as password.",
          user: {
            id: userId,
            employee_id: userData.employee_id,
            name: userData.name,
            mobile: userData.mobile_number_1,
            username: name.toLowerCase().replace(/\s+/g, "_"),
            // IMPORTANT: Tell admin the password is the username
            password_note:
              "Password is auto-generated as username (lowercase name)",
          },
        });
      });
    } catch (error) {
      console.error("createUser error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
  // ==================== GET ALL USERS ====================
  getAllUsers: (req, res) => {
    try {
      userCreationService.getAllUsers((err, users) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Users retrieved successfully",
          data: users,
        });
      });
    } catch (error) {
      console.error("getAllUsers error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  // ==================== GET USER BY ID ====================
  getUserById: (req, res) => {
    try {
      const { userId } = req.params;

      userCreationService.getUserById(userId, (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        if (!user) {
          return res.status(404).json({
            success: 0,
            message: "User not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "User retrieved successfully",
          data: user,
        });
      });
    } catch (error) {
      console.error("getUserById error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  // ==================== UPDATE USER ====================
  updateUser: (req, res) => {
    try {
      const { userId } = req.params;
      const {
        name,
        age,
        gender,
        qualification_id,
        date_of_join,
        experience,
        mobile_number_1,
        mobile_number_2,
        aadhar_number,
        company_id,
        role_id,
        user_status,
        is_active,
        dob,
        email,
        address,
      } = req.body;

      // Validation
      if (!name || !mobile_number_1) {
        return res.status(400).json({
          success: 0,
          message: "Name and Mobile Number are required",
        });
      }
      console.log("gender::", gender);

      // Prepare user data
      const userData = {
        name: name,
        age: age ? parseInt(age) : null,
        gender: gender || null,
        qualification_id: qualification_id || null,
        date_of_join: date_of_join || null,
        experience: experience || null,
        mobile_number_1: mobile_number_1,
        mobile_number_2: mobile_number_2 || null,
        aadhar_number: aadhar_number || null,
        company_id: company_id || null,
        role_id: role_id || null,
        user_status: user_status,
        is_active: is_active,
        dob: dob || null,
        email: email ? email.trim() : null,
        address: address ? address.trim() : null,
      };

      // Step 1: Update user in users_master
      userCreationService.updateUser(userId, userData, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong while updating user",
          });
        }

        // Step 2: Handle new file uploads
        const files = req.files;
        const uploadedFileData = [];

        // Process Aadhar files
        if (files?.aadhar_files) {
          files.aadhar_files.forEach((file) => {
            uploadedFileData.push({
              user_id: userId,
              file_type: "aadhar",
              file_name: file.originalname,
              file_path: file.path,
              file_size: file.size,
              mime_type: file.mimetype,
            });
          });
        }

        // Process Biodata files
        if (files?.biodata_files) {
          files.biodata_files.forEach((file) => {
            uploadedFileData.push({
              user_id: userId,
              file_type: "biodata",
              file_name: file.originalname,
              file_path: file.path,
              file_size: file.size,
              mime_type: file.mimetype,
            });
          });
        }

        // Process Bank files
        if (files?.bank_files) {
          files.bank_files.forEach((file) => {
            uploadedFileData.push({
              user_id: userId,
              file_type: "bank",
              file_name: file.originalname,
              file_path: file.path,
              file_size: file.size,
              mime_type: file.mimetype,
            });
          });
        }

        // Step 3: Insert file data into user_files table
        if (uploadedFileData?.length > 0) {
          userCreationService.insertUserFiles(
            uploadedFileData,
            (err, fileResult) => {
              if (err) {
                console.error("File insert error:", err);
              }
            },
          );
        }

        // Step 4: Return updated user info
        return res.status(200).json({
          success: 1,
          message: "User updated successfully",
          user: {
            id: userId,
            employee_id: userData.employee_id,
            name: userData.name,
            mobile: userData.mobile_number_1,
          },
        });
      });
    } catch (error) {
      console.error("updateUser error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  // ==================== GET USER FILES ====================
  getUserFiles: (req, res) => {
    try {
      const { user_id } = req.params;

      userCreationService.getUserFiles(user_id, (err, files) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Files fetched successfully",
          data: files,
        });
      });
    } catch (error) {
      console.error("getUserFiles error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  // ==================== UPLOAD DOCUMENTS ====================
  uploadDocument: (req, res) => {
    try {
      const { user_id, file_type } = req.query;
      const files = req.files; // Array of files

      if (!user_id) {
        return res.status(400).json({
          success: 0,
          message: "user_id is required"
        });
      }

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: 0,
          message: "No files uploaded"
        });
      }

      const insertPromises = files.map(file => {
        const fileData = {
          user_id: user_id,
          file_type: file_type || "others",
          file_name: file.originalname,
          file_path: file.path,
          file_size: file.size,
          mime_type: file.mimetype
        };

        return new Promise((resolve, reject) => {
          userCreationService.insertSingleFile(fileData, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                file_id: result.insertId,
                ...fileData
              });
            }
          });
        });
      });

      Promise.all(insertPromises)
        .then(insertedFiles => {
          return res.status(200).json({
            success: 1,
            message: "Documents uploaded successfully",
            data: insertedFiles
          });
        })
        .catch(err => {
          console.error("Multiple file insert error:", err);
          return res.status(500).json({
            success: 0,
            message: "Failed to save file details in database"
          });
        });
    } catch (error) {
      console.error("uploadDocument error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong"
      });
    }
  },

  // ==================== DELETE USER FILE ====================
  deleteUserFile: (req, res) => {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return res.status(400).json({
          success: 0,
          message: "fileId parameter is required"
        });
      }

      // 1. Get file path from DB
      userCreationService.getFileById(fileId, (err, file) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong"
          });
        }
        if (!file) {
          return res.status(404).json({
            success: 0,
            message: "File not found"
          });
        }

        // 2. Mark file as inactive in DB (DO NOT delete file from disk)
        userCreationService.deactivateFile(fileId, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              success: 0,
              message: "Failed to update database record"
            });
          }
          return res.status(200).json({
            success: 1,
            message: "File deleted successfully"
          });
        });
      });
    } catch (error) {
      console.error("deleteUserFile error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong"
      });
    }
  },

  // ==================== VIEW USER FILE ====================
  viewFile: (req, res) => {
    try {
      const { fileId } = req.params;

      if (!fileId) {
        return res.status(400).json({
          success: 0,
          message: "fileId parameter is required"
        });
      }

      userCreationService.getFileById(fileId, (err, file) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong"
          });
        }
        if (!file) {
          return res.status(404).json({
            success: 0,
            message: "File not found"
          });
        }

        // Check if file exists on disk
        const fs = require("fs");
        if (!fs.existsSync(file.file_path)) {
          return res.status(404).json({
            success: 0,
            message: "File does not exist on C drive disk"
          });
        }

        // Send the file directly
        return res.sendFile(file.file_path);
      });
    } catch (error) {
      console.error("viewFile error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong"
      });
    }
  },

  // ==================== GET MEDICAL DOC FILE ====================
  getMedicalDocFile: (req, res) => {
    const id = req.query.id || req.params.id;
    const filename = req.query.filename;
    if (!id || !filename) {
      return res.status(400).json({ success: 0, message: "id and filename are required" });
    }

    const path = require("path");
    const fs = require("fs");

    const folderPath = path.join('C:/CRM/EmployeeDetails', String(id));

    // Scan subfolders to find where filename exists on disk
    const subfolders = ["bank", "resume", "aadhar", "others"];
    let filePath = null;

    for (const sub of subfolders) {
      const testPath = path.join(folderPath, sub, filename);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        break;
      }
    }

    if (!filePath) {
      filePath = path.join(folderPath, filename);
    }

    // Prevent directory traversal attacks by ensuring the resolved path starts with the intended folderPath
    if (!filePath.startsWith(folderPath)) {
      return res.status(403).json({ success: 0, message: "Invalid file path" });
    }

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ success: 0, message: "File not found" });
      }
      res.download(filePath, filename, (downloadErr) => {
        if (downloadErr) {
          if (!res.headersSent) {
            res.status(500).send("Error downloading file");
          }
        }
      });
    });
  },

  uploadProfilePhoto: (req, res) => {
    try {
      const fs = require("fs");
      const path = require("path");
      const { userId } = req.body;
      const file = req.file;

      if (!userId) {
        return res.status(400).json({ success: 0, message: "userId is required" });
      }
      if (!file) {
        return res.status(400).json({ success: 0, message: "No file uploaded" });
      }

      // Enforce file extension check (.jpg, .jpeg, .jpj)
      const fileExt = path.extname(file.originalname).toLowerCase();
      const allowedExtensions = [".jpg", ".jpeg", ".jpj"];
      if (!allowedExtensions.includes(fileExt)) {
        return res.status(400).json({
          success: 0,
          message: "Only JPG and JPEG images are allowed."
        });
      }

      // Enforce maximum size of 5 MB (5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: 0,
          message: "Profile photo exceeds the maximum size limit of 5 MB."
        });
      }

      const dir = path.join("C:/CRM/ProfilePhoto", String(userId));
      if (fs.existsSync(dir)) {
        // Clear any old profile photos for this user
        const existingFiles = fs.readdirSync(dir);
        existingFiles.forEach((f) => {
          try {
            fs.unlinkSync(path.join(dir, f));
          } catch (e) {
            console.error("Unlink existing profile photo error:", e);
          }
        });
      } else {
        fs.mkdirSync(dir, { recursive: true });
      }

      const targetPath = path.join(dir, file.originalname);
      fs.writeFileSync(targetPath, file.buffer);

      return res.status(200).json({
        success: 1,
        message: "Profile photo uploaded successfully",
        filePath: targetPath
      });
    } catch (error) {
      console.error("uploadProfilePhoto error:", error);
      return res.status(500).json({ success: 0, message: "Internal server error" });
    }
  },

  getProfilePhoto: (req, res) => {
    try {
      const fs = require("fs");
      const path = require("path");
      const { userId } = req.params;
      const dir = path.join("C:/CRM/ProfilePhoto", String(userId));

      if (!fs.existsSync(dir)) {
        return res.status(200).send("Not Found");
      }

      const files = fs.readdirSync(dir);
      if (files.length === 0) {
        return res.status(200).send("Not Found");
      }

      const filePath = path.join(dir, files[0]);
      console.log({
        filePath
      });

      res.setHeader("Content-Type", "image/jpeg");
      return res.sendFile(filePath);
    } catch (error) {
      console.error("getProfilePhoto error:", error);
      return res.status(500).send("Internal Server Error");
    }
  },
 
};
