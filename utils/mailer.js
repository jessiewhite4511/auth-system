const nodemailer = require ('nodemailer')
require('dotenv').config()

transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }

})

console.log('Ethereal account created:')



const sendMail = async (to, subject, message) => {
    try{
    const mailOptions = {
        from:"MyApp Support <support@myapp.com>",
        to,
        subject,
        text: message,

    }
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
} catch (err) {
    console.error('Email sending failed:', err)
}}


 const sendVerificationEmail = async ({email, firstname, token}) => {
    const link = `${process.env.MONGO_URL}/verify?token=${token}`
    const subject = 'Verify your email'
    const message = `
    Hi ${firstname},

    Thank you for registering an account with us. Click on the link to verify your account ${link}
    `
    await sendMail(email, subject, message)

}

 const sendOtpEmail = async ({email, firstname, otp}) => {
    const subject = 'Verify your email'
    const message = `
    Hi ${firstname},

    Your IP address changed. Your login otp is ${otp}
    `

    console.log("sending otp:", otp)
    
    await sendMail(email, subject, message)

}

module.exports = {sendVerificationEmail, sendOtpEmail}