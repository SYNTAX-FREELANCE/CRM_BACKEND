const MotorAddonService = require("./motorAddon.service");

const MotorAddonController = {
  // CREATE
  createAddon: (req, res) => {
    const {
      addon_code,
      addon_name,
      description,
    } = req.body;

    if (!addon_code || !addon_code.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Addon code is required",
      });
    }

    if (!addon_name || !addon_name.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Addon name is required",
      });
    }

    if (addon_code.length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Addon code must not exceed 50 characters",
      });
    }

    if (addon_name.length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Addon name must not exceed 150 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description must not exceed 500 characters",
      });
    }

    MotorAddonService.createAddon(
      {
        addon_code: addon_code.trim(),
        addon_name: addon_name.trim(),
        description: description ? description.trim() : null,
      },
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(200).json({
              success: 0,
              message: "Addon code or addon name already exists",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to create addon",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Addon created successfully",
          addon_id: result.insertId,
        });
      }
    );
  },

  // GET ALL
  getAllAddons: (req, res) => {
    MotorAddonService.getAllAddons((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch addons",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },

  // GET BY ID
  getAddonById: (req, res) => {
    const { addon_id } = req.params;

    if (!addon_id || isNaN(addon_id)) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon ID is required",
      });
    }

    MotorAddonService.getAddonById(addon_id, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch addon",
          error: err,
        });
      }

      if (result.length === 0) {
        return res.status(200).json({
          success: 0,
          message: "Addon not found",
        });
      }

      return res.status(200).json({
        success: 1,
        data: result[0],
      });
    });
  },

  // UPDATE
  updateAddon: (req, res) => {
    const { addon_id } = req.params;

    const {
      addon_code,
      addon_name,
      description,
    } = req.body;

    if (!addon_id || isNaN(addon_id)) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon ID is required",
      });
    }

    if (!addon_code || !addon_code.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Addon code is required",
      });
    }

    if (!addon_name || !addon_name.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Addon name is required",
      });
    }

    if (addon_code.length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Addon code must not exceed 50 characters",
      });
    }

    if (addon_name.length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Addon name must not exceed 150 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description must not exceed 500 characters",
      });
    }

    MotorAddonService.updateAddon(
      addon_id,
      {
        addon_code: addon_code.trim(),
        addon_name: addon_name.trim(),
        description: description ? description.trim() : null,
      },
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(200).json({
              success: 0,
              message: "Addon code or addon name already exists",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to update addon",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Addon not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Addon updated successfully",
        });
      }
    );
  },

  // DELETE / SOFT DELETE
  deleteAddon: (req, res) => {
    const { addon_id } = req.params;

    if (!addon_id || isNaN(addon_id)) {
      return res.status(200).json({
        success: 0,
        message: "Valid addon ID is required",
      });
    }

    MotorAddonService.deleteAddon(addon_id, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to delete addon",
          error: err,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(200).json({
          success: 0,
          message: "Addon not found",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Addon deleted successfully",
      });
    });
  },

  // GET ACTIVE
  getActiveAddons: (req, res) => {
    MotorAddonService.getActiveAddons((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch active addons",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },
};

module.exports = MotorAddonController;