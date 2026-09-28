const MotorFuelTypeService = require("./motorFuelType.service");

const MotorFuelTypeController = {
  // CREATE
  createFuelType: (req, res) => {
    const {
      fuel_code,
      fuel_name,
      description,
      is_active,
    } = req.body;

    if (!fuel_code?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Fuel code is required",
      });
    }

    if (!fuel_name?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Fuel name is required",
      });
    }

    if (fuel_code.trim().length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Fuel code cannot exceed 50 characters",
      });
    }

    if (fuel_name.trim().length > 100) {
      return res.status(200).json({
        success: 0,
        message: "Fuel name cannot exceed 100 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    const data = {
      fuel_code: fuel_code.trim(),
      fuel_name: fuel_name.trim(),
      description: description?.trim() || null,
      is_active: is_active ?? 1,
    };

    MotorFuelTypeService.createFuelType(data, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(200).json({
            success: 0,
            message: "Fuel code already exists",
          });
        }

        return res.status(500).json({
          success: 0,
          message: "Failed to create fuel type",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Fuel type created successfully",
        data: result,
      });
    });
  },

  // GET ALL
  getAllFuelTypes: (req, res) => {
    MotorFuelTypeService.getAllFuelTypes((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch fuel types",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Fuel types fetched successfully",
        data: result,
      });
    });
  },

  // GET BY ID
  getFuelTypeById: (req, res) => {
    const { fuelTypeId } = req.params;

    if (!fuelTypeId) {
      return res.status(200).json({
        success: 0,
        message: "Fuel type ID is required",
      });
    }

    MotorFuelTypeService.getFuelTypeById(
      fuelTypeId,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch fuel type",
            error: err,
          });
        }

        if (result.length === 0) {
          return res.status(200).json({
            success: 0,
            message: "Fuel type not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Fuel type fetched successfully",
          data: result[0],
        });
      }
    );
  },

  // UPDATE
  updateFuelType: (req, res) => {
    const { fuelTypeId } = req.params;

    const {
      fuel_code,
      fuel_name,
      description,
      is_active,
    } = req.body;

    if (!fuelTypeId) {
      return res.status(200).json({
        success: 0,
        message: "Fuel type ID is required",
      });
    }

    if (!fuel_code?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Fuel code is required",
      });
    }

    if (!fuel_name?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Fuel name is required",
      });
    }

    if (fuel_code.trim().length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Fuel code cannot exceed 50 characters",
      });
    }

    if (fuel_name.trim().length > 100) {
      return res.status(200).json({
        success: 0,
        message: "Fuel name cannot exceed 100 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    const data = {
      fuel_code: fuel_code.trim(),
      fuel_name: fuel_name.trim(),
      description: description?.trim() || null,
      is_active: is_active ?? 1,
    };

    MotorFuelTypeService.updateFuelType(
      fuelTypeId,
      data,
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(200).json({
              success: 0,
              message: "Fuel code already exists",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to update fuel type",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Fuel type not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Fuel type updated successfully",
          data: result,
        });
      }
    );
  },

  // DELETE
  deleteFuelType: (req, res) => {
    const { fuelTypeId } = req.params;

    if (!fuelTypeId) {
      return res.status(200).json({
        success: 0,
        message: "Fuel type ID is required",
      });
    }

    MotorFuelTypeService.deleteFuelType(
      fuelTypeId,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to delete fuel type",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Fuel type not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Fuel type deleted successfully",
          data: result,
        });
      }
    );
  },

  // GET ACTIVE
  getActiveFuelTypes: (req, res) => {
    MotorFuelTypeService.getActiveFuelTypes((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch active fuel types",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Active fuel types fetched successfully",
        data: result,
      });
    });
  },
};

module.exports = MotorFuelTypeController;