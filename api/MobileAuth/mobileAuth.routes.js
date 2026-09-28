const express = require("express");
const router = express.Router();
const mobileAuthController = require("./mobileAuth.controller");
const verifyAccessToken = require("../../Middleware/verifyAccessToken");

/*
|--------------------------------------------------------------------------
| PUBLIC MOBILE ROUTES
|--------------------------------------------------------------------------
*/

/*
 * Mobile Login
 */
router.post(
    "/login",
    mobileAuthController.login
);


/*
 * Refresh Access Token
 */
router.post(
    "/refresh-token",
    mobileAuthController.refreshToken
);


/*
|--------------------------------------------------------------------------
| PROTECTED MOBILE ROUTES
|--------------------------------------------------------------------------
*/

/*
 * Validate Current Mobile User
 */
router.get(
    "/me",
    verifyAccessToken,
    mobileAuthController.me
);


/*
 * Mobile Logout
 */
router.post(
    "/logout",
    verifyAccessToken,
    mobileAuthController.logout
);


module.exports = router;