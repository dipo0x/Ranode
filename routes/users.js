var express = require('express');
var router = express.Router();
const views = require('../controllers/users')

/* GET users listing. */
router.get('/register', views.register);
router.post('/register', views.post_register);
router.get('/login', views.login);
router.post('/login', views.post_login);

module.exports = router;