const mongoose = require('mongoose')

const addFunds= new mongoose.Schema({
	email:{
		type:String
	},
	amount: {
		type:Number
	},
	time: {
		type:String
	},
	tx_ref: {
		type:String
	},
    processor_response: {
		type: String
	},
})
module.exports = mongoose.model('AddFunds', addFunds)