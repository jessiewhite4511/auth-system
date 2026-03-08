const User = require('../model/user')



const getAllusers = async (req, res) => {
    try{
        const users = await User.find().select('-password')

        res.json({message: 'All users fetched', users})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }
}


const getUserForAdmin = async (req, res) => {
    const { id } = req.params
    try{
        const user = await User.findById(id).select('-password')

        if (!user)
            return res.status(404).json({message: 'User Not Found'})
    
    res.json({message: 'User fetched (Admin)', user})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }
}


const adminUpdateUser = async (req, res) => {
    const { id } = req.params
    const updates = req.body 

    try {
        const user = await  User.findByIdAndUpdate(id, updates, { new: true})

        if(!user) {
            return res.status(404).json({message: 'User Not Found'})
        }

        res.json({message: 'User Updated (Admin)', user})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }
}  



const adminDeleteUser = async (req, res) => {
    const { id } = req.params

    try {
        const user = await  User.findByIdAndUpdate(id)

        if(!user) {
            return res.status(404).json({message: 'User Not Found'})
        }

        res.json({message: 'User Deleted (Admin)', user})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({error: err.message})
    }
}  

module.exports = {getAllusers, getUserForAdmin, adminUpdateUser, adminDeleteUser}
