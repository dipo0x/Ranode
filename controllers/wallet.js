const Flutterwave = require('flutterwave-node-v3');
const addFunds = require('../models/add_funds')
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
        "redirect_url": "http://9d62-197-210-84-181.ngrok.io/success",
        "fullname": req.user.FirstName + " " + req.user.Surname,
        "email": req.user.Email,
        "phone_number": req.user.Number,
        "enckey": "FLWSECK_TESTa501ad07503c",
        "tx_ref": tx_ref,
    
    }
    try {
        const response = await flw.Charge.card(payload)
        if (response.status == 'error'){
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
        const Balance = req.user.balance + response.data["amount"]
        req.user.balance = Balance
        req.user.save()
    } catch (error) {
        console.log(error)
    }
}

module.exports.add_funds = function(req, res, next) {
    res.render('wallet/add-funds');
  }

const add_funds = function(req, res, errors) {
    res.render('wallet/add-funds', {errors:errors});
  }

module.exports.post_success = function(req, res, next) {
    addFunds.findOneAndDelete({email:"a@gmail.com"}).then(()=>{
        const email = req.body.data.customer.email
        const amount =  req.body.data.amount
        const time = req.body.data.created_at
        const tx_ref = req.body.data.tx_ref
        const processor_response = req.body.data.processor_response
        const addFundsData = new addFunds({
            email: email,
            amount: amount,
            time: time,
            tx_ref: tx_ref,
            processor_response: processor_response
        })
        addFundsData.save()
        })
  }

module.exports.success = function(req, res) {
    addFunds.findOne({email:"a@gmail.com"}).then(result=>{
        res.render('wallet/deposit_successful', {data:result});
    })
  }