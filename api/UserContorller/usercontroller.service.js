const pool = require("../../dbconfig/dbconfig");

module.exports = {
    insertUser: (user, callback) => {
        pool.query(
            `INSERT INTO user_login (user_name, password, user_email, create_date, edit_date)
       VALUES (?, ?, ?, NOW(), NOW())`,
            [user.user_name, user.password, user.user_email],
            (err, result) => {
                if (err) {
                    console.error("insertUser DB error:", err);
                    return callback(err, null);
                }

                return callback(null, {
                    user_id: result.insertId,
                    user_name: user.user_name,
                    user_email: user.user_email,
                });
            },
        );
    },

    findUserByEmail: (email, callback) => {
        pool.query(
            "SELECT * FROM user_login WHERE user_email = ?",
            [email],
            (err, rows) => {
                if (err) {
                    console.error("findUserByEmail DB error:", err);
                    return callback(err, null);
                }

                // return first row or undefined
                return callback(null, rows[0]);
            },
        );
    },
    findUserByUsername: (username, callback) => {
        pool.query(
            "SELECT * FROM users WHERE username = ?",
            [username],
            (err, results) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, results[0]);
            },
        );
    },

    logLogin: (data, callback) => {
        // Auto-close any dangling sessions that weren't closed cleanly
        pool.query(
            `UPDATE user_attendance 
             SET logout_time = NOW(), 
                 productivity_hours = ROUND(TIMESTAMPDIFF(SECOND, login_time, NOW()) / 3600, 2) 
             WHERE user_id = ? AND logout_time IS NULL`,
            [data.user_id],
            (err) => {
                if (err) {
                    console.error("Auto-close dangling sessions DB error:", err);
                }

                // Insert new login session
                pool.query(
                    `INSERT INTO user_attendance (user_id, username, login_time) 
                     VALUES (?, ?, NOW())`,
                    [data.user_id, data.username],
                    (err, result) => {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, result);
                    }
                );
            }
        );
    },

    logoutSession: (attendanceId, callback) => {
        pool.query(
            `UPDATE user_attendance 
             SET logout_time = NOW(), 
                 productivity_hours = ROUND(TIMESTAMPDIFF(SECOND, login_time, NOW()) / 3600, 2) 
             WHERE id = ?`,
            [attendanceId],
            (err, result) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, result);
            }
        );
    },
};
