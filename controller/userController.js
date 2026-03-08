const User = require('../model/user')
const {generateToken, generateAuthToken, verifyToken} = require('../utils/verifications')
const Redis = require ('ioredis')
const redis = require('../config/redis')
const {queueVerificationEmail, queueOtpEmail} = require('../utils/emailQueue')
const bcrypt = require('bcrypt')

const MAX_ATTEMPTS = 5

const signup = async (req, res) => {
    const {firstname, lastname, username, email, password} = req.body 
    const idempotencyKey = req.header('idempotency-key')
    try{
        if (!firstname || !lastname || !username || !email || !password) {
            return res.status(401).json({error: 'all fields are required'})
    }
    if (idempotencyKey) {
        const existing = await redis.get(`idempotency:${idempotencyKey}`)
        if(existing) {
            return res.status(200).json({message: 'Registration already in progess'})        
    }}

     await redis.set(`idempotency:${idempotencyKey}`, 'processing', 'EX', 60)

        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({message: 'Email already exist'})
    }
    const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            firstname,
            lastname,
            username,
            email,
            password: hashPassword,
            isVerified: false
            
        })
        const token = await generateToken({email: newUser.email, id: newUser._id})
        console.log('generated token:', token)
    
        await queueVerificationEmail(newUser, token)

        await redis.set(`idempotency:${idempotencyKey}`, 'Registered', 'EX', 300)

        res.status(200).json({message: 'Signup Sucessful. Verify your email', 
            newUser: {
            email,
            firstname,
            lastname,
            username,
            isVerified: false
        } 
    })
} catch (err) {
    console.error('signup error:', err)
    res.status(500).json({message: 'server error'})
}
}


const verifyemail = async (req, res) => {
    const { token } = req.query
    const idempotencyKey = req.header('idempotency-key')
    try{
        if (!token)
            return res.status(400).json({message: 'Token Required'})

        if (idempotencyKey) {
            const existing = await redis.get(`verify:${idempotencyKey}`)
            return(
                 res.status(200).json({message: 'Verification Already Progressing'})
            )
        }
        await redis.set(`verify:${idempotencyKey}`, 'processing', 'EX', 60)

        const decoded = await verifyToken(token)

        const user = await User.findById(decoded.payload.id)
            if (!user) return res.status(400).json({message: 'User not found'})
            
            user.isVerified = true
            user.verifyAuthToken = undefined
            

           await user.save()
           return res.status(200).json({message: 'Verified'})
        }
        catch (err) {
            console.log('Email Verification', err)
            return res.status(500).json({message: 'Server error'})
        }

}


    const login = async (req, res) => {
        const {email, password} = req.body
        const ip = req.ip
        const userAgent = req.headers["user-agent"]
    try {
        const user = await User.findOne({email})
        if (!user) return res.status(401).json({message: 'Invalid email or password'})
            if (user.attempts >= MAX_ATTEMPTS)
                return res.status(429).json({ message: 'too many failed attempts'})
        
        const match = await bcrypt.compare(password, user.password)
        if(!match) {
            user.attempts = (user.attempts || 0) + 1
            await user.save()
            return res.status(401).json({message: 'Invalid email or password'})
        }
        
        user.attempts = 0 

        const lastSession = user.sessions[user.sessions.length - 1]
        if (lastSession) {
            const previousIP = lastSession.ip
            if (true) {
                const otp = Math.floor(100000 + Math.random() * 9000000).toString()
                console.log("RAW OTP:", otp)
                const hashedOtp = await bcrypt.hash(otp, 10)
                user.pendingOtp = hashedOtp
                await user.save()
                console.log("Saved Otp:", user.pendingOtp)
                await queueOtpEmail({ 
                    email: user.email, 
                    firstname: user.firstname, 
                    otp })
                return res.status(403).json({message: 'New IP detected. OTP sent to your email'})

            }
        }
          const token = generateAuthToken({id: user.id, role: user.role})
          console.log("generated auth token:", token)

          user.sessions.push({
            deviceId: userAgent,
            deviceType: 'browser',
            ip,
            createdAt: new Date(),
            lastActiveAt: new Date()
          })

         user.lastLoginAt = new Date()
         await user.save()

         res.setHeader("X-Auth-Token", token)

         return res.json({message: 'Login successful',
            token,
            user
         })
    } catch (err) {
        console.error({error: err.message})
    }

}


    const verifyOtp = async (req, res) => {
        const {email, otp} = req.body
        const ip = req.ip
        const userAgent = req.header["user-agent"]
    try {
        const user = await User.findOne({email})
        if(!user) return res.status(401).json({message: "user not found"})
            console.log("User found:", user.email)
           console.log("Pending otp in DB:", user.pendingOtp)

            if(!user.pendingOtp)
                return res.status(401).json({message: "No Otp"})

            const isMatch = await bcrypt.compare(otp, user.pendingOtp)
            if(!isMatch)
                return res.status(401).json({message: 'Invalid Otp'})

            user.pendingOtp = null

        const token = await generateAuthToken({id: user.id})
          console.log('generated token', token)

        user.sessions.push({
             deviceId: userAgent,
            deviceType: 'browser',
            ip,
            createdAt: new Date(),
            lastActiveAt: new Date()
        })

         user.lastLoginAt = new Date()
         await user.save()

         res.setHeader("X-Auth-Token", token)

         return res.json({message: 'Otp Verified. Login successful',
            token,
            user
         })
    } catch (err) {
        console.error({error: err.message})
    }

}


    module.exports = {signup, verifyemail, login, verifyOtp}