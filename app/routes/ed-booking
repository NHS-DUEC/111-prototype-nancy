var express = require('express')
var router = express.Router()

module.exports = router

//Slot selection//
router.post('/booking-into-ed/slot-variations/pick-slot-1-1hour', function(req,res){
  req.session.timeslot = req.body['slot']
  res.redirect('/111-first/personal-details/proxy');
});

router.post('/booking-into-ed/slot-variations/pick-slot-1-2hour', function(req,res){
  req.session.timeslot = req.body['slot']
  res.redirect('/111-first/personal-details/proxy');
});

router.post('/booking-into-ed/slot-variations/pick-slot-12-1hour', function(req,res){
  req.session.timeslot = req.body['slot']
  res.redirect('/111-first/personal-details/proxy');
});

router.post('/booking-into-ed/slot-variations/pick-slot-12-2hour', function(req,res){
  req.session.timeslot = req.body['slot']
  res.redirect('/111-first/personal-details/proxy');
});

//proxy//
router.post('/personal-details/proxy', function(req, res) {
  req.session.proxy = req.body['proxy']
  if (req.body['proxy'] === "false") {
    res.redirect('name');
  }
  else {
    res.redirect('3rd/name-3rd');
  }
});
//Name//
router.post('/personal-details/name', function(req, res){
  req.session.firstname = req.body['firstname']
  req.session.lastname = req.body['secondname']
  req.session.proxyDetails = "x"
  res.redirect('date-of-birth');
});

router.post('/personal-details/3rd/name-3rd', function(req, res){
  req.session.firstname = req.body['firstname']
  req.session.lastname = req.body['secondname']
  res.redirect('date-of-birth-3rd');
});

//DOB//
router.post('/personal-details/date-of-birth', function(req,res){
  req.session.day = req.body['dob-day']
  req.session.month = req.body['dob-month']
  req.session.year = req.body['dob-year']
  res.redirect('phone-number');
});

router.post('/personal-details/3rd/date-of-birth-3rd', function(req,res){
  req.session.day = req.body['dob-day']
  req.session.month = req.body['dob-month']
  req.session.year = req.body['dob-year']
  res.redirect('phone-number-3rd');
});

//phone number//
router.post('/personal-details/phone-number', function(req,res){
  req.session.number = req.body['tel']
  res.redirect('is-home-postcode');
});

router.post('/personal-details/3rd/phone-number-3rd', function(req,res){
  req.session.number = req.body['tel']
  res.redirect('is-home-postcode-3rd');
});

//home postcode//
router.post('/personal-details/is-home-postcode', function(req,res){
  req.session.location = req.body['location']
  if (req.body['location'] === "home"){
    res.redirect('contact-methods');
  }
  else{
    res.redirect('postcode-home');
  }
});

router.post('/personal-details/3rd/is-home-postcode-3rd', function(req,res){
  req.session.location = req.body['location']
  if (req.body['location'] === "home"){
    res.redirect('proxy-who-send-details');
  }
  else{
    res.redirect('postcode-home-3rd');
  }
});

//3rd person only - who to send details to//
router.post('/personal-details/3rd/proxy-who-send-details', function(req,res){
  req.session.proxyDetails = req.body['proxyDetails']
  if(req.body['proxyDetails'] === "me"){
    res.redirect('/111-first/personal-details/contact-methods');
  }
    else{
      res.redirect('contact-methods-3rd');
    }
});

//postcode home//
router.post('/personal-details/postcode-home', function(req,res){
  req.session.postcode = req.body['postcode']
  res.redirect('contact-methods');
});

router.post('/personal-details/3rd/postcode-home-3rd', function(req,res){
  req.session.postcode = req.body['postcode']
  res.redirect('proxy-who-send-details');
});

//contact methods//
router.post('/personal-details/contact-methods', function(req,res){
  req.session.email = req.body['emailAdd']
  req.session.tel = req.body['tel']
  req.session.none = req.body['none']

  if (req.body['emailAdd'] === "email" && req.body['tel'] === "smsMessage" && req.session.number.startsWith("07") === true){
    res.redirect('email');
  }
  else if (req.body['emailAdd'] === "email" && req.body['tel'] === "smsMessage" && req.session.number.startsWith("07") === false){
    res.redirect('email-both');
  }
  else if(req.body['emailAdd'] === "email"){
    res.redirect('email');
  }
  else if (req.body['tel'] === "smsMessage" && req.session.number.startsWith("07") === true){
    res.redirect('check-details');
  }
  else if (req.body['tel'] === "smsMessage"){
    res.redirect('mobile-number');
  }
  else{
    res.redirect('check-details');
  }
});

router.post('/personal-details/3rd/contact-methods-3rd', function(req,res){
  req.session.email = req.body['emailAdd']
  req.session.tel = req.body['tel']
  req.session.none = req.body['none']

  if (req.body['emailAdd'] === "email" && req.body['tel'].startsWith("smsMessage") && req.session.number.startsWith("07") === true){
    res.redirect('email-3rd');
  }
  else if (req.body['emailAdd'] === "email" && req.body['tel'].startsWith("smsMessage") && req.session.number.startsWith("07") === false){
    res.redirect('email-3rd-both');
  }
  else if(req.body['emailAdd'] === "email"){
    res.redirect('email-3rd');
  }
  else if (req.body['tel'].startsWith("smsMessage") && req.session.number.startsWith("07") === true){
    res.redirect('check-details-3rd');
  }
  else if (req.body['tel'] === "smsMessage"){
    res.redirect('mobile-number-3rd');
  }
  else{
    res.redirect('check-details-3rd');
  }
});

//mobile number collection//
router.post('/personal-details/mobile-number', function(req,res){
  req.session.mobileNumber = req.body['tel']
  if( req.session.proxyDetails.includes("me")){
    res.redirect('/111-first/personal-details/3rd/check-details-3rd');
  }
  else{
    res.redirect('check-details');
  }
});

router.post('/personal-details/3rd/mobile-number-3rd', function(req,res){
  req.session.mobileNumber = req.body['tel']
  res.redirect('check-details-3rd');
});

//Email collection//
router.post('/personal-details/email', function(req,res){
  req.session.email = req.body['email']
  if( req.session.proxyDetails.includes("me")){
    res.redirect('/111-first/personal-details/3rd/check-details-3rd');
    }
    else{
      res.redirect('check-details');
    }
});

router.post('/personal-details/email-both', function(req,res){
  req.session.email = req.body['email']
  res.redirect('mobile-number');
});

router.post('/personal-details/3rd/email-3rd-both', function(req,res){
  req.session.email = req.body['email']
  res.redirect('mobile-number-3rd');
});

router.post('/personal-details/3rd/email-3rd', function(req,res){
  req.session.email = req.body['email']
  res.redirect('check-details-3rd');
});
