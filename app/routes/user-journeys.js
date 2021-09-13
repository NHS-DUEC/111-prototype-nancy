var express = require('express')
var fs = require('fs')
var path = require('path')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Creating journeys from files - August 2018 ++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/scenario-000-999', function(req, res) {
  // zero out a namespaced session obj
  req.session.userJourney = {};
  raw = fs.readFileSync('./data/user-journeys/scenario-000-999.json');
  journeyModel = JSON.parse(raw);
  req.session.userJourney = journeyModel
  res.redirect('/start');
});

router.get('/scenario-001-ed', function(req, res) {
  // zero out a namespaced session obj
  req.session.userJourney = {};
  raw = fs.readFileSync('./data/user-journeys/scenario-001-ed.json');
  journeyModel = JSON.parse(raw);
  req.session.userJourney = journeyModel
  res.redirect('/start');
});

router.get('/scenario-002-sexual-assault', function(req, res) {
  // zero out a namespaced session obj
  req.session.userJourney = {};
  raw = fs.readFileSync('./data/user-journeys/scenario-002-sexual-assault.json');
  journeyModel = JSON.parse(raw);
  req.session.userJourney = journeyModel
  res.redirect('check-question');
});

router.get('/scenario-003-primary-care', function(req, res) {
  // zero out a namespaced session obj
  req.session.userJourney = {};
  /*raw = fs.readFileSync('./data/user-journeys/scenario-001-ed.json');
  journeyModel = JSON.parse(raw);
  req.session.userJourney = journeyModel*/
  res.redirect('/start');
});

// Part 1: check the question ++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/check-question', function(req, res) {
  res.render('triage-end-phase/check-answer.html');
});
router.post('/check-question', function(req, res) {
  if (req.body['revisitQuestion']) {
    if (req.body['revisitQuestion'] === 'yes') {
      // rerender question
      res.redirect('/user-journeys/revisit-question');
    } else {
      // go to revalidation?
      if (req.session.userJourney.revalidation.offered === true) {
        if (req.session.userJourney.revalidation.type !== 'mandatory') {
          res.redirect('/callback-offered/offer-callback');
        } else {
          res.redirect('/forced-callback/call-booking-start');
        }
      } else {
        var target = '/user-journeys/primary-offering';
        // special case dispos
        if (req.session.userJourney.dx === 'dx94') {
          target = '/disposition/sexual-assault'
        }
        res.redirect(target);
      }
    }
  } else {
    res.render('triage-end-phase/check-answer.html', {
      error : true
    });
  }
});

// Revisit the question
router.get('/revisit-question', function(req, res) {
  res.render('triage-end-phase/rerender-question.html', {
    backUrl : '/user-journeys/check-question'
  });
});

// Part 3: offer services ++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/primary-offering', function(req, res) {
  res.render('service-display/ed-recommended-service.html');
});
