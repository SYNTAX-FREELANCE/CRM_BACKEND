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

      // 1. Get all unique mobile numbers from the batch
      const mobileNumbers = [
        ...new Set(combinedRows.map((row) => row.customer.mobile_number_1)),
      ];

      // 2. Query the DB to check which mobile numbers already exist
      const customerMap = new Map(); // mobile_number_1 -> customer_id

      if (mobileNumbers.length > 0) {
        const [existing] = await connection.query(
          "SELECT customer_id, mobile_number_1 FROM customers WHERE mobile_number_1 IN (?)",
          [mobileNumbers],
        );
        existing.forEach((row) => {
          customerMap.set(row.mobile_number_1, row.customer_id);
        });
      }

      // 3. Identify unique customers to insert (those whose mobile is not in customerMap and not already queued for insert)
      const newCustomersToInsert = [];
      const insertedMobileSet = new Set();

      combinedRows.forEach((row) => {
        const mob = row.customer.mobile_number_1;
        if (!customerMap.has(mob) && !insertedMobileSet.has(mob)) {
          newCustomersToInsert.push(row.customer);
          insertedMobileSet.add(mob);
        }
      });

      // 4. Insert new customers. Insert sequentially to guarantee getting their insertIds.
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
          ],
        );
        customerMap.set(cust.mobile_number_1, result.insertId);
      }

      // 5. Insert the vehicles linked to correct customer IDs.
      const vehiclesToInsert = combinedRows.map((row) => {
        const custId = customerMap.get(row.customer.mobile_number_1);
        // return [
        //   custId,
        //   row.vehicle.registration_number,
        //   row.vehicle.rto || null,
        //   row.vehicle.registration_data || null,
        //   row.vehicle.model || null,
        //   row.vehicle.vechile_maker || null,
        //   row.vehicle.engine_number || null,
        //   row.vehicle.chassis_number || null,
        //   row.vehicle.vechile_class || null,
        //   row.vehicle.vehicle_category || null,
        //   row.vehicle.fuel_type || null,
        //   row.vehicle.seat_capacity || null,
        // ];
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

      let insertedVehiclesCount = 0;
      if (vehiclesToInsert.length > 0) {
        // const [vehResult] = await connection.query(
        //   `INSERT INTO vehicles
        //    (customer_id, registration_number, rto, registration_data, model, vechile_maker, engine_number, chassis_number, vechile_class, vehicle_category, fuel_type, seat_capacity)
        //    VALUES ?`,
        //   [vehiclesToInsert]
        // );

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
          [vehiclesToInsert],
        );
        insertedVehiclesCount = vehResult.affectedRows;
      }

      await connection.commit();

      return {
        insertedCustomers: newCustomersToInsert.length,
        insertedVehicles: insertedVehiclesCount,
        totalRows: combinedRows.length,
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
};
