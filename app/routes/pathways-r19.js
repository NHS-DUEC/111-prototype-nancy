var express = require('express')
var request = require('request')
var router = express.Router()

module.exports = router

router.get('/start', function (req, res) {
  if (!req.session.userJourney) {
    req.session.userJourney = {}
    req.session.userJourney.journey = 'r19';
    req.session.userJourney.route = '';
    req.session.userJourney.linkedTemplate = 'pathways-r19/guided-covid.html'; // this won't change
  }
  res.render('pathways-r19/start.html');
});

router.get('/covid-start', function (req, res) {
  if (!req.session.userJourney.route !== 'linked') {
    req.session.userJourney.route = 'linked';
  }
  res.render('pathways-r19/covid-start.html');
});

// grouped pathways are rendered under /start - see finding-pathways.js
// so catch the post here:
router.post('/choose-pathway', function (req, res) {
  if (req.body['answer'] === '8') {
    req.session.userJourney.route = ''
    res.redirect('/pathways-r19/guided-covid-negate-explainer');
  } else {
    res.redirect('/pathways-r19/weird-questions-covid');
  }
});
