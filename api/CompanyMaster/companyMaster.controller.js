
const companyMasterService = require("./companyMaster.service");

const handleDatabaseError = (res, err, operation) => {
    console.error(`${operation} error:`, err);

    if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            success: 0,
            message: "Company already exists.",
        });
    }

    if (
        err.code === "ER_NO_REFERENCED_ROW_2" ||
        err.code === "ER_BAD_NULL_ERROR"
    ) {
        return res.status(400).json({
            success: 0,
            message: "Invalid or missing required data.",
        });
    }

    return res.status(500).json({
        success: 0,
        message: `Something went wrong while ${operation.toLowerCase()}.`,
        error:
            process.env.NODE_ENV === "development"
                ? err.message
                : undefined,
    });
};

const validateCompany = (body) => {
    console.log({
        body
    });

    const company_name = body.company_name?.trim();
    const location = body.company_location?.trim() || "";
    const email = body.company_email?.trim();
    const employee_prefix = body.employee_prefix?.trim().toUpperCase();
    const company_color = body.company_color?.trim() || "#1976d2";

    if (!company_name) {
        return "Company name is required.";
    }

    if (company_name.length > 200) {
        return "Company name cannot exceed 200 characters.";
    }

    if (!email) {
        return "Company email is required.";
    }

    if (email.length > 255) {
        return "Email cannot exceed 255 characters.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return "Please provide a valid email address.";
    }

    if (location.length > 200) {
        return "Location cannot exceed 200 characters.";
    }

    if (!employee_prefix) {
        return "Employee prefix is required.";
    }

    if (!/^[A-Z]{5}$/.test(employee_prefix)) {
        return "Employee prefix must contain exactly 5 letters.";
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(company_color)) {
        return "Please provide a valid hexadecimal company color.";
    }

    return null;
};

const buildCompanyData = (body) => ({
    company_name: body.company_name.trim(),
    location: body.company_location?.trim() || null,
    email: body.company_email.trim(),
    address: body.company_address?.trim() || null,
    employee_prefix: body.employee_prefix.trim().toUpperCase(),
    company_color: body.company_color?.trim() || "#1976d2",
    display_order: body.display_order,
    is_active: ["1", "true", "active"].includes(
        String(body.isActive ?? body.is_active ?? "1")
            .trim()
            .toLowerCase()
    )
        ? 1
        : 0,
});

const CompanyMasterController = {
    // CREATE COMPANY
    createCompany: (req, res) => {
        const validationError = validateCompany(req.body);

        if (validationError) {
            return res.status(400).json({
                success: 0,
                message: validationError,
            });
        }

        const companyData = buildCompanyData(req.body);

        companyData.company_image = req.file
            ? `/uploads/companies/${req.file.filename}`
            : null;

        companyMasterService.createCompany(
            companyData,
            (err, result) => {
                if (err) {
                    return handleDatabaseError(
                        res,
                        err,
                        "Creating company"
                    );
                }

                return res.status(201).json({
                    success: 1,
                    message: "Company created successfully.",
                    company_id: result.insertId,
                });
            }
        );
    },

    // GET ALL COMPANIES
    getAllCompanies: (req, res) => {
        companyMasterService.getAllCompanies((err, results) => {
            if (err) {
                return handleDatabaseError(
                    res,
                    err,
                    "Fetching companies"
                );
            }

            return res.status(200).json({
                success: 1,
                message: "Companies fetched successfully.",
                data: results || [],
            });
        });
    },

    // GET COMPANY BY ID
    getCompanyById: (req, res) => {
        const companyId = Number(req.params.companyId);

        if (!Number.isInteger(companyId) || companyId <= 0) {
            return res.status(400).json({
                success: 0,
                message: "Invalid company ID.",
            });
        }

        companyMasterService.getCompanyById(
            companyId,
            (err, result) => {
                if (err) {
                    return handleDatabaseError(
                        res,
                        err,
                        "Fetching company"
                    );
                }

                const company = Array.isArray(result)
                    ? result[0]
                    : result;

                if (!company) {
                    return res.status(404).json({
                        success: 0,
                        message: "Company not found.",
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Company fetched successfully.",
                    data: company,
                });
            }
        );
    },

    // UPDATE COMPANY
    updateCompany: (req, res) => {
        const companyId = Number(req.params.companyId);

        if (!Number.isInteger(companyId) || companyId <= 0) {
            return res.status(400).json({
                success: 0,
                message: "Invalid company ID.",
            });
        }

        const validationError = validateCompany(req.body);

        if (validationError) {
            return res.status(400).json({
                success: 0,
                message: validationError,
            });
        }

        const companyData = buildCompanyData(req.body);

        // Update image only when a new image is uploaded or removal is requested.
        if (req.file) {
            companyData.company_image =
                `/uploads/companies/${req.file.filename}`;
        } else if (
            String(req.body.remove_company_image) === "1"
        ) {
            companyData.company_image = null;
        }

        companyMasterService.updateCompany(
            companyId,
            companyData,
            (err, result) => {
                if (err) {
                    return handleDatabaseError(
                        res,
                        err,
                        "Updating company"
                    );
                }

                // affectedRows can be 0 when the submitted values are unchanged.
                // Check changedRows as well, but do not treat unchanged data as failure.
                if (result.affectedRows === 0) {
                    return companyMasterService.getCompanyById(
                        companyId,
                        (fetchErr, existingCompany) => {
                            if (fetchErr) {
                                return handleDatabaseError(
                                    res,
                                    fetchErr,
                                    "Verifying company"
                                );
                            }

                            const company = Array.isArray(existingCompany)
                                ? existingCompany[0]
                                : existingCompany;

                            if (!company) {
                                return res.status(404).json({
                                    success: 0,
                                    message: "Company not found.",
                                });
                            }

                            return res.status(200).json({
                                success: 1,
                                message: "Company updated successfully.",
                            });
                        }
                    );
                }

                return res.status(200).json({
                    success: 1,
                    message: "Company updated successfully.",
                });
            }
        );
    },

    // DELETE COMPANY
    deleteCompany: (req, res) => {
        const companyId = Number(req.params.companyId);

        if (!Number.isInteger(companyId) || companyId <= 0) {
            return res.status(400).json({
                success: 0,
                message: "Invalid company ID.",
            });
        }

        companyMasterService.deleteCompany(
            companyId,
            (err, result) => {
                if (err) {
                    return handleDatabaseError(
                        res,
                        err,
                        "Deleting company"
                    );
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: 0,
                        message: "Company not found.",
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Company deleted successfully.",
                });
            }
        );
    },

    // GET ACTIVE COMPANIES
    getActiveCompanies: (req, res) => {
        companyMasterService.getActiveCompanies((err, results) => {
            if (err) {
                return handleDatabaseError(
                    res,
                    err,
                    "Fetching active companies"
                );
            }

            return res.status(200).json({
                success: 1,
                message: "Active companies fetched successfully.",
                data: results || [],
            });
        });
    },
};

module.exports = CompanyMasterController;
