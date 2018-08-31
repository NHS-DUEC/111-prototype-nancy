var express = require('express')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Book callback - July 2018 +++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/', function(req, res) {
  // zero out a namespaced session obj
  req.session.callBooking = {};
  req.session.callBooking.who = '';
  req.session.callBooking.name = {};
  req.session.callBooking.name.firstname = '';
  req.session.callBooking.name.secondname = '';
  req.session.callBooking.homePostcode = 'SE1 6LH'; // dummy hardcoded
  req.session.callBooking.tel = '';
  req.session.callBooking.backUrl = req.query.backUrl;
  req.session.callBooking.forwardUrl = req.query.forwardUrl;
  res.redirect('/book-callback/book-call-number');
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
    res.redirect('book-call-you-or-someone-else');
  }
});

router.post('/', function(req, res) {
  // zero out a namespaced session obj
  req.session.callBooking = {};
  req.session.callBooking.who = '';
  req.session.callBooking.name = {};
  req.session.callBooking.name.firstname = '';
  req.session.callBooking.name.secondname = '';
  req.session.callBooking.homePostcode = 'SE1 6LH'; // dummy hardcoded
  req.session.callBooking.tel = '';
  req.session.callBooking.backUrl = req.body['backUrl'];
  req.session.callBooking.forwardUrl = req.body['forwardUrl'];
  req.session.callBooking.renderTemplate = req.body['renderTemplate'];
  if (req.body['tel'] === '') {
    res.render(req.session.callBooking.renderTemplate, {
      error: {
        general: '<a href="#tel">We need a valid number to call</a>',
        tel: 'Enter a valid number'
      }
    });
  } else {
    req.session.callBooking.tel = req.body['tel'];
    res.redirect('/book-callback/book-call-you-or-someone-else');
  }
});

router.post('/book-call-you-or-someone-else', function(req, res) {
  req.session.callBooking.who = req.body['who'];
  res.redirect('/book-callback/book-call-name');
});

router.post('/book-call-name', function(req, res) {
  req.session.callBooking.name.firstname = req.body['firstname'];
  req.session.callBooking.name.secondname = req.body['secondname'];
  res.redirect('/book-callback/book-call-confirm-address');
});

router.post('/book-call-confirm-address', function(req, res) {
  var url = '/book-callback/book-call-check-your-answers';
  if (req.body['home-address'] === 'yes') {
    if (typeof req.session.addressPostcode !== 'undefined') {
      req.session.callBooking.homePostcode = req.session.addressPostcode;
    }
  } else {
    url = '/book-callback/book-call-get-postcode';
  }
  res.redirect(url);
});

router.post('/book-call-get-postcode', function(req, res) {
  if (req.body['postcode'] !== '') {
    req.session.callBooking.homePostcode = req.body['postcode'];
  } else {
    req.session.callBooking.homePostcode = '';
  }
  res.redirect('/book-callback/book-call-check-your-answers');
});
