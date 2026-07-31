const fs = require("fs");
const multer = require("multer");
const path = require("path");
const pool = require("../../dbconfig/dbconfig");

const leadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { lead_id, file_type } = req.query;

        const folder = file_type || "OTHER";

        const dir = `C:/CRM/LeadDocuments/${lead_id}/${folder}`;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const uploadLeadDocumentMiddleware = multer({
    storage: leadStorage,

    limits: {
        fileSize: 25 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const allowed = [
            "image/jpeg",
            "image/png",
            "application/pdf",
        ];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG and PDF allowed."));
        }
    },
});

const getLeadDocumentsService = (lead_id, callback) => {
    try {
        pool.query(
            `SELECT
            lead_file_id,
            file_type,
            file_name,
            file_path,
            mime_type
        FROM lead_files
        WHERE lead_id = ?
        AND is_active = 1
        ORDER BY file_type, lead_file_id`,
            [lead_id],
            (err, results) => {
                if (err) {
                    return callback(err, null);
                }

                const response = {
                    RC: [],
                    QUOTATION: [],
                    OTHER: [],
                };

                if (!results || results.length === 0) {
                    return callback(null, response);
                }

                results.forEach((file) => {
                    const folder = file.file_type || "OTHER";

                    if (!response[folder]) {
                        response[folder] = [];
                    }

                    response[folder].push({
                        file_id: file.lead_file_id,
                        name: file.file_name,
                        filename: file.file_name,
                        mime_type: file.mime_type,
                        url: `/lead-documents/${lead_id}/${folder}/${encodeURIComponent(
                            file.file_name
                        )}`,
                    });
                });

                return callback(null, response);
            }
        );
    } catch (err) {
        return callback(err, null);
    }
};

const deleteLeadDocumentService = (file_id, callback) => {
    try {
        pool.query(
            `SELECT file_path
       FROM lead_files
       WHERE lead_file_id = ?
       AND is_active = 1`,
            [file_id],
            (err, result) => {
                if (err) {
                    return callback(err);
                }

                if (result.length === 0) {
                    return callback(null, {
                        affectedRows: 0,
                    });
                }

                const filePath = result[0].file_path;

                // Delete physical file
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }

                // Soft delete
                pool.query(
                    `UPDATE lead_files
           SET is_active = 0
           WHERE lead_file_id = ?`,
                    [file_id],
                    (err, updateResult) => {
                        if (err) {
                            return callback(err);
                        }

                        return callback(null, updateResult);
                    }
                );
            }
        );
    } catch (err) {
        return callback(err);
    }
};

module.exports = {
    uploadLeadDocumentMiddleware,
    getLeadDocumentsService,
    deleteLeadDocumentService,
};