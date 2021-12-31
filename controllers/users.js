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
    const FirstName = req.body.FirstName
    const Surname = req.body.Surname
    const Number = req.body.Number
    const Country = req.body.Country
    const theEmail = req.body.Email
    const thePassword = req.body.password
    const newPassword = await bcryptjs.hash(req.body.password, 10)
    ///////
    const { errors, valid } = signup(theEmail, thePassword);
    userData.findOne({Email: theEmail}).then(user=>{
        if(user !== null){
            errors["email_exists"] = "Email already in use"
            rerender_register(req, res, errors);
        }
        else{
            if(!valid){
                rerender_register(req, res, errors);
        }
        else{
            const newUser = new userData({
                FirstName: FirstName,
                Surname: Surname,
                Number: Number,
                Country: Country,
                Email: theEmail,
                Password: newPassword,
            })
            newUser.save().then(result=>{
                passport.authenticate('local',{
                    successRedirect: '/profile',
                    failureRedirect: '/login',
                    failureFlash: true
                })(req, res, next);
            })
        }
    }
})
}

exports.login = function(req, res, next) {
    res.render('users/login');
}

exports.post_login = function(req, res, next) {
    passport.authenticate('local',{
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
}

const rerender_register = function(req, res, errors) {
    res.render('users/register', {errors});
}