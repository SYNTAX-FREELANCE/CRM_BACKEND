const pool = require("../../../dbconfig/dbconfig");

const MotorZdRateService = {
  // CREATE
  createZdRate: (data, callback) => {
    const {
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      min_age_months,
      max_age_months,
      rate_type,
      rate_value,
      effective_from,
      effective_to,
      description,
    } = data;

    const query = `
      INSERT INTO motor_zd_rate_master (
        insurance_company_id,
        product_id,
        policy_type_id,
        vehicle_category_id,
        vehicle_class_id,
        min_age_months,
        max_age_months,
        rate_type,
        rate_value,
        effective_from,
        effective_to,
        description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(
      query,
      [
        insurance_company_id || null,
        product_id,
        policy_type_id || null,
        vehicle_category_id || null,
        vehicle_class_id || null,
        min_age_months ?? null,
        max_age_months ?? null,
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
  getAllZdRates: (callback) => {
    const query = `
      SELECT
        z.zd_rate_id,

        z.insurance_company_id,
        ic.insurance_company_name,

        z.product_id,
        p.product_name,

        z.policy_type_id,
        pt.policy_type_name,

        z.vehicle_category_id,
        vc.category_name,

        z.vehicle_class_id,
        vcl.class_name,

        z.min_age_months,
        z.max_age_months,

        z.rate_type,
        z.rate_value,

        z.effective_from,
        z.effective_to,

        z.description,
        z.is_active,

        z.created_at,
        z.updated_at

      FROM motor_zd_rate_master z

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = z.insurance_company_id

      INNER JOIN motor_product_master p
        ON p.product_id = z.product_id

      LEFT JOIN motor_policy_type_master pt
        ON pt.policy_type_id = z.policy_type_id

      LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = z.vehicle_category_id

      LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = z.vehicle_class_id

      ORDER BY
        z.effective_from DESC,
        z.zd_rate_id DESC
    `;

    pool.query(query, callback);
  },

  // GET BY ID
  getZdRateById: (zd_rate_id, callback) => {
    const query = `
      SELECT
        z.zd_rate_id,

        z.insurance_company_id,
        ic.insurance_company_name,

        z.product_id,
        p.product_name,

        z.policy_type_id,
        pt.policy_type_name,

        z.vehicle_category_id,
        vc.category_name,

        z.vehicle_class_id,
        vcl.class_name,

        z.min_age_months,
        z.max_age_months,

        z.rate_type,
        z.rate_value,

        z.effective_from,
        z.effective_to,

        z.description,
        z.is_active,

        z.created_at,
        z.updated_at

      FROM motor_zd_rate_master z

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = z.insurance_company_id

      INNER JOIN motor_product_master p
        ON p.product_id = z.product_id

      LEFT JOIN motor_policy_type_master pt
        ON pt.policy_type_id = z.policy_type_id

      LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = z.vehicle_category_id

      LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = z.vehicle_class_id

      WHERE z.zd_rate_id = ?
    `;

    pool.query(query, [zd_rate_id], callback);
  },

  // UPDATE
  updateZdRate: (zd_rate_id, data, callback) => {
    const {
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      min_age_months,
      max_age_months,
      rate_type,
      rate_value,
      effective_from,
      effective_to,
      description,
    } = data;

    const query = `
      UPDATE motor_zd_rate_master
      SET
        insurance_company_id = ?,
        product_id = ?,
        policy_type_id = ?,
        vehicle_category_id = ?,
        vehicle_class_id = ?,
        min_age_months = ?,
        max_age_months = ?,
        rate_type = ?,
        rate_value = ?,
        effective_from = ?,
        effective_to = ?,
        description = ?
      WHERE zd_rate_id = ?
    `;

    pool.query(
      query,
      [
        insurance_company_id || null,
        product_id,
        policy_type_id || null,
        vehicle_category_id || null,
        vehicle_class_id || null,
        min_age_months ?? null,
        max_age_months ?? null,
        rate_type,
        rate_value,
        effective_from,
        effective_to || null,
        description || null,
        zd_rate_id,
      ],
      callback
    );
  },

  // DELETE / SOFT DELETE
  deleteZdRate: (zd_rate_id, callback) => {
    const query = `
      UPDATE motor_zd_rate_master
      SET is_active = 0
      WHERE zd_rate_id = ?
    `;

    pool.query(query, [zd_rate_id], callback);
  },

  // GET ACTIVE
  getActiveZdRates: (callback) => {
    const query = `
      SELECT
        z.zd_rate_id,

        z.insurance_company_id,
        ic.insurance_company_name,

        z.product_id,
        p.product_name,

        z.policy_type_id,
        pt.policy_type_name,

        z.vehicle_category_id,
        vc.category_name,

        z.vehicle_class_id,
        vcl.class_name,

        z.min_age_months,
        z.max_age_months,

        z.rate_type,
        z.rate_value,

        z.effective_from,
        z.effective_to,

        z.description

      FROM motor_zd_rate_master z

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = z.insurance_company_id

      INNER JOIN motor_product_master p
        ON p.product_id = z.product_id

      LEFT JOIN motor_policy_type_master pt
        ON pt.policy_type_id = z.policy_type_id

      LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = z.vehicle_category_id

      LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = z.vehicle_class_id

      WHERE z.is_active = 1

      ORDER BY
        z.effective_from DESC,
        z.zd_rate_id DESC
    `;

    pool.query(query, callback);
  },
};

module.exports = MotorZdRateService;