// controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const leadservie = require("./leads.service");
const bcrypt = require("bcrypt");

module.exports = {
  getLeadFreshCalls: (req, res) => {
    try {
      const { empid } = req.params;
      if (!empid) {
        return res.status(200).json({
          success: 0,
          message: "Employee ID is required",
        });
      }

      leadservie.getFreshCalls(empid, (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database error during logout",
          });
        }

        console.log({
          results,
        });

        return res.status(200).json({
          success: results.success,
          message: results.message,
          data: results.data ?? [],
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
  updateLeadStatus: (req, res) => {
    try {
      const data = req.body;

      if (!data.lead_id) {
        return res.status(400).json({
          success: 0,
          message: "Lead ID is required",
        });
      }

      // 1. Update Lead
      leadservie.updateLeadDetail(data, (err) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Failed to update lead",
          });
        }

        // Function to save status history
        const saveHistory = () => {
          leadservie.updateLeadStatusHistory(data, (err) => {
            if (err) {
              return res.status(500).json({
                success: 0,
                message: "Failed to save status history",
              });
            }

            return res.status(200).json({
              success: 1,
              message: "Lead updated successfully",
            });
          });
        };

        // 2. Save Follow-up only if required
        if (Number(data.requires_followup) === 1) {
          leadservie.updateLeadFollowupDetail(data, (err) => {
            if (err) {
              return res.status(500).json({
                success: 0,
                message: "Failed to save follow-up",
              });
            }
            // 3. Save History
            saveHistory();
          });
        } else {
          // No follow-up required, directly save history
          saveHistory();
        }
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
  getActiveBatch: (req, res) => {
    try {
      const { empid, statusId } = req.params;

      leadservie.getActiveBatch(empid, statusId, (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database Error",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Active Batch",
          data: results,
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: 0,
        message: "Something went wrong",
      });
    }
  },
};
