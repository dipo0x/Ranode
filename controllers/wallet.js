const Flutterwave = require('flutterwave-node-v3');
// const userData = require('../models/user')

const flw = new Flutterwave("FLWPUBK_TEST-19449bb3c010c4c190355bb332db3106-X", "FLWSECK_TEST-65325b32187fa4b288001b4fad732313-X");
let tx_ref = Math.floor(Math.random() * 1000000000000);

exports.chargeCard = async (req, res, next) => {
    const payload = {
        "card_number": req.body.card_number,
        "cvv": req.body.cvv,
        "expiry_month": req.body.expiry_month,
        "expiry_year": req.body.expiry_year,
        "currency": "NGN",
        "amount": req.body.amount,
        "redirect_url": "https://localhost:3000/success",
        "fullname": req.user.FirstName + " " + req.user.Surname,
        "email": req.user.Email,
        "phone_number": req.user.Number,
        "enckey": "FLWSECK_TESTa501ad07503c",
        "tx_ref": tx_ref,
    
    }
    try {
        const response = await flw.Charge.card(payload)
        if (response.status == 'error'){
            console.log(response)
            const errors = {};
            errors["error"] = response.message
            add_funds(req, res, errors);
        }
        if (response.meta.authorization.mode === 'pin') {
            let payload2 = payload
            payload2.authorization = {
                "mode": "pin",
                "fields": [
                    "pin"
                ],
                "pin": 3310
            }
            const reCallCharge = await flw.Charge.card(payload2)
            const callValidate = await flw.Charge.validate({
                "otp": "12345",
                "flw_ref": reCallCharge.data.flw_ref
            })
        }
        if (response.meta.authorization.mode === 'redirect') {
            var url = response.meta.authorization.redirect
            res.redirect(url)
        }
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

module.exports.add_funds = function(req, res, next) {
    res.render('wallet/add-funds');
  }

const add_funds = function(req, res, errors) {
    res.render('wallet/add-funds');
  }

module.exports.success = function(req, res, next) {
    res.render('wallet/deposit_successful');
  }