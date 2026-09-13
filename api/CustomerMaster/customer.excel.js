const xlsx = require("xlsx");
const customerService = require("./customermaster.service");

module.exports = {
  createPreviousCustomerExcel: (filePath, callback) => {
    try {
      // =========================================================
      // 1. READ EXCEL
      // =========================================================

      //   console.log("FILE PATH:", filePath);

      const workbook = xlsx.readFile(filePath, {
        cellDates: true,
      });

      //   console.log("SHEET NAMES:", workbook.SheetNames);

      if (
        !workbook ||
        !workbook.SheetNames ||
        workbook.SheetNames.length === 0
      ) {
        return callback(new Error("Excel file contains no sheets"), null);
      }

      // IMPORTANT: Declare sheetName first
      const sheetName = workbook.SheetNames[0];

      //   console.log("SHEET NAME:", sheetName);

      const worksheet = workbook.Sheets[sheetName];

      //   console.log("WORKSHEET:", worksheet);
      //   console.log("SHEET REF:", worksheet?.["!ref"]);

      if (!worksheet) {
        return callback(
          new Error(`Excel worksheet "${sheetName}" could not be read`),
          null,
        );
      }

      const rows = xlsx.utils.sheet_to_json(worksheet, {
        defval: "",
        raw: true,
      });

      //   console.log("ROWS:", rows);
      //   console.log("ROW COUNT:", rows.length);

      if (!rows.length) {
        return callback(
          new Error(
            `Excel sheet "${sheetName}" contains no data. Range: ${
              worksheet["!ref"] || "empty"
            }`,
          ),
          null,
        );
      }

      // =========================================================
      // 2. REQUIRED EXCEL COLUMNS
      // =========================================================

      const requiredColumns = [
        "customer_name",
        "mobile_number_1",
        "registration_number",
        "model",
        "sale_date",
        "insurance_company",
        "policy_number",
        "renewal_cycle",
        "start_date",
        "expiry_date",
        "premium_amount",
        "assigned_to",
      ];

      const excelColumns = Object.keys(rows[0]);

      //   console.log("EXCEL COLUMNS:", excelColumns);

      const missingColumns = requiredColumns.filter(
        (column) => !excelColumns.includes(column),
      );

      if (missingColumns.length > 0) {
        return callback(
          new Error(`Missing Excel columns: ${missingColumns.join(", ")}`),
          null,
        );
      }

      // =========================================================
      // 3. PROCESS ROWS
      // =========================================================

      const successRows = [];
      const failedRows = [];

      const processRow = (index) => {
        if (index >= rows.length) {
          return callback(null, {
            total_rows: rows.length,
            success_count: successRows.length,
            failed_count: failedRows.length,
            success_rows: successRows,
            failed_rows: failedRows,
          });
        }

        const row = rows[index];

        // =====================================================
        // BASIC ROW VALIDATION
        // =====================================================

        if (!row.customer_name) {
          failedRows.push({
            row: index + 2,
            customer_name: row.customer_name || null,
            reason: "customer_name is required",
          });

          return processRow(index + 1);
        }

        if (!row.registration_number) {
          failedRows.push({
            row: index + 2,
            customer_name: row.customer_name || null,
            reason: "registration_number is required",
          });

          return processRow(index + 1);
        }

        if (!row.assigned_to) {
          failedRows.push({
            row: index + 2,
            customer_name: row.customer_name || null,
            reason: "assigned_to is required",
          });

          return processRow(index + 1);
        }

        // =====================================================
        // PAYLOAD
        // =====================================================

        const payload = {
          customer: {
            customer_name: row.customer_name,
            mobile_number_1: row.mobile_number_1 || null,
            mobile_number_2: row.mobile_number_2 || null,
            email: row.email || null,
            address: row.address || null,
            city: row.city || null,
            district: row.district || null,
            state: row.state || null,
            pincode: row.pincode || null,
            is_active: 1,
            is_previous_customer: 1,
            created_by: 1,
          },

          vehicle: {
            registration_number: row.registration_number,
            rto: row.rto || null,
            registration_date: row.registration_date || null,
            model: row.model || null,
            vehicle_maker: row.vehicle_maker || null,
            engine_number: row.engine_number || null,
            chassis_number: row.chassis_number || null,
            vehicle_class: row.vehicle_class || null,
            vehicle_category: row.vehicle_category || null,
            fuel_type: row.fuel_type || null,
            seat_capacity: row.seat_capacity || null,
            known_policy_expiry_date: row.known_policy_expiry_date || null,
            created_by: 1,
          },

          sale: {
            sale_date: row.sale_date || null,

            paid_amount: Number(row.paid_amount) || 0,

            discount_amount: Number(row.discount_amount) || 0,

            // Excel column is "source"
            source_id: Number(row.source) || null,

            // Excel column is "insurance_company"
            insurance_company_id: Number(row.insurance_company) || null,

            policy_number: row.policy_number || null,

            renewal_cycle: row.renewal_cycle || null,

            start_date: row.start_date || null,

            expiry_date: row.expiry_date || null,

            premium_amount: Number(row.premium_amount) || 0,

            insured_declared_value: Number(row.insured_declared_value) || 0,

            reminder_days: Number(row.reminder_days) || 0,

            renewal_year: row.renewal_year || null,

            remarks: row.remarks || null,

            customer_pay_type_id: row.customer_pay_type_id || null,

            payment_method_id: row.payment_method_id || null,

            cp_reference_no: row.cp_reference_no || null,

            pm_reference_no: row.pm_reference_no || null,

            created_by: Number(row.assigned_to),
          },

          lead: {
            assigned_to: Number(row.assigned_to),

            status_id: 5,

            work_status: "COMPLETED",

            is_locked: 1,
          },
        };

        // =====================================================
        // CREATE CUSTOMER + VEHICLE + LEAD + POLICY
        // =====================================================

        customerService.createPreviousCustomerWithLead(
          payload,
          (error, result) => {
            if (error) {
              failedRows.push({
                row: index + 2,
                customer_name: row.customer_name,

                registration_number: row.registration_number,

                reason: error.message,
              });

              return processRow(index + 1);
            }

            successRows.push({
              row: index + 2,
              customer_name: row.customer_name,

              registration_number: row.registration_number,

              assigned_to: Number(row.assigned_to),

              customer_id: result.customer_id,

              vehicle_id: result.vehicle_id,

              lead_id: result.lead_id,

              policy_id: result.policy_id,
            });

            return processRow(index + 1);
          },
        );
      };

      processRow(0);
    } catch (error) {
      console.error("createPreviousCustomerExcel service error:", error);

      return callback(error, null);
    }
  },
};
