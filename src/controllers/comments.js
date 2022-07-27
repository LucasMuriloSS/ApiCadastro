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

router.get('/GetlastComments', async (req,res)=>{

    try{
        result = await Comment.find({})
    }catch(error){
        console.log(`[POST API GetlastComments] => `, error)   
    }

    data = []
    
    for( i = result.length-1; i > result.length-4 ; i--){

        try{ 
            user = await User.findById(result[i].PostedBy._id)
            data.push({name:user.name,image:user.image,text:result[i].Text,id:result[i].PostID}) 
        }catch(error){
            console.log(`[POST API GetlastComments] => `, error)
        }
        
    }

    res.send(data)

})

module.exports = router