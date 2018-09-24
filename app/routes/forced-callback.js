var express = require('express')
var moment = require('moment-timezone')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Book a call - June 2018 +++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// "lead with callback" scenario
router.post('/disposition-callback-first-001', function(req, res) {
  if (req.body['revisitQuestion'] === 'yes') {
    if (req.session.disposition) {
      req.session.disposition.revisiting = true;
      res.redirect('/questions/' + req.session.disposition.number);
    } else {
      res.redirect('question');
    }
  } else {
    res.redirect('./call-booking-start');
  }
});

router.get('/call-booked', function(req, res) {
  // what's the time?
  var now = moment().tz('Europe/London').format('h.mma');
  res.render('forced-callback/call-booked.html', {
    now : now
  });
});
