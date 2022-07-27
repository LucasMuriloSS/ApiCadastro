const mongoose = require("mongoose")

const schema = mongoose.Schema({
	
    Text:String,
    PostedBy: {type:mongoose.Types.ObjectId,ref:"user"},
    System: String,// subsistema onde o post irá aparecer
    Data: String,
    PostID:{type:mongoose.Types.ObjectId,ref:"post"}

})
schema.index({Text:'text'})
module.exports = mongoose.model("Comment", schema)