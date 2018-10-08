var express = require('express')
var moment = require('moment-timezone')
var router = express.Router()

module.exports = router

router.post('/date-of-birth', function(req, res) {
  if (!req.session.demographics) {
    req.session.demographics = {};
    req.session.demographics.dob = {};
  }
  var url = '/start/sex';
  if (req.body['dob-day'] !== '' && req.body['dob-month'] !== '' && req.body['dob-year'] !== '') {
    var year = req.body['dob-year']
    var month = req.body['dob-month']
    var day = req.body['dob-day']
    var dob = moment().set({
      'year': year,
      'month': month,
      'date': day
    });
    var age = moment().diff(dob, 'years')
    var ageCategory = 'Adult';
    if (age < 16) {
      ageCategory = 'Child';
    }
    req.session.demographics.dob.year = year;
    req.session.demographics.dob.month = month;
    req.session.demographics.dob.day = day;
    req.session.demographics.dob.supplied = true;
    req.session.demographics.age = age;
    req.session.demographics.ageCategory = ageCategory;
    res.redirect(url);
  } else if (req.body['age'] !== '') {
    var age = Number(req.body['age']);
    var ageCategory = 'Adult';
    if (age < 16) {
      ageCategory = 'Child';
    }
    req.session.demographics.dob.supplied = false;
    req.session.demographics.age = age;
    req.session.demographics.ageCategory = ageCategory;
    res.redirect(url);
  } else {
    res.render('start/date-of-birth.html', {
      error : true
    });
  }
});

router.post('/sex', function(req, res) {
  if (req.body['sex']) {
    req.session.demographics.sex = req.body['sex'];
    res.redirect('/start/where-are-you');
  } else {
    res.render('start/sex.html', {
      error : true
    });
  }
});

// -----------------------------------------------------------------------------

router.post('/where-are-you', function(req, res) {
  if (req.body['location'] === 'home') {
    req.session.userlocation = 'home';
    res.redirect('/start/at-home');
  } else if (req.body['location'] === 'away') {
    req.session.userlocation = 'away';
    res.redirect('/start/not-at-home');
  } else {
    res.render('start/where-are-you.html', {
      error : true
    });
  }
});

// -----------------------------------------------------------------------------

router.post('/at-home', function(req, res) {
  if (req.body['postcode'] !== '') {
    req.session.postcode = req.body['postcode'];
    req.session.postcodesource = 'user';
    res.redirect('/finding-pathways/start');
  } else {
    res.render('start/at-home.html', {
      error : true
    });
  }
});

// -----------------------------------------------------------------------------

router.post('/not-at-home', function(req, res) {
  if (req.body['knows-postcode'] === 'true') {
    res.redirect('/start/postcode-away');
  } else if (req.body['knows-postcode'] === 'false') {
    if (req.body['geo-capable'] === 'true') {
      res.redirect('/start/geo-attempt');
    } else {
      res.redirect('/start/location-dead-end')
    }
  } else {
    res.render('start/not-at-home.html', {
      error : true
    });
  }
});

// -----------------------------------------------------------------------------

router.post('/postcode-away', function(req, res) {
  if (req.body['postcode'] !== '') {
    req.session.postcode = req.body['postcode'];
    req.session.postcodesource = 'user';
    res.redirect('/finding-pathways/start');
  } else {
    res.render('start/postcode-away.html', {
      error : true
    });
  }
});

// -----------------------------------------------------------------------------

router.post('/geo-attempt', function(req, res) {
  req.session.postcode = req.body['postcode'];
  req.session.postcodesource = 'geolocation';
  res.redirect('/finding-pathways/start');
});
