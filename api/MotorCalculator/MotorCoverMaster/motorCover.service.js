const pool = require("../../../dbconfig/dbconfig");

const MotorCoverService = {
  // CREATE
  createCover: (data, callback) => {
    const {
      cover_code,
      cover_name,
      cover_type,
      description,
    } = data;

    const query = `
      INSERT INTO motor_cover_master (
        cover_code,
        cover_name,
        cover_type,
        description
      )
      VALUES (?, ?, ?, ?)
    `;

    pool.query(
      query,
      [
        cover_code,
        cover_name,
        cover_type,
        description || null,
      ],
      callback
    );
  },

  // GET ALL
  getAllCovers: (callback) => {
    const query = `
      SELECT
        cover_id,
        cover_code,
        cover_name,
        cover_type,
        description,
        is_active,
        created_at,
        updated_at
      FROM motor_cover_master
      ORDER BY cover_id DESC
    `;

    pool.query(query, callback);
  },

  // GET BY ID
  getCoverById: (cover_id, callback) => {
    const query = `
      SELECT
        cover_id,
        cover_code,
        cover_name,
        cover_type,
        description,
        is_active,
        created_at,
        updated_at
      FROM motor_cover_master
      WHERE cover_id = ?
    `;

    pool.query(query, [cover_id], callback);
  },

  // UPDATE
  updateCover: (cover_id, data, callback) => {
    const {
      cover_code,
      cover_name,
      cover_type,
      description,
    } = data;

    const query = `
      UPDATE motor_cover_master
      SET
        cover_code = ?,
        cover_name = ?,
        cover_type = ?,
        description = ?
      WHERE cover_id = ?
    `;

    pool.query(
      query,
      [
        cover_code,
        cover_name,
        cover_type,
        description || null,
        cover_id,
      ],
      callback
    );
  },

  // DELETE / SOFT DELETE
  deleteCover: (cover_id, callback) => {
    const query = `
      UPDATE motor_cover_master
      SET is_active = 0
      WHERE cover_id = ?
    `;

    pool.query(query, [cover_id], callback);
  },

  // GET ACTIVE
  getActiveCovers: (callback) => {
    const query = `
      SELECT
        cover_id,
        cover_code,
        cover_name,
        cover_type,
        description
      FROM motor_cover_master
      WHERE is_active = 1
      ORDER BY cover_name ASC
    `;

    pool.query(query, callback);
  },
};

module.exports = MotorCoverService;