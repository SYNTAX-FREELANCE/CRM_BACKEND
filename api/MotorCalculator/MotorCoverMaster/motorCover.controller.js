const MotorCoverService = require("./motorCover.service");

const MotorCoverController = {
  // CREATE
  createCover: (req, res) => {
    const {
      cover_code,
      cover_name,
      cover_type,
      description,
      is_active
    } = req.body;

    if (!cover_code || !cover_code.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Cover code is required",
      });
    }

    if (!cover_name || !cover_name.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Cover name is required",
      });
    }

    if (
      !cover_type ||
      ![
        "CPA",
        "LIABILITY",
        "PASSENGER",
        "DRIVER",
        "LEGAL_LIABILITY",
      ].includes(cover_type)
    ) {
      return res.status(200).json({
        success: 0,
        message:
          "Cover type must be CPA, LIABILITY, PASSENGER, DRIVER or LEGAL_LIABILITY",
      });
    }

    if (cover_code.length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Cover code must not exceed 50 characters",
      });
    }

    if (cover_name.length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Cover name must not exceed 150 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description must not exceed 500 characters",
      });
    }

    MotorCoverService.createCover(
      {
        cover_code: cover_code.trim(),
        cover_name: cover_name.trim(),
        cover_type,
        description: description ? description.trim() : null,
        is_active: is_active
      },
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(200).json({
              success: 0,
              message: "Cover code or cover name already exists",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to create cover",
            error: err,
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Cover created successfully",
          cover_id: result.insertId,
        });
      }
    );
  },

  // GET ALL
  getAllCovers: (req, res) => {
    MotorCoverService.getAllCovers((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch covers",
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
  getCoverById: (req, res) => {
    const { cover_id } = req.params;

    if (!cover_id || isNaN(cover_id) || Number(cover_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Valid cover ID is required",
      });
    }

    MotorCoverService.getCoverById(
      cover_id,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch cover",
            error: err,
          });
        }

        if (result.length === 0) {
          return res.status(200).json({
            success: 0,
            message: "Cover not found",
          });
        }

        return res.status(200).json({
          success: 1,
          data: result[0],
        });
      }
    );
  },

  // UPDATE
  updateCover: (req, res) => {
    const { cover_id } = req.params;

    const {
      cover_code,
      cover_name,
      cover_type,
      description,
      is_active
    } = req.body;

    if (!cover_id || isNaN(cover_id) || Number(cover_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Valid cover ID is required",
      });
    }

    if (!cover_code || !cover_code.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Cover code is required",
      });
    }

    if (!cover_name || !cover_name.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Cover name is required",
      });
    }

    if (
      !cover_type ||
      ![
        "CPA",
        "LIABILITY",
        "PASSENGER",
        "DRIVER",
        "LEGAL_LIABILITY",
      ].includes(cover_type)
    ) {
      return res.status(200).json({
        success: 0,
        message:
          "Cover type must be CPA, LIABILITY, PASSENGER, DRIVER or LEGAL_LIABILITY",
      });
    }

    if (cover_code.length > 50) {
      return res.status(200).json({
        success: 0,
        message: "Cover code must not exceed 50 characters",
      });
    }

    if (cover_name.length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Cover name must not exceed 150 characters",
      });
    }

    if (description && description.length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Description must not exceed 500 characters",
      });
    }

    MotorCoverService.updateCover(
      cover_id,
      {
        cover_code: cover_code.trim(),
        cover_name: cover_name.trim(),
        cover_type,
        description: description ? description.trim() : null,
        is_active
      },
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(200).json({
              success: 0,
              message: "Cover code or cover name already exists",
            });
          }

          return res.status(500).json({
            success: 0,
            message: "Failed to update cover",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Cover not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Cover updated successfully",
        });
      }
    );
  },

  // DELETE / SOFT DELETE
  deleteCover: (req, res) => {
    const { cover_id } = req.params;

    if (!cover_id || isNaN(cover_id) || Number(cover_id) <= 0) {
      return res.status(200).json({
        success: 0,
        message: "Valid cover ID is required",
      });
    }

    MotorCoverService.deleteCover(
      cover_id,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to delete cover",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            success: 0,
            message: "Cover not found",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Cover deleted successfully",
        });
      }
    );
  },

  // GET ACTIVE
  getActiveCovers: (req, res) => {
    MotorCoverService.getActiveCovers(
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to fetch active covers",
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

module.exports = MotorCoverController;