const MotorCashbackRuleService = require("./motorCashbackRule.service");

const MotorCashbackRuleController = {
  // CREATE
  createCashbackRule: (req, res) => {
    const {
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      cashback_type,
      cashback_value,
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

    // CASHBACK TYPE
    const allowedCashbackTypes = ["PERCENTAGE", "FIXED"];

    if (
      !cashback_type ||
      !allowedCashbackTypes.includes(cashback_type)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid cashback type",
      });
    }

    // CASHBACK VALUE
    if (
      cashback_value === undefined ||
      cashback_value === null ||
      cashback_value === "" ||
      isNaN(cashback_value) ||
      Number(cashback_value) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid cashback value is required",
      });
    }

    if (
      cashback_type === "PERCENTAGE" &&
      Number(cashback_value) > 100
    ) {
      return res.status(200).json({
        success: 0,
        message: "Percentage cashback value cannot exceed 100",
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

    MotorCashbackRuleService.createCashbackRule(
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
          message: "Cashback rule created successfully",
          data: result,
        });
      }
    );
  },

  // GET ALL
  getAllCashbackRules: (req, res) => {
    MotorCashbackRuleService.getAllCashbackRules(
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
  getCashbackRuleById: (req, res) => {
    const { cashback_rule_id } = req.params;

    if (
      !cashback_rule_id ||
      isNaN(cashback_rule_id) ||
      Number(cashback_rule_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid cashback rule ID",
      });
    }

    MotorCashbackRuleService.getCashbackRuleById(
      cashback_rule_id,
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
            message: "Cashback rule not found",
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
  updateCashbackRule: (req, res) => {
    const { cashback_rule_id } = req.params;

    const {
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      cashback_type,
      cashback_value,
      min_premium,
      max_premium,
      effective_from,
      effective_to,
      description,
    } = req.body;

    // ID
    if (
      !cashback_rule_id ||
      isNaN(cashback_rule_id) ||
      Number(cashback_rule_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid cashback rule ID",
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

    // CASHBACK TYPE
    const allowedCashbackTypes = ["PERCENTAGE", "FIXED"];

    if (
      !cashback_type ||
      !allowedCashbackTypes.includes(cashback_type)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid cashback type",
      });
    }

    // CASHBACK VALUE
    if (
      cashback_value === undefined ||
      cashback_value === null ||
      cashback_value === "" ||
      isNaN(cashback_value) ||
      Number(cashback_value) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid cashback value is required",
      });
    }

    if (
      cashback_type === "PERCENTAGE" &&
      Number(cashback_value) > 100
    ) {
      return res.status(200).json({
        success: 0,
        message: "Percentage cashback value cannot exceed 100",
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

    MotorCashbackRuleService.updateCashbackRule(
      cashback_rule_id,
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
            message: "Cashback rule not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Cashback rule updated successfully",
          data: result,
        });
      }
    );
  },

  // DELETE
  deleteCashbackRule: (req, res) => {
    const { cashback_rule_id } = req.params;

    if (
      !cashback_rule_id ||
      isNaN(cashback_rule_id) ||
      Number(cashback_rule_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid cashback rule ID",
      });
    }

    MotorCashbackRuleService.deleteCashbackRule(
      cashback_rule_id,
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
            message: "Cashback rule not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Cashback rule deleted successfully",
        });
      }
    );
  },

  // GET ACTIVE
  getActiveCashbackRules: (req, res) => {
    MotorCashbackRuleService.getActiveCashbackRules(
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

module.exports = MotorCashbackRuleController;