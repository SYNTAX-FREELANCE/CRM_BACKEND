const jwt = require("jsonwebtoken");

/*
|--------------------------------------------------------------------------
| Generate Mobile Access Token
|--------------------------------------------------------------------------
|
| Short lived token.
| Used for normal API requests.
|
*/

const generateMobileAccessToken = (user) => {

    return jwt.sign(
        {
            userId: user.id,
            username: user.username,
            role: user.role,
        },

        process.env.MOBILE_ACCESS_TOKEN_SECRET,

        {
            expiresIn:
                process.env.MOBILE_ACCESS_TOKEN_EXPIRY ||
                "15m",
        }
    );
};


/*
|--------------------------------------------------------------------------
| Generate Mobile Refresh Token
|--------------------------------------------------------------------------
|
| Long lived token.
| Used only to generate a new access token.
|
*/

const generateMobileRefreshToken = (user) => {

    return jwt.sign(
        {
            userId: user.id,
        },

        process.env.MOBILE_REFRESH_TOKEN_SECRET,

        {
            expiresIn:
                process.env.MOBILE_REFRESH_TOKEN_EXPIRY ||
                "30d",
        }
    );
};


/*
|--------------------------------------------------------------------------
| Generate Both
|--------------------------------------------------------------------------
*/

const generateMobileTokens = (user) => {

    const accessToken =
        generateMobileAccessToken(user);

    const refreshToken =
        generateMobileRefreshToken(user);

    return {
        accessToken,
        refreshToken,
    };
};


module.exports = {
    generateMobileAccessToken,
    generateMobileRefreshToken,
    generateMobileTokens,
};