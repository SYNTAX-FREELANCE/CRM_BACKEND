const MotorVehicleCategoryService = require("./motorvehiclecategory.service");

const MotorVehicleCategoryController = {
  // CREATE
  createVehicleCategory: (req, res) => {
    const {
      vehicle_type_id,
      category_code,
      category_name,
      description,
      is_active,
    } = req.body;

    if (!vehicle_type_id) {
      return res.status(200).json({
        success: 0,
        message: "Vehicle type is required",
      });
    }

    if (!category_code?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Category code is required",
      });
    }

    if (!category_name?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Category name is required",
      });
    }

    if (category_code.trim().length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Category code cannot exceed 50 characters",
      });
    }

    if (category_name.trim().length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Category name cannot exceed 150 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    const data = {
      vehicle_type_id,
      category_code: category_code.trim(),
      category_name: category_name.trim(),
      description: description?.trim() || null,
      is_active: is_active ?? 1,
    };

    MotorVehicleCategoryService.createVehicleCategory(
      data,
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(200).json({
              success: 0,
              message: "Category code already exists",
            });
          }

          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(200).json({
              success: 0,
              message: "Invalid vehicle type",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to create vehicle category",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Vehicle category created successfully",
          data: result,
        });
      }
    );
  },

  // GET ALL
  getAllVehicleCategories: (req, res) => {
    MotorVehicleCategoryService.getAllVehicleCategories((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch vehicle categories",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Vehicle categories fetched successfully",
        data: result,
      });
    });
  },

  // GET BY ID
  getVehicleCategoryById: (req, res) => {
    const { vehicleCategoryId } = req.params;

    if (!vehicleCategoryId) {
      return res.status(200).json({
        success: 0,
        message: "Vehicle category ID is required",
      });
    }

    MotorVehicleCategoryService.getVehicleCategoryById(
      vehicleCategoryId,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch vehicle category",
            error: err,
          });
        }

        if (result.length === 0) {
          return res.status(200).json({
            success: 0,
            message: "Vehicle category not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Vehicle category fetched successfully",
          data: result[0],
        });
      }
    );
  },

  // UPDATE
  updateVehicleCategory: (req, res) => {
    const { vehicleCategoryId } = req.params;

    const {
      vehicle_type_id,
      category_code,
      category_name,
      description,
      is_active,
    } = req.body;

    if (!vehicleCategoryId) {
      return res.status(200).json({
        success: 0,
        message: "Vehicle category ID is required",
      });
    }

    if (!vehicle_type_id) {
      return res.status(200).json({
        success: 0,
        message: "Vehicle type is required",
      });
    }

    if (!category_code?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Category code is required",
      });
    }

    if (!category_name?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Category name is required",
      });
    }

    if (category_code.trim().length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Category code cannot exceed 50 characters",
      });
    }

    if (category_name.trim().length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Category name cannot exceed 150 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    const data = {
      vehicle_type_id,
      category_code: category_code.trim(),
      category_name: category_name.trim(),
      description: description?.trim() || null,
      is_active: is_active ?? 1,
    };

    MotorVehicleCategoryService.updateVehicleCategory(
      vehicleCategoryId,
      data,
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(200).json({
              success: 0,
              message: "Category code already exists",
            });
          }

          if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(200).json({
              success: 0,
              message: "Invalid vehicle type",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to update vehicle category",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Vehicle category not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Vehicle category updated successfully",
          data: result,
        });
      }
    );
  },

  // DELETE
  deleteVehicleCategory: (req, res) => {
    const { vehicleCategoryId } = req.params;

    if (!vehicleCategoryId) {
      return res.status(200).json({
        success: 0,
        message: "Vehicle category ID is required",
      });
    }

    MotorVehicleCategoryService.deleteVehicleCategory(
      vehicleCategoryId,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to delete vehicle category",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Vehicle category not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Vehicle category deleted successfully",
          data: result,
        });
      }
    );
  },

  // GET ACTIVE
  getActiveVehicleCategories: (req, res) => {
    MotorVehicleCategoryService.getActiveVehicleCategories(
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch active vehicle categories",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Active vehicle categories fetched successfully",
          data: result,
        });
      }
    );
  },
};

module.exports = MotorVehicleCategoryController;