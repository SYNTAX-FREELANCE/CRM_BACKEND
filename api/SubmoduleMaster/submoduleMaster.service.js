// services/submoduleMaster.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
    // ==================== CREATE SUBMODULE ====================
    createSubmodule: (submoduleData, callback) => {
        pool.query(
            `INSERT INTO submodules 
            (submodule_name, module_id, is_active, created_at, created_user)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)`,
            [
                submoduleData.submodule_name,
                submoduleData.module_id,
                submoduleData.is_active,
                submoduleData.created_user
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET ALL SUBMODULES ====================
    getAllSubmodules: (callback) => {
        pool.query(
            `SELECT s.submodule_id, s.submodule_name, s.module_id, s.is_active, 
                    s.created_at, s.updated_at, s.created_user, s.updated_user, 
                    m.module_name 
            FROM submodules s
            LEFT JOIN modules m ON s.module_id = m.module_id
            ORDER BY s.created_at DESC`,
            [],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET SUBMODULE BY ID ====================
    getSubmoduleById: (submoduleId, callback) => {
        pool.query(
            `SELECT s.submodule_id, s.submodule_name, s.module_id, s.is_active, 
                    s.created_at, s.updated_at, s.created_user, s.updated_user, 
                    m.module_name 
            FROM submodules s
            LEFT JOIN modules m ON s.module_id = m.module_id
            WHERE s.submodule_id = ?`,
            [submoduleId],
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

    // ==================== UPDATE SUBMODULE ====================
    updateSubmodule: (submoduleId, submoduleData, callback) => {
        pool.query(
            `UPDATE submodules 
            SET submodule_name = ?, module_id = ?, is_active = ?, 
                updated_at = CURRENT_TIMESTAMP, updated_user = ?
            WHERE submodule_id = ?`,
            [
                submoduleData.submodule_name,
                submoduleData.module_id,
                submoduleData.is_active,
                submoduleData.updated_user,
                submoduleId
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== DELETE SUBMODULE (SOFT DELETE) ====================
    deleteSubmodule: (submoduleId, callback) => {
        pool.query(
            `UPDATE submodules 
            SET is_active = 0, updated_at = CURRENT_TIMESTAMP 
            WHERE submodule_id = ?`,
            [submoduleId],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET ACTIVE SUBMODULES ONLY ====================
    getActiveSubmodules: (callback) => {
        pool.query(
            `SELECT s.submodule_id, s.submodule_name, s.module_id, s.is_active, 
                    s.created_at, s.updated_at, s.created_user, s.updated_user, 
                    m.module_name 
            FROM submodules s
            LEFT JOIN modules m ON s.module_id = m.module_id
            WHERE s.is_active = 1
            ORDER BY s.submodule_name ASC`,
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
