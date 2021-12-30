const mongoose = require('mongoose')

module.exports.database = ()=>{
    mongoose.connect('mongodb://localhost:27017/ranode', { useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
	if (!err){console.log('MongoDB connected')}
	else {console.log('Error : ' + err)}
})}