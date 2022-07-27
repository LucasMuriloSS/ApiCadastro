const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comments')

const jwt = require("jsonwebtoken");
const fs = require('fs');
const { json, Router } = require('express'); 
const {parseCookies,nookies} = require('nookies');
const { getMaxListeners } = require('process');
const multer = require('multer');
const { decode } = require('punycode');
const { stringify } = require('querystring');
const { findByIdAndDelete } = require('../models/user');
const { Console } = require('console');
const upload =  multer({dest:'uploads/'});

const secret = 'sdfDFsdfFhSdf23SAFSDgjDasdfasd25632F4523F2F3F44533er45F623rg12FDS34r2FfhGADSF23RFw'

router.post('/CreatePost', async (req,res)=> {

    const {token, title, content,system} = req.body


    const today = new Date()
    dia = today.getDate()
    mes = today.getMonth()

    if(dia <10){
        dia = '0' + dia 
    }
    if(mes <10){
        mes = '0' + (mes+1) 
    }
    
    const time = dia + '/' + mes + '/' + today.getFullYear() + ' às ' + today.getHours() +":" + today.getMinutes()
    

    try{
        const decoded = jwt.verify(token,secret)
        Post = await Post.create({
            Title:title,
            Message:content,
            PostedBy:await User.findById(decoded.id),
            System:system,
            Data:time
        })

    }catch(error){

        console.log(`[POST API CreatePost] => `, error)
    }
        
})

router.post('/CreateComment', async (req,res)=> {

    const {token, content, postId} = req.body
    const decoded = jwt.verify(token,secret)  

    try{
    
        PostFinded = await Post.findById(postId)
        user = await User.findById(decoded.id)

    }catch(error){

        console.log(`[POST API register] => `, error)
    }
    
    const today = new Date()

    dia = today.getDate()
    mes = today.getMonth()

    if(dia <10){
        dia = '0' + dia 
    }
    if(mes <10){
        mes = '0' + (mes+1)  
    }
    
    const time = dia + '/' + mes + '/' + today.getFullYear() + ' às ' + today.getHours() +":" + today.getMinutes()
    

    try{//criar o comentários

    Commented = await Comment.create({

        Text: content,
        PostedBy:decoded.id,
        System:PostFinded.System,
        Data: time,
        PostID: postId


    })
    }catch(error){
        console.log(`[POST API CreateComment] => `, error)
    }

    let data2 = {

        notifications:{
            postID: postId,
            text: user.name + ' comentou no seu post'
        }
    }
    let data3 = {

        notifications:{
            postID: postId,
            text: user.name + ' comentou em um post'
        }
    }

    try{
        
        result = await Post.findByIdAndUpdate(postId,{$push:{Comments: {Comment:Commented._id}}})

        if(decoded.id != PostFinded.PostedBy._id){
            notification = await User.findByIdAndUpdate(result.PostedBy._id,{$push:{notifications:data2.notifications}})
            //procurar se já existe um
            findCommentedBy = await Post.find({_id:postId , CommentedBy:{$elemMatch:{id:decoded.id}}});

            if(findCommentedBy[0] == null){
                addCommented = await Post.findByIdAndUpdate(postId,{$push:{CommentedBy:{id:decoded.id}}})
            }
            
        }else{
            for(i = 0;i < PostFinded.CommentedBy.length;i++){
                notification = await User.findByIdAndUpdate(PostFinded.CommentedBy[i].id,{$push:{notifications:data3.notifications}})
            }
        }
        
    }catch(error){
        console.log(`[POST API CreateComment] => `, error)
    }

    res.send("COMMENT CREATED")

})

router.get('/Posts', async (req,res)=>{

    const body = req.query

    

    try{

    result = await Post.find({System:body.System})

    //criar um data especifico para enviar as informações para o front

    }catch(error){
        console.log(`[POST API Posts] => `, error)
    }

    let data = []
    
    for( i = result.length-1; i >= 0 ; i--){

        try{ 
            FindedUser = await User.findById(result[i].PostedBy._id)
            data.push({title:result[i].Title,name:FindedUser.name,image:FindedUser.image,id:result[i]._id}) 
        }catch(error){
            console.log(`[POST API Posts] => `, error)
        }
        
    }

    
    
    res.send(data)
    
})
router.get('/Post', async (req,res)=>{

    const body = req.query
    
    try{

    result = await Post.findById(body.PostId)

    }catch(error){
        console.log(`[POST API Post] => `, error)
    }

    let data = [{}]

        try{ 
            findedUser = await User.findById(result.PostedBy._id)
    
            data = {
    
                title:result.Title,
                name:findedUser.name,
                image:findedUser.image,
                message:result.Message,
                data:result.Data,
                system:findedUser.system
                        
            }
            for(i = 0 ;i< result.Comments.length;i++){
                
                
                if(result.Comments[i] != null){
        
                    FindComment = await Comment.findById(result.Comments[i].Comment._id)
                    user2 = await User.findById(FindComment.PostedBy._id)
                
                    if(i==0){

                        data = {
                            ...data,
                            comments: [{
                            image: user2.image,
                            name: user2.name,
                            text: FindComment.Text,
                            data: FindComment.Data,
                            system:user2.system
                        }]
                        }
                    }else{
                        data = {
                            ...data,
                            comments: [...data.comments,{
                            image: user2.image,
                            name: user2.name,
                            text: FindComment.Text,
                            data: FindComment.Data,
                            system:user2.system
                        }]
                        }
                    
                    }
                }
    
            }
    
        }catch(error){
            console.log(`[POST API Post] => `, error)
        }

    res.send(data)
    
})

router.post('/delnotifications', async (req,res)=>{

    const {token,id} = req.body
    
    try {
        const decoded = jwt.verify(token,secret)
        result = await User.findByIdAndUpdate(decoded.id,{$pull:{notifications:{_id: id}}})
 
    } catch (error) {
        console.log(`[POST API delnotifications] => `, error)
    }

    res.send("Post deleted")

})

router.get('/search', async (req,res)=>{

    const text = req.query

    try{

        result = await Post.find({$text:{$search:text[0]}})

    }catch(error){
        console.log(`[POST API search] => `, error)   
    }

    data = []

    for( i = 0; i < result.length ; i++){

        try{ 
            FindedUser = await User.findById(result[i].PostedBy._id)
            data.push({title:result[i].Title,name:FindedUser.name,image:user.image,id:result[i]._id,message:result[i].Message}) 
        }catch(error){
            console.log(`[POST API search] => `, error)
        }
        
    }
    
    res.send(data)

})

router.get('/Getlast', async (req,res)=>{

    try{
        result = await Post.find({})
    }catch(error){
        console.log(`[POST API Getlast] => `, error)   
    }

    data = []
    
    for( i = result.length-1; i > result.length-4 ; i--){

        try{ 
            FindedUser = await User.findById(result[i].PostedBy._id)
            data.push({title:result[i].Title,name:FindedUser.name,image:FindedUser.image,id:result[i]._id}) 
        }catch(error){
            console.log(`[POST API Getlast] => `, error)
        }
        
    }

    res.send(data)

})


module.exports = router