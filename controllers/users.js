const userData = require('../models/user')
const bcryptjs = require('bcryptjs')
const passport = require('passport')
const { signup, LoginErrors } = require('../utils/register')
let flash = require('connect-flash');
let LocalStrategy = require('passport-local').Strategy;

/////////LOGIN AUTHENTICATION
passport.serializeUser(function(user, done){
	done(null, user.id)
})
passport.deserializeUser(function(id, done){
	userData.findById(id, function(err, user){
		done(err, user)
	})
})
passport.use(new LocalStrategy({
    usernameField: 'Email',
    passwordField:'Password'
    },
  function(Email, Password, done) {
    userData.findOne({ Email: Email}, function (err, user) {
      if (err) { 
          return done(err); 
        }
      if (!user) { 
      	return done(null, false);
      }
      userData.comparePassword(Password, user.Password, (err, isMatch)=>{
		if(err) throw err
		if(isMatch){
			return done(null, user)
		}else{
            console.log("Incorrect password")
		        }
	        })
        });
    }
));

exports.get_register = function(req, res, next) {
    res.render('users/register');
}

exports.register = async function(req, res, next) {
    const FirstName = req.body.FirstName
    const Surname = req.body.Surname
    const Number = req.body.Number
    const Country = req.body.Country
    const theEmail = req.body.Email
    const thePassword = req.body.Password
    const newPassword = await bcryptjs.hash(req.body.Password, 10)
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
            newUser.save()
            res.redirect('/login');
        }
    }
})
}

const rerender_register = function(req, res, errors) {
    res.render('users/register', {errors});
}

exports.get_login = function(req, res, next) {
    res.render('users/login', {body:req.body});
}

exports.login = function(req, res, next) {
    const email = req.body.Email
    const theErrors = {};
    userData.findOne({ Email: email}).then(user=>{
        if(user == null){
            theErrors["email"] = 'Incorrect email'
            rerender_login(req, res, theErrors)
        }})
    passport.authenticate('local',{
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
}

const rerender_login = function(req, res, errors) {
    res.render('users/login', {errors:errors});
}

exports.profile = function(req, res) {
    if(req.user){
    console.log(req.user)
    userData.findOne({username : req.user.username}).then(user=>{
        res.render('users/profile', {user: user});
    })}
    else{
        res.redirect('/login')
    }
}