const {
  loginUserDetail,
  RegisterUser,

} = require("./usercontroller.controller");

const router = require("express").Router();

router.post("/login", loginUserDetail);
router.post("/signin", RegisterUser);


module.exports = router;
