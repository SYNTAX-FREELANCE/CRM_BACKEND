// services/menuMaster.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
    // ==================== CREATE MENU ====================
    createMenu: (menuData, callback) => {
        pool.query(
            `INSERT INTO menus 
            (menu_name, module_id, is_active, created_at, created_user)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)`,
            [
                menuData.menu_name,
                menuData.module_id,
                menuData.is_active,
                menuData.created_user
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET ALL MENUS ====================
    getAllMenus: (callback) => {
        pool.query(
            `SELECT mn.menu_id, mn.menu_name, mn.module_id, mn.is_active, 
                    mn.created_at, mn.updated_at, mn.created_user, mn.updated_user, 
                    md.module_name 
            FROM menus mn
            LEFT JOIN modules md ON mn.module_id = md.module_id
            ORDER BY mn.created_at DESC`,
            [],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET MENU BY ID ====================
    getMenuById: (menuId, callback) => {
        pool.query(
            `SELECT mn.menu_id, mn.menu_name, mn.module_id, mn.is_active, 
                    mn.created_at, mn.updated_at, mn.created_user, mn.updated_user, 
                    md.module_name 
            FROM menus mn
            LEFT JOIN modules md ON mn.module_id = md.module_id
            WHERE mn.menu_id = ?`,
            [menuId],
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

    // ==================== UPDATE MENU ====================
    updateMenu: (menuId, menuData, callback) => {
        pool.query(
            `UPDATE menus 
            SET menu_name = ?, module_id = ?, is_active = ?, 
                updated_at = CURRENT_TIMESTAMP, updated_user = ?
            WHERE menu_id = ?`,
            [
                menuData.menu_name,
                menuData.module_id,
                menuData.is_active,
                menuData.updated_user,
                menuId
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== DELETE MENU (SOFT DELETE) ====================
    deleteMenu: (menuId, callback) => {
        pool.query(
            `UPDATE menus 
            SET is_active = 0, updated_at = CURRENT_TIMESTAMP 
            WHERE menu_id = ?`,
            [menuId],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET ACTIVE MENUS ONLY ====================
    getActiveMenus: (callback) => {
        pool.query(
            `SELECT mn.menu_id, mn.menu_name, mn.module_id, mn.is_active, 
                    mn.created_at, mn.updated_at, mn.created_user, mn.updated_user, 
                    md.module_name 
            FROM menus mn
            LEFT JOIN modules md ON mn.module_id = md.module_id
            WHERE mn.is_active = 1
            ORDER BY mn.menu_name ASC`,
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
