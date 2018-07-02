var express = require('express')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Book a call - June 2018 +++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// "lead with callback" scenario
router.get('/disposition-callback-first-001', function(req, res) {
  if (!req.session.callBooking) {
    // zero out a namespaced session obj
    req.session.callBooking = {};
    req.session.callBooking.scenario = 'callback-first';
    req.session.callBooking.name = '';
    req.session.callBooking.dob = {};
    req.session.callBooking.postcode = '';
    req.session.callBooking.tel = '';
  }
  res.render('999-disposition/disposition-callback-first-001.html');
});

router.post('/disposition-callback-first-001', function(req, res) {
  if (req.body['revisitQuestion'] === 'yes') {
    if (req.session.disposition) {
      req.session.disposition.revisiting = true;
      res.redirect('/questions/' + req.session.disposition.number);
    } else {
      res.redirect('question');
    }
  } else {
    res.redirect('disposition-callback-first-002');
  }
});

// "lead with 999" scenario
router.get('/disposition', function(req, res) {
  if (!req.session.callBooking) {
    // zero out a namespaced session obj
    req.session.callBooking = {};
    req.session.callBooking.scenario = '999-first';
    req.session.callBooking.name = '';
    req.session.callBooking.dob = {};
    req.session.callBooking.postcode = '';
    req.session.callBooking.tel = '';
  }
  res.render('999-disposition/disposition.html');
});

router.post('/book-call-demographics', function(req, res) {
  req.session.callBooking.name = req.body['name'];
  req.session.callBooking.dob.day = req.body['dob-day'];
  req.session.callBooking.dob.month = req.body['dob-month'];
  req.session.callBooking.dob.year = req.body['dob-year'];
  req.session.callBooking.postcode = req.body['postcode'];
  res.redirect('book-call-number');
});

router.post('/book-call-number', function(req, res) {
  if (req.body['tel'] === '') {
    res.render('999-disposition/book-call-number', {
      error: {
        general: '<a href="#tel">We need a valid number to call</a>',
        tel: 'Enter a valid number'
      }
    });
  } else {
    req.session.callBooking.tel = req.body['tel'];
    res.redirect('book-call-check-your-answers');
  }
});

router.get('/call-booked', function(req, res) {
  // zero out the namespaced session obj
  req.session.callBooking = {};
  res.render('999-disposition/call-booked');
});
