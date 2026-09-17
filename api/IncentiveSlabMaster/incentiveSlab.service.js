const pool = require("../../dbconfig/dbconfig");

module.exports = {
  // ==================== CREATE INCENTIVE SLAB ====================

  createIncentiveSlab: (incentiveSlabData, callback) => {
    pool.query(
      `INSERT INTO incentive_scheme_slab
            (
                incentive_scheme_id,
                minimum_capture,
                incentive_amount,
                rate_per_capture,
                created_by,
                created_at
            )
            VALUES (?, ?, ?,?, CURRENT_TIMESTAMP)`,

      [
        incentiveSlabData.incentive_scheme_id,

        incentiveSlabData.minimum_capture,

        incentiveSlabData.incentive_amount,

        incentiveSlabData.rate_per_capture,

        incentiveSlabData.created_by,
      ],

      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      },
    );
  },

  // ==================== GET ALL INCENTIVE SLABS ====================

  getAllIncentiveSlabs: (callback) => {
    pool.query(
      `SELECT
                iss.*,
                ism.scheme_name
             FROM incentive_scheme_slab iss
             LEFT JOIN incentive_scheme_master ism
                ON iss.incentive_scheme_id =
                   ism.incentive_scheme_id
             ORDER BY
                ism.scheme_name ASC,
                iss.minimum_capture ASC`,

      [],

      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      },
    );
  },

  // ==================== GET INCENTIVE SLAB BY ID ====================

  getIncentiveSlabById: (incentiveSlabId, callback) => {
    pool.query(
      `SELECT
                iss.*,
                ism.scheme_name
             FROM incentive_scheme_slab iss
             LEFT JOIN incentive_scheme_master ism
                ON iss.incentive_scheme_id =
                   ism.incentive_scheme_id
             WHERE
                iss.incentive_slab_id = ?`,

      [incentiveSlabId],

      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        if (!result || result.length === 0) {
          return callback(null, null);
        }

        callback(null, result[0]);
      },
    );
  },

  // ==================== UPDATE INCENTIVE SLAB ====================

  updateIncentiveSlab: (incentiveSlabId, incentiveSlabData, callback) => {
    pool.query(
      `UPDATE incentive_scheme_slab
             SET
                incentive_scheme_id = ?,
                minimum_capture = ?,
                incentive_amount = ?,
                rate_per_capture = ?,
                updated_by = ? ,
                updated_at = CURRENT_TIMESTAMP
             WHERE
                incentive_slab_id = ?`,

      [
        incentiveSlabData.incentive_scheme_id,

        incentiveSlabData.minimum_capture,

        incentiveSlabData.incentive_amount,

        incentiveSlabData.rate_per_capture,

        incentiveSlabData.updated_by,

        incentiveSlabId,
      ],

      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      },
    );
  },

  // ==================== DELETE INCENTIVE SLAB ====================

  deleteIncentiveSlab: (incentiveSlabId, callback) => {
    pool.query(
      `DELETE FROM incentive_scheme_slab
             WHERE incentive_slab_id = ?`,

      [incentiveSlabId],

      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      },
    );
  },

  // ==================== GET INCENTIVE SLABS BY EMPLOYEE ====================

  getIncentiveSlabsByEmployee: (employeeId, callback) => {
    pool.query(
      `SELECT
            iss.incentive_slab_id,
            iss.incentive_scheme_id,
            ism.scheme_name,
            ism.employee_level_id,
            elm.level_name,
            iss.minimum_capture,
            iss.incentive_amount
         FROM users_master um
         INNER JOIN employee_level_master elm
            ON um.employee_level_id = elm.employee_level_id
         INNER JOIN incentive_scheme_master ism
            ON ism.employee_level_id = elm.employee_level_id
            AND ism.is_active = 1
         INNER JOIN incentive_scheme_slab iss
            ON iss.incentive_scheme_id = ism.incentive_scheme_id
         WHERE um.user_id = ?
            AND um.is_active = 1
            AND elm.is_active = 1
         ORDER BY iss.minimum_capture ASC `,
      [employeeId],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result);
      },
    );
  },
  calculateIncentive: (employeeId, captureCount, callback) => {
    // --------------------------------------------------
    // STEP 1
    // Get employee level
    // --------------------------------------------------

    const employeeQuery = `
        SELECT
            um.user_id,
            um.employee_level_id,
            elm.level_name
        FROM users_master um
        INNER JOIN employee_level_master elm
            ON um.employee_level_id = elm.employee_level_id
        WHERE um.user_id = ?
          AND um.is_active = 1
          AND elm.is_active = 1
        LIMIT 1
    `;

    pool.query(employeeQuery, [employeeId], (employeeError, employeeResult) => {
      if (employeeError) {
        return callback(employeeError);
      }

      // Employee not found
      if (!employeeResult.length) {
        return callback(null, {
          employee_found: false,
        });
      }

      const employee = employeeResult[0];

      const employeeLevelId = employee.employee_level_id;

      // Make sure capture count is a number
      const totalCaptures = Number(captureCount) || 0;

      // --------------------------------------------------
      // STEP 2
      // Find applicable incentive slab
      // --------------------------------------------------

      const slabQuery = `
            SELECT
                iss.incentive_slab_id,
                iss.incentive_scheme_id,
                iss.minimum_capture,
                iss.incentive_amount,
                iss.rate_per_capture,

                ism.scheme_name,
                ism.employee_level_id,

                elm.level_name

            FROM incentive_scheme_slab iss

            INNER JOIN incentive_scheme_master ism
                ON iss.incentive_scheme_id =
                   ism.incentive_scheme_id

            INNER JOIN employee_level_master elm
                ON ism.employee_level_id =
                   elm.employee_level_id

            WHERE ism.employee_level_id = ?

              AND ism.is_active = 1

              AND elm.is_active = 1

              AND iss.minimum_capture <= ?

            ORDER BY
                iss.minimum_capture DESC

            LIMIT 1
        `;

      pool.query(
        slabQuery,
        [employeeLevelId, totalCaptures],
        (slabError, slabResult) => {
          if (slabError) {
            return callback(slabError);
          }

          // --------------------------------------------------
          // STEP 3
          // No applicable slab
          // --------------------------------------------------

          if (!slabResult.length) {
            const schemeQuery = `
                    SELECT
                        incentive_scheme_id,
                        scheme_name
                    FROM incentive_scheme_master
                    WHERE employee_level_id = ?
                      AND is_active = 1
                    LIMIT 1
                `;

            pool.query(
              schemeQuery,
              [employeeLevelId],
              (schemeError, schemeResult) => {
                if (schemeError) {
                  return callback(schemeError);
                }

                // No scheme
                if (!schemeResult.length) {
                  return callback(null, {
                    employee_found: true,
                    scheme_found: false,

                    employee_level_id: employeeLevelId,

                    level_name: employee.level_name,
                  });
                }

                // Scheme exists but minimum capture
                // has not been reached
                return callback(null, {
                  employee_found: true,
                  scheme_found: true,
                  slab_found: false,

                  employee_level_id: employeeLevelId,

                  level_name: employee.level_name,

                  incentive_scheme_id: schemeResult[0].incentive_scheme_id,

                  scheme_name: schemeResult[0].scheme_name,

                  capture_count: totalCaptures,

                  current_incentive: 0,
                });
              },
            );

            return;
          }

          // --------------------------------------------------
          // STEP 4
          // Applicable slab found
          // --------------------------------------------------

          const slab = slabResult[0];

          const minimumCapture = Number(slab.minimum_capture);

          const incentiveAmount = Number(slab.incentive_amount);

          const ratePerCapture = Number(slab.rate_per_capture);

          // --------------------------------------------------
          // Calculate extra captures
          // --------------------------------------------------

          const extraCaptures = totalCaptures - minimumCapture;

          // --------------------------------------------------
          // Calculate current incentive
          // --------------------------------------------------
          //
          // Example:
          //
          // Slab:
          // minimum_capture = 5
          // incentive_amount = 500
          // rate_per_capture = 100
          //
          // 5 captures
          // = 500
          //
          // 6 captures
          // = 500 + (1 × 100)
          // = 600
          //
          // 7 captures
          // = 500 + (2 × 100)
          // = 700
          //
          // 8 captures
          // = 500 + (3 × 100)
          // = 800
          //
          // When capture reaches 10:
          // The 10-capture slab becomes applicable.
          //
          // 10 captures
          // = 10,000
          // --------------------------------------------------

          const currentIncentive =
            incentiveAmount + extraCaptures * ratePerCapture;

          // --------------------------------------------------
          // STEP 5
          // Return result
          // --------------------------------------------------

          return callback(null, {
            employee_found: true,

            scheme_found: true,

            slab_found: true,

            employee_level_id: employeeLevelId,

            level_name: employee.level_name,

            incentive_scheme_id: slab.incentive_scheme_id,

            scheme_name: slab.scheme_name,

            incentive_slab_id: slab.incentive_slab_id,

            minimum_capture: minimumCapture,

            incentive_amount: incentiveAmount,

            rate_per_capture: Number(ratePerCapture.toFixed(2)),

            capture_count: totalCaptures,

            extra_captures: extraCaptures,

            current_incentive: Number(currentIncentive.toFixed(2)),
          });
        },
      );
    });
  },
};
