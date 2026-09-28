const pool = require("../../dbconfig/dbconfig");


const PolicyClaimService = {


    // ======================================================
    // CREATE CLAIM
    // ======================================================

    createPolicyClaim: (data, callback) => {

        pool.getConnection((connectionErr, connection) => {

            if (connectionErr) {
                return callback(connectionErr, null);
            }


            connection.beginTransaction((transactionErr) => {

                if (transactionErr) {
                    connection.release();
                    return callback(transactionErr, null);
                }


                // --------------------------------------------------
                // CHECK POLICY
                // --------------------------------------------------

                const policyQuery = `
                    SELECT
                        policy_id
                    FROM policies
                    WHERE policy_id = ?
                    LIMIT 1
                `;


                connection.query(
                    policyQuery,
                    [data.policy_id],
                    (policyErr, policyResult) => {

                        if (policyErr) {

                            return connection.rollback(() => {
                                connection.release();
                                callback(policyErr, null);
                            });
                        }


                        if (policyResult.length === 0) {

                            const error = new Error(
                                "Policy not found"
                            );

                            error.code = "POLICY_NOT_FOUND";


                            return connection.rollback(() => {
                                connection.release();
                                callback(error, null);
                            });
                        }


                        // --------------------------------------------------
                        // INSERT CLAIM
                        // --------------------------------------------------

                        const insertQuery = `
                            INSERT INTO policy_claims
                            (
                                policy_id,
                                claim_number,

                                claim_date,
                                claim_status,

                                accident_date,
                                accident_time,
                                accident_place,
                                accident_description,

                                driver_name,
                                driver_address,
                                driver_age,
                                driver_relationship,
                                driving_license_no,

                                inspection_location,
                                estimated_repair_cost,

                                other_insurance_policy_no,

                                remarks,
                                is_active,

                                created_by
                            )
                            VALUES
                            (
                                ?,
                                NULL,

                                CURDATE(),
                                'DRAFT',

                                ?,
                                ?,
                                ?,
                                ?,

                                ?,
                                ?,
                                ?,
                                ?,
                                ?,

                                ?,
                                ?,

                                ?,

                                ?,
                                ?,

                                ?
                            )
                        `;


                        const values = [

                            data.policy_id,

                            data.accident_date,
                            data.accident_time,
                            data.accident_place,
                            data.accident_description,

                            data.driver_name,
                            data.driver_address,
                            data.driver_age,
                            data.driver_relationship,
                            data.driving_license_no,

                            data.inspection_location,
                            data.estimated_repair_cost,

                            data.other_insurance_policy_no,

                            data.remarks,
                            data.is_active,

                            data.created_by
                        ];


                        connection.query(
                            insertQuery,
                            values,
                            (insertErr, insertResult) => {

                                if (insertErr) {

                                    return connection.rollback(() => {
                                        connection.release();
                                        callback(insertErr, null);
                                    });
                                }


                                const claimId =
                                    insertResult.insertId;


                                // --------------------------------------------------
                                // GENERATE CLAIM NUMBER
                                // --------------------------------------------------

                                const year =
                                    new Date().getFullYear();


                                const claimNumber =
                                    `CLM/${year}/${String(claimId).padStart(6, "0")}`;


                                const updateClaimNumberQuery = `
                                    UPDATE policy_claims
                                    SET claim_number = ?
                                    WHERE claim_id = ?
                                `;


                                connection.query(
                                    updateClaimNumberQuery,
                                    [
                                        claimNumber,
                                        claimId
                                    ],
                                    (numberErr) => {

                                        if (numberErr) {

                                            return connection.rollback(() => {
                                                connection.release();
                                                callback(numberErr, null);
                                            });
                                        }


                                        // --------------------------------------------------
                                        // COMMIT
                                        // --------------------------------------------------

                                        connection.commit(
                                            (commitErr) => {

                                                if (commitErr) {

                                                    return connection.rollback(() => {
                                                        connection.release();
                                                        callback(commitErr, null);
                                                    });
                                                }


                                                connection.release();


                                                callback(
                                                    null,
                                                    {
                                                        claim_id: claimId,
                                                        claim_number: claimNumber,
                                                        policy_id: data.policy_id,
                                                        claim_status: "DRAFT"
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            });
        });
    },


    // ======================================================
    // GET ALL CLAIMS
    // ======================================================

    getAllPolicyClaims: (callback) => {

        const query = `
            SELECT

                pc.claim_id,
                pc.claim_number,

                pc.policy_id,

                p.policy_number,
                p.start_date AS policy_start_date,
                p.expiry_date AS policy_expiry_date,

                p.customer_id,
                c.customer_name,
                c.mobile_number_1,

                p.vehicle_id,
                v.registration_number,

                p.insurance_company_id,
                ic.company_name AS insurance_company_name,

                pc.claim_date,
                pc.claim_status,

                pc.accident_date,
                pc.accident_time,
                pc.accident_place,
                pc.accident_description,

                pc.driver_name,
                pc.driver_address,
                pc.driver_age,
                pc.driver_relationship,
                pc.driving_license_no,

                pc.inspection_location,
                pc.estimated_repair_cost,

                pc.other_insurance_policy_no,

                pc.remarks,
                pc.is_active,

                pc.created_by,
                pc.created_at,
                pc.updated_by,
                pc.updated_at

            FROM policy_claims pc

            INNER JOIN policies p
                ON p.policy_id = pc.policy_id

            INNER JOIN customers c
                ON c.customer_id = p.customer_id

            INNER JOIN vehicles v
                ON v.vehicle_id = p.vehicle_id

            INNER JOIN insurance_companies ic
                ON ic.insurance_company_id =
                   p.insurance_company_id

            WHERE pc.is_active = 1

            ORDER BY pc.claim_id DESC
        `;


        pool.query(query, (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);
        });
    },


    // ======================================================
    // GET CLAIM BY ID
    // ======================================================

    getPolicyClaimById: (claimId, callback) => {

        const query = `
            SELECT

                pc.claim_id,
                pc.claim_number,

                pc.policy_id,

                p.policy_number,
                p.start_date AS policy_start_date,
                p.expiry_date AS policy_expiry_date,

                p.customer_id,
                c.customer_name,
                c.mobile_number_1,

                p.vehicle_id,
                v.registration_number,

                p.insurance_company_id,
                ic.company_name AS insurance_company_name,

                pc.claim_date,
                pc.claim_status,

                pc.accident_date,
                pc.accident_time,
                pc.accident_place,
                pc.accident_description,

                pc.driver_name,
                pc.driver_address,
                pc.driver_age,
                pc.driver_relationship,
                pc.driving_license_no,

                pc.inspection_location,
                pc.estimated_repair_cost,

                pc.other_insurance_policy_no,

                pc.remarks,
                pc.is_active,

                pc.created_by,
                pc.created_at,
                pc.updated_by,
                pc.updated_at

            FROM policy_claims pc

            INNER JOIN policies p
                ON p.policy_id = pc.policy_id

            INNER JOIN customers c
                ON c.customer_id = p.customer_id

            INNER JOIN vehicles v
                ON v.vehicle_id = p.vehicle_id

            INNER JOIN insurance_companies ic
                ON ic.insurance_company_id =
                   p.insurance_company_id

            WHERE pc.claim_id = ?
            AND pc.is_active = 1

            LIMIT 1
        `;


        pool.query(
            query,
            [claimId],
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);
            }
        );
    },


    // ======================================================
    // GET CLAIMS BY POLICY
    // ======================================================

    getPolicyClaimsByPolicy: (policyId, callback) => {

        const query = `
            SELECT

                pc.claim_id,
                pc.claim_number,

                pc.policy_id,

                p.policy_number,

                c.customer_id,
                c.customer_name,

                v.vehicle_id,
                v.registration_number,

                ic.insurance_company_id,
                ic.company_name AS insurance_company_name,

                pc.claim_date,
                pc.claim_status,

                pc.accident_date,
                pc.accident_time,
                pc.accident_place,

                pc.driver_name,

                pc.inspection_location,
                pc.estimated_repair_cost,

                pc.created_at,
                pc.updated_at

            FROM policy_claims pc

            INNER JOIN policies p
                ON p.policy_id = pc.policy_id

            INNER JOIN customers c
                ON c.customer_id = p.customer_id

            INNER JOIN vehicles v
                ON v.vehicle_id = p.vehicle_id

            INNER JOIN insurance_companies ic
                ON ic.insurance_company_id =
                   p.insurance_company_id

            WHERE pc.policy_id = ?
            AND pc.is_active = 1

            ORDER BY pc.claim_id DESC
        `;


        pool.query(
            query,
            [policyId],
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);
            }
        );
    },


    // ======================================================
    // UPDATE CLAIM
    // ======================================================

    updatePolicyClaim: (claimId, data, callback) => {

        const query = `
            UPDATE policy_claims
            SET

                claim_date = ?,

                accident_date = ?,
                accident_time = ?,
                accident_place = ?,
                accident_description = ?,

                driver_name = ?,
                driver_address = ?,
                driver_age = ?,
                driver_relationship = ?,
                driving_license_no = ?,

                inspection_location = ?,
                estimated_repair_cost = ?,

                other_insurance_policy_no = ?,

                claim_status = ?,

                remarks = ?,
                is_active = ?,

                updated_by = ?

            WHERE claim_id = ?
        `;


        const values = [

            data.claim_date,

            data.accident_date,
            data.accident_time,
            data.accident_place,
            data.accident_description,

            data.driver_name,
            data.driver_address,
            data.driver_age,
            data.driver_relationship,
            data.driving_license_no,

            data.inspection_location,
            data.estimated_repair_cost,

            data.other_insurance_policy_no,

            data.claim_status,

            data.remarks,
            data.is_active,

            data.updated_by,

            claimId
        ];


        pool.query(
            query,
            values,
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);
            }
        );
    },


    // ======================================================
    // DELETE / SOFT DELETE
    // ======================================================

    deletePolicyClaim: (claimId, callback) => {

        const query = `
            UPDATE policy_claims
            SET
                is_active = 0
            WHERE claim_id = ?
        `;


        pool.query(
            query,
            [claimId],
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);
            }
        );
    },


    // ======================================================
    // GET ACTIVE CLAIMS
    // ======================================================

    getActivePolicyClaims: (callback) => {

        const query = `
            SELECT

                pc.claim_id,
                pc.claim_number,

                pc.policy_id,
                p.policy_number,

                c.customer_id,
                c.customer_name,

                v.vehicle_id,
                v.registration_number,

                ic.insurance_company_id,
                ic.company_name AS insurance_company_name,

                pc.claim_date,
                pc.claim_status,

                pc.accident_date,
                pc.accident_place,

                pc.driver_name,

                pc.estimated_repair_cost

            FROM policy_claims pc

            INNER JOIN policies p
                ON p.policy_id = pc.policy_id

            INNER JOIN customers c
                ON c.customer_id = p.customer_id

            INNER JOIN vehicles v
                ON v.vehicle_id = p.vehicle_id

            INNER JOIN insurance_companies ic
                ON ic.insurance_company_id =
                   p.insurance_company_id

            WHERE pc.is_active = 1

            ORDER BY pc.claim_id DESC
        `;


        pool.query(
            query,
            (err, result) => {

                if (err) {
                    return callback(err, null);
                }

                callback(null, result);
            }
        );
    }

};


module.exports = PolicyClaimService;