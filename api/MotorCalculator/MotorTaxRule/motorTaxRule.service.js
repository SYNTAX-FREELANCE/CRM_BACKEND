
const pool = require("../../../dbconfig/dbconfig");

const MotorTaxRuleService = {

  // =========================================================
  // CREATE
  // =========================================================

  createTaxRule: (data, callback) => {
    const {
      tax_id,
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      premium_component,
      effective_from,
      effective_to,
      is_active,
      description,
    } = data;

    const query = `
      INSERT INTO motor_tax_rule (
        tax_id,
        insurance_company_id,
        product_id,
        policy_type_id,
        vehicle_category_id,
        vehicle_class_id,
        premium_component,
        effective_from,
        effective_to,
        is_active,
        description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(
      query,
      [
        tax_id,
        insurance_company_id,
        product_id,
        policy_type_id,
        vehicle_category_id,
        vehicle_class_id,
        premium_component,
        effective_from,
        effective_to,
        is_active,
        description,
      ],
      callback
    );
  },

  // =========================================================
  // GET ALL
  // =========================================================

  getAllTaxRules: (callback) => {
    const query = `
      SELECT
        mtr.tax_rule_id,

        mtr.tax_id,
        mtm.*,

        mtr.insurance_company_id,
        ic.company_name AS insurance_company_name,

        mtr.product_id,
        pm.product_name,

        mtr.policy_type_id,
        ptm.policy_type_name,

        mtr.vehicle_category_id,
        mvc.category_name,

        mtr.vehicle_class_id,
        mvc_class.class_name,

        mtr.premium_component,

        mtr.effective_from,
        mtr.effective_to,

        mtr.is_active,
        mtr.description,

        mtr.created_at,
        mtr.updated_at

      FROM motor_tax_rule mtr

      INNER JOIN motor_tax_master mtm
        ON mtm.tax_id = mtr.tax_id

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id =
           mtr.insurance_company_id

      LEFT JOIN motor_product_master pm
        ON pm.product_id = mtr.product_id

      LEFT JOIN motor_policy_type_master ptm
        ON ptm.policy_type_id = mtr.policy_type_id

      LEFT JOIN motor_vehicle_categories mvc
        ON mvc.vehicle_category_id =
           mtr.vehicle_category_id

      LEFT JOIN motor_vehicle_classes mvc_class
        ON mvc_class.vehicle_class_id =
           mtr.vehicle_class_id

      ORDER BY mtr.tax_rule_id DESC
    `;

    pool.query(query, callback);
  },

  // =========================================================
  // GET BY ID
  // =========================================================

  getTaxRuleById: (tax_rule_id, callback) => {
    const query = `
      SELECT
        mtr.tax_rule_id,

        mtr.tax_id,
        mtm.*,

        mtr.insurance_company_id,
        ic.company_name AS insurance_company_name,

        mtr.product_id,
        pm.product_name,

        mtr.policy_type_id,
        ptm.policy_type_name,

        mtr.vehicle_category_id,
        mvc.category_name,

        mtr.vehicle_class_id,
        mvc_class.class_name,

        mtr.premium_component,

        mtr.effective_from,
        mtr.effective_to,

        mtr.is_active,
        mtr.description,

        mtr.created_at,
        mtr.updated_at

      FROM motor_tax_rule mtr

      INNER JOIN motor_tax_master mtm
        ON mtm.tax_id = mtr.tax_id

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id =
           mtr.insurance_company_id

      LEFT JOIN motor_product_master pm
        ON pm.product_id = mtr.product_id

      LEFT JOIN motor_policy_type_master ptm
        ON ptm.policy_type_id = mtr.policy_type_id

      LEFT JOIN motor_vehicle_categories mvc
        ON mvc.vehicle_category_id =
           mtr.vehicle_category_id

      LEFT JOIN motor_vehicle_classes mvc_class
        ON mvc_class.vehicle_class_id =
           mtr.vehicle_class_id

      WHERE mtr.tax_rule_id = ?
      LIMIT 1
    `;

    pool.query(
      query,
      [tax_rule_id],
      callback
    );
  },

  // =========================================================
  // UPDATE
  // =========================================================

  updateTaxRule: (tax_rule_id, data, callback) => {
    const {
      tax_id,
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      premium_component,
      effective_from,
      effective_to,
      is_active,
      description,
    } = data;

    const query = `
      UPDATE motor_tax_rule
      SET
        tax_id = ?,
        insurance_company_id = ?,
        product_id = ?,
        policy_type_id = ?,
        vehicle_category_id = ?,
        vehicle_class_id = ?,
        premium_component = ?,
        effective_from = ?,
        effective_to = ?,
        is_active = ?,
        description = ?
      WHERE tax_rule_id = ?
    `;

    pool.query(
      query,
      [
        tax_id,
        insurance_company_id,
        product_id,
        policy_type_id,
        vehicle_category_id,
        vehicle_class_id,
        premium_component,
        effective_from,
        effective_to,
        is_active,
        description,
        tax_rule_id,
      ],
      callback
    );
  },

  // =========================================================
  // DELETE / SOFT DELETE
  // =========================================================

  deleteTaxRule: (tax_rule_id, callback) => {
    const query = `
      UPDATE motor_tax_rule
      SET is_active = 0
      WHERE tax_rule_id = ?
        AND is_active = 1
    `;

    pool.query(
      query,
      [tax_rule_id],
      callback
    );
  },

  // =========================================================
  // GET ACTIVE
  // =========================================================

  getActiveTaxRules: (callback) => {
    const query = `
      SELECT
        mtr.tax_rule_id,

        mtr.tax_id,
        mtm.*,

        mtr.insurance_company_id,
        ic.company_name AS insurance_company_name,

        mtr.product_id,
        pm.product_name,

        mtr.policy_type_id,
        ptm.policy_type_name,

        mtr.vehicle_category_id,
        mvc.category_name,

        mtr.vehicle_class_id,
        mvc_class.class_name,

        mtr.premium_component,

        mtr.effective_from,
        mtr.effective_to,

        mtr.is_active,
        mtr.description,

        mtr.created_at,
        mtr.updated_at

      FROM motor_tax_rule mtr

      INNER JOIN motor_tax_master mtm
        ON mtm.tax_id = mtr.tax_id

      LEFT JOIN insurance_companies ic
        ON ic.insurance_company_id =
           mtr.insurance_company_id

      LEFT JOIN motor_product_master pm
        ON pm.product_id = mtr.product_id

      LEFT JOIN motor_policy_type_master ptm
        ON ptm.policy_type_id = mtr.policy_type_id

      LEFT JOIN motor_vehicle_categories mvc
        ON mvc.vehicle_category_id =
           mtr.vehicle_category_id

      LEFT JOIN motor_vehicle_classes mvc_class
        ON mvc_class.vehicle_class_id =
           mtr.vehicle_class_id

      WHERE mtr.is_active = 1
        AND mtr.effective_from <= CURDATE()
        AND (
          mtr.effective_to IS NULL
          OR mtr.effective_to >= CURDATE()
        )

      ORDER BY mtr.tax_rule_id DESC
    `;

    pool.query(query, callback);
  },
};

module.exports = MotorTaxRuleService;