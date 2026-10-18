const path = require("path");
const createUpload = require("../../middleware/multer");

if (!process.env.UPLOADS_PATH) {
    throw new Error(
        "UPLOAD_ROOT is not configured in environment variables"
    );
}

const uploadPath = path.join(
    process.env.UPLOADS_PATH,
    "companies"
);

const companyUpload = createUpload(
    uploadPath,
    [
        "image/jpeg",
        "image/png",
        "image/webp"
    ],
    1
);

module.exports = companyUpload;