var express = require('express')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Book callback - July 2018 +++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

/*router.get('/', function(req, res) {
  // zero out a namespaced session obj
  req.session.callBooking = {};
  req.session.callBooking.name = '';
  req.session.callBooking.postcode = '';
  req.session.callBooking.tel = '';
  req.session.callBooking.backUrl = req.query.backUrl;
  req.session.callBooking.forwardUrl = req.query.forwardUrl;
  res.redirect('book-call-number');
});*/

router.post('/', function(req, res) {
  // zero out a namespaced session obj
  req.session.callBooking = {};
  req.session.callBooking.name = '';
  req.session.callBooking.postcode = '';
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
    res.redirect('book-call-demographics');
  }
});

router.post('/book-call-demographics', function(req, res) {
  req.session.callBooking.name = req.body['name'];
  req.session.callBooking.postcode = req.body['postcode'];
  if (req.body['dob-day']) {
    req.session.demographics.dob.day = req.body['dob-day'];
    req.session.demographics.dob.month = req.body['dob-month'];
    req.session.demographics.dob.year = req.body['dob-year'];
  }
  res.redirect('book-call-check-your-answers');
});
