// controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const authService = require("./usercontroller.service");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const {
  // <<<<<<< HEAD
  generateTokens,
  generateAccessToken,
} = require("../../Middleware/generateTokens");

module.exports = {
  login: (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: 0,
        message: "Missing required fields",
      });
    }



    authService.findUserByUsername(username, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: 0,
          message: "Something went wrong",
        });
      }


      if (!user) {
        return res.status(200).json({
          success: 0,
          message: "Invalid username or password",
        });
      }

      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        if (!match) {
          return res.status(200).json({
            success: 0,
            message: "Invalid username or password",
          });
        }

        const { accessToken, refreshToken } = generateTokens(user);

        authService.storeRefreshToken(user.id, refreshToken, (storeErr) => {
          if (storeErr) {
            console.error(storeErr);
          }
        });

        // Set HttpOnly cookies (NOT localStorage)
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // HTTPS only in production
          sameSite: "lax",
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // res.cookie("accessToken", accessToken, {
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: "none",
        //   maxAge: 15 * 60 * 1000,
        // });

        // res.cookie("refreshToken", refreshToken, {
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: "none",
        //   maxAge: 7 * 24 * 60 * 60 * 1000,
        // });

        // Log login session in user_attendance
        authService.logLogin(
          {
            user_id: user.user_id,
            username: user.username,
            system_ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '').replace('::ffff:', ''),
          },
          (logErr, attendanceResult) => {
            if (logErr) {
              console.error("Failed to log attendance login:", logErr);
            }

            const attendanceId = attendanceResult ? attendanceResult.insertId : null;

            //  Send only user info (NOT tokens - they're in cookies) and attendance_id
            return res.status(200).json({
              success: 1,
              message: "Login successful",
              user: {
                id: user.user_id,
                username: user.name,
                role: user.role_name,
                role_id: user.role
              },
              attendance_id: attendanceId,
            });
          }
        );
      });
    });
  },

  // Refresh token controller
  refreshToken: (req, res) => {
    const refreshToken = req.cookies.refreshToken;


    if (!refreshToken) {
      return res.status(401).json({
        success: 0,
        message: "Refresh token required",
      });
    }

    // Verify refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: 0,
            message: "Invalid refresh token",
          });
        }

        // Check if refresh token exists
        authService.findRefreshToken(
          refreshToken,
          decoded.userId,
          (err, tokenRecord) => {
            if (err || !tokenRecord) {
              return res.status(401).json({
                success: 0,
                message: "Invalid refresh token",
              });
            }

            // Get user data
            authService.findUserById(decoded.userId, (err, user) => {
              if (err || !user) {
                return res.status(401).json({
                  success: 0,
                  message: "User not found",
                });
              }

              // Generate new access token
              const newAccessToken = generateAccessToken(user);

              res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
              });

              // res.cookie("accessToken", newAccessToken, {
              //   httpOnly: true,
              //   secure: true,
              //   sameSite: "none",
              //   maxAge: 15 * 60 * 1000,
              // });

              res.status(200).json({
                success: 1,
                message: "Token refreshed",
              });
            });
          },
        );
      },
    );
  },

  // Logout controller
  logout: (req, res) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: 0,
        message: "Access token required",
      });
    }

    // Get userId from access token
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: 0,
          message: "Invalid token",
        });
      }

      const { attendance_id } = req.body;

      // Revoke refresh token
      authService.revokeRefreshToken(decoded.userId, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        res.clearCookie("accessToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        if (attendance_id) {
          authService.logoutSession(attendance_id, (logoutErr) => {
            if (logoutErr) {
              console.error("Failed to log attendance logout:", logoutErr);
            }
            return res.status(200).json({
              success: 1,
              message: "Logged out successfully",
            });
          });
        } else {
          return res.status(200).json({
            success: 1,
            message: "Logged out successfully",
          });
        }
      });
    });
  },
  loginUserDetail: (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      authService.findUserByUsername(username, (err, user) => {
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

          authService.logLogin(
            {
              user_id: user.id,
              username: user.username,
              system_ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '').replace('::ffff:', ''),
            },
            (err, attendanceResult) => {
              if (err) {
                console.error("Failed to log attendance login:", err);
              }

              const attendanceId = attendanceResult
                ? attendanceResult.insertId
                : null;

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
            },
          );
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
          message: "Attendance ID is required",
        });
      }

      authService.logoutSession(attendance_id, (err, results) => {
        if (err) {
          console.error("logoutSession DB error:", err);
          return res.status(500).json({
            success: 0,
            message: "Database error during logout",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Logged out successfully",
        });
      });
    } catch (error) {
      console.error("logoutUserSession error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  changePassword: (req, res) => {
    try {
      const { password, confirmPassword } = req.body;
      const userId = req.user.id;

      if (!password || !confirmPassword) {
        return res.status(400).json({
          success: 0,
          message: "Missing required fields",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: 0,
          message: "Passwords do not match",
        });
      }

      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const encryptedPassword = bcrypt.hashSync(password, salt);

      authService.changePassword(userId, encryptedPassword, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Password changed successfully",
        });
      });
    } catch (error) {
      console.error("changePassword error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  forgotPassword: (req, res) => {
    try {
      const { employee_id, email } = req.body;

      if (!employee_id || !email) {
        return res.status(400).json({
          success: 0,
          message: "Employee ID and Email are required",
        });
      }

      authService.verifyEmployeeAndEmail(employee_id, email, (err, user) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
          });
        }

        if (!user) {
          return res.status(404).json({
            success: 0,
            message: "No user found with the provided Employee ID and Email",
          });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        authService.saveOtp(employee_id, otp, (saveErr) => {
          if (saveErr) {
            return res.status(500).json({
              success: 0,
              message: "Failed to generate OTP",
            });
          }

          // Send Email
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP - Nexus CRM",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>Hello ${user.name},</p>
                <p>We received a request to reset your password. Here is your One-Time Password (OTP):</p>
                <h1 style="background: #f3f4f6; padding: 10px; text-align: center; letter-spacing: 5px; color: #ea580c;">${otp}</h1>
                <p>Please enter this code in the application to proceed with resetting your password.</p>
                <p>If you did not request this, please ignore this email.</p>
                <br />
                <p>Regards,<br />Nexus CRM Team</p>
              </div>
            `,
          };

          transporter.sendMail(mailOptions, (mailErr, info) => {
            if (mailErr) {
              console.error("Error sending email:", mailErr);
              return res.status(500).json({
                success: 0,
                message: "Failed to send OTP email",
              });
            }

            return res.status(200).json({
              success: 1,
              message: "OTP sent successfully to your email",
            });
          });
        });
      });
    } catch (error) {
      console.error("forgotPassword error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  verifyOtp: (req, res) => {
    try {
      const { employee_id, otp } = req.body;

      if (!employee_id || !otp) {
        return res.status(400).json({
          success: 0,
          message: "Employee ID and OTP are required",
        });
      }

      authService.verifyOtp(employee_id, otp, (err, user) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
          });
        }

        if (!user) {
          return res.status(400).json({
            success: 0,
            message: "Invalid OTP",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "OTP verified successfully",
        });
      });
    } catch (error) {
      console.error("verifyOtp error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },

  resetPassword: (req, res) => {
    try {
      const { employee_id, newPassword, confirmPassword } = req.body;

      if (!employee_id || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: 0,
          message: "All fields are required",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: 0,
          message: "Passwords do not match",
        });
      }

      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const encryptedPassword = bcrypt.hashSync(newPassword, salt);

      authService.resetPassword(employee_id, encryptedPassword, (err, result) => {
        if (err) {
          console.error("resetPassword error:", err);
          return res.status(500).json({
            success: 0,
            message: "Database error",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Password reset successfully",
        });
      });
    } catch (error) {
      console.error("resetPassword catch error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
};
