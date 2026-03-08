const rateLimit = require('express-rate-limit')

const loginRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: "Too many login attempts. Try again later."
})

module.exports = loginRateLimiter