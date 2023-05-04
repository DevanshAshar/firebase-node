const express=require('express')
const app=express()
const admin=require('firebase-admin')
const morgan=require('morgan')
const credentials=require('./key.json')
admin.initializeApp({
    credential:admin.credential.cert(credentials)
})
const db=admin.firestore()
app.use(express.json())
app.use(morgan('dev'))

app.post('/create',async(req,res)=>{
    try {
        const {username,email,password}=req.body
        const id=email
        const user={
            userame:username,
            email:email,
            password:password
        }
        const resp=await db.collection("users").add(user)
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
app.listen(5000,()=>{
    console.log('Server listening on 5000')
})