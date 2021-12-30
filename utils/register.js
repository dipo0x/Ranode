const validator = require('validator')

module.exports.signup = (email, password) => {
	const errors = {};
	if (!validator.isEmail(email)){
		errors["email"] = "Invalid email";
		}
	if(!validator.isAscii(password)){
		errors["password"] = "Not a valid password";	
		}
	if(!validator.isLength(password, {min:4, max: 12})){
		errors["password"] = "Password ensure that your password has a minimum of 4 char and maximum of 12 char";	
	}
    return{
        errors,
        valid: Object.keys(errors).length < 1
    }
}