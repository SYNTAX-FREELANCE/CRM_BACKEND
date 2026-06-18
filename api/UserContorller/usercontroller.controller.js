const bcrypt = require("bcrypt");
const {
    insertUser,
    findUserByEmail,
    findUserByUsername,
    logLogin,
    logoutSession,
} = require("./usercontroller.service");
const jwt = require("jsonwebtoken");
module.exports = {
    // Register
    RegisterUser: (req, res) => {
        try {
            const { user_name, user_email, password } = req.body;

            // 1️ Validate input
            if (!user_name || !user_email || !password) {
                return res.status(400).json({
                    success: 0,
                    message: "Missing required fields",
                });
            }

            // 2️ Check if email already exists
            findUserByEmail(user_email, (err, existingUser) => {
                if (err) {
                    console.error("findUserByEmail error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong",
                    });
                }

                if (existingUser) {
                    return res.status(409).json({
                        success: 0,
                        message: "Email already exists",
                    });
                }

                // 3️ Hash password
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) {
                        console.error("bcrypt hash error:", err);
                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong",
                        });
                    }

                    // 4️ Insert user
                    insertUser(
                        {
                            user_name,
                            user_email,
                            password: hashedPassword,
                        },
                        (err, user) => {
                            if (err) {
                                console.error("insertUser error:", err);
                                return res.status(500).json({
                                    success: 0,
                                    message: "Something went wrong",
                                });
                            }

                            return res.status(201).json({
                                success: 1,
                                message: "Registered successfully",
                                data: user,
                            });
                        },
                    );
                });
            });
        } catch (error) {
            console.error("RegisterUser error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong",
            });
        }
    },

    // Login
    // loginUserDetail: (req, res) => {
    //   try {
    //     const { user_email, password } = req.body;

    //     if (!user_email || !password) {
    //       return res.status(400).json({
    //         success: 0,
    //         message: "Missing required fields",
    //       });
    //     }

    //     findUserByEmail(user_email, (err, user) => {
    //       if (err) {
    //         console.error("findUserByEmail error:", err);
    //         return res.status(500).json({
    //           success: 0,
    //           message: "Something went wrong",
    //         });
    //       }

    //       if (!user) {
    //         return res.status(200).json({
    //           success: 2,
    //           message: "Invalid email or password",
    //         });
    //       }

    //       bcrypt.compare(password, user.password, (err, match) => {
    //         if (err) {
    //           console.error("bcrypt compare error:", err);
    //           return res.status(500).json({
    //             success: 0,
    //             message: "Something went wrong",
    //           });
    //         }

    //         if (!match) {
    //           return res.status(401).json({
    //             success: 0,
    //             message: "Invalid email or password",
    //           });
    //         }

    //         // Optional socket event
    //         if (req.io) {
    //           req.io.emit("login-event", {
    //             message: `${user.user_name} logged in`,
    //           });
    //         }

    //         return res.status(200).json({
    //           success: 1,
    //           message: "Login successful",
    //           data: {
    //             user_id: user.user_id,
    //             user_name: user.user_name,
    //             user_email: user.user_email,
    //             role: "user",
    //           },
    //         });
    //       });
    //     });
    //   } catch (error) {
    //     console.error("loginUserDetail error:", error);
    //     return res.status(500).json({
    //       success: 0,
    //       message: "Something went wrong",
    //     });
    //   }
    // },

    loginUserDetail: (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: 0,
                    message: "Missing required fields",
                });
            }

            findUserByUsername(username, (err, user) => {
                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong",
                    });
                }

                if (!user) {
                    return res.status(401).json({
                        success: 0,
                        message: "Invalid username or password",
                    });
                }

                bcrypt.compare(password, user.password, (err, match) => {
                    if (err) {
                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong",
                        });
                    }

                    if (!match) {
                        return res.status(401).json({
                            success: 0,
                            message: "Invalid username or password",
                        });
                    }

                    const token = jwt.sign(
                        {
                            id: user.id,
                            username: user.username,
                            role: user.role,
                        },
                        process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET,
                        {
                            expiresIn: "8h",
                        },
                    );

                    logLogin({
                        user_id: user.id,
                        username: user.username
                    }, (err, attendanceResult) => {
                        if (err) {
                            console.error("Failed to log attendance login:", err);
                        }

                        const attendanceId = attendanceResult ? attendanceResult.insertId : null;

                        return res.status(200).json({
                            success: 1,
                            message: "Login successful",
                            token,
                            attendance_id: attendanceId,
                            data: {
                                id: user.id,
                                username: user.username,
                                role: user.role,
                            },
                        });
                    });
                });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong",
            });
        }
    },

    logoutUserSession: (req, res) => {
        try {
            const { attendance_id } = req.body;
            if (!attendance_id) {
                return res.status(400).json({
                    success: 0,
                    message: "Attendance ID is required"
                });
            }

            logoutSession(attendance_id, (err, results) => {
                if (err) {
                    console.error("logoutSession DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Database error during logout"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Logged out successfully"
                });
            });
        } catch (error) {
            console.error("logoutUserSession error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },
};
