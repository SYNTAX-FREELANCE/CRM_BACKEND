const pool = require("../../dbconfig/dbconfig");

module.exports = {

    createTarget: (data, callback) => {

        pool.query(
            `INSERT INTO employee_target_master
        (
            employee_id,
            target_date,
            normal_target,
            renewal_target,
            assigned_by,
            remarks,
            is_active,
            assigned_date,
            created_at
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
                data.employee_id,
                data.target_date,
                data.normal_target,
                data.renewal_target,
                data.assigned_by,
                data.remarks,
                data.is_active
            ],
            callback
        );

    },
    getAllTargets: (callback) => {
        const query =
            `
            SELECT
                etm.target_id,
                etm.employee_id,
                DATE_FORMAT(etm.target_date, '%Y-%m-%d') AS target_date,
                etm.normal_target,
                etm.renewal_target,
                etm.remarks,
                etm.is_active,
                um.name AS employee_name,
                um.employee_id AS employee_code
            FROM employee_target_master etm
            LEFT JOIN users_master um
            ON um.user_id = etm.employee_id;
`
        pool.query(
            query,
            [],
            (err, result) => {

                if (err) return callback(err);

                if (!result.length)
                    return callback(null, null);

                callback(null, result);

            }
        );

    },

    getTargetById: (targetId, callback) => {

        pool.query(
            `SELECT
            etm.target_id,
            etm.employee_id,
            etm.target_date,
            etm.normal_target,
            etm.renewal_target,
            etm.assigned_by,
            etm.assigned_date,
            etm.remarks,
            etm.is_active,
            etm.created_at,
            etm.updated_at,

            um.name AS employee_name,
            um.employee_id AS employee_code

        FROM employee_target_master etm

        LEFT JOIN users_master um
            ON um.user_id = etm.employee_id

        WHERE etm.target_id = ?`,
            [targetId],
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
    updateTarget: (targetId, data, callback) => {

        pool.query(
            `UPDATE employee_target_master
        SET
            employee_id = ?,
            target_date = ?,
            normal_target = ?,
            renewal_target = ?,
            assigned_by = ?,
            remarks = ?,
            is_active = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE target_id = ?`,
            [
                data.employee_id,
                data.target_date,
                data.normal_target,
                data.renewal_target,
                data.assigned_by,
                data.remarks,
                data.is_active,
                targetId
            ],
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }
                callback(null, result[0]);

            }
        );

    },

    deleteTarget: (targetId, callback) => {

        pool.query(
            `UPDATE employee_target_master
             SET
                is_active=0,
                updated_at=CURRENT_TIMESTAMP
             WHERE target_id=?`,
            [targetId],
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }
                callback(null, result[0]);

            }
        );

    },

    getActiveTargets: (callback) => {
        pool.query(
            `SELECT *
             FROM employee_target_master
             WHERE is_active=1
             ORDER BY target_year DESC,target_month DESC`,
            [],
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }
                callback(null, result[0]);

            }
        );

    },
    checkTargetExists: (employee_id, target_date, callback) => {
        pool.query(
            `SELECT target_id
         FROM employee_target_master
         WHERE employee_id = ?
           AND target_date = ?`,
            [employee_id, target_date],
            callback
        );

    },
    getCurrentEmployeeTarget: (employee_id, callback) => {
        pool.query(
            `SELECT
    etm.target_id,
    etm.employee_id,
    etm.target_date,
    etm.normal_target,
    etm.renewal_target,

    COALESCE(
        SUM(
            CASE
                WHEN l.status_id = 5
                     AND c.is_previous_customer = 0
                THEN 1
                ELSE 0
            END
        ), 0
    ) AS normal_sold,

    COALESCE(
        SUM(
            CASE
                WHEN l.status_id = 5
                     AND c.is_previous_customer = 1
                THEN 1
                ELSE 0
            END
        ), 0
    ) AS renewal_sold,

    COALESCE(
        SUM(
            CASE
                WHEN l.status_id = 5
                THEN 1
                ELSE 0
            END
        ), 0
    ) AS total_sold

FROM employee_target_master etm

LEFT JOIN leads l
    ON l.assigned_to = etm.employee_id
    AND YEAR(l.assigned_date) = YEAR(etm.target_date)
    AND MONTH(l.assigned_date) = MONTH(etm.target_date)

LEFT JOIN customers c
    ON c.customer_id = l.customer_id

WHERE etm.employee_id = ?
    AND etm.is_active = 1
    AND YEAR(etm.target_date) = YEAR(CURDATE())
    AND MONTH(etm.target_date) = MONTH(CURDATE())

GROUP BY
    etm.target_id`,
            [employee_id],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);

            }
        );

    }


};