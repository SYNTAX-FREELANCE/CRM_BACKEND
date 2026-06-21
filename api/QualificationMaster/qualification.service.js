const pool = require("../../dbconfig/dbconfig");

module.exports = {
  createQualification: (data, callback) => {
    pool.query(
      `INSERT INTO qualifications
            (
                qualification_name,
                alias,
                is_active,
                created_at
            )
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [data.qualification_name, data.alias, data.is_active],
      callback,
    );
  },

  getAllQualifications: (callback) => {
    pool.query(
      `SELECT *
             FROM qualifications
             ORDER BY created_at DESC`,
      [],
      callback,
    );
  },

  getQualificationById: (qualificationId, callback) => {
    pool.query(
      `SELECT *
             FROM qualifications
             WHERE qualification_id = ?`,
      [qualificationId],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        callback(null, result.length ? result[0] : null);
      },
    );
  },

  updateQualification: (qualificationId, data, callback) => {
    pool.query(
      `UPDATE qualifications
             SET
                qualification_name = ?,
                alias = ?,
                is_active = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE qualification_id = ?`,
      [data.qualification_name, data.alias, data.is_active, qualificationId],
      callback,
    );
  },

  deleteQualification: (qualificationId, callback) => {
    pool.query(
      `UPDATE qualifications
             SET
                is_active = 0,
                updated_at = CURRENT_TIMESTAMP
             WHERE qualification_id = ?`,
      [qualificationId],
      callback,
    );
  },

  getActiveQualifications: (callback) => {
    pool.query(
      `SELECT *
             FROM qualifications
             WHERE is_active = 1
             ORDER BY qualification_name ASC`,
      [],
      callback,
    );
  },
};
