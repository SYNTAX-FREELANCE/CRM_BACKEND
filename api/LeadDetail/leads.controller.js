// controllers/auth.controller.js
const jwt = require("jsonwebtoken");
const leadservie = require("./leads.service");
const bcrypt = require("bcrypt");


module.exports = {

    getLeadFreshCalls: (req, res) => {
        try {
            const { empid } = req.params;
            if (!empid) {
                return res.status(200).json({
                    success: 0,
                    message: "Employee ID is required",
                });
            }

            leadservie.getFreshCalls(empid, (err, results) => {
                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Database error during logout",
                    });
                }

                console.log({
                    results
                });


                return res.status(200).json({
                    success: results.success,
                    message: results.message,
                    data: results.data ?? []
                });
            });
        } catch (error) {
            return res.status(500).json({
                success: 0,
                message: "Something went wrong",
            });
        }
    },
};
