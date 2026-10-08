const MotorOdRateSlabService = require("./motorOdRateSlab.service");

const MotorOdRateSlabController = {

  // =========================================================
  // CREATE
  // =========================================================

  createOdRateSlab: (req, res) => {

    const {
      od_rate_id,

      engine_cc_slab_id,
      gvw_slab_id,

      min_seating_capacity,
      max_seating_capacity,

      min_age_months,
      max_age_months,

      rate_value,
      description,
      is_active,
    } = req.body;


    // =======================================================
    // OD RATE ID
    // =======================================================

    if (
      !od_rate_id ||
      isNaN(od_rate_id) ||
      Number(od_rate_id) <= 0
    ) {

      return res.status(200).json({
        success: 0,
        message: "Valid OD rate ID is required",
      });
    }


    // =======================================================
    // ENGINE CC SLAB ID
    // =======================================================

    if (
      engine_cc_slab_id !== null &&
      engine_cc_slab_id !== undefined &&
      engine_cc_slab_id !== "" &&
      (
        isNaN(engine_cc_slab_id) ||
        Number(engine_cc_slab_id) <= 0
      )
    ) {

      return res.status(200).json({
        success: 0,
        message: "Valid engine CC slab ID is required",
      });
    }


    // =======================================================
    // GVW SLAB ID
    // =======================================================

    if (
      gvw_slab_id !== null &&
      gvw_slab_id !== undefined &&
      gvw_slab_id !== "" &&
      (
        isNaN(gvw_slab_id) ||
        Number(gvw_slab_id) <= 0
      )
    ) {

      return res.status(200).json({
        success: 0,
        message: "Valid GVW slab ID is required",
      });
    }


    // =======================================================
    // AT LEAST ONE DIMENSION
    // =======================================================

    if (
      (!engine_cc_slab_id ||
        Number(engine_cc_slab_id) <= 0) &&

      (!gvw_slab_id ||
        Number(gvw_slab_id) <= 0) &&

      (
        min_seating_capacity === null ||
        min_seating_capacity === undefined ||
        min_seating_capacity === ""
      ) &&

      (
        max_seating_capacity === null ||
        max_seating_capacity === undefined ||
        max_seating_capacity === ""
      ) &&

      (
        min_age_months === null ||
        min_age_months === undefined ||
        min_age_months === ""
      ) &&

      (
        max_age_months === null ||
        max_age_months === undefined ||
        max_age_months === ""
      )
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "At least one of Engine CC, GVW, Seating Capacity or Vehicle Age is required",
      });
    }


    // =======================================================
    // MIN SEATING CAPACITY
    // =======================================================

    if (
      min_seating_capacity !== null &&
      min_seating_capacity !== undefined &&
      min_seating_capacity !== "" &&
      (
        isNaN(min_seating_capacity) ||
        Number(min_seating_capacity) < 0
      )
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Minimum seating capacity must be 0 or greater",
      });
    }


    // =======================================================
    // MAX SEATING CAPACITY
    // =======================================================

    if (
      max_seating_capacity !== null &&
      max_seating_capacity !== undefined &&
      max_seating_capacity !== "" &&
      (
        isNaN(max_seating_capacity) ||
        Number(max_seating_capacity) < 0
      )
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Maximum seating capacity must be 0 or greater",
      });
    }


    // =======================================================
    // SEATING RANGE
    // =======================================================

    if (
      min_seating_capacity !== null &&
      min_seating_capacity !== undefined &&
      min_seating_capacity !== "" &&

      max_seating_capacity !== null &&
      max_seating_capacity !== undefined &&
      max_seating_capacity !== "" &&

      Number(max_seating_capacity) <
      Number(min_seating_capacity)
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Maximum seating capacity cannot be less than minimum seating capacity",
      });
    }


    // =======================================================
    // MIN VEHICLE AGE
    // =======================================================

    if (
      min_age_months !== null &&
      min_age_months !== undefined &&
      min_age_months !== "" &&
      (
        isNaN(min_age_months) ||
        Number(min_age_months) < 0
      )
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Minimum vehicle age must be 0 or greater",
      });
    }


    // =======================================================
    // MAX VEHICLE AGE
    // =======================================================

    if (
      max_age_months !== null &&
      max_age_months !== undefined &&
      max_age_months !== "" &&
      (
        isNaN(max_age_months) ||
        Number(max_age_months) < 0
      )
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Maximum vehicle age must be 0 or greater",
      });
    }


    // =======================================================
    // VEHICLE AGE RANGE
    // =======================================================

    if (
      min_age_months !== null &&
      min_age_months !== undefined &&
      min_age_months !== "" &&

      max_age_months !== null &&
      max_age_months !== undefined &&
      max_age_months !== "" &&

      Number(max_age_months) <
      Number(min_age_months)
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Maximum vehicle age cannot be less than minimum vehicle age",
      });
    }


    // =======================================================
    // RATE VALUE
    // =======================================================

    if (
      rate_value === null ||
      rate_value === undefined ||
      rate_value === "" ||
      isNaN(rate_value) ||
      Number(rate_value) < 0
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Rate value must be 0 or greater",
      });
    }


    // =======================================================
    // DESCRIPTION
    // =======================================================

    if (
      description &&
      description.length > 500
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Description must not exceed 500 characters",
      });
    }


    // =======================================================
    // CREATE SERVICE
    // =======================================================

    MotorOdRateSlabService.createOdRateSlab(
      {

        od_rate_id,

        engine_cc_slab_id,
        gvw_slab_id,

        min_seating_capacity,
        max_seating_capacity,

        min_age_months,
        max_age_months,

        rate_value,
        description,
        is_active,

      },

      (err, result) => {

        if (err) {

          if (
            err.code ===
            "ER_NO_REFERENCED_ROW_2"
          ) {

            return res.status(200).json({
              success: 0,
              message:
                "Invalid OD rate, engine CC slab or GVW slab reference",
            });
          }


          return res.status(500).json({
            success: 0,
            message:
              "Failed to create OD rate slab",
            error: err,
          });
        }


        return res.status(200).json({

          success: 1,

          message:
            "OD rate slab created successfully",

          od_rate_slab_id:
            result.insertId,

        });
      }
    );
  },


  // =========================================================
  // GET ALL
  // =========================================================

  getAllOdRateSlabs: (req, res) => {

    MotorOdRateSlabService.getAllOdRateSlabs(
      (err, result) => {

        if (err) {

          return res.status(500).json({
            success: 0,
            message:
              "Failed to fetch OD rate slabs",
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


  // =========================================================
  // GET BY ID
  // =========================================================

  getOdRateSlabById: (req, res) => {

    const {
      od_rate_slab_id
    } = req.params;


    if (
      !od_rate_slab_id ||
      isNaN(od_rate_slab_id) ||
      Number(od_rate_slab_id) <= 0
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Valid OD rate slab ID is required",
      });
    }


    MotorOdRateSlabService.getOdRateSlabById(
      od_rate_slab_id,

      (err, result) => {

        if (err) {

          return res.status(500).json({
            success: 0,
            message:
              "Failed to fetch OD rate slab",
            error: err,
          });
        }


        if (result.length === 0) {

          return res.status(200).json({
            success: 0,
            message:
              "OD rate slab not found",
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

  updateOdRateSlab: (req, res) => {

    const {
      od_rate_slab_id
    } = req.params;


    const {
      od_rate_id,

      engine_cc_slab_id,
      gvw_slab_id,

      min_seating_capacity,
      max_seating_capacity,

      min_age_months,
      max_age_months,

      rate_value,
      description,
      is_active,

    } = req.body;


    // =======================================================
    // SLAB ID
    // =======================================================

    if (
      !od_rate_slab_id ||
      isNaN(od_rate_slab_id) ||
      Number(od_rate_slab_id) <= 0
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Valid OD rate slab ID is required",
      });
    }


    // =======================================================
    // OD RATE ID
    // =======================================================

    if (
      !od_rate_id ||
      isNaN(od_rate_id) ||
      Number(od_rate_id) <= 0
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Valid OD rate ID is required",
      });
    }


    // =======================================================
    // ENGINE CC SLAB ID
    // =======================================================

    if (
      engine_cc_slab_id !== null &&
      engine_cc_slab_id !== undefined &&
      engine_cc_slab_id !== "" &&
      (
        isNaN(engine_cc_slab_id) ||
        Number(engine_cc_slab_id) <= 0
      )
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Valid engine CC slab ID is required",
      });
    }


    // =======================================================
    // GVW SLAB ID
    // =======================================================

    if (
      gvw_slab_id !== null &&
      gvw_slab_id !== undefined &&
      gvw_slab_id !== "" &&
      (
        isNaN(gvw_slab_id) ||
        Number(gvw_slab_id) <= 0
      )
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Valid GVW slab ID is required",
      });
    }


    // =======================================================
    // AT LEAST ONE DIMENSION
    // =======================================================

    if (
      (!engine_cc_slab_id ||
        Number(engine_cc_slab_id) <= 0) &&

      (!gvw_slab_id ||
        Number(gvw_slab_id) <= 0) &&

      (
        min_seating_capacity === null ||
        min_seating_capacity === undefined ||
        min_seating_capacity === ""
      ) &&

      (
        max_seating_capacity === null ||
        max_seating_capacity === undefined ||
        max_seating_capacity === ""
      ) &&

      (
        min_age_months === null ||
        min_age_months === undefined ||
        min_age_months === ""
      ) &&

      (
        max_age_months === null ||
        max_age_months === undefined ||
        max_age_months === ""
      )
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "At least one of Engine CC, GVW, Seating Capacity or Vehicle Age is required",
      });
    }


    // =======================================================
    // MIN SEATING
    // =======================================================

    if (
      min_seating_capacity !== null &&
      min_seating_capacity !== undefined &&
      min_seating_capacity !== "" &&
      (
        isNaN(min_seating_capacity) ||
        Number(min_seating_capacity) < 0
      )
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Minimum seating capacity must be 0 or greater",
      });
    }


    // =======================================================
    // MAX SEATING
    // =======================================================

    if (
      max_seating_capacity !== null &&
      max_seating_capacity !== undefined &&
      max_seating_capacity !== "" &&
      (
        isNaN(max_seating_capacity) ||
        Number(max_seating_capacity) < 0
      )
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Maximum seating capacity must be 0 or greater",
      });
    }


    // =======================================================
    // SEATING RANGE
    // =======================================================

    if (
      min_seating_capacity !== null &&
      min_seating_capacity !== undefined &&
      min_seating_capacity !== "" &&

      max_seating_capacity !== null &&
      max_seating_capacity !== undefined &&
      max_seating_capacity !== "" &&

      Number(max_seating_capacity) <
      Number(min_seating_capacity)
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Maximum seating capacity cannot be less than minimum seating capacity",
      });
    }


    // =======================================================
    // MIN AGE
    // =======================================================

    if (
      min_age_months !== null &&
      min_age_months !== undefined &&
      min_age_months !== "" &&
      (
        isNaN(min_age_months) ||
        Number(min_age_months) < 0
      )
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Minimum vehicle age must be 0 or greater",
      });
    }


    // =======================================================
    // MAX AGE
    // =======================================================

    if (
      max_age_months !== null &&
      max_age_months !== undefined &&
      max_age_months !== "" &&
      (
        isNaN(max_age_months) ||
        Number(max_age_months) < 0
      )
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Maximum vehicle age must be 0 or greater",
      });
    }


    // =======================================================
    // AGE RANGE
    // =======================================================

    if (
      min_age_months !== null &&
      min_age_months !== undefined &&
      min_age_months !== "" &&

      max_age_months !== null &&
      max_age_months !== undefined &&
      max_age_months !== "" &&

      Number(max_age_months) <
      Number(min_age_months)
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Maximum vehicle age cannot be less than minimum vehicle age",
      });
    }


    // =======================================================
    // RATE VALUE
    // =======================================================

    if (
      rate_value === null ||
      rate_value === undefined ||
      rate_value === "" ||
      isNaN(rate_value) ||
      Number(rate_value) < 0
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Rate value must be 0 or greater",
      });
    }


    // =======================================================
    // DESCRIPTION
    // =======================================================

    if (
      description &&
      description.length > 500
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Description must not exceed 500 characters",
      });
    }


    // =======================================================
    // UPDATE SERVICE
    // =======================================================

    MotorOdRateSlabService.updateOdRateSlab(

      od_rate_slab_id,

      {

        od_rate_id,

        engine_cc_slab_id,
        gvw_slab_id,

        min_seating_capacity,
        max_seating_capacity,

        min_age_months,
        max_age_months,

        rate_value,
        description,
        is_active,

      },

      (err, result) => {

        if (err) {

          if (
            err.code ===
            "ER_NO_REFERENCED_ROW_2"
          ) {

            return res.status(200).json({
              success: 0,
              message:
                "Invalid OD rate, engine CC slab or GVW slab reference",
            });
          }


          return res.status(500).json({
            success: 0,
            message:
              "Failed to update OD rate slab",
            error: err,
          });
        }


        if (
          result.affectedRows === 0
        ) {

          return res.status(200).json({
            success: 0,
            message:
              "OD rate slab not found",
          });
        }


        return res.status(200).json({

          success: 1,

          message:
            "OD rate slab updated successfully",

        });
      }
    );
  },


  // =========================================================
  // DELETE / SOFT DELETE
  // =========================================================

  deleteOdRateSlab: (req, res) => {

    const {
      od_rate_slab_id
    } = req.params;


    if (
      !od_rate_slab_id ||
      isNaN(od_rate_slab_id) ||
      Number(od_rate_slab_id) <= 0
    ) {

      return res.status(200).json({
        success: 0,
        message:
          "Valid OD rate slab ID is required",
      });
    }


    MotorOdRateSlabService.deleteOdRateSlab(

      od_rate_slab_id,

      (err, result) => {

        if (err) {

          return res.status(500).json({
            success: 0,
            message:
              "Failed to delete OD rate slab",
            error: err,
          });
        }


        if (
          result.affectedRows === 0
        ) {

          return res.status(200).json({
            success: 0,
            message:
              "OD rate slab not found",
          });
        }


        return res.status(200).json({

          success: 1,

          message:
            "OD rate slab deleted successfully",

        });
      }
    );
  },


  // =========================================================
  // GET ACTIVE
  // =========================================================

  getActiveOdRateSlabs: (req, res) => {

    MotorOdRateSlabService.getActiveOdRateSlabs(

      (err, result) => {

        if (err) {

          return res.status(500).json({
            success: 0,
            message:
              "Failed to fetch active OD rate slabs",
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


module.exports = MotorOdRateSlabController;