var express = require('express')
var moment = require('moment-timezone')
var request = require('request')
var naturalSort = require('javascript-natural-sort')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Journey to questions - August 2018 ++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/demographics', function(req, res) {
  // "Adult" is 16+
  // Set a default here if there's a lack of req.query
  // Male
  // Adult (40)
  if (!req.session.demographics) {
    // zero out a namespaced session obj with defaults
    req.session.demographics = {};
    req.session.demographics.sex = 'Male';
    req.session.demographics.age = '40';
    req.session.demographics.ageCategory = 'Adult';
    req.session.demographics.dob = {};
    req.session.demographics.dob.day = '23';
    req.session.demographics.dob.month = '5';
    req.session.demographics.dob.year = '1977';
    req.session.demographics.dob.supplied = false;
  }
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

  } else if (req.body['age'] !== '') {

    var age = Number(req.body['age']);

    var ageCategory = 'Adult';
    if (age < 16) {
      ageCategory = 'Child';
    }

    req.session.demographics.dob.year = '';
    req.session.demographics.dob.month = '';
    req.session.demographics.dob.day = '';
    req.session.demographics.dob.supplied = false;
    req.session.demographics.age = age;
    req.session.demographics.ageCategory = ageCategory;
  }
  if (req.body['sex']) {
    req.session.demographics.sex = req.body['sex'];
  }
  res.redirect('/start/where-are-you');
});

// -----------------------------------------------------------------------------

router.post('/where-are-you', function(req, res) {
  if (req.body['location'] === 'home') {
    res.redirect('/start/at-home');
  } else if (req.body['location'] === 'away') {
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
  res.redirect('/finding-pathways/start');
});
