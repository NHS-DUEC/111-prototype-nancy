var express = require('express')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Offer a callback as a choice - July 2018 ++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Journey #1 - comparison
router.get('/comparison', function(req, res) {
  res.render('callback-offered/question-replayed.html', {
    journey: 'comparison'
  });
});

router.post('/comparison', function(req, res) {
  if (req.body['revisitQuestion'] === 'yes') {
    res.redirect('question');
  } else {
    res.redirect('choose-service');
  }
});


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Journey #2 - linear y/n
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
    res.send('booking process');
  } else {
    res.send('display service options');
  }
});
