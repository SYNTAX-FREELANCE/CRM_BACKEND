const { getIO } = require("../config/socket");

module.exports = (req, res, next) => {
  req.io = getIO();
  next();
};
