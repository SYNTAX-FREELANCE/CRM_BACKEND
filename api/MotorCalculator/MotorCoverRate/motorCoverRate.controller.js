const MotorCoverRateService = require("./motorCoverRate.service");

const MotorCoverRateController = {
  // CREATE
  createCoverRate: (req, res) => {
    const {
      cover_id,
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      rate_type,
      rate_value,
      effective_from,
      effective_to,
      description,
    } = req.body;

    // COVER
    if (!cover_id || isNaN(cover_id) || Number(cover_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Cover is required",
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

    // RATE TYPE
    const allowedRateTypes = ["FIXED", "PER_UNIT", "PERCENTAGE"];

    if (!rate_type || !allowedRateTypes.includes(rate_type)) {
      return res.status(200).json({
        success: 0,
        message: "Invalid rate type",
      });
    }

    // RATE VALUE
    if (
      rate_value === undefined ||
      rate_value === null ||
      rate_value === "" ||
      isNaN(rate_value) ||
      Number(rate_value) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid rate value is required",
      });
    }

    if (rate_type === "PERCENTAGE" && Number(rate_value) > 100) {
      return res.status(200).json({
        success: 0,
        message: "Percentage rate value cannot exceed 100",
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

    MotorCoverRateService.createCoverRate(req.body, (err, result) => {
      if (err) {
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(200).json({
            success: 0,
            message: "Invalid cover, insurance company, product, policy type, vehicle category or vehicle class reference",
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
        message: "Cover rate created successfully",
        data: result,
      });
    });
  },

  // GET ALL
  getAllCoverRates: (req, res) => {
    MotorCoverRateService.getAllCoverRates((err, results) => {
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
    });
  },

  // GET BY ID
  getCoverRateById: (req, res) => {
    const { cover_rate_id } = req.params;

    if (!cover_rate_id || isNaN(cover_rate_id)) {
      return res.status(200).json({
        success: 0,
        message: "Invalid cover rate ID",
      });
    }

    MotorCoverRateService.getCoverRateById(
      cover_rate_id,
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
            message: "Cover rate not found",
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
  updateCoverRate: (req, res) => {
    const { cover_rate_id } = req.params;

    const {
      cover_id,
      insurance_company_id,
      product_id,
      policy_type_id,
      vehicle_category_id,
      vehicle_class_id,
      rate_type,
      rate_value,
      effective_from,
      effective_to,
      description,
    } = req.body;

    if (!cover_rate_id || isNaN(cover_rate_id)) {
      return res.status(200).json({
        success: 0,
        message: "Invalid cover rate ID",
      });
    }

    if (!cover_id || isNaN(cover_id) || Number(cover_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Cover is required",
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
        message: "Invalid insurance company",
      });
    }

    if (!product_id || isNaN(product_id) || Number(product_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Product is required",
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
        message: "Invalid policy type",
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
        message: "Invalid vehicle category",
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
        message: "Invalid vehicle class",
      });
    }

    const allowedRateTypes = ["FIXED", "PER_UNIT", "PERCENTAGE"];

    if (!rate_type || !allowedRateTypes.includes(rate_type)) {
      return res.status(200).json({
        success: 0,
        message: "Invalid rate type",
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
        message: "Valid rate value is required",
      });
    }

    if (rate_type === "PERCENTAGE" && Number(rate_value) > 100) {
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

    if (effective_to && effective_to < effective_from) {
      return res.status(200).json({
        success: 0,
        message: "Effective to date cannot be before effective from date",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    MotorCoverRateService.updateCoverRate(
      cover_rate_id,
      req.body,
      (err, result) => {
        if (err) {
          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(200).json({
              success: 0,
              message:
                "Invalid cover, insurance company, product, policy type, vehicle category or vehicle class reference",
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
            message: "Cover rate not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Cover rate updated successfully",
          data: result,
        });
      }
    );
  },

  // DELETE
  deleteCoverRate: (req, res) => {
    const { cover_rate_id } = req.params;

    if (!cover_rate_id || isNaN(cover_rate_id)) {
      return res.status(200).json({
        success: 0,
        message: "Invalid cover rate ID",
      });
    }

    MotorCoverRateService.deleteCoverRate(
      cover_rate_id,
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
            message: "Cover rate not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Cover rate deleted successfully",
        });
      }
    );
  },

  // GET ACTIVE
  getActiveCoverRates: (req, res) => {
    MotorCoverRateService.getActiveCoverRates((err, results) => {
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
    });
  },
};

module.exports = MotorCoverRateController;