// controllers/userCreation.controller.js
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
        is_active: user_status,
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
        qualification_id: qualification_id || null,
        date_of_join: date_of_join || null,
        experience: experience || null,
        mobile_number_1: mobile_number_1,
        mobile_number_2: mobile_number_2 || null,
        aadhar_number: aadhar_number || null,
        company_id: company_id || null,
        role_id: role_id || null,
        user_status: user_status,
        is_active: is_active ,
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

  // ==================== DELETE USER (SOFT DELETE) ====================
  deleteUser: (req, res) => {
    try {
      const { userId } = req.params;

      // Step 1: Delete files from C drive
      deleteAllUserFiles({ body: { user_id: userId } }, res);

      // Step 2: Soft delete user from database
      userCreationService.deleteUser(userId, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong while deleting user",
          });
        }
      });
    } catch (error) {
      console.error("deleteUser error:", error);
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
};
