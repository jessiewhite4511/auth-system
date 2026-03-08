const express = require ('express')
const upload = require('../utils/upload')
const { getUserById, updateUserProfile, updateUserPreference, updateUserNotification, deleteUserById} = require('../controller/authController')
const isAuthenticated = require('../middlewares/isAuthenticated')

console.log({ getUserById, updateUserProfile, updateUserPreference, updateUserNotification, deleteUserById})

const router = express.Router()

router.get('/:id', isAuthenticated, getUserById)

router.patch('/:id', isAuthenticated, upload.fields([
    {name: 'profilePicture', maxCount:1},
    {name: 'coverPhoto', maxCount:1}

]), updateUserProfile)

router.put('/preference', isAuthenticated, updateUserPreference)

router.post('/notification', isAuthenticated, updateUserNotification)

router.delete('/:id', isAuthenticated, deleteUserById)

module.exports = router