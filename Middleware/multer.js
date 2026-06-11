
// MiddleWare/multer.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/**
 * createUpload(folderPath, allowedTypes, maxCount)
 * @param {string} folderPath - Path where files should be stored
 * @param {Array} allowedTypes - MIME types allowed
 * @param {number} maxCount - optional, not used here but can limit files
 * @returns multer instance
 */
const createUpload = (folderPath, allowedTypes = [], maxCount = 10) => {
  // Ensure directory exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, folderPath),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.length === 0 || allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  };

  return multer({ storage, fileFilter });
};

module.exports = createUpload;
