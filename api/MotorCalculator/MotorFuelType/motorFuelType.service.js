const pool = require("../../../dbconfig/dbconfig");

const MotorFuelTypeService = {
  // CREATE
  createFuelType: (data, callback) => {
    const query = `
      INSERT INTO motor_fuel_types
      (
        fuel_code,
        fuel_name,
        description,
        is_active
      )
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      data.fuel_code,
      data.fuel_name,
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
  getAllFuelTypes: (callback) => {
    const query = `
      SELECT
        fuel_type_id,
        fuel_code,
        fuel_name,
        description,
        is_active,
        created_at,
        updated_at
      FROM motor_fuel_types
      ORDER BY fuel_type_id DESC
    `;

    pool.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET BY ID
  getFuelTypeById: (fuelTypeId, callback) => {
    const query = `
      SELECT
        fuel_type_id,
        fuel_code,
        fuel_name,
        description,
        is_active,
        created_at,
        updated_at
      FROM motor_fuel_types
      WHERE fuel_type_id = ?
    `;

    pool.query(query, [fuelTypeId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // UPDATE
  updateFuelType: (fuelTypeId, data, callback) => {
    const query = `
      UPDATE motor_fuel_types
      SET
        fuel_code = ?,
        fuel_name = ?,
        description = ?,
        is_active = ?
      WHERE fuel_type_id = ?
    `;

    const values = [
      data.fuel_code,
      data.fuel_name,
      data.description || null,
      data.is_active ?? 1,
      fuelTypeId,
    ];

    pool.query(query, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // DELETE / SOFT DELETE
  deleteFuelType: (fuelTypeId, callback) => {
    const query = `
      UPDATE motor_fuel_types
      SET is_active = 0
      WHERE fuel_type_id = ?
    `;

    pool.query(query, [fuelTypeId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET ACTIVE
  getActiveFuelTypes: (callback) => {
    const query = `
      SELECT
        fuel_type_id,
        fuel_code,
        fuel_name,
        description
      FROM motor_fuel_types
      WHERE is_active = 1
      ORDER BY fuel_name ASC
    `;

    pool.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },
};

module.exports = MotorFuelTypeService;