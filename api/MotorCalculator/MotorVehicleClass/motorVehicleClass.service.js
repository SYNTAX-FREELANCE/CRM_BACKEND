const pool = require("../../../dbconfig/dbconfig");

const MotorVehicleClassService = {
  // CREATE
  createVehicleClass: (data, callback) => {
    const query = `
      INSERT INTO motor_vehicle_classes
      (
        vehicle_category_id,
        class_code,
        class_name,
        description,
        is_active
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      data.vehicle_category_id,
      data.class_code,
      data.class_name,
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
  getAllVehicleClasses: (callback) => {
    const query = `
SELECT
        vehicle_class_id,
        mv.vehicle_category_id,
        mvc.category_name,
        class_code,
        class_name,
        mv.description,
        mv.is_active
      FROM motor_vehicle_classes mv
      LEFT JOIN motor_vehicle_categories mvc ON mvc.vehicle_category_id = mv.vehicle_category_id
      ORDER BY vehicle_class_id DESC;
    `;

    pool.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET BY ID
  getVehicleClassById: (vehicleClassId, callback) => {
    const query = `
      SELECT
        vehicle_class_id,
        vehicle_category_id,
        class_code,
        class_name,
        description,
        is_active,
        created_at,
        updated_at
      FROM motor_vehicle_classes
      WHERE vehicle_class_id = ?
    `;

    pool.query(query, [vehicleClassId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // UPDATE
  updateVehicleClass: (vehicleClassId, data, callback) => {
    const query = `
      UPDATE motor_vehicle_classes
      SET
        vehicle_category_id = ?,
        class_code = ?,
        class_name = ?,
        description = ?,
        is_active = ?
      WHERE vehicle_class_id = ?
    `;

    const values = [
      data.vehicle_category_id,
      data.class_code,
      data.class_name,
      data.description || null,
      data.is_active ?? 1,
      vehicleClassId,
    ];

    pool.query(query, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // DELETE / SOFT DELETE
  deleteVehicleClass: (vehicleClassId, callback) => {
    const query = `
      UPDATE motor_vehicle_classes
      SET is_active = 0
      WHERE vehicle_class_id = ?
    `;

    pool.query(query, [vehicleClassId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET ACTIVE
  getActiveVehicleClasses: (callback) => {
    const query = `
      SELECT
        vehicle_class_id,
        vehicle_category_id,
        class_code,
        class_name,
        description
      FROM motor_vehicle_classes
      WHERE is_active = 1
      ORDER BY class_name ASC
    `;

    pool.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },
};

module.exports = MotorVehicleClassService;