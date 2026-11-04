
const rateLimit = require("express-rate-limit");

// General API protection
const globalApiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    limit: 300,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

// Login protection
const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many login attempts. Please try again after 10 minutes. "
    }
});

// Sensitive API protection
const sensitiveApiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 30,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests to this resource. Please try again later."
    }
});

module.exports = {
    globalApiLimiter,
    loginLimiter,
    sensitiveApiLimiter
};
