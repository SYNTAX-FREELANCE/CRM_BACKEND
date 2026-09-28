const pool = require("../../../dbconfig/dbconfig");

const MotorQuotationService = {
  // CREATE
  createQuotation: (data, callback) => {
    const query = `
            INSERT INTO motor_quotations (
                quotation_number,
                lead_id,
                customer_id,
                vehicle_id,
                quotation_date,
                valid_until,
                status,
                created_by
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      data.quotation_number,
      data.lead_id || null,
      data.customer_id,
      data.vehicle_id,
      data.quotation_date || null,
      data.valid_until || null,
      data.status || "DRAFT",
      data.created_by,
    ];

    pool.query(query, values, (error, result) => {
      if (error) {
        return callback(error);
      }

      callback(null, {
        motor_quotation_id: result.insertId,
        message: "Quotation created successfully",
      });
    });
  },

  // GET ALL
  getAllQuotations: (callback) => {
    const query = `
            SELECT
                mq.motor_quotation_id,
                mq.quotation_number,

                mq.lead_id,
                mq.customer_id,
                mq.vehicle_id,

                mq.quotation_date,
                mq.valid_until,
                mq.status,
                mq.created_by,

                mq.created_at,
                mq.updated_at,

                CONCAT(
                    COALESCE(c.first_name, ''),
                    ' ',
                    COALESCE(c.last_name, '')
                ) AS customer_name,

                v.registration_number,

                CONCAT(
                    COALESCE(u.first_name, ''),
                    ' ',
                    COALESCE(u.last_name, '')
                ) AS created_by_name

            FROM motor_quotations mq

            INNER JOIN customers c
                ON c.customer_id = mq.customer_id

            INNER JOIN vehicles v
                ON v.vehicle_id = mq.vehicle_id

            INNER JOIN users_master u
                ON u.user_id = mq.created_by

            ORDER BY mq.quotation_date DESC,
                     mq.motor_quotation_id DESC
        `;

    pool.query(query, (error, results) => {
      if (error) {
        return callback(error);
      }

      callback(null, results);
    });
  },

  // GET BY ID
  getQuotationById: (motor_quotation_id, callback) => {
    const query = `
            SELECT
                mq.motor_quotation_id,
                mq.quotation_number,

                mq.lead_id,
                mq.customer_id,
                mq.vehicle_id,

                mq.quotation_date,
                mq.valid_until,
                mq.status,
                mq.created_by,

                mq.created_at,
                mq.updated_at,

                CONCAT(
                    COALESCE(c.first_name, ''),
                    ' ',
                    COALESCE(c.last_name, '')
                ) AS customer_name,

                v.registration_number,

                CONCAT(
                    COALESCE(u.first_name, ''),
                    ' ',
                    COALESCE(u.last_name, '')
                ) AS created_by_name

            FROM motor_quotations mq

            INNER JOIN customers c
                ON c.customer_id = mq.customer_id

            INNER JOIN vehicles v
                ON v.vehicle_id = mq.vehicle_id

            INNER JOIN users_master u
                ON u.user_id = mq.created_by

            WHERE mq.motor_quotation_id = ?
        `;

    pool.query(query, [motor_quotation_id], (error, results) => {
      if (error) {
        return callback(error);
      }

      callback(null, results[0] || null);
    });
  },

  // UPDATE
  updateQuotation: (motor_quotation_id, data, callback) => {
    const query = `
            UPDATE motor_quotations
            SET
                quotation_number = ?,
                lead_id = ?,
                customer_id = ?,
                vehicle_id = ?,
                quotation_date = ?,
                valid_until = ?,
                status = ?
            WHERE motor_quotation_id = ?
        `;

    const values = [
      data.quotation_number,
      data.lead_id || null,
      data.customer_id,
      data.vehicle_id,
      data.quotation_date,
      data.valid_until || null,
      data.status,
      motor_quotation_id,
    ];

    pool.query(query, values, (error, result) => {
      if (error) {
        return callback(error);
      }

      callback(null, {
        affectedRows: result.affectedRows,
        message: "Quotation updated successfully",
      });
    });
  },

  // DELETE
  deleteQuotation: (motor_quotation_id, callback) => {
    const query = `
        UPDATE motor_quotations
        SET is_active = 0
        WHERE motor_quotation_id = ?
    `;

    pool.query(query, [motor_quotation_id], (error, result) => {
      if (error) {
        return callback(error);
      }

      callback(null, {
        affectedRows: result.affectedRows,
        message: "Quotation deleted successfully",
      });
    });
  },

  // GET BY CUSTOMER
  getQuotationsByCustomer: (customer_id, callback) => {
    const query = `
            SELECT
                mq.motor_quotation_id,
                mq.quotation_number,
                mq.lead_id,
                mq.customer_id,
                mq.vehicle_id,
                mq.quotation_date,
                mq.valid_until,
                mq.status,
                mq.created_by,
                mq.created_at,
                mq.updated_at,

                v.registration_number

            FROM motor_quotations mq

            INNER JOIN vehicles v
                ON v.vehicle_id = mq.vehicle_id

            WHERE mq.customer_id = ?

            ORDER BY mq.quotation_date DESC,
                     mq.motor_quotation_id DESC
        `;

    pool.query(query, [customer_id], (error, results) => {
      if (error) {
        return callback(error);
      }

      callback(null, results);
    });
  },

  // GET BY VEHICLE
  getQuotationsByVehicle: (vehicle_id, callback) => {
    const query = `
            SELECT
                mq.motor_quotation_id,
                mq.quotation_number,
                mq.lead_id,
                mq.customer_id,
                mq.vehicle_id,
                mq.quotation_date,
                mq.valid_until,
                mq.status,
                mq.created_by,
                mq.created_at,
                mq.updated_at

            FROM motor_quotations mq

            WHERE mq.vehicle_id = ?

            ORDER BY mq.quotation_date DESC,
                     mq.motor_quotation_id DESC
        `;

    pool.query(query, [vehicle_id], (error, results) => {
      if (error) {
        return callback(error);
      }

      callback(null, results);
    });
  },
};

module.exports = MotorQuotationService;
