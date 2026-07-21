// services/userCreation.service.js
const pool = require("../../dbconfig/dbconfig");
const bcrypt = require("bcrypt");

module.exports = {
  // ==================== CREATE USER WITH AUTH ====================
  createUserWithAuth: (userData, callback) => {
    // Step 1: Get company prefix & sequence
    pool.query(
      `SELECT employee_prefix, employee_sequence
     FROM companies
     WHERE company_id = ?`,
      [userData.company_id],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        if (result.length === 0) {
          return callback(new Error("Company not found"), null);
        }

        const prefix = result[0].employee_prefix;
        const sequence = result[0].employee_sequence;

        // Generate Employee ID
        const nextEmployeeId = prefix + String(sequence).padStart(4, "0");

        // Step 2: Insert into users_master
        pool.query(

          `INSERT INTO users_master 
                    (employee_id, name, age, gender, qualification_id, date_of_join, 
                     experience, mobile_number_1, mobile_number_2, aadhar_number, 
                     company_id, role_id, user_status, is_active, dob, email, address)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

          [
            nextEmployeeId,
            userData.name,
            userData.age,
            userData.gender,
            userData.qualification_id,
            userData.date_of_join,
            userData.experience,
            userData.mobile_number_1,
            userData.mobile_number_2,
            userData.aadhar_number,
            userData.company_id,
            userData.role_id,
            userData.user_status,
            userData.is_active,
            userData.dob,
            userData.email,
            userData.address,
          ],
          (err, masterResult) => {
            if (err) {
              return callback(err, null);
            }

            // Step 3: Update Company Sequence
            pool.query(
              `UPDATE companies
             SET employee_sequence = employee_sequence + 1
             WHERE company_id = ?`,
              [userData.company_id],
              (err) => {
                if (err) {
                  return callback(err, null);
                }

                // Step 4: Username & Password
                const username = nextEmployeeId;

                const salt = bcrypt.genSaltSync(10);
                const encryptedPassword = bcrypt.hashSync(username, salt);

                // Step 5: Insert into users table
                pool.query(
                  `INSERT INTO users
                (
                    username,
                    password,
                    role
                )
                VALUES (?, ?, ?)`,
                  [username, encryptedPassword, userData.role_id],
                  (err, authResult) => {
                    if (err) {
                      return callback(err, null);
                    }

                    callback(null, {
                      insertId: masterResult.insertId,
                      employee_id: nextEmployeeId,
                      username: username,
                    });
                  },
                );
              },
            );
          },
        );
      },
    );
  },

  // ==================== INSERT USER FILES ====================
  insertUserFiles: (fileDataArray, callback) => {
    const queries = fileDataArray.map((fileData) => {
      return new Promise((resolve, reject) => {
        pool.query(
          `INSERT INTO user_files 
                    (user_id, file_type, file_name, file_path, file_size, mime_type)
                    VALUES (?, ?, ?, ?, ?, ?)`,
          [
            fileData.user_id,
            fileData.file_type,
            fileData.file_name,
            fileData.file_path,
            fileData.file_size,
            fileData.mime_type,
          ],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        );
      });
    });

    Promise.all(queries)
      .then((results) => callback(null, results))
      .catch((err) => callback(err, null));
  },

  // ==================== GET ALL USERS ====================
  getAllUsers: (callback) => {
    pool.query(
      `SELECT 
                um.*,
                q.qualification_name,
                c.company_name,
                r.role_name,
                s.status_name
            FROM users_master um
            LEFT JOIN qualifications q ON um.qualification_id = q.qualification_id
            LEFT JOIN companies c ON um.company_id = c.company_id
            LEFT JOIN roles r ON um.role_id = r.role_id
            LEFT JOIN statuses s ON um.user_status = s.status_id
            ORDER BY um.created_at DESC`,
      [],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== GET USER BY ID ====================
  getUserById: (userId, callback) => {
    pool.query(
      `SELECT 
                um.*,
                q.qualification_name,
                c.company_name,
                r.role_name,
                s.status_name
            FROM users_master um
            LEFT JOIN qualifications q ON um.qualification_id = q.qualification_id
            LEFT JOIN companies c ON um.company_id = c.company_id
            LEFT JOIN roles r ON um.role_id = r.role_id
            LEFT JOIN statuses s ON um.user_status = s.status_id
            WHERE um.user_id = ?`,
      [userId],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        if (!result || result.length === 0) {
          return callback(null, null);
        }

        callback(null, result[0]);
      },
    );
  },

  // ==================== UPDATE USER ====================
  updateUser: (userId, userData, callback) => {
    pool.query(
      `UPDATE users_master 
         SET  
             name = ?, 
             age = ?, 
             gender = ?, 
             qualification_id = ?, 
             date_of_join = ?, 
             experience = ?, 
             mobile_number_1 = ?, 
             mobile_number_2 = ?, 
             aadhar_number = ?, 
             company_id = ?, 
             role_id = ?, 
             user_status = ?, 
             is_active = ?, 
             dob = ?,
             email = ?,
             address = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
      [
        userData.name,
        userData.age,
        userData.gender,
        userData.qualification_id,
        userData.date_of_join,
        userData.experience,
        userData.mobile_number_1,
        userData.mobile_number_2,
        userData.aadhar_number,
        userData.company_id,
        userData.role_id,
        userData.user_status,
        userData.is_active,
        userData.dob,
        userData.email,
        userData.address,
        userId,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== GET USER FILES ====================
  getUserFiles: (userId, callback) => {
    pool.query(
      `SELECT * FROM user_files 
            WHERE user_id = ? AND is_active = TRUE
            ORDER BY created_at DESC`,
      [userId],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== INSERT SINGLE USER FILE ====================
  insertSingleFile: (fileData, callback) => {
    pool.query(
      `INSERT INTO user_files 
            (user_id, file_type, file_name, file_path, file_size, mime_type)
            VALUES (?, ?, ?, ?, ?, ?)`,
      [
        fileData.user_id,
        fileData.file_type,
        fileData.file_name,
        fileData.file_path,
        fileData.file_size,
        fileData.mime_type,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== GET FILE BY ID ====================
  getFileById: (fileId, callback) => {
    pool.query(
      `SELECT * FROM user_files 
            WHERE file_id = ? AND is_active = TRUE`,
      [fileId],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        if (!result || result.length === 0) {
          return callback(null, null);
        }
        callback(null, result[0]);
      },
    );
  },

  // ==================== DEACTIVATE FILE ====================
  deactivateFile: (fileId, callback) => {
    pool.query(
      `UPDATE user_files 
            SET is_active = FALSE 
            WHERE file_id = ?`,
      [fileId],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== DEACTIVATE FILES BY TYPE ====================
  deactivateFilesByType: (userId, fileType, callback) => {
    pool.query(
      `SELECT * FROM user_files 
            WHERE user_id = ? AND file_type = ? AND is_active = TRUE`,
      [userId, fileType],
      (err, files) => {
        if (err) return callback(err, null);

        pool.query(
          `UPDATE user_files 
                SET is_active = FALSE 
                WHERE user_id = ? AND file_type = ?`,
          [userId, fileType],
          (err2, result) => {
            if (err2) return callback(err2, null);
            callback(null, files);
          },
        );
      },
    );
  },
};
