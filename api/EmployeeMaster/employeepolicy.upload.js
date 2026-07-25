const fs = require("fs");
const multer = require("multer");

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
    }
});

const uploadPolicyDocumentMiddleware = multer({

    storage: policyStorage,

    limits: {
        fileSize: 25 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowed = [
            "image/jpeg",
            "image/png",
            "application/pdf"
        ];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG and PDF allowed."));
        }
    }

});

module.exports = {
    uploadPolicyDocumentMiddleware
};