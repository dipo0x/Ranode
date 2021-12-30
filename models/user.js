const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

var userData= new mongoose.Schema({
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
    GovernmentIDImage: {
		type: String,
	},
    Country:{
        String
    }
})
module.exports = mongoose.model('User', userData)

module.exports.comparePassword = (candidatePassword, hash, callback)=>{
	bcryptjs.compare(candidatePassword, hash, (err, isMatch)=>{
		if(err) return callback(err)
		callback(null, isMatch)
	})
}