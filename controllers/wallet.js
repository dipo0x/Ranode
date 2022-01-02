const Flutterwave = require('flutterwave-node-v3');
const addFunds = require('../models/add_funds')
const redis = require('redis')

/////////REDIS
const client = redis.createClient()
client.connect()
/////////REDIS END

const flw = new Flutterwave("FLWPUBK_TEST-19449bb3c010c4c190355bb332db3106-X", "FLWSECK_TEST-65325b32187fa4b288001b4fad732313-X");
let tx_ref = Math.floor(Math.random() * 1000000000000);

/////////////////EVEYTHING DEPOSIT/////////////////
exports.chargeCard = async (req, res, next) => {
    const payload = {
        "card_number": req.body.card_number,
        "cvv": req.body.cvv,
        "expiry_month": req.body.expiry_month,
        "expiry_year": req.body.expiry_year,
        "currency": "NGN",
        "amount": req.body.amount,
        ///this is the webhook post & get link
        "redirect_url": "https://fuzzy-bobcat-31.loca.lt/success",
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
        client.del(req.body.data.customer.email)
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

    client.hSet(email, [
        'amount', amount,
        'time', time,
        'tx_ref', tx_ref,
        'processor_response', processor_response,
        ])
    })
  }

module.exports.success = function(req, res, next) {
    client.HGETALL("a@gmail.com").then(obj =>{
        if(obj){
            res.render('wallet/deposit_successful', {data:obj});
        }
        else{
            addFunds.findOne({email:"a@gmail.com"}).then(result=>{
                res.render('wallet/deposit_successful', {data:result});
            })
        }})}

/////////////////EVEYTHING TRANSFER/////////////////
module.exports.transfer = function(req, res, next) {
    res.render('wallet/transfer');
  }

  module.exports.initTrans = async (req, res, next) => {
    try {
        const payload = {
            "account_bank": "044", //This is the recipient bank code. Get list here :https://developer.flutterwave.com/v3.0/reference#get-all-banks
            "account_number": req.body.account_number,
            "amount": req.body.amount,
            "narration": "Ranode transfer to you from" + req.user.FirstName + " " + req.user.Surname,
            "currency": "NGN",
            "reference": "transfer-"+Date.now(),
            "callback_url": "https://localhost:3000/profile",
            "debit_currency": "NGN"
        }
        const response = await flw.

    Transfer.initiate(payload)
            console.log(response);
        } catch (error) {
            console.log(error)
        }

}