// services/roleMaster.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
    // ==================== CREATE ROLE ====================
    createRole: (roleData, callback) => {
       
        pool.query(
            `INSERT INTO roles 
            (role_name, alias, description, is_active, created_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [
                roleData.role_name,
                roleData.alias,
                roleData.role_description,
                roleData.is_active
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET ALL ROLES ====================
    getAllRoles: (callback) => {
        pool.query(
            `SELECT * FROM roles 
            ORDER BY created_at DESC`,
            [],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET ROLE BY ID ====================
    getRoleById: (roleId, callback) => {
        pool.query(
            `SELECT * FROM roles 
            WHERE role_id = ?`,
            [roleId],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }

                if (!result || result.length === 0) {
                    return callback(null, null);
                }

                callback(null, result[0]);
            }
        );
    },

    // ==================== UPDATE ROLE ====================
    updateRole: (roleId, roleData, callback) => {
         
        
        pool.query(
            `UPDATE roles 
            SET role_name = ?, description = ?, alias = ?, 
                is_active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE role_id = ?`,
            [
                roleData.role_name,
                roleData.role_description,
                roleData.alias,
                roleData.is_active,
                roleId
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== DELETE ROLE (SOFT DELETE) ====================
    deleteRole: (roleId, callback) => {
        pool.query(
            `UPDATE roles 
            SET is_active = 0, updated_at = CURRENT_TIMESTAMP 
            WHERE role_id = ?`,
            [roleId],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET ACTIVE ROLES ONLY ====================
    getActiveRoles: (callback) => {
        pool.query(
            `SELECT * FROM roles 
            WHERE is_active = 1
            ORDER BY role_name ASC`,
            [],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    }
};