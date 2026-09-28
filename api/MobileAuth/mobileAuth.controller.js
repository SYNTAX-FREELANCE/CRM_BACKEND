const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authService =
    require("./mobileAuth.service");

const {
    generateMobileTokens,
    generateMobileAccessToken,
} =
    require("../../Middleware/generateMobileTokens");


module.exports = {

    /*
    |--------------------------------------------------------------------------
    | MOBILE LOGIN
    |--------------------------------------------------------------------------
    */

    login: (req, res) => {

        const {
            username,
            password,
            device_id,
            device_name,
        } = req.body;


        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

        if (!username || !password) {

            return res.status(400).json({
                success: 0,
                message:
                    "Username and password are required",
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Find User
        |--------------------------------------------------------------------------
        */

        authService.findUserByUsername(
            username,

            (err, user) => {

                if (err) {

                    console.error(
                        "MOBILE LOGIN DB ERROR:",
                        err
                    );

                    return res.status(500).json({
                        success: 0,
                        message:
                            "Something went wrong",
                    });
                }


                if (!user) {

                    return res.status(401).json({
                        success: 0,
                        message:
                            "Invalid username or password",
                    });
                }


                /*
                |--------------------------------------------------------------------------
                | Password
                |--------------------------------------------------------------------------
                */

                bcrypt.compare(
                    password,
                    user.password,

                    (err, match) => {

                        if (err) {

                            console.error(err);

                            return res.status(500).json({
                                success: 0,
                                message:
                                    "Something went wrong",
                            });
                        }


                        if (!match) {

                            return res.status(401).json({
                                success: 0,
                                message:
                                    "Invalid username or password",
                            });
                        }


                        /*
                        |--------------------------------------------------------------------------
                        | Generate Tokens
                        |--------------------------------------------------------------------------
                        */

                        const {
                            accessToken,
                            refreshToken,
                        } =
                            generateMobileTokens(
                                user
                            );


                        /*
                        |--------------------------------------------------------------------------
                        | Store Session
                        |--------------------------------------------------------------------------
                        */

                        authService.createMobileSession(

                            user.id,

                            refreshToken,

                            device_id,

                            device_name,

                            (tokenErr) => {

                                if (tokenErr) {

                                    console.error(
                                        "MOBILE SESSION ERROR:",
                                        tokenErr
                                    );

                                    return res.status(500).json({
                                        success: 0,
                                        message:
                                            "Unable to create mobile session",
                                    });
                                }


                                /*
                                |--------------------------------------------------------------------------
                                | Attendance
                                |--------------------------------------------------------------------------
                                */

                                authService.logLogin(

                                    {
                                        user_id:
                                            user.user_id,

                                        username:
                                            user.username,

                                        system_ip:
                                            (
                                                req.headers[
                                                    "x-forwarded-for"
                                                ] ||
                                                req.socket
                                                    .remoteAddress ||
                                                req.ip ||
                                                ""
                                            ).replace(
                                                "::ffff:",
                                                ""
                                            ),
                                    },

                                    (
                                        logErr,
                                        attendanceResult
                                    ) => {

                                        if (logErr) {

                                            console.error(
                                                "ATTENDANCE LOGIN ERROR:",
                                                logErr
                                            );
                                        }


                                        const attendanceId =
                                            attendanceResult
                                                ? attendanceResult.insertId
                                                : null;


                                        /*
                                        |--------------------------------------------------------------------------
                                        | Response
                                        |--------------------------------------------------------------------------
                                        */

                                        return res.status(200).json({

                                            success: 1,

                                            message:
                                                "Login successful",

                                            accessToken,

                                            refreshToken,

                                            attendance_id:
                                                attendanceId,

                                            user: {

                                                id:
                                                    user.user_id,

                                                username:
                                                    user.username,

                                                role:
                                                    user.role_name,

                                                role_id:
                                                    user.role,

                                                name:
                                                    user.name,
                                            },
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    },


    /*
    |--------------------------------------------------------------------------
    | REFRESH TOKEN
    |--------------------------------------------------------------------------
    */

    refreshToken: (req, res) => {

        const {
            refreshToken,
        } = req.body;


        if (!refreshToken) {

            return res.status(401).json({
                success: 0,
                message:
                    "Refresh token required",
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Verify JWT
        |--------------------------------------------------------------------------
        */

        jwt.verify(

            refreshToken,

            process.env.MOBILE_REFRESH_TOKEN_SECRET,

            (err, decoded) => {

                if (err) {

                    return res.status(401).json({
                        success: 0,
                        message:
                            "Invalid or expired refresh token",
                    });
                }


                const userId =
                    decoded.userId;


                /*
                |--------------------------------------------------------------------------
                | Check Database Session
                |--------------------------------------------------------------------------
                */

                authService.findRefreshToken(

                    refreshToken,

                    userId,

                    (err, session) => {

                        if (err) {

                            console.error(
                                "REFRESH SESSION ERROR:",
                                err
                            );

                            return res.status(500).json({
                                success: 0,
                                message:
                                    "Something went wrong",
                            });
                        }


                        if (!session) {

                            return res.status(401).json({
                                success: 0,
                                message:
                                    "Mobile session expired or revoked",
                            });
                        }


                        /*
                        |--------------------------------------------------------------------------
                        | Get User
                        |--------------------------------------------------------------------------
                        */

                        authService.findUserById(

                            userId,

                            (err, user) => {

                                if (err || !user) {

                                    return res.status(401).json({
                                        success: 0,
                                        message:
                                            "User not found",
                                    });
                                }


                                /*
                                |--------------------------------------------------------------------------
                                | Generate New Access Token
                                |--------------------------------------------------------------------------
                                */

                                const accessToken =
                                    generateMobileAccessToken(
                                        user
                                    );


                                /*
                                |--------------------------------------------------------------------------
                                | Update Last Used
                                |--------------------------------------------------------------------------
                                */

                                authService.updateSessionLastUsed(
                                    session.id,
                                    () => {}
                                );


                                return res.status(200).json({

                                    success: 1,

                                    message:
                                        "Token refreshed",

                                    accessToken,
                                });
                            }
                        );
                    }
                );
            }
        );
    },


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    logout: (req, res) => {

        const {
            refreshToken,
            attendance_id,
        } = req.body;


        if (!refreshToken) {

            return res.status(400).json({
                success: 0,
                message:
                    "Refresh token required",
            });
        }


        authService.revokeSession(

            refreshToken,

            (err) => {

                if (err) {

                    console.error(
                        "MOBILE LOGOUT ERROR:",
                        err
                    );

                    return res.status(500).json({
                        success: 0,
                        message:
                            "Unable to logout",
                    });
                }


                /*
                |--------------------------------------------------------------------------
                | Attendance Logout
                |--------------------------------------------------------------------------
                */

                if (attendance_id) {

                    authService.logoutSession(

                        attendance_id,

                        (logoutErr) => {

                            if (logoutErr) {

                                console.error(
                                    "ATTENDANCE LOGOUT ERROR:",
                                    logoutErr
                                );
                            }

                            return res.status(200).json({

                                success: 1,

                                message:
                                    "Logged out successfully",
                            });
                        }
                    );

                } else {

                    return res.status(200).json({

                        success: 1,

                        message:
                            "Logged out successfully",
                    });
                }
            }
        );
    },


    /*
    |--------------------------------------------------------------------------
    | VALIDATE CURRENT USER
    |--------------------------------------------------------------------------
    */

    me: (req, res) => {
        return res.status(200).json({
            success: 1,
            message:"Mobile token is valid",
            user: req.user,
        });
    },

};