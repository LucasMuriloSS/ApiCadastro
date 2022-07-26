const mongoose = require("mongoose")

const schema = mongoose.Schema({
	
    Title:String,
    Message:String,
    PostedBy: {type:mongoose.Types.ObjectId,ref:"user"},
    System: String,// subsistema onde o post irá aparecer
    Data: String,
    CommentedBy:[{
        id: String
    }],
    Comments:[{
        PostedBy:{type:mongoose.Types.ObjectId,ref:"user"},
        Data: String,
        Text:String
    }]

})

module.exports = mongoose.model("Post", schema)