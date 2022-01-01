var express = require('express');
var router = express.Router();
const views = require('../controllers/users')

/* GET users listing. */
router.get('/register', views.get_register);
router.post('/register', views.register);
router.get('/login', views.get_login);
router.post('/login', views.login);
router.get('/profile', views.profile);
router.get('/logout', views.logout);

module.exports = router;