const MotorVehicleUsageService = require("./motorVehicleUsage.service");

const MotorVehicleUsageController = {
  // CREATE
  createVehicleUsage: (req, res) => {
    const {
      usage_code,
      usage_name,
      description,
      is_active,
    } = req.body;

    if (!usage_code?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Usage code is required",
      });
    }

    if (!usage_name?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Usage name is required",
      });
    }

    if (usage_code.trim().length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Usage code cannot exceed 50 characters",
      });
    }

    if (usage_name.trim().length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Usage name cannot exceed 150 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    const data = {
      usage_code: usage_code.trim(),
      usage_name: usage_name.trim(),
      description: description?.trim() || null,
      is_active: is_active ?? 1,
    };

    MotorVehicleUsageService.createVehicleUsage(data, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(200).json({
            success: 0,
            message: "Usage code already exists",
          });
        }

        return res.status(500).json({
          success: 0,
          message: "Failed to create vehicle usage",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Vehicle usage created successfully",
        data: result,
      });
    });
  },

  // GET ALL
  getAllVehicleUsages: (req, res) => {
    MotorVehicleUsageService.getAllVehicleUsages((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch vehicle usages",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Vehicle usages fetched successfully",
        data: result,
      });
    });
  },

  // GET BY ID
  getVehicleUsageById: (req, res) => {
    const { usageId } = req.params;

    if (!usageId) {
      return res.status(200).json({
        success: 0,
        message: "Usage ID is required",
      });
    }

    MotorVehicleUsageService.getVehicleUsageById(
      usageId,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch vehicle usage",
            error: err,
          });
        }

        if (result.length === 0) {
          return res.status(200).json({
            success: 0,
            message: "Vehicle usage not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Vehicle usage fetched successfully",
          data: result[0],
        });
      }
    );
  },

  // UPDATE
  updateVehicleUsage: (req, res) => {
    const { usageId } = req.params;

    const {
      usage_code,
      usage_name,
      description,
      is_active,
    } = req.body;

    if (!usageId) {
      return res.status(200).json({
        success: 0,
        message: "Usage ID is required",
      });
    }

    if (!usage_code?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Usage code is required",
      });
    }

    if (!usage_name?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Usage name is required",
      });
    }

    if (usage_code.trim().length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Usage code cannot exceed 50 characters",
      });
    }

    if (usage_name.trim().length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Usage name cannot exceed 150 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    const data = {
      usage_code: usage_code.trim(),
      usage_name: usage_name.trim(),
      description: description?.trim() || null,
      is_active: is_active ?? 1,
    };

    MotorVehicleUsageService.updateVehicleUsage(
      usageId,
      data,
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(200).json({
              success: 0,
              message: "Usage code already exists",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to update vehicle usage",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Vehicle usage not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Vehicle usage updated successfully",
          data: result,
        });
      }
    );
  },

  // DELETE
  deleteVehicleUsage: (req, res) => {
    const { usageId } = req.params;

    if (!usageId) {
      return res.status(200).json({
        success: 0,
        message: "Usage ID is required",
      });
    }

    MotorVehicleUsageService.deleteVehicleUsage(
      usageId,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to delete vehicle usage",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Vehicle usage not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Vehicle usage deleted successfully",
          data: result,
        });
      }
    );
  },

  // GET ACTIVE
  getActiveVehicleUsages: (req, res) => {
    MotorVehicleUsageService.getActiveVehicleUsages((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch active vehicle usages",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Active vehicle usages fetched successfully",
        data: result,
      });
    });
  },
};

module.exports = MotorVehicleUsageController;