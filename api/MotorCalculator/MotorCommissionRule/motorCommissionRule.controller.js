const MotorCommissionRuleService = require("./motorCommissionRule.service");

const MotorCommissionRuleController = {
  // CREATE
  createCommissionRule: (req, res) => {
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
    } = req.body;

    // INSURANCE COMPANY
    if (
      insurance_company_id !== undefined &&
      insurance_company_id !== null &&
      insurance_company_id !== "" &&
      (isNaN(insurance_company_id) || Number(insurance_company_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid insurance company",
      });
    }

    // PRODUCT
    if (!product_id || isNaN(product_id) || Number(product_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Product is required",
      });
    }

    // POLICY TYPE
    if (
      policy_type_id !== undefined &&
      policy_type_id !== null &&
      policy_type_id !== "" &&
      (isNaN(policy_type_id) || Number(policy_type_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid policy type",
      });
    }

    // VEHICLE CATEGORY
    if (
      vehicle_category_id !== undefined &&
      vehicle_category_id !== null &&
      vehicle_category_id !== "" &&
      (isNaN(vehicle_category_id) || Number(vehicle_category_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid vehicle category",
      });
    }

    // VEHICLE CLASS
    if (
      vehicle_class_id !== undefined &&
      vehicle_class_id !== null &&
      vehicle_class_id !== "" &&
      (isNaN(vehicle_class_id) || Number(vehicle_class_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid vehicle class",
      });
    }

    // COMMISSION TYPE
    const allowedCommissionTypes = ["PERCENTAGE", "FIXED"];

    if (
      !commission_type ||
      !allowedCommissionTypes.includes(commission_type)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid commission type",
      });
    }

    // COMMISSION VALUE
    if (
      commission_value === undefined ||
      commission_value === null ||
      commission_value === "" ||
      isNaN(commission_value) ||
      Number(commission_value) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid commission value is required",
      });
    }

    if (
      commission_type === "PERCENTAGE" &&
      Number(commission_value) > 100
    ) {
      return res.status(200).json({
        success: 0,
        message: "Percentage commission value cannot exceed 100",
      });
    }

    // MIN PREMIUM
    if (
      min_premium !== undefined &&
      min_premium !== null &&
      min_premium !== "" &&
      (isNaN(min_premium) || Number(min_premium) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid minimum premium",
      });
    }

    // MAX PREMIUM
    if (
      max_premium !== undefined &&
      max_premium !== null &&
      max_premium !== "" &&
      (isNaN(max_premium) || Number(max_premium) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid maximum premium",
      });
    }

    if (
      min_premium !== undefined &&
      min_premium !== null &&
      min_premium !== "" &&
      max_premium !== undefined &&
      max_premium !== null &&
      max_premium !== "" &&
      Number(max_premium) < Number(min_premium)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum premium cannot be less than minimum premium",
      });
    }

    // EFFECTIVE FROM
    if (!effective_from) {
      return res.status(200).json({
        success: 0,
        message: "Effective from date is required",
      });
    }

    // EFFECTIVE TO
    if (effective_to && effective_to < effective_from) {
      return res.status(200).json({
        success: 0,
        message: "Effective to date cannot be before effective from date",
      });
    }

    // DESCRIPTION
    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    MotorCommissionRuleService.createCommissionRule(
      req.body,
      (err, result) => {
        if (err) {
          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(200).json({
              success: 0,
              message:
                "Invalid insurance company, product, policy type, vehicle category or vehicle class reference",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Database error",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Commission rule created successfully",
          data: result,
        });
      }
    );
  },

  // GET ALL
  getAllCommissionRules: (req, res) => {
    MotorCommissionRuleService.getAllCommissionRules(
      (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          data: results,
        });
      }
    );
  },

  // GET BY ID
  getCommissionRuleById: (req, res) => {
    const { commission_rule_id } = req.params;

    if (
      !commission_rule_id ||
      isNaN(commission_rule_id) ||
      Number(commission_rule_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid commission rule ID",
      });
    }

    MotorCommissionRuleService.getCommissionRuleById(
      commission_rule_id,
      (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
            error: err,
          });
        }

        if (results.length === 0) {
          return res.status(200).json({
            success: 0,
            message: "Commission rule not found",
          });
        }

        return res.status(200).json({
          success: 1,
          data: results[0],
        });
      }
    );
  },

  // UPDATE
  updateCommissionRule: (req, res) => {
    const { commission_rule_id } = req.params;

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
    } = req.body;

    // ID
    if (
      !commission_rule_id ||
      isNaN(commission_rule_id) ||
      Number(commission_rule_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid commission rule ID",
      });
    }

    // INSURANCE COMPANY
    if (
      insurance_company_id !== undefined &&
      insurance_company_id !== null &&
      insurance_company_id !== "" &&
      (isNaN(insurance_company_id) || Number(insurance_company_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid insurance company",
      });
    }

    // PRODUCT
    if (!product_id || isNaN(product_id) || Number(product_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Product is required",
      });
    }

    // POLICY TYPE
    if (
      policy_type_id !== undefined &&
      policy_type_id !== null &&
      policy_type_id !== "" &&
      (isNaN(policy_type_id) || Number(policy_type_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid policy type",
      });
    }

    // VEHICLE CATEGORY
    if (
      vehicle_category_id !== undefined &&
      vehicle_category_id !== null &&
      vehicle_category_id !== "" &&
      (isNaN(vehicle_category_id) || Number(vehicle_category_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid vehicle category",
      });
    }

    // VEHICLE CLASS
    if (
      vehicle_class_id !== undefined &&
      vehicle_class_id !== null &&
      vehicle_class_id !== "" &&
      (isNaN(vehicle_class_id) || Number(vehicle_class_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid vehicle class",
      });
    }

    // COMMISSION TYPE
    const allowedCommissionTypes = ["PERCENTAGE", "FIXED"];

    if (
      !commission_type ||
      !allowedCommissionTypes.includes(commission_type)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid commission type",
      });
    }

    // COMMISSION VALUE
    if (
      commission_value === undefined ||
      commission_value === null ||
      commission_value === "" ||
      isNaN(commission_value) ||
      Number(commission_value) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid commission value is required",
      });
    }

    if (
      commission_type === "PERCENTAGE" &&
      Number(commission_value) > 100
    ) {
      return res.status(200).json({
        success: 0,
        message: "Percentage commission value cannot exceed 100",
      });
    }

    // MIN PREMIUM
    if (
      min_premium !== undefined &&
      min_premium !== null &&
      min_premium !== "" &&
      (isNaN(min_premium) || Number(min_premium) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid minimum premium",
      });
    }

    // MAX PREMIUM
    if (
      max_premium !== undefined &&
      max_premium !== null &&
      max_premium !== "" &&
      (isNaN(max_premium) || Number(max_premium) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid maximum premium",
      });
    }

    if (
      min_premium !== undefined &&
      min_premium !== null &&
      min_premium !== "" &&
      max_premium !== undefined &&
      max_premium !== null &&
      max_premium !== "" &&
      Number(max_premium) < Number(min_premium)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum premium cannot be less than minimum premium",
      });
    }

    // EFFECTIVE FROM
    if (!effective_from) {
      return res.status(200).json({
        success: 0,
        message: "Effective from date is required",
      });
    }

    // EFFECTIVE TO
    if (effective_to && effective_to < effective_from) {
      return res.status(200).json({
        success: 0,
        message: "Effective to date cannot be before effective from date",
      });
    }

    // DESCRIPTION
    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    MotorCommissionRuleService.updateCommissionRule(
      commission_rule_id,
      req.body,
      (err, result) => {
        if (err) {
          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(200).json({
              success: 0,
              message:
                "Invalid insurance company, product, policy type, vehicle category or vehicle class reference",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Database error",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Commission rule not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Commission rule updated successfully",
          data: result,
        });
      }
    );
  },

  // DELETE
  deleteCommissionRule: (req, res) => {
    const { commission_rule_id } = req.params;

    if (
      !commission_rule_id ||
      isNaN(commission_rule_id) ||
      Number(commission_rule_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid commission rule ID",
      });
    }

    MotorCommissionRuleService.deleteCommissionRule(
      commission_rule_id,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Commission rule not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Commission rule deleted successfully",
        });
      }
    );
  },

  // GET ACTIVE
  getActiveCommissionRules: (req, res) => {
    MotorCommissionRuleService.getActiveCommissionRules(
      (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          data: results,
        });
      }
    );
  },
};

module.exports = MotorCommissionRuleController;