const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const addFunds= new mongoose.Schema({
	card_number: {
		Number, default: 0
	},
	expiry_month: {
		Number, default: 0
	},
    expiry_year: {
		type: Number, default: 0
	},
    amount: {
		Number, default: 0
	},
	tx_ref:{
		type: Number, default: 0
	}
})
module.exports = mongoose.model('AddFunds', addFunds)