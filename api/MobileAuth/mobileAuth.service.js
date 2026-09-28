const db = require("../../dbconfig/dbconfig");

module.exports = {

    /*
    |--------------------------------------------------------------------------
    | Find User
    |--------------------------------------------------------------------------
    */

    findUserByUsername: (username, callback) => {

        db.query(
            `
            SELECT
                u.id,
                u.username,
                u.password,

                r.role_id AS role,
                r.role_name,

                um.user_id,
                um.name,
                um.age,
                um.gender

            FROM users u

            LEFT JOIN users_master um
                ON u.username = um.employee_id

            LEFT JOIN roles r
                ON r.role_id = um.role_id

            WHERE
                u.username = ?
                AND um.is_active = 1

            LIMIT 1
            `,

            [username],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                if (
                    !result ||
                    result.length === 0
                ) {
                    return callback(null, null);
                }

                callback(
                    null,
                    result[0]
                );
            }
        );
    },


    /*
    |--------------------------------------------------------------------------
    | Find User By ID
    |--------------------------------------------------------------------------
    */

    findUserById: (userId, callback) => {

        db.query(
            `
            SELECT
                u.id,
                u.username,

                r.role_id AS role,
                r.role_name,

                um.user_id,
                um.name,
                um.age,
                um.gender

            FROM users u

            LEFT JOIN users_master um
                ON u.username = um.employee_id

            LEFT JOIN roles r
                ON r.role_id = um.role_id

            WHERE
                u.id = ?
                AND um.is_active = 1

            LIMIT 1
            `,

            [userId],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                if (
                    !result ||
                    result.length === 0
                ) {
                    return callback(null, null);
                }

                callback(
                    null,
                    result[0]
                );
            }
        );
    },


    /*
    |--------------------------------------------------------------------------
    | Create Mobile Session
    |--------------------------------------------------------------------------
    */

    createMobileSession: (
        userId,
        refreshToken,
        deviceId,
        deviceName,
        callback
    ) => {

        db.query(
            `
            INSERT INTO mobile_user_sessions
            (
                user_id,
                refresh_token,
                refresh_token_expiry,
                device_id,
                device_name,
                revoked,
                last_used_at
            )

            VALUES
            (
                ?,
                ?,
                DATE_ADD(NOW(), INTERVAL 30 DAY),
                ?,
                ?,
                0,
                NOW()
            )
            `,

            [
                userId,
                refreshToken,
                deviceId || null,
                deviceName || null,
            ],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(
                    null,
                    result
                );
            }
        );
    },


    /*
    |--------------------------------------------------------------------------
    | Find Refresh Token
    |--------------------------------------------------------------------------
    */

    findRefreshToken: (
        refreshToken,
        userId,
        callback
    ) => {

        db.query(
            `
            SELECT
                *

            FROM mobile_user_sessions

            WHERE
                refresh_token = ?
                AND user_id = ?
                AND revoked = 0
                AND refresh_token_expiry > NOW()

            LIMIT 1
            `,

            [
                refreshToken,
                userId,
            ],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                if (
                    !result ||
                    result.length === 0
                ) {
                    return callback(null, null);
                }

                callback(
                    null,
                    result[0]
                );
            }
        );
    },


    /*
    |--------------------------------------------------------------------------
    | Update Last Used
    |--------------------------------------------------------------------------
    */

    updateSessionLastUsed: (
        sessionId,
        callback
    ) => {

        db.query(
            `
            UPDATE mobile_user_sessions

            SET
                last_used_at = NOW()

            WHERE
                id = ?
            `,

            [sessionId],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(
                    null,
                    result
                );
            }
        );
    },


    /*
    |--------------------------------------------------------------------------
    | Revoke Session
    |--------------------------------------------------------------------------
    */

    revokeSession: (
        refreshToken,
        callback
    ) => {

        db.query(
            `
            UPDATE mobile_user_sessions

            SET
                revoked = 1,
                updated_at = NOW()

            WHERE
                refresh_token = ?
            `,

            [refreshToken],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(
                    null,
                    result
                );
            }
        );
    },


    /*
    |--------------------------------------------------------------------------
    | Revoke All User Sessions
    |--------------------------------------------------------------------------
    */

    revokeAllSessions: (
        userId,
        callback
    ) => {

        db.query(
            `
            UPDATE mobile_user_sessions

            SET
                revoked = 1,
                updated_at = NOW()

            WHERE
                user_id = ?
                AND revoked = 0
            `,

            [userId],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(
                    null,
                    result
                );
            }
        );
    },


    /*
    |--------------------------------------------------------------------------
    | Login Attendance
    |--------------------------------------------------------------------------
    */

    logLogin: (
        data,
        callback
    ) => {

        db.query(
            `
            INSERT INTO user_attendance
            (
                user_id,
                username,
                login_time,
                shift_status,
                system_ip
            )

            VALUES
            (
                ?,
                ?,
                NOW(),
                'Active',
                ?
            )
            `,

            [
                data.user_id,
                data.username,
                data.system_ip,
            ],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(
                    null,
                    result
                );
            }
        );
    },


    /*
    |--------------------------------------------------------------------------
    | Logout Attendance
    |--------------------------------------------------------------------------
    */

    logoutSession: (
        attendanceId,
        callback
    ) => {

        db.query(
            `
            UPDATE user_attendance

            SET
                logout_time = NOW(),

                productivity_hours =
                    LEAST(
                        999.99,
                        ROUND(
                            TIMESTAMPDIFF(
                                SECOND,
                                login_time,
                                NOW()
                            ) / 3600.0,
                            2
                        )
                    ),

                shift_status = 'Logged Out'

            WHERE
                id = ?
            `,

            [attendanceId],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(
                    null,
                    result
                );
            }
        );
    },

};