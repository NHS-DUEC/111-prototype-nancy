var express = require('express')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Prescriptions "goto" and CAS examples - May 2019 ++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/numsas-journey', function (req, res) {
  req.session.emergency_prescription_journey_type = 'numsas';
  res.redirect('/start');
});

router.get('/goto-journey', function (req, res) {
  req.session.emergency_prescription_journey_type = 'goto';
  res.redirect('/start');
});

router.get('/cas-journey', function (req, res) {
  req.session.emergency_prescription_journey_type = 'cas';
  res.redirect('/start');
});

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
    res.redirect('time-till-dose')
  } else {
    res.render('emergency-prescription-wizard/regular-avenues.html', {
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
// NUMSAS or CAS referral feature - May 2019 +++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// 1. NUMSAS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/service/numsas/numsas-start', function(req, res) {
  // zero out a namespaced session obj
  req.session.pharmacy = {};
  req.session.pharmacy.name = {};
  req.session.pharmacy.name.firstname = '';
  req.session.pharmacy.name.secondname = '';
  req.session.pharmacy.postcode = '';
  req.session.pharmacy.tel = '';
  res.render('emergency-prescription-wizard/service/numsas/numsas-introduction.html');
});

// 2. CAS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/service/cas/cas-start', function(req, res) {
  // zero out a namespaced session obj
  req.session.pharmacy = {};
  req.session.pharmacy.name = {};
  req.session.pharmacy.name.firstname = '';
  req.session.pharmacy.name.secondname = '';
  req.session.pharmacy.postcode = '';
  req.session.pharmacy.tel = '';
  res.render('emergency-prescription-wizard/service/cas/cas-start.html');
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Pharmacy data gathering - May 2019 ++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// phone
// name
// dob
// postcode

router.post('/service/user-info/phone', function(req, res) {
  if (req.body['tel'] !== '') {
    req.session.pharmacy.tel = req.body['tel'];
    req.session.pharmacy.complete = true;
    res.redirect('/emergency-prescription-wizard/service/user-info/name');
  } else {
    res.render('emergency-prescription-wizard/service/user-info/phone.html', {
      error: true
    });
  }
});

router.post('/service/user-info/name', function(req, res) {
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

  req.session.pharmacy.name.firstname = req.body['firstname'];
  req.session.pharmacy.name.secondname = req.body['secondname'];

  if (error_present !== true) {
    // Do we have a DOB?
    if (req.session.demographics.dob.supplied === true) {
      res.redirect('/emergency-prescription-wizard/service/user-info/route-postcode');
    } else {
      // route through a DOB ask
      res.redirect('/emergency-prescription-wizard/service/user-info/dob');
    }
  } else {
    res.render('emergency-prescription-wizard/service/user-info/name.html', {
      error: {
        firstname: error_firstname,
        lastname: error_lastname
      }
    });
  }
});

// -----------------------------------------------------------------------------
// Catch DOB if it wasn't given at the start
router.post('/service/user-info/dob', function(req, res) {
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
    res.render('emergency-prescription-wizard/service/user-info/dob.html', {
      error: true
    });
  } else {
    req.session.demographics.dob.supplied = true;
    res.redirect('/emergency-prescription-wizard/service/user-info/route-postcode');
  }
});

// -----------------------------------------------------------------------------
// Handle postcode scenarios
router.get('/service/user-info/route-postcode', function(req, res) {
  // 1: at home and have given a postcode
  if (req.session.postcodesource === 'user' && req.session.userlocation === 'home') {
    res.redirect('/emergency-prescription-wizard/service/user-info/submit');
  }
  // 2: somewhere else and have given a postcode
  else if (req.session.postcodesource === 'user' && req.session.userlocation === 'away') {
    res.redirect('/emergency-prescription-wizard/service/user-info/postcode');
  }
  // 3: somewhere else and have given a geolocation - ie we're not 100%
  else {
    res.redirect('/emergency-prescription-wizard/service/user-info/postcode');
  }
});

router.post('/service/user-info/postcode', function(req, res) {
  if (req.body['postcode'] !== '') {
    req.session.pharmacy.postcode = req.body['postcode'];
    res.redirect('/emergency-prescription-wizard/service/user-info/submit');
    //res.redirect('numsas-confirmation');
  } else {
    res.render('emergency-prescription-wizard/service/user-info/postcode.html', {
      error: true
    });
  }
});

// -----------------------------------------------------------------------------

router.get('/service/user-info/submit', function(req, res) {
  if (req.query.flush) {
    // suppress the object from display
    // zero out a namespaced session obj
    req.session.pharmacy = {};
    req.session.pharmacy.name = {};
    req.session.pharmacy.name.firstname = '';
    req.session.pharmacy.name.secondname = '';
    req.session.pharmacy.postcode = '';
    req.session.pharmacy.tel = '';
    req.session.pharmacy.complete = false;
  }
  if (req.session.emergency_prescription_journey_type === 'numsas') {
    res.redirect('/emergency-prescription-wizard/service/numsas/numsas-service-view-stage-2');
  } else if (req.session.emergency_prescription_journey_type === 'cas') {
    res.redirect('/emergency-prescription-wizard/service/cas/cas-complete');
  }
});
