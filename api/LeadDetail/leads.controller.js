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
        return res.status(200).json({
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
        leadservie.updateEmployeeBatchStatus(data, (err) => {
          if (err) {
            return res.status(500).json({
              success: 0,
              message: "Failed to update employee batch",
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

          const savePolicy = (next) => {
            if (Number(data.policyrequierd) !== 1) {
              return next();
            }
            leadservie.updateLeadPolicy(data, (err) => {
              if (err) {
                console.log(err);

                return res.status(500).json({
                  success: 0,
                  message: "Failed to save policy",
                });
              }

              next();
            });
          };

          // 2. Save Follow-up only if required
          if (Number(data.requires_followup) === 1) {
            leadservie.updateLeadFollowupDetail(data, (err) => {
              if (err) {
                console.log({
                  err
                });

                return res.status(500).json({
                  success: 0,
                  message: "Failed to save follow-up",
                });
              }
              // 3. Save History
              savePolicy(saveHistory);
            });
          } else {
            // No follow-up required, directly save history
            savePolicy(saveHistory);
          }
        });
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

  getEmployeeActiveBatch: (req, res) => {
    try {
      const { empid } = req.params;

      leadservie.getEmployeeActiveBatchService(empid, (err, results) => {
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


  getLeadHistory: (req, res) => {
    try {
      const { leadid } = req.params;

      leadservie.getLeadHistory(leadid, (err, results) => {
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
  getFollowUpDetail: (req, res) => {
    try {
      const { leadid, statusId } = req.params;

      leadservie.getFollowUpDetail(leadid, statusId, (err, results) => {
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
  getDashboardCount: (req, res) => {
    try {
      const { empid } = req.params;

      leadservie.getDashboardCount(empid, (err, results) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: "Database Error",
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Fetched SuccessFully",
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

  getDashboardReminders: (req, res) => {
    const { empid } = req.params;
    if (!empid) {
      return res.status(200).json({
        success: 0,
        message: "Employee Id is required",
      });
    }
    leadservie.getDashboardReminders(empid, (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }

      return res.status(200).json({
        success: 1,
        message: "Dashboard Reminder Fetched Successfully",
        data: result,
      });
    });
  },
  searchCRM: (req, res) => {
    const search = req.query.q?.trim();

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search text is required",
      });
    }

    leadservie.searchCRM(search, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }

      return res.json({
        success: 1,
        count: result.length,
        data: result,
      });
    });
  },

  getCustomerDetails: (req, res) => {
    const customerId = req.params.customerId;
    leadservie.getCustomerDetails(customerId, (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }

      return res.json({
        success: 1,
        data: result,
      });
    });
  },
  getAdminDashboardCounts: (req, res) => {
    const { from, to } = req.body;

    leadservie.getAdminDashboardCounts(from, to, (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }

      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },
  getEmployeeRecentAcivity: (req, res) => {
    leadservie.getEmployyeeRecentAcivity((err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },

  getAssignEmployeeDtl: (req, res) => {
    const { empid } = req.params;
    leadservie.getAssignEmployeeDtl(empid, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }
      if (result && result?.length === 0) {
        return res.status(200).json({
          success: 1,
          message: "No Assign Detail Found",
          data: [],
        });
      }
      return res.status(200).json({
        success: 1,
        data: result,
      });

    });
  },

  getActiveEmployees: (req, res) => {
    leadservie.getActiveEmployees((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },
  getEmployeeBatchDetail: (req, res) => {
    const empid = req.params.empid;
    leadservie.getEmployeeBatchDetail(empid, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },
  updateReallocation: (req, res) => {
    const data = req.body;
    leadservie.updateReallocation(data, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },
  releaseBatchLock: (req, res) => {

    const { employee_id, batch_no, unlocked_by } = req.body;

    if (!employee_id || !batch_no || !unlocked_by) {
      return res.status(400).json({
        success: 0,
        message: "Required data is missing"
      });
    }

    leadservie.releaseBatchLock(
      {
        employee_id,
        batch_no,
        unlocked_by
      },
      (err, result) => {

        if (err) {
          return res.status(500).json({
            success: 0,
            message: err.sqlMessage || err.message
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Batch unlocked successfully"
        });

      }
    );
  },
  getTopEmployees: (req, res) => {
    leadservie.getTopEmployees((err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },
  updateExpiryDetails: (req, res) => {
    const { vehicle_id, edited_by, known_policy_expiry_date } = req.body;

    if (!vehicle_id || !edited_by) {
      return res.status(200).json({
        success: 0,
        message: "Required Id's are Missing!",
      });
    }

    leadservie.updateExpiryDetailsService(vehicle_id, edited_by, known_policy_expiry_date, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Update SuccessFully",
      });
    });
  },

  UpdateFetchStatus: (req, res) => {
    const { lead_id, edited_by } = req.body;

    if (!lead_id || !edited_by) {
      return res.status(200).json({
        success: 0,
        message: "Required Id's are Missing!",
      });
    }

    leadservie.UpdateFetchStatusService(lead_id, edited_by, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "Update SuccessFully",
      });
    });
  },



  getSingleEmployeeRecentActivity: (req, res) => {
    const { empId } = req.params;
    leadservie.getEmployeeActivity(empId, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Database Error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  },





};
