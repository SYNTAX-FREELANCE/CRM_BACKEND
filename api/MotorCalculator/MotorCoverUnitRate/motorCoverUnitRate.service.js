const pool = require("../../../dbconfig/dbconfig");

const MotorCoverUnitRateService = {
  // CREATE
  createCoverUnitRate: (data, callback) => {
    const {
      cover_rate_id,
      min_units,
      max_units,
      rate_per_unit,
      description,
    } = data;

    const query = `
      INSERT INTO motor_cover_unit_rate (
        cover_rate_id,
        min_units,
        max_units,
        rate_per_unit,
        description
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    pool.query(
      query,
      [
        cover_rate_id,
        min_units,
        max_units ?? null,
        rate_per_unit,
        description || null,
      ],
      callback
    );
  },

  // GET ALL
  getAllCoverUnitRates: (callback) => {
    const query = `
      SELECT
        cur.cover_unit_rate_id,

        cur.cover_rate_id,

        crm.cover_id,
        cm.cover_code,
        cm.cover_name,
        cm.cover_type,

        crm.insurance_company_id,
        ic.company_name AS insurance_company_name,

        crm.product_id,
        pm.product_code,
        pm.product_name,

        crm.policy_type_id,
        ptm.policy_type_code,
        ptm.policy_type_name,

        crm.vehicle_category_id,
        vc.category_code,
        vc.category_name,

        crm.vehicle_class_id,
        vcl.class_code,
        vcl.class_name,

        crm.rate_type,
        crm.rate_value AS cover_rate_value,

        cur.min_units,
        cur.max_units,
        cur.rate_per_unit,
        cur.description,

        cur.is_active,
        cur.created_at,
        cur.updated_at

      FROM motor_cover_unit_rate cur

      INNER JOIN motor_cover_rate_master crm
        ON crm.cover_rate_id = cur.cover_rate_id

      INNER JOIN motor_cover_master cm
        ON cm.cover_id = crm.cover_id

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = crm.insurance_company_id

      INNER JOIN motor_product_master pm
        ON pm.product_id = crm.product_id

      LEFT JOIN motor_policy_type_master ptm
        ON ptm.policy_type_id = crm.policy_type_id

      LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = crm.vehicle_category_id

      LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = crm.vehicle_class_id

      ORDER BY
        cur.cover_rate_id ASC,
        cur.min_units ASC,
        cur.cover_unit_rate_id ASC
    `;

    pool.query(query, callback);
  },

  // GET BY ID
  getCoverUnitRateById: (cover_unit_rate_id, callback) => {
    const query = `
      SELECT
        cur.cover_unit_rate_id,

        cur.cover_rate_id,

        crm.cover_id,
        cm.cover_code,
        cm.cover_name,
        cm.cover_type,

        crm.insurance_company_id,
        ic.company_name AS insurance_company_name,

        crm.product_id,
        pm.product_code,
        pm.product_name,

        crm.policy_type_id,
        ptm.policy_type_code,
        ptm.policy_type_name,

        crm.vehicle_category_id,
        vc.category_code,
        vc.category_name,

        crm.vehicle_class_id,
        vcl.class_code,
        vcl.class_name,

        crm.rate_type,
        crm.rate_value AS cover_rate_value,

        cur.min_units,
        cur.max_units,
        cur.rate_per_unit,
        cur.description,

        cur.is_active,
        cur.created_at,
        cur.updated_at

      FROM motor_cover_unit_rate cur

      INNER JOIN motor_cover_rate_master crm
        ON crm.cover_rate_id = cur.cover_rate_id

      INNER JOIN motor_cover_master cm
        ON cm.cover_id = crm.cover_id

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = crm.insurance_company_id

      INNER JOIN motor_product_master pm
        ON pm.product_id = crm.product_id

      LEFT JOIN motor_policy_type_master ptm
        ON ptm.policy_type_id = crm.policy_type_id

      LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = crm.vehicle_category_id

      LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = crm.vehicle_class_id

      WHERE cur.cover_unit_rate_id = ?

      LIMIT 1
    `;

    pool.query(query, [cover_unit_rate_id], callback);
  },

  // UPDATE
  updateCoverUnitRate: (cover_unit_rate_id, data, callback) => {
    const {
      cover_rate_id,
      min_units,
      max_units,
      rate_per_unit,
      description,
    } = data;

    const query = `
      UPDATE motor_cover_unit_rate
      SET
        cover_rate_id = ?,
        min_units = ?,
        max_units = ?,
        rate_per_unit = ?,
        description = ?
      WHERE cover_unit_rate_id = ?
    `;

    pool.query(
      query,
      [
        cover_rate_id,
        min_units,
        max_units ?? null,
        rate_per_unit,
        description || null,
        cover_unit_rate_id,
      ],
      callback
    );
  },

  // DELETE / SOFT DELETE
  deleteCoverUnitRate: (cover_unit_rate_id, callback) => {
    const query = `
      UPDATE motor_cover_unit_rate
      SET is_active = 0
      WHERE cover_unit_rate_id = ?
    `;

    pool.query(query, [cover_unit_rate_id], callback);
  },

  // GET ACTIVE
  getActiveCoverUnitRates: (callback) => {
    const query = `
      SELECT
        cur.cover_unit_rate_id,

        cur.cover_rate_id,

        crm.cover_id,
        cm.cover_code,
        cm.cover_name,
        cm.cover_type,

        crm.insurance_company_id,
        ic.company_name AS insurance_company_name,

        crm.product_id,
        pm.product_code,
        pm.product_name,

        crm.policy_type_id,
        ptm.policy_type_code,
        ptm.policy_type_name,

        crm.vehicle_category_id,
        vc.category_code,
        vc.category_name,

        crm.vehicle_class_id,
        vcl.class_code,
        vcl.class_name,

        crm.rate_type,
        crm.rate_value AS cover_rate_value,

        cur.min_units,
        cur.max_units,
        cur.rate_per_unit,
        cur.description,

        cur.is_active,
        cur.created_at,
        cur.updated_at

      FROM motor_cover_unit_rate cur

      INNER JOIN motor_cover_rate_master crm
        ON crm.cover_rate_id = cur.cover_rate_id

      INNER JOIN motor_cover_master cm
        ON cm.cover_id = crm.cover_id

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = crm.insurance_company_id

      INNER JOIN motor_product_master pm
        ON pm.product_id = crm.product_id

      LEFT JOIN motor_policy_type_master ptm
        ON ptm.policy_type_id = crm.policy_type_id

      LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = crm.vehicle_category_id

      LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = crm.vehicle_class_id

      WHERE cur.is_active = 1

      ORDER BY
        cur.cover_rate_id ASC,
        cur.min_units ASC,
        cur.cover_unit_rate_id ASC
    `;

    pool.query(query, callback);
  },
};

module.exports = MotorCoverUnitRateService;