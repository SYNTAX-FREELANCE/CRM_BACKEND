const pool = require("../../../dbconfig/dbconfig");

const MotorCoverRateService = {
  // CREATE
  createCoverRate: (data, callback) => {
    const {
      cover_id,
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      rate_type,
      rate_value,
      effective_from,
      effective_to,
      description,
    } = data;

    const query = `
      INSERT INTO motor_cover_rate_master (
        cover_id,
        insurance_company_id,
        product_id,
        policy_type_id,
        vehicle_category_id,
        vehicle_class_id,
        rate_type,
        rate_value,
        effective_from,
        effective_to,
        description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(
      query,
      [
        cover_id,
        insurance_company_id || null,
        product_id,
        policy_type_id || null,
        vehicle_category_id || null,
        vehicle_class_id || null,
        rate_type,
        rate_value,
        effective_from,
        effective_to || null,
        description || null,
      ],
      callback
    );
  },

  // GET ALL
  getAllCoverRates: (callback) => {
    const query = `
      SELECT
        cr.cover_rate_id,

        cr.cover_id,
        cm.cover_code,
        cm.cover_name,
        cm.cover_type,

        cr.insurance_company_id,
        ic.company_name AS insurance_company_name,

        cr.product_id,
        pm.product_code,
        pm.product_name,

        cr.policy_type_id,
        ptm.policy_type_code,
        ptm.policy_type_name,

        cr.vehicle_category_id,
        vc.category_code,
        vc.category_name,

        cr.vehicle_class_id,
        vcl.class_code,
        vcl.class_name,

        cr.rate_type,
        cr.rate_value,

        cr.effective_from,
        cr.effective_to,
        cr.description,

        cr.is_active,
        cr.created_at,
        cr.updated_at

      FROM motor_cover_rate_master cr

      INNER JOIN motor_cover_master cm
        ON cm.cover_id = cr.cover_id

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = cr.insurance_company_id

      INNER JOIN motor_product_master pm
        ON pm.product_id = cr.product_id

      LEFT JOIN motor_policy_type_master ptm
        ON ptm.policy_type_id = cr.policy_type_id

      LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = cr.vehicle_category_id

      LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = cr.vehicle_class_id

      ORDER BY cr.effective_from DESC, cr.cover_rate_id DESC
    `;

    pool.query(query, callback);
  },

  // GET BY ID
  getCoverRateById: (cover_rate_id, callback) => {
    const query = `
      SELECT
        cr.cover_rate_id,

        cr.cover_id,
        cm.cover_code,
        cm.cover_name,
        cm.cover_type,

        cr.insurance_company_id,
        ic.company_name AS insurance_company_name,

        cr.product_id,
        pm.product_code,
        pm.product_name,

        cr.policy_type_id,
        ptm.policy_type_code,
        ptm.policy_type_name,

        cr.vehicle_category_id,
        vc.category_code,
        vc.category_name,

        cr.vehicle_class_id,
        vcl.class_code,
        vcl.class_name,

        cr.rate_type,
        cr.rate_value,

        cr.effective_from,
        cr.effective_to,
        cr.description,

        cr.is_active,
        cr.created_at,
        cr.updated_at

      FROM motor_cover_rate_master cr

      INNER JOIN motor_cover_master cm
        ON cm.cover_id = cr.cover_id

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = cr.insurance_company_id

      INNER JOIN motor_product_master pm
        ON pm.product_id = cr.product_id

      LEFT JOIN motor_policy_type_master ptm
        ON ptm.policy_type_id = cr.policy_type_id

      LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = cr.vehicle_category_id

      LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = cr.vehicle_class_id

      WHERE cr.cover_rate_id = ?
      LIMIT 1
    `;

    pool.query(query, [cover_rate_id], callback);
  },

  // UPDATE
  updateCoverRate: (cover_rate_id, data, callback) => {
    const {
      cover_id,
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      rate_type,
      rate_value,
      effective_from,
      effective_to,
      description,
    } = data;

    const query = `
      UPDATE motor_cover_rate_master
      SET
        cover_id = ?,
        insurance_company_id = ?,
        product_id = ?,
        policy_type_id = ?,
        vehicle_category_id = ?,
        vehicle_class_id = ?,
        rate_type = ?,
        rate_value = ?,
        effective_from = ?,
        effective_to = ?,
        description = ?
      WHERE cover_rate_id = ?
    `;

    pool.query(
      query,
      [
        cover_id,
        insurance_company_id || null,
        product_id,
        policy_type_id || null,
        vehicle_category_id || null,
        vehicle_class_id || null,
        rate_type,
        rate_value,
        effective_from,
        effective_to || null,
        description || null,
        cover_rate_id,
      ],
      callback
    );
  },

  // DELETE / SOFT DELETE
  deleteCoverRate: (cover_rate_id, callback) => {
    const query = `
      UPDATE motor_cover_rate_master
      SET is_active = 0
      WHERE cover_rate_id = ?
    `;

    pool.query(query, [cover_rate_id], callback);
  },

  // GET ACTIVE
  getActiveCoverRates: (callback) => {
    const query = `
      SELECT
        cr.cover_rate_id,

        cr.cover_id,
        cm.cover_code,
        cm.cover_name,
        cm.cover_type,

        cr.insurance_company_id,
        ic.company_name AS insurance_company_name,

        cr.product_id,
        pm.product_code,
        pm.product_name,

        cr.policy_type_id,
        ptm.policy_type_code,
        ptm.policy_type_name,

        cr.vehicle_category_id,
        vc.category_code,
        vc.category_name,

        cr.vehicle_class_id,
        vcl.class_code,
        vcl.class_name,

        cr.rate_type,
        cr.rate_value,

        cr.effective_from,
        cr.effective_to,
        cr.description,

        cr.is_active,
        cr.created_at,
        cr.updated_at

      FROM motor_cover_rate_master cr

      INNER JOIN motor_cover_master cm
        ON cm.cover_id = cr.cover_id

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = cr.insurance_company_id

      INNER JOIN motor_product_master pm
        ON pm.product_id = cr.product_id

      LEFT JOIN motor_policy_type_master ptm
        ON ptm.policy_type_id = cr.policy_type_id

      LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = cr.vehicle_category_id

      LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = cr.vehicle_class_id

      WHERE cr.is_active = 1

      ORDER BY cm.cover_name ASC, cr.effective_from DESC
    `;

    pool.query(query, callback);
  },
};

module.exports = MotorCoverRateService;