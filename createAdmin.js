const User = require('./model/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


mongoose.connect('mongodb://127.0.0.1:27017/myapp')
.then(async () => {
    const hashedPassword = await bcrypt.hash('Admin123', 10)

    const existingAdmin = await User.findOne({email:'idahosajessie10@gmail.com'})
    if(existingAdmin) {
        console.log('Admin exist')
    return mongoose.disconnect()
}

    const admin = new User({
        firstname: 'Admin',
        lastname: 'User',
        username: 'A',
        email: 'idahosajessie10@gmail.com',
        password: hashedPassword,
        role: 'Admin'
    })
    await admin.save()
    console.log('Admin created!')
    mongoose.disconnect()
})
.catch(console.error)