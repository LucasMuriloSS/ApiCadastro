const express = require('express')
require("dotenv").config()
const mongoose = require('mongoose')
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
const jwt = require("jsonwebtoken");


mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.5kxocpk.mongodb.net/v8database?retryWrites=true&w=majority`).then(()=>{
    console.log('DB running, starting server')
    
    const app = express();
    const PORT = process.env.PORT || 3001;
    const cors = require('cors');
    const UsersController = require('./src/controllers/user')
    const PostsController = require('./src/controllers/post')
    const CommentController = require('./src/controllers/comments')
   

    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))

    app.use(UsersController)
    app.use(PostsController)
    app.use(CommentController)

    app.listen(PORT, () => {
        console.log(`API server is running on port ${PORT}`)
    })
}).catch(err=>{
    console.log('Whoops. Occurred an error while trying connect to DB', err)
})
