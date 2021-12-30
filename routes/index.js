var express = require('express');
var router = express.Router();
var views = require('../controllers/index')

/* GET home page. */
router.get('/', views.home);

module.exports = router;
