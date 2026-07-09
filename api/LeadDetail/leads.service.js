const pool = require("../../dbconfig/dbconfig");
const {
  getCustomer,
  getVehicles,
  getLeads,
  getFollowups,
  getStatusHistory,
} = require("./helper");

const query = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getFreshCalls: (empid, callback) => {
    pool.getConnection((err, connection) => {
      if (err) return callback(err);

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return callback(err);
        }

        // STEP 0: Ensure system_controls row exists
        connection.query(
          `INSERT INTO system_controls (empid)
           VALUES (?)
           ON DUPLICATE KEY UPDATE empid = empid`,
          [empid],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                callback(err);
              });
            }

            // STEP 1: GET CONTROL FLAGS
            connection.query(
              `SELECT allow_next_batch, force_unlock
               FROM system_controls
               WHERE empid = ?`,
              [empid],
              (err, ctrl) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    callback(err);
                  });
                }

                const control = ctrl?.[0] || {};
                const allow = control.allow_next_batch || 0;
                const force = control.force_unlock || 0;

                connection.query(
                  `SELECT COUNT(*) AS activeCount
                  FROM leads
                  WHERE assigned_to = ?
                    AND work_status = 'IN_PROGRESS'
                    AND is_locked = 1`,
                  [empid],
                  (err, activeRes) => {
                    if (err) {
                      return connection.rollback(() => {
                        connection.release();
                        callback(err);
                      });
                    }

                    const activeCount = activeRes?.[0]?.activeCount || 0;

                    // BLOCK IF ACTIVE LEADS EXIST
                    if (activeCount > 0 && allow !== 1 && force !== 1) {
                      return connection.rollback(() => {
                        connection.release();
                        callback(null, {
                          success: 0,
                          message: "Complete current leads first",
                          data: [],
                        });
                      });
                    }

                    // STEP 3: FETCH NEXT 10 LEADS
                    const fetchQuery = `
      SELECT
        l.lead_id,
        l.status_id,
        ls.status_name,
        l.lead_priority,
        l.lead_source,
        l.work_status,

        c.customer_id,
        c.customer_name,
        c.mobile_number_1,
        c.mobile_number_2,
        c.email,
        c.address,
        c.city,
        c.district,
        c.state,

        v.vehicle_id,
        v.registration_number,
        v.model,
        v.vehicle_maker,
        v.engine_number,
        v.chassis_number,

        p.policy_id,
        p.policy_number,
        p.policy_type,
        p.start_date,
        p.expiry_date,
        p.premium_amount

      FROM leads l
      INNER JOIN customers c ON c.customer_id = l.customer_id
      INNER JOIN vehicles v ON v.vehicle_id = l.vehicle_id
      LEFT JOIN policies p ON p.policy_id = l.policy_id
      INNER JOIN lead_status_master ls ON ls.status_id = l.status_id

      WHERE l.assigned_to = ?
        AND l.status_id = 1
        AND l.work_status = 'PENDING'
        AND l.is_locked = 0

      ORDER BY l.created_at ASC
      LIMIT 10
    `;

                    connection.query(fetchQuery, [empid], (err, leads) => {
                      if (err) {
                        return connection.rollback(() => {
                          connection.release();
                          callback(err);
                        });
                      }

                      if (!leads || leads.length === 0) {
                        return connection.commit(() => {
                          connection.release();
                          callback(null, {
                            success: 1,
                            message: "No leads available",
                            data: [],
                          });
                        });
                      }

                      const leadIds = leads.map((l) => l.lead_id);

                      // STEP 4: LOCK LEADS
                      connection.query(
                        `UPDATE leads
         SET is_locked = 1,
             work_status = 'IN_PROGRESS',
             assigned_date = NOW()
         WHERE lead_id IN (?)`,
                        [leadIds],
                        (err) => {
                          if (err) {
                            return connection.rollback(() => {
                              connection.release();
                              callback(err);
                            });
                          }

                          // STEP 5: GET NEXT BATCH NUMBER
                          connection.query(
                            `SELECT COALESCE(MAX(batch_no),0)+1 AS batchNo
             FROM employee_active_batches
             WHERE empid = ?`,
                            [empid],
                            (err, batchResult) => {
                              if (err) {
                                return connection.rollback(() => {
                                  connection.release();
                                  callback(err);
                                });
                              }

                              const batchNo = batchResult[0].batchNo;

                              // STEP 6: SAVE ACTIVE BATCH
                              const values = leadIds.map((leadId) => [
                                empid,
                                leadId,
                                batchNo,
                                "ACTIVE",
                              ]);

                              connection.query(
                                `INSERT INTO employee_active_batches
                (empid, lead_id, batch_no, status)
                VALUES ?`,
                                [values],
                                (err) => {
                                  if (err) {
                                    return connection.rollback(() => {
                                      connection.release();
                                      callback(err);
                                    });
                                  }

                                  // STEP 7: RESET CONTROL FLAGS
                                  connection.query(
                                    `UPDATE system_controls
                     SET allow_next_batch = 0,
                         force_unlock = 0
                     WHERE empid = ?`,
                                    [empid],
                                    (err) => {
                                      if (err) {
                                        return connection.rollback(() => {
                                          connection.release();
                                          callback(err);
                                        });
                                      }

                                      connection.commit((err) => {
                                        connection.release();

                                        if (err) return callback(err);

                                        callback(null, {
                                          success: 1,
                                          message:
                                            "Next 10 leads assigned successfully",
                                          data: leads,
                                        });
                                      });
                                    },
                                  );
                                },
                              );
                            },
                          );
                        },
                      );
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
  updateLeadDetail: (data, callback) => {
    pool.query(
      `UPDATE leads
     SET
        status_id = ?,
        remarks = ?,
        work_status= 'COMPLETED',
        edited_by = ?
     WHERE lead_id = ?`,
      [data.new_status_id, data.remarks, data.created_by, data.lead_id],
      (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
      },
    );
  },

  updateLeadFollowupDetail: (data, callback) => {
    pool.query(
      `INSERT INTO lead_followups
    (
      lead_id,
      status_id,
      call_outcome,
      remarks,
      next_followup_date,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.lead_id,
        data.new_status_id,
        data.call_outcome,
        data.remarks,
        data.next_followup_date,
        data.created_by,
      ],
      (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
      },
    );
  },

  updateLeadStatusHistory: (data, callback) => {
    pool.query(
      `INSERT INTO lead_status_history
    (
      lead_id,
      old_status_id,
      new_status_id,
      remarks,
      status_change_reason,
      changed_by
    )
    VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.lead_id,
        data.old_status_id,
        data.new_status_id,
        data.remarks,
        data.status_change_reason,
        data.created_by,
      ],
      (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
      },
    );
  },
  getActiveBatch: (empid, statusId, callback) => {
    const workStatus = Number(statusId) === 1 ? "IN_PROGRESS" : "COMPLETED";

    pool.query(
      `
    SELECT
        l.lead_id,
        l.status_id,
        ls.status_name,
        ls.requires_followup,
        ls.is_call_required,
        ls.is_policy_required,
        l.lead_priority,
        l.lead_source,
        l.work_status,

        c.customer_id,
        c.customer_name,
        c.mobile_number_1,
        c.mobile_number_2,
        c.email,
        c.address,
        c.city,
        c.district,
        c.state,

        v.vehicle_id,
        v.registration_number,
        v.model,
        v.vehicle_maker,
        v.engine_number,
        v.chassis_number,

        p.policy_id,
        p.policy_number,
        p.policy_type,
        p.start_date,
        p.expiry_date,
        p.premium_amount

    FROM leads l

    INNER JOIN customers c
        ON c.customer_id = l.customer_id

    INNER JOIN vehicles v
        ON v.vehicle_id = l.vehicle_id

    LEFT JOIN policies p
        ON p.policy_id = l.policy_id

    INNER JOIN lead_status_master ls
        ON ls.status_id = l.status_id

    WHERE
        l.assigned_to = ?
        AND l.status_id = ?
        AND l.work_status = ?
        AND (
              l.is_locked = 1
              OR ? <> 1
            )

    ORDER BY l.assigned_date DESC, l.created_at DESC
    `,
      [empid, statusId, workStatus, Number(statusId)],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      },
    );
  },

  updateEmployeeBatchStatus: (data, callback) => {
    pool.query(
      `UPDATE employee_active_batches
     SET status = 'COMPLETED'
     WHERE empid = ?
       AND lead_id = ?
       AND status = 'ACTIVE'`,
      [data.created_by, data.lead_id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      },
    );
  },
  getLeadHistory: (leadid, callback) => {
    pool.query(
      `
    SELECT 
    history_id,
    lsh.lead_id,
    old_status_id,
    new_status_id,
    remarks,
    status_change_reason,
    changed_by,
    changed_at,
    olsm.status_name as old_status_name,
    nlsm.status_name as new_status_name
FROM
    lead_status_history lsh
        LEFT JOIN
    lead_status_master olsm ON olsm.status_id = lsh.old_status_id
        LEFT JOIN
    lead_status_master nlsm ON nlsm.status_id = lsh.new_status_id
WHERE
    lsh.lead_id = ?;
    `,
      [leadid],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      },
    );
  },
  getFollowUpDetail: (leadid, statusId, callback) => {
    pool.query(
      `
    SELECT 
    followup_id,
    lf.lead_id,
    lf.status_id,
    call_outcome,
    remarks,
    next_followup_date,
    lsm.status_name
    FROM
        lead_followups lf
    LEFT JOIN lead_status_master lsm on  lsm.status_id = lf.status_id
    WHERE
        lf.lead_id = ? AND lf.status_id = ?;
    `,
      [leadid, statusId],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      },
    );
  },
  updateLeadPolicy: (data, callback) => {
    const policy = data.policy;

    pool.query(
      `INSERT INTO policies
    (
      customer_id,
      vehicle_id,
      insurance_company_id,
      policy_number,
      policy_type,
      renewal_year,
      renewal_cycle,
      previous_policy_id,
      start_date,
      expiry_date,
      premium_amount,
      insured_declared_value,
      reminder_days,
      policy_status,
      remarks,
      is_active,
      created_by,
      lead_id
    )
    VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.customer_id,
        data.vehicle_id,

        policy.insurance_company_id,
        policy.policy_number,
        policy.policy_type || null,

        policy.renewal_year,
        policy.renewal_cycle,

        policy.previous_policy_id || null,

        policy.start_date,
        policy.expiry_date,

        policy.premium_amount,
        policy.insured_declared_value,

        policy.reminder_days || 30,

        "ACTIVE",

        policy.remarks || null,

        1,

        data.created_by,

        data.lead_id,
      ],
      (err, result) => {
        if (err) return callback(err);

        callback(null, result);
      },
    );
  },
  getDashboardCount: (empid, callback) => {
    pool.query(
      `SELECT
    lsm.status_id,
    lsm.status_name,
    COUNT(l.lead_id) AS total_count
FROM lead_status_master lsm
LEFT JOIN leads l
    ON l.status_id = lsm.status_id
    AND l.assigned_to = ? AND work_status != 'PENDING'
GROUP BY
    lsm.status_id,
    lsm.status_name,
    lsm.display_order
ORDER BY
    lsm.display_order`,
      [empid],
      (err, result) => {
        if (err) return callback(err);

        callback(null, result);
      },
    );
  },

  getDashboardReminders: async (empid, callback) => {
    try {
      const summaryQuery = `
      SELECT
        SUM(CASE WHEN DATE(lf.next_followup_date) < CURDATE() THEN 1 ELSE 0 END) AS overdue,

        SUM(CASE WHEN DATE(lf.next_followup_date) = CURDATE() THEN 1 ELSE 0 END) AS today,

        SUM(CASE WHEN DATE(lf.next_followup_date) = DATE_ADD(CURDATE(), INTERVAL 1 DAY) THEN 1 ELSE 0 END) AS tomorrow,

        SUM(CASE 
          WHEN DATE(lf.next_followup_date) BETWEEN 
               DATE_ADD(CURDATE(), INTERVAL 2 DAY)
               AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
          THEN 1 ELSE 0 
        END) AS next7days

      FROM lead_followups lf
      INNER JOIN leads l ON l.lead_id = lf.lead_id
      WHERE l.assigned_to = ?;
    `;

      const followupQuery = `
      SELECT
        lf.followup_id,
        lf.lead_id,

        c.customer_name,
        c.mobile_number_1,
        c.mobile_number_2,
        c.address,
        c.city,

        v.registration_number,
        v.model,
        v.fuel_type,
        v.vehicle_category,

        lsm.status_name,
        lf.call_outcome,
        lf.remarks,
        lf.next_followup_date,

        TIME_FORMAT(lf.next_followup_date, '%h:%i %p') AS followup_time,

        CASE
          WHEN lsm.status_name='CALLBACK' THEN 'Callback'
          WHEN lsm.status_name='APPOINMENT' THEN 'Appointment'
          WHEN lsm.status_name='QUOTE' THEN 'Quote'
          WHEN lsm.status_name='SOLD' THEN 'Policy Sold'
          WHEN lsm.status_name='LOST' THEN 'Lost Lead'
          ELSE lsm.status_name
        END AS action,

        CASE
          WHEN DATE(lf.next_followup_date) < CURDATE() THEN 'overdue'
          WHEN DATE(lf.next_followup_date) = CURDATE() THEN 'today'
          WHEN DATE(lf.next_followup_date) = DATE_ADD(CURDATE(), INTERVAL 1 DAY) THEN 'tomorrow'
          ELSE 'upcoming'
        END AS bucket

      FROM lead_followups lf
      INNER JOIN leads l ON l.lead_id = lf.lead_id
      INNER JOIN customers c ON c.customer_id = l.customer_id
      INNER JOIN vehicles v ON v.vehicle_id = l.vehicle_id
      INNER JOIN lead_status_master lsm ON lsm.status_id = lf.status_id

      WHERE l.assigned_to = ?
      ORDER BY lf.next_followup_date ASC;
    `;

      const [summary, rows] = await Promise.all([
        query(summaryQuery, [empid]),
        query(followupQuery, [empid]),
      ]);

      //  NO JS DATE LOGIC (ONLY BUCKET)
      const overdue = [];
      const today = [];
      const tomorrow = [];
      const upcoming = [];

      rows.forEach((row) => {
        switch (row.bucket) {
          case "overdue":
            overdue.push(row);
            break;
          case "today":
            today.push(row);
            break;
          case "tomorrow":
            tomorrow.push(row);
            break;
          default:
            upcoming.push(row);
        }
      });

      callback(null, {
        summary: summary[0],
        overdue,
        today,
        tomorrow,
        upcoming,
      });
    } catch (err) {
      callback(err);
    }
  },
  searchCRM: (search, callback) => {
    const sql = `
SELECT DISTINCT

    c.customer_id,
    c.customer_name,
    c.mobile_number_1,
    c.mobile_number_2,
    c.city,
            c.district,
            c.state,
    v.vehicle_id,
    v.registration_number,

    l.lead_id,
    l.work_status,
    l.lead_priority,

    ls.status_name

FROM customers c

LEFT JOIN vehicles v
ON c.customer_id = v.customer_id

LEFT JOIN leads l
ON l.customer_id = c.customer_id
AND l.vehicle_id = v.vehicle_id

LEFT JOIN lead_status_master ls
ON ls.status_id = l.status_id

WHERE

      c.customer_name LIKE CONCAT('%', ?, '%')

   OR c.mobile_number_1 LIKE CONCAT('%', ?, '%')

   OR c.mobile_number_2 LIKE CONCAT('%', ?, '%')

   OR v.registration_number LIKE CONCAT('%', ?, '%')

ORDER BY

CASE

WHEN v.registration_number = ? THEN 1
WHEN c.mobile_number_1 = ? THEN 2
WHEN c.mobile_number_2 = ? THEN 3
WHEN c.customer_name LIKE CONCAT(?, '%') THEN 4
ELSE 5

END,

c.customer_name

LIMIT 20;
`;

    pool.query(
      sql,
      [search, search, search, search, search, search, search, search],

      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      },
    );
  },

  getCustomerDetails: (customerId, callback) => {
    pool.getConnection((err, connection) => {
      if (err) return callback(err);

      getCustomer(connection, customerId, (err, customer) => {
        if (err) {
          connection.release();
          return callback(err);
        }

        getVehicles(connection, customerId, (err, vehicles) => {
          if (err) {
            connection.release();
            return callback(err);
          }

          getLeads(connection, customerId, (err, leads) => {
            if (err) {
              connection.release();
              return callback(err);
            }

            getFollowups(connection, customerId, (err, followups) => {
              if (err) {
                connection.release();
                return callback(err);
              }

              getStatusHistory(connection, customerId, (err, statusHistory) => {
                connection.release();

                if (err) {
                  return callback(err);
                }

                // Build JSON here
                const result = {
                  customer: customer[0] || null,
                  vehicles: vehicles || [],
                  leads: leads || [],
                  followups: followups || [],
                  statusHistory: statusHistory || [],
                };

                return callback(null, result);
              });
            });
          });
        });
      });
    });
  },

  getAdminDashboardCounts: (fromDate, toDate, callback) => {
    const params = [];
    let where = "";

    if (fromDate && toDate) {
      where = "WHERE DATE(l.created_at) BETWEEN ? AND ?";
      params.push(fromDate, toDate);
    }

    const sql = `
        SELECT
            COUNT(l.lead_id) AS totalUploaded,

            SUM(CASE
                WHEN l.is_locked = 1 THEN 1
                ELSE 0
            END) AS totalFetched,

            SUM(CASE
                WHEN l.work_status = 'PENDING' THEN 1
                ELSE 0
            END) AS totalPending,

            SUM(CASE
                WHEN l.work_status = 'IN_PROGRESS' THEN 1
                ELSE 0
            END) AS totalInProgress,

            SUM(CASE
                WHEN l.work_status = 'COMPLETED' THEN 1
                ELSE 0
            END) AS totalCompleted,

            SUM(CASE
                WHEN l.status_id = 1 THEN 1
                ELSE 0
            END) AS totalNew,

            SUM(CASE
                WHEN l.status_id = 2 THEN 1
                ELSE 0
            END) AS totalCallback,

            SUM(CASE
                WHEN l.status_id = 3 THEN 1
                ELSE 0
            END) AS totalQuote,

            SUM(CASE
                WHEN l.status_id = 4 THEN 1
                ELSE 0
            END) AS totalAppointment,

            SUM(CASE
                WHEN l.status_id = 5 THEN 1
                ELSE 0
            END) AS totalSold,

            SUM(CASE
                WHEN l.status_id = 6 THEN 1
                ELSE 0
            END) AS totalLost

        FROM leads l

        ${where};
    `;

    pool.query(sql, params, (err, result) => {
      if (err) return callback(err);
      callback(null, result[0]);
    });
  },

  getEmployyeeRecentAcivity: (callback) => {
    const sql = `
SELECT
    lsh.history_id,
    lsh.lead_id,
    lsm.status_name,
    lsh.remarks,
    lsh.status_change_reason,
    um.name,
    lsh.changed_at
FROM lead_status_history lsh

INNER JOIN lead_status_master lsm
    ON lsh.new_status_id = lsm.status_id

LEFT JOIN users_master um
    ON lsh.changed_by = um.user_id

INNER JOIN leads l
    ON lsh.lead_id = l.lead_id

ORDER BY lsh.changed_at DESC
LIMIT 10
`;

    pool.query(
      sql,
      [],

      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      },
    );
  },
  getActiveEmployees: (callback) => {
    pool.query(
      `
    SELECT
        u.user_id,
        u.employee_id,
        u.name,
        r.role_name,
        MAX(eab.batch_no) AS current_batch,

        COUNT(
            CASE
                WHEN eab.status='ACTIVE'
                THEN eab.lead_id
            END
        ) AS pending_leads,

        MIN(eab.assigned_at) AS batch_assigned_at

    FROM employee_active_batches eab

    INNER JOIN users_master u
        ON u.user_id = eab.empid

    LEFT JOIN roles r
        ON r.role_id = u.role_id

    WHERE eab.status='ACTIVE'

    GROUP BY
        u.user_id,
        u.employee_id,
        u.name,
        r.role_name

    ORDER BY batch_assigned_at ASC
    `,
      (err, result) => {
        if (err) return callback(err);

        callback(null, result);
      },
    );
  },
  getEmployeeBatchDetail: (empid, callback) => {
    pool.query(
      `
SELECT

u.user_id,
u.employee_id,
u.name,
r.role_name,

eab.batch_no,
eab.assigned_at,

l.lead_id,
l.work_status,
l.lead_priority,
l.lead_source,
l.remarks,

c.customer_id,
c.customer_name,
c.mobile_number_1,
c.mobile_number_2,
c.city,
c.district,
c.state,

v.vehicle_id,
v.registration_number,
v.vehicle_maker,
v.model,
v.engine_number,
v.chassis_number

FROM employee_active_batches eab

INNER JOIN users_master u
ON u.user_id=eab.empid

LEFT JOIN roles r
ON r.role_id=u.role_id

INNER JOIN leads l
ON l.lead_id=eab.lead_id

INNER JOIN customers c
ON c.customer_id=l.customer_id

INNER JOIN vehicles v
ON v.vehicle_id=l.vehicle_id

WHERE
eab.empid=?
AND eab.status='ACTIVE'

ORDER BY
eab.batch_no,
eab.assigned_at,
l.lead_id

`,
      [empid],
      (err, result) => {
        if (err) return callback(err);

        callback(null, result);
      },
    );
  },
};
