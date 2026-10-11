const pool = require("../../../dbconfig/dbconfig");

const MotorProfitService = {
  // CREATE
  createProfit: (data, callback) => {
    const { vehicle_category_id, profit_amount, description, is_active } = data;

    const query = `
      INSERT INTO motor_profit_master (
        vehicle_category_id,
        profit_amount,
        description,
        is_active
      )
      VALUES (?, ?, ?, ?)
    `;

    pool.query(
      query,
      [vehicle_category_id, profit_amount, description || null, is_active ?? 1],
      callback,
    );
  },

  // GET ALL
  getAllProfits: (callback) => {
    const query = `
      SELECT
        mp.profit_id,

        mp.vehicle_category_id,
        vc.category_code,
        vc.category_name,

        mp.profit_amount,
        mp.description,

        mp.is_active,
        mp.created_at,
        mp.updated_at

      FROM motor_profit_master mp

      INNER JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = mp.vehicle_category_id

      ORDER BY
        vc.category_name ASC,
        mp.profit_id DESC
    `;

    pool.query(query, callback);
  },

  // GET BY ID
  getProfitById: (profit_id, callback) => {
    const query = `
      SELECT
        mp.profit_id,

        mp.vehicle_category_id,
        vc.category_code,
        vc.category_name,

        mp.profit_amount,
        mp.description,

        mp.is_active,
        mp.created_at,
        mp.updated_at

      FROM motor_profit_master mp

      INNER JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = mp.vehicle_category_id

      WHERE mp.profit_id = ?

      LIMIT 1
    `;

    pool.query(query, [profit_id], callback);
  },

  // UPDATE
  updateProfit: (profit_id, data, callback) => {
    const { vehicle_category_id, profit_amount, description, is_active } = data;

    const query = `
      UPDATE motor_profit_master
      SET
        vehicle_category_id = ?,
        profit_amount = ?,
        description = ?,
        is_active = ?
      WHERE profit_id = ?
    `;

    pool.query(
      query,
      [
        vehicle_category_id,
        profit_amount,
        description || null,
        is_active ?? 1,
        profit_id,
      ],
      callback,
    );
  },

  // DELETE / SOFT DELETE
  deleteProfit: (profit_id, callback) => {
    const query = `
      UPDATE motor_profit_master
      SET is_active = 0
      WHERE profit_id = ?
        AND is_active = 1
    `;

    pool.query(query, [profit_id], callback);
  },

  // GET ACTIVE
  getActiveProfits: (callback) => {
    const query = `
      SELECT
        mp.profit_id,

        mp.vehicle_category_id,
        vc.category_code,
        vc.category_name,

        mp.profit_amount,
        mp.description,

        mp.is_active,
        mp.created_at,
        mp.updated_at

      FROM motor_profit_master mp

      INNER JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = mp.vehicle_category_id

      WHERE mp.is_active = 1

      ORDER BY
        vc.category_name ASC,
        mp.profit_id DESC
    `;

    pool.query(query, callback);
  },
};

module.exports = MotorProfitService;
