// services/insuranceCompany.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
    // ==================== CREATE INSURANCE COMPANY ====================
    createInsuranceCompany: (companyData, callback) => {
        pool.query(
            `INSERT INTO insurance_companies 
            (company_name, contact_number, email, is_active)
            VALUES (?, ?, ?, ?)`,
            [
                companyData.company_name,
                companyData.contact_number,
                companyData.email,
                companyData.is_active
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET ALL INSURANCE COMPANIES ====================
    getAllInsuranceCompanies: (callback) => {
        pool.query(
            `SELECT insurance_company_id, company_name, contact_number, email, is_active 
            FROM insurance_companies 
            ORDER BY insurance_company_id DESC`,
            [],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );
    },

    // ==================== GET INSURANCE COMPANY BY ID ====================
    getInsuranceCompanyById: (insuranceCompanyId, callback) => {
        pool.query(
            `SELECT insurance_company_id, company_name, contact_number, email, is_active 
            FROM insurance_companies 
            WHERE insurance_company_id = ?`,
            [insuranceCompanyId],
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

    // ==================== UPDATE INSURANCE COMPANY ====================
    updateInsuranceCompany: (insuranceCompanyId, companyData, callback) => {
        pool.query(
            `UPDATE insurance_companies 
            SET company_name = ?, contact_number = ?, email = ?, is_active = ? 
            WHERE insurance_company_id = ?`,
            [
                companyData.company_name,
                companyData.contact_number,
                companyData.email,
                companyData.is_active,
                insuranceCompanyId
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
