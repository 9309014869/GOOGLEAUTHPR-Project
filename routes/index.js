var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
require('dotenv').config();
var User=require('./users')
const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: 'rzp_test_GRrwMbNTyF1uR8',
  key_secret: 'MZ6k5NV4MzafPWt4PXorc6Ht',
});
passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'email','profile' ]
},
async function verify(issuer, profile, cb) {
  try{
let existingUser=await User.findOne({email:profile.emails[0].value})
if(existingUser){
  return cb(null,existingUser);
}else{
  let newUser = await User.create({ name: profile.displayName, email: profile.emails[0].value })

  return cb(null,newUser)
}
  }catch(err){
console.log(err)
return cb(err,null)
  }
}
));
/* GET home page. */



router.get('/', function(req, res, next) {
  if(req.user){
  res.render('index', { title: 'Express' });
  }else{
    res.redirect('/login');
  }
});
router.get('/login', function(req, res, next) {
  if(!req.user){
  res.render('login');
  }else{
    res.redirect('/');
  }
});

router.get('/login/federated/google', passport.authenticate('google'));



router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.post('/create/orderId',async(req,res)=>{
  // let product=await product.findOne({_id:res.body.product_id})
  var options = {
    amount: 199*100,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function(err, order) {
    console.log(order);
    res.send(order)
  });
})

router.post("/api/payment/verify",(req,res)=>{
  var razorpayOrderId=req.body.razorpay_order_id;
  var razorpayPaymentId=req.body.response.razorpay_payment_id;
  var signature=req.body.response.razorpay_signature;
  var secret='MZ6k5NV4MzafPWt4PXorc6Ht';
  var { 
    validatePaymentVerification, 
    validateWebhookSignature
   } = require('../node_modules/razorpay/dist/utils/razorpay-utils');
var cheackstates=validatePaymentVerification({"order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret);
console.log(cheackstates);
res.send(cheackstates)
})
module.exports = router;
