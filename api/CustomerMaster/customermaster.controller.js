// api/CustomerMaster/customermaster.controller.js
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const customerService = require("./customermaster.service");

// Helper function to standardise keys for case-insensitive and synonym matching
const getMappingValue = (row, keySynonyms) => {
  const keys = Object.keys(row);
  for (const synonym of keySynonyms) {
    const matchedKey = keys.find(k => k.trim().toLowerCase() === synonym.toLowerCase());
    if (matchedKey) {
      const val = String(row[matchedKey]).trim();
      if (val !== "") {
        return val;
      }
    }
  }
  return "";
};

module.exports = {
  // ==================== UPLOAD & PROCESS FILE (EXCEL / PDF) ====================
  uploadCustomerFile: async (req, res) => {
    try {
      const file = req.file;
      const createdBy = req.user ? req.user.id : null;

      if (!file) {
        return res.status(400).json({
          success: 0,
          message: "No file uploaded or invalid file type. Please upload Excel (.xlsx, .xls) files."
        });
      }

      const fileExt = path.extname(file.originalname).toLowerCase();

      // We only accept Excel files now
      if (fileExt !== ".xlsx" && fileExt !== ".xls") {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({
          success: 0,
          message: "Invalid file type. Please upload an Excel file (.xlsx or .xls)."
        });
      }

      const filePath = file.path;

      // Read the workbook
      let workbook;
      try {
        workbook = xlsx.readFile(filePath);
      } catch (readErr) {
        console.error("Error reading excel file:", readErr);
        // Delete file from disk
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        return res.status(400).json({
          success: 0,
          message: "Failed to read Excel file. The file may be corrupt."
        });
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Parse rows into JSON objects
      const rawRows = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

      if (rawRows.length === 0) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(400).json({
          success: 0,
          message: "Excel sheet is empty. Please add customer and vehicle details."
        });
      }

      const validCombinedRows = [];
      const failedRows = [];

      // Unified column mappings with synonyms for both Customer and Vehicle
      const mappings = {
        // Customer mappings
        customer_name: ["customer_name", "customer name", "name", "customer"],
        mobile_number_1: ["mobile_number_1", "mobile number 1", "mobile", "mobile1", "mobile_1", "phone", "phone_number", "contact"],
        mobile_number_2: ["mobile_number_2", "mobile number 2", "mobile2", "mobile_2", "phone2", "alternate_mobile", "alternate phone"],
        email: ["email", "email_address", "email address", "mail"],
        address: ["address", "street", "location"],
        city: ["city", "town"],
        district: ["district", "region"],
        state: ["state", "province"],
        pincode: ["pincode", "zip", "zipcode", "zip_code", "pin_code"],

        // Vehicle mappings
        registration_number: ["registration_number", "registration number", "reg_no", "reg no", "registration_no", "registrationno"],
        rto: ["rto"],
        registration_data: ["registration_data", "registration data", "registration_date", "registration date", "registrationdata", "registrationdate"],
        model: ["model"],
        vechile_maker: ["vechile_maker", "vechile maker", "vehicle_maker", "vehicle maker", "maker"],
        engine_number: ["engine_number", "engine number", "engine_no", "engine no"],
        chassis_number: ["chassis_number", "chassis number", "chassis_no", "chassis no"],
        vechile_class: ["vechile_class", "vechile class", "vehicle_class", "vehicle class", "class"],
        vehicle_category: ["vehicle_category", "vehicle category", "category", "vechile_category", "vechile category"],
        fuel_type: ["fuel_type", "fuel type", "fuel"],
        seat_capacity: ["seat_capacity", "seat capacity", "seats", "seating", "seating_capacity"]
      };

      // Map and validate rows
      rawRows.forEach((row, index) => {
        const mappedCustomer = {
          customer_name: getMappingValue(row, mappings.customer_name),
          mobile_number_1: getMappingValue(row, mappings.mobile_number_1),
          mobile_number_2: getMappingValue(row, mappings.mobile_number_2),
          email: getMappingValue(row, mappings.email),
          address: getMappingValue(row, mappings.address),
          city: getMappingValue(row, mappings.city),
          district: getMappingValue(row, mappings.district),
          state: getMappingValue(row, mappings.state),
          pincode: getMappingValue(row, mappings.pincode),
          is_active: 1,
          created_by: createdBy
        };

        const mappedVehicle = {
          registration_number: getMappingValue(row, mappings.registration_number),
          rto: getMappingValue(row, mappings.rto),
          registration_data: getMappingValue(row, mappings.registration_data),
          model: getMappingValue(row, mappings.model),
          vechile_maker: getMappingValue(row, mappings.vechile_maker),
          engine_number: getMappingValue(row, mappings.engine_number),
          chassis_number: getMappingValue(row, mappings.chassis_number),
          vechile_class: getMappingValue(row, mappings.vechile_class),
          vehicle_category: getMappingValue(row, mappings.vehicle_category),
          fuel_type: getMappingValue(row, mappings.fuel_type),
          seat_capacity: getMappingValue(row, mappings.seat_capacity)
        };

        // Validation
        const rowNumber = index + 2; // Row 1 is headers
        const errors = [];

        // Customer validations
        if (!mappedCustomer.customer_name) {
          errors.push("Customer Name is missing.");
        }
        if (!mappedCustomer.mobile_number_1) {
          errors.push("Mobile Number 1 is missing.");
        } else if (!/^\d+$/.test(mappedCustomer.mobile_number_1)) {
          errors.push("Mobile Number 1 must be numeric.");
        }
        if (mappedCustomer.mobile_number_2 && !/^\d+$/.test(mappedCustomer.mobile_number_2)) {
          errors.push("Mobile Number 2 must be numeric.");
        }

        // Vehicle validations
        if (!mappedVehicle.registration_number) {
          errors.push("Vehicle Registration Number is missing.");
        }

        if (errors.length > 0) {
          failedRows.push({
            row: rowNumber,
            data: row,
            errors: errors
          });
        } else {
          validCombinedRows.push({
            customer: mappedCustomer,
            vehicle: mappedVehicle
          });
        }
      });

      // Delete uploaded file from temp location
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Insert valid rows in transactional method
      if (validCombinedRows.length > 0) {
        try {
          const result = await customerService.insertBulkCombined(validCombinedRows);

          return res.status(200).json({
            success: 1,
            message: `Successfully processed file. Mapped and inserted ${result.insertedCustomers} customer(s) and ${result.insertedVehicles} vehicle(s).`,
            fileType: "excel",
            stats: {
              totalRows: rawRows.length,
              insertedCount: validCombinedRows.length,
              failedCount: failedRows.length
            },
            failedRows: failedRows,
            insertedData: validCombinedRows.map(row => ({
              customer_name: row.customer.customer_name,
              mobile_number_1: row.customer.mobile_number_1,
              registration_number: row.vehicle.registration_number,
              model: row.vehicle.model,
              vechile_maker: row.vehicle.vechile_maker,
              fuel_type: row.vehicle.fuel_type
            }))
          });
        } catch (dbErr) {
          console.error("Combined bulk insert database error:", dbErr);
          return res.status(500).json({
            success: 0,
            message: "Failed to insert customer and vehicle data into database. Possibly duplicate vehicle registration number or other constraint violation.",
            error: dbErr.message
          });
        }
      } else {
        return res.status(400).json({
          success: 0,
          message: "No valid rows found in Excel sheet. Check validation errors.",
          stats: {
            totalRows: rawRows.length,
            insertedCount: 0,
            failedCount: failedRows.length
          },
          failedRows: failedRows
        });
      }
    } catch (error) {
      console.error("uploadCustomerFile error:", error);
      return res.status(500).json({
        success: 0,
        message: "An error occurred while processing the file.",
        error: error.message
      });
    }
  },

  // ==================== GET ALL CUSTOMERS ====================
  getAllCustomers: (req, res) => {
    try {
      customerService.getAllCustomers((err, results) => {
        if (err) {
          console.error("getAllCustomers error:", err);
          return res.status(500).json({
            success: 0,
            message: "Database error occurred while fetching customers."
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Customers retrieved successfully.",
          data: results
        });
      });
    } catch (error) {
      console.error("getAllCustomers error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong."
      });
    }
  },

  // ==================== DELETE CUSTOMER ====================
  deleteCustomer: (req, res) => {
    try {
      const { customerId } = req.params;

      if (!customerId) {
        return res.status(400).json({
          success: 0,
          message: "Customer ID is required."
        });
      }

      customerService.deleteCustomer(customerId, (err, result) => {
        if (err) {
          console.error("deleteCustomer error:", err);
          return res.status(500).json({
            success: 0,
            message: "Database error occurred while deleting customer."
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: 0,
            message: "Customer not found."
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Customer deleted successfully."
        });
      });
    } catch (error) {
      console.error("deleteCustomer error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong."
      });
    }
  },

  // ==================== UPLOAD & PROCESS VEHICLE EXCEL FILE ====================
  uploadVehicleFile: (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: 0,
          message: "No file uploaded or invalid file type. Please upload Excel (.xlsx, .xls) files."
        });
      }

      const fileExt = path.extname(file.originalname).toLowerCase();
      if (fileExt !== ".xlsx" && fileExt !== ".xls") {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({
          success: 0,
          message: "Invalid file type. Please upload an Excel file (.xlsx or .xls)."
        });
      }

      const filePath = file.path;

      // Read workbook
      let workbook;
      try {
        workbook = xlsx.readFile(filePath);
      } catch (readErr) {
        console.error("Error reading vehicle excel file:", readErr);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(400).json({
          success: 0,
          message: "Failed to read Excel file. The file may be corrupt."
        });
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Parse rows
      const rawRows = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

      if (rawRows.length === 0) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(400).json({
          success: 0,
          message: "Excel sheet is empty. Please add vehicle details."
        });
      }

      const validVehicles = [];
      const failedRows = [];

      // Mappings and Synonyms matching the requested columns
      const mappings = {
        customer_id: ["customer_id", "customer id", "customer", "customerid"],
        registration_number: ["registration_number", "registration number", "reg_no", "reg no", "registration_no", "registrationno"],
        rto: ["rto"],
        registration_data: ["registration_data", "registration data", "registration_date", "registration date", "registrationdata", "registrationdate"],
        model: ["model"],
        vechile_maker: ["vechile_maker", "vechile maker", "vehicle_maker", "vehicle maker", "maker"],
        engine_number: ["engine_number", "engine number", "engine_no", "engine no"],
        chassis_number: ["chassis_number", "chassis number", "chassis_no", "chassis no"],
        vechile_class: ["vechile_class", "vechile class", "vehicle_class", "vehicle class", "class"],
        vehicle_category: ["vehicle_category", "vehicle category", "category", "vechile_category", "vechile category"],
        fuel_type: ["fuel_type", "fuel type", "fuel"],
        seat_capacity: ["seat_capacity", "seat capacity", "seats", "seating", "seating_capacity"]
      };

      rawRows.forEach((row, index) => {
        const mappedRow = {
          customer_id: getMappingValue(row, mappings.customer_id),
          registration_number: getMappingValue(row, mappings.registration_number),
          rto: getMappingValue(row, mappings.rto),
          registration_data: getMappingValue(row, mappings.registration_data),
          model: getMappingValue(row, mappings.model),
          vechile_maker: getMappingValue(row, mappings.vechile_maker),
          engine_number: getMappingValue(row, mappings.engine_number),
          chassis_number: getMappingValue(row, mappings.chassis_number),
          vechile_class: getMappingValue(row, mappings.vechile_class),
          vehicle_category: getMappingValue(row, mappings.vehicle_category),
          fuel_type: getMappingValue(row, mappings.fuel_type),
          seat_capacity: getMappingValue(row, mappings.seat_capacity)
        };

        const rowNumber = index + 2; // Row 1 is header
        const errors = [];

        if (!mappedRow.customer_id) {
          errors.push("Customer ID is missing.");
        } else if (!/^\d+$/.test(mappedRow.customer_id)) {
          errors.push("Customer ID must be numeric.");
        }

        if (!mappedRow.registration_number) {
          errors.push("Registration Number is missing.");
        }

        if (errors.length > 0) {
          failedRows.push({
            row: rowNumber,
            data: row,
            errors: errors
          });
        } else {
          validVehicles.push(mappedRow);
        }
      });

      // Delete file from disk
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      if (validVehicles.length > 0) {
        customerService.insertBulkVehicles(validVehicles, (err, result) => {
          if (err) {
            console.error("Bulk insert vehicles error:", err);
            return res.status(500).json({
              success: 0,
              message: "Failed to insert vehicle data into database.",
              error: err.message
            });
          }

          return res.status(200).json({
            success: 1,
            message: `Successfully processed file. Mapped and inserted ${validVehicles.length} vehicle(s).`,
            fileType: "excel",
            stats: {
              totalRows: rawRows.length,
              insertedCount: validVehicles.length,
              failedCount: failedRows.length
            },
            failedRows: failedRows,
            insertedData: validVehicles
          });
        });
      } else {
        return res.status(400).json({
          success: 0,
          message: "No valid rows found in Excel sheet. Check validation errors.",
          stats: {
            totalRows: rawRows.length,
            insertedCount: 0,
            failedCount: failedRows.length
          },
          failedRows: failedRows
        });
      }
    } catch (error) {
      console.error("uploadVehicleFile error:", error);
      return res.status(500).json({
        success: 0,
        message: "An error occurred while processing the file.",
        error: error.message
      });
    }
  },

  // ==================== GET ALL VEHICLES ====================
  getAllVehicles: (req, res) => {
    try {
      customerService.getAllVehicles((err, results) => {
        if (err) {
          console.error("getAllVehicles error:", err);
          return res.status(500).json({
            success: 0,
            message: "Database error occurred while fetching vehicles."
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Vehicles retrieved successfully.",
          data: results
        });
      });
    } catch (error) {
      console.error("getAllVehicles error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong."
      });
    }
  },

  // ==================== DELETE VEHICLE ====================
  deleteVehicle: (req, res) => {
    try {
      const { vehicleId } = req.params;

      if (!vehicleId) {
        return res.status(400).json({
          success: 0,
          message: "Vehicle ID is required."
        });
      }

      customerService.deleteVehicle(vehicleId, (err, result) => {
        if (err) {
          console.error("deleteVehicle error:", err);
          return res.status(500).json({
            success: 0,
            message: "Database error occurred while deleting vehicle."
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: 0,
            message: "Vehicle not found."
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Vehicle deleted successfully."
        });
      });
    } catch (error) {
      console.error("deleteVehicle error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong."
      });
    }
  },

  // ==================== GET CUSTOMER BY ID ====================
  getCustomerById: (req, res) => {
    try {
      const { customerId } = req.params;
      if (!customerId) {
        return res.status(400).json({
          success: 0,
          message: "Customer ID is required."
        });
      }

      customerService.getCustomerById(customerId, (err, result) => {
        if (err) {
          console.error("getCustomerById error:", err);
          return res.status(500).json({
            success: 0,
            message: "Database error occurred."
          });
        }
        if (!result) {
          return res.status(404).json({
            success: 0,
            message: "Customer not found."
          });
        }
        return res.status(200).json({
          success: 1,
          data: result
        });
      });
    } catch (error) {
      console.error("getCustomerById error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong."
      });
    }
  },

  getNewCustomers: (req, res) => {
    try {
      const { month } = req.params;
      if (!month) {
        return res.status(400).json({
          success: 0,
          message: "Select Months."
        });
      }

      customerService.getNewCustomers(month, (err, result) => {
        if (err) {
          console.error("getCustomerById error:", err);
          return res.status(500).json({
            success: 0,
            message: "Database error occurred."
          });
        }
        if (!result) {
          return res.status(404).json({
            success: 0,
            message: "Customer not found."
          });
        }
        return res.status(200).json({
          success: 1,
          data: result
        });
      });
    } catch (error) {
      console.error("getCustomerById error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong."
      });
    }
  },



  // ==================== GET VEHICLE BY ID ====================
  getVehicleById: (req, res) => {
    try {
      const { vehicleId } = req.params;
      if (!vehicleId) {
        return res.status(400).json({
          success: 0,
          message: "Vehicle ID is required."
        });
      }

      customerService.getVehicleById(vehicleId, (err, result) => {
        if (err) {
          console.error("getVehicleById error:", err);
          return res.status(500).json({
            success: 0,
            message: "Database error occurred."
          });
        }
        if (!result) {
          return res.status(404).json({
            success: 0,
            message: "Vehicle not found."
          });
        }
        return res.status(200).json({
          success: 1,
          data: result
        });
      });
    } catch (error) {
      console.error("getVehicleById error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong."
      });
    }
  },

  // ==================== UPDATE CUSTOMER ====================
  updateCustomer: (req, res) => {
    try {
      const { customerId } = req.params;
      const data = req.body;

      if (!customerId) {
        return res.status(400).json({
          success: 0,
          message: "Customer ID is required."
        });
      }

      if (!data.customer_name) {
        return res.status(400).json({
          success: 0,
          message: "Customer Name is required."
        });
      }

      if (!data.mobile_number_1) {
        return res.status(400).json({
          success: 0,
          message: "Mobile Number 1 is required."
        });
      }

      customerService.updateCustomer(customerId, data, (err, result) => {
        if (err) {
          console.error("updateCustomer error:", err);
          return res.status(500).json({
            success: 0,
            message: "Database error occurred while updating customer."
          });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: 0,
            message: "Customer not found."
          });
        }
        return res.status(200).json({
          success: 1,
          message: "Customer updated successfully."
        });
      });
    } catch (error) {
      console.error("updateCustomer error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong."
      });
    }
  },

  // ==================== UPDATE VEHICLE ====================
  updateVehicle: (req, res) => {
    try {
      const { vehicleId } = req.params;
      const data = req.body;

      if (!vehicleId) {
        return res.status(400).json({
          success: 0,
          message: "Vehicle ID is required."
        });
      }

      if (!data.registration_number) {
        return res.status(400).json({
          success: 0,
          message: "Registration Number is required."
        });
      }

      if (!data.customer_id) {
        return res.status(400).json({
          success: 0,
          message: "Customer ID is required."
        });
      }

      customerService.updateVehicle(vehicleId, data, (err, result) => {
        if (err) {
          console.error("updateVehicle error:", err);
          return res.status(500).json({
            success: 0,
            message: "Database error occurred while updating vehicle."
          });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: 0,
            message: "Vehicle not found."
          });
        }
        return res.status(200).json({
          success: 1,
          message: "Vehicle updated successfully."
        });
      });
    } catch (error) {
      console.error("updateVehicle error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong."
      });
    }
  },
  CreateNewLead: (req, res) => {
    try {
      const { allocations } = req.body;

      // Validation
      if (!allocations || allocations.length === 0) {
        return res.status(200).json({
          success: 0,
          message: "No data to Allocate"
        });
      }

      console.log(allocations);
      

      const values = allocations.map((item) => [
        item.customer_id,
        item.vehicle_id,
        item.policy_id,
        item.status_id,
        item.lead_priority,
        item.assigned_to,
        item.assigned_date,
        item.is_assigned,
        item.lead_source,
        item.remarks,
        item.created_by,
      ]);


      // Step 1: Create role in role_master table
      customerService.CreateNewLead(values, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: 0,
            message: "Something went wrong while creating role"
          });
        }

        return res.status(200).json({
          success: 1,
          message: "Role created successfully",
        });
      });
    } catch (error) {
      console.error("createRole error:", error);
      return res.status(500).json({
        success: 0,
        message: "Something went wrong"
      });
    }
  },

};
