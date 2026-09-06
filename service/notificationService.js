const { Expo } = require("expo-server-sdk");

const expo = new Expo();

const sendPushNotification = async ({
  pushToken,
  title,
  body,
  data = {},
}) => {
  try {
    if (!pushToken) {
      console.log("❌ No push token provided");
      return;
    }

    if (!Expo.isExpoPushToken(pushToken)) {
      console.log("❌ Invalid Expo push token:", pushToken);
      return;
    }

    const message = {
      to: pushToken,
      sound: "default",
      title,
      body,
      data,
    };

    const tickets = await expo.sendPushNotificationsAsync([message]);

    console.log("📨 Push notification sent:", tickets);

    return tickets;
  } catch (error) {
    console.error("❌ Push notification error:", error);
    throw error;
  }
};

module.exports = {
  sendPushNotification,
};