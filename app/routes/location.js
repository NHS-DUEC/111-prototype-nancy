var express = require('express')
var moment = require('moment-timezone')
var request = require('request')
var naturalSort = require('javascript-natural-sort')
var router = express.Router()

module.exports = router;

router.post('/start', function(req, res) {
  if (req.body['location'] === 'home') {
    res.redirect('/z-temp/location/at-home');
  } else {
    res.redirect('/z-temp/location/not-at-home');
  }
});

router.post('/home-postcode', function(req, res) {
  res.send('Thanks. <a href="/">Go to index page</a>');
});

router.post('/away-postcode', function(req, res) {
  res.send('Thanks. <a href="/">Go to index page</a>');
});

router.post('/geo', function(req, res) {
  res.send('Thanks. <a href="/">Go to index page</a>');
});
