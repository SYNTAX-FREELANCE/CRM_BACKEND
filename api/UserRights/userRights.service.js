// services/userRights.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
  // 1. Fetch all active menus under a selected module
  getMenusByModule: (moduleId, callback) => {
    pool.query(
      `SELECT menu_id, menu_name, module_id, is_active 
       FROM menus 
       WHERE module_id = ? AND is_active = 1 
       ORDER BY menu_name ASC`,
      [moduleId],
      (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results);
      }
    );
  },

  // 2. Fetch existing user rights for a selected role + module
  getExistingUserRights: (roleId, moduleId, callback) => {
    pool.query(
      `SELECT user_rights_slno, role_slno, module_slno, menu_slno, Active_status 
       FROM user_rights 
       WHERE role_slno = ? AND module_slno = ?`,
      [roleId, moduleId],
      (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results);
      }
    );
  },

  // 3. Save only selected user rights (Deletes existing, inserts new selected ones)
  saveUserRights: (roleId, moduleId, selectedMenus, userId, callback) => {
    // Delete all existing rights for this role + module
    pool.query(
      `DELETE FROM user_rights WHERE role_slno = ? AND module_slno = ?`,
      [roleId, moduleId],
      (deleteErr, deleteResult) => {
        if (deleteErr) {
          return callback(deleteErr, null);
        }

        if (!selectedMenus || selectedMenus.length === 0) {
          return callback(null, { action: "cleared", affectedRows: deleteResult.affectedRows });
        }

        // Prepare values for bulk insert
        const values = selectedMenus.map((menu) => [
          parseInt(roleId),
          parseInt(moduleId),
          parseInt(menu.menu_slno),
          1, // Active_status is 1
          parseInt(userId),
          new Date(), // create_date
        ]);
        pool.query(
          `INSERT INTO user_rights 
           (role_slno, module_slno, menu_slno, Active_status, create_user, create_date) 
           VALUES ?`,
          [values],
          (insertErr, insertResult) => {
            if (insertErr) {
              return callback(insertErr, null);
            }
            callback(null, { action: "inserted", affectedRows: insertResult.affectedRows });
          }
        );
      }
    );
  },

  // 4. Fetch allowed menus for a role (where Active_status = 1)
  getAllowedMenusForRole: (roleId, callback) => {
    pool.query(
      `  SELECT
                m.module_name,
                mn.menu_name,
                mn.menu_id
            FROM user_rights ur
            INNER JOIN modules m
                ON ur.module_slno = m.module_id
            INNER JOIN menus mn
                ON ur.menu_slno = mn.menu_id
            WHERE ur.role_slno = ?
            AND ur.Active_status = 1
            ORDER BY m.module_name, mn.menu_name;`,
      [roleId],
      (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results);
      }
    );
  },
};

