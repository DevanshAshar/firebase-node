const express=require('express')
const app=express()
const morgan=require('morgan')
const authentication=require('./auth')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv').config()
const db=require('./config')
const SecretKey=process.env.SECRET_KEY
app.use(express.json())
app.use(morgan('dev'))

const User=db.collection('users')

app.post('/create',async(req,res)=>{
    try {
        const {username,email,password}=req.body
        const id=email
        const user={
            userame:username,
            email:email,
            password:password
        }
        const resp=await db.collection("users").doc(email).set(user)
        res.status(200).json({user})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

app.get('/read',async(req,res)=>{
    try {
        const resp=await db.collection('users').get()
        let result=[]
        resp.forEach(doc=>{
            result.push(doc.data())
        })
        res.status(200).json({result})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

app.put('/update/:id',async(req,res)=>{
    try {
        const user=await db.collection('users').doc(req.params.id).update(req.body)
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

app.delete('/delete/:id',async(req,res)=>{
    try {
        const resp=await db.collection('users').doc(req.params.id).delete()
        res.status(200).json({message:'deleted'})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})
app.post('/login',async(req,res)=>{
    try {
        const {email,password}=req.body
        const user1=await db.collection('users').doc(email)
        const user2=await user1.get()
        const user=await user2.data()
        console.log(user)
        if(!user)
        return res.status(400).json({message:'Not registered'})
        else
        {
            if(user.password===password)
            {
                const token=jwt.sign({email:email},SecretKey,{expiresIn:'1d'})
                return res.status(200).json({token,user})
            }
            else
            return res.status(400).json({message:'Unauthorized'})
        }
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})
app.get('/myData',authentication.verifyToken,async(req,res)=>{
    try {
        res.status(200).json({userData})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})
app.listen(5000,()=>{
    console.log('Server listening on 5000')
})