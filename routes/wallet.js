var express = require('express');
var router = express.Router();
const views = require('../controllers/wallet.js')
const auth = require('../middleware/hasAuth')

/* GET users listing. */
router.get('/add-funds', auth, views.add_funds);
router.post('/add-funds', auth, views.chargeCard);
router.post('/success?:slug', views.success);

module.exports = router;