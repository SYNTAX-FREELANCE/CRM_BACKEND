const pool = require("../../dbconfig/dbconfig");

const PaymentMethodService = {
  // CREATE
  createPaymentMethod: (data, callback) => {
    const query = `
            INSERT INTO payment_method_master
            (
                payment_method_name,
                payment_type,
                description,
                is_active
            )
            VALUES (?, ?, ?, ?)
        `;

    const values = [
      data.payment_method_name,
      data.payment_type,
      data.description || null,
      data.is_active ?? 1,
    ];

    pool.query(query, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET ALL
  getAllPaymentMethods: (callback) => {
    const query = `
            SELECT
                payment_method_id,
                payment_method_name,
                payment_type,
                description,
                is_active,
                created_at,
                updated_at
            FROM payment_method_master
            ORDER BY payment_method_id DESC
        `;

    pool.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET BY ID
  getPaymentMethodById: (paymentMethodId, callback) => {
    const query = `
            SELECT
                payment_method_id,
                payment_method_name,
                payment_type,
                description,
                is_active,
                created_at,
                updated_at
            FROM payment_method_master
            WHERE payment_method_id = ?
        `;

    pool.query(query, [paymentMethodId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // UPDATE
  updatePaymentMethod: (paymentMethodId, data, callback) => {
    const query = `
            UPDATE payment_method_master
            SET
                payment_method_name = ?,
                payment_type = ?,
                description = ?,
                is_active = ?
            WHERE payment_method_id = ?
        `;

    const values = [
      data.payment_method_name,
      data.payment_type,
      data.description || null,
      data.is_active ?? 1,
      paymentMethodId,
    ];

    pool.query(query, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // DELETE / SOFT DELETE
  deletePaymentMethod: (paymentMethodId, callback) => {
    const query = `
            UPDATE payment_method_master
            SET is_active = 0
            WHERE payment_method_id = ?
        `;

    pool.query(query, [paymentMethodId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET ACTIVE
  getActivePaymentMethods: (callback) => {
    const query = `
            SELECT
                payment_method_id,
                payment_method_name,
                payment_type,
                description
            FROM payment_method_master
            WHERE is_active = 1
            ORDER BY payment_method_name ASC
        `;

    pool.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },
};

module.exports = PaymentMethodService;
