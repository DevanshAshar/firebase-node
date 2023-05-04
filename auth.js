const jwt=require('jsonwebtoken')
const dotenv=require('dotenv').config()


const db=require('./config')
const User=db.collection('users')
const authentication={
    verifyToken:async(req,res,next)=>{
    try {
        let token=req.header('AuthenticateUser')
        if(typeof(token)==="undefined")
        return res.status(401).json({error:'Unauthorized'})
        else
        {
        if(token.startsWith('Bearer ')){
        token=token.slice(7,token.length)
        }
        if(token)
        {
            try {
                const data=jwt.verify(token,process.env.SECRET_KEY)
                const user1=await User.doc(data.email)
                const user2=await user1.get()
                const user=await user2.data()
                userData=user
                next()
            } catch (error) {
                return res.status(400).json({error:'Invalid Token'})
            }
        }
    }
}catch (error) {
    return res.status(401).send(error.message)
}
}
}
module.exports=authentication