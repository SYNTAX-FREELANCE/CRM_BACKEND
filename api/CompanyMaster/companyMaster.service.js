// services/companyMaster.service.js
const pool = require("../../dbconfig/dbconfig");

module.exports = {
  // ==================== CREATE COMPANY ====================
  createCompany: (companyData, callback) => {
    pool.query(
      `INSERT INTO companies 
            (company_name, location, email, address, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        companyData.company_name,
        companyData.company_location,
        companyData.company_email,
        companyData.company_address,
        companyData.is_active,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== GET ALL COMPANIES ====================
  getAllCompanies: (callback) => {
    pool.query(
      `SELECT * FROM companies 
            ORDER BY created_at DESC`,
      [],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== GET COMPANY BY ID ====================
  getCompanyById: (companyId, callback) => {
    pool.query(
      `SELECT * FROM companies 
            WHERE company_id = ?`,
      [companyId],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        if (!result || result.length === 0) {
          return callback(null, null);
        }

        callback(null, result[0]);
      },
    );
  },

  // ==================== UPDATE COMPANY ====================
  updateCompany: (companyId, companyData, callback) => {
    pool.query(
      `UPDATE companies 
            SET company_name = ?, location = ?, email = ?, 
                address = ?, is_active = ?, 
                updated_at = CURRENT_TIMESTAMP
            WHERE company_id = ?`,
      [
        companyData.company_name,
        companyData.company_location,
        companyData.company_email,
        companyData.company_address,
        companyData.is_active,
        companyId,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== DELETE COMPANY (SOFT DELETE) ====================
  deleteCompany: (companyId, callback) => {
    pool.query(
      `UPDATE companies 
            SET is_active = 0, updated_at = CURRENT_TIMESTAMP 
            WHERE company_id = ?`,
      [companyId],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },

  // ==================== GET ACTIVE COMPANIES ONLY ====================
  getActiveCompanies: (callback) => {
    pool.query(
      `SELECT * FROM companies 
            WHERE is_active = 1
            ORDER BY company_name ASC`,
      [],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      },
    );
  },
};
