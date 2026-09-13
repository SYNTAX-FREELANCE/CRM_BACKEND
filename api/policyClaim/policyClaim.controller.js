const PolicyClaimService = require("./policyClaim.service");

const PolicyClaimController = {
  // ======================================================
  // CREATE CLAIM
  // ======================================================

  createPolicyClaim: (req, res) => {
    const {
      policy_id,

      claim_date,

      accident_date,
      accident_time,
      accident_place,
      accident_description,

      driver_name,
      driver_address,
      driver_age,
      driver_relationship,
      driving_license_no,

      inspection_location,
      estimated_repair_cost,

      other_insurance_policy_no,

      remarks,
      is_active,
    } = req.body;

    // --------------------------------------------------
    // POLICY ID
    // --------------------------------------------------

    if (!policy_id) {
      return res.status(200).json({
        success: 0,
        message: "Policy ID is required",
      });
    }

    // --------------------------------------------------
    // ACCIDENT DATE
    // --------------------------------------------------

    if (!accident_date) {
      return res.status(200).json({
        success: 0,
        message: "Accident date is required",
      });
    }

    // --------------------------------------------------
    // ACCIDENT PLACE
    // --------------------------------------------------

    if (!accident_place?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Accident place is required",
      });
    }

    // --------------------------------------------------
    // DRIVER NAME
    // --------------------------------------------------

    if (!driver_name?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Driver name is required",
      });
    }

   
    // --------------------------------------------------
    // STRING LENGTH VALIDATIONS
    // --------------------------------------------------

    if (driver_name.trim().length > 150) {
      return res.status(200).json({
        success: 0,
        message: "Driver name cannot exceed 150 characters",
      });
    }

    if (driving_license_no && driving_license_no.trim().length > 100) {
      return res.status(200).json({
        success: 0,
        message: "Driving licence number cannot exceed 100 characters",
      });
    }

    if (accident_place && accident_place.trim().length > 255) {
      return res.status(200).json({
        success: 0,
        message: "Accident place cannot exceed 255 characters",
      });
    }

    if (inspection_location && inspection_location.trim().length > 500) {
      return res.status(200).json({
        success: 0,
        message: "Inspection location cannot exceed 500 characters",
      });
    }

    if (
      other_insurance_policy_no &&
      other_insurance_policy_no.trim().length > 100
    ) {
      return res.status(200).json({
        success: 0,
        message: "Other insurance policy number cannot exceed 100 characters",
      });
    }

    // --------------------------------------------------
    // REPAIR COST
    // --------------------------------------------------

    if (
      estimated_repair_cost !== undefined &&
      estimated_repair_cost !== null &&
      estimated_repair_cost !== ""
    ) {
      const repairCost = Number(estimated_repair_cost);

      if (Number.isNaN(repairCost) || repairCost < 0) {
        return res.status(200).json({
          success: 0,
          message: "Please enter a valid estimated repair cost",
        });
      }
    }

    // --------------------------------------------------
    // DATA
    // --------------------------------------------------

    const data = {
      policy_id: Number(policy_id),

      claim_date: claim_date || null,

      accident_date: accident_date || null,
      accident_time: accident_time || null,
      accident_place: accident_place?.trim() || null,
      accident_description: accident_description?.trim() || null,

      driver_name: driver_name.trim(),
      driver_address: driver_address?.trim() || null,

      driver_age:
        driver_age === "" || driver_age === undefined || driver_age === null
          ? null
          : Number(driver_age),

      driver_relationship: driver_relationship?.trim() || null,

      driving_license_no: driving_license_no?.trim() || null,

      inspection_location: inspection_location?.trim() || null,

      estimated_repair_cost:
        estimated_repair_cost === "" ||
        estimated_repair_cost === undefined ||
        estimated_repair_cost === null
          ? null
          : Number(estimated_repair_cost),

      other_insurance_policy_no: other_insurance_policy_no?.trim() || null,

      remarks: remarks?.trim() || null,

      is_active: is_active ?? 1,

      created_by: req.user?.user_id || null,
    };

    // --------------------------------------------------
    // CREATE
    // --------------------------------------------------

    PolicyClaimService.createPolicyClaim(data, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(200).json({
            success: 0,
            message: "Claim already exists",
          });
        }

        if (err.code === "POLICY_NOT_FOUND") {
          return res.status(200).json({
            success: 0,
            message: "Policy not found",
          });
        }

        return res.status(500).json({
          success: 0,
          message: "Failed to create claim",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Claim created successfully",
        data: result,
      });
    });
  },

  // ======================================================
  // GET ALL
  // ======================================================

  getAllPolicyClaims: (req, res) => {
    PolicyClaimService.getAllPolicyClaims((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch claims",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Claims fetched successfully",
        data: result,
      });
    });
  },

  // ======================================================
  // GET BY ID
  // ======================================================

  getPolicyClaimById: (req, res) => {
    const { claimId } = req.params;

    if (!claimId) {
      return res.status(200).json({
        success: 0,
        message: "Claim ID is required",
      });
    }

    PolicyClaimService.getPolicyClaimById(claimId, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch claim",
          error: err,
        });
      }

      if (result.length === 0) {
        return res.status(200).json({
          success: 0,
          message: "Claim not found",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Claim fetched successfully",
        data: result[0],
      });
    });
  },

  // ======================================================
  // GET BY POLICY
  // ======================================================

  getPolicyClaimsByPolicy: (req, res) => {
    const { policyId } = req.params;

    if (!policyId) {
      return res.status(200).json({
        success: 0,
        message: "Policy ID is required",
      });
    }

    PolicyClaimService.getPolicyClaimsByPolicy(policyId, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch policy claims",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Policy claims fetched successfully",
        data: result,
      });
    });
  },

  // ======================================================
  // UPDATE
  // ======================================================

  updatePolicyClaim: (req, res) => {
    const { claimId } = req.params;

    if (!claimId) {
      return res.status(200).json({
        success: 0,
        message: "Claim ID is required",
      });
    }

    const {
      claim_date,

      accident_date,
      accident_time,
      accident_place,
      accident_description,

      driver_name,
      driver_address,
      driver_age,
      driver_relationship,
      driving_license_no,

      inspection_location,
      estimated_repair_cost,

      other_insurance_policy_no,

      claim_status,
      remarks,
      is_active,
    } = req.body;

    // --------------------------------------------------
    // REQUIRED
    // --------------------------------------------------

    if (!accident_date) {
      return res.status(200).json({
        success: 0,
        message: "Accident date is required",
      });
    }

    if (!accident_place?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Accident place is required",
      });
    }

    if (!driver_name?.trim()) {
      return res.status(200).json({
        success: 0,
        message: "Driver name is required",
      });
    }

    // --------------------------------------------------
    // AGE
    // --------------------------------------------------

    if (driver_age !== undefined && driver_age !== null && driver_age !== "") {
      const age = Number(driver_age);

      if (!Number.isInteger(age) || age <= 0 || age > 120) {
        return res.status(200).json({
          success: 0,
          message: "Please enter a valid driver age",
        });
      }
    }

    // --------------------------------------------------
    // REPAIR COST
    // --------------------------------------------------

    if (
      estimated_repair_cost !== undefined &&
      estimated_repair_cost !== null &&
      estimated_repair_cost !== ""
    ) {
      const repairCost = Number(estimated_repair_cost);

      if (Number.isNaN(repairCost) || repairCost < 0) {
        return res.status(200).json({
          success: 0,
          message: "Please enter a valid estimated repair cost",
        });
      }
    }

    // --------------------------------------------------
    // STATUS
    // --------------------------------------------------

    const allowedStatuses = [
      "DRAFT",
      "SUBMITTED",
      "UNDER_REVIEW",
      "APPROVED",
      "REJECTED",
      "SETTLED",
      "CANCELLED",
    ];

    if (claim_status && !allowedStatuses.includes(claim_status)) {
      return res.status(200).json({
        success: 0,
        message: "Invalid claim status",
      });
    }

    const data = {
      claim_date: claim_date || null,

      accident_date: accident_date || null,
      accident_time: accident_time || null,
      accident_place: accident_place?.trim() || null,
      accident_description: accident_description?.trim() || null,

      driver_name: driver_name.trim(),
      driver_address: driver_address?.trim() || null,

      driver_age:
        driver_age === "" || driver_age === undefined || driver_age === null
          ? null
          : Number(driver_age),

      driver_relationship: driver_relationship?.trim() || null,

      driving_license_no: driving_license_no?.trim() || null,

      inspection_location: inspection_location?.trim() || null,

      estimated_repair_cost:
        estimated_repair_cost === "" ||
        estimated_repair_cost === undefined ||
        estimated_repair_cost === null
          ? null
          : Number(estimated_repair_cost),

      other_insurance_policy_no: other_insurance_policy_no?.trim() || null,

      claim_status: claim_status || "DRAFT",

      remarks: remarks?.trim() || null,

      is_active: is_active ?? 1,

      updated_by: req.user?.user_id || null,
    };

    PolicyClaimService.updatePolicyClaim(claimId, data, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to update claim",
          error: err,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(200).json({
          success: 0,
          message: "Claim not found",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Claim updated successfully",
        data: result,
      });
    });
  },

  // ======================================================
  // DELETE / SOFT DELETE
  // ======================================================

  deletePolicyClaim: (req, res) => {
    const { claimId } = req.params;

    if (!claimId) {
      return res.status(200).json({
        success: 0,
        message: "Claim ID is required",
      });
    }

    PolicyClaimService.deletePolicyClaim(claimId, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to delete claim",
          error: err,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(200).json({
          success: 0,
          message: "Claim not found",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Claim deleted successfully",
        data: result,
      });
    });
  },

  // ======================================================
  // GET ACTIVE
  // ======================================================

  getActivePolicyClaims: (req, res) => {
    PolicyClaimService.getActivePolicyClaims((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Failed to fetch active claims",
          error: err,
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Active claims fetched successfully",
        data: result,
      });
    });
  },
};

module.exports = PolicyClaimController;
