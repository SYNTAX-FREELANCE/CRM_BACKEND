const jwt = require("jsonwebtoken");

const authService =
    require("../api/MobileAuth/mobileAuth.service");


const verifyMobileAccessToken = (
    req,
    res,
    next
) => {

    const authHeader =
        req.headers.authorization;


    /*
    |--------------------------------------------------------------------------
    | Check Authorization Header
    |--------------------------------------------------------------------------
    */

    if (!authHeader) {

        return res.status(401).json({
            success: 0,
            message:
                "Authorization header required",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Bearer Token
    |--------------------------------------------------------------------------
    */

    if (
        !authHeader.startsWith("Bearer ")
    ) {

        return res.status(401).json({
            success: 0,
            message:
                "Invalid authorization format",
        });
    }


    const accessToken =
        authHeader.substring(7);


    /*
    |--------------------------------------------------------------------------
    | Verify JWT
    |--------------------------------------------------------------------------
    */

    jwt.verify(

        accessToken,

        process.env.MOBILE_ACCESS_TOKEN_SECRET,

        (err, decoded) => {

            if (err) {

                return res.status(401).json({

                    success: 0,

                    message:
                        "Invalid or expired access token",

                    code:
                        "ACCESS_TOKEN_EXPIRED",
                });
            }


            /*
            |--------------------------------------------------------------------------
            | Find User
            |--------------------------------------------------------------------------
            */

            authService.findUserById(

                decoded.userId,

                (err, user) => {

                    if (err || !user) {

                        return res.status(401).json({

                            success: 0,

                            message:
                                "User not found",
                        });
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Attach User
                    |--------------------------------------------------------------------------
                    */

                    req.user = {

                        id:
                            user.id,

                        user_id:
                            user.user_id,

                        username:
                            user.username,

                        role:
                            user.role,

                        role_name:
                            user.role_name,

                        name:
                            user.name,
                    };


                    next();
                }
            );
        }
    );
};


module.exports =
    verifyMobileAccessToken;