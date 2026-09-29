const MotorAddonConditionService = require("./motorAddonCondition.service");

const MotorAddonConditionController = {
  // CREATE
  createAddonCondition: (req, res) => {
    const {
      addon_rule_id,
      condition_type,
      condition_operator,
      condition_value,
      description,
      is_active
    } = req.body;

    if (
      !addon_rule_id ||
      isNaN(addon_rule_id) ||
      Number(addon_rule_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon rule ID is required",
      });
    }

    if (!condition_type || !condition_type.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Condition type is required",
      });
    }

    if (condition_type.length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Condition type must not exceed 50 characters",
      });
    }

    if (!condition_operator || !condition_operator.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Condition operator is required",
      });
    }

    if (condition_operator.length > 20) {
      return res.status(200).json({
        success: 0,
        message: "Condition operator must not exceed 20 characters",
      });
    }

    if (
      condition_value === null ||
      condition_value === undefined ||
      String(condition_value).trim() === ""
    ) {
      return res.status(200).json({
        success: 0,
        message: "Condition value is required",
      });
    }

    if (String(condition_value).length > 100) {
      return res.status(200).json({
        success: 0,
        message: "Condition value must not exceed 100 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description must not exceed 500 characters",
      });
    }

    MotorAddonConditionService.createAddonCondition(
      {
        addon_rule_id,
        condition_type: condition_type.trim(),
        condition_operator: condition_operator.trim(),
        condition_value: String(condition_value).trim(),
        description: description ? description.trim() : null,
        is_active: Number(is_active)
      },
      (err, result) => {
        if (err) {
          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(200).json({
              success: 0,
              message: "Invalid addon rule reference",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to create addon condition",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Addon condition created successfully",
          addon_condition_id: result.insertId,
        });
      }
    );
  },

  // GET ALL
  getAllAddonConditions: (req, res) => {
    MotorAddonConditionService.getAllAddonConditions(
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch addon conditions",
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

  // GET BY ID
  getAddonConditionById: (req, res) => {
    const { addon_condition_id } = req.params;

    if (
      !addon_condition_id ||
      isNaN(addon_condition_id) ||
      Number(addon_condition_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon condition ID is required",
      });
    }

    MotorAddonConditionService.getAddonConditionById(
      addon_condition_id,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch addon condition",
            error: err,
          });
        }

        if (result.length === 0) {
          return res.status(200).json({
            success: 0,
            message: "Addon condition not found",
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
  updateAddonCondition: (req, res) => {
    const { addon_condition_id } = req.params;

    const {
      addon_rule_id,
      condition_type,
      condition_operator,
      condition_value,
      description,
      is_active
    } = req.body;

    if (
      !addon_condition_id ||
      isNaN(addon_condition_id) ||
      Number(addon_condition_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon condition ID is required",
      });
    }

    if (
      !addon_rule_id ||
      isNaN(addon_rule_id) ||
      Number(addon_rule_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon rule ID is required",
      });
    }

    if (!condition_type || !condition_type.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Condition type is required",
      });
    }

    if (condition_type.length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Condition type must not exceed 50 characters",
      });
    }

    if (!condition_operator || !condition_operator.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Condition operator is required",
      });
    }

    if (condition_operator.length > 20) {
      return res.status(200).json({
        success: 0,
        message: "Condition operator must not exceed 20 characters",
      });
    }

    if (
      condition_value === null ||
      condition_value === undefined ||
      String(condition_value).trim() === ""
    ) {
      return res.status(200).json({
        success: 0,
        message: "Condition value is required",
      });
    }

    if (String(condition_value).length > 100) {
      return res.status(200).json({
        success: 0,
        message: "Condition value must not exceed 100 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description must not exceed 500 characters",
      });
    }

    MotorAddonConditionService.updateAddonCondition(
      addon_condition_id,
      {
        addon_rule_id,
        condition_type: condition_type.trim(),
        condition_operator: condition_operator.trim(),
        condition_value: String(condition_value).trim(),
        description: description ? description.trim() : null,
        is_active:Number(is_active)
      },
      (err, result) => {
        if (err) {
          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(200).json({
              success: 0,
              message: "Invalid addon rule reference",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to update addon condition",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Addon condition not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Addon condition updated successfully",
        });
      }
    );
  },

  // DELETE / SOFT DELETE
  deleteAddonCondition: (req, res) => {
    const { addon_condition_id } = req.params;

    if (
      !addon_condition_id ||
      isNaN(addon_condition_id) ||
      Number(addon_condition_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon condition ID is required",
      });
    }

    MotorAddonConditionService.deleteAddonCondition(
      addon_condition_id,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to delete addon condition",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Addon condition not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Addon condition deleted successfully",
        });
      }
    );
  },

  // GET ACTIVE
  getActiveAddonConditions: (req, res) => {
    MotorAddonConditionService.getActiveAddonConditions(
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch active addon conditions",
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

module.exports = MotorAddonConditionController;