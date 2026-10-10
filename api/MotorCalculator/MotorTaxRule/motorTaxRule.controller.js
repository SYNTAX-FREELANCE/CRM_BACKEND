
const MotorTaxRuleService = require("./motorTaxRule.service");

const PREMIUM_COMPONENTS = ["OD", "TP", "ADDON", "COVER"];

const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  value === "";

const isValidId = (value) =>
  !isEmpty(value) &&
  Number.isInteger(Number(value)) &&
  Number(value) > 0;

const isValidOptionalId = (value) =>
  isEmpty(value) || isValidId(value);

const isValidDate = (value) => {
  if (typeof value !== "string") return false;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
};

const normalizeOptionalId = (value) =>
  isEmpty(value) ? null : Number(value);

const normalizeOptionalDate = (value) =>
  isEmpty(value) ? null : value;

const MotorTaxRuleController = {

  // =========================================================
  // CREATE
  // =========================================================

  createTaxRule: (req, res) => {
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
    } = req.body;

    // TAX ID
    if (!isValidId(tax_id)) {
      return res.status(200).json({
        success: 0,
        message: "Valid tax ID is required",
      });
    }

    // OPTIONAL FOREIGN KEYS
    const optionalIds = [
      {
        value: insurance_company_id,
        message: "Valid insurance company ID is required",
      },
      {
        value: product_id,
        message: "Valid product ID is required",
      },
      {
        value: policy_type_id,
        message: "Valid policy type ID is required",
      },
      {
        value: vehicle_category_id,
        message: "Valid vehicle category ID is required",
      },
      {
        value: vehicle_class_id,
        message: "Valid vehicle class ID is required",
      },
    ];

    for (const item of optionalIds) {
      if (!isValidOptionalId(item.value)) {
        return res.status(200).json({
          success: 0,
          message: item.message,
        });
      }
    }

    // PREMIUM COMPONENT
    if (!PREMIUM_COMPONENTS.includes(premium_component)) {
      return res.status(200).json({
        success: 0,
        message: "Premium component must be OD, TP, ADDON or COVER",
      });
    }

    // EFFECTIVE FROM
    if (!isValidDate(effective_from)) {
      return res.status(200).json({
        success: 0,
        message: "Valid effective from date is required (YYYY-MM-DD)",
      });
    }

    // EFFECTIVE TO
    if (
      !isEmpty(effective_to) &&
      !isValidDate(effective_to)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Effective to must be a valid date (YYYY-MM-DD)",
      });
    }

    // DATE RANGE
    if (
      !isEmpty(effective_to) &&
      effective_to < effective_from
    ) {
      return res.status(200).json({
        success: 0,
        message: "Effective to cannot be earlier than effective from",
      });
    }

    // ACTIVE STATUS
    if (
      !isEmpty(is_active) &&
      ![0, 1].includes(Number(is_active))
    ) {
      return res.status(200).json({
        success: 0,
        message: "is_active must be 0 or 1",
      });
    }

    // DESCRIPTION
    if (
      description !== null &&
      description !== undefined &&
      (
        typeof description !== "string" ||
        description.length > 500
      )
    ) {
      return res.status(200).json({
        success: 0,
        message: "Description must not exceed 500 characters",
      });
    }

    const data = {
      tax_id: Number(tax_id),

      insurance_company_id:
        normalizeOptionalId(insurance_company_id),

      product_id:
        normalizeOptionalId(product_id),

      policy_type_id:
        normalizeOptionalId(policy_type_id),

      vehicle_category_id:
        normalizeOptionalId(vehicle_category_id),

      vehicle_class_id:
        normalizeOptionalId(vehicle_class_id),

      premium_component,

      effective_from,

      effective_to:
        normalizeOptionalDate(effective_to),

      is_active:
        isEmpty(is_active) ? 1 : Number(is_active),

      description:
        isEmpty(description) ? null : description,
    };

    MotorTaxRuleService.createTaxRule(data, (err, result) => {
      if (err) {
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(200).json({
            success: 0,
            message:
              "Invalid tax, company, product, policy type or vehicle reference",
          });
        }

        return res.status(500).json({
          success: 0,
          message: "Failed to create tax rule",
          error: err.message,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Tax rule created successfully",
        tax_rule_id: result.insertId,
      });
    });
  },

  // =========================================================
  // GET ALL
  // =========================================================

  getAllTaxRules: (req, res) => {
    MotorTaxRuleService.getAllTaxRules((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch tax rules",
          error: err.message,
        });
      }

      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },

  // =========================================================
  // GET BY ID
  // =========================================================

  getTaxRuleById: (req, res) => {
    const { tax_rule_id } = req.params;

    if (!isValidId(tax_rule_id)) {
      return res.status(200).json({
        success: 0,
        message: "Valid tax rule ID is required",
      });
    }

    MotorTaxRuleService.getTaxRuleById(
      Number(tax_rule_id),
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch tax rule",
            error: err.message,
          });
        }

        if (result.length === 0) {
          return res.status(200).json({
            success: 0,
            message: "Tax rule not found",
          });
        }

        return res.status(200).json({
          success: 1,
          data: result[0],
        });
      }
    );
  },

  // =========================================================
  // UPDATE
  // =========================================================

  updateTaxRule: (req, res) => {
    const { tax_rule_id } = req.params;

    if (!isValidId(tax_rule_id)) {
      return res.status(200).json({
        success: 0,
        message: "Valid tax rule ID is required",
      });
    }

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
    } = req.body;

    if (!isValidId(tax_id)) {
      return res.status(200).json({
        success: 0,
        message: "Valid tax ID is required",
      });
    }

    const optionalIds = [
      {
        value: insurance_company_id,
        message: "Valid insurance company ID is required",
      },
      {
        value: product_id,
        message: "Valid product ID is required",
      },
      {
        value: policy_type_id,
        message: "Valid policy type ID is required",
      },
      {
        value: vehicle_category_id,
        message: "Valid vehicle category ID is required",
      },
      {
        value: vehicle_class_id,
        message: "Valid vehicle class ID is required",
      },
    ];

    for (const item of optionalIds) {
      if (!isValidOptionalId(item.value)) {
        return res.status(200).json({
          success: 0,
          message: item.message,
        });
      }
    }

    if (!PREMIUM_COMPONENTS.includes(premium_component)) {
      return res.status(200).json({
        success: 0,
        message: "Premium component must be OD, TP, ADDON or COVER",
      });
    }

    if (!isValidDate(effective_from)) {
      return res.status(200).json({
        success: 0,
        message: "Valid effective from date is required (YYYY-MM-DD)",
      });
    }

    if (
      !isEmpty(effective_to) &&
      !isValidDate(effective_to)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Effective to must be a valid date (YYYY-MM-DD)",
      });
    }

    if (
      !isEmpty(effective_to) &&
      effective_to < effective_from
    ) {
      return res.status(200).json({
        success: 0,
        message: "Effective to cannot be earlier than effective from",
      });
    }

    if (
      !isEmpty(is_active) &&
      ![0, 1].includes(Number(is_active))
    ) {
      return res.status(200).json({
        success: 0,
        message: "is_active must be 0 or 1",
      });
    }

    if (
      description !== null &&
      description !== undefined &&
      (
        typeof description !== "string" ||
        description.length > 500
      )
    ) {
      return res.status(200).json({
        success: 0,
        message: "Description must not exceed 500 characters",
      });
    }

    const data = {
      tax_id: Number(tax_id),

      insurance_company_id:
        normalizeOptionalId(insurance_company_id),

      product_id:
        normalizeOptionalId(product_id),

      policy_type_id:
        normalizeOptionalId(policy_type_id),

      vehicle_category_id:
        normalizeOptionalId(vehicle_category_id),

      vehicle_class_id:
        normalizeOptionalId(vehicle_class_id),

      premium_component,

      effective_from,

      effective_to:
        normalizeOptionalDate(effective_to),

      is_active:
        isEmpty(is_active) ? 1 : Number(is_active),

      description:
        isEmpty(description) ? null : description,
    };

    MotorTaxRuleService.updateTaxRule(
      Number(tax_rule_id),
      data,
      (err, result) => {
        if (err) {
          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(200).json({
              success: 0,
              message:
                "Invalid tax, company, product, policy type or vehicle reference",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to update tax rule",
            error: err.message,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Tax rule not found or no changes made",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Tax rule updated successfully",
        });
      }
    );
  },

  // =========================================================
  // DELETE / SOFT DELETE
  // =========================================================

  deleteTaxRule: (req, res) => {
    const { tax_rule_id } = req.params;

    if (!isValidId(tax_rule_id)) {
      return res.status(200).json({
        success: 0,
        message: "Valid tax rule ID is required",
      });
    }

    MotorTaxRuleService.deleteTaxRule(
      Number(tax_rule_id),
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to delete tax rule",
            error: err.message,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Tax rule not found or already inactive",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Tax rule deleted successfully",
        });
      }
    );
  },

  // =========================================================
  // GET ACTIVE
  // =========================================================

  getActiveTaxRules: (req, res) => {
    MotorTaxRuleService.getActiveTaxRules((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch active tax rules",
          error: err.message,
        });
      }

      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },
};

module.exports = MotorTaxRuleController;