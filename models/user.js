const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const userData= new mongoose.Schema({
	FirstName: {
		type: String,
	},
	Surname: {
		type: String,
	},
    Number: {
		type: Number, default: 0
	},
    Email: {
		type: String,
	},
	Country:{
        type:String,
    },
	Password: {
		type: String,
	},
    GovernmentIDImage: {
		type: String,
	},
})
module.exports = mongoose.model('User', userData)

module.exports.comparePassword = (candidatePassword, hash, callback)=>{
	bcryptjs.compare(candidatePassword, hash, (err, isMatch)=>{
		if(err) return callback(err)
		callback(null, isMatch)
	})
}