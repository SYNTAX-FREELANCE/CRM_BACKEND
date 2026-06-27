// controllers/insuranceCompany.controller.js
const insuranceCompanyService = require("./insuranceCompany.service");

module.exports = {
    // ==================== CREATE INSURANCE COMPANY ====================
    createInsuranceCompany: (req, res) => {
        try {
            const { company_name, contact_number, email, is_active } = req.body;

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
                contact_number: contact_number ? contact_number.trim() : null,
                email: email ? email.trim() : null,
                is_active: is_active !== undefined ? is_active : 1
            };

            insuranceCompanyService.createInsuranceCompany(companyData, (err, result) => {
                if (err) {
                    console.error("createInsuranceCompany DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while creating insurance company"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Insurance company created successfully",
                    data: {
                        insurance_company_id: result.insertId,
                        company_name: companyData.company_name,
                        contact_number: companyData.contact_number,
                        email: companyData.email,
                        is_active: companyData.is_active
                    }
                });
            });
        } catch (error) {
            console.error("createInsuranceCompany controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET ALL INSURANCE COMPANIES ====================
    getAllInsuranceCompanies: (req, res) => {
        try {
            insuranceCompanyService.getAllInsuranceCompanies((err, companies) => {
                if (err) {
                    console.error("getAllInsuranceCompanies DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Insurance companies retrieved successfully",
                    data: companies
                });
            });
        } catch (error) {
            console.error("getAllInsuranceCompanies controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== GET INSURANCE COMPANY BY ID ====================
    getInsuranceCompanyById: (req, res) => {
        try {
            const { insuranceCompanyId } = req.params;

            insuranceCompanyService.getInsuranceCompanyById(insuranceCompanyId, (err, company) => {
                if (err) {
                    console.error("getInsuranceCompanyById DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                if (!company) {
                    return res.status(200).json({
                        success: 0,
                        message: "Insurance company not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Insurance company retrieved successfully",
                    data: company
                });
            });
        } catch (error) {
            console.error("getInsuranceCompanyById controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    },

    // ==================== UPDATE INSURANCE COMPANY ====================
    updateInsuranceCompany: (req, res) => {
        try {
            const { insuranceCompanyId } = req.params;
            const { company_name, contact_number, email, is_active } = req.body;

            // Validation
            if (!company_name || company_name.trim() === "") {
                return res.status(200).json({
                    success: 0,
                    message: "Company name is required"
                });
            }

            const companyData = {
                company_name: company_name.trim(),
                contact_number: contact_number ? contact_number.trim() : null,
                email: email ? email.trim() : null,
                is_active: is_active !== undefined ? is_active : 1
            };

            insuranceCompanyService.updateInsuranceCompany(insuranceCompanyId, companyData, (err, result) => {
                if (err) {
                    console.error("updateInsuranceCompany DB error:", err);
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while updating insurance company"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Insurance company updated successfully",
                    data: { insurance_company_id: insuranceCompanyId }
                });
            });
        } catch (error) {
            console.error("updateInsuranceCompany controller error:", error);
            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });
        }
    }
};
