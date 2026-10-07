const MotorCalculationService = require("./calculator.service");

const MotorCalculationController = {
  getCalculationData: (req, res) => {
    const data = req.body;

    MotorCalculationService.getCalculationData(data, (err, result) => {
      if (err) {
        console.error("Motor Calculation Data Error:", err);

        return res.status(500).json({
          success: false,
          message: "Failed to fetch motor calculation data",
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    });
  },
};

module.exports = MotorCalculationController;
