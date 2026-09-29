const pool = require("../../../dbconfig/dbconfig");

const MotorTaxService = {

    // CREATE
    createTax: (data, callback) => {

        const query = `
            INSERT INTO motor_tax_master (
                tax_code,
                tax_name,
                tax_type,
                tax_percentage,
                effective_from,
                effective_to,
                description,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.tax_code,
            data.tax_name,
            data.tax_type,
            data.tax_percentage,
            data.effective_from,
            data.effective_to || null,
            data.description || null,
            data.is_active
        ];

        pool.query(query, values, (error, result) => {

            if (error) {
                return callback(error);
            }

            callback(null, {
                tax_id: result.insertId,
                message: "Tax created successfully"
            });
        });
    },


    // GET ALL
    getAllTaxes: (callback) => {

        const query = `
            SELECT
                tax_id,
                tax_code,
                tax_name,
                tax_type,
                tax_percentage,
                effective_from,
                effective_to,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_tax_master
            ORDER BY effective_from DESC, tax_id DESC
        `;

        pool.query(query, (error, results) => {

            if (error) {
                return callback(error);
            }

            callback(null, results);
        });
    },


    // GET BY ID
    getTaxById: (tax_id, callback) => {

        const query = `
            SELECT
                tax_id,
                tax_code,
                tax_name,
                tax_type,
                tax_percentage,
                effective_from,
                effective_to,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_tax_master
            WHERE tax_id = ?
        `;

        pool.query(query, [tax_id], (error, results) => {

            if (error) {
                return callback(error);
            }

            callback(null, results[0] || null);
        });
    },


    // UPDATE
    updateTax: (tax_id, data, callback) => {

        const query = `
            UPDATE motor_tax_master
            SET
                tax_code = ?,
                tax_name = ?,
                tax_type = ?,
                tax_percentage = ?,
                effective_from = ?,
                effective_to = ?,
                description = ?,
                is_active = ?
            WHERE tax_id = ?
        `;

        const values = [
            data.tax_code,
            data.tax_name,
            data.tax_type,
            data.tax_percentage,
            data.effective_from,
            data.effective_to || null,
            data.description || null,
            data.is_active,
            tax_id
        ];

        pool.query(query, values, (error, result) => {

            if (error) {
                return callback(error);
            }

            callback(null, {
                affectedRows: result.affectedRows,
                message: "Tax updated successfully"
            });
        });
    },


    // DELETE / SOFT DELETE
    deleteTax: (tax_id, callback) => {

        const query = `
            UPDATE motor_tax_master
            SET is_active = 0
            WHERE tax_id = ?
        `;

        pool.query(query, [tax_id], (error, result) => {

            if (error) {
                return callback(error);
            }

            callback(null, {
                affectedRows: result.affectedRows,
                message: "Tax deleted successfully"
            });
        });
    },


    // GET ACTIVE
    getActiveTaxes: (callback) => {

        const query = `
            SELECT
                tax_id,
                tax_code,
                tax_name,
                tax_type,
                tax_percentage,
                effective_from,
                effective_to,
                description
            FROM motor_tax_master
            WHERE is_active = 1
            ORDER BY tax_name ASC, effective_from DESC, tax_id DESC
        `;

        pool.query(query, (error, results) => {

            if (error) {
                return callback(error);
            }

            callback(null, results);
        });
    }
};

module.exports = MotorTaxService;