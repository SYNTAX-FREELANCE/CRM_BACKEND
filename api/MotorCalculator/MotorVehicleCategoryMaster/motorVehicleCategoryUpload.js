const path = require("path");
const createUpload = require("../../../middleware/multer");

if (!process.env.UPLOADS_PATH) {
    throw new Error(
        "UPLOAD_ROOT is not configured in environment variables"
    );
}

const uploadPath = path.join(
    process.env.UPLOADS_PATH,
    "vehicle-categories"
);

const motorVehicleCategoryUpload = createUpload(
    uploadPath,
    [
        "image/jpeg",
        "image/png",
        "image/webp"
    ],
    1
);

module.exports = motorVehicleCategoryUpload;