const {Queue} = require ('bullmq')
const Redis = require ('ioredis')
const User = require('../model/user')

const emailQueue = new Queue('emailQueue', {connection: {
        host: '127.0.0.1',
        port: 6379,
}})

async function queueVerificationEmail(newUser, token) {
    console.log(` Atempting to queue email for ${newUser.email}`)
    const job = await emailQueue.add('sendVerification', {
        email: newUser.email,
       firstname: newUser.firstname,
       token
    },
)
    console.log(` Email job added to queue with id: ${job.id}`)
}


async function queueOtpEmail(user) {
    console.log(` Atempting to queue email for ${user.email}`)
    const job = await emailQueue.add('sendOtp', {
        email: user.email,
       firstname: user.firstname,
        otp: user.otp
    },
)
    console.log(` Email job added to queue with id: ${job.id}`)
}



module.exports = { queueVerificationEmail, queueOtpEmail}