const pool = require("../../../dbconfig/dbconfig");

const MotorAddonService = {
  // CREATE
  createAddon: (data, callback) => {
    const {
      addon_code,
      addon_name,
      description,
    } = data;

    const query = `
      INSERT INTO motor_addon_master (
        addon_code,
        addon_name,
        description
      )
      VALUES (?, ?, ?)
    `;

    pool.query(
      query,
      [
        addon_code,
        addon_name,
        description || null,
      ],
      callback
    );
  },

  // GET ALL
  getAllAddons: (callback) => {
    const query = `
      SELECT
        addon_id,
        addon_code,
        addon_name,
        description,
        is_active,
        created_at,
        updated_at
      FROM motor_addon_master
      ORDER BY addon_id DESC
    `;

    pool.query(query, callback);
  },

  // GET BY ID
  getAddonById: (addon_id, callback) => {
    const query = `
      SELECT
        addon_id,
        addon_code,
        addon_name,
        description,
        is_active,
        created_at,
        updated_at
      FROM motor_addon_master
      WHERE addon_id = ?
    `;

    pool.query(query, [addon_id], callback);
  },

  // UPDATE
  updateAddon: (addon_id, data, callback) => {
    const {
      addon_code,
      addon_name,
      description,
    } = data;

    const query = `
      UPDATE motor_addon_master
      SET
        addon_code = ?,
        addon_name = ?,
        description = ?
      WHERE addon_id = ?
    `;

    pool.query(
      query,
      [
        addon_code,
        addon_name,
        description || null,
        addon_id,
      ],
      callback
    );
  },

  // DELETE / SOFT DELETE
  deleteAddon: (addon_id, callback) => {
    const query = `
      UPDATE motor_addon_master
      SET is_active = 0
      WHERE addon_id = ?
    `;

    pool.query(query, [addon_id], callback);
  },

  // GET ACTIVE
  getActiveAddons: (callback) => {
    const query = `
      SELECT
        addon_id,
        addon_code,
        addon_name,
        description
      FROM motor_addon_master
      WHERE is_active = 1
      ORDER BY addon_name ASC
    `;

    pool.query(query, callback);
  },
};

module.exports = MotorAddonService;