const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection((err, conn) => {
  if (err) {
    console.error(" MySQL connection error:", err.message);
    process.exit(1);
  }
  console.log(` MySQL Connected: ${conn.config.host}`);

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS user_rights (
      user_rights_slno INT NOT NULL AUTO_INCREMENT,
      role_slno INT DEFAULT '0',
      module_slno INT DEFAULT '0',
      menu_slno INT DEFAULT '0',
      Active_status INT DEFAULT '0',
      create_user INT DEFAULT '0',
      create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      edit_user INT DEFAULT '0',
      edit_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (user_rights_slno)
    );
  `;

  conn.query(createTableQuery, (tableErr) => {
    if (tableErr) {
      console.error(" Error creating user_rights table:", tableErr.message);
    } else {
      console.log(" Verified/Created user_rights table successfully");
    }
    conn.release();
  });
});

module.exports = pool;