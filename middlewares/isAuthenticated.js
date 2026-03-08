const { decode } = require('jsonwebtoken')
const User = require('../model/user')
const {verifyAuthToken} = require('../utils/verifications')

const isAuthenticated = async (req, res, next) => {
    try{
    const authHeader = req.headers['authorization']
    console.log("Authorization header:", authHeader)

    if(!authHeader)
        return res.redirect('/login')
       const token = authHeader && authHeader.split(' ')[1]
       console.log("token extracted:", token)

        decoded = await verifyAuthToken(token) 
        
        const user = await User.findById(decoded.id)
        console.log("User from DB:", user)
        if(!user) 
            return res.status(401).json({message: 'User Not Found'})

        // const session = user.sessions.find(s => s.ip === req.ip)
        //if (!session)
            //return res.redirect('/login')

        user.online = true
        user.lastOnline = new Date()
        user.lastLoginAt = user.lastLoginAt || new Date()
        //session.lastActiveAt = new Date()
        await user.save()
        
        req.userId = user._id.toString()
        console.log("req.userId set to:", req.userId)
        //req.session = session
        next() 
}       catch (err) {
    console.log(err)
    return res.status(500).json({message: 'Authentication Failed'}) 
}
} 

module.exports = isAuthenticated
