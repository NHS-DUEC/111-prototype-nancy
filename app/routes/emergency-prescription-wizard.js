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
    res.redirect('get-help-from-a-pharmacist')
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
    res.redirect('get-help-from-a-pharmacist')
  } else if (req.body['controlled-meds'] === 'unknown') {
    res.redirect('get-help-from-a-pharmacist')
  } else {
    res.render('emergency-prescription-wizard/controlled-meds-reiterate.html', {
      error : true
    });
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
