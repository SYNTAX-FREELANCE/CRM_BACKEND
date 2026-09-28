// services/employeeLevel.service.js

const pool = require("../../dbconfig/dbconfig");

module.exports = {

    // ==================== CREATE EMPLOYEE LEVEL ====================

    createEmployeeLevel: (employeeLevelData, callback) => {

        pool.query(

            `INSERT INTO employee_level_master
            (
                level_name,
                description,
                is_active,
                created_at
            )
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,

            [
                employeeLevelData.level_name,
                employeeLevelData.description,
                employeeLevelData.is_active
            ],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== GET ALL EMPLOYEE LEVELS ====================

    getAllEmployeeLevels: (callback) => {

        pool.query(

            `SELECT *
             FROM employee_level_master
             ORDER BY created_at DESC`,

            [],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== GET EMPLOYEE LEVEL BY ID ====================

    getEmployeeLevelById: (employeeLevelId, callback) => {

        pool.query(

            `SELECT *
             FROM employee_level_master
             WHERE employee_level_id = ?`,

            [employeeLevelId],

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


    // ==================== UPDATE EMPLOYEE LEVEL ====================

    updateEmployeeLevel: (
        employeeLevelId,
        employeeLevelData,
        callback
    ) => {

        pool.query(

            `UPDATE employee_level_master
             SET
                level_name = ?,
                description = ?,
                is_active = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE employee_level_id = ?`,

            [
                employeeLevelData.level_name,
                employeeLevelData.description,
                employeeLevelData.is_active,
                employeeLevelId
            ],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== DELETE EMPLOYEE LEVEL ====================

    deleteEmployeeLevel: (employeeLevelId, callback) => {

        pool.query(

            `UPDATE employee_level_master
             SET
                is_active = 0,
                updated_at = CURRENT_TIMESTAMP
             WHERE employee_level_id = ?`,

            [employeeLevelId],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    },


    // ==================== GET ACTIVE EMPLOYEE LEVELS ====================

    getActiveEmployeeLevels: (callback) => {

        pool.query(

            `SELECT *
             FROM employee_level_master
             WHERE is_active = 1
             ORDER BY level_name ASC`,

            [],

            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);

            }

        );

    }

};