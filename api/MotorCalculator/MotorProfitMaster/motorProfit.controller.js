const MotorProfitService = require("./motorProfit.service");

const MotorProfitController = {
  // CREATE
  createProfit: (req, res) => {
    const { vehicle_category_id, profit_amount, description, is_active } =
      req.body;

    // VEHICLE CATEGORY
    if (
      vehicle_category_id === undefined ||
      vehicle_category_id === null ||
      vehicle_category_id === "" ||
      isNaN(vehicle_category_id) ||
      Number(vehicle_category_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid vehicle category is required",
      });
    }

    // PROFIT AMOUNT
    if (
      profit_amount === undefined ||
      profit_amount === null ||
      profit_amount === "" ||
      !Number.isFinite(Number(profit_amount)) ||
      Number(profit_amount) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid profit amount is required",
      });
    }

    // DESCRIPTION
    if (
      description !== undefined &&
      description !== null &&
      (typeof description !== "string" || description.length > 500)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    // ACTIVE STATUS
    if (is_active !== undefined && ![0, 1, "0", "1"].includes(is_active)) {
      return res.status(200).json({
        success: 0,
        message: "Invalid active status",
      });
    }

    const data = {
      ...req.body,
      vehicle_category_id: Number(vehicle_category_id),
      profit_amount: Number(profit_amount),
      is_active: is_active === undefined ? 1 : Number(is_active),
    };

    MotorProfitService.createProfit(data, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(200).json({
            success: 0,
            message: "Profit already exists for this vehicle category",
          });
        }

        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(200).json({
            success: 0,
            message: "Invalid vehicle category",
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
        message: "Profit created successfully",
        data: result,
      });
    });
  },

  // GET ALL
  getAllProfits: (req, res) => {
    MotorProfitService.getAllProfits((err, results) => {
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
  getProfitById: (req, res) => {
    const { profit_id } = req.params;

    if (!profit_id || !/^[1-9]\d*$/.test(profit_id)) {
      return res.status(200).json({
        success: 0,
        message: "Invalid profit ID",
      });
    }

    MotorProfitService.getProfitById(profit_id, (err, results) => {
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
          message: "Profit record not found",
        });
      }

      return res.status(200).json({
        success: 1,
        data: results[0],
      });
    });
  },

  // UPDATE
  updateProfit: (req, res) => {
    const { profit_id } = req.params;

    const { vehicle_category_id, profit_amount, description, is_active } =
      req.body;

    // PROFIT ID
    if (!profit_id || !/^[1-9]\d*$/.test(profit_id)) {
      return res.status(200).json({
        success: 0,
        message: "Invalid profit ID",
      });
    }

    // VEHICLE CATEGORY
    if (
      vehicle_category_id === undefined ||
      vehicle_category_id === null ||
      vehicle_category_id === "" ||
      isNaN(vehicle_category_id) ||
      Number(vehicle_category_id) <= 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid vehicle category is required",
      });
    }

    // PROFIT AMOUNT
    if (
      profit_amount === undefined ||
      profit_amount === null ||
      profit_amount === "" ||
      !Number.isFinite(Number(profit_amount)) ||
      Number(profit_amount) < 0
    ) {
      return res.status(200).json({
        success: 0,
        message: "Valid profit amount is required",
      });
    }

    // DESCRIPTION
    if (
      description !== undefined &&
      description !== null &&
      (typeof description !== "string" || description.length > 500)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    // ACTIVE STATUS
    if (is_active !== undefined && ![0, 1, "0", "1"].includes(is_active)) {
      return res.status(200).json({
        success: 0,
        message: "Invalid active status",
      });
    }

    const data = {
      ...req.body,
      vehicle_category_id: Number(vehicle_category_id),
      profit_amount: Number(profit_amount),
      is_active: is_active === undefined ? 1 : Number(is_active),
    };

    MotorProfitService.updateProfit(profit_id, data, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(200).json({
            success: 0,
            message: "Profit already exists for this vehicle category",
          });
        }

        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(200).json({
            success: 0,
            message: "Invalid vehicle category",
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
          message: "Profit record not found",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Profit updated successfully",
        data: result,
      });
    });
  },

  // DELETE / SOFT DELETE
  deleteProfit: (req, res) => {
    const { profit_id } = req.params;

    if (!profit_id || !/^[1-9]\d*$/.test(profit_id)) {
      return res.status(200).json({
        success: 0,
        message: "Invalid profit ID",
      });
    }

    MotorProfitService.deleteProfit(profit_id, (err, result) => {
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
          message: "Profit record not found",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Profit deactivated successfully",
      });
    });
  },

  // GET ACTIVE
  getActiveProfits: (req, res) => {
    MotorProfitService.getActiveProfits((err, results) => {
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

module.exports = MotorProfitController;
