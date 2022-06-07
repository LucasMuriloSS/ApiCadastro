const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const fs = require('fs');


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
    const isValidUser = user?.password === password

    if(isValidUser){
        bodyReturn = {
            logged: true,
            status: 'success',
            message:'Login successfully',
        }

        try {
            const secret = 'sdfDFsdfFhSdf23SAFSDgjDasdfasd25632F4523F2F3F44533er45F623rg12FDS34r2FfhGADSF23RFw'
            const token =  jwt.sign(
              {
                id: user._id,
              },
              secret
            );
            bodyReturn = {...bodyReturn, token: token}
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: error });
        }
    }else{
        bodyReturn = {
            logged: false,
            status: 'failed',
            message:'Email or password wrong.',
        }
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