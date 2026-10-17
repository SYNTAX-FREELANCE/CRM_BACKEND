
const pool = require("../../dbconfig/dbconfig");

module.exports = {
    // CREATE INSURANCE COMPANY
    createInsuranceCompany: (companyData, callback) => {
        const sql = `
            INSERT INTO insurance_companies (
                company_name,
                contact_number,
                email,
                display_order,
                company_color,
                company_image,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            companyData.company_name,
            companyData.contact_number,
            companyData.email,
            companyData.display_order,
            companyData.company_color,
            companyData.company_image,
            companyData.is_active,
        ];

        pool.query(sql, values, (err, result) => {
            if (err) return callback(err, null);
            return callback(null, result);
        });
    },

    // GET ALL INSURANCE COMPANIES
    getAllInsuranceCompanies: (callback) => {
        const sql = `
            SELECT
                insurance_company_id,
                company_name,
                contact_number,
                email,
                display_order,
                company_color,
                company_image,
                is_active
            FROM insurance_companies
            ORDER BY display_order ASC, insurance_company_id DESC
        `;

        pool.query(sql, (err, result) => {
            if (err) return callback(err, null);
            return callback(null, result);
        });
    },

    // GET INSURANCE COMPANY BY ID
    getInsuranceCompanyById: (insuranceCompanyId, callback) => {
        const sql = `
            SELECT
                insurance_company_id,
                company_name,
                contact_number,
                email,
                display_order,
                company_color,
                company_image,
                is_active
            FROM insurance_companies
            WHERE insurance_company_id = ?
        `;

        pool.query(sql, [insuranceCompanyId], (err, result) => {
            if (err) return callback(err, null);

            if (!result || result.length === 0) {
                return callback(null, null);
            }

            return callback(null, result[0]);
        });
    },

    // UPDATE INSURANCE COMPANY
    updateInsuranceCompany: (insuranceCompanyId, companyData, callback) => {
        const sql = `
            UPDATE insurance_companies
            SET
                company_name = ?,
                contact_number = ?,
                email = ?,
                display_order = ?,
                company_color = ?,
                company_image = CASE
                    WHEN ? = 1 THEN NULL
                    WHEN ? IS NOT NULL THEN ?
                    ELSE company_image
                END,
                is_active = ?
            WHERE insurance_company_id = ?
        `;

        const newImage = companyData.company_image || null;

        const values = [
            companyData.company_name,
            companyData.contact_number,
            companyData.email,
            companyData.display_order,
            companyData.company_color,
            companyData.remove_company_image ? 1 : 0,
            newImage,
            newImage,
            companyData.is_active,
            insuranceCompanyId,
        ];

        pool.query(sql, values, (err, result) => {
            if (err) return callback(err, null);
            return callback(null, result);
        });
    },
};
