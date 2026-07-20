// controllers/companyMaster.controller.js
const companyMasterService = require("./companyMaster.service");

module.exports = {
    // ==================== CREATE COMPANY ====================
    createCompany: (req, res) => {
        try {
            const { company_name, company_address, company_location, company_email, isActive, employee_prefix } = req.body;

            // Validation
            if (!company_name || company_name.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Company name is required"
                });
            }

            // Prepare company data
            const companyData = {
                company_name: company_name.trim(),
                company_address: company_address || null,
                company_location: company_location || null,
                company_email: company_email || null,
                employee_prefix: employee_prefix || null,
                is_active: isActive
            };

            // Step 1: Create company in company_master table
            companyMasterService.createCompany(companyData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while creating company"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Company created successfully"
                });
            });
        } catch (error) {
            console.error("createCompany error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ALL COMPANIES ====================
    getAllCompanies: (req, res) => {
        try {
            companyMasterService.getAllCompanies((err, companies) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Companies retrieved successfully",
                    data: companies
                });
            });
        } catch (error) {
            console.error("getAllCompanies error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET COMPANY BY ID ====================
    getCompanyById: (req, res) => {
        try {
            const { companyId } = req.params;

            companyMasterService.getCompanyById(companyId, (err, company) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                if (!company) {
                    return res.status(404).json({
                        success: 0,
                        message: "Company not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Company retrieved successfully",
                    data: company
                });
            });
        } catch (error) {
            console.error("getCompanyById error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== UPDATE COMPANY ====================
    updateCompany: (req, res) => {
        try {
            const { companyId } = req.params;

            const { company_name, company_address, company_email, company_location, employee_prefix, isActive } = req.body;

            // Validation
            if (!company_name || company_name.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Company name is required"
                });
            }

            const companyData = {
                company_name: company_name.trim(),
                company_address: company_address || null,
                company_location: company_location || null,
                company_email: company_email || null,
                employee_prefix: employee_prefix || null,
                is_active: isActive
            };

            companyMasterService.updateCompany(companyId, companyData, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while updating company"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Company updated successfully",
                    data: { company_id: companyId }
                });
            });
        } catch (error) {
            console.error("updateCompany error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== DELETE COMPANY (SOFT DELETE) ====================
    deleteCompany: (req, res) => {
        try {
            const { companyId } = req.params;

            companyMasterService.deleteCompany(companyId, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while deleting company"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Company deleted successfully"
                });
            });
        } catch (error) {
            console.error("deleteCompany error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ACTIVE COMPANIES ONLY ====================
    getActiveCompanies: (req, res) => {
        try {
            companyMasterService.getActiveCompanies((err, companies) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Active companies retrieved successfully",
                    data: companies
                });
            });
        } catch (error) {
            console.error("getActiveCompanies error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    }
};