const express = require('express')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/forumv8').then(()=>{
    console.log('DB running, starting server')
    
    const app = express()
    const PORT = 3001;
    const cors = require('cors');
    const UsersController = require('./src/controllers/user')
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))

    app.use(UsersController)

    app.listen(PORT, () => {
        console.log(`API server is running on port ${PORT}`)
    })
}).catch(err=>{
    console.log('Whoops. Occurred an error while trying connect to DB', err)
})
