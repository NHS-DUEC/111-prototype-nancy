var express = require('express')
var moment = require('moment-timezone')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Joined up journey - June 2018 +++++++++++++++++++++++++++++++++++++++++++++++
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
    console.log('age: ' + age);

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
    req.session.demographics.age = age;
    req.session.demographics.ageCategory = ageCategory;
  }
  if (req.body['sex']) {
    req.session.demographics.sex = req.body['sex'];
  }
  res.redirect('/finding-pathways/start');
});
