const mongoose = require("mongoose")

const schema = mongoose.Schema({
	
	email: String,
	password: String,
	name: String,
	phone: String,
	mobile: String,
	image:  Buffer,
	data: String,
	notifications:[{
		postID: String,
		text: String
	}]
	
})

module.exports = mongoose.model("User", schema)