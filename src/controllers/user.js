const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const { json } = require('express'); 
const {parseCookies,nookies} = require('nookies');
const { getMaxListeners } = require('process');
const multer = require('multer');
const { decode } = require('punycode');
const upload =  multer({dest:'uploads/'});

const secret = 'sdfDFsdfFhSdf23SAFSDgjDasdfasd25632F4523F2F3F44533er45F623rg12FDS34r2FfhGADSF23RFw'

router.post('/login', async (req,res)=>{

    const {email, password} = req.body // recebe email e password

    let user = false
    let bodyReturn = {}

    try{
        user = await User.findOne({// busca um usuário com mesmo email
            email: email
        })
    }
    catch(error){
         console.log(`[POST API login] => `, error)
    }
    const isValidUser = user?.password === password // verifica se a senha passada é a mesma que consta no banco

    if(isValidUser){
        bodyReturn = {
            logged: true,
            status: 'success',
            message:'Login successfully',
        }

        try {
            // se for válido cria um token passando um secret e o id do usuário que pode ser descodificado depois
            const secret = 'sdfDFsdfFhSdf23SAFSDgjDasdfasd25632F4523F2F3F44533er45F623rg12FDS34r2FfhGADSF23RFw'
            const token =  jwt.sign(
              {
                id: user._id,
              },
              secret
            );
            bodyReturn = {...bodyReturn, token: token}// adiciona o token gerado ao bodyreturn
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

    const {email, password} = req.body //recebe email e password
    let bodyReturn
    let user


    if(!email || !password){// verifica se email e password foram digitados
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
        if(userFinded && userFinded._id){// verifica se o email já existe no banco
            bodyReturn = {
                registered: !!userFinded._id,
                status: 'failed',
                message: 'User aready exists.'
            }
            res.send(bodyReturn)
            return
        }

        user = await User.create({email: email, password: password})// cria um novo usuário com o email e senha que foram passados
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

router.get('/profile', async (req,res)=>{

    //recebe um token e envia de volta as informações desse usuário

    const body = req.query

    const decoded = jwt.verify(body.token,secret)//decodifica o token

    try{

    result = await User.findById(decoded.id)// procura o usuário pelo id
    }catch(error){
        console.log(`[POST API register] => `, error)
    }
    
    res.send(result)// envia os dados do usuário
    
})

router.post('/edit', async (req,res)=>{

    const {name,phone,mobile,token} = req.body// recebe os dados a serem modificados e o token

    const decoded = jwt.verify(token,secret)// decodifica o token

    let data = {
        name:  name,
        phone: phone,
        mobile: mobile
    }// cria um array com os dados a serem modificados

    try{

    result = await User.findByIdAndUpdate(decoded.id,data)// procura o usúario pelo id e atualiza passando data
    }catch(error){
            console.log(`[POST API register] => `, error)
    }

    res.send("Dados editados")

})

var type = upload.single('file');// usado para ler e salvar o aquivo

router.post('/saveImage', type,  async (req,res) => {

    const token = req.body

    const decoded = jwt.verify(token.token,secret)

    let obj ={
        image:fs.readFileSync(req.file.path),// lê a imagem que foi salva
    }
    try{
       result = await User.findByIdAndUpdate(decoded.id,obj)// procura o usuário pelo id e faz e atualiza a imagem passando obj
    }catch(error){
        console.log(`[POST API register] => `, error)
    }

    await fs.unlinkSync(req.file.path) // apaga a imagem da pasta depois dela ser salva no banco

    res.send("imagem atualizada")
    
})



module.exports = router