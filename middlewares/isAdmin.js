const User = require('../model/user')


const isAdmin =  async (req, res, next) => {
    if(!req.userId) {
        res.status(401).json({message: 'Not Authenticated'})
    }
    const user = await User.findById(req.userId)
    if (!user) return res.status(401).json({message: 'user not found'})

    if (user.role.toLowerCase() !== 'admin') {
        return res.status(403).json({message: 'Forbidden - Admins only'})
    }

    next()
}

module.exports =  isAdmin 