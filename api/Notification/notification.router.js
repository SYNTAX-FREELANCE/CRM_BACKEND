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


module.exports = router;
