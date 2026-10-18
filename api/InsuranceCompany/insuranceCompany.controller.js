
const insuranceCompanyService = require("./insuranceCompany.service");

const getActiveValue = (body) => {
    const value = body.isActive ?? body.is_active ?? "1";

    return ["1", "true", "active"].includes(
        String(value).trim().toLowerCase()
    ) ? 1 : 0;
};

const buildCompanyData = (body) => ({
    company_name: String(body.company_name || "").trim(),
    contact_number: String(body.contact_number || "").trim() || null,
    email: String(body.email || "").trim() || null,
    display_order:
        Number.isInteger(Number(body.display_order)) &&
            Number(body.display_order) >= 0
            ? Number(body.display_order)
            : 0,
    company_color: /^#[0-9a-fA-F]{6}$/.test(
        String(body.company_color || "")
    )
        ? String(body.company_color).trim()
        : "#1976d2",
    is_active: getActiveValue(body),
});

const validateCompany = (data) => {
    if (!data.company_name) {
        return "Company name is required.";
    }

    if (data.company_name.length > 200) {
        return "Company name cannot exceed 200 characters.";
    }

    if (
        data.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
        return "Please provide a valid email address.";
    }

    if (data.contact_number && data.contact_number.length > 30) {
        return "Contact number cannot exceed 30 characters.";
    }

    if (data.email && data.email.length > 255) {
        return "Email cannot exceed 255 characters.";
    }

    return null;
};

const handleDatabaseError = (res, err, operation) => {
    console.error(`${operation} error:`, err);

    if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            success: 0,
            message: "Insurance company already exists.",
        });
    }

    return res.status(500).json({
        success: 0,
        message: `Something went wrong while ${operation.toLowerCase()}.`,
        ...(process.env.NODE_ENV === "development"
            ? { error: err.message }
            : {}),
    });
};

const getImagePath = (req) =>
    req.file ? `/uploads/insurance-uploads/${req.file.filename}` : null;

const InsuranceCompanyController = {
    // CREATE INSURANCE COMPANY
    createInsuranceCompany: (req, res) => {
        const companyData = buildCompanyData(req.body);
        const validationError = validateCompany(companyData);

        if (validationError) {
            return res.status(400).json({
                success: 0,
                message: validationError,
            });
        }

        companyData.company_image = getImagePath(req);




        insuranceCompanyService.createInsuranceCompany(
            companyData,
            (err, result) => {
                if (err) {
                    return handleDatabaseError(
                        res, err, "Creating insurance company"
                    );
                }

                return res.status(201).json({
                    success: 1,
                    message: "Insurance company created successfully.",
                    data: {
                        insurance_company_id: result.insertId,
                        ...companyData,
                    },
                });
            }
        );
    },

    // GET ALL INSURANCE COMPANIES
    getAllInsuranceCompanies: (req, res) => {
        insuranceCompanyService.getAllInsuranceCompanies(
            (err, results) => {
                if (err) {
                    return handleDatabaseError(
                        res, err, "Fetching insurance companies"
                    );
                }

                return res.status(200).json({
                    success: 1,
                    message: "Insurance companies fetched successfully.",
                    data: results || [],
                });
            }
        );
    },

    // GET INSURANCE COMPANY BY ID
    getInsuranceCompanyById: (req, res) => {
        const companyId = Number(req.params.insuranceCompanyId);

        if (!Number.isInteger(companyId) || companyId <= 0) {
            return res.status(400).json({
                success: 0,
                message: "Invalid insurance company ID.",
            });
        }

        insuranceCompanyService.getInsuranceCompanyById(
            companyId,
            (err, company) => {
                if (err) {
                    return handleDatabaseError(
                        res, err, "Fetching insurance company"
                    );
                }

                if (!company) {
                    return res.status(404).json({
                        success: 0,
                        message: "Insurance company not found.",
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Insurance company fetched successfully.",
                    data: company,
                });
            }
        );
    },

    // UPDATE INSURANCE COMPANY
    updateInsuranceCompany: (req, res) => {



        const companyId = Number(req.params.insuranceCompanyId);

        if (!Number.isInteger(companyId) || companyId <= 0) {
            return res.status(400).json({
                success: 0,
                message: "Invalid insurance company ID.",
            });
        }

        const companyData = buildCompanyData(req.body);
        const validationError = validateCompany(companyData);

        if (validationError) {
            return res.status(400).json({
                success: 0,
                message: validationError,
            });
        }

        // Only set company_image when uploading a new file.
        // Otherwise, the service preserves the existing image.
        if (req.file) {
            companyData.company_image = getImagePath(req);
        } else {
            companyData.company_image = null;
        }

        companyData.remove_company_image =
            !req.file &&
            String(req.body.remove_company_image) === "1";



        insuranceCompanyService.updateInsuranceCompany(
            companyId,
            companyData,
            (err, result) => {
                if (err) {
                    return handleDatabaseError(
                        res, err, "Updating insurance company"
                    );
                }

                if (result.affectedRows === 0) {
                    // A no-change update can also return zero affected rows.
                    return insuranceCompanyService.getInsuranceCompanyById(
                        companyId,
                        (fetchErr, existingCompany) => {
                            if (fetchErr) {
                                return handleDatabaseError(
                                    res, fetchErr,
                                    "Verifying insurance company"
                                );
                            }

                            if (!existingCompany) {
                                return res.status(404).json({
                                    success: 0,
                                    message: "Insurance company not found.",
                                });
                            }

                            return res.status(200).json({
                                success: 1,
                                message: "Insurance company updated successfully.",
                                data: existingCompany,
                            });
                        }
                    );
                }

                // Fetch the actual saved record, including its image path.
                insuranceCompanyService.getInsuranceCompanyById(
                    companyId,
                    (fetchErr, updatedCompany) => {
                        if (fetchErr) {
                            return handleDatabaseError(
                                res, fetchErr,
                                "Fetching updated insurance company"
                            );
                        }

                        return res.status(200).json({
                            success: 1,
                            message: "Insurance company updated successfully.",
                            data: updatedCompany,
                        });
                    }
                );
            }
        );
    },
};

module.exports = InsuranceCompanyController;
