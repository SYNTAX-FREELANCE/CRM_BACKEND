const MotorVehicleClassService = require("./motorVehicleClass.service");

const MotorVehicleClassController = {
  // CREATE
  createVehicleClass: (req, res) => {
    const {
      vehicle_category_id,
      class_code,
      class_name,
      description,
      is_active,
    } = req.body;

    if (!vehicle_category_id) {
      return res.status(200).json({
        success: 0,
        message: "Vehicle category is required",
      });
    }

    if (!class_code?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Class code is required",
      });
    }

    if (!class_name?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Class name is required",
      });
    }

    if (class_code.trim().length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Class code cannot exceed 50 characters",
      });
    }

    if (class_name.trim().length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Class name cannot exceed 150 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    const data = {
      vehicle_category_id,
      class_code: class_code.trim(),
      class_name: class_name.trim(),
      description: description?.trim() || null,
      is_active: is_active ?? 1,
    };

    MotorVehicleClassService.createVehicleClass(data, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(200).json({
            success: 0,
            message: "Class code already exists",
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
          message: "Failed to create vehicle class",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Vehicle class created successfully",
        data: result,
      });
    });
  },

  // GET ALL
  getAllVehicleClasses: (req, res) => {
    MotorVehicleClassService.getAllVehicleClasses((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch vehicle classes",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Vehicle classes fetched successfully",
        data: result,
      });
    });
  },

  // GET BY ID
  getVehicleClassById: (req, res) => {
    const { vehicleClassId } = req.params;

    if (!vehicleClassId) {
      return res.status(200).json({
        success: 0,
        message: "Vehicle class ID is required",
      });
    }

    MotorVehicleClassService.getVehicleClassById(
      vehicleClassId,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch vehicle class",
            error: err,
          });
        }

        if (result.length === 0) {
          return res.status(200).json({
            success: 0,
            message: "Vehicle class not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Vehicle class fetched successfully",
          data: result[0],
        });
      }
    );
  },

  // UPDATE
  updateVehicleClass: (req, res) => {
    const { vehicleClassId } = req.params;

    const {
      vehicle_category_id,
      class_code,
      class_name,
      description,
      is_active,
    } = req.body;

    if (!vehicleClassId) {
      return res.status(200).json({
        success: 0,
        message: "Vehicle class ID is required",
      });
    }

    if (!vehicle_category_id) {
      return res.status(200).json({
        success: 0,
        message: "Vehicle category is required",
      });
    }

    if (!class_code?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Class code is required",
      });
    }

    if (!class_name?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Class name is required",
      });
    }

    if (class_code.trim().length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Class code cannot exceed 50 characters",
      });
    }

    if (class_name.trim().length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Class name cannot exceed 150 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    const data = {
      vehicle_category_id,
      class_code: class_code.trim(),
      class_name: class_name.trim(),
      description: description?.trim() || null,
      is_active: is_active ?? 1,
    };

    MotorVehicleClassService.updateVehicleClass(
      vehicleClassId,
      data,
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(200).json({
              success: 0,
              message: "Class code already exists",
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
            message: "Failed to update vehicle class",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Vehicle class not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Vehicle class updated successfully",
          data: result,
        });
      }
    );
  },

  // DELETE
  deleteVehicleClass: (req, res) => {
    const { vehicleClassId } = req.params;

    if (!vehicleClassId) {
      return res.status(200).json({
        success: 0,
        message: "Vehicle class ID is required",
      });
    }

    MotorVehicleClassService.deleteVehicleClass(
      vehicleClassId,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to delete vehicle class",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Vehicle class not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Vehicle class deleted successfully",
          data: result,
        });
      }
    );
  },

  // GET ACTIVE
  getActiveVehicleClasses: (req, res) => {
    MotorVehicleClassService.getActiveVehicleClasses((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch active vehicle classes",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Active vehicle classes fetched successfully",
        data: result,
      });
    });
  },
};

module.exports = MotorVehicleClassController;