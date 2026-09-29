const MotorAddonRuleService = require("./motorAddonRule.service");

const MotorAddonRuleController = {
  // CREATE
  createAddonRule: (req, res) => {
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
    } = req.body;

    if (!addon_id || isNaN(addon_id) || Number(addon_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon ID is required",
      });
    }

    if (
      insurance_company_id !== null &&
      insurance_company_id !== undefined &&
      insurance_company_id !== "" &&
      (isNaN(insurance_company_id) || Number(insurance_company_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid insurance company ID is required",
      });
    }

    if (!product_id || isNaN(product_id) || Number(product_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Valid product ID is required",
      });
    }

    if (
      policy_type_id !== null &&
      policy_type_id !== undefined &&
      policy_type_id !== "" &&
      (isNaN(policy_type_id) || Number(policy_type_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid policy type ID is required",
      });
    }

    if (
      vehicle_category_id !== null &&
      vehicle_category_id !== undefined &&
      vehicle_category_id !== "" &&
      (isNaN(vehicle_category_id) || Number(vehicle_category_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid vehicle category ID is required",
      });
    }

    if (
      vehicle_class_id !== null &&
      vehicle_class_id !== undefined &&
      vehicle_class_id !== "" &&
      (isNaN(vehicle_class_id) || Number(vehicle_class_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid vehicle class ID is required",
      });
    }

    if (
      min_vehicle_age_months !== null &&
      min_vehicle_age_months !== undefined &&
      min_vehicle_age_months !== "" &&
      (isNaN(min_vehicle_age_months) || Number(min_vehicle_age_months) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Minimum vehicle age must be 0 or greater",
      });
    }

    if (
      max_vehicle_age_months !== null &&
      max_vehicle_age_months !== undefined &&
      max_vehicle_age_months !== "" &&
      (isNaN(max_vehicle_age_months) || Number(max_vehicle_age_months) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum vehicle age must be 0 or greater",
      });
    }

    if (
      min_vehicle_age_months !== null &&
      min_vehicle_age_months !== undefined &&
      min_vehicle_age_months !== "" &&
      max_vehicle_age_months !== null &&
      max_vehicle_age_months !== undefined &&
      max_vehicle_age_months !== "" &&
      Number(max_vehicle_age_months) < Number(min_vehicle_age_months)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum vehicle age cannot be less than minimum vehicle age",
      });
    }

    if (
      min_idv !== null &&
      min_idv !== undefined &&
      min_idv !== "" &&
      (isNaN(min_idv) || Number(min_idv) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Minimum IDV must be 0 or greater",
      });
    }

    if (
      max_idv !== null &&
      max_idv !== undefined &&
      max_idv !== "" &&
      (isNaN(max_idv) || Number(max_idv) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum IDV must be 0 or greater",
      });
    }

    if (
      min_idv !== null &&
      min_idv !== undefined &&
      min_idv !== "" &&
      max_idv !== null &&
      max_idv !== undefined &&
      max_idv !== "" &&
      Number(max_idv) < Number(min_idv)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum IDV cannot be less than minimum IDV",
      });
    }

    if (!rate_type || !["PERCENTAGE", "FIXED"].includes(rate_type)) {
      return res.status(200).json({
        success: 0,
        message: "Rate type must be PERCENTAGE or FIXED",
      });
    }

    if (
      rate_value === null ||
      rate_value === undefined ||
      rate_value === "" ||
      isNaN(rate_value) ||
      Number(rate_value) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Rate value must be 0 or greater",
      });
    }

    if (
      rate_type === "PERCENTAGE" &&
      Number(rate_value) > 100
    ) {
      return res.status(200).json({
        success: 0,
        message: "Percentage rate value cannot exceed 100",
      });
    }

    if (!effective_from) {
      return res.status(200).json({
        success: 0,
        message: "Effective from date is required",
      });
    }

    if (
      effective_to &&
      new Date(effective_to) < new Date(effective_from)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Effective to date cannot be before effective from date",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description must not exceed 500 characters",
      });
    }

    MotorAddonRuleService.createAddonRule(
      {
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
      },
      (err, result) => {
        if (err) {
          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(200).json({
              success: 0,
              message: "Invalid addon, insurance company, product, policy type, vehicle category or vehicle class reference",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to create addon rule",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Addon rule created successfully",
          addon_rule_id: result.insertId,
        });
      }
    );
  },

  // GET ALL
  getAllAddonRules: (req, res) => {
    MotorAddonRuleService.getAllAddonRules((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch addon rules",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },

  // GET BY ID
  getAddonRuleById: (req, res) => {
    const { addon_rule_id } = req.params;

    if (!addon_rule_id || isNaN(addon_rule_id) || Number(addon_rule_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon rule ID is required",
      });
    }

    MotorAddonRuleService.getAddonRuleById(
      addon_rule_id,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch addon rule",
            error: err,
          });
        }

        if (result.length === 0) {
          return res.status(200).json({
            success: 0,
            message: "Addon rule not found",
          });
        }

        return res.status(200).json({
          success: 1,
          data: result[0],
        });
      }
    );
  },

  // UPDATE
  updateAddonRule: (req, res) => {
    const { addon_rule_id } = req.params;

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
    } = req.body;

    if (!addon_rule_id || isNaN(addon_rule_id) || Number(addon_rule_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon rule ID is required",
      });
    }

    if (!addon_id || isNaN(addon_id) || Number(addon_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon ID is required",
      });
    }

    if (
      insurance_company_id !== null &&
      insurance_company_id !== undefined &&
      insurance_company_id !== "" &&
      (isNaN(insurance_company_id) || Number(insurance_company_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid insurance company ID is required",
      });
    }

    if (!product_id || isNaN(product_id) || Number(product_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Valid product ID is required",
      });
    }

    if (
      policy_type_id !== null &&
      policy_type_id !== undefined &&
      policy_type_id !== "" &&
      (isNaN(policy_type_id) || Number(policy_type_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid policy type ID is required",
      });
    }

    if (
      vehicle_category_id !== null &&
      vehicle_category_id !== undefined &&
      vehicle_category_id !== "" &&
      (isNaN(vehicle_category_id) || Number(vehicle_category_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid vehicle category ID is required",
      });
    }

    if (
      vehicle_class_id !== null &&
      vehicle_class_id !== undefined &&
      vehicle_class_id !== "" &&
      (isNaN(vehicle_class_id) || Number(vehicle_class_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid vehicle class ID is required",
      });
    }

    if (
      min_vehicle_age_months !== null &&
      min_vehicle_age_months !== undefined &&
      min_vehicle_age_months !== "" &&
      (isNaN(min_vehicle_age_months) || Number(min_vehicle_age_months) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Minimum vehicle age must be 0 or greater",
      });
    }

    if (
      max_vehicle_age_months !== null &&
      max_vehicle_age_months !== undefined &&
      max_vehicle_age_months !== "" &&
      (isNaN(max_vehicle_age_months) || Number(max_vehicle_age_months) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum vehicle age must be 0 or greater",
      });
    }

    if (
      min_vehicle_age_months !== null &&
      min_vehicle_age_months !== undefined &&
      min_vehicle_age_months !== "" &&
      max_vehicle_age_months !== null &&
      max_vehicle_age_months !== undefined &&
      max_vehicle_age_months !== "" &&
      Number(max_vehicle_age_months) < Number(min_vehicle_age_months)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum vehicle age cannot be less than minimum vehicle age",
      });
    }

    if (
      min_idv !== null &&
      min_idv !== undefined &&
      min_idv !== "" &&
      (isNaN(min_idv) || Number(min_idv) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Minimum IDV must be 0 or greater",
      });
    }

    if (
      max_idv !== null &&
      max_idv !== undefined &&
      max_idv !== "" &&
      (isNaN(max_idv) || Number(max_idv) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum IDV must be 0 or greater",
      });
    }

    if (
      min_idv !== null &&
      min_idv !== undefined &&
      min_idv !== "" &&
      max_idv !== null &&
      max_idv !== undefined &&
      max_idv !== "" &&
      Number(max_idv) < Number(min_idv)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum IDV cannot be less than minimum IDV",
      });
    }

    if (!rate_type || !["PERCENTAGE", "FIXED"].includes(rate_type)) {
      return res.status(200).json({
        success: 0,
        message: "Rate type must be PERCENTAGE or FIXED",
      });
    }

    if (
      rate_value === null ||
      rate_value === undefined ||
      rate_value === "" ||
      isNaN(rate_value) ||
      Number(rate_value) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Rate value must be 0 or greater",
      });
    }

    if (
      rate_type === "PERCENTAGE" &&
      Number(rate_value) > 100
    ) {
      return res.status(200).json({
        success: 0,
        message: "Percentage rate value cannot exceed 100",
      });
    }

    if (!effective_from) {
      return res.status(200).json({
        success: 0,
        message: "Effective from date is required",
      });
    }

    if (
      effective_to &&
      new Date(effective_to) < new Date(effective_from)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Effective to date cannot be before effective from date",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description must not exceed 500 characters",
      });
    }

    MotorAddonRuleService.updateAddonRule(
      addon_rule_id,
      {
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
      },
      (err, result) => {
        if (err) {
          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(200).json({
              success: 0,
              message: "Invalid addon, insurance company, product, policy type, vehicle category or vehicle class reference",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to update addon rule",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Addon rule not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Addon rule updated successfully",
        });
      }
    );
  },

  // DELETE / SOFT DELETE
  deleteAddonRule: (req, res) => {
    const { addon_rule_id } = req.params;

    if (!addon_rule_id || isNaN(addon_rule_id) || Number(addon_rule_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon rule ID is required",
      });
    }

    MotorAddonRuleService.deleteAddonRule(
      addon_rule_id,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to delete addon rule",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Addon rule not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Addon rule deleted successfully",
        });
      }
    );
  },

  // GET ACTIVE
  getActiveAddonRules: (req, res) => {
    MotorAddonRuleService.getActiveAddonRules(
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch active addon rules",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          data: result,
        });
      }
    );
  },
};

module.exports = MotorAddonRuleController;