var express = require('express');
var router = express.Router();
const views = require('../controllers/wallet.js')
const {hasAuth} = require('../middleware/hasAuth')

/* EVERYTHING DEPOSIT */
router.get('/add-funds', hasAuth, views.add_funds);
router.post('/add-funds', hasAuth, views.chargeCard);
router.post('/success', views.post_success);
router.get('/success', views.success);

/* EVERYTHING TRANSFER */
router.get('/transfer', hasAuth, views.transfer);
router.post('/transfer', hasAuth, views.initTrans);
module.exports = router;