// api/CustomerMaster/customermaster.upload.js
const createUpload = require("../../Middleware/multer");

// C Drive Upload Paths for Customers
const CUSTOMER_UPLOAD_DIR = "C:/uploads/customers";

// Create upload instance allowing Excel and PDF
const uploadCustomer = createUpload(CUSTOMER_UPLOAD_DIR, [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel",                                         // .xls
  "application/pdf"                                                   // .pdf
], 1); // Allow 1 file at a time

module.exports = {
  uploadCustomer,
  CUSTOMER_UPLOAD_DIR
};
