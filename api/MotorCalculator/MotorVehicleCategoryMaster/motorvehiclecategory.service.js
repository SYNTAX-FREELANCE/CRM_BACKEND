const pool = require("../../../dbconfig/dbconfig");

const MotorVehicleCategoryService = {
  // CREATE
  createVehicleCategory: (data, callback) => {
    const query = `
      INSERT INTO motor_vehicle_categories
      (
        vehicle_type_id,
        category_code,
        category_name,
        description,
        is_active
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      data.vehicle_type_id,
      data.category_code,
      data.category_name,
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
  getAllVehicleCategories: (callback) => {
    const query = `
      SELECT
        mvc.vehicle_category_id,
        mvc.vehicle_type_id,
        mvc.category_code,
        mvc.category_name,
        mvc.description,
        mvc.is_active,
        mvc.created_at,
        mvc.updated_at
      FROM motor_vehicle_categories mvc
      ORDER BY mvc.vehicle_category_id DESC
    `;

    pool.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET BY ID
  getVehicleCategoryById: (vehicleCategoryId, callback) => {
    const query = `
      SELECT
        vehicle_category_id,
        vehicle_type_id,
        category_code,
        category_name,
        description,
        is_active,
        created_at,
        updated_at
      FROM motor_vehicle_categories
      WHERE vehicle_category_id = ?
    `;

    pool.query(query, [vehicleCategoryId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // UPDATE
  updateVehicleCategory: (vehicleCategoryId, data, callback) => {
    const query = `
      UPDATE motor_vehicle_categories
      SET
        vehicle_type_id = ?,
        category_code = ?,
        category_name = ?,
        description = ?,
        is_active = ?
      WHERE vehicle_category_id = ?
    `;

    const values = [
      data.vehicle_type_id,
      data.category_code,
      data.category_name,
      data.description || null,
      data.is_active ?? 1,
      vehicleCategoryId,
    ];

    pool.query(query, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // DELETE / SOFT DELETE
  deleteVehicleCategory: (vehicleCategoryId, callback) => {
    const query = `
      UPDATE motor_vehicle_categories
      SET is_active = 0
      WHERE vehicle_category_id = ?
    `;

    pool.query(query, [vehicleCategoryId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET ACTIVE
  getActiveVehicleCategories: (callback) => {
    const query = `
      SELECT
        vehicle_category_id,
        vehicle_type_id,
        category_code,
        category_name,
        description
      FROM motor_vehicle_categories
      WHERE is_active = 1
      ORDER BY category_name ASC
    `;

    pool.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },
};

module.exports = MotorVehicleCategoryService;