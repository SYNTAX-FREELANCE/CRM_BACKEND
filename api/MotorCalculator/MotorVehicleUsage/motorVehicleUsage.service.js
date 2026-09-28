const pool = require("../../../dbconfig/dbconfig");

const MotorVehicleUsageService = {
  // CREATE
  createVehicleUsage: (data, callback) => {
    const query = `
      INSERT INTO motor_vehicle_usages
      (
        usage_code,
        usage_name,
        description,
        is_active
      )
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      data.usage_code,
      data.usage_name,
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
  getAllVehicleUsages: (callback) => {
    const query = `
      SELECT
        usage_id,
        usage_code,
        usage_name,
        description,
        is_active,
        created_at,
        updated_at
      FROM motor_vehicle_usages
      ORDER BY usage_id DESC
    `;

    pool.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET BY ID
  getVehicleUsageById: (usageId, callback) => {
    const query = `
      SELECT
        usage_id,
        usage_code,
        usage_name,
        description,
        is_active,
        created_at,
        updated_at
      FROM motor_vehicle_usages
      WHERE usage_id = ?
    `;

    pool.query(query, [usageId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // UPDATE
  updateVehicleUsage: (usageId, data, callback) => {
    const query = `
      UPDATE motor_vehicle_usages
      SET
        usage_code = ?,
        usage_name = ?,
        description = ?,
        is_active = ?
      WHERE usage_id = ?
    `;

    const values = [
      data.usage_code,
      data.usage_name,
      data.description || null,
      data.is_active ?? 1,
      usageId,
    ];

    pool.query(query, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // DELETE / SOFT DELETE
  deleteVehicleUsage: (usageId, callback) => {
    const query = `
      UPDATE motor_vehicle_usages
      SET is_active = 0
      WHERE usage_id = ?
    `;

    pool.query(query, [usageId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET ACTIVE
  getActiveVehicleUsages: (callback) => {
    const query = `
      SELECT
        usage_id,
        usage_code,
        usage_name,
        description
      FROM motor_vehicle_usages
      WHERE is_active = 1
      ORDER BY usage_name ASC
    `;

    pool.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },
};

module.exports = MotorVehicleUsageService;