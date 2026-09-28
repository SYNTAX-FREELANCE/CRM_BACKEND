const MotorCoverUnitRateService = require("./motorCoverUnitRate.service");

const MotorCoverUnitRateController = {
  // CREATE
  createCoverUnitRate: (req, res) => {
    const {
      cover_rate_id,
      min_units,
      max_units,
      rate_per_unit,
      description,
    } = req.body;

    // COVER RATE
    if (
      !cover_rate_id ||
      isNaN(cover_rate_id) ||
      Number(cover_rate_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Cover rate is required",
      });
    }

    // MIN UNITS
    if (
      min_units === undefined ||
      min_units === null ||
      min_units === "" ||
      isNaN(min_units) ||
      !Number.isInteger(Number(min_units)) ||
      Number(min_units) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid minimum units are required",
      });
    }

    // MAX UNITS
    if (
      max_units !== undefined &&
      max_units !== null &&
      max_units !== "" &&
      (
        isNaN(max_units) ||
        !Number.isInteger(Number(max_units)) ||
        Number(max_units) < 0
      )
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid maximum units",
      });
    }

    if (
      max_units !== undefined &&
      max_units !== null &&
      max_units !== "" &&
      Number(max_units) < Number(min_units)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum units cannot be less than minimum units",
      });
    }

    // RATE PER UNIT
    if (
      rate_per_unit === undefined ||
      rate_per_unit === null ||
      rate_per_unit === "" ||
      isNaN(rate_per_unit) ||
      Number(rate_per_unit) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid rate per unit is required",
      });
    }

    // DESCRIPTION
    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    MotorCoverUnitRateService.createCoverUnitRate(
      req.body,
      (err, result) => {
        if (err) {
          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(200).json({
              success: 0,
              message: "Invalid cover rate reference",
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
          message: "Cover unit rate created successfully",
          data: result,
        });
      }
    );
  },

  // GET ALL
  getAllCoverUnitRates: (req, res) => {
    MotorCoverUnitRateService.getAllCoverUnitRates((err, results) => {
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
  getCoverUnitRateById: (req, res) => {
    const { cover_unit_rate_id } = req.params;

    if (
      !cover_unit_rate_id ||
      isNaN(cover_unit_rate_id) ||
      Number(cover_unit_rate_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid cover unit rate ID",
      });
    }

    MotorCoverUnitRateService.getCoverUnitRateById(
      cover_unit_rate_id,
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
            message: "Cover unit rate not found",
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
  updateCoverUnitRate: (req, res) => {
    const { cover_unit_rate_id } = req.params;

    const {
      cover_rate_id,
      min_units,
      max_units,
      rate_per_unit,
      description,
    } = req.body;

    // ID
    if (
      !cover_unit_rate_id ||
      isNaN(cover_unit_rate_id) ||
      Number(cover_unit_rate_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid cover unit rate ID",
      });
    }

    // COVER RATE
    if (
      !cover_rate_id ||
      isNaN(cover_rate_id) ||
      Number(cover_rate_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Cover rate is required",
      });
    }

    // MIN UNITS
    if (
      min_units === undefined ||
      min_units === null ||
      min_units === "" ||
      isNaN(min_units) ||
      !Number.isInteger(Number(min_units)) ||
      Number(min_units) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid minimum units are required",
      });
    }

    // MAX UNITS
    if (
      max_units !== undefined &&
      max_units !== null &&
      max_units !== "" &&
      (
        isNaN(max_units) ||
        !Number.isInteger(Number(max_units)) ||
        Number(max_units) < 0
      )
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid maximum units",
      });
    }

    if (
      max_units !== undefined &&
      max_units !== null &&
      max_units !== "" &&
      Number(max_units) < Number(min_units)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum units cannot be less than minimum units",
      });
    }

    // RATE PER UNIT
    if (
      rate_per_unit === undefined ||
      rate_per_unit === null ||
      rate_per_unit === "" ||
      isNaN(rate_per_unit) ||
      Number(rate_per_unit) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid rate per unit is required",
      });
    }

    // DESCRIPTION
    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    MotorCoverUnitRateService.updateCoverUnitRate(
      cover_unit_rate_id,
      req.body,
      (err, result) => {
        if (err) {
          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(200).json({
              success: 0,
              message: "Invalid cover rate reference",
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
            message: "Cover unit rate not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Cover unit rate updated successfully",
          data: result,
        });
      }
    );
  },

  // DELETE
  deleteCoverUnitRate: (req, res) => {
    const { cover_unit_rate_id } = req.params;

    if (
      !cover_unit_rate_id ||
      isNaN(cover_unit_rate_id) ||
      Number(cover_unit_rate_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Invalid cover unit rate ID",
      });
    }

    MotorCoverUnitRateService.deleteCoverUnitRate(
      cover_unit_rate_id,
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
            message: "Cover unit rate not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Cover unit rate deleted successfully",
        });
      }
    );
  },

  // GET ACTIVE
  getActiveCoverUnitRates: (req, res) => {
    MotorCoverUnitRateService.getActiveCoverUnitRates(
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

module.exports = MotorCoverUnitRateController;