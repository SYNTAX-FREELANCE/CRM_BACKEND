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

  // ==========================================
  // SEND NOTIFICATION
  // ==========================================
  sendNotification: (notificationData, callback) => {
    const {
      title,
      message,
      notification_type,
      audience_type,
      audience_role,
      employee_ids,
      created_by,
      expires_at,
    } = notificationData;

    pool.getConnection((connectionError, connection) => {
      if (connectionError) {
        return callback(connectionError);
      }

      const releaseConnection = () => connection.release();

      connection.beginTransaction((transactionError) => {
        if (transactionError) {
          releaseConnection();
          return callback(transactionError);
        }

        // ==========================================
        // GET ACTIVE EMPLOYEES BASED ON AUDIENCE
        // ==========================================

        let employeeQuery = "";
        let queryParams = [];

        if (audience_type === "ALL") {
          employeeQuery = `
                    SELECT user_id
                    FROM users_master
                    WHERE is_active = 1 AND is_admin = 0;
                `;
        } else if (audience_type === "ROLE") {
          employeeQuery = `
                    SELECT um.user_id
                    FROM users_master um
                    INNER JOIN roles r
                        ON r.role_id = um.role_id
                    WHERE UPPER(TRIM(r.role_name)) = UPPER(TRIM(?))
                    AND r.is_active = 1
                    AND um.is_active = 1;
                `;

          queryParams = [audience_role];
        } else if (audience_type === "SELECTED") {
          const uniqueEmployeeIds = [
            ...new Set(
              (Array.isArray(employee_ids) ? employee_ids : [])
                .map(Number)
                .filter((id) => Number.isInteger(id) && id > 0),
            ),
          ];

          if (uniqueEmployeeIds.length === 0) {
            return connection.rollback(() => {
              releaseConnection();
              callback(new Error("No valid employees selected"));
            });
          }

          employeeQuery = `
                    SELECT user_id
                    FROM users_master
                    WHERE user_id IN (?)
                    AND is_active = 1;
                `;

          queryParams = [uniqueEmployeeIds];
        } else {
          return connection.rollback(() => {
            releaseConnection();
            callback(new Error("Invalid audience type"));
          });
        }

        // ==========================================
        // FETCH RECIPIENTS
        // ==========================================

        connection.query(
          employeeQuery,
          queryParams,
          (employeeError, employeeResults) => {
            if (employeeError) {
              return connection.rollback(() => {
                releaseConnection();
                callback(employeeError);
              });
            }

            const recipientIds = employeeResults.map(
              (employee) => employee.user_id,
            );

            if (recipientIds.length === 0) {
              return connection.rollback(() => {
                releaseConnection();
                callback(
                  new Error(
                    "No active employees found for the selected audience",
                  ),
                );
              });
            }

            // ==========================================
            // INSERT NOTIFICATION
            // ==========================================

            const notificationQuery = `
                        INSERT INTO notifications (
                            title,
                            message,
                            notification_type,
                            audience_type,
                            audience_role,
                            created_by,
                            expires_at
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `;

            const notificationParams = [
              title,
              message,
              notification_type || "GENERAL",
              audience_type,
              audience_type === "ROLE" ? audience_role : null,
              created_by,
              expires_at || null,
            ];

            connection.query(
              notificationQuery,
              notificationParams,
              (notificationError, notificationResult) => {
                if (notificationError) {
                  return connection.rollback(() => {
                    releaseConnection();
                    callback(notificationError);
                  });
                }

                const notificationId = notificationResult.insertId;

                // ==========================================
                // INSERT NOTIFICATION RECIPIENTS
                // ==========================================

                const recipientValues = recipientIds.map((employeeId) => [
                  notificationId,
                  employeeId,
                ]);

                const recipientQuery = `
                                INSERT INTO notification_recipients (
                                    notification_id,
                                    employee_id
                                )
                                VALUES ?
                            `;

                connection.query(
                  recipientQuery,
                  [recipientValues],
                  (recipientError) => {
                    if (recipientError) {
                      return connection.rollback(() => {
                        releaseConnection();
                        callback(recipientError);
                      });
                    }

                    // ==========================================
                    // COMMIT TRANSACTION
                    // ==========================================

                    connection.commit((commitError) => {
                      if (commitError) {
                        return connection.rollback(() => {
                          releaseConnection();
                          callback(commitError);
                        });
                      }

                      releaseConnection();

                      return callback(null, {
                        notification_id: notificationId,
                        total_recipients: recipientIds.length,
                        employee_ids: recipientIds,
                      });
                    });
                  },
                );
              },
            );
          },
        );
      });
    });
  },

  getNotifications: (CreatedById, callback) => {
    const query = `
        SELECT
            n.notification_id,
            n.title,
            n.message,
            n.notification_type,
            n.audience_type,
            n.audience_role,
            n.created_by,
            n.created_at,
            n.expires_at,

            COUNT(nr.id) AS total_recipients,

            CASE
                WHEN n.audience_type = 'SELECTED' THEN
                    COALESCE(
                        JSON_ARRAYAGG(
                            CASE
                                WHEN um.user_id IS NOT NULL THEN
                                    JSON_OBJECT(
                                        'user_id', um.user_id,
                                        'employee_id', um.employee_id,
                                        'name', um.name,
                                        'role_name', r.role_name
                                    )
                                ELSE NULL
                            END
                        ),
                        JSON_ARRAY()
                    )
                ELSE JSON_ARRAY()
            END AS recipients

        FROM notifications n

        LEFT JOIN notification_recipients nr
            ON nr.notification_id = n.notification_id
            AND nr.is_deleted = 0

        LEFT JOIN users_master um
            ON um.user_id = nr.employee_id

        LEFT JOIN roles r
            ON r.role_id = um.role_id

        WHERE n.created_by = ?
          AND n.is_removed = 0

        GROUP BY n.notification_id

        ORDER BY n.created_at DESC
    `;

    pool.query(query, [CreatedById], (error, results) => {
      if (error) {
        return callback(error);
      }

      return callback(null, results);
    });
  },

  // ==========================================
  // GET UNREAD COUNT
  // ==========================================

  getUnreadCount: (userId, callback) => {
    const query = `
      SELECT COUNT(*) AS unread_count

      FROM notification_recipients nr

      INNER JOIN notifications n
        ON n.notification_id = nr.notification_id

      WHERE nr.employee_id = ?
        AND nr.is_read = 0
        AND nr.is_deleted = 0
        AND (
          n.expires_at IS NULL
          OR n.expires_at > NOW()
        )
    `;

    pool.query(query, [userId], (error, results) => {
      if (error) {
        return callback(error);
      }

      return callback(null, results[0].unread_count);
    });
  },

  // ==========================================
  // MARK NOTIFICATION AS READ
  // ==========================================

  markAsRead: (notificationId, userId, callback) => {
    const query = `
      UPDATE notification_recipients

      SET
        is_read = 1,
        read_at = CURRENT_TIMESTAMP

      WHERE notification_id = ?
        AND employee_id = ?
        AND is_deleted = 0
        AND is_read = 0
    `;

    pool.query(query, [notificationId, userId], (error, result) => {
      if (error) {
        return callback(error);
      }

      return callback(null, result);
    });
  },

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  markAllAsRead: (userId, callback) => {
    const query = `
      UPDATE notification_recipients

      SET
        is_read = 1,
        read_at = CURRENT_TIMESTAMP

      WHERE employee_id = ?
        AND is_read = 0
        AND is_deleted = 0
    `;

    pool.query(query, [userId], (error, result) => {
      if (error) {
        return callback(error);
      }

      return callback(null, result);
    });
  },

  // ==========================================
  // DELETE NOTIFICATION FOR EMPLOYEE
  // ==========================================

  deleteNotification: (notificationId, userId, callback) => {
    const query = `
      UPDATE notification_recipients

      SET is_deleted = 1

      WHERE notification_id = ?
        AND employee_id = ?
        AND is_deleted = 0
    `;

    pool.query(query, [notificationId, userId], (error, result) => {
      if (error) {
        return callback(error);
      }

      return callback(null, result);
    });
  },
  // ==========================================
  // REMOVE SENT NOTIFICATION (SOFT DELETE)
  // ==========================================

  removeNotification: (notificationId, userId, callback) => {
    const query = `
        UPDATE notifications
        SET
            is_removed = 1,
            removed_at = NOW()
        WHERE notification_id = ?
          AND created_by = ?
          AND is_removed = 0
    `;

    pool.query(query, [notificationId, userId], (error, result) => {
      if (error) {
        return callback(error);
      }

      if (result.affectedRows === 0) {
        return callback(null, false);
      }

      return callback(null, true);
    });
  },
  getReceivedNotifications: (userId, callback) => {

    const query = `
        SELECT
            n.notification_id,
            n.title,
            n.message,
            n.notification_type,
            n.audience_type,
            n.audience_role,
            n.created_by,
            n.created_at,
            n.expires_at,

            nr.id AS recipient_id,
            nr.is_read,
            nr.read_at

        FROM notification_recipients nr

        INNER JOIN notifications n
            ON n.notification_id = nr.notification_id

        WHERE nr.employee_id = ?
          AND nr.is_deleted = 0
          AND n.is_removed = 0
          AND (
              n.expires_at IS NULL
              OR n.expires_at > NOW()
          )

        ORDER BY n.created_at DESC
    `;

    pool.query(query, [userId], (error, results) => {
      if (error) return callback(error);
      return callback(null, results);
    });
  },
};
