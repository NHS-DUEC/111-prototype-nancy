var express = require('express')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Book callback - July 2018 +++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/', function(req, res) {
  // zero out a namespaced session obj
  req.session.callBooking = {};
  req.session.callBooking.name = '';
  req.session.callBooking.dob = {};
  req.session.callBooking.postcode = '';
  req.session.callBooking.tel = '';
  req.session.callBooking.backUrl = req.query.backUrl;
  req.session.callBooking.forwardUrl = req.query.forwardUrl;
  res.redirect('book-call-number');
});

router.post('/book-call-number', function(req, res) {
  if (req.body['tel'] === '') {
    res.render('book-callback/book-call-number.html', {
      error: {
        general: '<a href="#tel">We need a valid number to call</a>',
        tel: 'Enter a valid number'
      }
    });
  } else {
    req.session.callBooking.tel = req.body['tel'];
    res.redirect('book-call-demographics');
  }
});

router.post('/book-call-demographics', function(req, res) {
  req.session.callBooking.name = req.body['name'];
  req.session.callBooking.dob.day = req.body['dob-day'];
  req.session.callBooking.dob.month = req.body['dob-month'];
  req.session.callBooking.dob.year = req.body['dob-year'];
  req.session.callBooking.postcode = req.body['postcode'];
  res.redirect('book-call-check-your-answers');
});
