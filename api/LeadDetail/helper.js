const pool = require("../../dbconfig/dbconfig");

const query = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const getCustomer = (connection, customerId, callback) => {
    const sql = `
        SELECT *
        FROM customers
        WHERE customer_id=?
    `;

    connection.query(sql, [customerId], callback);
};

const getVehicles = (connection, customerId, callback) => {

    const sql = `
        SELECT *
        FROM vehicles
        WHERE customer_id=?
        ORDER BY registration_number
    `;

    connection.query(sql, [customerId], callback);

};


const getLeads = (connection, customerId, callback) => {

    const sql = `

    SELECT

        l.*,
        ls.status_name,
        u.name assigned_to_name

    FROM leads l

    LEFT JOIN lead_status_master ls
    ON ls.status_id=l.status_id

    LEFT JOIN users_master u
    ON u.user_id=l.assigned_to

    WHERE l.customer_id=?

    ORDER BY l.created_at DESC

    `;

    connection.query(sql, [customerId], callback);

};


const getFollowups = (connection, customerId, callback) => {

    const sql = `

    SELECT
        lf.*,
        ls.status_name

    FROM lead_followups lf

    LEFT JOIN lead_status_master ls
    ON ls.status_id=lf.status_id

    WHERE lf.lead_id IN
    (
        SELECT lead_id
        FROM leads
        WHERE customer_id=?
    )

    ORDER BY created_at DESC

    `;

    connection.query(sql, [customerId], callback);

};


const getStatusHistory = (connection, customerId, callback) => {

    const sql = `

    SELECT

        h.*,

        s1.status_name old_status,

        s2.status_name new_status

    FROM lead_status_history h

    LEFT JOIN lead_status_master s1
    ON s1.status_id=h.old_status_id

    LEFT JOIN lead_status_master s2
    ON s2.status_id=h.new_status_id

    WHERE h.lead_id IN
    (
        SELECT lead_id
        FROM leads
        WHERE customer_id=?
    )

    ORDER BY changed_at DESC

    `;

    connection.query(sql, [customerId], callback);

}

module.exports = {
    getStatusHistory,
    getFollowups,
    getLeads,
    getVehicles,
    getCustomer
}