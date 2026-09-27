const pool = require("../../../dbconfig/dbconfig");

const MotorAddonConditionService = {
  // CREATE
  createAddonCondition: (data, callback) => {
    const {
      addon_rule_id,
      condition_type,
      condition_operator,
      condition_value,
      description,
    } = data;

    const query = `
      INSERT INTO motor_addon_condition (
        addon_rule_id,
        condition_type,
        condition_operator,
        condition_value,
        description
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    pool.query(
      query,
      [
        addon_rule_id,
        condition_type,
        condition_operator,
        condition_value,
        description || null,
      ],
      callback
    );
  },

  // GET ALL
  getAllAddonConditions: (callback) => {
    const query = `
      SELECT
        ac.addon_condition_id,

        ac.addon_rule_id,

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

        ac.condition_type,
        ac.condition_operator,
        ac.condition_value,
        ac.description,

        ac.is_active,
        ac.created_at,
        ac.updated_at

      FROM motor_addon_condition ac

      INNER JOIN motor_addon_rule ar
        ON ar.addon_rule_id = ac.addon_rule_id

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
        ac.addon_rule_id ASC,
        ac.addon_condition_id ASC
    `;

    pool.query(query, callback);
  },

  // GET BY ID
  getAddonConditionById: (addon_condition_id, callback) => {
    const query = `
      SELECT
        ac.addon_condition_id,

        ac.addon_rule_id,

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

        ac.condition_type,
        ac.condition_operator,
        ac.condition_value,
        ac.description,

        ac.is_active,
        ac.created_at,
        ac.updated_at

      FROM motor_addon_condition ac

      INNER JOIN motor_addon_rule ar
        ON ar.addon_rule_id = ac.addon_rule_id

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

      WHERE ac.addon_condition_id = ?
    `;

    pool.query(query, [addon_condition_id], callback);
  },

  // UPDATE
  updateAddonCondition: (addon_condition_id, data, callback) => {
    const {
      addon_rule_id,
      condition_type,
      condition_operator,
      condition_value,
      description,
    } = data;

    const query = `
      UPDATE motor_addon_condition
      SET
        addon_rule_id = ?,
        condition_type = ?,
        condition_operator = ?,
        condition_value = ?,
        description = ?
      WHERE addon_condition_id = ?
    `;

    pool.query(
      query,
      [
        addon_rule_id,
        condition_type,
        condition_operator,
        condition_value,
        description || null,
        addon_condition_id,
      ],
      callback
    );
  },

  // DELETE / SOFT DELETE
  deleteAddonCondition: (addon_condition_id, callback) => {
    const query = `
      UPDATE motor_addon_condition
      SET is_active = 0
      WHERE addon_condition_id = ?
    `;

    pool.query(query, [addon_condition_id], callback);
  },

  // GET ACTIVE
  getActiveAddonConditions: (callback) => {
    const query = `
      SELECT
        ac.addon_condition_id,

        ac.addon_rule_id,

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

        ac.condition_type,
        ac.condition_operator,
        ac.condition_value,
        ac.description

      FROM motor_addon_condition ac

      INNER JOIN motor_addon_rule ar
        ON ar.addon_rule_id = ac.addon_rule_id

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

      WHERE ac.is_active = 1

      ORDER BY
        ac.addon_rule_id ASC,
        ac.addon_condition_id ASC
    `;

    pool.query(query, callback);
  },
};

module.exports = MotorAddonConditionService;