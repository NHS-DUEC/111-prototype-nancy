var express = require('express')
var fs = require('fs')
var path = require('path')
var router = express.Router()

module.exports = router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Creating journeys from files - August 2018 ++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

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

// Part 1: check the question ++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/check-question', function(req, res) {
  res.render('triage-end-phase/check-answer.html');
});
router.post('/check-question', function(req, res) {
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
});

// Revisit the question
router.get('/revisit-question', function(req, res) {
  res.render('triage-end-phase/rerender-question.html', {
    backUrl : '/user-journeys/check-question',
    question : req.session.userJourney.question.question,
    help : req.session.userJourney.question.help,
    answers : req.session.userJourney.question.answers,
    userAnswer : req.session.userJourney.question.userAnswer,
    answerHighlight : req.session.userJourney.messages.answerHighlight
  });
});

// Part 2: offer or force revalidation +++++++++++++++++++++++++++++++++++++++++

// Part 3: offer services ++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/primary-offering', function(req, res) {
  res.render('triage-end-phase/primary-service.html', {
    callToAction : req.session.userJourney.messages.callToAction,
    callToActionLevel : req.session.userJourney.messages.callToActionLevel,
    preamble : req.session.userJourney.services.preamble,
    name : req.session.userJourney.services.primary.name,
    important : req.session.userJourney.services.primary.important,
    postscript : req.session.userJourney.services.primary.postscript,
    address : req.session.userJourney.services.primary.address,
    openingTimes : req.session.userJourney.services.primary.openingTimes,
    distance : req.session.userJourney.services.primary.distance,
    lat : req.session.userJourney.services.primary.lat,
    long : req.session.userJourney.services.primary.long,
    careAdvice : req.session.userJourney.careAdvice
  });
});

/* Unused as yet
router.get('/further-offering', function(req, res) {
  res.render('triage-end-phase/further-services.html', {
    physical : req.session.userJourney.services.furtherServices.physical,
    nonphysical : req.session.userJourney.services.furtherServices.nonphysical,
    mapCenter : req.session.userJourney.services.furtherServices.mapCenter
  });
});
*/
