const express = require ('express')
const usersRoute = require('./usersRoute')
const authRoute = require('./authRoute')
const adminsRoute = require('./adminsRoute')


const router = express.Router()

router.use('/users', usersRoute)

router.use('/auth', authRoute)

router.use('/admins', adminsRoute)

module.exports = router