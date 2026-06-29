// controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const authService = require("./usercontroller.service");
const bcrypt = require("bcrypt");
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

        //  Send only user info (NOT tokens - they're in cookies)
        res.status(200).json({
          success: 1,
          message: "Login successful",
          user: {
            id: user.user_id,
            username: user.name,
            role: user.role_name,
          },
        });
      });
    });
  },

  // Refresh token controller
  refreshToken: (req, res) => {
    const { refreshToken } = req.body;
    console.log({
      refreshToken,
    });

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
              // Generate new access token using middleware
              const newAccessToken = generateAccessToken(user);

              res.status(200).json({
                success: 1,
                message: "Token refreshed",
                accessToken: newAccessToken,
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

        res.status(200).json({
          success: 1,
          message: "Logged out successfully",
        });
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

          logLogin(
            {
              user_id: user.id,
              username: user.username,
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

      logoutSession(attendance_id, (err, results) => {
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
};
