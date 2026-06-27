// services/userCreation.service.js
const pool = require("../../dbconfig/dbconfig");
const bcrypt = require("bcrypt");

module.exports = {
  // ==================== CREATE USER WITH AUTH ====================
  createUserWithAuth: (userData, callback) => {
    // Step 1: Get next employee_id (auto-increment from 1000)
    pool.query(
      "SELECT MAX(employee_id) as max_emp FROM users_master",
      [],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        const nextEmployeeId = result[0].max_emp
          ? (parseInt(result[0].max_emp) + 1).toString()
          : "1000";

        // Step 2: Insert into users_master
        pool.query(
          `INSERT INTO users_master 
                    (employee_id, name, age, qualification_id, date_of_join, 
                     experience, mobile_number_1, mobile_number_2, aadhar_number, 
                     company_id, role_id, user_status, is_active)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            nextEmployeeId,
            userData.name,
            userData.age,
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
          ],
          (err, masterResult) => {
            if (err) {
              return callback(err, null);
            }

            const userId = masterResult.insertId;
            // Step 3: Create username and encrypt password
            const username = nextEmployeeId;

            //  FIXED: Generate salt first
            const salt = bcrypt.genSaltSync(10);
            const encryptedPassword = bcrypt.hashSync(username, salt);

            // Step 4: Insert into users table for authentication
            pool.query(
              `INSERT INTO users (username, password, role) 
                            VALUES (?, ?, ?)`,
              [username, encryptedPassword, userData.role_id],
              (err, authResult) => {
                if (err) {
                  // Rollback users_master if auth fails
                  return callback(err, null);
                }

                callback(null, masterResult);
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
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
      [
        userData.name,
        userData.age,
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

  // ==================== DELETE USER (SOFT DELETE) ====================
  deleteUser: (userId, callback) => {
    pool.query(
      `UPDATE users_master 
            SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
            WHERE user_id = ?`,
      [userId],
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
};
