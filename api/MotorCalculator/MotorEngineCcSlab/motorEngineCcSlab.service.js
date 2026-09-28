const pool = require("../../../dbconfig/dbconfig");

const MotorEngineCcSlabService = {
  // CREATE
  createEngineCcSlab: (data, callback) => {
    const query = `
      INSERT INTO motor_engine_cc_slabs
      (
        slab_code,
        slab_name,
        min_cc,
        max_cc,
        description,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.slab_code,
      data.slab_name,
      data.min_cc,
      data.max_cc ?? null,
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
  getAllEngineCcSlabs: (callback) => {
    const query = `
      SELECT
        engine_cc_slab_id,
        slab_code,
        slab_name,
        min_cc,
        max_cc,
        description,
        is_active,
        created_at,
        updated_at
      FROM motor_engine_cc_slabs
      ORDER BY min_cc ASC, engine_cc_slab_id ASC
    `;

    pool.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET BY ID
  getEngineCcSlabById: (engineCcSlabId, callback) => {
    const query = `
      SELECT
        engine_cc_slab_id,
        slab_code,
        slab_name,
        min_cc,
        max_cc,
        description,
        is_active,
        created_at,
        updated_at
      FROM motor_engine_cc_slabs
      WHERE engine_cc_slab_id = ?
    `;

    pool.query(query, [engineCcSlabId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // UPDATE
  updateEngineCcSlab: (engineCcSlabId, data, callback) => {
    const query = `
      UPDATE motor_engine_cc_slabs
      SET
        slab_code = ?,
        slab_name = ?,
        min_cc = ?,
        max_cc = ?,
        description = ?,
        is_active = ?
      WHERE engine_cc_slab_id = ?
    `;

    const values = [
      data.slab_code,
      data.slab_name,
      data.min_cc,
      data.max_cc ?? null,
      data.description || null,
      data.is_active ?? 1,
      engineCcSlabId,
    ];

    pool.query(query, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // DELETE / SOFT DELETE
  deleteEngineCcSlab: (engineCcSlabId, callback) => {
    const query = `
      UPDATE motor_engine_cc_slabs
      SET is_active = 0
      WHERE engine_cc_slab_id = ?
    `;

    pool.query(query, [engineCcSlabId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },

  // GET ACTIVE
  getActiveEngineCcSlabs: (callback) => {
    const query = `
      SELECT
        engine_cc_slab_id,
        slab_code,
        slab_name,
        min_cc,
        max_cc,
        description
      FROM motor_engine_cc_slabs
      WHERE is_active = 1
      ORDER BY min_cc ASC, engine_cc_slab_id ASC
    `;

    pool.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, result);
    });
  },
};

module.exports = MotorEngineCcSlabService;