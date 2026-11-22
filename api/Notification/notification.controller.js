const { sendPushNotification } = require("../../service/notificationService");

const {
  registerDevice,
  getActiveDeviceTokens,
  sendNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  removeNotification,
  getReceivedNotifications,
} = require("./notification.service");

module.exports = {
  testNotification: (req, res) => {
    const {
      user_id,
      leadId,
      customerName,
      phoneNumber,
      registrationNumber,
      model,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    getActiveDeviceTokens(user_id, async (error, devices) => {
      if (error) {
        console.error("❌ Get device tokens error:", error);

        return res.status(500).json({
          success: false,
          message: "Failed to get employee devices",
        });
      }

      if (!devices || devices.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No active device found for this employee",
        });
      }

      try {
        const notificationResults = [];

        for (const device of devices) {
          const tickets = await sendPushNotification({
            pushToken: device.push_token,

            title: "📞 Incoming CRM Call",

            body: `${customerName || "Customer"} • ${
              registrationNumber || phoneNumber || ""
            }`,

            data: {
              type: "CRM_CALL",

              leadId: leadId,

              customerName: customerName,

              phoneNumber: phoneNumber,

              registrationNumber: registrationNumber,

              model: model,
            },
          });

          notificationResults.push({
            deviceId: device.device_id,
            deviceName: device.device_name,
            tickets,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Notification sent successfully",
          devices: notificationResults,
        });
      } catch (error) {
        console.error("❌ Test notification error:", error);

        return res.status(500).json({
          success: 0,
          message: "Failed to send notification",
        });
      }
    });
  },
  registerDevice: (req, res) => {
    const { pushToken, device_name, user_id } = req.body;
    if (!pushToken) {
      return res.status(400).json({
        success: false,
        message: "Push token is required",
      });
    }

    registerDevice(user_id, pushToken, device_name, (error, result) => {
      if (error) {
        console.error("❌ Register device error:", error);

        return res.status(500).json({
          success: false,
          message: "Failed to register device",
        });
      }

      return res.status(result.action === "REGISTERED" ? 201 : 200).json({
        success: true,
        message:
          result.action === "REGISTERED"
            ? "Device registered successfully"
            : "Device updated successfully",
        deviceId: result.deviceId,
      });
    });
  },

  // ==========================================
  // NEW: SEND NOTIFICATION
  // ==========================================

  sendNotification: (req, res) => {
    const {
      title,
      message,
      notification_type,
      audience_type,
      audience_role,
      employee_ids,
      expires_at,
    } = req.body;

    // Authenticated admin user
    const created_by = req.user?.id;

    if (!created_by) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    // Validate required fields
    if (!title || !message || !audience_type) {
      return res.status(400).json({
        success: false,
        message: "Title, message and audience type are required",
      });
    }

    if (!["ALL", "ROLE", "SELECTED"].includes(audience_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid audience type",
      });
    }

    if (audience_type === "ROLE" && !audience_role) {
      return res.status(400).json({
        success: false,
        message: "Audience role is required",
      });
    }

    if (
      audience_type === "SELECTED" &&
      (!Array.isArray(employee_ids) || employee_ids.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one employee",
      });
    }

    // Save notification into database
    sendNotification(
      {
        title,
        message,
        notification_type,
        audience_type,
        audience_role,
        employee_ids,
        created_by,
        expires_at,
      },
      (error, result) => {
        if (error) {
          console.error("❌ Send notification error:", error);

          return res.status(500).json({
            success: false,
            message: error.message || "Failed to send notification",
          });
        }

        // ==========================================
        // SOCKET.IO REAL-TIME NOTIFICATION
        // ==========================================

        const io = req.io;

        const notificationData = {
          notification_id: result.notification_id,
          title,
          message,
          notification_type: notification_type || "GENERAL",
          created_by,
          created_at: new Date(),
        };

        result.employee_ids.forEach((employeeId) => {
          io.to(String(employeeId)).emit("NEW_NOTIFICATION", notificationData);
        });


        return res.status(201).json({
          success: true,
          message: "Notification sent successfully",
          data: {
            notification_id: result.notification_id,
            total_recipients: result.total_recipients,
          },
        });
      },
    );
  },

  // ==========================================
  // NEW: GET EMPLOYEE NOTIFICATIONS
  // ==========================================

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  getNotifications: (req, res) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    const CreatedById = Number(userId);

    getNotifications(CreatedById, (error, results) => {
      if (error) {
        console.error("❌ Get notifications error:", error);

        return res.status(500).json({
          success: false,
          message: "Failed to fetch notifications",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        data: results || [],
      });
    });
  },
  // ==========================================
  // NEW: GET UNREAD COUNT
  // ==========================================

  getUnreadCount: (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    getUnreadCount(userId, (error, count) => {
      if (error) {
        console.error("❌ Unread count error:", error);

        return res.status(500).json({
          success: false,
          message: "Failed to fetch unread count",
        });
      }

      return res.status(200).json({
        success: true,
        unread_count: count,
      });
    });
  },

  // ==========================================
  // NEW: MARK NOTIFICATION AS READ
  // ==========================================

  markAsRead: (req, res) => {
    const { userId, id } = req.params;

    const notificationId = Number(id);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    if (!Number.isSafeInteger(notificationId) || notificationId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    markAsRead(notificationId, userId, (error, result) => {
      if (error) {
        console.error("❌ Mark as read error:", error);

        return res.status(500).json({
          success: false,
          message: "Failed to update notification",
        });
      }

      return res.status(200).json({
        success: true,
        message: result.affectedRows
          ? "Notification marked as read"
          : "Notification already read or not found",
      });
    });
  },

  // ==========================================
  // NEW: MARK ALL NOTIFICATIONS AS READ
  // ==========================================

  markAllAsRead: (req, res) => {
    const {id} = req.params;

    const userId = Number(id);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    markAllAsRead(userId, (error, result) => {
      if (error) {
        console.error("❌ Mark all as read error:", error);

        return res.status(500).json({
          success: false,
          message: "Failed to update notifications",
        });
      }

      return res.status(200).json({
        success: true,
        message: "All notifications marked as read",
        updated_count: result.affectedRows,
      });
    });
  },

  // ==========================================
  // NEW: DELETE NOTIFICATION
  // ==========================================

  deleteNotification: (req, res) => {
    const { userId, id } = req.params;
    const empid = Number(userId);
    const notificationId = Number(id);



    if (!empid) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    if (!Number.isSafeInteger(notificationId) || notificationId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    deleteNotification(notificationId, empid, (error, result) => {
      if (error) {
        console.error("❌ Delete notification error:", error);

        return res.status(500).json({
          success: false,
          message: "Failed to delete notification",
        });
      }

      return res.status(200).json({
        success: true,
        message: result.affectedRows
          ? "Notification deleted successfully"
          : "Notification not found",
      });
    });
  },
  // ==========================================
  // REMOVE SENT NOTIFICATION
  // ==========================================

  removeNotification: (req, res) => {
    const { userId, id } = req.params;
    const empid = Number(userId);
    const notificationId = Number(id);

    if (!empid || !notificationId) {
      return res.status(400).json({
        success: false,
        message: "Invalid user or notification ID",
      });
    }

    removeNotification(notificationId, empid, (error, result) => {
      if (error) {
        console.error("Remove notification error:", error);

        return res.status(500).json({
          success: false,
          message: "Failed to remove notification",
        });
      }

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Notification not found or already removed",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Notification removed successfully",
      });
    });
  },

  getReceivedNotifications: (req, res) => {
    const userId = Number(req.params.userId);

    if (!userId) {
      return res.status(401).json({
        success: 0,
        message: "Unauthorized user",
      });
    }

    getReceivedNotifications(userId, (error, results) => {
      if (error) {
        console.error("Get received notifications error:", error);

        return res.status(500).json({
          success: 0,
          message: "Failed to fetch received notifications",
        });
      }

      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
};
