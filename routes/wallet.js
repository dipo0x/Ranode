var express = require('express');
var router = express.Router();
const views = require('../controllers/wallet.js')
const {hasAuth} = require('../middleware/hasAuth')

/* GET users listing. */
router.get('/add-funds', hasAuth, views.add_funds);
router.post('/add-funds', hasAuth, views.chargeCard);
router.post('/success', views.post_success);
router.get('/success?:slug', views.success);
module.exports = router;