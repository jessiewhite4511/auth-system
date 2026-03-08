const mongoose = require ('mongoose')



const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    username: {
        type: String,
        unique: true
    },

    pendingOtp: {
        type: String
    },

    attempts: {
        type: Number,
        default: 0
    },

    bio: {
        type: String,
        maxlenth: 500,
        default: ''
    },
    profilePicture: {
        type: String,
        default: null
    },
    coverPhoto: {
        type: String,
        default: null
    },
    verificationToken:{
        type:String
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLoginAt: {
        type: Date
    },
    
    preference: {
        type: Map,
        of: String,
        default: {}
    },

    Notifications: {
        email: {
            type: Boolean,
            default: true
        },
        push: {
            type: Boolean,
            default: true
        },
        sms: {
            type: Boolean,
            default: false
        },
    },
    sessions: [{
        deviceId: String,
        deviceType: String,
        ip: String,
        lastActiveAt: Date,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    online: {
        type: Boolean,
        default: false
    },
    lastOnline: {
        type: Date,
        defualt: null
    }
    
}, {timestamp: true})

const User = mongoose.model("User", userSchema)
module.exports = User
