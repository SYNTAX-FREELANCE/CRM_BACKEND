const qualificationMasterService = require("./qualification.service");

module.exports = {

    createQualification: (req, res) => {

        try {

            const {
                qualification_name,
                alias,
                isActive
            } = req.body;

            if (!qualification_name || qualification_name.trim() === "") {
                return res.status(400).json({
                    success: 0,
                    message: "Qualification name is required"
                });
            }

            const qualificationData = {
                qualification_name: qualification_name.trim(),
                alias: alias || null,
                is_active: isActive
            };

            qualificationMasterService.createQualification(
                qualificationData,
                (err, result) => {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            success: 0,
                            message: "Something went wrong while creating qualification"
                        });
                    }

                    return res.status(200).json({
                        success: 1,
                        message: "Qualification created successfully",
                        data: {
                            qualification_id: result.insertId
                        }
                    });

                }
            );

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: 0,
                message: "Something went wrong"
            });

        }

    },

    getAllQualifications: (req, res) => {

        qualificationMasterService.getAllQualifications(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Qualifications retrieved successfully",
                    data: result
                });

            }
        );

    },

    getQualificationById: (req, res) => {

        const { qualificationId } = req.params;

        qualificationMasterService.getQualificationById(
            qualificationId,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                if (!result) {
                    return res.status(404).json({
                        success: 0,
                        message: "Qualification not found"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Qualification retrieved successfully",
                    data: result
                });

            }
        );

    },

    updateQualification: (req, res) => {

        const { qualificationId } = req.params;

        const {
            qualification_name,
            alias,
            isActive
        } = req.body;

        if (!qualification_name || qualification_name.trim() === "") {
            return res.status(400).json({
                success: 0,
                message: "Qualification name is required"
            });
        }

        const qualificationData = {
            qualification_name: qualification_name.trim(),
            alias: alias || null,
            is_active: isActive
        };

        qualificationMasterService.updateQualification(
            qualificationId,
            qualificationData,
            (err) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while updating qualification"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Qualification updated successfully"
                });

            }
        );

    },

    deleteQualification: (req, res) => {

        const { qualificationId } = req.params;

        qualificationMasterService.deleteQualification(
            qualificationId,
            (err) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong while deleting qualification"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Qualification deleted successfully"
                });

            }
        );

    },

    getActiveQualifications: (req, res) => {

        qualificationMasterService.getActiveQualifications(
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        success: 0,
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    success: 1,
                    message: "Active qualifications retrieved successfully",
                    data: result
                });

            }
        );

    }

};