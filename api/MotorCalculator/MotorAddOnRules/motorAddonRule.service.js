const pool = require("../../../dbconfig/dbconfig");

const MotorAddonRuleService = {
  // CREATE
  createAddonRule: (data, callback) => {
    const {
      addon_id,
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      min_vehicle_age_months,
      max_vehicle_age_months,
      min_idv,
      max_idv,
      rate_type,
      rate_value,
      effective_from,
      effective_to,
      description,
      is_active
    } = data;

    const query = `
      INSERT INTO motor_addon_rule (
        addon_id,
        insurance_company_id,
        product_id,
        policy_type_id,
        vehicle_category_id,
        vehicle_class_id,
        min_vehicle_age_months,
        max_vehicle_age_months,
        min_idv,
        max_idv,
        rate_type,
        rate_value,
        effective_from,
        effective_to,
        description,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(
      query,
      [
        addon_id,
        insurance_company_id || null,
        product_id,
        policy_type_id || null,
        vehicle_category_id || null,
        vehicle_class_id || null,
        min_vehicle_age_months ?? null,
        max_vehicle_age_months ?? null,
        min_idv ?? null,
        max_idv ?? null,
        rate_type,
        rate_value,
        effective_from,
        effective_to || null,
        description || null,
        is_active
      ],
      callback
    );
  },

  // GET ALL
  getAllAddonRules: (callback) => {
    const query = `
      SELECT
        ar.addon_rule_id,

        ar.addon_id,
        am.addon_code,
        am.addon_name,

        ar.insurance_company_id,
        ic.company_name as insurance_company_name,

        ar.product_id,
        p.product_name,

        ar.policy_type_id,
        pt.policy_type_name,

        ar.vehicle_category_id,
        vc.category_name,

        ar.vehicle_class_id,
        vcl.class_name,

        ar.min_vehicle_age_months,
        ar.max_vehicle_age_months,

        ar.min_idv,
        ar.max_idv,

        ar.rate_type,
        ar.rate_value,

        ar.effective_from,
        ar.effective_to,

        ar.description,
        ar.is_active,

        ar.created_at,
        ar.updated_at

      FROM motor_addon_rule ar

      INNER JOIN motor_addon_master am
        ON am.addon_id = ar.addon_id

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = ar.insurance_company_id

      INNER JOIN motor_product_master p
        ON p.product_id = ar.product_id

      LEFT JOIN motor_policy_type_master pt
        ON pt.policy_type_id = ar.policy_type_id

      LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = ar.vehicle_category_id

      LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = ar.vehicle_class_id

      ORDER BY
        ar.effective_from DESC,
        ar.addon_rule_id DESC
    `;

    pool.query(query, callback);
  },

  // GET BY ID
  getAddonRuleById: (addon_rule_id, callback) => {
    const query = `
      SELECT
        ar.addon_rule_id,

        ar.addon_id,
        am.addon_code,
        am.addon_name,

        ar.insurance_company_id,
       ic.company_name as insurance_company_name,

        ar.product_id,
        p.product_name,

        ar.policy_type_id,
        pt.policy_type_name,

        ar.vehicle_category_id,
        vc.category_name,

        ar.vehicle_class_id,
        vcl.class_name,

        ar.min_vehicle_age_months,
        ar.max_vehicle_age_months,

        ar.min_idv,
        ar.max_idv,

        ar.rate_type,
        ar.rate_value,

        ar.effective_from,
        ar.effective_to,

        ar.description,
        ar.is_active,

        ar.created_at,
        ar.updated_at

      FROM motor_addon_rule ar

      INNER JOIN motor_addon_master am
        ON am.addon_id = ar.addon_id

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = ar.insurance_company_id

      INNER JOIN motor_product_master p
        ON p.product_id = ar.product_id

      LEFT JOIN motor_policy_type_master pt
        ON pt.policy_type_id = ar.policy_type_id

      LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = ar.vehicle_category_id

      LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = ar.vehicle_class_id

      WHERE ar.addon_rule_id = ?
    `;

    pool.query(query, [addon_rule_id], callback);
  },

  // UPDATE
  updateAddonRule: (addon_rule_id, data, callback) => {
    const {
      addon_id,
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      min_vehicle_age_months,
      max_vehicle_age_months,
      min_idv,
      max_idv,
      rate_type,
      rate_value,
      effective_from,
      effective_to,
      description,
      is_active
    } = data;

    const query = `
      UPDATE motor_addon_rule
      SET
        addon_id = ?,
        insurance_company_id = ?,
        product_id = ?,
        policy_type_id = ?,
        vehicle_category_id = ?,
        vehicle_class_id = ?,
        min_vehicle_age_months = ?,
        max_vehicle_age_months = ?,
        min_idv = ?,
        max_idv = ?,
        rate_type = ?,
        rate_value = ?,
        effective_from = ?,
        effective_to = ?,
        description = ?,
        is_active = ?
      WHERE addon_rule_id = ?
    `;

    pool.query(
      query,
      [
        addon_id,
        insurance_company_id || null,
        product_id,
        policy_type_id || null,
        vehicle_category_id || null,
        vehicle_class_id || null,
        min_vehicle_age_months ?? null,
        max_vehicle_age_months ?? null,
        min_idv ?? null,
        max_idv ?? null,
        rate_type,
        rate_value,
        effective_from,
        effective_to || null,
        description || null,
        is_active,
        addon_rule_id,
      ],
      callback
    );
  },

  // DELETE / SOFT DELETE
  deleteAddonRule: (addon_rule_id, callback) => {
    const query = `
      UPDATE motor_addon_rule
      SET is_active = 0
      WHERE addon_rule_id = ?
    `;

    pool.query(query, [addon_rule_id], callback);
  },

  // GET ACTIVE
  getActiveAddonRules: (callback) => {
    const query = `
      SELECT
        ar.addon_rule_id,

        ar.addon_id,
        am.addon_code,
        am.addon_name,

        ar.insurance_company_id,
        ic.insurance_company_name,

        ar.product_id,
        p.product_name,

        ar.policy_type_id,
        pt.policy_type_name,

        ar.vehicle_category_id,
        vc.category_name,

        ar.vehicle_class_id,
        vcl.class_name,

        ar.min_vehicle_age_months,
        ar.max_vehicle_age_months,

        ar.min_idv,
        ar.max_idv,

        ar.rate_type,
        ar.rate_value,

        ar.effective_from,
        ar.effective_to,

        ar.description

      FROM motor_addon_rule ar

      INNER JOIN motor_addon_master am
        ON am.addon_id = ar.addon_id

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id = ar.insurance_company_id

      INNER JOIN motor_product_master p
        ON p.product_id = ar.product_id

      LEFT JOIN motor_policy_type_master pt
        ON pt.policy_type_id = ar.policy_type_id

      LEFT JOIN motor_vehicle_categories vc
        ON vc.vehicle_category_id = ar.vehicle_category_id

      LEFT JOIN motor_vehicle_classes vcl
        ON vcl.vehicle_class_id = ar.vehicle_class_id

      WHERE ar.is_active = 1

      ORDER BY
        ar.effective_from DESC,
        ar.addon_rule_id DESC
    `;

    pool.query(query, callback);
  },
};

module.exports = MotorAddonRuleService;