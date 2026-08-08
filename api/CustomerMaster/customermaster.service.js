// api/CustomerMaster/customermaster.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
  // ==================== BULK INSERT CUSTOMERS ====================
  insertBulkCustomers: (customersArray, callback) => {
    const query = `
      INSERT INTO customers 
      (customer_name, mobile_number_1, mobile_number_2, email, address, city, district, state, pincode, is_active, is_previous_customer, created_by)
      VALUES ?
    `;

    // Prepare values as an array of arrays
    const values = customersArray.map((cust) => [
      cust.customer_name,
      cust.mobile_number_1,
      cust.mobile_number_2 || null,
      cust.email || null,
      cust.address || null,
      cust.city || null,
      cust.district || null,
      cust.state || null,
      cust.pincode || null,
      cust.is_active !== undefined ? cust.is_active : 1,
      cust.is_previous_customer !== undefined ? cust.is_previous_customer : 0,
      cust.created_by || null,
    ]);

    pool.query(query, [values], (err, result) => {
      console.log('error', err);

      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  // ==================== CREATE SINGLE CUSTOMER ====================
  createCustomer: (cust, callback) => {
    const query = `
      INSERT INTO customers 
      (customer_name, mobile_number_1, mobile_number_2, email, address, city, district, state, pincode, is_active, is_previous_customer, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(
      query,
      [
        cust.customer_name,
        cust.mobile_number_1,
        cust.mobile_number_2 || null,
        cust.email || null,
        cust.address || null,
        cust.city || null,
        cust.district || null,
        cust.state || null,
        cust.pincode || null,
        cust.is_active !== undefined ? cust.is_active : 1,
        cust.is_previous_customer !== undefined ? cust.is_previous_customer : 0,
        cust.created_by || null,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== GET ALL CUSTOMERS ====================
  getAllCustomers: (callback) => {
    const query = `
      SELECT * FROM customers 
      ORDER BY created_at DESC
    `;

    pool.query(query, [], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  // ==================== DELETE CUSTOMER ====================
  deleteCustomer: (customerId, callback) => {
    const query = `
      DELETE FROM customers 
      WHERE customer_id = ?
    `;

    pool.query(query, [customerId], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  // ==================== BULK INSERT VEHICLES ====================
  insertBulkVehicles: (vehiclesArray, callback) => {
    const query = `
      INSERT INTO vehicles 
      (customer_id, registration_number, rto, registration_date, model, vehicle_maker, engine_number, chassis_number, vehicle_class, vehicle_category, fuel_type, seat_capacity, known_policy_expiry_date)
      VALUES ?
    `;

    const values = vehiclesArray.map((v) => [
      v.customer_id,
      v.registration_number,
      v.rto || null,
      v.registration_date || null,
      v.model || null,
      v.vehicle_maker || null,
      v.engine_number || null,
      v.chassis_number || null,
      v.vehicle_class || null,
      v.vehicle_category || null,
      v.fuel_type || null,
      v.seat_capacity || null,
      v.known_policy_expiry_date || null,
    ]);

    pool.query(query, [values], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  // ==================== GET ALL VEHICLES ====================
  getAllVehicles: (callback) => {
    const query = `
      SELECT v.*, c.customer_name 
      FROM vehicles v
      LEFT JOIN customers c ON v.customer_id = c.customer_id
      ORDER BY v.created_at DESC
    `;

    pool.query(query, [], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  // ==================== DELETE VEHICLE ====================
  deleteVehicle: (vehicleId, callback) => {
    const query = `
      DELETE FROM vehicles 
      WHERE vehicle_id = ?
    `;

    pool.query(query, [vehicleId], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  },

  // ==================== BULK INSERT COMBINED CUSTOMERS & VEHICLES ====================
  insertBulkCombined: async (combinedRows) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    try {
      await connection.beginTransaction();

      const duplicateRows = [];
      const rowsToProcess = [];

      // 1. Check internal duplicates within the Excel file (by registration_number)
      const seenRegNumbersInFile = new Set();

      combinedRows.forEach((item, index) => {
        const rawReg = item.vehicle.registration_number || "";
        const regNorm = String(rawReg).trim().toUpperCase();

        if (regNorm !== "") {
          if (seenRegNumbersInFile.has(regNorm)) {
            duplicateRows.push({
              row: item.originalRow || index + 2,
              customer_name: item.customer.customer_name,
              mobile_number_1: item.customer.mobile_number_1,
              registration_number: item.vehicle.registration_number,
              reason: `Duplicate entry in Excel file: Vehicle registration number '${item.vehicle.registration_number}' is repeated.`,
              data: item.originalData || {}
            });
            return;
          }
          seenRegNumbersInFile.add(regNorm);
        }
        rowsToProcess.push(item);
      });

      // 2. Check duplicates against the database (vehicles table registration_number)
      const nonDuplicateRows = [];
      if (rowsToProcess.length > 0) {
        const regNumbers = rowsToProcess
          .map((item) => (item.vehicle.registration_number || "").trim())
          .filter((reg) => reg !== "");

        const existingDbRegSet = new Set();

        if (regNumbers.length > 0) {
          const [existingVehicles] = await connection.query(
            "SELECT registration_number FROM vehicles WHERE UPPER(TRIM(registration_number)) IN (?)",
            [regNumbers.map((r) => r.toUpperCase())]
          );
          existingVehicles.forEach((v) => {
            if (v.registration_number) {
              existingDbRegSet.add(v.registration_number.trim().toUpperCase());
            }
          });
        }

        rowsToProcess.forEach((item, index) => {
          const rawReg = item.vehicle.registration_number || "";
          const regNorm = String(rawReg).trim().toUpperCase();

          if (regNorm !== "" && existingDbRegSet.has(regNorm)) {
            duplicateRows.push({
              row: item.originalRow || index + 2,
              customer_name: item.customer.customer_name,
              mobile_number_1: item.customer.mobile_number_1,
              registration_number: item.vehicle.registration_number,
              reason: `Duplicate entry in database: Vehicle registration number '${item.vehicle.registration_number}' already exists in system.`,
              data: item.originalData || {}
            });
          } else {
            nonDuplicateRows.push(item);
          }
        });
      }

      // 3. Process Balance Data (nonDuplicateRows)
      let insertedCustomersCount = 0;
      let insertedVehiclesCount = 0;
      const insertedData = [];

      if (nonDuplicateRows.length > 0) {
        // Get unique mobile numbers
        const mobileNumbers = [
          ...new Set(nonDuplicateRows.map((item) => item.customer.mobile_number_1).filter(Boolean)),
        ];

        const customerMap = new Map(); // mobile_number_1 -> customer_id

        if (mobileNumbers.length > 0) {
          const [existingCusts] = await connection.query(
            "SELECT customer_id, mobile_number_1 FROM customers WHERE mobile_number_1 IN (?)",
            [mobileNumbers]
          );
          existingCusts.forEach((c) => {
            customerMap.set(c.mobile_number_1, c.customer_id);
          });
        }

        // Identify new customers to insert
        const newCustomersToInsert = [];
        const insertedMobileSet = new Set();

        nonDuplicateRows.forEach((item) => {
          const mob = item.customer.mobile_number_1;
          if (mob && !customerMap.has(mob) && !insertedMobileSet.has(mob)) {
            newCustomersToInsert.push(item.customer);
            insertedMobileSet.add(mob);
          }
        });

        // Insert new customers
        for (const cust of newCustomersToInsert) {
          const [result] = await connection.query(
            `INSERT INTO customers 
             (customer_name, mobile_number_1, mobile_number_2, email, address, city, district, state, pincode, is_active, is_previous_customer, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              cust.customer_name,
              cust.mobile_number_1,
              cust.mobile_number_2 || null,
              cust.email || null,
              cust.address || null,
              cust.city || null,
              cust.district || null,
              cust.state || null,
              cust.pincode || null,
              cust.is_active !== undefined ? cust.is_active : 1,
              cust.is_previous_customer !== undefined ? cust.is_previous_customer : 0,
              cust.created_by || null,
            ]
          );
          customerMap.set(cust.mobile_number_1, result.insertId);
        }
        insertedCustomersCount = newCustomersToInsert.length;

        // Prepare vehicles to insert
        const vehiclesToInsert = [];
        nonDuplicateRows.forEach((item) => {
          const custId = customerMap.get(item.customer.mobile_number_1);

          vehiclesToInsert.push([
            custId,
            item.vehicle.registration_number,
            item.vehicle.rto || null,
            item.vehicle.registration_date || null,
            item.vehicle.model || null,
            item.vehicle.vehicle_maker || null,
            item.vehicle.engine_number || null,
            item.vehicle.chassis_number || null,
            item.vehicle.vehicle_class || null,
            item.vehicle.vehicle_category || null,
            item.vehicle.fuel_type || null,
            item.vehicle.seat_capacity || null,
            item.vehicle.known_policy_expiry_date || null,
          ]);

          insertedData.push({
            customer_name: item.customer.customer_name,
            mobile_number_1: item.customer.mobile_number_1,
            registration_number: item.vehicle.registration_number,
            model: item.vehicle.model,
            vehicle_maker: item.vehicle.vehicle_maker,
            fuel_type: item.vehicle.fuel_type
          });
        });

        if (vehiclesToInsert.length > 0) {
          const [vehResult] = await connection.query(
            `INSERT INTO vehicles
             (
               customer_id,
               registration_number,
               rto,
               registration_date,
               model,
               vehicle_maker,
               engine_number,
               chassis_number,
               vehicle_class,
               vehicle_category,
               fuel_type,
               seat_capacity,
               known_policy_expiry_date
             )
             VALUES ?`,
            [vehiclesToInsert]
          );
          insertedVehiclesCount = vehResult.affectedRows;
        }
      }

      await connection.commit();

      return {
        insertedCustomers: insertedCustomersCount,
        insertedVehicles: insertedVehiclesCount,
        totalRows: combinedRows.length,
        insertedData: insertedData,
        duplicateRows: duplicateRows
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  // ==================== PROCESS RENEWAL UPLOADS ====================
  processRenewalUploads: async (combinedRows) => {
    const promisePool = pool.promise();
    const connection = await promisePool.getConnection();
    try {
      await connection.beginTransaction();

      let insertedCustomersCount = 0;
      let insertedVehiclesCount = 0;
      let updatedVehiclesCount = 0;
      const skippedRows = [];
      const duplicateRows = [];
      const processedData = [];

      // 1. Fetch all existing vehicle registration numbers from DB for the batch
      const allRegNumbers = combinedRows
        .map((r) => (r.vehicle.registration_number || "").trim())
        .filter((reg) => reg !== "");

      const existingVehicleMap = new Map(); // regNoUpper -> { vehicle_id, customer_id }

      if (allRegNumbers.length > 0) {
        const [existingVehs] = await connection.query(
          "SELECT vehicle_id, customer_id, registration_number FROM vehicles WHERE UPPER(TRIM(registration_number)) IN (?)",
          [allRegNumbers.map((r) => r.toUpperCase())]
        );
        existingVehs.forEach((v) => {
          if (v.registration_number) {
            existingVehicleMap.set(v.registration_number.trim().toUpperCase(), {
              vehicle_id: v.vehicle_id,
              customer_id: v.customer_id
            });
          }
        });
      }

      // 2. Separate into updates, duplicate file rows, missing previous vehicles, and new insertions
      const insertList = [];
      const seenRegNumbersInFile = new Set();

      combinedRows.forEach((row, index) => {
        const rawReg = row.vehicle.registration_number || "";
        const regNorm = String(rawReg).trim().toUpperCase();
        const rowNum = row.originalRow || index + 2;

        // Check internal file duplicates
        if (regNorm !== "") {
          if (seenRegNumbersInFile.has(regNorm)) {
            duplicateRows.push({
              row: rowNum,
              customer_name: row.customer.customer_name,
              mobile_number_1: row.customer.mobile_number_1,
              registration_number: row.vehicle.registration_number,
              reason: `Duplicate entry in Excel file: Vehicle registration number '${row.vehicle.registration_number}' is repeated.`,
              data: row.originalData || {}
            });
            return;
          }
          seenRegNumbersInFile.add(regNorm);
        }

        // If vehicle exists in DB, handle as Renewal Update
        if (regNorm !== "" && existingVehicleMap.has(regNorm)) {
          const { vehicle_id, customer_id } = existingVehicleMap.get(regNorm);
          const expiryDate = row.vehicle.known_policy_expiry_date;

          insertList.push({
            type: "update",
            row,
            vehicle_id,
            customer_id,
            expiryDate
          });
        } else if (row.customer.is_previous_customer === 1) {
          // Explicitly marked as previous customer, but vehicle not found in DB
          skippedRows.push({
            row: rowNum,
            data: row.originalData || {},
            errors: ["Previous customer vehicle not found in database. Registration Number: " + rawReg]
          });
        } else {
          // New customer and vehicle
          insertList.push({
            type: "insert",
            row
          });
        }
      });

      // 3. Execute Updates
      const updateItems = insertList.filter((item) => item.type === "update");
      for (const item of updateItems) {
        if (item.expiryDate) {
          await connection.query(
            "UPDATE vehicles SET known_policy_expiry_date = ? WHERE vehicle_id = ?",
            [item.expiryDate, item.vehicle_id]
          );
        }
        await connection.query(
          "UPDATE customers SET is_previous_customer = 1 WHERE customer_id = ?",
          [item.customer_id]
        );
        updatedVehiclesCount++;

        processedData.push({
          customer_name: item.row.customer.customer_name,
          mobile_number_1: item.row.customer.mobile_number_1,
          registration_number: item.row.vehicle.registration_number,
          model: item.row.vehicle.model,
          vehicle_maker: item.row.vehicle.vehicle_maker,
          fuel_type: item.row.vehicle.fuel_type,
          status: "Updated (Renewal)"
        });
      }

      // 4. Execute New Insertions
      const newItemsToInsert = insertList
        .filter((item) => item.type === "insert")
        .map((item) => item.row);

      if (newItemsToInsert.length > 0) {
        const mobileNumbers = [
          ...new Set(newItemsToInsert.map((row) => row.customer.mobile_number_1).filter(Boolean)),
        ];

        const customerMap = new Map();

        if (mobileNumbers.length > 0) {
          const [existing] = await connection.query(
            "SELECT customer_id, mobile_number_1 FROM customers WHERE mobile_number_1 IN (?)",
            [mobileNumbers]
          );
          existing.forEach((row) => {
            customerMap.set(row.mobile_number_1, row.customer_id);
          });
        }

        const newCustomersToInsert = [];
        const insertedMobileSet = new Set();

        newItemsToInsert.forEach((row) => {
          const mob = row.customer.mobile_number_1;
          if (mob && !customerMap.has(mob) && !insertedMobileSet.has(mob)) {
            newCustomersToInsert.push(row.customer);
            insertedMobileSet.add(mob);
          }
        });

        for (const cust of newCustomersToInsert) {
          const [result] = await connection.query(
            `INSERT INTO customers 
             (customer_name, mobile_number_1, mobile_number_2, email, address, city, district, state, pincode, is_active, is_previous_customer, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              cust.customer_name,
              cust.mobile_number_1,
              cust.mobile_number_2 || null,
              cust.email || null,
              cust.address || null,
              cust.city || null,
              cust.district || null,
              cust.state || null,
              cust.pincode || null,
              cust.is_active !== undefined ? cust.is_active : 1,
              cust.is_previous_customer !== undefined ? cust.is_previous_customer : 0,
              cust.created_by || null,
            ]
          );
          customerMap.set(cust.mobile_number_1, result.insertId);
        }

        insertedCustomersCount = newCustomersToInsert.length;

        const vehiclesToInsert = newItemsToInsert.map((row) => {
          const custId = customerMap.get(row.customer.mobile_number_1);

          processedData.push({
            customer_name: row.customer.customer_name,
            mobile_number_1: row.customer.mobile_number_1,
            registration_number: row.vehicle.registration_number,
            model: row.vehicle.model,
            vehicle_maker: row.vehicle.vehicle_maker,
            fuel_type: row.vehicle.fuel_type,
            status: "Inserted"
          });

          return [
            custId,
            row.vehicle.registration_number,
            row.vehicle.rto || null,
            row.vehicle.registration_date || null,
            row.vehicle.model || null,
            row.vehicle.vehicle_maker || null,
            row.vehicle.engine_number || null,
            row.vehicle.chassis_number || null,
            row.vehicle.vehicle_class || null,
            row.vehicle.vehicle_category || null,
            row.vehicle.fuel_type || null,
            row.vehicle.seat_capacity || null,
            row.vehicle.known_policy_expiry_date || null,
          ];
        });

        if (vehiclesToInsert.length > 0) {
          const [vehResult] = await connection.query(
            `INSERT INTO vehicles
             (
               customer_id,
               registration_number,
               rto,
               registration_date,
               model,
               vehicle_maker,
               engine_number,
               chassis_number,
               vehicle_class,
               vehicle_category,
               fuel_type,
               seat_capacity,
               known_policy_expiry_date
             )
             VALUES ?`,
            [vehiclesToInsert]
          );
          insertedVehiclesCount = vehResult.affectedRows;
        }
      }

      await connection.commit();

      return {
        insertedCustomers: insertedCustomersCount,
        insertedVehicles: insertedVehiclesCount,
        updatedVehicles: updatedVehiclesCount,
        skippedRows: skippedRows,
        duplicateRows: duplicateRows,
        processedData: processedData
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  // ==================== GET CUSTOMER BY ID ====================
  getCustomerById: (customerId, callback) => {
    const query = `
      SELECT * FROM customers 
      WHERE customer_id = ?
    `;
    pool.query(query, [customerId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0] || null);
    });
  },

  getNewCustomers: (month, callback) => {
    const query = `
    SELECT
    c.customer_id,
    c.customer_name,
    c.mobile_number_1,
    v.vehicle_id,
    v.registration_number,
    v.registration_date,
    v.vehicle_category,
    v.rto,
    v.vehicle_class,
    v.known_policy_expiry_date AS expiry_date
FROM customers c
JOIN vehicles v
    ON c.customer_id = v.customer_id
LEFT JOIN leads l
    ON l.customer_id = c.customer_id
   AND l.vehicle_id = v.vehicle_id
WHERE DATE_FORMAT(v.known_policy_expiry_date, '%Y-%m') = ?
  AND l.lead_id IS NULL
    `;
    pool.query(query, [month], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results || null);
    });
  },

  // ==================== GET VEHICLE BY ID ====================
  getVehicleById: (vehicleId, callback) => {
    const query = `
      SELECT v.*, c.customer_name 
      FROM vehicles v
      LEFT JOIN customers c ON v.customer_id = c.customer_id
      WHERE v.vehicle_id = ?
    `;
    pool.query(query, [vehicleId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0] || null);
    });
  },

  // ==================== UPDATE CUSTOMER ====================
  updateCustomer: (customerId, cust, callback) => {
    const query = `
      UPDATE customers 
      SET customer_name = ?, mobile_number_1 = ?, mobile_number_2 = ?, email = ?, 
          address = ?, city = ?, district = ?, state = ?, pincode = ?, is_active = ?, is_previous_customer = ?
      WHERE customer_id = ?
    `;
    pool.query(
      query,
      [
        cust.customer_name,
        cust.mobile_number_1,
        cust.mobile_number_2 || null,
        cust.email || null,
        cust.address || null,
        cust.city || null,
        cust.district || null,
        cust.state || null,
        cust.pincode || null,
        cust.is_active !== undefined ? cust.is_active : 1,
        cust.is_previous_customer !== undefined ? cust.is_previous_customer : 0,
        customerId,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== CREATE SINGLE VEHICLE ====================
  createVehicle: (v, callback) => {
    const query = `
      INSERT INTO vehicles 
      (customer_id, registration_number, rto, registration_date, model, vehicle_maker, engine_number, chassis_number, vehicle_class, vehicle_category, fuel_type, seat_capacity, known_policy_expiry_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(
      query,
      [
        v.customer_id,
        v.registration_number,
        v.rto || null,
        v.registration_date || null,
        v.model || null,
        v.vehicle_maker || null,
        v.engine_number || null,
        v.chassis_number || null,
        v.vehicle_class || null,
        v.vehicle_category || null,
        v.fuel_type || null,
        v.seat_capacity || null,
        // v.known_policy_expiry_date || null,
        v.expiry_date || null,
        v.created_by || null
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      }
    );
  },

  // ==================== UPDATE VEHICLE ====================
  updateVehicle: (vehicleId, v, callback) => {
    const query = `
      UPDATE vehicles 
      SET customer_id = ?, registration_number = ?, rto = ?, registration_date = ?, 
          model = ?, vehicle_maker = ?, engine_number = ?, chassis_number = ?, 
          vehicle_class = ?, vehicle_category = ?, fuel_type = ?, seat_capacity = ?, known_policy_expiry_date = ?
      WHERE vehicle_id = ?
    `;
    pool.query(
      query,
      [
        v.customer_id,
        v.registration_number,
        v.rto || null,
        v.registration_date || null,
        v.model || null,
        v.vehicle_maker || null,
        v.engine_number || null,
        v.chassis_number || null,
        v.vehicle_class || null,
        v.vehicle_category || null,
        v.fuel_type || null,
        v.seat_capacity || null,
        v.known_policy_expiry_date || null,
        vehicleId,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  CreateNewLead: (values, callback) => {

    pool.query(
      `INSERT INTO leads (
                customer_id,
                vehicle_id,
                policy_id,
                status_id,
                assigned_to,
                assigned_date,
                is_assigned,
                work_status,
                remarks,
                created_by
            )
            VALUES ?`,
      [
        values
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      }
    );
  },

  getEmployeePolicyTaken: (empid, callback) => {
    const query = `
      SELECT
          COUNT(DISTINCT p.policy_id) AS total_sold,

          SUM(
              CASE
                  WHEN YEAR(p.start_date) = YEAR(CURDATE())
                  AND MONTH(p.start_date) = MONTH(CURDATE())
                  THEN 1
                  ELSE 0
              END
          ) AS this_month,

          COALESCE(SUM(p.premium_amount), 0) AS total_premium,

          SUM(
              CASE
                  WHEN p.expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
                      AND p.policy_status = 'ACTIVE'
                  THEN 1
                  ELSE 0
              END
          ) AS renewal_due,

          SUM(
              CASE
                  WHEN p.expiry_date < CURDATE()
                  THEN 1
                  ELSE 0
              END
          ) AS expired

      FROM policies p
      INNER JOIN leads l
          ON l.lead_id = p.lead_id
      INNER JOIN lead_status_master sm
          ON sm.status_id = l.status_id
      WHERE sm.status_id = 5
        AND l.assigned_to = ?	;
    `;
    pool.query(query, [empid], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0] || null);
    });
  },

};
