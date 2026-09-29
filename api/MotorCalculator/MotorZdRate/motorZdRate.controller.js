const ZdRateService = require("./motorZdRate.service");

const ZdRateController = {
  // CREATE
  createZdRate: (req, res) => {
    const {
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      min_age_months,
      max_age_months,
      rate_type,
      rate_value,
      effective_from,
      effective_to,
      description
    } = req.body;

    if (!product_id || isNaN(product_id) || Number(product_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Valid product_id is required",
      });
    }

    if (
      insurance_company_id !== undefined &&
      insurance_company_id !== null &&
      insurance_company_id !== "" &&
      (isNaN(insurance_company_id) || Number(insurance_company_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid insurance_company_id",
      });
    }

    if (
      policy_type_id !== undefined &&
      policy_type_id !== null &&
      policy_type_id !== "" &&
      (isNaN(policy_type_id) || Number(policy_type_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid policy_type_id",
      });
    }

    if (
      vehicle_category_id !== undefined &&
      vehicle_category_id !== null &&
      vehicle_category_id !== "" &&
      (isNaN(vehicle_category_id) || Number(vehicle_category_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid vehicle_category_id",
      });
    }

    if (
      vehicle_class_id !== undefined &&
      vehicle_class_id !== null &&
      vehicle_class_id !== "" &&
      (isNaN(vehicle_class_id) || Number(vehicle_class_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid vehicle_class_id",
      });
    }

    if (
      min_age_months !== undefined &&
      min_age_months !== null &&
      min_age_months !== "" &&
      (isNaN(min_age_months) || Number(min_age_months) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid min_age_months",
      });
    }

    if (
      max_age_months !== undefined &&
      max_age_months !== null &&
      max_age_months !== "" &&
      (isNaN(max_age_months) || Number(max_age_months) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid max_age_months",
      });
    }

    if (
      min_age_months !== undefined &&
      min_age_months !== null &&
      min_age_months !== "" &&
      max_age_months !== undefined &&
      max_age_months !== null &&
      max_age_months !== "" &&
      Number(max_age_months) < Number(min_age_months)
    ) {
      return res.status(200).json({
        success: 0,
        message:
          "max_age_months must be greater than or equal to min_age_months",
      });
    }

    if (!["PERCENTAGE", "FIXED"].includes(rate_type)) {
      return res.status(200).json({
        success: 0,
        message: "rate_type must be PERCENTAGE or FIXED",
      });
    }

    if (
      rate_value === undefined ||
      rate_value === null ||
      rate_value === "" ||
      isNaN(rate_value) ||
      Number(rate_value) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid rate_value is required",
      });
    }

    if (rate_type === "PERCENTAGE" && Number(rate_value) > 100) {
      return res.status(200).json({
        success: 0,
        message: "Percentage rate_value cannot exceed 100",
      });
    }

    if (!effective_from) {
      return res.status(200).json({
        success: 0,
        message: "effective_from is required",
      });
    }

    if (
      effective_to &&
      new Date(effective_to) < new Date(effective_from)
    ) {
      return res.status(200).json({
        success: 0,
        message: "effective_to cannot be earlier than effective_from",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "description cannot exceed 500 characters",
      });
    }

    ZdRateService.createZdRate(req.body, (err, result) => {
      if (err) {
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(200).json({
            success: 0,
            message: "Invalid reference in ZD rate data",
          });
        }

        return res.status(500).json({
          success: 0,
          message: "Failed to create ZD rate",
          error: err.message,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "ZD rate created successfully",
        zd_rate_id: result.insertId,
      });
    });
  },

  // GET ALL
  getAllZdRates: (req, res) => {
    ZdRateService.getAllZdRates((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch ZD rates",
          error: err.message,
        });
      }

      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },

  // GET BY ID
  getZdRateById: (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id) || Number(id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Invalid zd_rate_id",
      });
    }

    ZdRateService.getZdRateById(id, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch ZD rate",
          error: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(200).json({
          success: 0,
          message: "ZD rate not found",
        });
      }

      return res.status(200).json({
        success: 1,
        data: result[0],
      });
    });
  },

  // UPDATE
  updateZdRate: (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id) || Number(id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Invalid zd_rate_id",
      });
    }

    const {
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      min_age_months,
      max_age_months,
      rate_type,
      rate_value,
      effective_from,
      effective_to,
      description,
      is_active
    } = req.body;

    if (!product_id || isNaN(product_id) || Number(product_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Valid product_id is required",
      });
    }

    if (
      insurance_company_id !== undefined &&
      insurance_company_id !== null &&
      insurance_company_id !== "" &&
      (isNaN(insurance_company_id) || Number(insurance_company_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid insurance_company_id",
      });
    }

    if (
      policy_type_id !== undefined &&
      policy_type_id !== null &&
      policy_type_id !== "" &&
      (isNaN(policy_type_id) || Number(policy_type_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid policy_type_id",
      });
    }

    if (
      vehicle_category_id !== undefined &&
      vehicle_category_id !== null &&
      vehicle_category_id !== "" &&
      (isNaN(vehicle_category_id) || Number(vehicle_category_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid vehicle_category_id",
      });
    }

    if (
      vehicle_class_id !== undefined &&
      vehicle_class_id !== null &&
      vehicle_class_id !== "" &&
      (isNaN(vehicle_class_id) || Number(vehicle_class_id) <= 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid vehicle_class_id",
      });
    }

    if (
      min_age_months !== undefined &&
      min_age_months !== null &&
      min_age_months !== "" &&
      (isNaN(min_age_months) || Number(min_age_months) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid min_age_months",
      });
    }

    if (
      max_age_months !== undefined &&
      max_age_months !== null &&
      max_age_months !== "" &&
      (isNaN(max_age_months) || Number(max_age_months) < 0)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid max_age_months",
      });
    }

    if (
      min_age_months !== undefined &&
      min_age_months !== null &&
      min_age_months !== "" &&
      max_age_months !== undefined &&
      max_age_months !== null &&
      max_age_months !== "" &&
      Number(max_age_months) < Number(min_age_months)
    ) {
      return res.status(200).json({
        success: 0,
        message:
          "max_age_months must be greater than or equal to min_age_months",
      });
    }

    if (!["PERCENTAGE", "FIXED"].includes(rate_type)) {
      return res.status(200).json({
        success: 0,
        message: "rate_type must be PERCENTAGE or FIXED",
      });
    }

    if (
      rate_value === undefined ||
      rate_value === null ||
      rate_value === "" ||
      isNaN(rate_value) ||
      Number(rate_value) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid rate_value is required",
      });
    }

    if (rate_type === "PERCENTAGE" && Number(rate_value) > 100) {
      return res.status(200).json({
        success: 0,
        message: "Percentage rate_value cannot exceed 100",
      });
    }

    if (!effective_from) {
      return res.status(200).json({
        success: 0,
        message: "effective_from is required",
      });
    }

    if (
      effective_to &&
      new Date(effective_to) < new Date(effective_from)
    ) {
      return res.status(200).json({
        success: 0,
        message: "effective_to cannot be earlier than effective_from",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "description cannot exceed 500 characters",
      });
    }

    ZdRateService.updateZdRate(id, req.body, (err, result) => {
      if (err) {
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(200).json({
            success: 0,
            message: "Invalid reference in ZD rate data",
          });
        }

        return res.status(500).json({
          success: 0,
          message: "Failed to update ZD rate",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(200).json({
          success: 0,
          message: "ZD rate not found",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "ZD rate updated successfully",
      });
    });
  },

  // DELETE
  deleteZdRate: (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id) || Number(id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Invalid zd_rate_id",
      });
    }

    ZdRateService.deleteZdRate(id, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to delete ZD rate",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(200).json({
          success: 0,
          message: "ZD rate not found",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "ZD rate deleted successfully",
      });
    });
  },

  // GET ACTIVE
  getActiveZdRates: (req, res) => {
    ZdRateService.getActiveZdRates((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch active ZD rates",
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

module.exports = ZdRateController;