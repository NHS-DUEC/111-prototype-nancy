var express = require('express')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Prescriptions MVP - March 2019 ++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/', function (req, res) {
  res.redirect('/emergency-prescription-wizard/start');
});

router.get('/start', function (req, res) {
  res.render('emergency-prescription-wizard/start.html');
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/regular-avenues', function (req, res) {
  if (req.body['regular-avenues-open'] === 'true') {
    res.redirect('regular-avenues-open');
  } else if (req.body['regular-avenues-open'] === 'false') {
    res.redirect('controlled-meds')
  } else {
    res.render('emergency-prescription-wizard/regular-avenues.html', {
      error : true
    });
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/controlled-meds', function (req, res) {
  if (req.body['controlled-meds'] === 'true') {
    res.redirect('controlled-meds-required');
  } else if (req.body['controlled-meds'] === 'false') {
    res.redirect('time-till-dose')
  } else if (req.body['controlled-meds'] === 'unknown') {
    res.redirect('controlled-meds-unsure')
  } else {
    res.render('emergency-prescription-wizard/controlled-meds.html', {
      error : true
    });
  }
});

router.post('/controlled-meds-reiterate', function (req, res) {
  if (req.body['controlled-meds'] === 'true') {
    res.redirect('controlled-meds-required');
  } else if (req.body['controlled-meds'] === 'false') {
    res.redirect('time-till-dose')
  } else if (req.body['controlled-meds'] === 'unknown') {
    res.redirect('time-till-dose')
  } else {
    res.render('emergency-prescription-wizard/controlled-meds-reiterate.html', {
      error : true
    });
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/time-till-dose', function (req, res) {
  if (req.body['next-dose-due']) {
    res.redirect('get-help-from-a-service');
  } else {
    res.render('emergency-prescription-wizard/time-till-dose.html', {
      error : true
    });
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// NUMSAS referral feature - March 2019 ++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/numsas-start', function(req, res) {
  // zero out a namespaced session obj
  req.session.numsas = {};
  req.session.numsas.name = {};
  req.session.numsas.name.firstname = '';
  req.session.numsas.name.secondname = '';
  req.session.numsas.postcode = '';
  req.session.numsas.tel = '';
  req.session.numsas.complete = false;
  res.redirect('numsas-name');
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.post('/numsas-name', function(req, res) {
  var error_present = false;
  var error_firstname = false;
  var error_lastname = false;

  if (req.body['firstname'] !== '' || req.body['secondname'] !== '') {
    // If there's value in either field then do the error check
    if (req.body['firstname'] === '') {
      error_firstname = true;
      error_present = true;
    }
    if (req.body['secondname'] === '') {
      error_lastname = true;
      error_present = true;
    }
  } else {
    error_present = true;
    error_firstname = true;
    error_lastname = true;
  }

  req.session.numsas.name.firstname = req.body['firstname'];
  req.session.numsas.name.secondname = req.body['secondname'];

  if (error_present !== true) {
    // Do we have a DOB?
    if (req.session.demographics.dob.supplied === true) {
      res.redirect('numsas-route-postcode');
    } else {
      // route through a DOB ask
      res.redirect('numsas-dob');
    }
  } else {
    res.render('emergency-prescription-wizard/numsas-name.html', {
      error: {
        firstname: error_firstname,
        lastname: error_lastname
      }
    });
  }
});

// -----------------------------------------------------------------------------
// Catch DOB if it wasn't given at the start
router.post('/numsas-dob', function(req, res) {
  var error_present = false;

  var day = req.body['dob-day'];
  var month = req.body['dob-month'];
  var year = req.body['dob-year'];

  req.session.demographics.dob.year = year;
  req.session.demographics.dob.month = month;
  req.session.demographics.dob.day = day;

  if (day !== '' || month !== '' || year !== '') {
    // If there's value in any field then do the error check
    if (day === '') {
      error_present = true;
    }
    if (month === '') {
      error_present = true;
    }
    if (year === '') {
      error_present = true;
    }
  }

  if (error_present === true) {
    res.render('emergency-prescription-wizard/numsas-dob.html', {
      error: true
    });
  } else {
    req.session.demographics.dob.supplied = true;
    res.redirect('numsas-route-postcode');
  }
});

// -----------------------------------------------------------------------------
// Handle postcode scenarios
router.get('/numsas-route-postcode', function(req, res) {
  // 1: at home and have given a postcode
  if (req.session.postcodesource === 'user' && req.session.userlocation === 'home') {
    res.redirect('numsas-phone');
  }
  // 2: somewhere else and have given a postcode
  else if (req.session.postcodesource === 'user' && req.session.userlocation === 'away') {
    res.redirect('numsas-postcode');
  }
  // 3: somewhere else and have given a geolocation - ie we're not 100%
  else {
    res.redirect('numsas-postcode');
  }
});

router.post('/numsas-postcode', function(req, res) {
  if (req.body['postcode'] !== '') {
    req.session.numsas.postcode = req.body['postcode'];
    res.redirect('numsas-phone');
  } else {
    res.render('emergency-prescription-wizard/numsas-postcode.html', {
      error: true
    });
  }
});

// -----------------------------------------------------------------------------

router.post('/numsas-phone', function(req, res) {
  if (req.body['tel'] !== '') {
    req.session.numsas.tel = req.body['tel'];
    req.session.numsas.complete = true;
    res.redirect('numsas-confirmation');
  } else {
    res.render('emergency-prescription-wizard/numsas-phone.html', {
      error: true
    });
  }
});
