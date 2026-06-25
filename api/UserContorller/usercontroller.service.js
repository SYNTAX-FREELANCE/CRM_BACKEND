// services/auth.service.js
const db = require("../../dbconfig/dbconfig");

module.exports = {
    // Find user by username
    findUserByUsername: (username, callback) => {
        db.query(
            `SELECT 
                id, username, password, role, user_id, name, age, gender ,r.role_name FROM users u
                left join users_master um on  u.username = um.employee_id
                left join roles r on  r.role_id = u.role
                WHERE username = ? and um.is_active = 1`,
            [username],
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

    // Find user by username and password
    findUserByUsernameAndPassword: (username, password, callback) => {
        db.query(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            [username, password],
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

    // Store refresh token in database
    storeRefreshToken: (userId, refreshToken, callback) => {
        db.query(
            `
             INSERT INTO user_tokens (user_id, refresh_token, refresh_token_expiry, revoked) 
        VALUES (?, ?, NOW() + INTERVAL 7 DAY, FALSE)
        ON DUPLICATE KEY UPDATE 
            refresh_token = VALUES(refresh_token),
            refresh_token_expiry = NOW() + INTERVAL 7 DAY,
            revoked = FALSE
            `,
            [userId, refreshToken],
            (err) => {
                if (err) {
                    return callback(err, null);
                }

                callback(null, { success: true });
            }
        );
    },

    // Find refresh token by token value
    findRefreshToken: (refreshToken, userId, callback) => {
        db.query(
            "SELECT * FROM user_tokens WHERE refresh_token = ? AND user_id = ? AND revoked = FALSE",
            [refreshToken, userId],
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

    // Get user by ID
    findUserById: (userId, callback) => {
        db.query(
            "SELECT * FROM users WHERE id = ?",
            [userId],
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

    // Revoke refresh token (logout)
    revokeRefreshToken: (userId, callback) => {
        db.query(
            "UPDATE user_tokens SET revoked = TRUE WHERE user_id = ?",
            [userId],
            (err) => {
                if (err) {
                    return callback(err, null);
                }

                callback(null, { success: true });
            }
        );
    },

    // Validate token - get user by ID
    getUserByIdForValidation: (userId, callback) => {
        db.query(
            "SELECT id, username, role FROM users WHERE id = ?",
            [userId],
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
};