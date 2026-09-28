const pool = require("../../dbconfig/dbconfig");
module.exports = {
  registerDevice: (userId, pushToken, device_name, callback) => {
    const checkQuery = `
    SELECT device_id
    FROM employee_devices
    WHERE push_token = ?
    LIMIT 1
  `;

    pool.query(checkQuery, [pushToken], (error, results) => {
      if (error) {
        return callback(error);
      }
      // Token already exists
      if (results.length > 0) {
        const updateQuery = `
        UPDATE employee_devices
        SET
          user_id = ?,
          is_active = 1,
          last_registered_at = CURRENT_TIMESTAMP
        WHERE push_token = ?
      `;

        return pool.query(updateQuery, [userId, pushToken], (error) => {
          if (error) {
            return callback(error);
          }

          return callback(null, {
            action: "UPDATED",
            deviceId: results[0].device_id,
          });
        });
      }

      // New device
      const insertQuery = `
      INSERT INTO employee_devices
      (
        user_id,
        push_token,
        device_name,
        platform,
        is_active,
        last_registered_at
      )
      VALUES (?, ?,?, 'ANDROID', 1, CURRENT_TIMESTAMP)
    `;

      pool.query(
        insertQuery,
        [userId, pushToken, device_name],
        (error, result) => {
          if (error) {
            return callback(error);
          }

          return callback(null, {
            action: "REGISTERED",
            deviceId: result.insertId,
          });
        },
      );
    });
  },
  getActiveDeviceTokens: (userId, callback) => {
    const query = `
    SELECT
      device_id,
      push_token,
      platform,
      device_name
    FROM employee_devices
    WHERE user_id = ?
      AND is_active = 1
  `;

    pool.query(query, [userId], (error, results) => {
      if (error) {
        return callback(error);
      }

      return callback(null, results);
    });
  },
};
