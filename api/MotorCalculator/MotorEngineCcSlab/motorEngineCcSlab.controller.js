const MotorEngineCcSlabService = require("./motorEngineCcSlab.service");

const MotorEngineCcSlabController = {
  // CREATE
  createEngineCcSlab: (req, res) => {
    const {
      slab_code,
      slab_name,
      min_cc,
      max_cc,
      description,
      is_active,
    } = req.body;

    if (!slab_code?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Slab code is required",
      });
    }

    if (!slab_name?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Slab name is required",
      });
    }

    if (min_cc === undefined || min_cc === null || min_cc === "") {
      return res.status(200).json({
        success: 0,
        message: "Minimum CC is required",
      });
    }

    if (Number.isNaN(Number(min_cc))) {
      return res.status(200).json({
        success: 0,
        message: "Minimum CC must be a valid number",
      });
    }

    if (
      max_cc !== undefined &&
      max_cc !== null &&
      max_cc !== "" &&
      Number.isNaN(Number(max_cc))
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum CC must be a valid number",
      });
    }

    if (
      max_cc !== undefined &&
      max_cc !== null &&
      max_cc !== "" &&
      Number(max_cc) < Number(min_cc)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum CC cannot be less than minimum CC",
      });
    }

    if (slab_code.trim().length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Slab code cannot exceed 50 characters",
      });
    }

    if (slab_name.trim().length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Slab name cannot exceed 150 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    const data = {
      slab_code: slab_code.trim(),
      slab_name: slab_name.trim(),
      min_cc: Number(min_cc),
      max_cc:
        max_cc === undefined || max_cc === null || max_cc === ""
          ? null
          : Number(max_cc),
      description: description?.trim() || null,
      is_active: is_active ?? 1,
    };

    MotorEngineCcSlabService.createEngineCcSlab(
      data,
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(200).json({
              success: 0,
              message: "Slab code already exists",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to create engine CC slab",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Engine CC slab created successfully",
          data: result,
        });
      }
    );
  },

  // GET ALL
  getAllEngineCcSlabs: (req, res) => {
    MotorEngineCcSlabService.getAllEngineCcSlabs(
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch engine CC slabs",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Engine CC slabs fetched successfully",
          data: result,
        });
      }
    );
  },

  // GET BY ID
  getEngineCcSlabById: (req, res) => {
    const { engineCcSlabId } = req.params;

    if (!engineCcSlabId) {
      return res.status(200).json({
        success: 0,
        message: "Engine CC slab ID is required",
      });
    }

    MotorEngineCcSlabService.getEngineCcSlabById(
      engineCcSlabId,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch engine CC slab",
            error: err,
          });
        }

        if (result.length === 0) {
          return res.status(200).json({
            success: 0,
            message: "Engine CC slab not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Engine CC slab fetched successfully",
          data: result[0],
        });
      }
    );
  },

  // UPDATE
  updateEngineCcSlab: (req, res) => {
    const { engineCcSlabId } = req.params;

    const {
      slab_code,
      slab_name,
      min_cc,
      max_cc,
      description,
      is_active,
    } = req.body;

    if (!engineCcSlabId) {
      return res.status(200).json({
        success: 0,
        message: "Engine CC slab ID is required",
      });
    }

    if (!slab_code?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Slab code is required",
      });
    }

    if (!slab_name?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Slab name is required",
      });
    }

    if (min_cc === undefined || min_cc === null || min_cc === "") {
      return res.status(200).json({
        success: 0,
        message: "Minimum CC is required",
      });
    }

    if (Number.isNaN(Number(min_cc))) {
      return res.status(200).json({
        success: 0,
        message: "Minimum CC must be a valid number",
      });
    }

    if (
      max_cc !== undefined &&
      max_cc !== null &&
      max_cc !== "" &&
      Number.isNaN(Number(max_cc))
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum CC must be a valid number",
      });
    }

    if (
      max_cc !== undefined &&
      max_cc !== null &&
      max_cc !== "" &&
      Number(max_cc) < Number(min_cc)
    ) {
      return res.status(200).json({
        success: 0,
        message: "Maximum CC cannot be less than minimum CC",
      });
    }

    if (slab_code.trim().length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Slab code cannot exceed 50 characters",
      });
    }

    if (slab_name.trim().length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Slab name cannot exceed 150 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description cannot exceed 500 characters",
      });
    }

    const data = {
      slab_code: slab_code.trim(),
      slab_name: slab_name.trim(),
      min_cc: Number(min_cc),
      max_cc:
        max_cc === undefined || max_cc === null || max_cc === ""
          ? null
          : Number(max_cc),
      description: description?.trim() || null,
      is_active: is_active ?? 1,
    };

    MotorEngineCcSlabService.updateEngineCcSlab(
      engineCcSlabId,
      data,
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(200).json({
              success: 0,
              message: "Slab code already exists",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to update engine CC slab",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Engine CC slab not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Engine CC slab updated successfully",
          data: result,
        });
      }
    );
  },

  // DELETE
  deleteEngineCcSlab: (req, res) => {
    const { engineCcSlabId } = req.params;

    if (!engineCcSlabId) {
      return res.status(200).json({
        success: 0,
        message: "Engine CC slab ID is required",
      });
    }

    MotorEngineCcSlabService.deleteEngineCcSlab(
      engineCcSlabId,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to delete engine CC slab",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Engine CC slab not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Engine CC slab deleted successfully",
          data: result,
        });
      }
    );
  },

  // GET ACTIVE
  getActiveEngineCcSlabs: (req, res) => {
    MotorEngineCcSlabService.getActiveEngineCcSlabs(
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch active engine CC slabs",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Active engine CC slabs fetched successfully",
          data: result,
        });
      }
    );
  },
};

module.exports = MotorEngineCcSlabController;