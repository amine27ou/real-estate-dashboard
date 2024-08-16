const jwt = require('jsonwebtoken'

)
const authMiddleware = (req,res,next)=>{
    const token = req.headers['Authorization'].split(' ')[1]
    if(!token){
        return res.status(401).json({
            message:'Not Authenticated'
        })
    }   
    try{
        const currentUser = jwt.verify(token,process.env.SECRET_KEY)
        req.currentUser = currentUser
        next()
    }catch(err){
        return res.status(401).json('Invalid token');
    }
}
module.exports = authMiddleware