const pool = require("../../dbconfig/dbconfig");

module.exports = {

    getRoleModuleRights: (roleId, callback) => {
        pool.query(
            `
            SELECT
                module_id,
                active_status
            FROM role_module_rights
            WHERE role_slno = ?
            `,
            [roleId],
            (err, results) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, results);
            }
        );
    },


      activeRoleModuleRights: (roleId, callback) => {
        pool.query(
            `
            SELECT
                rmr.module_id,
                m.module_name
            FROM role_module_rights rmr
            INNER JOIN modules m
                ON m.module_id = rmr.module_id
            WHERE
                rmr.role_slno = ?
                AND rmr.active_status = 1
                AND m.is_active = 1
            `,
            [roleId],
            (err, results) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, results);
            }
        );
    },


    saveRoleModuleRights: (data, callback) => {

        const {
            role_id,
            module_id,
            status,
            created_user
        } = data;

        pool.query(
            `
        INSERT INTO role_module_rights
        (
            role_slno,
            module_id,
            active_status,
            created_user
        )
        VALUES (?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE
            active_status = VALUES(active_status)
        `,
            [
                role_id,
                module_id,
                status,
                created_user
            ],
            (err, results) => {

                if (err) {
                    return callback(err, null);
                }

                return callback(null, results);

            }
        );

    },
};