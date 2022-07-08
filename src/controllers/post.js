const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');

const jwt = require("jsonwebtoken");
const fs = require('fs');
const { json, Router } = require('express'); 
const {parseCookies,nookies} = require('nookies');
const { getMaxListeners } = require('process');
const multer = require('multer');
const { decode } = require('punycode');
const { stringify } = require('querystring');
const upload =  multer({dest:'uploads/'});

const secret = 'sdfDFsdfFhSdf23SAFSDgjDasdfasd25632F4523F2F3F44533er45F623rg12FDS34r2FfhGADSF23RFw'

router.post('/CreatePost', async (req,res)=> {

    const {token, title, content,system} = req.body

    

    const decoded = jwt.verify(token,secret)

    try{

        

        Post = await Post.create({
            Title:title,
            Message:content,
            PostedBy:await User.findById(decoded.id),
            System:system})

    }catch(error){

        console.log(`[POST API register] => `, error)
    }
        
    

})

router.post('/CreateComment', async (req,res)=> {

    const {token, content, postId} = req.body

    const decoded = jwt.verify(token,secret)

    comments = await Post.findById(postId)

    console.log(comments)

    let data = {

        Comments:{
            PostedBy:decoded.id,
            Text: content
        }

    }

    try{
        // result = await Post.findByIdAndUpdate(postId,data)
        result = await Post.updateOne({_id: postId},{$push:{Comments: data.Comments}})
        
    }catch(error){
        console.log(`[POST API register] => `, error)
    }

    res.send("POST CREATED")

})

router.get('/Posts', async (req,res)=>{

    const body = req.query

    try{

    result = await Post.find({System:body.System})

    //criar um data especifico para enviar as informações para o front

    }catch(error){
        console.log(`[POST API register] => `, error)
    }

    let data = [{}]
    
    for( i = 0; i < result.length ; i++){
        
        try{ 
            user = await User.findById(result[i].PostedBy._id)
            data.push({title:result[i].Title,name:user.name,image:user.image,id:result[i]._id}) 
        }catch(error){
            console.log(`[POST API register] => `, error)
        }
        
    }

    // console.log(data)
    
    res.send(data)
    
})
router.get('/Post', async (req,res)=>{

    const body = req.query
    
    try{

    result = await Post.findById(body.PostId)

    //criar um data especifico para enviar as informações para o front

    }catch(error){
        console.log(`[POST API register] => `, error)
    }

    let data = [{}]

        try{ 
            user = await User.findById(result.PostedBy._id)
    
            data = {
    
                title:result.Title,
                name:user.name,
                image:user.image,
                message:result.Message,
                        
            }
            for(i = 0 ;i< result.Comments.length;i++){
                console.log("ok")
    
                if(result.Comments[i] != null){
        
                    user2 = await User.findById(result.Comments[i].PostedBy._id)
                    
                    if(i==0){

                        data = {
                            ...data,
                            comments: [{
                            image: user2.image,
                            name: user2.name,
                            text: result.Comments[i].Text
                        }]
                        }
                    }else{
                        data = {
                            ...data,
                            comments: [...data.comments,{
                            image: user2.image,
                            name: user2.name,
                            text: result.Comments[i].Text
                        }]
                        }
                    
                    }
                }
    
            }
    
        }catch(error){
            console.log(`[POST API register] => `, error)
        }

    res.send(data)
    
})

module.exports = router