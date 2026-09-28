const pool = require("../../../dbconfig/dbconfig");

const MotorProductService = {

    // CREATE
    createProduct: (data, callback) => {

        const query = `
            INSERT INTO motor_product_master
            (
                product_code,
                product_name,
                description
            )
            VALUES (?, ?, ?)
        `;

        const values = [
            data.product_code,
            data.product_name,
            data.description ?? null
        ];

        pool.query(query, values, callback);
    },


    // GET ALL
    getAllProducts: (callback) => {

        const query = `
            SELECT
                product_id,
                product_code,
                product_name,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_product_master
            ORDER BY product_name ASC, product_id ASC
        `;

        pool.query(query, callback);
    },


    // GET BY ID
    getProductById: (productId, callback) => {

        const query = `
            SELECT
                product_id,
                product_code,
                product_name,
                description,
                is_active,
                created_at,
                updated_at
            FROM motor_product_master
            WHERE product_id = ?
        `;

        pool.query(query, [productId], callback);
    },


    // UPDATE
    updateProduct: (productId, data, callback) => {

        const query = `
            UPDATE motor_product_master
            SET
                product_code = ?,
                product_name = ?,
                description = ?
            WHERE product_id = ?
        `;

        const values = [
            data.product_code,
            data.product_name,
            data.description ?? null,
            productId
        ];

        pool.query(query, values, callback);
    },


    // DELETE
    deleteProduct: (productId, callback) => {

        const query = `
            UPDATE motor_product_master
            SET is_active = 0
            WHERE product_id = ?
        `;

        pool.query(query, [productId], callback);
    },


    // GET ACTIVE
    getActiveProducts: (callback) => {

        const query = `
            SELECT
                product_id,
                product_code,
                product_name,
                description,
                is_active
            FROM motor_product_master
            WHERE is_active = 1
            ORDER BY product_name ASC, product_id ASC
        `;

        pool.query(query, callback);
    }
};

module.exports = MotorProductService;