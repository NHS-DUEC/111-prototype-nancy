var express = require('express')
var moment = require('moment-timezone')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Offer a callback as a choice - July 2018 ++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// linear y/n
router.get('/linear', function(req, res) {
  res.render('callback-offered/question-replayed.html', {
    journey: 'linear'
  });
});

router.post('/linear', function(req, res) {
  if (req.body['revisitQuestion'] === 'yes') {
    res.redirect('question');
  } else {
    res.redirect('offer-callback');
  }
});

router.post('/offer-callback', function(req, res) {
  if (req.body['bookCall'] === 'yes') {
    res.redirect('/book-callback/?backUrl=%2Fcallback-offered%2Foffer-callback&forwardUrl=%2Fcallback-offered%2Fcall-booked');
  } else {
    res.redirect('/user-journeys/primary-offering');
  }
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/call-booked', function(req, res) {
  // what's the time?
  var now = moment().tz('Europe/London').format('h.mma');
  res.render('callback-offered/call-booked.html', {
    now : now
  });
});
