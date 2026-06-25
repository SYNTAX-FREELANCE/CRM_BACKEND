// services/vehicleTypeMaster.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
    // ==================== CREATE VEHICLE TYPE ====================
    createVehicleType: (vehicleTypeData, callback) => {
        pool.query(
            `INSERT INTO vehicle_types 
            (vehicle_type_name, is_active)
            VALUES (?, ?)`,
            [
                vehicleTypeData.vehicle_type_name,
                vehicleTypeData.is_active
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET ALL VEHICLE TYPES ====================
    getAllVehicleTypes: (callback) => {
        pool.query(
            `SELECT vehicle_type_id, vehicle_type_name, is_active 
            FROM vehicle_types 
            ORDER BY vehicle_type_id DESC`,
            [],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET VEHICLE TYPE BY ID ====================
    getVehicleTypeById: (vehicleTypeId, callback) => {
        pool.query(
            `SELECT vehicle_type_id, vehicle_type_name, is_active 
            FROM vehicle_types 
            WHERE vehicle_type_id = ?`,
            [vehicleTypeId],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }

                if (!result || result.length === 0) {
                    return callback(null, null);
                }

                callback(null, result[0]);
            }
        );
    },

    // ==================== UPDATE VEHICLE TYPE ====================
    updateVehicleType: (vehicleTypeId, vehicleTypeData, callback) => {
        pool.query(
            `UPDATE vehicle_types 
            SET vehicle_type_name = ?, is_active = ? 
            WHERE vehicle_type_id = ?`,
            [
                vehicleTypeData.vehicle_type_name,
                vehicleTypeData.is_active,
                vehicleTypeId
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    }
};
