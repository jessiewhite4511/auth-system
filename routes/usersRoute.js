const express = require ('express')
const loginRateLimiter = require('../middlewares/rateLimiter')
const loginValidator = require('../middlewares/validator')
const { signup, verifyemail, login, verifyOtp } = require('../controller/userController')

const router = express.Router()

router.post('/signup', loginValidator, signup)

router.get('/verifyemail', verifyemail)

router.post('/login', loginRateLimiter, loginValidator, login)

router.post('/verifyOtp', verifyOtp)

module.exports = router