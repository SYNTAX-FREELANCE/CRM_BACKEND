const { sendPushNotification } = require("../../service/notificationService");
const {
  registerDevice,
  getActiveDeviceTokens,
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
          success: true,
          message: "Notification sent successfully",
          devices: notificationResults,
        });
      } catch (error) {
        console.error("❌ Test notification error:", error);

        return res.status(500).json({
          success: false,
          message: "Failed to send notification",
        });
      }
    });
  },
  registerDevice: (req, res) => {
    const userId = req.user.user_id;
    const { pushToken, device_name } = req.body;
    if (!pushToken) {
      return res.status(400).json({
        success: false,
        message: "Push token is required",
      });
    }

    registerDevice(userId, pushToken, device_name, (error, result) => {
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
};
