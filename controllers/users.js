const userData = require('../models/user')
const bcryptjs = require('bcryptjs')
const passport = require('passport')
let LocalStrategy = require('passport-local').Strategy;
const { signup } = require('../utils/register')

/////////LOGIN AUTHENTICATION
passport.serializeUser(function(user, done){
	done(null, user.id)
})

passport.deserializeUser(function(id, done){
	userData.findById(id, function(err, user){
		done(err, user)
	})
})

passport.use(new LocalStrategy(
  function(email, password, done) {
    userData.findOne({ email: email}, function (err, user) {
      if (err) { 
          return done(err); 
        }
      if (!user) { 
      	return done(null, false);
      }
      userData.comparePassword(password, user.password, (err, isMatch)=>{
		if(err) throw err
		if(isMatch){
			return done(null, user)
		}else{
			return done(null, false, {message: 'Invalid Password'})
		        }
	        })
        });
    }
));

exports.register = function(req, res, next) {
    res.render('users/register');
}

exports.post_register = async function(req, res, next) {
    const user = new userData()
    user.FirstName = req.body.FirstName
    user.Surname = req.body.Surname
    user.Number = req.body.Number
    user.Country = req.body.Country
    user.theEmail = req.body.Email
    user.thePassword = await bcryptjs.hash(req.body.password, 10)
    ///////
    const theEmail = req.body.Email
    const thePassword = req.body.password
    const { errors, valid } = signup(theEmail, thePassword);
    userData.findOne({email: theEmail}).then(user=>{
        if(user !== null || !valid){
            errors["email_exists"] = "Email already in use"
            rerender_register(req, res, errors);
        }
        else{
            user.save().then(result=>{
                passport.authenticate('local',{
                    successRedirect: '/profile',
                    failureRedirect: '/login',
                    failureFlash: true
                })(req, res, next);
            })
        }
    })
}