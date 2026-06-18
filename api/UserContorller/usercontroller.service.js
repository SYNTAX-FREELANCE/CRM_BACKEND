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
};
