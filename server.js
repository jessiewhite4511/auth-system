const mongoose = require ('mongoose')
const express = require ('express')
const app = express()
require('dotenv').config()

PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: false}))

const routes = require('./routes')
app.use('/api', routes)

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('connected sucessfully'))
.catch( err => console.error(err.message))




app.listen(process.env.PORT || 5000, () => {
    console.log(`server is running on ${PORT}`)
})
