const express = require('express');
const users = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

users.use(cors())

process.env.SECRET_KEY ='secret'

users.post('/Register',(req,res)=>{
    const today=new Date()
    const userData={
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        password:req.body.password,
        created:today
    }
    User.findOne({
        email:req.body.email
    })
    .then(user =>{
        if(!user){
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                userData.password=hash
                User.create(userData)
                .then(user =>{
                    res.json({status:user.email+'registered!'})
                })

                .catch(err =>{
                    res.send('error: '+err)
                })
            })
        }else{
            res.json({error:'User already exists'})
        }
        })
    .catch(err=>{
        res.send('error:' +err)
    })
})


users.get('/disp', (req, res)=>{
    // var decoded  = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    User.find({})
    .then(user =>{
        if(user){
            res.json(user)
        }else{
            res.send("user does not exist")
        }
    })
    .catch(err =>{
        res.send('error : ' + err)
    })
})



users.post('/Login' ,(req,res) =>{
    User.findOne({
        email:req.body.email
    })
    .then(user =>{
        if(user){
            if(bcrypt.compareSync(req.body.password , user.password)){
                const payload = {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email:user.email
                }
                let token = jwt.sign(payload , process.env.SECRET_KEY , {
                    expiresIn: 1440
                })
                res.send(token);
            }else{
               
                res.send(null)
            }
        }else{
            res.send(null)
        }
    })
    .catch(err =>{
        res.send('error : ' + err)
    })
})

users.get('/Profile', (req, res)=>{
    var decoded  = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    user.findOne({
        _id:decoded._id
    })
    .then(user =>{
        if(user){
            res.json(user)
        }else{
            res.send("user does not exist")
        }
    })
    .catch(err =>{
        res.send('error : ' + err)
    })
})



users.post('/update',(req,res)=>{
    console.log(req.body)
    User.findOneAndUpdate({email : req.body.prevEmail},
    {"$set": { email :req.body.email, first_name :req.body.firstName, last_name :req.body.lastName}},{new: true},(err,result)=>{
        const payload = {
            first_name: result.first_name,
            last_name: result.last_name,
            email:result.email
        }
        let token = jwt.sign(payload , process.env.SECRET_KEY , {
            expiresIn: 1440
        })
        res.send(token);
    })
})

users.post('/delete',(req,res)=>{
    User.remove({email: req.body.emailId})
    .then(result=>{
        res.send(result)
    })
})



module.exports=users