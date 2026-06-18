const {
  loginUserDetail,
  RegisterUser,
  logoutUserSession,
} = require("./usercontroller.controller");

const authMiddleware = require("../../Middleware/auth.middleware");
const router = require("express").Router();

router.post("/login", loginUserDetail);
router.post("/signin", RegisterUser);
router.post("/logout", authMiddleware, logoutUserSession);

module.exports = router;
