const pool = require("../../../dbconfig/dbconfig");

const MotorCommissionRuleService = {
  // CREATE
  createCommissionRule: (data, callback) => {
    const {
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      commission_type,
      commission_value,
      min_premium,
      max_premium,
      effective_from,
      effective_to,
      description,
    } = data;

    const query = `
      INSERT INTO motor_commission_rule_master (
        insurance_company_id,
        product_id,
        policy_type_id,
        vehicle_category_id,
        vehicle_class_id,
        commission_type,
        commission_value,
        min_premium,
        max_premium,
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
        commission_type,
        commission_value,
        min_premium ?? null,
        max_premium ?? null,
        effective_from,
        effective_to || null,
        description || null,
      ],
      callback
    );
  },

  // GET ALL
  getAllCommissionRules: (callback) => {
    const query = `
      SELECT
        cr.commission_rule_id,

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

        cr.commission_type,
        cr.commission_value,

        cr.min_premium,
        cr.max_premium,

        cr.effective_from,
        cr.effective_to,
        cr.description,

        cr.is_active,
        cr.created_at,
        cr.updated_at

      FROM motor_commission_rule_master cr

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

      ORDER BY
        cr.effective_from DESC,
        cr.commission_rule_id DESC
    `;

    pool.query(query, callback);
  },

  // GET BY ID
  getCommissionRuleById: (commission_rule_id, callback) => {
    const query = `
      SELECT
        cr.commission_rule_id,

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

        cr.commission_type,
        cr.commission_value,

        cr.min_premium,
        cr.max_premium,

        cr.effective_from,
        cr.effective_to,
        cr.description,

        cr.is_active,
        cr.created_at,
        cr.updated_at

      FROM motor_commission_rule_master cr

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

      WHERE cr.commission_rule_id = ?

      LIMIT 1
    `;

    pool.query(query, [commission_rule_id], callback);
  },

  // UPDATE
  updateCommissionRule: (commission_rule_id, data, callback) => {
    const {
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      commission_type,
      commission_value,
      min_premium,
      max_premium,
      effective_from,
      effective_to,
      description,
    } = data;

    const query = `
      UPDATE motor_commission_rule_master
      SET
        insurance_company_id = ?,
        product_id = ?,
        policy_type_id = ?,
        vehicle_category_id = ?,
        vehicle_class_id = ?,
        commission_type = ?,
        commission_value = ?,
        min_premium = ?,
        max_premium = ?,
        effective_from = ?,
        effective_to = ?,
        description = ?
      WHERE commission_rule_id = ?
    `;

    pool.query(
      query,
      [
        insurance_company_id || null,
        product_id,
        policy_type_id || null,
        vehicle_category_id || null,
        vehicle_class_id || null,
        commission_type,
        commission_value,
        min_premium ?? null,
        max_premium ?? null,
        effective_from,
        effective_to || null,
        description || null,
        commission_rule_id,
      ],
      callback
    );
  },

  // DELETE / SOFT DELETE
  deleteCommissionRule: (commission_rule_id, callback) => {
    const query = `
      UPDATE motor_commission_rule_master
      SET is_active = 0
      WHERE commission_rule_id = ?
    `;

    pool.query(query, [commission_rule_id], callback);
  },

  // GET ACTIVE
  getActiveCommissionRules: (callback) => {
    const query = `
      SELECT
        cr.commission_rule_id,

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

        cr.commission_type,
        cr.commission_value,

        cr.min_premium,
        cr.max_premium,

        cr.effective_from,
        cr.effective_to,
        cr.description,

        cr.is_active,
        cr.created_at,
        cr.updated_at

      FROM motor_commission_rule_master cr

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

      ORDER BY
        pm.product_name ASC,
        cr.effective_from DESC,
        cr.commission_rule_id DESC
    `;

    pool.query(query, callback);
  },
};

module.exports = MotorCommissionRuleService;