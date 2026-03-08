const express = require ('express')
const {getAllusers, getUserForAdmin, adminUpdateUser, adminDeleteUser} = require('../controller/adminController')
const  isAdmin  = require('../middlewares/isAdmin')
const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router()

router.get('/all', isAuthenticated, isAdmin, getAllusers)

router.get('/:id', isAuthenticated, isAdmin, getUserForAdmin)

router.post('/update/:id', isAuthenticated, isAdmin, adminUpdateUser)

router.delete('/:id', isAuthenticated, isAdmin, adminDeleteUser)

module.exports = router