// api/CustomerMaster/customermaster.upload.js

const path = require("path");
const createUpload = require("../../middleware/multer");

// Customer Upload Directory
const CUSTOMER_UPLOAD_DIR = path.join(
  process.env.UPLOADS_PATH,
  "customers"
);

// Create upload instance allowing Excel and PDF
const uploadCustomer = createUpload(
  CUSTOMER_UPLOAD_DIR,
  [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "application/pdf", // .pdf
  ],
  1
);

module.exports = {
  uploadCustomer,
  CUSTOMER_UPLOAD_DIR,
};