const jwt=require('jsonwebtoken')
const dotenv=require('dotenv').config()
const admin=require('firebase-admin')
/*const credentials=require('./key.json')

const db=admin.firestore()*/
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
                const user=await User.doc(data.email)
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