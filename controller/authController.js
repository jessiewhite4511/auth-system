const User = require('../model/user')
const bcrypt = require('bcrypt')
const crypto = require ('crypto')
const Redis = require ('ioredis')
const redis = require('../config/redis')
const upload = require('../utils/upload')

function generateEtag(data) {
    return crypto.createHash('sha1').update(JSON.stringify(data)).digest('hex')
}

const getUserById = async (req, res) => {
    const userId = req.params.id
    try {
        if (req.userId !== userId)
            return res.status(403).json({message:'Forbidden'})

        const cachedUser = await redis.get(`user:${userId}`)
        const cachedEtag = await redis.get(`user:${userId}:etag`)

        const clientEtag = req.headers['if-none-match']

        if (cachedUser) {
            const parsed = JSON.parse(cachedUser)

            if (clientEtag && cachedEtag && clientEtag === cachedEtag) {
                return res.status(304).end()
        }

        res.setHeader('Etag', cachedEtag)
        res.setHeader('X-Cache', 'HIT')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('X-Frame-Options', 'DENY')

        return res.json({message: 'User fetched (Cache)', 
            user: parsed
        })
        }
        
         const user = await User.findById(userId)
         console.log("Found user:", userId)
         
         if (!user) {
            return res.status(404).json({message: 'User not found'})
         }

         const newEtag = generateEtag(user)

         await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 60 * 5)
         await redis.set(`user:${userId}:etag`, newEtag, 'EX', 60 *5)

        res.setHeader('Etag', newEtag)
        res.setHeader('X-Cache', 'MISS')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('X-Frame-Options', 'DENY')

        return res.json({message: 'User fectched (database)',
            user
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }

}



const updateUserProfile = async (req, res) => {
    const userId = req.params.id
    const {bio} = req.body

    try{
         if (req.userId !== userId)
            return res.status(403).json({message:'Forbidden'})

        const updates = {bio}
        const profilePicture = req.files?.profilePicture?.[0].path
        const coverPhoto = req.files?.coverPhoto?.[0].path

        if (profilePicture) updates.profilePicture = profilePicture

            if (coverPhoto) updates.coverPhoto = coverPhoto

        const user = await User.findByIdAndUpdate(userId, updates, {new:true})

        if(!user) 
            return res.status(404).json({message: 'User Not Found'})
        
        const newEtag = generateEtag(user)

         await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 60 * 5)
         await redis.set(`user:${userId}:etag`, newEtag, 'EX', 60 *5)

        res.setHeader('Etag', newEtag)
        res.setHeader('X-Cache', 'MISS')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('X-Frame-Options', 'DENY')

        return res.json({message: 'User fectched (database)',
            user
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }
}

const updateUserPreference = async (req, res) => {
    const userId = req.userId
    const {preference} = req.body

    console.log("Inside updateUserPreference")
    console.log("req.userId:", req.userId)
    console.log("preference from body:", preference)

    try {
        if (req.userId !== userId)
            return res.status(403).json({message:'Forbidden'})
        
          const user = await User.findByIdAndUpdate(req.userId, {preference: preference}, {new: true})

        if(!user)
            return res.status(404).json({message: 'User Not Found'})

        const newEtag = generateEtag(user)

        await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 60 * 5)
         await redis.set(`user:${userId}:etag`, newEtag, 'EX', 60 *5)

        res.setHeader('Etag', newEtag)
        res.setHeader('X-Cache', 'MISS')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('X-Frame-Options', 'DENY')

        return res.json({message: 'Preference settings updated',
            user
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }
}


const updateUserNotification = async (req, res) => {
     const userId = req.userId
    const {notification} = req.body

    try {

        const user = await User.findByIdAndUpdate(userId, {notification}, {new: true})

        if(!user)
            return res.status(404).json({message: 'User Not Found'})

        const newEtag = generateEtag(user)

        await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 60 * 5)
         await redis.set(`user:${userId}:etag`, newEtag, 'EX', 60 *5)

        res.setHeader('Etag', newEtag)
        res.setHeader('X-Cache', 'MISS')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('X-Frame-Options', 'DENY')

        return res.json({message: 'Notification settings updated',
            user
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }
}



const deleteUserById = async (req, res) => {
    const userId = req.userId
    try {
         if (req.userId !== userId)
            return res.status(403).json({message:'Forbidden'})
        
        const deleted = await User.findByIdAndDelete(userId)

        if(!deleted)
            return res.status(404).json({message: 'User Not Found'})

        await redis.del(`user:${userId}`)
        await redis.del(`user:${userId}:etag`)

        return res.json({message: 'User account deleted'})
    } catch (err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }
}


module.exports = { getUserById, updateUserProfile, updateUserPreference, updateUserNotification, deleteUserById}