# Ranode

A simple E-wallet which allows users to deposit and transfer money from and to Nigeria banks

# Installation
1. [NodeJS](https://nodejs.org/en/download/)
2. [Express JS](https://expressjs.com/en/starter/generator.html)
3. [Flutterwave NodeJS SDK](https://github.com/Flutterwave/Flutterwave-node-v3)

# Getting Started
Clone the repo and install all your dependeincies with ```npm install ```

You will also need to get your MongoDB server running. Use online cluster [here](https://account.mongodb.com/account/login) or download [MongoDB Compass](https://www.mongodb.com/try/download/enterprise). Finally, basic knowledge of Redis is required

# How it works
To access any activity, you need to sign up at first in the '{domain}/register' route <img width="1440" alt="Screenshot 2022-01-02 at 2 23 31 PM" src="https://user-images.githubusercontent.com/63419117/147877222-341067bc-38e5-464a-b35e-f80adfda9bc8.png">
You will get error message for any invalid input. After a succcessful signup, you will be redirected to the login page where you can login with your details

For the payment part, you can test deposit with this information
```javascript
"Card number: 4242 4242 4242 4242
Cvv: 812,
Pin: 3310
Expiry: 01/31
OTP: 12345",
```
# Webhook
If y'll be using Ngrok, firstly, startup your ngrok server. If you dont't know how to do so, head over to https://ngrok.com/download for proper tutorial. After yve gotten your tunnel link or any live server url(Your website URL should be used in production), head on to your flutterwave dashboard and insert it to your tunnel link in your Webhook Settings. Also, use it in the payload JSON under ChargeCard in the Wallet Controller
<img width="1440" alt="137269128-f7cbd9a9-5c64-4d1c-9a11-b8825779e8fc" src="https://user-images.githubusercontent.com/63419117/147877512-9bb06a94-d036-45bb-9d48-66cb50187a73.png">

# Disclaimer
Transfer won't work unless you use your verified Flutterwave account. To understand better, click [here](https://support.flutterwave.com/en/articles/3632712-getting-verified-on-flutterwave)
