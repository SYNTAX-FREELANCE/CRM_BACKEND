// services/moduleMaster.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
    // ==================== CREATE MODULE ====================
    createModule: (moduleData, callback) => {

        pool.query(
            `INSERT INTO modules 
            (module_name, is_active, created_at, created_user)
            VALUES (?, ?, CURRENT_TIMESTAMP, ?)`,
            [
                moduleData.module_name,
                moduleData.is_active,
                moduleData.created_user
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET ALL MODULES ====================
    getAllModules: (callback) => {
        pool.query(
            `SELECT module_id, module_name, is_active, created_at, updated_at, created_user, edited_user 
            FROM modules 
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

    // ==================== GET MODULE BY ID ====================
    getModuleById: (moduleId, callback) => {
        pool.query(
            `SELECT module_id, module_name, is_active, created_at, updated_at, created_user, edited_user 
            FROM modules 
            WHERE module_id = ?`,
            [moduleId],
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

    // ==================== UPDATE MODULE ====================
    updateModule: (moduleId, moduleData, callback) => {
        pool.query(
            `UPDATE modules 
            SET module_name = ?, is_active = ?, 
                updated_at = CURRENT_TIMESTAMP, edited_user = ?
            WHERE module_id = ?`,
            [
                moduleData.module_name,
                moduleData.is_active,
                moduleData.edited_user,
                moduleId
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== DELETE MODULE (SOFT DELETE) ====================
    deleteModule: (moduleId, callback) => {
        pool.query(
            `UPDATE modules 
            SET is_active = 0, updated_at = CURRENT_TIMESTAMP 
            WHERE module_id = ?`,
            [moduleId],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET ACTIVE MODULES ONLY ====================
    getActiveModules: (callback) => {
        pool.query(
            `SELECT module_id, module_name, is_active, created_at, updated_at, created_user, edited_user 
            FROM modules 
            WHERE is_active = 1
            ORDER BY module_name ASC`,
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
