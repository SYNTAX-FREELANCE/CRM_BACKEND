// controllers/vehicleTypeMaster.controller.js
const vehicleTypeMasterService = require("./vehicleTypeMaster.service");

module.exports = {
    // ==================== CREATE VEHICLE TYPE ====================
    createVehicleType: (req, res) => {
        try {
            const { vehicle_type_name, is_active } = req.body;

            // Validation
            if (!vehicle_type_name || vehicle_type_name.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Vehicle type name is required"
                });
            }

            // Prepare vehicle type data
            const vehicleTypeData = {
                vehicle_type_name: vehicle_type_name.trim(),
                is_active: is_active !== undefined ? is_active : 1
            };

            vehicleTypeMasterService.createVehicleType(vehicleTypeData, (err, result) => {
                if (err) {
                    console.error("createVehicleType DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while creating vehicle type"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Vehicle type created successfully",
                    data: {
                        vehicle_type_id: result.insertId,
                        vehicle_type_name: vehicleTypeData.vehicle_type_name,
                        is_active: vehicleTypeData.is_active
                    }
                });
            });
        } catch (error) {
            console.error("createVehicleType controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ALL VEHICLE TYPES ====================
    getAllVehicleTypes: (req, res) => {
        try {
            vehicleTypeMasterService.getAllVehicleTypes((err, vehicleTypes) => {
                if (err) {
                    console.error("getAllVehicleTypes DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Vehicle types retrieved successfully",
                    data: vehicleTypes
                });
            });
        } catch (error) {
            console.error("getAllVehicleTypes controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET VEHICLE TYPE BY ID ====================
    getVehicleTypeById: (req, res) => {
        try {
            const { vehicleTypeSlno } = req.params; // maps to vehicle_type_id

            vehicleTypeMasterService.getVehicleTypeById(vehicleTypeSlno, (err, vehicleType) => {
                if (err) {
                    console.error("getVehicleTypeById DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                if (!vehicleType) {
                    return res.status(200).json({
                        success: 0,
                        message: "Vehicle type not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Vehicle type retrieved successfully",
                    data: vehicleType
                });
            });
        } catch (error) {
            console.error("getVehicleTypeById controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== UPDATE VEHICLE TYPE ====================
    updateVehicleType: (req, res) => {
        try {
            const { vehicleTypeSlno } = req.params; // maps to vehicle_type_id
            const { vehicle_type_name, is_active } = req.body;

            // Validation
            if (!vehicle_type_name || vehicle_type_name.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Vehicle type name is required"
                });
            }

            const vehicleTypeData = {
                vehicle_type_name: vehicle_type_name.trim(),
                is_active: is_active !== undefined ? is_active : 1
            };

            vehicleTypeMasterService.updateVehicleType(vehicleTypeSlno, vehicleTypeData, (err, result) => {
                if (err) {
                    console.error("updateVehicleType DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while updating vehicle type"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Vehicle type updated successfully",
                    data: { vehicle_type_id: vehicleTypeSlno }
                });
            });
        } catch (error) {
            console.error("updateVehicleType controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    }
};
