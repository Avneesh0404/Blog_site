const jwt = require('jsonwebtoken')
const secret = "Avneesh@4444"
function createtoken(user){
    const payload = {
        _id:user._id,
        email:user.email,
        dpurl:user.dpurl,
        role:user.role
    }
    const token =jwt.sign(payload,secret)
    return token
}

function validtoken(token){
    const user = jwt.verify(token,secret)
    return user
}

module.exports = {createtoken,validtoken}