const pool = require("../../dbconfig/dbconfig");

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

                                // STEP 2: CHECK ACTIVE BATCH
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

                                        // BLOCK IF ACTIVE BATCH EXISTS
                                        if (activeCount > 0 && allow !== 1 && force !== 1) {
                                            return connection.rollback(() => {
                                                connection.release();
                                                callback(null, {
                                                    success: 0,
                                                    message: "Complete current 10 leads first",
                                                    data: []
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
                                                        data: []
                                                    });
                                                });
                                            }

                                            const leadIds = leads.map(l => l.lead_id);

                                            // STEP 4: LOCK LEADS + MARK IN PROGRESS
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
                                                    // STEP 5: RESET CONTROL FLAGS AFTER BATCH ALLOCATION
                                                    connection.query(
                                                        `UPDATE system_controls
                                                            SET allow_next_batch = 0,
                                                                force_unlock = 0,
                                                                batch_active = 1,
                                                                active_batch_ids = ?
                                                            WHERE empid = ?`,
                                                        [JSON.stringify(leadIds), empid],
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

                                                                return callback(null, {
                                                                    success: 1,
                                                                    message: "Next 10 leads assigned successfully",
                                                                    data: leads
                                                                });
                                                            });
                                                        }
                                                    );
                                                }
                                            );
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            });
        });
    }
};