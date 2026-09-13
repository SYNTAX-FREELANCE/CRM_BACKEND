const incentiveSlabService = require("./incentiveSlab.service");

module.exports = {
  // ==================== CREATE INCENTIVE SLAB ====================

  createIncentiveSlab: (req, res) => {
    try {
      const {
        incentive_scheme_id,
        minimum_capture,
        incentive_amount,
        created_by,
      } = req.body;

      // ==================== VALIDATION ====================

      if (!incentive_scheme_id || incentive_scheme_id === "") {
        return res.status(200).json({
          success: 0,

          message: "Incentive scheme is required",
        });
      }

      if (
        minimum_capture === undefined ||
        minimum_capture === null ||
        minimum_capture === ""
      ) {
        return res.status(200).json({
          success: 0,

          message: "Minimum capture is required",
        });
      }

      if (!Number.isInteger(Number(minimum_capture))) {
        return res.status(200).json({
          success: 0,

          message: "Minimum capture must be a valid number",
        });
      }

      if (Number(minimum_capture) < 0) {
        return res.status(200).json({
          success: 0,

          message: "Minimum capture cannot be negative",
        });
      }

      if (
        incentive_amount === undefined ||
        incentive_amount === null ||
        incentive_amount === ""
      ) {
        return res.status(200).json({
          success: 0,

          message: "Incentive amount is required",
        });
      }

      if (isNaN(Number(incentive_amount))) {
        return res.status(200).json({
          success: 0,

          message: "Incentive amount must be a valid amount",
        });
      }

      if (Number(incentive_amount) < 0) {
        return res.status(200).json({
          success: 0,

          message: "Incentive amount cannot be negative",
        });
      }

      const incentiveSlabData = {
        incentive_scheme_id: incentive_scheme_id,

        minimum_capture: Number(minimum_capture),

        incentive_amount: Number(incentive_amount),
        created_by: created_by,
      };

      incentiveSlabService.createIncentiveSlab(
        incentiveSlabData,

        (err, result) => {
          if (err) {
            console.error("createIncentiveSlab error:", err);

            // Duplicate slab

            if (err.code === "ER_DUP_ENTRY") {
              return res.status(200).json({
                success: 0,

                message:
                  "A slab with this minimum capture already exists for the selected incentive scheme",
              });
            }

            // Invalid incentive scheme

            if (err.code === "ER_NO_REFERENCED_ROW_2") {
              return res.status(200).json({
                success: 0,

                message: "Selected incentive scheme does not exist",
              });
            }

            return res.status(500).json({
              success: 0,

              message: "Something went wrong while creating incentive slab",
            });
          }

          return res.status(200).json({
            success: 1,

            message: "Incentive slab created successfully",

            data: {
              incentive_slab_id: result.insertId,

              incentive_scheme_id: incentiveSlabData.incentive_scheme_id,

              minimum_capture: incentiveSlabData.minimum_capture,

              incentive_amount: incentiveSlabData.incentive_amount,
            },
          });
        },
      );
    } catch (error) {
      console.error("createIncentiveSlab error:", error);

      return res.status(500).json({
        success: 0,

        message: "Something went wrong",
      });
    }
  },

  // ==================== GET ALL INCENTIVE SLABS ====================

  getAllIncentiveSlabs: (req, res) => {
    try {
      incentiveSlabService.getAllIncentiveSlabs((err, slabs) => {
        if (err) {
          console.error("getAllIncentiveSlabs error:", err);

          return res.status(500).json({
            success: 0,

            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          success: 1,

          message: "Incentive slabs retrieved successfully",

          data: slabs,
        });
      });
    } catch (error) {
      console.error("getAllIncentiveSlabs error:", error);

      return res.status(500).json({
        success: 0,

        message: "Something went wrong",
      });
    }
  },

  // ==================== GET INCENTIVE SLAB BY ID ====================

  getIncentiveSlabById: (req, res) => {
    try {
      const { incentiveSlabId } = req.params;

      incentiveSlabService.getIncentiveSlabById(
        incentiveSlabId,

        (err, slab) => {
          if (err) {
            console.error("getIncentiveSlabById error:", err);

            return res.status(500).json({
              success: 0,

              message: "Something went wrong",
            });
          }

          if (!slab) {
            return res.status(200).json({
              success: 0,

              message: "Incentive slab not found",
            });
          }

          return res.status(200).json({
            success: 1,

            message: "Incentive slab retrieved successfully",

            data: slab,
          });
        },
      );
    } catch (error) {
      console.error("getIncentiveSlabById error:", error);

      return res.status(500).json({
        success: 0,

        message: "Something went wrong",
      });
    }
  },

  // ==================== UPDATE INCENTIVE SLAB ====================

  updateIncentiveSlab: (req, res) => {
    try {
      const { incentiveSlabId } = req.params;

      const {
        incentive_scheme_id,
        minimum_capture,
        incentive_amount,
        created_by,
      } = req.body;

      // ==================== VALIDATION ====================

      if (!incentive_scheme_id || incentive_scheme_id === "") {
        return res.status(200).json({
          success: 0,

          message: "Incentive scheme is required",
        });
      }

      if (
        minimum_capture === undefined ||
        minimum_capture === null ||
        minimum_capture === ""
      ) {
        return res.status(200).json({
          success: 0,

          message: "Minimum capture is required",
        });
      }

      if (!Number.isInteger(Number(minimum_capture))) {
        return res.status(200).json({
          success: 0,

          message: "Minimum capture must be a valid number",
        });
      }

      if (Number(minimum_capture) < 0) {
        return res.status(200).json({
          success: 0,

          message: "Minimum capture cannot be negative",
        });
      }

      if (
        incentive_amount === undefined ||
        incentive_amount === null ||
        incentive_amount === ""
      ) {
        return res.status(200).json({
          success: 0,

          message: "Incentive amount is required",
        });
      }

      if (isNaN(Number(incentive_amount))) {
        return res.status(200).json({
          success: 0,

          message: "Incentive amount must be a valid amount",
        });
      }

      if (Number(incentive_amount) < 0) {
        return res.status(200).json({
          success: 0,

          message: "Incentive amount cannot be negative",
        });
      }

      const incentiveSlabData = {
        incentive_scheme_id: incentive_scheme_id,

        minimum_capture: Number(minimum_capture),

        incentive_amount: Number(incentive_amount),
        updated_by: created_by,
      };

      incentiveSlabService.updateIncentiveSlab(
        incentiveSlabId,

        incentiveSlabData,

        (err, result) => {
          if (err) {
            console.error("updateIncentiveSlab error:", err);

            if (err.code === "ER_DUP_ENTRY") {
              return res.status(200).json({
                success: 0,

                message:
                  "A slab with this minimum capture already exists for the selected incentive scheme",
              });
            }

            if (err.code === "ER_NO_REFERENCED_ROW_2") {
              return res.status(200).json({
                success: 0,

                message: "Selected incentive scheme does not exist",
              });
            }

            return res.status(500).json({
              success: 0,

              message: "Something went wrong while updating incentive slab",
            });
          }

          return res.status(200).json({
            success: 1,

            message: "Incentive slab updated successfully",

            data: {
              incentive_slab_id: incentiveSlabId,
            },
          });
        },
      );
    } catch (error) {
      console.error("updateIncentiveSlab error:", error);

      return res.status(500).json({
        success: 0,

        message: "Something went wrong",
      });
    }
  },

  // ==================== DELETE INCENTIVE SLAB ====================

  deleteIncentiveSlab: (req, res) => {
    try {
      const { incentiveSlabId } = req.params;

      incentiveSlabService.deleteIncentiveSlab(
        incentiveSlabId,

        (err, result) => {
          if (err) {
            console.error("deleteIncentiveSlab error:", err);

            return res.status(500).json({
              success: 0,

              message: "Something went wrong while deleting incentive slab",
            });
          }

          return res.status(200).json({
            success: 1,

            message: "Incentive slab deleted successfully",
          });
        },
      );
    } catch (error) {
      console.error("deleteIncentiveSlab error:", error);

      return res.status(500).json({
        success: 0,

        message: "Something went wrong",
      });
    }
  },

  // ==================== GET INCENTIVE SLABS BY EMPLOYEE ====================

  getIncentiveSlabsByEmployee: (req, res) => {
    try {
      const { employeeId } = req.params;

      if (!employeeId) {
        return res.status(200).json({
          success: 0,

          message: "Employee ID is required",
        });
      }

      incentiveSlabService.getIncentiveSlabsByEmployee(
        employeeId,

        (err, slabs) => {
          if (err) {
            console.error("getIncentiveSlabsByEmployee error:", err);

            return res.status(500).json({
              success: 0,

              message: "Something went wrong while fetching incentive slabs",
            });
          }

          return res.status(200).json({
            success: 1,

            message: "Incentive slabs retrieved successfully",

            data: slabs,
          });
        },
      );
    } catch (error) {
      console.error("getIncentiveSlabsByEmployee error:", error);

      return res.status(500).json({
        success: 0,

        message: "Something went wrong",
      });
    }
  },

  calculateIncentive: (req, res) => {
    const { employee_id, capture_count } = req.body;

    // Validate employee id
    if (!employee_id) {
      return res.status(200).json({
        success: 0,
        message: "Employee ID is required",
      });
    }

    // Validate capture count
    if (
      capture_count === undefined ||
      capture_count === null ||
      capture_count === "" ||
      isNaN(capture_count)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Capture count is required",
      });
    }

    const captureCount = Number(capture_count);

    if (!Number.isInteger(captureCount) || captureCount < 0) {
      return res.status(200).json({
        success: 0,
        message: "Capture count must be a valid positive integer",
      });
    }

    incentiveSlabService.calculateIncentive(
      employee_id,
      captureCount,
      (error, result) => {
        if (error) {
          console.error("Calculate Incentive Error:", error);

          return res.status(500).json({
            success: 0,
            message: "Failed to calculate incentive",
          });
        }

        // Employee not found
        if (result.employee_found === false) {
          return res.status(200).json({
            success: 0,
            message: "Employee not found",
          });
        }

        // No active scheme
        if (result.scheme_found === false) {
          return res.status(200).json({
            success: 0,
            message: "No active incentive scheme found for this employee",
          });
        }

        // Scheme exists but capture has not reached first slab
        if (result.slab_found === false) {
          return res.status(200).json({
            success: 1,
            message: "Capture count has not reached the minimum incentive slab",
            data: {
              employee_id: employee_id,
              capture_count: captureCount,
              employee_level_id: result.employee_level_id,
              level_name: result.level_name,
              incentive_scheme_id: result.incentive_scheme_id,
              scheme_name: result.scheme_name,
              current_incentive: 0,
              slab: null,
            },
          });
        }

        // Success
        return res.status(200).json({
          success: 1,
          message: "Incentive calculated successfully",
          data: {
            employee_id: employee_id,
            capture_count: captureCount,

            employee_level_id: result.employee_level_id,
            level_name: result.level_name,

            incentive_scheme_id: result.incentive_scheme_id,

            scheme_name: result.scheme_name,

            current_incentive: result.current_incentive,

            rate_per_capture: result.rate_per_capture,

            slab: {
              incentive_slab_id: result.incentive_slab_id,

              minimum_capture: result.minimum_capture,

              incentive_amount: result.incentive_amount,
            },
          },
        });
      },
    );
  },
};
