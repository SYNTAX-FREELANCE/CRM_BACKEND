const MotorCalculationService = require("./calculator.service");

const MotorCalculationController = {
  getCalculationData: (req, res) => {
    try {
      const data = req.body;

      if (!data || typeof data !== "object") {
        return res.status(200).json({
          success: 0,
          message: "Calculation data is required",
        });
      }

      let {
        insurance_company_id,
        product_id,
        policy_type_id,
        vehicle_category_id,
        vehicle_class_id,
        fuel_type_id,
        usage_id,
        engine_cc,
        gvw,
        seating_capacity,
        vehicle_age_months,
        idv,
      } = data;

      // =====================================================
      // NORMALIZE EMPTY VALUES
      // =====================================================

      const normalizeNullableNumber = (value) => {
        if (value === null || value === undefined || value === "") {
          return null;
        }

        const number = Number(value);

        return Number.isNaN(number) ? null : number;
      };

      insurance_company_id = normalizeNullableNumber(insurance_company_id);

      product_id = normalizeNullableNumber(product_id);

      policy_type_id = normalizeNullableNumber(policy_type_id);

      vehicle_category_id = normalizeNullableNumber(vehicle_category_id);

      vehicle_class_id = normalizeNullableNumber(vehicle_class_id);

      fuel_type_id = normalizeNullableNumber(fuel_type_id);

      usage_id = normalizeNullableNumber(usage_id);

      engine_cc = normalizeNullableNumber(engine_cc);

      gvw = normalizeNullableNumber(gvw);

      seating_capacity = normalizeNullableNumber(seating_capacity);

      vehicle_age_months = normalizeNullableNumber(vehicle_age_months);

      idv = normalizeNullableNumber(idv);

      // =====================================================
      // REQUIRED MASTER FIELDS
      // =====================================================

      if (!product_id) {
        return res.status(200).json({
          success: 0,
          message: "Product is required",
        });
      }

      if (!policy_type_id) {
        return res.status(200).json({
          success: 0,
          message: "Policy type is required",
        });
      }

      if (!vehicle_category_id) {
        return res.status(200).json({
          success: 0,
          message: "Vehicle category is required",
        });
      }

      // =====================================================
      // VEHICLE CLASS
      // =====================================================

      if (vehicle_class_id !== null && vehicle_class_id < 0) {
        return res.status(200).json({
          success: 0,
          message: "Vehicle class cannot be negative",
        });
      }

      // =====================================================
      // ENGINE CC
      // =====================================================

      if (engine_cc !== null && engine_cc < 0) {
        return res.status(200).json({
          success: 0,
          message: "Engine CC cannot be negative",
        });
      }

      // =====================================================
      // GVW
      // =====================================================

      if (gvw !== null && gvw < 0) {
        return res.status(200).json({
          success: 0,
          message: "GVW cannot be negative",
        });
      }

      // =====================================================
      // SEATING CAPACITY
      // =====================================================

      if (seating_capacity !== null && seating_capacity < 0) {
        return res.status(200).json({
          success: 0,
          message: "Seating capacity cannot be negative",
        });
      }

      // =====================================================
      // VEHICLE AGE
      // =====================================================

      if (vehicle_age_months !== null && vehicle_age_months < 0) {
        return res.status(200).json({
          success: 0,
          message: "Vehicle age cannot be negative",
        });
      }

      // =====================================================
      // IDV
      // =====================================================

      if (idv !== null && idv < 0) {
        return res.status(200).json({
          success: 0,
          message: "IDV cannot be negative",
        });
      }

      // =====================================================
      // NORMALIZED DATA
      // =====================================================

      const calculationData = {
        ...data,

        insurance_company_id,
        product_id,
        policy_type_id,

        vehicle_category_id,
        vehicle_class_id,

        fuel_type_id,
        usage_id,

        engine_cc,
        gvw,
        seating_capacity,

        vehicle_age_months,
        idv,
      };

      console.log("Motor Calculation Request:", calculationData);

      // =====================================================
      // CALCULATION
      // =====================================================

      MotorCalculationService.getCalculationData(
        calculationData,
        (err, result) => {
          if (err) {
            console.error("Motor Calculation Service Error:", err);

            return res.status(200).json({
              success: 0,
              message: err.message || "Failed to calculate motor premium",
            });
          }

          return res.status(200).json({
            success: true,
            message: "Motor calculation completed successfully",
            data: result,
          });
        },
      );
    } catch (error) {
      console.error("Motor Calculation Controller Error:", error);

      return res.status(500).json({
        success: 0,
        message: error.message || "Failed to process motor calculation",
      });
    }
  },

  createQuotation: (req, res) => {
    try {
      const { quotation, input, options } = req.body || {};

      if (!quotation || typeof quotation !== "object") {
        return res.status(400).json({
          success: 0,
          message: "Quotation details are required",
        });
      }

      if (!input || typeof input !== "object") {
        return res.status(400).json({
          success: 0,
          message: "Quotation input details are required",
        });
      }

      if (!Array.isArray(options) || options.length === 0) {
        return res.status(400).json({
          success: 0,
          message: "At least one quotation option is required",
        });
      }

      if (!quotation.customer_id || !quotation.vehicle_id) {
        return res.status(400).json({
          success: 0,
          message: "Customer and vehicle are required",
        });
      }

      if (!quotation.created_by) {
        return res.status(400).json({
          success: 0,
          message: "Created by user is required",
        });
      }

      if (!input.policy_start_date) {
        return res.status(400).json({
          success: 0,
          message: "Policy start date is required",
        });
      }

      if (!input.product_id || !input.policy_type_id) {
        return res.status(400).json({
          success: 0,
          message: "Product and policy type are required",
        });
      }

      const invalidOption = options.some(
        (option) => !option.insurance_company_id || !option.option_number,
      );

      if (invalidOption) {
        return res.status(400).json({
          success: 0,
          message:
            "Each option requires an insurance company and option number",
        });
      }

      MotorCalculationService.createQuotation(req.body, (err, result) => {
        if (err) {
          console.error("Create Motor Quotation Error:", err);

          return res.status(500).json({
            success: 0,
            message: err.message || "Failed to save motor quotation",
          });
        }

        return res.status(201).json({
          success: 1,
          message: "Motor quotation saved successfully",
          data: result,
        });
      });
    } catch (error) {
      console.error("Motor Quotation Controller Error:", error);

      return res.status(500).json({
        success: 0,
        message: error.message || "Failed to save motor quotation",
      });
    }
  },
};

module.exports = MotorCalculationController;
