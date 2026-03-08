const jwt = require ('jsonwebtoken')
const crypto = require ('crypto')

const JWT_SECRET = process.env.JWT_SECRET


    async function generateAuthToken(payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d"})
    }

     async function verifyAuthToken(token) {
        try{
             const decoded =  jwt.verify(token, JWT_SECRET,)
             if (!decoded) {
                return res.status(400).json({message: 'Invalid Token Or No token'})
             }
             return decoded
             } catch (err) {
            onsole.err('Token Verification failed', err.message)
         } 
}
    async function generateToken(payload) {
        return jwt.sign({ payload, type: "one time",}, JWT_SECRET, {expiresIn: "5m"})        
    }

    async function verifyToken(token) {
        if(!token) throw new Error('Token required')
        try{
            const decoded = jwt.verify( token, JWT_SECRET)
            console.log("Decoded:", decoded)
            return decoded
        }
        catch (err) {
               console.log("JWT ERROR:", err.message)
                 throw error
               return null
        }
        
    }

    async function generateResetToken(payload) {
        return jwt.sign({ payload, type:"reset"}, JWT_SECRET), {expiresIn:"20m"}
    }

    async function verifyResetToken(token) {
        try{
            const decoded = jwt.verify( token, JWT_SECRET)
            if (decoded.type !== "reset")
                throw new error('invalid type')
            return decoded
        }
        catch {
            return null
        }
       
    }

module.exports = { generateToken, verifyToken, generateAuthToken, verifyAuthToken }