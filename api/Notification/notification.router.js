// routes/notification.routes.js

const express = require("express");
const router = express.Router();

const notificationcontroller = require("./notification.controller");

const verifyAccessToken = require("../../middleware/verifyAccessToken");

// Create Call Log
// router.post(
//   "/send",
//   verifyAccessToken,
//   notificationcontroller.createCallLog,
// );

router.post(
  "/test",
  verifyAccessToken,
  notificationcontroller.testNotification,
);

router.post(
  "/register-device",
  verifyAccessToken,
  notificationcontroller.registerDevice,
);

// ==========================================
// NEW NOTIFICATION ROUTES
// ==========================================

// Send notification (Admin)
router.post(
  "/send",
  verifyAccessToken,
  notificationcontroller.sendNotification,
);

// Get employee notifications
router.get(
  "/list/:userId",
  verifyAccessToken,
  notificationcontroller.getNotifications,
);

// Get unread notification count
router.get(
  "/unread-count",
  verifyAccessToken,
  notificationcontroller.getUnreadCount,
);

// Mark notification as read
router.post("/read/:id/:userId", verifyAccessToken, notificationcontroller.markAsRead);

// Mark all notifications as read
router.post(
  "/read-all/:id",
  verifyAccessToken,
  notificationcontroller.markAllAsRead,
);

// Delete notification for employee
router.put(
  "/delete/:id/:userId",
  verifyAccessToken,
  notificationcontroller.deleteNotification,
);

router.put(
  "/remove/:id/:userId",
  verifyAccessToken,
  notificationcontroller.removeNotification,
);

router.get(
    "/received/:userId",
    verifyAccessToken,
    notificationcontroller.getReceivedNotifications
);

module.exports = router;
