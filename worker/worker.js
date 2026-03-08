const {Worker} = require('bullmq')
const Redis = require ('ioredis')
require('dotenv').config()
const {sendVerificationEmail, sendOtpEmail} = require ('../utils/mailer')


const emailWorker = new Worker('emailQueue',  
    async (job) => {
        if (job.name === 'sendVerification') {
            await sendVerificationEmail(job.data)
        }
        if (job.name === 'sendOtp') {
            await sendOtpEmail(job.data)
        }
    }, {connection: {
        host: '127.0.0.1',
        port: 6379
    },
        lockDuration: 600000,
        concurrency: 1,
        removeOnComplete: { count: 100},
        removeOnFail: false
}
)

    console.log(" Worker started and waiting for jobs...")

    emailWorker.on('active', (job) => {
        console.log(`processing job ${job.id} for ${job.data.email}`)
    })

    emailWorker.on('completed', (job) => {
        console.log(`Email sent to ${job.data.email}`)
    })

    emailWorker.on('Failed', (job, err) => {
        console.log(`failed to send email ${job.data.firstname} `, err)   
    })