const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/login', async (req,res)=>{
    const {email, password} = req.body
    let user = false
    let bodyReturn = {}
    try{
        user = await User.findOne({
            email: email
        })
    }
    catch(error){
        console.log(`[POST API login] => `, error)
    }
    bodyReturn = {
        logged: user?.password === password,
        status: user?.password === password ? 'success': 'failed',
        message: user?.password === password ? '': 'Email or password wrong.',
    }
    res.send(bodyReturn)
})

router.post('/register', async (req,res)=>{
    const {email, password} = req.body
    let bodyReturn
    let user


    if(!email || !password){
        bodyReturn = {
            registered: false,
            status: 'failed',
            message: 'Email and password are required.',
        }
        res.send(bodyReturn)
        return 
    }
    try{
        let userFinded = await User.findOne({
            email: email
        })
        if(userFinded && userFinded._id){
            bodyReturn = {
                registered: !!userFinded._id,
                status: 'failed',
                message: 'User aready exists.'
            }
            res.send(bodyReturn)
            return
        }

        user = await User.create({email: email, password: password})
        bodyReturn = {
            registered: !!user.id,
            id: user?.id,
            status: 'success',
            message: 'User created with success!',
        }
    }catch(error){
        console.log(`[POST API register] => `, error)
    }
    
    res.send(bodyReturn)
})

module.exports = router