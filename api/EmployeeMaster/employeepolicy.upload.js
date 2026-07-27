const fs = require("fs");
const multer = require("multer");
const path = require("path");
const pool = require("../../dbconfig/dbconfig");

const policyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { policy_id, file_type } = req.query;

    const folder = file_type || "others";

    const dir = `C:/CRM/PolicyDocuments/${policy_id}/${folder}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadPolicyDocumentMiddleware = multer({
  storage: policyStorage,

  limits: {
    fileSize: 25 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and PDF allowed."));
    }
  },
});

const getPolicyDocumentsService = (policy_id, callback) => {
  try {
    pool.query(
      `SELECT
                policy_file_id,
                file_type,
                file_name,
                file_path,
                mime_type
            FROM policy_files
            WHERE policy_id = ?
            AND is_active = 1
            ORDER BY file_type, policy_file_id`,
      [policy_id],
      (err, results) => {
        if (err) {
          return callback(err, null);
        }

        const response = {
          RC: [],
          PREVIOUS_POLICY: [],
          KYC: [],
          VEHICLE_IMAGE: [],
          OTHERS: [],
        };

        if (!results || results.length === 0) {
          return callback(null, response);
        }

        results.forEach((file) => {
          const folder = file.file_type || "OTHERS";

          if (!response[folder]) {
            response[folder] = [];
          }

          response[folder].push({
            file_id: file.policy_file_id,
            name: file.file_name,
            filename: file.file_name,
            mime_type: file.mime_type,
            url: `/policy-documents/${policy_id}/${folder}/${encodeURIComponent(file.file_name)}`,
          });
        });
        return callback(null, response);
      },
    );
  } catch (err) {
    return callback(err, null);
  }
};

const deletePolicyDocumentService = (file_id, callback) => {
    try {
      pool.query(
        `SELECT file_path
             FROM policy_files
             WHERE policy_file_id=? AND is_active=1`,
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

          // Update status
          pool.query(
            `UPDATE policy_files
                     SET is_active=0
                     WHERE policy_file_id=?`,
            [file_id],
            (err, updateResult) => {
              if (err) {
                return callback(err);
              }

              return callback(null, updateResult);
            },
          );
        },
      );
    } catch (err) {
      return callback(err);
    }
  };

module.exports = {
  uploadPolicyDocumentMiddleware,
  getPolicyDocumentsService,
  deletePolicyDocumentService
};
